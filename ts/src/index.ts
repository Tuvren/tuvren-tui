/**
 * Tuvren TUI — Public API
 *
 * Usage (imperative):
 *   import { Tuvren, Box, Text, Input, Select, ScrollBox } from "tuvren-tui";
 *
 * Usage (JSX — v2):
 *   import { render, signal } from "tuvren-tui";
 *   // with tsconfig: { "jsx": "react-jsx", "jsxImportSource": "tuvren-tui" }
 */

// Imperative API
export { Tuvren } from "./app";
export type { RunOptions, TerminalCapabilities, TerminalInfo } from "./app";
export { Widget } from "./widget";
export { Box } from "./widgets/box";
export { Text } from "./widgets/text";
export { Input } from "./widgets/input";
export { TextArea } from "./widgets/textarea";
export { Select } from "./widgets/select";
export { ScrollBox } from "./widgets/scrollbox";
export { Table } from "./widgets/table";
export { List } from "./widgets/list";
export { Tabs } from "./widgets/tabs";
export { Overlay } from "./widgets/overlay";
export { TranscriptView } from "./widgets/transcript";
export { SplitPane } from "./widgets/splitpane";
export type { SplitPaneOptions, SplitAxis } from "./widgets/splitpane";
export type { TranscriptOptions, BlockKind, FollowModeStr } from "./widgets/transcript";
export { applyReplayEvent } from "./widgets/transcript-adapters";
export type { TranscriptReplayEvent } from "./widgets/transcript-adapters";
export { Theme, DARK_THEME, LIGHT_THEME } from "./theme";
export { TuvrenError, checkResult } from "./errors";
export { parseColor, parseDimension } from "./style";
export { AnimProp, Easing } from "./animation-constants";
export { EventType, KeyCode, Modifier, NodeType, AccessibilityRole } from "./ffi/structs";
export type { TuvrenEvent, TuvrenEventType } from "./events";

// Dev Mode and Devtools (ADR-T34)
export {
	createDevSession,
	OVERLAY_FLAGS,
	TRACE_FLAGS,
} from "./dev";
export type { DevSessionOptions, OverlayName } from "./dev";
export { WidgetInspector } from "./devtools/inspector";
export type {
	WidgetNode,
	TranscriptAnchor,
	DebugSnapshot,
} from "./devtools/inspector";
export { PerfHud, PERF_COUNTER_NAMES, PERF_COUNTER_COUNT } from "./devtools/hud";
export { TraceViewer, TRACE_KIND } from "./devtools/traces";
export type { TraceEntry, TraceKind } from "./devtools/traces";

// Commands & Keymap Foundations (Epic R, ADR-T44)
export { CommandRegistry, CommandDispatcher } from "./commands";
export type {
	Command,
	CommandContext,
	CommandPredicate,
	CommandSource,
	Disposable,
	WidgetRef,
} from "./commands";
export { KeymapRegistry } from "./keymap";
export type { KeyBinding } from "./keymap";

// App-Shaped Surface Composites (Epic K, ADR-T35)
export { CommandPalette } from "./composites/command-palette";
export type { CommandPaletteOptions } from "./composites/command-palette";
export { TracePanel, StructuredLogView } from "./composites/trace-panel";
export type {
	TraceKind as TracePanelKind,
	TracePanelOptions,
	StructuredLogEntry,
	StructuredLogViewOptions,
	LogLevel,
} from "./composites/trace-panel";
export { CodeView, DiffView } from "./composites/code-view";
export type {
	CodeViewOptions,
	DiffViewOptions,
	DiffMode,
} from "./composites/code-view";

// JSX runtime (v2 — ADR-T20)
export { jsx, jsxs, Fragment } from "./jsx/jsx-runtime";
export { signal, computed, effect, batch } from "@preact/signals-core";
export type { Signal, ReadonlySignal } from "@preact/signals-core";
export { Fragment as TuvrenFragment } from "./jsx/types";
export { render, mount, unmount, reconcileChildren, getEventHandlers } from "./jsx/reconciler";
export { createLoop, dispatchToJsxHandlers } from "./loop";
export type { LoopOptions, Loop } from "./loop";
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
} from "./jsx/types";
