export type Brand<T, Name extends string> = T & { readonly __brand: Name };

export type ComponentId = Brand<string, "ComponentId">;
export type CommandId = Brand<string, "CommandId">;
export type KeymapScopeId = Brand<string, "KeymapScopeId">;
export type TranscriptBlockId = Brand<string, "TranscriptBlockId">;
export type GraphemeIndex = Brand<number, "GraphemeIndex">;
export type CollectionKey = string | number;

export interface GraphemeRange {
  readonly start: GraphemeIndex;
  readonly end: GraphemeIndex;
}

export type TextEncoding = "utf-8" | "utf-16le" | "utf-16be";
export type TextSearchDirection = "forward" | "backward";

export interface TextSearchOptions {
  readonly from?: GraphemeIndex;
  readonly direction?: TextSearchDirection;
  readonly caseSensitive?: boolean;
  readonly wholeWord?: boolean;
}

export interface TextMatch {
  readonly range: GraphemeRange;
  readonly text: string;
}

export type Color =
  | string
  | {
      readonly r: number;
      readonly g: number;
      readonly b: number;
      readonly a?: number;
    };

export interface ThemeTextValue {
  readonly text: string;
}

export type ThemeTokenValue = Color | number | boolean | ThemeTextValue;

export interface ThemeTokenReference<Value extends ThemeTokenValue> {
  readonly token: string;
  readonly fallback?: Value;
}

export type StyleColor = Color | ThemeTokenReference<Color>;
export type StyleNumber = number | ThemeTokenReference<number>;
export type StyleBoolean = boolean | ThemeTokenReference<boolean>;
export type BorderStyle = "none" | "single" | "double" | "rounded" | "heavy";
export type StyleBorder = BorderStyle | ThemeTokenReference<BorderStyle>;

export type Dimension =
  | number
  | `${number}%`
  | "auto"
  | "min-content"
  | "max-content"
  | {
      readonly min?: number | `${number}%`;
      readonly preferred?: number | `${number}%`;
      readonly max?: number | `${number}%`;
    };

export interface ResponsiveCondition {
  readonly minWidthCells?: number;
  readonly maxWidthCells?: number;
  readonly minHeightCells?: number;
  readonly maxHeightCells?: number;
  readonly minWidthPercent?: number;
  readonly maxWidthPercent?: number;
  readonly minHeightPercent?: number;
  readonly maxHeightPercent?: number;
}

export type FlexDirection = "row" | "row-reverse" | "column" | "column-reverse";
export type FlexWrap = "nowrap" | "wrap" | "wrap-reverse";
export type AlignMode = "start" | "end" | "center" | "stretch" | "baseline";
export type JustifyMode =
  | "start"
  | "end"
  | "center"
  | "space-between"
  | "space-around"
  | "space-evenly";
export type GridTrack =
  | Dimension
  | { readonly fraction: number }
  | { readonly minmax: readonly [Dimension, Dimension] };

export interface GridPlacement {
  readonly row?: number;
  readonly column?: number;
  readonly rowSpan?: number;
  readonly columnSpan?: number;
}

