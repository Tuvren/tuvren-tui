/**
 * Plugin Slots and Extensibility — ratified pre-GA contribution contract (Epic T, ADR-T46).
 *
 * This file defines the runtime source-of-truth for bounded extension
 * contribution points. Plugin APIs are pre-GA and may break before v1.0.
 *
 * Supported contribution types:
 *   - commands   → registered into the shared CommandRegistry
 *   - keymaps    → registered into the shared KeymapRegistry
 *   - palette    → palette-visible command metadata (title overrides)
 *   - devtools   → devtools panel metadata
 *   - themes     → theme preset metadata
 *   - examples   → showcase/example metadata
 *
 * Lifecycle hooks:
 *   - activate(context)   → extension contributes resources
 *   - deactivate()?      → extension cleans up (optional)
 *
 * Invariants:
 *   - Extensions never receive private native structures.
 *   - Extensions cannot own Widget mutable state.
 *   - Activation failures are isolated to the failing extension ID.
 *   - Deactivation disposes all contributed resources tracked through the context.
 */

import type { CommandRegistry } from "./commands";
import type { KeymapRegistry } from "./keymap";
import type { Disposable } from "./commands";

/** @pre-GA — Plugin APIs may break before v1.0 (ADR-T46). */
export interface ContributionRegistration<T> {
	register(contribution: T): Disposable;
	list(): T[];
}

/** @pre-GA — Palette-visible command metadata; title overrides display text. */
export interface PaletteContribution {
	command: string;
	title?: string;
}

/** @pre-GA — Devtools panel metadata. */
export interface DevtoolsContribution {
	id: string;
	title: string;
}

/** @pre-GA — Theme preset metadata. */
export interface ThemeContribution {
	id: string;
	title: string;
}

/** @pre-GA — Showcase/example metadata. */
export interface ExampleContribution {
	id: string;
	title: string;
}

/**
 * An extension that contributes framework-level services.
 * @pre-GA — Plugin APIs may break before v1.0.
 */
export interface Extension {
	id: string;
	activate(context: ExtensionContext): void | Promise<void>;
	deactivate?(): void | Promise<void>;
}

/**
 * Bounded context passed to an extension's activate() method.
 * @pre-GA — Plugin APIs may break before v1.0.
 */
export interface ExtensionContext {
	/** Full CommandRegistry — extensions may register and execute commands. */
	readonly commands: CommandRegistry;
	/** Bounded keymap surface — setRegistry is withheld (host-layer wiring). */
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

// ── Internal helpers ─────────────────────────────────────────────────────────

import { TuvrenError } from "./errors";
import type { TuvrenEvent } from "./events";
import { CommandRegistry } from "./commands";
import { KeymapRegistry } from "./keymap";

/** Wrap a register function so returned disposables are tracked for cleanup. */
function trap<A extends unknown[]>(
	f: (...args: A) => Disposable,
	self: unknown,
	tracked: Disposable[],
): (...args: A) => Disposable {
	return (...args: A) => {
		const d = f.apply(self, args) as Disposable;
		tracked.push(d);
		return d;
	};
}

/** Build a validator that rejects empty or non-string values. */
function vcheck(msg: string): (v: unknown) => void {
	return (v: unknown) => {
		if (typeof v !== "string" || v.trim() === "") throw new TuvrenError(msg, -1);
	};
}

// ── ContributionRegistry ─────────────────────────────────────────────────────

/** @pre-GA — Generic in-memory contribution registry. */
export class ContributionRegistry<T> implements ContributionRegistration<T> {
	private readonly _items: T[] = [];

	register(c: T): Disposable {
		this._items.push(c);
		let gone = false;
		return {
			dispose: () => {
				if (gone) return;
				gone = true;
				const i = this._items.indexOf(c);
				if (i !== -1) this._items.splice(i, 1);
			},
		};
	}

	list(): T[] {
		return this._items.slice();
	}
}

// ── ExtensionRegistry ────────────────────────────────────────────────────────

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
	private readonly _actv = new Map<
		string,
		{ ext: Extension; deps: Disposable[]; ctx: ExtensionContext }
	>();
	private readonly _diag = new Map<string, ExtensionDiagnostic>();
	private readonly _actInflight = new Map<string, Promise<boolean>>();
	private readonly _deactInflight = new Map<string, Promise<boolean>>();

	/**
	 * Register an extension. Returns a Disposable that deactivates (if active)
	 * and removes the extension from the registry.
	 */
	register(ext: Extension): Disposable {
		if (typeof ext.id !== "string" || ext.id.trim() === "") {
			throw new TuvrenError("Extension id must be a non-empty string", -1);
		}
		if (this._exts.has(ext.id)) {
			throw new TuvrenError(`Duplicate extension id: "${ext.id}"`, -1);
		}
		this._exts.set(ext.id, ext);
		this._diag.set(ext.id, { id: ext.id, status: "inactive" });
		let gone = false;
		const s = this;
		return {
			dispose() {
				if (gone) return;
				gone = true;
				if (s._actv.has(ext.id)) {
					s.deactivate(ext.id).catch(() => {});
				}
				s._exts.delete(ext.id);
				s._diag.delete(ext.id);
			},
		};
	}

