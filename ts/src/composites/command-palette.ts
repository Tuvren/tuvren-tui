/**
 * CommandPalette — Host composite over Overlay + Input + List.
 *
 * Accepts either a CommandRegistry (preferred, Epic R) or a static array of
 * Command objects for cases where a full registry is not yet wired.
 *
 * When a CommandRegistry is provided, command execution goes through the
 * registry so dispatch logic is not duplicated in application code.
 */

import { ffi } from "../ffi";
import { NodeType } from "../ffi/structs";
import { checkResult } from "../errors";
import { Widget } from "../widget";
import { Overlay } from "../widgets/overlay";
import { Input } from "../widgets/input";
import { List } from "../widgets/list";
import { Box } from "../widgets/box";
import { Buffer } from "buffer";
import type { Command, CommandContext, CommandRegistry } from "../commands";
import type { Tuvren } from "../app";

export type { Command };

export interface CommandPaletteOptions {
	/** Preferred: a CommandRegistry whose list() drives the palette display. */
	registry?: CommandRegistry;
	/**
	 * Static command array. Used when no registry is provided.
	 * Accepts Command objects (title + run) for forward-compatibility.
	 */
	commands?: Command[];
	/** Tuvren app instance, required for registry-backed execute with full context. */
	app?: Tuvren;
	width?: string | number;
	height?: string | number;
	fg?: string | number;
	bg?: string | number;
}

export class CommandPalette {
	private overlay: Overlay;
	private container: Box;
	private input: Input;
	private list: List;
	private _registry?: CommandRegistry;
	private _staticCommands: Command[] = [];
	private _app?: Tuvren;
	private filteredCommands: Command[] = [];
	private restoreFocusHandle = 0;
	private wasOpen = false;

	constructor(options: CommandPaletteOptions = {}) {
		this._registry = options.registry;
		this._staticCommands = options.commands ? [...options.commands] : [];
		this._app = options.app;

		this.overlay = new Overlay({
			modal: true,
			clearUnder: true,
			width: options.width ?? "60%",
			height: options.height ?? "50%",
			fg: options.fg,
			bg: options.bg,
			border: "rounded",
		});
		this.overlay.setDismissOnEscape(true);
		this.overlay.setPositionType("absolute");

		this.container = new Box({ width: "100%", height: "100%", bg: options.bg });
		this.container.setFlexDirection("column");

		this.input = new Input({ width: "100%", border: "single", fg: options.fg, bg: options.bg });
		this.list = new List({ width: "100%", height: "100%", fg: options.fg, bg: options.bg });

		this.container.append(this.input);
		this.container.append(this.list);
		this.overlay.append(this.container);
	}

	/** Get the root widget (Overlay) for attaching to the tree. */
	getWidget(): Widget {
		return this.overlay;
	}

	/** Replace the static command list (used when no registry is attached). */
	setCommands(commands: Command[]): void {
		this._staticCommands = [...commands];
		this.filteredCommands = [...this._sourceCommands()];
		this._syncListItems();
	}

	/** Replace or attach the registry. */
	setRegistry(registry: CommandRegistry): void {
		this._registry = registry;
		this.filteredCommands = [...this._sourceCommands()];
		this._syncListItems();
	}

	/** Open the palette. Clears filter, resets selection, and focuses input. */
	open(): void {
		if (!this.overlay.isOpen()) {
			this.restoreFocusHandle = ffi.tui_get_focused();
		}
		this.overlay.setOpen(true);
		this.wasOpen = true;
		this.filteredCommands = [...this._sourceCommands()];
		this._syncListItems();
		const encoded = new TextEncoder().encode("");
		checkResult(
			ffi.tui_set_content(this.input.handle, Buffer.from(encoded), 0),
		);
		this.input.focus();
	}

	/** Close the palette. */
	close(): void {
		if (this.overlay.isOpen()) {
			this.overlay.setOpen(false);
		}
		this._syncClosedState(false);
	}

