import { TuvrenError } from "./shared";
import type {
  BoxProps,
  BorderStyle,
  ButtonProps,
  AnimationSpec,
  AnimationTimeline,
  CheckboxProps,
  CodeViewProps,
  CommandPaletteProps,
  DialogProps,
  DiffViewProps,
  FocusScopeProps,
  InputProps,
  MenuItemProps,
  MenuProps,
  OverlayProps,
  ProgressProps,
  RadioGroupProps,
  RadioProps,
  ScreenMode,
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
  ButtonProps,
  CheckboxProps,
  ClipboardMediaTypes,
  ClipboardPayload,
  ClipboardTarget,
  CodeViewProps,
  CollectionKey,
  CommandId,
  CommonProps,
  ComponentId,
  ComponentPropsWithChildren,
  DataSource,
  CollectionController,
  CollectionMutation,
  CollectionScrollPosition,
  CommandPaletteProps,
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
  ViewChildren,
  ViewNode,
  VirtualCollectionBinding,
} from "./shared";

export interface ImperativeRunOptions {
  readonly screenMode?: ScreenMode;
  readonly externalOutput?:
    "capture" | "scrollback" | "passthrough" | "disabled";
  readonly reducedMotion?: boolean;
  readonly theme?: import("./shared").Theme;
}

export type ImperativePrimitiveProps<Props extends object> =
  Props extends object ? Omit<Props, "children"> : never;
export type ImperativeComponentProps<Props extends object> =
  Props extends object
    ? Omit<Props, "children"> & {
        readonly children?: ImperativeChild | readonly ImperativeChild[];
      }
    : never;

export abstract class Primitive<Props extends object = object> {
  readonly props: Readonly<Props>;
  protected constructor(props: Props);
  update(next: Partial<Props>): void;
  append(child: ImperativeChild): void;
  insert(index: number, child: ImperativeChild): void;
  remove(child: ImperativeChild): void;
  destroy(): void;
  animate(spec: AnimationSpec | AnimationTimeline): ImperativeAnimationHandle;
}

export abstract class Component<Props extends object = object> {
  readonly props: Readonly<Props>;
  protected constructor(props: Props);
  update(next: Partial<Props>): void;
  animate(spec: AnimationSpec | AnimationTimeline): ImperativeAnimationHandle;
  destroy(): void;
}

export type ImperativeChild = Primitive | Component;
export type ImperativeRangeLoad<T> = Promise<
  import("./shared").RangeLoadResult<T>
>;
export type ImperativeMutations<T> = AsyncIterable<
  import("./shared").CollectionMutation<T>
>;

export class Box extends Primitive<ImperativePrimitiveProps<BoxProps>> {
  constructor(props: ImperativePrimitiveProps<BoxProps>);
}
export class Text extends Primitive<ImperativePrimitiveProps<TextProps>> {
  constructor(props: ImperativePrimitiveProps<TextProps>);
}
export class Input extends Primitive<ImperativePrimitiveProps<InputProps>> {
  constructor(props: ImperativePrimitiveProps<InputProps>);
}
export class TextArea extends Primitive<
  ImperativePrimitiveProps<TextAreaProps>
> {
  readonly document: import("./shared").TextDocument;
  constructor(props: ImperativePrimitiveProps<TextAreaProps>);
}
export class ScrollBox extends Primitive<
  ImperativePrimitiveProps<ScrollBoxProps>
> {
  constructor(props: ImperativePrimitiveProps<ScrollBoxProps>);
}
export class Overlay extends Primitive<ImperativePrimitiveProps<OverlayProps>> {
  constructor(props: ImperativePrimitiveProps<OverlayProps>);
}
export class CollectionPrimitive<T = unknown> extends Primitive<
  ImperativePrimitiveProps<
    TableProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativePrimitiveProps<
      TableProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
    >,
  );
}
export class TranscriptPrimitive extends Primitive<
  ImperativePrimitiveProps<TranscriptProps>
