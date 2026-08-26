import type {
  BoxProps,
  ButtonProps,
  AnimationSpec,
  AnimationTimeline,
  CheckboxProps,
  CodeViewProps,
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

export { TuvrenError } from "./shared";
export type {
  AnimationSpec,
  AnimationTimeline,
  BoxProps,
  ButtonProps,
  CheckboxProps,
  ClipboardPayload,
  ClipboardTarget,
  CodeViewProps,
  CollectionKey,
  CommandId,
  CommonProps,
  ComponentId,
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

export interface ImperativeRunOptions {
  readonly screenMode?: ScreenMode;
  readonly externalOutput?:
    "capture" | "scrollback" | "passthrough" | "disabled";
  readonly reducedMotion?: boolean;
}

export type ImperativePrimitiveProps<Props extends object> = Omit<
  Props,
  "children"
>;
export type ImperativeComponentProps<Props extends object> = Omit<
  Props,
  "children"
> & {
  readonly children?: ImperativeChild | readonly ImperativeChild[];
};

export abstract class Primitive<Props extends object = object> {
  readonly props: Readonly<Props>;
  protected constructor(props: Props);
  update(next: Partial<Props>): void;
  append(child: ImperativeChild): void;
  insert(index: number, child: ImperativeChild): void;
  remove(child: ImperativeChild): void;
  destroy(): void;
  animate(spec: AnimationSpec | AnimationTimeline): Promise<void>;
}

export abstract class Component<Props extends object = object> {
  readonly props: Readonly<Props>;
  readonly root: Primitive;
  protected constructor(props: Props);
  update(next: Partial<Props>): void;
  destroy(): void;
}

export type ImperativeChild = Primitive | Component;

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
    TableProps<T, Promise<import("./shared").RangeLoadResult<T>>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativePrimitiveProps<
      TableProps<T, Promise<import("./shared").RangeLoadResult<T>>>
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
    TableProps<T, Promise<import("./shared").RangeLoadResult<T>>>
  >
> {
  readonly controller: import("./shared").CollectionController<T>;
  constructor(
    props: ImperativeComponentProps<
      TableProps<T, Promise<import("./shared").RangeLoadResult<T>>>
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
export class Menu extends Component<ImperativeComponentProps<MenuProps>> {
  constructor(props: ImperativeComponentProps<MenuProps>);
}
export class MenuItem extends Component<
  ImperativeComponentProps<MenuItemProps>
> {
  constructor(props: ImperativeComponentProps<MenuItemProps>);
}
export class MenuBar extends Component<ImperativeComponentProps<MenuProps>> {
  constructor(props: ImperativeComponentProps<MenuProps>);
}
export class ContextMenu extends Component<
  ImperativeComponentProps<MenuProps>
> {
  constructor(props: ImperativeComponentProps<MenuProps>);
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
    SelectProps<T, Promise<import("./shared").RangeLoadResult<T>>>
  >
> {
  constructor(
    props: ImperativeComponentProps<
      SelectProps<T, Promise<import("./shared").RangeLoadResult<T>>>
    >,
  );
}
export class ListBox<T = unknown> extends Component<
  ImperativeComponentProps<
    SelectProps<T, Promise<import("./shared").RangeLoadResult<T>>>
  >
> {
  constructor(
    props: ImperativeComponentProps<
      SelectProps<T, Promise<import("./shared").RangeLoadResult<T>>>
    >,
  );
}
export class Tabs extends Component<ImperativeComponentProps<TabsProps>> {
  constructor(props: ImperativeComponentProps<TabsProps>);
}
export class CommandPalette<T = unknown> extends Component<
  ImperativeComponentProps<
    SelectProps<T, Promise<import("./shared").RangeLoadResult<T>>>
  >
> {
  constructor(
    props: ImperativeComponentProps<
      SelectProps<T, Promise<import("./shared").RangeLoadResult<T>>>
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
}

export interface ImperativeCommand<A = void> {
  readonly id: import("./shared").CommandId;
  readonly title: string;
  readonly description?: string;
  readonly category?: string;
  readonly concurrency: ImperativeCommandConcurrency;
  readonly run: (context: ImperativeCommandContext) => A | Promise<A>;
}

export interface ImperativeCommandRegistry {
  register<A>(command: ImperativeCommand<A>): () => void;
  invoke<A>(
    command: ImperativeCommand<A>,
    context?: Partial<ImperativeCommandContext>,
  ): Promise<A>;
  invokeById(
    id: import("./shared").CommandId,
    context?: Partial<ImperativeCommandContext>,
  ): Promise<unknown>;
}

export interface ImperativeKeyBinding {
  readonly command: import("./shared").CommandId;
  readonly keys: string;
  readonly scope?: string;
  readonly when?: (context: ImperativeCommandContext) => boolean;
}

export interface ImperativeKeymapRegistry {
  register(binding: ImperativeKeyBinding): () => void;
}

export interface ImperativeApp {
  readonly commands: ImperativeCommandRegistry;
  readonly keymaps: ImperativeKeymapRegistry;
  setRoot(root: ImperativeChild): void;
  transaction(apply: () => void): void;
  render(): void;
  pollInput(timeoutMs?: number): number;
  drainEvents(): readonly TuvrenEvent[];
  readClipboard(
    target?: import("./shared").ClipboardTarget,
  ): Promise<import("./shared").ClipboardPayload>;
  writeClipboard(
    payload: import("./shared").ClipboardPayload,
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
): import("./shared").TextDocument;
export function toStyledText(
  value: unknown,
  adapter: (value: unknown) => import("./shared").StyledText,
): import("./shared").StyledText;
export function componentId(value: string): import("./shared").ComponentId;
export function commandId(value: string): import("./shared").CommandId;
export function transcriptBlockId(
  value: string,
): import("./shared").TranscriptBlockId;
