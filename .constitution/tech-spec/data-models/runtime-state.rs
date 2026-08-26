#![allow(dead_code)]

use std::collections::{BTreeMap, VecDeque};

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
pub struct CollectionKey(pub String);

#[derive(Clone, Debug, Eq, Ord, PartialEq, PartialOrd)]
pub struct TranscriptBlockId(pub String);

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum DisplayMode {
    Flex,
    Grid,
    Absolute,
}

#[derive(Clone, Copy, Debug, PartialEq)]
pub enum DimensionSpec {
    Cells(f32),
    Percent(f32),
    Auto,
    MinContent,
    MaxContent,
}

#[derive(Clone, Debug)]
pub struct LayoutSpec {
    pub display: DisplayMode,
    pub width: DimensionSpec,
    pub height: DimensionSpec,
    pub min_width: Option<DimensionSpec>,
    pub max_width: Option<DimensionSpec>,
    pub min_height: Option<DimensionSpec>,
    pub max_height: Option<DimensionSpec>,
    pub grow: f32,
    pub shrink: f32,
    pub row_gap: f32,
    pub column_gap: f32,
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
}

#[derive(Clone, Debug, Default)]
pub struct StyleSpec {
    pub foreground: Option<u32>,
    pub background: Option<u32>,
    pub attributes: u32,
    pub border: Option<u8>,
    pub padding: Option<[u16; 4]>,
    pub opacity: Option<f32>,
}

#[derive(Clone, Debug, Default)]
pub struct StyleCondition {
    pub state_mask: u64,
    pub mode: Option<u8>,
    pub reduced_motion: Option<bool>,
    pub capability_tier: Option<u8>,
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
    pub tokens: BTreeMap<String, String>,
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

#[derive(Clone, Debug)]
pub struct TerminalSessionState {
    pub status: TerminalSessionStatus,
    pub capability_flags: u64,
    pub color_depth: u32,
    pub width_cells: u32,
    pub height_cells: u32,
    pub screen_mode: u8,
    pub output_mode: u8,
    pub pending_requests: BTreeMap<u64, PendingTerminalRequest>,
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
    pub text_document: Option<TextDocumentId>,
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
    pub edit_history: Vec<EditOperation>,
    pub undo_cursor: usize,
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
    pub text_document: Option<TextDocumentId>,
    pub estimated_height: u32,
}

#[derive(Clone, Debug, Default)]
pub struct VirtualCollectionState {
    pub items: BTreeMap<CollectionKey, VirtualCollectionItem>,
    pub resident_start: u64,
    pub resident_end: u64,
    pub visible_start: u64,
    pub visible_end: u64,
    pub selected: Vec<CollectionKey>,
    pub focused: Option<CollectionKey>,
    pub request_generation: u64,
}

#[derive(Clone, Debug)]
pub struct TranscriptBlock {
    pub id: TranscriptBlockId,
    pub generation: u64,
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
}

#[derive(Clone, Debug)]
pub struct AnimationState {
    pub id: u64,
    pub target: RuntimeNodeId,
    pub property: u16,
    pub started_nanos: u64,
    pub duration_nanos: u64,
    pub delay_nanos: u64,
    pub repeat: u32,
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

#[derive(Clone, Debug, Default)]
pub struct DiagnosticGraphState {
    pub records: VecDeque<DiagnosticRecord>,
    pub record_byte_limit: usize,
    pub snapshot_byte_limit: usize,
    pub wrap_count: u64,
    pub next_sequence: u64,
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
    pub text_documents: BTreeMap<TextDocumentId, TextDocument>,
    pub collections: BTreeMap<RuntimeNodeId, VirtualCollectionState>,
    pub transcripts: BTreeMap<RuntimeNodeId, TranscriptState>,
    pub graphemes: GraphemePool,
    pub animations: BTreeMap<u64, AnimationState>,
    pub terminal: TerminalSessionState,
    pub front_surface: Surface,
    pub back_surface: Surface,
    pub events: VecDeque<Vec<u8>>,
    pub diagnostic_graph: DiagnosticGraphState,
    pub last_transaction_id: u64,
    pub last_render_request_id: u64,
}