> {
  readonly controller: import("./shared").TranscriptController;
  constructor(props: ImperativePrimitiveProps<TranscriptProps>);
}
export class SplitPane extends Primitive<
  ImperativePrimitiveProps<SplitPaneProps>
> {
  constructor(props: ImperativePrimitiveProps<SplitPaneProps>);
}
export class FocusScope extends Component<
  ImperativeComponentProps<FocusScopeProps>
> {
  constructor(props: ImperativeComponentProps<FocusScopeProps>);
}

export class Table<T = unknown> extends Component<
  ImperativeComponentProps<
    TableProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativeComponentProps<
      TableProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
    >,
  );
}
export class Transcript extends Component<
  ImperativeComponentProps<TranscriptProps>
> {
  readonly controller: import("./shared").TranscriptController;
  constructor(props: ImperativeComponentProps<TranscriptProps>);
}
export class Button extends Component<ImperativeComponentProps<ButtonProps>> {
  constructor(props: ImperativeComponentProps<ButtonProps>);
}
export class ToggleButton extends Component<
  ImperativeComponentProps<ToggleButtonProps>
> {
  constructor(props: ImperativeComponentProps<ToggleButtonProps>);
}
export class Checkbox extends Component<
  ImperativeComponentProps<CheckboxProps>
> {
  constructor(props: ImperativeComponentProps<CheckboxProps>);
}
export class Radio extends Component<ImperativeComponentProps<RadioProps>> {
  constructor(props: ImperativeComponentProps<RadioProps>);
}
export class RadioGroup extends Component<
  ImperativeComponentProps<RadioGroupProps>
> {
  constructor(props: ImperativeComponentProps<RadioGroupProps>);
}
export class ProgressBar extends Component<
  ImperativeComponentProps<ProgressProps>
> {
  constructor(props: ImperativeComponentProps<ProgressProps>);
}
export class Meter extends Component<ImperativeComponentProps<ProgressProps>> {
  constructor(props: ImperativeComponentProps<ProgressProps>);
}
export class Spinner extends Component<
  ImperativeComponentProps<ProgressProps>
> {
  constructor(props: ImperativeComponentProps<ProgressProps>);
}
export class Menu<T = unknown> extends Component<
  ImperativeComponentProps<
    MenuProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativeComponentProps<
      MenuProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
    >,
  );
}
export class MenuItem extends Component<
  ImperativeComponentProps<MenuItemProps>
> {
  constructor(props: ImperativeComponentProps<MenuItemProps>);
}
export class MenuBar<T = unknown> extends Component<
  ImperativeComponentProps<
    MenuProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativeComponentProps<
      MenuProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
    >,
  );
}
export class ContextMenu<T = unknown> extends Component<
  ImperativeComponentProps<
    MenuProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativeComponentProps<
      MenuProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
    >,
  );
}
export class Dialog extends Component<ImperativeComponentProps<DialogProps>> {
  constructor(props: ImperativeComponentProps<DialogProps>);
}
export class AlertDialog extends Component<
  ImperativeComponentProps<DialogProps>
> {
  constructor(props: ImperativeComponentProps<DialogProps>);
}
export class Select<T = unknown> extends Component<
  ImperativeComponentProps<
    SelectProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativeComponentProps<
      SelectProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
    >,
  );
}
export class ListBox<T = unknown> extends Component<
  ImperativeComponentProps<
    SelectProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativeComponentProps<
      SelectProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
    >,
  );
}
export class Tabs extends Component<ImperativeComponentProps<TabsProps>> {
  constructor(props: ImperativeComponentProps<TabsProps>);
}
export class CommandPalette<T = unknown> extends Component<
  ImperativeComponentProps<
    CommandPaletteProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativeComponentProps<
      CommandPaletteProps<T, ImperativeRangeLoad<T>, ImperativeMutations<T>>
    >,
  );
}
export class CodeView extends Component<
  ImperativeComponentProps<CodeViewProps>