	/**
	 * Activate a registered extension by id.
	 * Returns true on success, false if unknown, already active, or activation failed.
	 * Concurrent calls for the same id are serialized and return the same promise.
	 */
	async activate(id: string): Promise<boolean> {
		const inflight = this._actInflight.get(id);
		if (inflight !== undefined) return inflight;
		const op = this._activateInner(id);
		this._actInflight.set(id, op);
		try {
			return await op;
		} finally {
			this._actInflight.delete(id);
		}
	}

	private async _activateInner(id: string): Promise<boolean> {
		const deactOp = this._deactInflight.get(id);
		if (deactOp !== undefined) await deactOp;
		if (this._actv.has(id)) return false;
		const ext = this._exts.get(id);
		if (!ext) return false;

		const deps: Disposable[] = [];
		const subs: Disposable[] = [];
		const ctx: ExtensionContext = {
			commands: {
				register: trap(this.commands.register, this.commands, deps),
				execute: (id_, c) => this.commands.execute(id_, c),
				get: (id_) => this.commands.get(id_),
				list: () => this.commands.list(),
			},
			keymaps: {
				register: trap(this.keymaps.register, this.keymaps, deps),
				resolve: (e: TuvrenEvent, c) => this.keymaps.resolve(e, c),
			},
			palette: {
				register: (c: PaletteContribution) => {
					vcheck("Palette command must be a non-empty string")(c.command);
					return trap(this._p.register, this._p, deps)(c);
				},
				list: () => this._p.list(),
			},
			devtools: {
				register: (c: DevtoolsContribution) => {
					vcheck("Devtools id must be a non-empty string")(c.id);
					vcheck("Devtools title must be a non-empty string")(c.title);
					return trap(this._d.register, this._d, deps)(c);
				},
				list: () => this._d.list(),
			},
			themes: {
				register: (c: ThemeContribution) => {
					vcheck("Theme id must be a non-empty string")(c.id);
					vcheck("Theme title must be a non-empty string")(c.title);
					return trap(this._t.register, this._t, deps)(c);
				},
				list: () => this._t.list(),
			},
			examples: {
				register: (c: ExampleContribution) => {
					vcheck("Example id must be a non-empty string")(c.id);
					vcheck("Example title must be a non-empty string")(c.title);
					return trap(this._e.register, this._e, deps)(c);
				},
				list: () => this._e.list(),
			},
			subscriptions: subs,
		};

		try {
			await ext.activate(ctx);
			if (!this._exts.has(id)) {
				for (const d of deps) try { d.dispose(); } catch { /* best-effort */ }
				for (const s of subs) try { s.dispose(); } catch { /* best-effort */ }
				return false;
			}
			this._actv.set(id, { ext, deps, ctx });
			this._diag.set(id, { id, status: "active" });
			return true;
		} catch (e: unknown) {
			for (const d of deps) try { d.dispose(); } catch { /* best-effort */ }
			for (const s of subs) try { s.dispose(); } catch { /* best-effort */ }
			this._diag.set(id, {
				id,
				status: "activation-failed",
				error: e instanceof Error ? e.message : String(e),
			});
			return false;
		}
	}

	/**
	 * Deactivate an active extension by id.
	 * Returns true if the extension was active and is now deactivated,
	 * false if unknown or not active.
	 * Concurrent calls for the same id are serialized and return the same promise.
	 */
	async deactivate(id: string): Promise<boolean> {
		const inflight = this._deactInflight.get(id);
		if (inflight !== undefined) return inflight;
		const op = this._deactivateInner(id);
		this._deactInflight.set(id, op);
		try {
			return await op;
		} finally {
			this._deactInflight.delete(id);
		}
	}

	private async _deactivateInner(id: string): Promise<boolean> {
		const actOp = this._actInflight.get(id);
		if (actOp !== undefined) await actOp;
		const a = this._actv.get(id);
		if (!a) return false;

		if (a.ext.deactivate) {
			try {
				await a.ext.deactivate();
			} catch (e: unknown) {
				if (this._exts.has(id)) {
					this._diag.set(id, {
						id,
						status: "deactivation-failed",
						error: e instanceof Error ? e.message : String(e),
					});
				}
			}
		}
		for (const d of [...a.deps, ...a.ctx.subscriptions]) {
			try { d.dispose(); } catch { /* best-effort */ }
		}
		this._actv.delete(id);
		if (this._diag.get(id)?.status === "active") {
			this._diag.set(id, { id, status: "inactive" });
		}
		return true;
	}

	/** Return all registered extensions. */
	list(): Extension[] {
		return [...this._exts.values()];
	}

	/** Check whether an extension is currently active. */
	isActive(id: string): boolean {
		return this._actv.has(id);
	}

	/** Look up a registered extension by id. */
	getExtension(id: string): Extension | undefined {
		return this._exts.get(id);
	}

	/** Return a shallow copy of all diagnostics. */
	getDiagnostics(): ExtensionDiagnostic[] {
		return [...this._diag.values()].map((d) => ({ ...d }));
	}
}
