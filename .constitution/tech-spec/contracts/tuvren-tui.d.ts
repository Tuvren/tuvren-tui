import type * as Effect from "effect/Effect";
import type * as Context from "effect/Context";
import type * as Layer from "effect/Layer";
import type * as Scope from "effect/Scope";
import type * as Stream from "effect/Stream";
import type {
  BoxProps,
  ButtonProps,
  ClipboardPayload,
  ClipboardTarget,
  CheckboxProps,
  CodeViewProps,
  CommandId,
  ComponentType,
  DialogProps,
  DiffViewProps,
  AnimationSpec,
  AnimationTimeline,
  ErrorBoundaryProps,
  FocusScopeProps,
  InputProps,
  MenuItemProps,
  MenuProps,
  OverlayProps,
  ProgressProps,
  RadioGroupProps,
  RadioProps,
  RangeResult,
  RangeLoadResult,
  ScrollBoxProps,
  SelectProps,
  SplitPaneProps,
  TableProps,
  TabsProps,
  TextAreaProps,
  TextProps,
  ToastProps,
  TranscriptProps,
  ToggleButtonProps,
  TuvrenError,
  TuvrenEvent,
  View,
} from "./shared";

export { TuvrenError } from "./shared";
export type {
  AnimationSpec,
  AnimationTimeline,
  BoxProps,
  Brand,
  ButtonProps,
  CheckboxProps,
  ClipboardPayload,
  ClipboardTarget,
  CodeViewProps,
  CollectionKey,
  CommandId,
  CommonProps,
  ComponentId,
  ComponentType,
  DataSource,
  CollectionController,
  CollectionMutation,
  DialogProps,
  DiffViewProps,
  Dimension,
  FlexDirection,
  FlexWrap,
  AlignMode,
  JustifyMode,
  GridTrack,
  GridPlacement,
  ErrorBoundaryProps,
  ExternalOutputMode,
  FocusScopeProps,
  InputProps,
  LayoutSpec,
  MenuItemProps,
  MenuProps,
  OverlayProps,
  ProgressProps,
  RadioGroupProps,
  RadioProps,
  RangeRequest,
  RangeResult,
  RangeLoadResult,
  ResponsiveCondition,
  ScreenMode,
  ScrollBoxProps,
  SelectProps,
  SemanticSpec,
  SplitPaneProps,
  StyleCondition,
  StyledSpan,
  StyledText,
  StyleSheet,
  StyleSpec,
  StyleState,
  TableColumn,
  TableProps,
  TabsProps,
  TerminalCapabilities,
  TerminalProfile,
  TextAreaProps,
  TextContent,
  TextDocument,
  TextDocumentSnapshot,
  TextEncoding,
  TextMatch,
  TextSearchOptions,
  GraphemeIndex,
  GraphemeRange,
  TextProps,
  Theme,
  ThemeRecipes,
  ThemeTokens,
  ToastProps,
  ToggleButtonProps,
  TranscriptBlock,
  TranscriptBlockId,
  TranscriptProps,
  TranscriptController,
  TranscriptOperation,
  TuvrenEvent,
  View,
  ViewChildren,
  ViewNode,
} from "./shared";

export interface RenderOptions<E = never, R = never> {
  readonly screenMode?: "alternate" | "inline" | "split-footer" | "headless";
  readonly externalOutput?:
    "capture" | "scrollback" | "passthrough" | "disabled";
  readonly reducedMotion?: boolean;
  readonly onEvent?: (event: TuvrenEvent) => Effect.Effect<void, E, R>;
}

export interface RenderSession {
  readonly events: Stream.Stream<TuvrenEvent, TuvrenError>;
  readonly interrupt: Effect.Effect<void>;
  readonly awaitExit: Effect.Effect<void, TuvrenError>;
}

export function render<E = never, R = never>(
  view: View,
  options?: RenderOptions<E, R>,
): Effect.Effect<void, TuvrenError | E, R>;
export function mount<E = never, R = never>(
  view: View,
  options?: RenderOptions<E, R>,
): Effect.Effect<RenderSession, TuvrenError | E, Scope.Scope | R>;

export type CommandConcurrency = "reject" | "restart" | "queue" | "parallel";

export interface CommandContext {
  readonly source: "programmatic" | "keymap" | "menu" | "button" | "palette";
  readonly event?: TuvrenEvent;
}

