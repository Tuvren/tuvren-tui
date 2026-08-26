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
  DialogProps,
  DiffViewProps,
  Dimension,
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
  TextProps,
  Theme,
  ThemeRecipes,
  ThemeTokens,
  ToastProps,
  ToggleButtonProps,
  TranscriptBlock,
  TranscriptBlockId,
  TranscriptProps,
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

export abstract class Primitive<Props extends object = object> {
  readonly props: Readonly<Props>;
  protected constructor(props: Props);
  update(next: Partial<Props>): void;
  append(child: Primitive): void;
  insert(index: number, child: Primitive): void;
  remove(child: Primitive): void;
  destroy(): void;
  animate(spec: AnimationSpec | AnimationTimeline): Promise<void>;
}

export class Box extends Primitive<BoxProps> {
  constructor(props: BoxProps);
}
export class Text extends Primitive<TextProps> {
  constructor(props: TextProps);
}
export class Input extends Primitive<InputProps> {
  constructor(props: InputProps);
}
export class TextArea extends Primitive<TextAreaProps> {
  constructor(props: TextAreaProps);
}
export class ScrollBox extends Primitive<ScrollBoxProps> {
  constructor(props: ScrollBoxProps);
}
export class Overlay extends Primitive<OverlayProps> {
  constructor(props: OverlayProps);
}
export class Table<T = unknown> extends Primitive<
  TableProps<T, Promise<import("./shared").RangeResult<T>>>
> {
  constructor(props: TableProps<T, Promise<import("./shared").RangeResult<T>>>);
}
export class Transcript extends Primitive<TranscriptProps> {
  constructor(props: TranscriptProps);
}
export class SplitPane extends Primitive<SplitPaneProps> {
  constructor(props: SplitPaneProps);
}
export class FocusScope extends Primitive<FocusScopeProps> {
  constructor(props: FocusScopeProps);
}

export class Button extends Primitive<ButtonProps> {
  constructor(props: ButtonProps);
}
export class ToggleButton extends Primitive<ToggleButtonProps> {
  constructor(props: ToggleButtonProps);
}
export class Checkbox extends Primitive<CheckboxProps> {
  constructor(props: CheckboxProps);
}
export class Radio extends Primitive<RadioProps> {
  constructor(props: RadioProps);
}
export class RadioGroup extends Primitive<RadioGroupProps> {
  constructor(props: RadioGroupProps);
}
export class ProgressBar extends Primitive<ProgressProps> {
  constructor(props: ProgressProps);
}
export class Meter extends Primitive<ProgressProps> {
  constructor(props: ProgressProps);
}
export class Spinner extends Primitive<ProgressProps> {
  constructor(props: ProgressProps);
}
export class Menu extends Primitive<MenuProps> {
  constructor(props: MenuProps);
}
export class MenuItem extends Primitive<MenuItemProps> {
  constructor(props: MenuItemProps);
}
export class MenuBar extends Primitive<MenuProps> {
  constructor(props: MenuProps);
}
export class ContextMenu extends Primitive<MenuProps> {
  constructor(props: MenuProps);
}
export class Dialog extends Primitive<DialogProps> {
  constructor(props: DialogProps);
}
export class AlertDialog extends Primitive<DialogProps> {
  constructor(props: DialogProps);
}
export class Select<T = unknown> extends Primitive<
  SelectProps<T, Promise<import("./shared").RangeResult<T>>>
> {
  constructor(
    props: SelectProps<T, Promise<import("./shared").RangeResult<T>>>,
  );
}
export class ListBox<T = unknown> extends Primitive<
  SelectProps<T, Promise<import("./shared").RangeResult<T>>>
> {
  constructor(
    props: SelectProps<T, Promise<import("./shared").RangeResult<T>>>,
  );
}
export class Tabs extends Primitive<TabsProps> {
  constructor(props: TabsProps);
}
export class CommandPalette<T = unknown> extends Primitive<
  SelectProps<T, Promise<import("./shared").RangeResult<T>>>
> {
  constructor(
    props: SelectProps<T, Promise<import("./shared").RangeResult<T>>>,
  );
}
export class CodeView extends Primitive<CodeViewProps> {
  constructor(props: CodeViewProps);
}
export class DiffView extends Primitive<DiffViewProps> {
  constructor(props: DiffViewProps);
}
export class Toast extends Primitive<ToastProps> {
  constructor(props: ToastProps);
}
export class Notification extends Primitive<ToastProps> {
  constructor(props: ToastProps);
}

export interface ImperativeApp {
  setRoot(root: Primitive): void;
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
  encoding: "utf-8" | "utf-16le" | "utf-16be",
): string;
export function toStyledText(
  value: unknown,
  adapter: (value: unknown) => import("./shared").StyledText,
): import("./shared").StyledText;
export function componentId(value: string): import("./shared").ComponentId;
export function commandId(value: string): import("./shared").CommandId;
export function transcriptBlockId(
  value: string,
): import("./shared").TranscriptBlockId;