export interface LayoutSpec {
  readonly display?: "flex" | "grid";
  readonly position?: "relative" | "absolute";
  readonly width?: Dimension;
  readonly height?: Dimension;
  readonly minWidth?: Dimension;
  readonly maxWidth?: Dimension;
  readonly minHeight?: Dimension;
  readonly maxHeight?: Dimension;
  readonly grow?: number;
  readonly shrink?: number;
  readonly flexBasis?: Dimension;
  readonly flexDirection?: FlexDirection;
  readonly flexWrap?: FlexWrap;
  readonly alignItems?: AlignMode;
  readonly alignSelf?: AlignMode | "auto";
  readonly alignContent?: JustifyMode | "stretch";
  readonly justifyContent?: JustifyMode;
  readonly gap?: number;
  readonly rowGap?: number;
  readonly columnGap?: number;
  readonly gridTemplateRows?: readonly GridTrack[];
  readonly gridTemplateColumns?: readonly GridTrack[];
  readonly gridPlacement?: GridPlacement;
  readonly top?: Dimension;
  readonly right?: Dimension;
  readonly bottom?: Dimension;
  readonly left?: Dimension;
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
  readonly foreground?: StyleColor;
  readonly background?: StyleColor;
  readonly bold?: StyleBoolean;
  readonly italic?: StyleBoolean;
  readonly underline?: StyleBoolean;
  readonly dim?: StyleBoolean;
  readonly inverse?: StyleBoolean;
  readonly border?: StyleBorder;
  readonly padding?:
    | number
    | readonly [number, number]
    | readonly [number, number, number, number]
    | ThemeTokenReference<number>;
  readonly opacity?: StyleNumber;
  readonly variants?: readonly {
    readonly when: StyleCondition;
    readonly style: StyleSpec;
  }[];
}

export interface StyleSheet<Rule extends string = string> {
  readonly name: string;
  readonly rules: Readonly<Record<Rule, StyleSpec>>;
}

export type ThemeTokens = Readonly<Record<string, ThemeTokenValue>>;
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
  readonly cellWidthPixels?: number;
  readonly cellHeightPixels?: number;
  readonly terminalWidthPixels?: number;
  readonly terminalHeightPixels?: number;
  readonly themeDetection: boolean;
  readonly paletteDetection: boolean;
  readonly detectedTheme: "light" | "dark" | "unknown";
  readonly ambiguousWidth: 1 | 2 | "negotiated";
  readonly multiplexer: "none" | "tmux" | "zellij" | "screen" | "unknown";
  readonly widthNegotiation: boolean;
}

export interface TerminalProfile {
  readonly schemaVersion: "1.0.0";
  readonly name: string;
  readonly tier: "modern" | "compatible";
  readonly width: number;
  readonly height: number;
  readonly cellWidthPixels?: number;
  readonly cellHeightPixels?: number;
  readonly colorDepth: 16 | 256 | 16_777_216;
  readonly theme?: "light" | "dark" | "unknown";
  readonly multiplexer: "none" | "tmux" | "zellij" | "screen" | "unknown";
  readonly ambiguousWidth?: 1 | 2 | "negotiated";
  readonly capabilities: Readonly<{
    synchronizedOutput: boolean;
    hyperlinks: boolean;
    enhancedKeyboard: boolean;
    pointer: boolean;
    focus: boolean;
    pasteEvents: boolean;
    richClipboard: boolean;
    pixelGeometry: boolean;
    themeDetection: boolean;
    paletteDetection: boolean;
    widthNegotiation: boolean;
  }>;
}

