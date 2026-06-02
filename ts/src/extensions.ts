/**
 * Plugin Slots and Extensibility — extension registry and lifecycle API (Epic T, ADR-T46).
 * Plugin APIs are pre-GA and may break before v1.0.
 */
import { CommandRegistry } from "./commands";
import type { Command, CommandContext, Disposable } from "./commands";
import { KeymapRegistry } from "./keymap";
import { TuvrenError } from "./errors";

export interface ContributionRegistration<T> { register(c: T): Disposable; list(): T[]; }
export class ContributionRegistry<T> implements ContributionRegistration<T> {
  private _: T[] = [];
  register(c: T): Disposable {
    this._.push(c); let g = false;
    return { dispose: () => { if (g) return; g = true; const i = this._.indexOf(c); if (i !== -1) this._.splice(i, 1); } };
  }
  list(): T[] { return this._.slice(); }
}

export interface PaletteContribution { command: string; title?: string; }
export interface DevtoolsContribution { id: string; title: string; }
export interface ThemeContribution { id: string; title: string; }
export interface ExampleContribution { id: string; title: string; }
export interface Extension {
  id: string;
  activate(ctx: ExtensionContext): void | Promise<void>;
  deactivate?(): void | Promise<void>;
}
export interface ExtensionContext {
  readonly commands: CommandRegistry;
  readonly keymaps: KeymapRegistry;
  readonly palette: ContributionRegistration<PaletteContribution>;
  readonly devtools: ContributionRegistration<DevtoolsContribution>;
  readonly themes: ContributionRegistration<ThemeContribution>;
  readonly examples: ContributionRegistration<ExampleContribution>;
  readonly subscriptions: Disposable[];
}
export interface ExtensionDiagnostic {
  id: string;
  status: "inactive" | "active" | "activation-failed" | "deactivation-failed";
  error?: string;
}

// Helpers: wrap register to auto-track disposables.
const trap = (f: (...a: unknown[]) => Disposable, self: unknown, t: Disposable[]) =>
  (...a: unknown[]) => { const d = f.apply(self, a) as Disposable; t.push(d); return d; };

// Validated wrapper: throws TuvrenError if validation fails before registering.
const vcheck = (msg: string) => (v: unknown) => {
  if (typeof v !== "string" || (v as string).trim() === "") throw new TuvrenError(msg, -1);
};

export class ExtensionRegistry {
  readonly commands = new CommandRegistry();
  readonly keymaps = new KeymapRegistry();
  private readonly _p = new ContributionRegistry<PaletteContribution>();
  private readonly _d = new ContributionRegistry<DevtoolsContribution>();
  private readonly _t = new ContributionRegistry<ThemeContribution>();
  private readonly _e = new ContributionRegistry<ExampleContribution>();
  private readonly _exts = new Map<string, Extension>();
  private readonly _actv = new Map<string, { ext: Extension; deps: Disposable[]; ctx: ExtensionContext }>();
  private readonly _diag = new Map<string, ExtensionDiagnostic>();

  register(ext: Extension): Disposable {
    if (typeof ext.id !== "string" || ext.id.trim() === "") throw new TuvrenError("Extension id must be a non-empty string", -1);
    if (this._exts.has(ext.id)) throw new TuvrenError(`Duplicate extension id: "${ext.id}"`, -1);
    this._exts.set(ext.id, ext);
    this._diag.set(ext.id, { id: ext.id, status: "inactive" });
    let g = false;
    const s = this;
    return { dispose() { if (g) return; g = true; if (s._actv.has(ext.id)) s.deactivate(ext.id); s._exts.delete(ext.id); s._diag.delete(ext.id); } };
  }

  async activate(id: string): Promise<boolean> {
    if (this._actv.has(id)) return false;
    const ext = this._exts.get(id);
    if (!ext) return false;
    const deps: Disposable[] = [];
    const subs: Disposable[] = [];
    const ctx: ExtensionContext = {
      commands: { register: trap(this.commands.register, this.commands, deps), execute: (id, c) => this.commands.execute(id, c), get: (id) => this.commands.get(id), list: () => this.commands.list() },
      keymaps: { register: trap(this.keymaps.register, this.keymaps, deps), resolve: (e, c) => this.keymaps.resolve(e as Parameters<typeof this.keymaps.resolve>[0], c), setRegistry: (r) => this.keymaps.setRegistry(r) },
      palette:    { register: (c: PaletteContribution) => { vcheck("Palette command must be a non-empty string")(c.command); return trap(this._p.register, this._p, deps)(c); }, list: () => this._p.list() },
      devtools:   { register: (c: DevtoolsContribution) => { vcheck("Devtools id must be a non-empty string")(c.id); vcheck("Devtools title must be a non-empty string")(c.title); return trap(this._d.register, this._d, deps)(c); }, list: () => this._d.list() },
      themes:     { register: (c: ThemeContribution) => { vcheck("Theme id must be a non-empty string")(c.id); vcheck("Theme title must be a non-empty string")(c.title); return trap(this._t.register, this._t, deps)(c); }, list: () => this._t.list() },
      examples:   { register: (c: ExampleContribution) => { vcheck("Example id must be a non-empty string")(c.id); vcheck("Example title must be a non-empty string")(c.title); return trap(this._e.register, this._e, deps)(c); }, list: () => this._e.list() },
      subscriptions: subs,
    };
    try { await ext.activate(ctx); this._actv.set(id, { ext, deps, ctx }); this._diag.set(id, { id, status: "active" }); return true; }
    catch (e: unknown) { for (const d of deps) d.dispose(); for (const s of subs) try { s.dispose(); } catch { /* best-effort */ } this._diag.set(id, { id, status: "activation-failed", error: e instanceof Error ? e.message : String(e) }); return true; }
  }

  async deactivate(id: string): Promise<boolean> {
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
