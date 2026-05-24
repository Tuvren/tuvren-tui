import { signal } from "@preact/signals-core";
import type { ReadonlySignal, Signal } from "@preact/signals-core";
import type { Command } from "../commands";
import type { TuvrenEvent } from "../events";
import type { KeyBinding } from "../keymap";
import {
	readComponentContext,
	useComponentConst,
	useComponentEffect,
} from "../jsx/component-runtime";
import {
	EFFECT_RUNTIME_CONTEXT,
	type KeyboardListenerOptions,
	type TerminalSizeState,
	type TuvrenEffectRuntime,
} from "./runtime";
import type { DispatchingEffectCommandService } from "./advanced";

export function useTuvren(): TuvrenEffectRuntime {
	return readComponentContext<TuvrenEffectRuntime>(
		EFFECT_RUNTIME_CONTEXT,
		"useTuvren",
	);
}

export function useCommands(): DispatchingEffectCommandService {
	return useTuvren().commandService;
}

export function useCommand(command: Command): void {
	const runtime = useTuvren();
	useComponentEffect(() => runtime.commands.register(command).dispose, [runtime, command]);
}

export function useKeybinding(binding: KeyBinding): void {
	const runtime = useTuvren();
	useComponentEffect(() => runtime.keymaps.register(binding).dispose, [runtime, binding]);
}

export function useKeyboard(
	handler: (event: TuvrenEvent) => void,
	options: KeyboardListenerOptions = {},
): void {
	const runtime = useTuvren();
	const when = options.when;
	useComponentEffect(
		() => runtime.addKeyboardListener(handler, { when }).dispose,
		[runtime, handler, when],
	);
}

export function useTerminalSize(): ReadonlySignal<TerminalSizeState> {
	return useTuvren().terminalSize;
}

export function useSignal<T>(initialValue: T): Signal<T> {
	return useComponentConst(() => signal(initialValue));
}