export interface TuvrenEventPayloadMap {
  readonly key: Readonly<{
    action: "press" | "repeat" | "release";
    keyCode: number;
    physicalCode?: number;
    text?: string;
    modifiers: readonly ("shift" | "control" | "alt" | "super")[];
  }>;
  readonly text: Readonly<{ text: string }>;
  readonly pointerMove: Readonly<{
    cellX: number;
    cellY: number;
    pixelX?: number;
    pixelY?: number;
    buttons: readonly number[];
    modifiers: readonly string[];
  }>;
  readonly pointerButton: Readonly<{
    action: "press" | "release";
    cellX: number;
    cellY: number;
    button: number;
    clickCount: number;
    modifiers: readonly string[];
  }>;
  readonly wheel: Readonly<{
    cellX: number;
    cellY: number;
    deltaRows: number;
    deltaColumns: number;
    deltaPixelX?: number;
    deltaPixelY?: number;
    modifiers: readonly string[];
  }>;
  readonly focus: Readonly<Record<never, never>>;
  readonly blur: Readonly<Record<never, never>>;
  readonly resize: Readonly<{
    widthCells: number;
    heightCells: number;
    widthPixels?: number;
    heightPixels?: number;
    cellWidthPixels?: number;
    cellHeightPixels?: number;
  }>;
  readonly paste: Readonly<{ text: string; truncated: boolean }>;
  readonly clipboard: Readonly<{
    requestId: bigint;
    status:
      | "unavailable"
      | "denied"
      | "busy"
      | "completed"
      | "malformed"
      | "timed-out";
    target: ClipboardTarget;
    mediaType?: string;
    bytes?: Uint8Array;
    finalChunk: boolean;
  }>;
  readonly range: Readonly<{
    state: "loading" | "empty" | "ready" | "error";
    start: number;
    count: number;
    totalCount: number;
    generation: number;
    retryable: boolean;
    message?: string;
  }>;
  readonly eviction: Readonly<{
    resource: "collection" | "transcript";
    identities: readonly (CollectionKey | TranscriptBlockId)[];
    generation: number;
  }>;
  readonly animation: Readonly<{
    animationId: bigint;
    status: "completed" | "cancelled" | "replaced";
  }>;
  readonly announcement: Readonly<{
    text: string;
    politeness: "polite" | "assertive";
  }>;
  readonly terminal: Readonly<{
    kind:
      | "capabilities-changed"
      | "suspended"
      | "resumed"
      | "disconnected"
      | "write-failed";
    status: string;
    capabilities?: TerminalCapabilities;
  }>;
}

export type TuvrenEvent<
  Type extends keyof TuvrenEventPayloadMap = keyof TuvrenEventPayloadMap,
> = {
  readonly [Kind in Type]: {
    readonly id: bigint;
    readonly type: Kind;
    readonly target?: ComponentId;
    readonly timestampNanos: bigint;
    readonly cancelable: boolean;
    readonly payload: TuvrenEventPayloadMap[Kind];
  };
}[Type];

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
export type TextValidationRule =
  | Readonly<{
      kind: "minimum-length";
      graphemes: number;
      message: string;
    }>
  | Readonly<{
      kind: "maximum-length";
      graphemes: number;
      message: string;
    }>
  | Readonly<{
      kind: "pattern";
      pattern: string;
      flags?: "i" | "m" | "im";
      message: string;
    }>;

export interface TextDocumentConfig {
  readonly readOnly?: boolean;
  readonly secure?: boolean;
  readonly maxLength?: number;
  readonly required?: boolean;
  readonly validation?: readonly TextValidationRule[];
  readonly lineEnding?: "lf" | "crlf";
  readonly tabWidth?: number;
}
export interface InputProps
  extends
    CommonProps<"root" | "value" | "placeholder" | "cursor">,
    TextDocumentConfig {
  readonly value?: string;
  readonly defaultValue?: string;
  readonly onValueChange?: (value: string) => void;
  readonly placeholder?: string;
  readonly name?: string;
  readonly error?: string;
  readonly onSubmit?: (value: string) => void;
}
export interface TextAreaProps extends InputProps {
  readonly wrap?: "soft" | "none";
}

export interface TextDocumentSnapshot {
  readonly content: string;
  readonly cursor?: GraphemeIndex;
  readonly selection?: GraphemeRange;
  readonly canUndo: boolean;
  readonly canRedo: boolean;
  readonly version: number;
}

export interface TextDocument {
  snapshot(): TextDocumentSnapshot;
  setCursor(index: GraphemeIndex): void;
  setSelection(range: GraphemeRange | undefined): void;
  moveCursor(
    unit: "grapheme" | "word" | "line" | "document",
    direction: "backward" | "forward",
    extendSelection?: boolean,
  ): void;
  insert(text: string): void;
  delete(range?: GraphemeRange): void;
  replace(range: GraphemeRange, text: string): void;
  find(query: string, options?: TextSearchOptions): TextMatch | undefined;
  replaceMatch(match: TextMatch, replacement: string): void;
  replaceAll(
    query: string,
    replacement: string,
    options?: TextSearchOptions,
  ): number;
  undo(): boolean;
  redo(): boolean;
  encode(encoding?: TextEncoding): Uint8Array;
}

