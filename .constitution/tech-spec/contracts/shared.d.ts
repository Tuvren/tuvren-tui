export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type ComponentId = Brand<string, "ComponentId">;
export type CommandId = Brand<string, "CommandId">;
export type TranscriptBlockId = Brand<string, "TranscriptBlockId">;
export type CollectionKey = string | number;

export type Color =
  | string
  | {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a?: number;
    };

export type Dimension =
  | number
  | `${number}%`
  | "auto"
  | "min-content"
  | "max-content"
  | {
      readonly min?: number;
      readonly preferred?: number | `${number}%`;
      readonly max?: number;
    };

export interface ResponsiveCondition {
  readonly minWidthCells?: number;
  readonly maxWidthCells?: number;
  readonly minHeightCells?: number;
  readonly maxHeightCells?: number;
  readonly minWidthPercent?: number;
  readonly maxWidthPercent?: number;
}

export interface LayoutSpec {
  readonly display?: "flex" | "grid" | "absolute";
  readonly width?: Dimension;
  readonly height?: Dimension;
  readonly minWidth?: Dimension;
  readonly maxWidth?: Dimension;
  readonly minHeight?: Dimension;
  readonly maxHeight?: Dimension;
  readonly grow?: number;
  readonly shrink?: number;
  readonly gap?: number;
  readonly aspectRatio?: number;
  readonly overflow?: "clip" | "scroll" | "minimum-size-error";
  readonly responsive?: readonly {
    readonly when: ResponsiveCondition;
    readonly layout: LayoutSpec;
  }[];
}

export type StyleState =
  | "focused"
  | "pointer-over"
  | "active"
  | "disabled"
  | "selected"
  | "checked"
  | "mixed"
  | "expanded"
  | "invalid";

export interface StyleCondition extends ResponsiveCondition {
  readonly state?: StyleState;
  readonly mode?: "light" | "dark";
  readonly reducedMotion?: boolean;
  readonly capabilityTier?: "modern" | "compatible";
  readonly minColors?: 16 | 256 | 16_777_216;
}

export interface StyleSpec {
  readonly foreground?: Color;
  readonly background?: Color;
  readonly bold?: boolean;
  readonly italic?: boolean;
  readonly underline?: boolean;
  readonly dim?: boolean;
  readonly inverse?: boolean;
  readonly border?: "none" | "single" | "double" | "rounded" | "heavy";
  readonly padding?:
    | number
    | readonly [number, number]
    | readonly [number, number, number, number];
  readonly opacity?: number;
  readonly variants?: readonly {
    readonly when: StyleCondition;
    readonly style: StyleSpec;
  }[];
}

export interface StyleSheet<Rule extends string = string> {
  readonly name: string;
  readonly rules: Readonly<Record<Rule, StyleSpec>>;
}

export type ThemeTokens = Readonly<
  Record<string, Color | number | string | boolean>
>;
export type ThemeRecipes = Readonly<Record<string, StyleSheet>>;

export interface Theme {
  readonly name: string;
  readonly tokens: ThemeTokens;
  readonly recipes: ThemeRecipes;
}

export interface StyledSpan {
  readonly text: string;
  readonly style?: StyleSpec;
  readonly link?: string;
}

export interface StyledText {
  readonly spans: readonly StyledSpan[];
}

export type TextContent =
  | string
  | StyledText
  | { readonly format: "markdown"; readonly source: string }
  | {
      readonly format: "code";
      readonly source: string;
      readonly language?: string;
    }
  | { readonly format: "ansi"; readonly source: string };

export type ScreenMode = "alternate" | "inline" | "split-footer" | "headless";
export type ExternalOutputMode =
  "capture" | "scrollback" | "passthrough" | "disabled";

export interface TerminalCapabilities {
  readonly tier: "modern" | "compatible";
  readonly colorDepth: 16 | 256 | 16_777_216;
  readonly synchronizedOutput: boolean;
  readonly hyperlinks: boolean;
  readonly enhancedKeyboard: boolean;
  readonly pointer: boolean;
  readonly focus: boolean;
  readonly pasteEvents: boolean;
  readonly richClipboard: boolean;
  readonly pixelGeometry: boolean;
  readonly themeDetection: boolean;
  readonly widthNegotiation: boolean;
}

export interface TuvrenEvent<Payload = unknown> {
  readonly id: bigint;
  readonly type: string;
  readonly target?: ComponentId;
  readonly timestampNanos: bigint;
  readonly cancelable: boolean;
  readonly payload: Payload;
}

