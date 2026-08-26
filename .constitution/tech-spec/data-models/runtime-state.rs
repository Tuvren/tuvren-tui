#![allow(dead_code)]

use std::collections::{BTreeMap, VecDeque};

pub const EVENT_QUEUE_MAX_RECORDS: usize = 4_096;
pub const EVENT_QUEUE_MAX_BYTES: usize = 4 * 1024 * 1024;
pub const GRAPHEME_POOL_MAX_ENTRIES: usize = 262_144;
pub const GRAPHEME_POOL_MAX_BYTES: usize = 16 * 1024 * 1024;
pub const COLLECTION_MAX_RESIDENT_ITEMS: usize = 10_000;
pub const COLLECTION_MAX_RESIDENT_BYTES: usize = 32 * 1024 * 1024;
pub const TRANSCRIPT_MAX_RESIDENT_BLOCKS: usize = 10_000;
pub const TRANSCRIPT_MAX_RESIDENT_BYTES: usize = 64 * 1024 * 1024;
pub const TEXT_DOCUMENT_DEFAULT_MAX_BYTES: usize = 10 * 1024 * 1024;
pub const TEXT_DOCUMENT_HARD_MAX_BYTES: usize = 100 * 1024 * 1024;
pub const TERMINAL_MAX_PENDING_REQUESTS: usize = 64;
pub const TERMINAL_MAX_PENDING_BYTES: usize = 16 * 1024 * 1024;
pub const DIAGNOSTIC_MAX_LIVE_BYTES: usize = 64 * 1024 * 1024;

#[repr(transparent)]
#[derive(Clone, Copy, Debug, Default, Eq, Ord, PartialEq, PartialOrd)]
pub struct ContextId(pub u32);

#[repr(transparent)]
#[derive(Clone, Copy, Debug, Default, Eq, Ord, PartialEq, PartialOrd)]
pub struct RuntimeNodeId(pub u32);

#[repr(transparent)]
#[derive(Clone, Copy, Debug, Default, Eq, Ord, PartialEq, PartialOrd)]
pub struct TextDocumentId(pub u32);

#[repr(transparent)]
#[derive(Clone, Copy, Debug, Default, Eq, Ord, PartialEq, PartialOrd)]
pub struct GraphemeId(pub u32);

#[derive(Clone, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub enum CollectionKey {
    Utf8(String),
    CanonicalNumberBits(u64),
}