export interface RangeRequest {
  readonly start: number;
  readonly count: number;
  readonly generation: number;
  readonly signal: AbortSignal;
}
export interface RangeResult<T> {
  readonly generation: number;
  readonly totalCount: number;
  readonly start: number;
  readonly items: readonly T[];
}
export type RangeLoadResult<T> =
  | { readonly state: "loading"; readonly generation: number }
  | {
      readonly state: "empty";
      readonly generation: number;
      readonly totalCount: 0;
    }
  | ({ readonly state: "ready" } & RangeResult<T>)
  | {
      readonly state: "error";
      readonly generation: number;
      readonly message: string;
      readonly retryable: boolean;
    };

export type CollectionMutation<T> =
  | {
      readonly type: "insert";
      readonly index: number;
      readonly item: T;
      readonly generation: number;
    }
  | {
      readonly type: "update";
      readonly key: CollectionKey;
      readonly item: T;
      readonly generation: number;
    }
  | {
      readonly type: "remove";
      readonly key: CollectionKey;
      readonly generation: number;
    }
  | {
      readonly type: "move";
      readonly key: CollectionKey;
      readonly to: number;
      readonly generation: number;
    }
  | {
      readonly type: "reset";
      readonly items: readonly T[];
      readonly generation: number;
    }
  | {
      readonly type: "selection";
      readonly keys: readonly CollectionKey[];
      readonly generation: number;
    };

export interface DataSource<T, LoadResult> {
  readonly getKey: (item: T) => CollectionKey;
  readonly loadRange: (request: RangeRequest) => LoadResult;
  readonly reload?: (generation: number) => LoadResult;
}

export interface CollectionController<T> {
  apply(mutation: CollectionMutation<T>): void;
  reload(): void;
  scrollToKey(
    key: CollectionKey,
    alignment?: "start" | "center" | "end" | "nearest",
  ): void;
  focusKey(key: CollectionKey | undefined): void;
  setSelection(keys: readonly CollectionKey[]): void;
  visibleRange(): Readonly<{ start: number; end: number; generation: number }>;
}

export interface VirtualCollectionBinding<
  T,
  LoadResult = never,
  Mutations = never,