export interface SemanticSpec {
  readonly role?: string;
  readonly name?: string;
  readonly description?: string;
  readonly value?: string | number;
  readonly states?: Readonly<Record<string, boolean | string | number>>;
  readonly relationships?: Readonly<Record<string, readonly ComponentId[]>>;
}

export interface CommonProps<Slot extends string = never> {
  readonly id?: ComponentId;
  readonly children?: ViewChildren;
  readonly layout?: LayoutSpec;
  readonly style?: StyleSpec;
  readonly styleSheet?: StyleSheet;
  readonly slotStyles?: Partial<Record<Slot, StyleSpec>>;
  readonly semantic?: SemanticSpec;
  readonly disabled?: boolean;
  readonly draggable?: boolean;
  readonly dropTarget?: boolean;
  readonly onDragStart?: (event: TuvrenEvent) => void;
  readonly onDrag?: (event: TuvrenEvent) => void;
  readonly onDrop?: (event: TuvrenEvent) => void;
  readonly onEvent?: (event: TuvrenEvent) => void;
}

export interface BoxProps extends CommonProps<"root"> {}
export interface TextProps extends CommonProps<"root"> {
  readonly content: TextContent;
}
export interface InputProps extends CommonProps<
  "root" | "value" | "placeholder" | "cursor"
> {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly readOnly?: boolean;
  readonly secure?: boolean;
  readonly maxLength?: number;
  readonly name?: string;
  readonly required?: boolean;
  readonly error?: string;
  readonly validate?: (value: string) => string | undefined;
  readonly onSubmit?: (value: string) => void;
}
export interface TextAreaProps extends InputProps {
  readonly wrap?: "soft" | "none";
  readonly tabWidth?: number;
  readonly lineEnding?: "lf" | "crlf";
}
export interface RangeRequest {
  readonly start: number;
  readonly count: number;
  readonly generation: number;
}
export interface RangeResult<T> {
  readonly generation: number;
  readonly totalCount: number;
  readonly start: number;
  readonly items: readonly T[];
}
export interface DataSource<T, LoadResult> {
  readonly getKey: (item: T) => CollectionKey;
  readonly loadRange: (request: RangeRequest) => LoadResult;
}
export interface ScrollBoxProps extends CommonProps<
  "root" | "viewport" | "scrollbar"
> {
  readonly scrollRow?: number;
  readonly defaultScrollRow?: number;
  readonly onScrollChange?: (row: number) => void;
}
export interface OverlayProps extends CommonProps<"backdrop" | "root"> {
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}
export interface TableColumn<T = unknown> {
  readonly key: string;
  readonly header: View;
  readonly render: (item: T) => View;
  readonly width?: Dimension;
}
export interface TableProps<
  T = unknown,
  LoadResult = never,
> extends CommonProps<"root" | "header" | "row" | "cell"> {
  readonly items?: readonly T[];
  readonly dataSource?: DataSource<T, LoadResult>;
  readonly estimatedCount?: number;
  readonly getKey: (item: T) => CollectionKey;
  readonly columns: readonly TableColumn<T>[];
  readonly selectedKeys?: readonly CollectionKey[];
  readonly onSelectionChange?: (keys: readonly CollectionKey[]) => void;
}
export interface TranscriptBlock {
  readonly id: TranscriptBlockId;
  readonly version: number;
  readonly content: TextContent;
  readonly streaming?: boolean;
  readonly collapsed?: boolean;
}
export interface TranscriptProps extends CommonProps<
  "root" | "block" | "liveIndicator"
> {
  readonly blocks?: readonly TranscriptBlock[];
  readonly defaultBlocks?: readonly TranscriptBlock[];
  readonly mode: "controlled" | "bounded-local";
  readonly maxResidentBlocks?: number;
  readonly onRangeChange?: (start: number, end: number) => void;
  readonly onEvict?: (ids: readonly TranscriptBlockId[]) => void;
}
export interface SplitPaneProps extends CommonProps<
  "root" | "first" | "divider" | "second"
> {
  readonly axis?: "horizontal" | "vertical";
  readonly ratio?: number;
  readonly defaultRatio?: number;
  readonly onRatioChange?: (ratio: number) => void;
}
export interface SelectProps<
  T = unknown,
  LoadResult = never,
