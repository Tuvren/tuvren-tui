/**
 * Tuvren TUI — Effect Package
 *
 * Primary package-first authoring surface for Effect applications. Normal apps
 * can stay within this entrypoint for JSX authoring, package-owned commands and
 * keybindings, keyboard hooks, and lifecycle bootstrapping. Lower-level Effect
 * helpers remain available as advanced exports.
 */

export { render, testRender } from "./render";
export type {
	EffectRenderOptions,
	EffectTestHarness,
	EffectTestRenderOptions,
} from "./render";

export {
	Box,
	Text,
	Input,
	Select,
	ScrollBox,
	TextArea,
	Table,
	List,
	Tabs,
	Overlay,
	Transcript,
	SplitPane,
} from "./components";

export {
	useTuvren,
	useCommands,
	useCommand,
	useKeybinding,
	useKeyboard,
	useTerminalSize,
	useSignal,
} from "./hooks";

export type {
	KeyboardListenerOptions,
	TerminalSizeState,
	TuvrenEffectRuntime,
} from "./runtime";

export { jsx, jsxs, Fragment } from "./jsx-runtime";
export type { JSX } from "./jsx-runtime";
export { signal, computed, effect, batch } from "@preact/signals-core";
export type { Signal, ReadonlySignal } from "@preact/signals-core";

export type {
	VNode,
	Instance,
	ComponentFunction,
	BoxProps,
	TextProps,
	InputProps,
	SelectProps,
	ScrollBoxProps,
	TextAreaProps,
	TableProps,
	ListProps,
	TabsProps,
	OverlayProps,
	TranscriptProps,
	SplitPaneProps,
} from "../jsx/types";

export { Tuvren } from "../app";
export type { RunOptions, TerminalCapabilities, TerminalInfo } from "../app";
export { TuvrenError, checkResult } from "../errors";
export type { TuvrenEvent, TuvrenEventType } from "../events";
export { Theme, DARK_THEME, LIGHT_THEME } from "../theme";
export { EventType, KeyCode, Modifier, AccessibilityRole } from "../ffi/structs";

export { CommandRegistry, CommandDispatcher } from "../commands";
export type {
	Command,
	CommandContext,
	CommandPredicate,
	CommandSource,
	Disposable,
	WidgetRef,
} from "../commands";
export { KeymapRegistry } from "../keymap";
export type { KeyBinding } from "../keymap";

// Plugin Slots and Extensibility (Epic T, ADR-T46)
export type {
	Extension,
	ExtensionContext,
	ExtensionDiagnostic,
	ContributionRegistration,
	PaletteContribution,
	DevtoolsContribution,
	ThemeContribution,
	ExampleContribution,
} from "../extensions";

export {
	acquireApp,
	acquireHeadlessApp,
	createCommandService,
	makeTuvrenScope,
	renderScoped,
	streamEvents,
	TuvrenEffectError,
} from "./advanced";
export type {
	DispatchingEffectCommandService,
	EffectCommandOptions,
	EffectCommandService,
	EffectEventStreamOptions,
	ManagedWidgetOptions,
	TuvrenEffectScope,
	TuvrenEffectScopeOptions,
	TuvrenFinalizer,
} from "./advanced";
