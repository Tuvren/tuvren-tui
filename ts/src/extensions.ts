/**
 * Plugin Slots and Extensibility — extension registry and lifecycle API (Epic T, ADR-T46).
 * Plugin APIs are pre-GA and may break before v1.0.
 */
import { CommandRegistry } from "./commands";
import type { Command, CommandContext, Disposable } from "./commands";
import { KeymapRegistry } from "./keymap";
import type { KeyBinding } from "./keymap";
import type { TuvrenEvent } from "./events";
import { TuvrenError } from "./errors";

/** @pre-GA — Plugin APIs may break before v1.0 (ADR-T46). */
export interface ContributionRegistration<T> { register(c: T): Disposable; list(): T[]; }

/** @pre-GA — Plugin APIs may break before v1.0. Generic in-memory contribution registry. */
export class ContributionRegistry<T> implements ContributionRegistration<T> {
  private _: T[] = [];
  register(c: T): Disposable {
    this._.push(c); let g = false;
    return { dispose: () => { if (g) return; g = true; const i = this._.indexOf(c); if (i !== -1) this._.splice(i, 1); } };
  }
  list(): T[] { return this._.slice(); }
}

/** @pre-GA */
export interface PaletteContribution { command: string; title?: string; }
/** @pre-GA */
export interface DevtoolsContribution { id: string; title: string; }
/** @pre-GA */
export interface ThemeContribution { id: string; title: string; }
/** @pre-GA */
export interface ExampleContribution { id: string; title: string; }
/**
 * An extension that contributes framework-level services.
 * @pre-GA — Plugin APIs may break before v1.0.
 */
export interface Extension {
  id: string;
  activate(ctx: ExtensionContext): void | Promise<void>;
  deactivate?(): void | Promise<void>;
}
/**
 * Bounded context passed to an extension's activate() method.
 * @pre-GA — Plugin APIs may break before v1.0.
 */
export interface ExtensionContext {
  readonly commands: Pick<CommandRegistry, "register" | "execute" | "get" | "list">;
  readonly keymaps: Pick<KeymapRegistry, "register" | "resolve">;
  readonly palette: ContributionRegistration<PaletteContribution>;
  readonly devtools: ContributionRegistration<DevtoolsContribution>;
  readonly themes: ContributionRegistration<ThemeContribution>;
  readonly examples: ContributionRegistration<ExampleContribution>;
  readonly subscriptions: Disposable[];
}
/** @pre-GA — Per-extension diagnostic record. */
export interface ExtensionDiagnostic {
  id: string;
  status: "inactive" | "active" | "activation-failed" | "deactivation-failed";
  error?: string;
}

// Helpers: wrap register to auto-track disposables.
const trap = <A extends unknown[]>(f: (...args: A) => Disposable, self: unknown, t: Disposable[]) =>
  (...args: A) => { const d = f.apply(self, args) as Disposable; t.push(d); return d; };

// Validated wrapper: throws TuvrenError if validation fails before registering.
const vcheck = (msg: string) => (v: unknown) => {
  if (typeof v !== "string" || (v as string).trim() === "") throw new TuvrenError(msg, -1);
};

/**
 * Central registry for Tuvren extensions.
 * @pre-GA — Plugin APIs may break before v1.0 (ADR-T46).
 */
export class ExtensionRegistry {
  readonly commands = new CommandRegistry();
  readonly keymaps = new KeymapRegistry();
  private readonly _p = new ContributionRegistry<PaletteContribution>();
  private readonly _d = new ContributionRegistry<DevtoolsContribution>();
  private readonly _t = new ContributionRegistry<ThemeContribution>();
  private readonly _e = new ContributionRegistry<ExampleContribution>();
  readonly palette = this._p;
  readonly devtools = this._d;
  readonly themes = this._t;
  readonly examples = this._e;
  private readonly _exts = new Map<string, Extension>();
  private readonly _actv = new Map<string, { ext: Extension; deps: Disposable[]; ctx: ExtensionContext }>();
  private readonly _diag = new Map<string, ExtensionDiagnostic>();
  private readonly _actInflight = new Map<string, Promise<boolean>>();
  private readonly _deactInflight = new Map<string, Promise<boolean>>();

