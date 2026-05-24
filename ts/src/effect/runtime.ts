import { signal } from "@preact/signals-core";
import type { Signal } from "@preact/signals-core";
import { CommandDispatcher, CommandRegistry, type Disposable } from "../commands";
import type { TuvrenEvent } from "../events";
import { KeymapRegistry } from "../keymap";
import type { Tuvren } from "../app";
import {
	createCommandService,
	type DispatchingEffectCommandService,
} from "./advanced";

export interface TerminalSizeState {
	width: number;
	height: number;
}

export interface KeyboardListenerOptions {
	when?: (event: TuvrenEvent) => boolean;
}

interface KeyboardListenerEntry {
	handler: (event: TuvrenEvent) => void;
	when?: (event: TuvrenEvent) => boolean;
}

export interface TuvrenEffectRuntime {
	readonly app: Tuvren;
	readonly commands: CommandRegistry;
	readonly keymaps: KeymapRegistry;
	readonly dispatcher: CommandDispatcher;
	readonly commandService: DispatchingEffectCommandService;
	readonly terminalSize: Signal<TerminalSizeState>;
	addKeyboardListener(
		handler: (event: TuvrenEvent) => void,
		options?: KeyboardListenerOptions,
	): Disposable;
	notifyEvent(event: TuvrenEvent): void;
	stop(): void;
}

export const EFFECT_RUNTIME_CONTEXT = Symbol("tuvren.effect.runtime");

export function createEffectRuntime(app: Tuvren): TuvrenEffectRuntime {
	const commands = new CommandRegistry();
	const keymaps = new KeymapRegistry();
	const dispatcher = new CommandDispatcher(commands, keymaps, app);
	const commandService = createCommandService({
		registry: commands,
		dispatcher,
	});
	const terminalSize = signal(app.getTerminalSize());
	const keyboardListeners: KeyboardListenerEntry[] = [];

	return {
		app,
		commands,
		keymaps,
		dispatcher,
		commandService,
		terminalSize,
		addKeyboardListener: (
			handler: (event: TuvrenEvent) => void,
			options: KeyboardListenerOptions = {},
		) => {
			const entry: KeyboardListenerEntry = {
				handler,
				when: options.when,
			};
			keyboardListeners.push(entry);
			let disposed = false;
			return {
				dispose: () => {
					if (disposed) {
						return;
					}
					disposed = true;
					const index = keyboardListeners.indexOf(entry);
					if (index >= 0) {
						keyboardListeners.splice(index, 1);
					}
				},
			};
		},
		notifyEvent: (event: TuvrenEvent) => {
			if (event.type === "resize" && event.width != null && event.height != null) {
				terminalSize.value = {
					width: event.width,
					height: event.height,
				};
			}

			if (event.type !== "key") {
				return;
			}

			for (const listener of keyboardListeners) {
				if (listener.when != null && !listener.when(event)) {
					continue;
				}
				listener.handler(event);
			}
		},
		stop: () => {
			app.stop();
		},
	};
}