	/** Check if the palette is currently open. */
	isOpen(): boolean {
		return this._syncClosedState(this.overlay.isOpen());
	}

	/**
	 * Read the current value of the embedded Input widget and apply it as
	 * the filter query.
	 */
	handleInput(): void {
		const query = this.input.getValue();
		this.applyFilter(query);
	}

	/** Return the current filter query string. */
	getQuery(): string {
		return this.input.getValue();
	}

	/** Return the embedded Input widget for focus/event wiring. */
	getInput(): Input {
		return this.input;
	}

	/**
	 * Apply a text filter to the command list (matches against `title`).
	 */
	applyFilter(query: string): void {
		const q = query.toLowerCase();
		const source = this._sourceCommands();
		if (q.length === 0) {
			this.filteredCommands = [...source];
		} else {
			this.filteredCommands = source.filter((cmd) =>
				cmd.title.toLowerCase().includes(q),
			);
		}
		this._syncListItems();
		if (this.filteredCommands.length > 0) {
			this.list.setSelected(0);
		}
	}

	/**
	 * Execute the currently selected command and close the palette.
	 * When a registry is attached, runs through registry.execute() so dispatch
	 * logic is not duplicated in application code.
	 * Returns true if a command was executed, false if no selection.
	 */
	async executeSelected(): Promise<boolean> {
		const idx = this.list.getSelected();
		if (idx < 0 || idx >= this.filteredCommands.length) return false;

		const cmd = this.filteredCommands[idx]!;
		this.close();

		if (this._registry) {
			const ctx: Partial<CommandContext> = {
				source: "palette",
				...(this._app ? { app: this._app } : {}),
			};
			await this._registry.execute(cmd.id, ctx);
		} else {
			// Static command path
			const ctx: CommandContext = {
				app: this._app!,
				source: "palette",
			};
			await cmd.run(ctx);
		}

		return true;
	}

	/** Move selection up in the filtered list. */
	selectPrevious(): void {
		const current = this.list.getSelected();
		if (current > 0) {
			this.list.setSelected(current - 1);
		}
	}

	/** Move selection down in the filtered list. */
	selectNext(): void {
		const current = this.list.getSelected();
		if (current < this.filteredCommands.length - 1) {
			this.list.setSelected(current + 1);
		}
	}

	/** Get the number of currently visible (filtered) commands. */
	getFilteredCount(): number {
		return this.filteredCommands.length;
	}

	private _sourceCommands(): Command[] {
		return this._registry ? this._registry.list() : this._staticCommands;
	}

	private _syncListItems(): void {
		this.list.clearItems();
		for (const cmd of this.filteredCommands) {
			this.list.addItem(cmd.title);
		}
		if (this.filteredCommands.length > 0) {
			this.list.setSelected(0);
		}
	}

	private _isEffectivelyVisible(handle: number): boolean {
		let current = handle;
		while (current !== 0) {
			if (ffi.tui_get_visible(current) !== 1) return false;
			if (
				ffi.tui_get_node_type(current) === NodeType.Overlay &&
				ffi.tui_overlay_get_open(current) !== 1
			) {
				return false;
			}
			current = ffi.tui_get_parent(current);
		}
		return true;
	}

	private _canRestoreFocus(handle: number): boolean {
		return handle !== 0 &&
			this._isEffectivelyVisible(handle) &&
			ffi.tui_is_focusable(handle) === 1;
	}

	private _syncClosedState(open: boolean): boolean {
		if (!open && this.wasOpen) {
			this.wasOpen = false;
			const restoreFocusHandle = this.restoreFocusHandle;
			this.restoreFocusHandle = 0;
			if (
				ffi.tui_get_focused() === 0 &&
				this._canRestoreFocus(restoreFocusHandle)
			) {
				checkResult(ffi.tui_focus(restoreFocusHandle));
			}
		}
		return open;
	}
}