> {
  readonly items?: readonly T[];
  readonly dataSource?: DataSource<T, LoadResult>;
  readonly mutations?: Mutations;
  readonly controller?: CollectionController<T>;
  readonly estimatedCount?: number;
  readonly onVisibleRangeChange?: (
    range: Readonly<{ start: number; end: number; generation: number }>,
  ) => void;
  readonly onFocusChange?: (key: CollectionKey | undefined) => void;
  readonly onReloadRequest?: (generation: number) => void;
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
export interface TableProps<T = unknown, LoadResult = never, Mutations = never>
  extends
    CommonProps<"root" | "header" | "row" | "cell">,
    VirtualCollectionBinding<T, LoadResult, Mutations> {
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
  readonly onReloadRequest?: (request: RangeRequest) => void;
  readonly onVisibleRangeChange?: (
    range: Readonly<{ start: number; end: number; generation: number }>,
  ) => void;
}

export type TranscriptOperation =
  | { readonly type: "append"; readonly block: TranscriptBlock }
  | {
      readonly type: "insert";
      readonly index: number;
      readonly block: TranscriptBlock;
    }
  | { readonly type: "replace"; readonly block: TranscriptBlock }
  | {
      readonly type: "patch";
      readonly id: TranscriptBlockId;
      readonly range: GraphemeRange;
      readonly text: string;
      readonly version: number;
    }
  | { readonly type: "remove"; readonly id: TranscriptBlockId }
  | {
      readonly type: "stream";
      readonly id: TranscriptBlockId;
      readonly chunk: string;
      readonly version: number;
    }
  | {
      readonly type: "finish";
      readonly id: TranscriptBlockId;
      readonly version: number;
    }
  | {
      readonly type: "collapse";
      readonly id: TranscriptBlockId;
    }
  | {
      readonly type: "expand";
      readonly id: TranscriptBlockId;
    }
  | {
      readonly type: "clear";
      readonly generation: number;
    }
  | {
      readonly type: "evict";
      readonly ids: readonly TranscriptBlockId[];
      readonly generation: number;
    }
  | {
      readonly type: "reload";
      readonly start: number;
      readonly blocks: readonly TranscriptBlock[];
      readonly generation: number;
    }
  | {
      readonly type: "reset";
      readonly blocks: readonly TranscriptBlock[];
      readonly generation: number;
    };

export interface TranscriptController {
  apply(operation: TranscriptOperation): void;
  scrollTo(
    id: TranscriptBlockId,
    alignment?: "start" | "center" | "end" | "nearest",
  ): void;
  followLiveEdge(enabled: boolean): void;
  visibleRange(): Readonly<{ start: number; end: number; generation: number }>;
}
export interface SplitPaneProps extends CommonProps<
  "root" | "first" | "divider" | "second"
> {
  readonly axis?: "horizontal" | "vertical";
  readonly ratio?: number;
  readonly defaultRatio?: number;
  readonly onRatioChange?: (ratio: number) => void;
}
export interface SelectProps<T = unknown, LoadResult = never, Mutations = never>
  extends
    CommonProps<"root" | "trigger" | "list" | "option">,
    VirtualCollectionBinding<T, LoadResult, Mutations> {
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

export type ButtonProps = CommonProps<"root" | "label" | "indicator"> &
  (
    | { readonly command: CommandId; readonly onPress?: never }
    | { readonly command?: never; readonly onPress: () => void }
    | { readonly command?: never; readonly onPress?: never }
  );
export type ToggleButtonProps = ButtonProps & {
  readonly pressed?: boolean;
  readonly defaultPressed?: boolean;
  readonly onPressedChange?: (pressed: boolean) => void;
};
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
export interface MenuProps<T = unknown, LoadResult = never, Mutations = never>
  extends
    CommonProps<"root" | "item" | "separator">,
    VirtualCollectionBinding<T, LoadResult, Mutations> {
  readonly getKey?: (item: T) => CollectionKey;
  readonly renderItem?: (item: T) => View;
}
export interface MenuItemProps extends CommonProps<
  "root" | "label" | "keybinding"
> {
  readonly command?: CommandId;
}

export interface CommandPaletteProps<
  T = unknown,
  LoadResult = never,
  Mutations = never,
> extends SelectProps<T, LoadResult, Mutations> {
  readonly commandForItem: (item: T) => CommandId;
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
  readonly easing?: "linear" | "ease-in" | "ease-out" | "ease-in-out";
  readonly repeat?: number | "infinite";
  readonly reverse?: boolean;
  readonly reducedMotion?: "finish" | "skip" | "replace";
}

export interface AnimationTimeline {
  readonly animations: readonly AnimationSpec[];
  readonly mode?: "sequence" | "parallel";
}

export type AnimationCompletion = "completed" | "cancelled" | "replaced";

export interface KeymapScope {
  readonly id: KeymapScopeId;
  readonly parent?: KeymapScopeId;
  readonly priority?: number;
}

export interface KeymapRebinding {
  readonly command: CommandId;
  readonly keys: string | null;
  readonly scope: KeymapScopeId;
}

export interface KeymapConflict {
  readonly keys: string;
  readonly scope: KeymapScopeId;
  readonly commands: readonly CommandId[];
  readonly winner: CommandId;
  readonly reason:
    "priority" | "scope-depth" | "rebinding" | "registration-order";
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