export interface Command<A = void, E = never, R = never> {
  readonly id: CommandId;
  readonly title: string;
  readonly description?: string;
  readonly category?: string;
  readonly visible?: (context: CommandContext) => boolean;
  readonly enabled?: (context: CommandContext) => boolean;
  readonly when?: (context: CommandContext) => boolean;
  readonly concurrency: CommandConcurrency;
  readonly run: (context: CommandContext) => Effect.Effect<A, E, R>;
}

export interface KeyBinding {
  readonly command: CommandId;
  readonly keys: string;
  readonly scope?: string;
  readonly when?: (context: CommandContext) => boolean;
}

export interface CommandService {
  register<A, E, R>(
    command: Command<A, E, R>,
  ): Effect.Effect<void, never, Scope.Scope | R>;
  invoke<A, E, R>(
    command: Command<A, E, R>,
    context?: Partial<CommandContext>,
  ): Effect.Effect<A, E | TuvrenError, R>;
  invokeById(
    id: CommandId,
    context?: Partial<CommandContext>,
  ): Effect.Effect<unknown, TuvrenError | RegisteredCommandError>;
}

export interface RegisteredCommandError {
  readonly _tag: "RegisteredCommandError";
  readonly command: CommandId;
  readonly cause: unknown;
}

export interface KeymapService {
  register(binding: KeyBinding): Effect.Effect<void, TuvrenError, Scope.Scope>;
}

export interface ClipboardError extends TuvrenError {
  readonly category: "clipboard";
  readonly status: "unavailable" | "denied" | "busy" | "malformed" | "timeout";
}

export interface TerminalService {
  readonly capabilities: Effect.Effect<
    import("./shared").TerminalCapabilities,
    TuvrenError
  >;
  readClipboard(
    target?: ClipboardTarget,
  ): Effect.Effect<ClipboardPayload, ClipboardError>;
  writeClipboard(
    payload: ClipboardPayload,
    target?: ClipboardTarget,
  ): Effect.Effect<void, ClipboardError>;
  announce(message: string): Effect.Effect<void, TuvrenError>;
  readonly suspend: Effect.Effect<void, TuvrenError>;
  readonly resume: Effect.Effect<void, TuvrenError>;
}

export const Terminal: Context.Tag<"tuvren/Terminal", TerminalService>;
export const Commands: Context.Tag<"tuvren/Commands", CommandService>;
export const Keymaps: Context.Tag<"tuvren/Keymaps", KeymapService>;

export interface State<A> {
  readonly get: () => A;
  readonly set: (value: A | ((current: A) => A)) => void;
}

export function useState<A>(initial: A | (() => A)): State<A>;
export function useCommand<A, E, R>(command: Command<A, E, R>): void;
export function useKeymap(binding: KeyBinding): void;
export function useStream<A, E>(
  stream: Stream.Stream<A, E, never>,
  onValue: (value: A) => void,
): void;
export function provideLayer<ROut, E, RIn>(
  layer: Layer.Layer<ROut, E, RIn>,
  child: View,
): View;
export function createStyleSheet<Rule extends string>(
  name: string,
  rules: Readonly<Record<Rule, import("./shared").StyleSpec>>,
): import("./shared").StyleSheet<Rule>;
export function defineTheme(
  name: string,
  tokens: import("./shared").ThemeTokens,
  recipes: import("./shared").ThemeRecipes,
): import("./shared").Theme;
export function animate(
  target: import("./shared").ComponentId,
  spec: AnimationSpec | AnimationTimeline,
): Effect.Effect<void, TuvrenError>;
export interface TextDocumentService {
  readonly snapshot: Effect.Effect<import("./shared").TextDocumentSnapshot>;
  readonly changes: Stream.Stream<import("./shared").TextDocumentSnapshot>;
  setCursor(
    index: import("./shared").GraphemeIndex,
  ): Effect.Effect<void, TuvrenError>;
  setSelection(
    range: import("./shared").GraphemeRange | undefined,
  ): Effect.Effect<void, TuvrenError>;
  moveCursor(
    unit: "grapheme" | "word" | "line" | "document",
    direction: "backward" | "forward",
    extendSelection?: boolean,
  ): Effect.Effect<void, TuvrenError>;
  insert(text: string): Effect.Effect<void, TuvrenError>;
  delete(
    range?: import("./shared").GraphemeRange,
  ): Effect.Effect<void, TuvrenError>;
  replace(
    range: import("./shared").GraphemeRange,
    text: string,
  ): Effect.Effect<void, TuvrenError>;
  find(
    query: string,
    options?: import("./shared").TextSearchOptions,
  ): Effect.Effect<import("./shared").TextMatch | undefined, TuvrenError>;
  replaceMatch(
    match: import("./shared").TextMatch,
    replacement: string,
  ): Effect.Effect<void, TuvrenError>;
  replaceAll(
    query: string,
    replacement: string,
    options?: import("./shared").TextSearchOptions,
  ): Effect.Effect<number, TuvrenError>;
  readonly undo: Effect.Effect<boolean, TuvrenError>;
  readonly redo: Effect.Effect<boolean, TuvrenError>;
  encode(
    encoding?: import("./shared").TextEncoding,
  ): Effect.Effect<Uint8Array, TuvrenError>;
}
export function createTextDocument(
  initial?: string,
): Effect.Effect<TextDocumentService, TuvrenError, Scope.Scope>;
export function decodeText(
  bytes: Uint8Array,
  encoding: import("./shared").TextEncoding,
): string;
export function encodeText(
  text: string,
  encoding?: import("./shared").TextEncoding,
): Uint8Array;
export function toStyledText(
  value: unknown,
  adapter: (value: unknown) => import("./shared").StyledText,
): import("./shared").StyledText;
export function componentId(value: string): import("./shared").ComponentId;
export function commandId(value: string): CommandId;
export function transcriptBlockId(
  value: string,
): import("./shared").TranscriptBlockId;