> {
  constructor(props: ImperativeComponentProps<CodeViewProps>);
}
export class DiffView extends Component<
  ImperativeComponentProps<DiffViewProps>
> {
  constructor(props: ImperativeComponentProps<DiffViewProps>);
}
export class Toast extends Component<ImperativeComponentProps<ToastProps>> {
  constructor(props: ImperativeComponentProps<ToastProps>);
}
export class Notification extends Component<
  ImperativeComponentProps<ToastProps>
> {
  constructor(props: ImperativeComponentProps<ToastProps>);
}

export type ImperativeCommandConcurrency =
  "reject" | "restart" | "queue" | "parallel";

export interface ImperativeCommandContext {
  readonly source: "programmatic" | "keymap" | "menu" | "button" | "palette";
  readonly event?: TuvrenEvent;
  readonly signal: AbortSignal;
}

export type ImperativeResult<A, E> =
  | { readonly ok: true; readonly value: A }
  | { readonly ok: false; readonly error: E };

export type ImperativeCommandCompletion<A, E> =
  | { readonly status: "succeeded"; readonly value: A }
  | { readonly status: "failed"; readonly error: E }
  | {
      readonly status: "interrupted";
      readonly reason: "cancelled" | "restarted" | "shutdown";
      readonly cause?: unknown;
      readonly error: import("./shared").TuvrenCommandError & {
        readonly code: "TUVREN_COMMAND_INTERRUPTED";
        readonly operation: "command.interrupt";
      };
    }
  | {
      readonly status: "rejected";
      readonly reason: "disabled";
      readonly error: import("./shared").TuvrenCommandError & {
        readonly code: "TUVREN_COMMAND_DISABLED";
        readonly operation: "command.invoke";
      };
    }
  | {
      readonly status: "rejected";
      readonly reason: "contextual";
      readonly error: import("./shared").TuvrenCommandError & {
        readonly code: "TUVREN_COMMAND_UNAVAILABLE";
        readonly operation: "command.invoke";
      };
    }
  | {
      readonly status: "rejected";
      readonly reason: "concurrency";
      readonly error: import("./shared").TuvrenCommandError & {
        readonly code: "TUVREN_COMMAND_REJECTED";
        readonly operation: "command.invoke";
      };
    };

export interface ImperativeCommand<A = void, E = never> {
  readonly id: import("./shared").CommandId<A, E, never>;
  readonly title: string;
  readonly description?: string;
  readonly category?: string;
  readonly visible?: (context: ImperativeCommandContext) => boolean;
  readonly enabled?: (context: ImperativeCommandContext) => boolean;
  readonly when?: (context: ImperativeCommandContext) => boolean;
  readonly concurrency: ImperativeCommandConcurrency;
  readonly run: (
    context: ImperativeCommandContext,
  ) => ImperativeResult<A, E> | Promise<ImperativeResult<A, E>>;
}

export interface ImperativeCommandRegistry {
  register<A, E>(command: ImperativeCommand<A, E>): () => void;
  invoke<A, E>(
    command: ImperativeCommand<A, E>,
    context?: Partial<ImperativeCommandContext>,
  ): ImperativeCommandInvocation<A, E>;
  invokeById<A, E>(
    id: import("./shared").CommandId<A, E, never>,
    context?: Partial<ImperativeCommandContext>,
  ): ImperativeCommandInvocation<A, E | ImperativeRegisteredCommandError>;
}

export class ImperativeRegisteredCommandError extends TuvrenError {
  readonly _tag: "ImperativeRegisteredCommandError";
  readonly code: "TUVREN_COMMAND_NOT_REGISTERED";
  readonly category: "command";
  readonly operation: "command.invokeById";
  readonly command: import("./shared").CommandId;
  readonly remediation: "Register the Command in the active scope before invoking its ID.";
}

