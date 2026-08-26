import type * as Effect from "effect/Effect";
import type * as Context from "effect/Context";
import type * as Layer from "effect/Layer";
import type * as Scope from "effect/Scope";
import type * as Stream from "effect/Stream";
import { TuvrenError } from "./shared";
import type {
  BoxProps,
  BorderStyle,
  ButtonProps,
  ClipboardMediaTypes,
  ClipboardPayload,
  ClipboardTarget,
  CheckboxProps,
  CodeViewProps,
  CommandPaletteProps,
  CommandId,
  KeySequence,
  KeyGrapheme,
  ComponentType,
  DialogProps,
  DiffViewProps,
  AnimationSpec,
  AnimationTimeline,
  AnimationCompletion,
  ErrorBoundaryProps,
  EventModifier,
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
  TuvrenEvent,
  View,
} from "./shared";

export {
  TuvrenApplicationError,
  TuvrenCapabilityError,
  TuvrenClipboardError,
  TuvrenCommandError,
  TuvrenDistributionError,
  TuvrenError,
  TuvrenPermissionError,
  TuvrenResourceError,
  TuvrenRuntimeError,
  TuvrenTerminalError,
  TuvrenValidationError,
} from "./shared";
export type {
  AnimationCompletion,
  AnimationSpec,
  AnimationTimeline,
  BorderStyle,
  BoxProps,
  Brand,
  ButtonProps,
  CheckboxProps,
  ClipboardMediaTypes,
  ClipboardPayload,
  ClipboardTarget,
  CodeViewProps,
  CollectionKey,
  CommandId,
  CommandPaletteProps,
  CommonProps,
  ControllerEnqueueDisposition,
  ComponentId,
  ComponentPropsWithChildren,
  ComponentType,
  DataSource,
  CollectionController,
  CollectionMutation,
  CollectionScrollPosition,
  DialogProps,
  DiffViewProps,
  Dimension,
  DragEventPayload,
  FlexDirection,
  FlexWrap,
  AlignMode,
  JustifyMode,
  GridTrack,
  GridPlacement,
  KeymapConflict,
  KeymapRebinding,
  KeymapScope,
  KeymapScopeId,
  KeySequence,
  KeyStroke,
  KeyGrapheme,
  NamedKey,
  ErrorBoundaryProps,
  EventModifier,
  ExternalOutputMode,
  FormControlProps,
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
  StyleBoolean,
  StyleBorder,
  StyleColor,
  StyleNumber,
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
  TextDocumentConfig,
  TextDocumentSnapshot,
  TextEncoding,
  TextMatch,
  TextSearchOptions,
  TextValidationRule,
  GraphemeIndex,
  GraphemeRange,
  TextProps,
  Theme,
  ThemeRecipes,
  ThemeTextValue,
  ThemeTokenReference,
  ThemeTokenValue,
  ThemeTokens,
  ToastProps,
  ToggleButtonProps,
  TranscriptBlock,
  TranscriptBlockId,
  TranscriptProps,
  TranscriptController,
  TranscriptOperation,
  TuvrenEvent,
  TuvrenErrorCategory,
  TuvrenErrorCode,
  TuvrenErrorVariant,
  View,
  VisibleRangeObservation,
  ViewChildren,
  ViewNode,
  VirtualCollectionBinding,
} from "./shared";

export interface RenderOptions<E = never, R = never> {
  readonly screenMode?: "alternate" | "inline" | "split-footer" | "headless";
  readonly externalOutput?:
    "capture" | "scrollback" | "passthrough" | "disabled";
  readonly reducedMotion?: boolean;
  readonly theme?: import("./shared").Theme;
  readonly onEvent?: (event: TuvrenEvent) => Effect.Effect<void, E, R>;
}

export interface RenderSession<E = never> {
  readonly events: Stream.Stream<TuvrenEvent, TuvrenError>;
  readonly interrupt: Effect.Effect<void>;
  readonly awaitExit: Effect.Effect<void, TuvrenError | E>;
}

export function render<VE, VR, EE = never, ER = never>(
  view: View<VE, VR>,
  options?: RenderOptions<EE, ER>,
): Effect.Effect<void, TuvrenError | VE | EE, VR | ER>;
export function mount<VE, VR, EE = never, ER = never>(
  view: View<VE, VR>,
  options?: RenderOptions<EE, ER>,
): Effect.Effect<RenderSession<VE | EE>, TuvrenError, Scope.Scope | VR | ER>;