export const Box: ComponentType<BoxProps>;
export const Text: ComponentType<TextProps>;
export const Input: ComponentType<InputProps>;
export const TextArea: ComponentType<TextAreaProps>;
export const ScrollBox: ComponentType<ScrollBoxProps>;
export const Overlay: ComponentType<OverlayProps>;
export function Table<T, E = never, R = never>(
  props: TableProps<T, Effect.Effect<RangeLoadResult<T>, E, R>> & {
    readonly mutations?: Stream.Stream<
      import("./shared").CollectionMutation<T>,
      E,
      R
    >;
    readonly controller?: import("./shared").CollectionController<T>;
  },
): View;
export const Transcript: ComponentType<TranscriptProps>;
export function useTranscriptController(): import("./shared").TranscriptController;
export const SplitPane: ComponentType<SplitPaneProps>;
export const FocusScope: ComponentType<FocusScopeProps>;
export const ErrorBoundary: ComponentType<ErrorBoundaryProps>;
export const Button: ComponentType<ButtonProps>;
export const ToggleButton: ComponentType<ToggleButtonProps>;
export const Checkbox: ComponentType<CheckboxProps>;
export const Radio: ComponentType<RadioProps>;
export const RadioGroup: ComponentType<RadioGroupProps>;
export const ProgressBar: ComponentType<ProgressProps>;
export const Meter: ComponentType<ProgressProps>;
export const Spinner: ComponentType<ProgressProps>;
export const Menu: ComponentType<MenuProps>;
export const MenuItem: ComponentType<MenuItemProps>;
export const MenuBar: ComponentType<MenuProps>;
export const ContextMenu: ComponentType<MenuProps>;
export const Dialog: ComponentType<DialogProps>;
export const AlertDialog: ComponentType<DialogProps>;
export function Select<T, E = never, R = never>(
  props: SelectProps<T, Effect.Effect<RangeLoadResult<T>, E, R>>,
): View;
export function ListBox<T, E = never, R = never>(
  props: SelectProps<T, Effect.Effect<RangeLoadResult<T>, E, R>>,
): View;
export const Tabs: ComponentType<TabsProps>;
export function CommandPalette<T, E = never, R = never>(
  props: SelectProps<T, Effect.Effect<RangeLoadResult<T>, E, R>>,
): View;
export const CodeView: ComponentType<CodeViewProps>;
export const DiffView: ComponentType<DiffViewProps>;
export const Toast: ComponentType<ToastProps>;
export const Notification: ComponentType<ToastProps>;

export const DevtoolsCommands: {
  readonly toggle: CommandId;
  readonly pick: CommandId;
  readonly record: CommandId;
  readonly saveTrace: CommandId;
};