export interface ImperativeCommandInvocation<A, E> {
  readonly result: Promise<
    ImperativeCommandCompletion<A, E | import("./shared").TuvrenError>
  >;
  readonly signal: AbortSignal;
  cancel(reason?: unknown): void;
}

export interface ImperativeKeyBinding {
  readonly command: import("./shared").CommandId;
  readonly sequence: import("./shared").KeySequence;
  readonly scope?: import("./shared").KeymapScopeId;
  readonly when?: (context: ImperativeCommandContext) => boolean;
}

export interface ImperativeKeymapRegistry {
  register(binding: ImperativeKeyBinding): () => void;
  createScope(
    id: import("./shared").KeymapScopeId,
    options?: Readonly<{
      parent?: import("./shared").KeymapScopeId;
      priority?: number;
    }>,
  ): import("./shared").KeymapScope;
  bindings(
    scope?: import("./shared").KeymapScopeId,
  ): readonly ImperativeKeyBinding[];
  conflicts(
    scope?: import("./shared").KeymapScopeId,
  ): readonly import("./shared").KeymapConflict[];
  rebind(rebinding: import("./shared").KeymapRebinding): void;
  resolve(
    sequence: import("./shared").KeySequence,
    focusedScopes: readonly import("./shared").KeymapScopeId[],
    context?: Partial<ImperativeCommandContext>,
  ): import("./shared").CommandId | undefined;
}

export interface ImperativeAnimationHandle {
  readonly id: bigint;
  readonly result: Promise<import("./shared").AnimationCompletion>;
  cancel(): void;
  replace(spec: AnimationSpec | AnimationTimeline): ImperativeAnimationHandle;
}

export interface ImperativeApp {
  readonly commands: ImperativeCommandRegistry;
  readonly keymaps: ImperativeKeymapRegistry;
  setRoot(root: ImperativeChild): void;
  setTheme(theme: import("./shared").Theme): void;
  transaction(apply: () => void): void;
  render(): void;
  pollInput(timeoutMs?: number): number;
  drainEvents(): readonly TuvrenEvent[];
  capabilities(): import("./shared").TerminalCapabilities;
  readClipboard(
    target?: import("./shared").ClipboardTarget,
  ): Promise<import("./shared").ClipboardPayload>;
  writeClipboard(
    payload: import("./shared").ClipboardPayload,
    target?: import("./shared").ClipboardTarget,
  ): Promise<void>;
  clipboardMediaTypes(
    target?: import("./shared").ClipboardTarget,
  ): Promise<import("./shared").ClipboardMediaTypes>;
  readClipboardText(
    target?: import("./shared").ClipboardTarget,
  ): Promise<string>;
  writeClipboardText(
    text: string,
    target?: import("./shared").ClipboardTarget,
  ): Promise<void>;
  announce(message: string): void;
  suspend(): void;
  resume(): void;
  close(): void;
}

export function run(
  build: (app: ImperativeApp) => void | Promise<void>,
  options?: ImperativeRunOptions,
): Promise<void>;

export function createSession(options?: ImperativeRunOptions): ImperativeApp;
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
export function decodeText(
  bytes: Uint8Array,
  encoding: import("./shared").TextEncoding,
): string;
export function encodeText(
  text: string,
  encoding?: import("./shared").TextEncoding,
): Uint8Array;
export function createTextDocument(
  initial?: string,
  config?: import("./shared").TextDocumentConfig,
): import("./shared").TextDocument;
export function toStyledText(
  value: unknown,
  adapter: (value: unknown) => import("./shared").StyledText,
): import("./shared").StyledText;
export function componentId(value: string): import("./shared").ComponentId;
export function commandId<A = void, E = never>(
  value: string,
): import("./shared").CommandId<A, E, never>;
export function graphemeIndex(value: number): import("./shared").GraphemeIndex;
export function keymapScopeId(value: string): import("./shared").KeymapScopeId;
export function keyGrapheme(value: string): import("./shared").KeyGrapheme;
export function transcriptBlockId(
  value: string,
): import("./shared").TranscriptBlockId;