export type CommandConcurrency = "reject" | "restart" | "queue" | "parallel";

export interface CommandContext {
  readonly source: "programmatic" | "keymap" | "menu" | "button" | "palette";
  readonly event?: TuvrenEvent;
}

export interface Command<A = void, E = never, R = never> {
  readonly id: CommandId<A, E, R>;
  readonly title: string;
  readonly description?: string;
  readonly category?: string;
  readonly visible?: (context: CommandContext) => boolean;
  readonly enabled?: (context: CommandContext) => boolean;
  readonly when?: (context: CommandContext) => boolean;
  readonly concurrency: CommandConcurrency;
  readonly run: (context: CommandContext) => Effect.Effect<A, E, R>;
}

export interface KeyBinding<A = unknown, E = unknown, R = unknown> {
  readonly command: CommandId<A, E, R>;
  readonly sequence: KeySequence;
  readonly scope?: import("./shared").KeymapScopeId;
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
  invokeById<A, E, R>(
    id: CommandId<A, E, R>,
    context?: Partial<CommandContext>,
  ): Effect.Effect<A, E | TuvrenError | RegisteredCommandError, R>;
}

export class RegisteredCommandError extends TuvrenError {
  readonly _tag: "RegisteredCommandError";
  readonly code: "TUVREN_COMMAND_NOT_REGISTERED";
  readonly category: "command";
  readonly operation: "command.invokeById";
  readonly command: CommandId;
  readonly remediation: "Register the Command in the active scope before invoking its ID.";
}

export interface KeymapService {
  register(binding: KeyBinding): Effect.Effect<void, TuvrenError, Scope.Scope>;
  createScope(
    id: import("./shared").KeymapScopeId,
    options?: Readonly<{
      parent?: import("./shared").KeymapScopeId;
      priority?: number;
    }>,
  ): Effect.Effect<import("./shared").KeymapScope, TuvrenError, Scope.Scope>;
  bindings(
    scope?: import("./shared").KeymapScopeId,
  ): Effect.Effect<readonly KeyBinding[], TuvrenError>;
  conflicts(
    scope?: import("./shared").KeymapScopeId,
  ): Effect.Effect<readonly import("./shared").KeymapConflict[], TuvrenError>;
  rebind(
    rebinding: import("./shared").KeymapRebinding,
  ): Effect.Effect<void, TuvrenError>;
  resolve(
    sequence: KeySequence,
    focusedScopes: readonly import("./shared").KeymapScopeId[],
    context?: Partial<CommandContext>,
  ): Effect.Effect<CommandId | undefined, TuvrenError>;
}

export interface ClipboardError extends TuvrenError<
  | "TUVREN_CLIPBOARD_UNAVAILABLE"
  | "TUVREN_CLIPBOARD_DENIED"
  | "TUVREN_CLIPBOARD_BUSY"
  | "TUVREN_CLIPBOARD_MALFORMED"
  | "TUVREN_CLIPBOARD_TIMED_OUT"