#[derive(Clone, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub struct TranscriptBlockId(pub String);

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum DisplayMode {
    Flex,
    Grid,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum PositionMode {
    Relative,
    Absolute,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum FlexDirection { Row, RowReverse, Column, ColumnReverse }

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum FlexWrap { NoWrap, Wrap, WrapReverse }

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum AlignMode { Start, End, Center, Stretch, Baseline }

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum JustifyMode { Start, End, Center, SpaceBetween, SpaceAround, SpaceEvenly, Stretch }

#[derive(Clone, Debug, PartialEq)]
pub enum GridTrack { Dimension(DimensionSpec), Fraction(f32), MinMax(DimensionSpec, DimensionSpec) }

#[derive(Clone, Copy, Debug, Default, Eq, PartialEq)]
pub struct GridPlacement { pub row: Option<u32>, pub column: Option<u32>, pub row_span: u32, pub column_span: u32 }

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum DimensionAtom {
    Cells(f32),
    Percent(f32),
    Auto,
    MinContent,
    MaxContent,
}

#[derive(Clone, Debug, PartialEq)]
pub struct DimensionSpec {
    pub minimum: Option<DimensionAtom>,
    pub preferred: DimensionAtom,
    pub maximum: Option<DimensionAtom>,
}

#[derive(Clone, Debug)]
pub struct LayoutSpec {
    pub display: DisplayMode,
    pub position: PositionMode,
    pub width: DimensionSpec,
    pub height: DimensionSpec,
    pub min_width: Option<DimensionSpec>,
    pub max_width: Option<DimensionSpec>,
    pub min_height: Option<DimensionSpec>,
    pub max_height: Option<DimensionSpec>,
    pub grow: f32,
    pub shrink: f32,
    pub flex_basis: DimensionSpec,
    pub flex_direction: FlexDirection,
    pub flex_wrap: FlexWrap,
    pub align_items: AlignMode,
    pub align_self: Option<AlignMode>,
    pub align_content: Option<JustifyMode>,
    pub justify_content: JustifyMode,
    pub row_gap: f32,
    pub column_gap: f32,
    pub grid_template_rows: Vec<GridTrack>,
    pub grid_template_columns: Vec<GridTrack>,
    pub grid_placement: GridPlacement,
    pub top: Option<DimensionSpec>,
    pub right: Option<DimensionSpec>,
    pub bottom: Option<DimensionSpec>,
    pub left: Option<DimensionSpec>,
    pub aspect_ratio: Option<f32>,
    pub overflow: OverflowPolicy,
    pub responsive_rules: Vec<ResponsiveLayoutRule>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum OverflowPolicy {
    Clip,
    Scroll,
    MinimumSizeError,
}

#[derive(Clone, Debug)]
pub struct ResponsiveLayoutRule {
    pub condition: ResponsiveCondition,
    pub replacement: Box<LayoutSpec>,
}

#[derive(Clone, Debug, Default)]
pub struct ResponsiveCondition {
    pub min_width_cells: Option<u32>,
    pub max_width_cells: Option<u32>,
    pub min_height_cells: Option<u32>,
    pub max_height_cells: Option<u32>,
    pub min_width_percent: Option<f32>,
    pub max_width_percent: Option<f32>,
    pub min_height_percent: Option<f32>,
    pub max_height_percent: Option<f32>,
}

#[derive(Clone, Debug)]
pub enum Resolvable<T> {
    Literal(T),
    Token {
        name: String,
        fallback: Option<T>,
    },
}

#[derive(Clone, Debug)]
pub enum ThemeTokenValue {
    Color(u32),
    Number(f64),
    Text(String),
    Boolean(bool),
}

#[derive(Clone, Debug, Default)]
pub struct StyleSpec {
    pub foreground: Option<Resolvable<u32>>,
    pub background: Option<Resolvable<u32>>,
    pub attributes: BTreeMap<u32, Resolvable<bool>>,
    pub border: Option<Resolvable<u8>>,
    pub padding: Option<Resolvable<[u16; 4]>>,
    pub opacity: Option<Resolvable<f32>>,
}

#[derive(Clone, Debug, Default)]
pub struct StyleCondition {
    pub state_mask: u64,
    pub mode: Option<u8>,
    pub reduced_motion: Option<bool>,
    pub capability_tier: Option<u8>,
    pub minimum_colors: Option<u32>,
    pub responsive: ResponsiveCondition,
}

#[derive(Clone, Debug)]
pub struct StyleRule {
    pub name: String,
    pub condition: StyleCondition,
    pub spec: StyleSpec,
    pub source: String,
}

#[derive(Clone, Debug)]
pub struct RegisteredStyleSheet {
    pub id: u32,
    pub name: String,
    pub rules: Vec<StyleRule>,
    pub generation: u64,
}

#[derive(Clone, Debug)]
pub struct ThemeState {
    pub id: u32,
    pub name: String,
    pub tokens: BTreeMap<String, ThemeTokenValue>,
    pub recipes: BTreeMap<String, u32>,
    pub generation: u64,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ContextMode {
    Interactive,
    Headless,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum ContextStatus {
    Initializing,
    Active,
    Suspended,
    Frozen,
    Destroyed,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum TerminalSessionStatus {
    Uninitialized,
    Negotiating,
    ActiveModern,
    ActiveCompatible,
    ClipboardPending,
    Suspended,
    Restoring,
    Closed,
}

#[derive(Clone, Debug)]
pub struct PendingTerminalRequest {
    pub id: u64,
    pub kind: u16,
    pub deadline_nanos: u64,
    pub byte_limit: usize,
    pub received_bytes: usize,
}

#[derive(Clone, Debug, Default)]
pub struct BoundedUsage {
    pub count: usize,
    pub bytes: usize,
    pub evictions: u64,
    pub rejected: u64,
}

#[derive(Clone, Debug)]
pub struct TerminalSessionState {
    pub status: TerminalSessionStatus,
    pub capability_flags: u64,
    pub color_depth: u32,
    pub width_cells: u32,
    pub height_cells: u32,
    pub terminal_width_pixels: Option<u32>,
    pub terminal_height_pixels: Option<u32>,
    pub cell_width_pixels: Option<u32>,
    pub cell_height_pixels: Option<u32>,
    pub detected_theme: u8,
    pub multiplexer: u8,
    pub ambiguous_width: u8,
    pub screen_mode: u8,
    pub output_mode: u8,
    pub pending_requests: BTreeMap<u64, PendingTerminalRequest>,
    pub pending_usage: BoundedUsage,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum PrimitiveKind {
    Box,
    Text,
    Input,
    TextArea,
    Scroll,
    Overlay,
    Collection,
    Transcript,
    Split,
}

#[derive(Clone, Debug)]
pub struct RuntimeNode {
    pub id: RuntimeNodeId,
    pub kind: PrimitiveKind,
    pub parent: Option<RuntimeNodeId>,
    pub children: Vec<RuntimeNodeId>,
    pub layout_spec: LayoutSpec,
    pub style_sheet: Option<u32>,
    pub style_slot: Option<u32>,
    pub theme: Option<u32>,
    pub text_document: Option<TextDocumentId>,
    pub text_content: Option<TextContent>,
    pub semantic: SemanticNode,
    pub state: RuntimeNodeState,
    pub generation: u64,
    pub dirty: DirtyMask,
}

#[derive(Clone, Debug, Default)]
pub struct RuntimeNodeState {
    pub visible: bool,
    pub disabled: bool,
    pub focused: bool,
    pub active: bool,
    pub selected: bool,
    pub checked: Option<bool>,
    pub mixed: bool,
    pub expanded: bool,
    pub invalid: bool,
    pub required: bool,
    pub error: Option<String>,
    pub scroll_row: u32,
    pub scroll_column: u32,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct DirtyMask(pub u64);

#[derive(Clone, Debug, Default)]
pub struct SemanticNode {
    pub role: Option<String>,
    pub name: Option<String>,
    pub description: Option<String>,
    pub value: Option<String>,
    pub states: BTreeMap<String, String>,
    pub relationships: BTreeMap<String, Vec<RuntimeNodeId>>,
}

#[derive(Clone, Debug)]
pub struct TextDocument {
    pub id: TextDocumentId,
    pub utf8: String,
    pub content_epoch: u64,
    pub style_epoch: u64,
    pub grapheme_byte_offsets: Vec<usize>,
    pub line_grapheme_offsets: Vec<u32>,
    pub style_spans: Vec<StyleSpan>,
    pub selection: Option<GraphemeRange>,
    pub cursor: Option<u32>,
    pub config: TextDocumentConfig,
    pub edit_history: Vec<EditOperation>,
    pub undo_cursor: usize,
    pub byte_limit: usize,
    pub rejected_edits: u64,
}

#[derive(Clone, Debug)]
pub enum TextContent {
    Plain(String),
    Styled(Vec<StyledContentSpan>),
    Markdown(String),
    Code { source: String, language: Option<String> },
    SanitizedAnsi(String),
}

#[derive(Clone, Debug)]
pub struct StyledContentSpan {
    pub text: String,
    pub style: Option<StyleSpec>,
    pub link: Option<String>,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum LineEnding {
    Lf,
    Crlf,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum IndentationStyle {
    Tabs,
    Spaces,
}

#[derive(Clone, Debug)]
pub enum TextValidationRule {
    MinimumLength { graphemes: u64, message: String },
    MaximumLength { graphemes: u64, message: String },
    Pattern {
        pattern: String,
        case_insensitive: bool,
        multiline: bool,
        message: String,
    },
}

#[derive(Clone, Debug)]
pub struct TextDocumentConfig {
    pub read_only: bool,
    pub secure: bool,
    pub required: bool,
    pub max_graphemes: Option<u64>,
    pub line_ending: LineEnding,
    pub tab_width: u32,
    pub indentation_style: IndentationStyle,
    pub indentation_width: u32,
    pub validation: Vec<TextValidationRule>,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct GraphemeRange {
    pub start: u32,
    pub end: u32,
}

#[derive(Clone, Debug)]
pub struct StyleSpan {
    pub range: GraphemeRange,
    pub style_id: u32,
    pub hyperlink_id: Option<u32>,
}

#[derive(Clone, Debug)]
pub struct EditOperation {
    pub range_before: GraphemeRange,
    pub deleted_utf8: String,
    pub inserted_utf8: String,
    pub generation: u64,
}

#[derive(Clone, Debug, Default)]
pub struct GraphemePool {
    pub values: Vec<String>,
    pub lookup: BTreeMap<String, GraphemeId>,
    pub usage: BoundedUsage,
}

#[derive(Clone, Copy, Debug, Default)]
pub struct Cell {
    pub grapheme: GraphemeId,
    pub width: u8,
    pub continuation: bool,
    pub style_id: u32,
}

#[derive(Clone, Debug, Default)]
pub struct Surface {
    pub width: u32,
    pub height: u32,
    pub cells: Vec<Cell>,
    pub cursor: Option<(u32, u32)>,
}

#[derive(Clone, Debug)]
pub struct VirtualCollectionItem {
    pub key: CollectionKey,
    pub generation: u64,
    pub projected_node: RuntimeNodeId,
    pub text_document: Option<TextDocumentId>,
    pub estimated_height: u32,
}

#[derive(Clone, Debug, Default)]
pub struct VirtualCollectionState {
    pub items: BTreeMap<CollectionKey, VirtualCollectionItem>,
    pub order: Vec<CollectionKey>,
    pub positions: BTreeMap<CollectionKey, usize>,
    pub resident_start: u64,
    pub resident_end: u64,
    pub visible_start: u64,
    pub visible_end: u64,
    pub selected: Vec<CollectionKey>,
    pub focused: Option<CollectionKey>,
    pub request_generation: u64,
    pub usage: BoundedUsage,
}

#[derive(Clone, Debug)]
pub struct PointerCaptureState {
    pub owner: RuntimeNodeId,
    pub pointer_id: u32,
    pub button: u32,
}

#[derive(Clone, Debug)]
pub struct DragState {
    pub source: RuntimeNodeId,
    pub drop_target: Option<RuntimeNodeId>,
    pub pointer_id: u32,
    pub button: u32,
    pub start_cell: (i32, i32),
    pub current_cell: (i32, i32),
    pub current_pixel: Option<(i32, i32)>,
}

#[derive(Clone, Debug)]
pub struct TranscriptBlock {
    pub id: TranscriptBlockId,
    pub version: u64,
    pub text_document: TextDocumentId,
    pub streaming: bool,
    pub collapsed: bool,
    pub selected: bool,
}

#[derive(Clone, Debug, Default)]
pub struct TranscriptState {
    pub blocks: BTreeMap<TranscriptBlockId, TranscriptBlock>,
    pub order: Vec<TranscriptBlockId>,
    pub resident_start: usize,
    pub resident_end: usize,
    pub anchor: Option<TranscriptBlockId>,
    pub live_edge: bool,
    pub request_generation: u64,
    pub usage: BoundedUsage,
}

#[derive(Clone, Debug)]
pub enum AnimationValue {
    Number(f64),
    ColorRgba(u32),
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum AnimationEasing {
    Linear,
    EaseIn,
    EaseOut,
    EaseInOut,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum AnimationTimelineMode {
    Sequence,
    Parallel,
}

#[derive(Clone, Debug)]
pub struct AnimationState {
    pub id: u64,
    pub target: RuntimeNodeId,
    pub property: u16,
    pub from: Option<AnimationValue>,
    pub to: AnimationValue,
    pub easing: AnimationEasing,
    pub timeline_id: u64,
    pub timeline_mode: AnimationTimelineMode,
    pub sequence_index: u32,
    pub started_nanos: u64,
    pub duration_nanos: u64,
    pub delay_nanos: u64,
    pub repeat: u32,
    pub repeat_infinite: bool,
    pub reverse: bool,
    pub reduced_motion: u8,
}

#[derive(Clone, Debug)]
pub struct DiagnosticRecord {
    pub sequence: u64,
    pub timestamp_nanos: u64,
    pub kind: u16,
    pub event_id: Option<u64>,
    pub command_instance_id: Option<u64>,
    pub transaction_id: Option<u64>,
    pub render_request_id: Option<u64>,
    pub payload: Vec<u8>,
}

#[derive(Clone, Debug)]
pub struct DiagnosticIssue {
    pub code: String,
    pub category: String,
    pub operation: String,
    pub component: Option<RuntimeNodeId>,
    pub phase: String,
    pub source_kind: String,
    pub source: Option<(String, u32, u32)>,
    pub cause_kind: String,
    pub cause_summary: String,
    pub preceding_event_id: Option<u64>,
    pub preceding_command_id: Option<String>,
    pub trace_interval: (u64, u64),
    pub message: String,
    pub remediation: String,
    pub actions: Vec<String>,
}

#[derive(Clone, Debug, Default)]
pub struct DiagnosticGraphState {
    pub records: VecDeque<DiagnosticRecord>,
    pub record_byte_limit: usize,
    pub snapshot_byte_limit: usize,
    pub wrap_count: u64,
    pub next_sequence: u64,
    pub issues: VecDeque<DiagnosticIssue>,
}

#[derive(Clone, Debug, Default)]
pub struct BoundedRecordQueue {
    pub records: VecDeque<Vec<u8>>,
    pub usage: BoundedUsage,
    pub max_records: usize,
    pub max_bytes: usize,
}

#[derive(Clone, Debug)]
pub struct RuntimeContext {
    pub id: ContextId,
    pub mode: ContextMode,
    pub status: ContextStatus,
    pub root: Option<RuntimeNodeId>,
    pub nodes: BTreeMap<RuntimeNodeId, RuntimeNode>,
    pub style_sheets: BTreeMap<u32, RegisteredStyleSheet>,
    pub themes: BTreeMap<u32, ThemeState>,
    pub default_theme: Option<u32>,
    pub text_documents: BTreeMap<TextDocumentId, TextDocument>,
    pub collections: BTreeMap<RuntimeNodeId, VirtualCollectionState>,
    pub transcripts: BTreeMap<RuntimeNodeId, TranscriptState>,
    pub graphemes: GraphemePool,
    pub animations: BTreeMap<u64, AnimationState>,
    pub pointer_capture: Option<PointerCaptureState>,
    pub drag: Option<DragState>,
    pub terminal: TerminalSessionState,
    pub front_surface: Surface,
    pub back_surface: Surface,
    pub events: BoundedRecordQueue,
    pub diagnostic_graph: DiagnosticGraphState,
    pub last_transaction_id: u64,
    pub last_render_request_id: u64,
}