  register(ext: Extension): Disposable {
    if (typeof ext.id !== "string" || ext.id.trim() === "") throw new TuvrenError("Extension id must be a non-empty string", -1);
    if (this._exts.has(ext.id)) throw new TuvrenError(`Duplicate extension id: "${ext.id}"`, -1);
    this._exts.set(ext.id, ext);
    this._diag.set(ext.id, { id: ext.id, status: "inactive" });
    let g = false;
    const s = this;
    return { dispose() { if (g) return; g = true;
      // Fire-and-forget: Disposable.dispose() is contractually synchronous.
      // If deactivate runs async, the extension is removed from _exts/_diag
      // immediately while _actv may briefly still hold it until the promise settles.
      // Callers should check isActive() before re-registering.
      if (s._actv.has(ext.id)) s.deactivate(ext.id).catch(() => {});
      s._exts.delete(ext.id); s._diag.delete(ext.id); } };
  }

  async activate(id: string): Promise<boolean> {
    const inflight = this._actInflight.get(id);
    if (inflight !== undefined) return inflight;
    const op = this._activateInner(id);
    this._actInflight.set(id, op);
    try { return await op; } finally { this._actInflight.delete(id); }
  }

  private async _activateInner(id: string): Promise<boolean> {
    if (this._actv.has(id)) return false;
    const ext = this._exts.get(id);
    if (!ext) return false;
    const deps: Disposable[] = [];
    const subs: Disposable[] = [];
    const ctx: ExtensionContext = {
      commands: { register: trap(this.commands.register, this.commands, deps), execute: (id, c) => this.commands.execute(id, c), get: (id) => this.commands.get(id), list: () => this.commands.list() },
      // setRegistry is intentionally excluded — host-layer wiring, not extension surface.
      keymaps: { register: trap(this.keymaps.register, this.keymaps, deps), resolve: (e: TuvrenEvent, c: CommandContext) => this.keymaps.resolve(e, c) },
      palette:    { register: (c: PaletteContribution) => { vcheck("Palette command must be a non-empty string")(c.command); return trap(this._p.register, this._p, deps)(c); }, list: () => this._p.list() },
      devtools:   { register: (c: DevtoolsContribution) => { vcheck("Devtools id must be a non-empty string")(c.id); vcheck("Devtools title must be a non-empty string")(c.title); return trap(this._d.register, this._d, deps)(c); }, list: () => this._d.list() },
      themes:     { register: (c: ThemeContribution) => { vcheck("Theme id must be a non-empty string")(c.id); vcheck("Theme title must be a non-empty string")(c.title); return trap(this._t.register, this._t, deps)(c); }, list: () => this._t.list() },
      examples:   { register: (c: ExampleContribution) => { vcheck("Example id must be a non-empty string")(c.id); vcheck("Example title must be a non-empty string")(c.title); return trap(this._e.register, this._e, deps)(c); }, list: () => this._e.list() },
      subscriptions: subs,
    };
    try { await ext.activate(ctx); if (!this._exts.has(id)) { for (const d of deps) try { d.dispose(); } catch { /* best-effort */ } for (const s of subs) try { s.dispose(); } catch { /* best-effort */ } return false; } this._actv.set(id, { ext, deps, ctx }); this._diag.set(id, { id, status: "active" }); return true; }
    catch (e: unknown) {
      for (const d of deps) try { d.dispose(); } catch { /* best-effort */ }
      for (const s of subs) try { s.dispose(); } catch { /* best-effort */ }
      this._diag.set(id, { id, status: "activation-failed", error: e instanceof Error ? e.message : String(e) });
      return false;
    }
  }

  async deactivate(id: string): Promise<boolean> {
    const inflight = this._deactInflight.get(id);
    if (inflight !== undefined) return inflight;
    const op = this._deactivateInner(id);
    this._deactInflight.set(id, op);
    try { return await op; } finally { this._deactInflight.delete(id); }
  }

  private async _deactivateInner(id: string): Promise<boolean> {
    const a = this._actv.get(id);
    if (!a) return false;
    if (a.ext.deactivate) try { await a.ext.deactivate(); } catch (e: unknown) { this._diag.set(id, { id, status: "deactivation-failed", error: e instanceof Error ? e.message : String(e) }); }
    for (const d of [...a.deps, ...a.ctx.subscriptions]) try { d.dispose(); } catch { /* best-effort */ }
    this._actv.delete(id);
    if (this._diag.get(id)?.status === "active") this._diag.set(id, { id, status: "inactive" });
    return true;
  }

  list(): Extension[] { return [...this._exts.values()]; }
  isActive(id: string): boolean { return this._actv.has(id); }
  getExtension(id: string): Extension | undefined { return this._exts.get(id); }
  getDiagnostics(): ExtensionDiagnostic[] { return [...this._diag.values()].map((d) => ({ ...d })); }
}