> {
  readonly category: "clipboard";
  readonly status:
    "unavailable" | "denied" | "busy" | "malformed" | "timed-out";
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
  clipboardMediaTypes(
    target?: ClipboardTarget,
  ): Effect.Effect<ClipboardMediaTypes, ClipboardError>;
  readClipboardText(
    target?: ClipboardTarget,
  ): Effect.Effect<string, ClipboardError>;
  writeClipboardText(
    text: string,
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
export interface ComponentRequirement<E = never, R = never> {
  readonly __componentRequirement?: Readonly<{ error: E; environment: R }>;
}
export function useCommand<A, E, R>(
  command: Command<A, E, R>,
): ComponentRequirement<E, R>;
export function useKeymap(
  binding: KeyBinding,
): ComponentRequirement<TuvrenError>;
export function useStream<A, E, R>(
  stream: Stream.Stream<A, E, R>,
  onValue: (value: A) => void,
): ComponentRequirement<E, R>;
export function withRequirements<VE, VR, E, R>(
  view: View<VE, VR>,
  ...requirements: readonly ComponentRequirement<E, R>[]
): View<VE | E, VR | R>;
export function provideLayer<ROut, E, RIn, VE, VR>(
  layer: Layer.Layer<ROut, E, RIn>,
  child: View<VE, VR | ROut>,
): View<VE | E, Exclude<VR, ROut> | RIn>;
export function provideTheme<VE, VR>(
  theme: import("./shared").Theme,
  child: View<VE, VR>,
): View<VE, VR>;
export function createStyleSheet<Rule extends string>(
  name: string,
  rules: Readonly<Record<Rule, import("./shared").StyleSpec>>,
): import("./shared").StyleSheet<Rule>;
export function defineTheme(
  name: string,
  tokens: import("./shared").ThemeTokens,
  recipes: import("./shared").ThemeRecipes,
): import("./shared").Theme;
export function themeToken<Value extends import("./shared").ThemeTokenValue>(
  token: string,
  fallback?: Value,
): import("./shared").ThemeTokenReference<Value>;
export interface AnimationHandle {
  readonly id: bigint;
  readonly completion: Effect.Effect<
    import("./shared").AnimationCompletion,
    TuvrenError
  >;
  readonly cancel: Effect.Effect<void, TuvrenError>;
  replace(
    spec: AnimationSpec | AnimationTimeline,
  ): Effect.Effect<AnimationHandle, TuvrenError>;
}
export function animate(
  target: import("./shared").ComponentId,
  spec: AnimationSpec | AnimationTimeline,
): Effect.Effect<AnimationHandle, TuvrenError>;
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
  config?: import("./shared").TextDocumentConfig,
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
export function commandId<A = void, E = never, R = never>(
  value: string,
): CommandId<A, E, R>;
export function graphemeIndex(value: number): import("./shared").GraphemeIndex;
export function keymapScopeId(value: string): import("./shared").KeymapScopeId;
export function keyGrapheme(value: string): import("./shared").KeyGrapheme;
export function transcriptBlockId(
  value: string,
): import("./shared").TranscriptBlockId;

export const Box: ComponentType<BoxProps>;
export const Text: ComponentType<TextProps>;
export const Input: ComponentType<InputProps>;
export type DeclarativeTextAreaProps =
  | (TextAreaProps & { readonly document?: never })
  | (import("./shared").DistributiveOmit<
      TextAreaProps,
      | "value"
      | "defaultValue"
      | "onValueChange"
      | keyof import("./shared").TextDocumentConfig
    > & {
      readonly document: TextDocumentService;
      readonly value?: never;
      readonly defaultValue?: never;
      readonly onValueChange?: never;
    });
export const TextArea: ComponentType<DeclarativeTextAreaProps>;
export const ScrollBox: ComponentType<ScrollBoxProps>;
export const Overlay: ComponentType<OverlayProps>;
export function Table<
  T,
  E = never,
  R = never,
  RenderE = never,
  RenderR = never,
  ChildE = never,
  ChildR = never,
>(
  props: import("./shared").ComponentPropsWithChildren<
    TableProps<
      T,
      Effect.Effect<RangeLoadResult<T>, E, R>,
      Stream.Stream<import("./shared").CollectionMutation<T>, E, R>,
      RenderE,
      RenderR
    >,
    ChildE,
    ChildR
  >,
): View<E | RenderE | ChildE, R | RenderR | ChildR>;
export function useCollectionController<
  T,
>(): import("./shared").CollectionController<T>;
export const Transcript: ComponentType<TranscriptProps>;
export function useTranscriptController(): import("./shared").TranscriptController;
export const SplitPane: ComponentType<SplitPaneProps>;
export const FocusScope: ComponentType<FocusScopeProps>;
export function ErrorBoundary<
  ChildE,
  ChildR,
  FallbackE = never,
  FallbackR = never,
>(
  props: ErrorBoundaryProps<ChildE, ChildR, FallbackE, FallbackR>,
): View<FallbackE, ChildR | FallbackR>;
export function Button<A, E, R, ChildE = never, ChildR = never>(
  props: import("./shared").ComponentPropsWithChildren<
    ButtonProps<A, E, R>,
    ChildE,
    ChildR
  >,
): View<E | ChildE, R | ChildR>;
export function ToggleButton<A, E, R, ChildE = never, ChildR = never>(
  props: import("./shared").ComponentPropsWithChildren<
    ToggleButtonProps<A, E, R>,
    ChildE,
    ChildR
  >,
): View<E | ChildE, R | ChildR>;
export const Checkbox: ComponentType<CheckboxProps>;
export const Radio: ComponentType<RadioProps>;
export const RadioGroup: ComponentType<RadioGroupProps>;
export const ProgressBar: ComponentType<ProgressProps>;
export const Meter: ComponentType<ProgressProps>;
export const Spinner: ComponentType<ProgressProps>;
export function Menu<
  T,
  E = never,
  R = never,
  RenderE = never,
  RenderR = never,
  ChildE = never,
  ChildR = never,
>(
  props: import("./shared").ComponentPropsWithChildren<
    MenuProps<
      T,
      Effect.Effect<RangeLoadResult<T>, E, R>,
      Stream.Stream<import("./shared").CollectionMutation<T>, E, R>,
      RenderE,
      RenderR
    >,
    ChildE,
    ChildR
  >,
): View<E | RenderE | ChildE, R | RenderR | ChildR>;
export function MenuItem<A, E, R, ChildE = never, ChildR = never>(
  props: import("./shared").ComponentPropsWithChildren<
    MenuItemProps<A, E, R>,
    ChildE,
    ChildR
  >,
): View<E | ChildE, R | ChildR>;
export function MenuBar<
  T,
  E = never,
  R = never,
  RenderE = never,
  RenderR = never,
  ChildE = never,
  ChildR = never,
>(
  props: import("./shared").ComponentPropsWithChildren<
    MenuProps<
      T,
      Effect.Effect<RangeLoadResult<T>, E, R>,
      Stream.Stream<import("./shared").CollectionMutation<T>, E, R>,
      RenderE,
      RenderR
    >,
    ChildE,
    ChildR
  >,
): View<E | RenderE | ChildE, R | RenderR | ChildR>;
export function ContextMenu<
  T,
  E = never,
  R = never,
  RenderE = never,
  RenderR = never,
  ChildE = never,
  ChildR = never,
>(
  props: import("./shared").ComponentPropsWithChildren<
    MenuProps<
      T,
      Effect.Effect<RangeLoadResult<T>, E, R>,
      Stream.Stream<import("./shared").CollectionMutation<T>, E, R>,
      RenderE,
      RenderR
    >,
    ChildE,
    ChildR
  >,
): View<E | RenderE | ChildE, R | RenderR | ChildR>;
export const Dialog: ComponentType<DialogProps>;
export const AlertDialog: ComponentType<DialogProps>;
export function Select<
  T,
  E = never,
  R = never,
  RenderE = never,
  RenderR = never,
  ChildE = never,
  ChildR = never,
>(
  props: import("./shared").ComponentPropsWithChildren<
    SelectProps<
      T,
      Effect.Effect<RangeLoadResult<T>, E, R>,
      Stream.Stream<import("./shared").CollectionMutation<T>, E, R>,
      RenderE,
      RenderR
    >,
    ChildE,
    ChildR
  >,
): View<E | RenderE | ChildE, R | RenderR | ChildR>;
export function ListBox<
  T,
  E = never,
  R = never,
  RenderE = never,
  RenderR = never,
  ChildE = never,
  ChildR = never,
>(
  props: import("./shared").ComponentPropsWithChildren<
    SelectProps<
      T,
      Effect.Effect<RangeLoadResult<T>, E, R>,
      Stream.Stream<import("./shared").CollectionMutation<T>, E, R>,
      RenderE,
      RenderR
    >,
    ChildE,
    ChildR
  >,
): View<E | RenderE | ChildE, R | RenderR | ChildR>;
export const Tabs: ComponentType<TabsProps>;
export function CommandPalette<
  T,
  E = never,
  R = never,
  RenderE = never,
  RenderR = never,
  CommandA = unknown,
  CommandE = never,
  CommandR = never,
  ChildE = never,
  ChildR = never,
>(
  props: import("./shared").ComponentPropsWithChildren<
    CommandPaletteProps<
      T,
      Effect.Effect<RangeLoadResult<T>, E, R>,
      Stream.Stream<import("./shared").CollectionMutation<T>, E, R>,
      RenderE,
      RenderR,
      CommandA,
      CommandE,
      CommandR
    >,
    ChildE,
    ChildR
  >,
): View<E | RenderE | CommandE | ChildE, R | RenderR | CommandR | ChildR>;
export const CodeView: ComponentType<CodeViewProps>;
export const DiffView: ComponentType<DiffViewProps>;
export const Toast: ComponentType<ToastProps>;
export const Notification: ComponentType<ToastProps>;

export const DevtoolsCommands: {
  readonly toggle: CommandId<void, TuvrenError, never>;
  readonly pick: CommandId<void, TuvrenError, never>;
  readonly record: CommandId<void, TuvrenError, never>;
  readonly saveTrace: CommandId<void, TuvrenError, never>;
};
