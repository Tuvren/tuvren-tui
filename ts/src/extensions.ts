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