> extends CommonProps<"root" | "trigger" | "list" | "option"> {
  readonly items?: readonly T[];
  readonly dataSource?: DataSource<T, LoadResult>;
  readonly estimatedCount?: number;
  readonly selectedKey?: CollectionKey;
  readonly defaultSelectedKey?: CollectionKey;
  readonly getKey: (item: T) => CollectionKey;
  readonly renderItem: (item: T) => View;
  readonly onSelectionChange?: (key: CollectionKey | undefined) => void;
  readonly error?: string;
  readonly validate?: (key: CollectionKey | undefined) => string | undefined;
  readonly onSubmit?: (key: CollectionKey | undefined) => void;
}

export interface ComponentType<Props = object> {
  (props: Props): View;
}

export type View = ViewNode | string | number | boolean | null | undefined;
export type ViewChildren = View | readonly View[];

export interface ViewNode {
  readonly type: string | ComponentType<never>;
  readonly key?: CollectionKey;
  readonly props: Readonly<Record<string, unknown>>;
}

export interface ButtonProps extends CommonProps<
  "root" | "label" | "indicator"
> {
  readonly onPress?: () => void;
}
export interface ToggleButtonProps extends ButtonProps {
  readonly pressed?: boolean;
  readonly defaultPressed?: boolean;
  readonly onPressedChange?: (pressed: boolean) => void;
}
export interface CheckboxProps extends CommonProps<"root" | "box" | "label"> {
  readonly checked?: boolean | "mixed";
  readonly defaultChecked?: boolean | "mixed";
  readonly onCheckedChange?: (checked: boolean | "mixed") => void;
  readonly error?: string;
  readonly onSubmit?: (checked: boolean | "mixed") => void;
}
export interface RadioProps extends CommonProps<
  "root" | "indicator" | "label"
> {
  readonly value: string;
}
export interface RadioGroupProps extends CommonProps<"root" | "item"> {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly error?: string;
  readonly onSubmit?: (value: string) => void;
}
export interface ProgressProps extends CommonProps<
  "root" | "track" | "fill" | "label"
> {
  readonly value?: number;
  readonly min?: number;
  readonly max?: number;
}
export interface MenuProps extends CommonProps<"root" | "item" | "separator"> {}
export interface MenuItemProps extends CommonProps<
  "root" | "label" | "keybinding"
> {
  readonly command?: CommandId;
}
export interface DialogProps extends CommonProps<
  "backdrop" | "root" | "title" | "description" | "actions"
> {
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (open: boolean) => void;
}
export interface TabsProps extends CommonProps<
  "root" | "tabList" | "tab" | "panel"
> {
  readonly selectedKey?: CollectionKey;
  readonly defaultSelectedKey?: CollectionKey;
  readonly onSelectionChange?: (key: CollectionKey) => void;
}
export interface CodeViewProps extends CommonProps<
  "root" | "gutter" | "content" | "selection"
> {
  readonly content: string;
  readonly language?: string;
}
export interface DiffViewProps extends CodeViewProps {
  readonly previous: string;
  readonly mode?: "unified" | "split";
}
export interface ToastProps extends CommonProps<
  "root" | "title" | "description" | "actions"
> {
  readonly durationMs?: number;
}

export interface FocusScopeProps extends CommonProps<"root"> {
  readonly contain?: boolean;
  readonly restoreFocus?: boolean;
  readonly modal?: boolean;
}

export interface ErrorBoundaryProps extends CommonProps<"root" | "fallback"> {
  readonly fallback: View | ((error: TuvrenError) => View);
}

export interface AnimationSpec {
  readonly property:
    | "foreground"
    | "background"
    | "opacity"
    | "position-x"
    | "position-y"
    | "width"
    | "height"
    | "scroll-row"
    | "scroll-column";
  readonly from?: number | Color;
  readonly to: number | Color;
  readonly durationMs: number;
  readonly delayMs?: number;
  readonly easing?: string;
  readonly repeat?: number | "infinite";
  readonly reverse?: boolean;
  readonly reducedMotion?: "finish" | "skip" | "replace";
}

export interface AnimationTimeline {
  readonly animations: readonly AnimationSpec[];
  readonly mode?: "sequence" | "parallel";
}

export interface ClipboardPayload {
  readonly mediaType: string;
  readonly bytes: Uint8Array;
}

export type ClipboardTarget = "clipboard" | "primary";

export class TuvrenError extends Error {
  readonly code: string;
  readonly category: string;
  readonly operation: string;
  readonly component?: ComponentId;
  readonly cause?: unknown;
  readonly remediation: string;
}
