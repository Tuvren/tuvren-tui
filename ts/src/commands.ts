/**
 * Commands & Keymap Foundations — command registry and dispatcher (Epic R, ADR-T44).
 *
 * Host-side command registry over the existing event drain and imperative command
 * protocol. Commands live entirely in the Host Layer; the Native Core remains the
 * single mutable UI authority.
 */

import type { Tuvren } from "./app";
import type { TuvrenEvent } from "./events";
import type { KeymapRegistry } from "./keymap";
import { TuvrenError } from "./errors";
import { ffi } from "./ffi";
import { NodeType } from "./ffi/structs";

// Reverse mapping: NodeType numeric value → lowercase widget kind string
const NODE_KIND_NAMES: Record<number, string> = Object.fromEntries(
	Object.entries(NodeType).map(([name, id]) => [id, name.toLowerCase()]),
);

// ── Public types ──────────────────────────────────────────────────────────────

export interface WidgetRef {
	readonly handle: number;
	readonly kind?: string;
}

export interface Disposable {
	dispose(): void;
}

export type CommandSource = "keymap" | "palette" | "programmatic" | "plugin";

export interface CommandContext {
	/** App instance. Always present when dispatched through CommandDispatcher; may be absent in the static-array palette path. */
	app?: Tuvren;
	event?: TuvrenEvent;
	focused?: WidgetRef;
	source: CommandSource;
}

export type CommandPredicate = (context: CommandContext) => boolean;

export interface Command {
	id: string;
	title: string;
	/**
	 * Execute the command. When dispatched through CommandDispatcher, this is
	 * awaited inside the event-drain loop, so a slow async handler will stall
	 * input processing and rendering for its duration. Keep run() non-blocking:
	 * kick off async work and return, rather than awaiting long I/O inline.
	 */
	run(context: CommandContext): void | Promise<void>;
	category?: string;
	when?: CommandPredicate;
}

// ── CommandRegistry ───────────────────────────────────────────────────────────

export class CommandRegistry {
	private readonly _commands = new Map<string, Command>();

	/**
	 * Register a command. Throws TuvrenError on invalid or duplicate registration.
	 * Returns a Disposable that removes the command from the registry.
	 */
	register(command: Command): Disposable {
		if (typeof command.id !== "string" || command.id.trim() === "") {
			throw new TuvrenError("Command id must be a non-empty string", -1);
		}
		if (typeof command.title !== "string" || command.title.trim() === "") {
			throw new TuvrenError("Command title must be a non-empty string", -1);
		}
		if (typeof command.run !== "function") {
			throw new TuvrenError("Command run must be a function", -1);
		}
		if (this._commands.has(command.id)) {
			throw new TuvrenError(`Duplicate command id: "${command.id}"`, -1);
		}
		this._commands.set(command.id, command);
		let disposed = false;
		return {
			dispose: () => {
				if (disposed) return;
				disposed = true;
				this._commands.delete(command.id);
			},
		};
	}

	/**
	 * Execute a command by id with the provided context.
	 * Returns true if the command ran, false if not found or `when` predicate
	 * rejected it.
	 */
	async execute(id: string, context?: Partial<CommandContext>): Promise<boolean> {
		const cmd = this._commands.get(id);
		if (!cmd) return false;
		const ctx = (context ?? {}) as CommandContext;
		if (cmd.when && !cmd.when(ctx)) return false;
		await cmd.run(ctx);
		return true;
	}

	/** Look up a single command by id. O(1). */
	get(id: string): Command | undefined {
		return this._commands.get(id);
	}

	/** Return all currently registered commands. */
	list(): Command[] {
		return [...this._commands.values()];
	}
}

// ── CommandDispatcher ─────────────────────────────────────────────────────────

/**
 * Bridges the event drain, keymap resolver, and command registry into a single
 * dispatch step. Instantiate once per application and pass to RunOptions or
 * LoopOptions to wire automatic dispatch.
 *
 * Focus context is read from the Native Core via app.getFocused() at dispatch
 * time — the dispatcher does not maintain shadow focus state.
 */
export class CommandDispatcher {
	constructor(
		private readonly _commands: CommandRegistry,
		private readonly _keymaps: KeymapRegistry,
		private readonly _app: Tuvren,
	) {
		// Wire the registry into the keymap resolver so callers don't need to
		// call keymaps.setRegistry() separately — the two cannot drift.
		this._keymaps.setRegistry(_commands);
	}

	/**
	 * Attempt to dispatch a single event through the keymap resolver.
	 * Non-key events are silently ignored.
	 */
	async dispatch(event: TuvrenEvent): Promise<void> {
		if (event.type !== "key") return;

		const focusedHandle = this._app.getFocused();
		let focused: WidgetRef | undefined;
		if (focusedHandle > 0) {
			const nodeTypeId = ffi.tui_get_node_type(focusedHandle);
			focused = { handle: focusedHandle, kind: NODE_KIND_NAMES[nodeTypeId] };
		}
		const context: CommandContext = {
			app: this._app,
			event,
			focused,
			source: "keymap",
		};

		const command = this._keymaps.resolve(event, context);
		if (command) {
			// Run directly rather than through registry.execute() — the keymap
			// resolver already evaluated both the binding-level and command-level
			// `when` predicates. No return value is intentional: fire-and-forget
			// from the event loop's perspective.
			await command.run(context);
		}
	}
}
