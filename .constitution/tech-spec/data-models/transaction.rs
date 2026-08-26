#![allow(dead_code)]

pub const ABI_MAJOR: u16 = 2;
pub const ABI_MINOR: u16 = 0;
pub const TRANSACTION_MAGIC: u32 = 0x5256_5554;
pub const MAX_TRANSACTION_BYTES: usize = 8 * 1024 * 1024;
pub const MAX_TRANSACTION_COMMANDS: usize = 65_535;
pub const LOCAL_NODE_REFERENCE_BIT: u32 = 0x8000_0000;

#[repr(u16)]
#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum TransactionOpcode {
    CreateNode = 1,
    DestroyNode = 2,
    InsertChild = 3,
    RemoveChild = 4,
    SetRoot = 5,
    SetPropertyU64 = 6,
    SetPropertyI64 = 7,
    SetPropertyF64 = 8,
    SetPropertyBytes = 9,
    TextEdit = 10,
    CollectionApply = 11,
    TranscriptApply = 12,
    AnimationApply = 13,
    TerminalRequest = 14,
    DiagnosticConfigure = 15,
    AnimationCancel = 16,
    AnimationReplace = 17,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Default)]
pub struct TransactionHeader {
    pub magic: u32,
    pub abi_major: u16,
    pub abi_minor: u16,
    pub transaction_id: u64,
    pub command_count: u32,
    pub commands_offset: u32,
    pub commands_bytes: u32,
    pub arena_offset: u32,
    pub arena_bytes: u32,
    pub flags: u32,
    pub reserved: u32,
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Default)]
pub struct TransactionCommand {
    pub opcode: u16,
    pub flags: u16,
    pub target: u32,
    pub property: u32,
    pub value_tag: u32,
    pub payload_offset: u32,
    pub payload_length: u32,
    pub argument0: u32,
    pub argument1: u32,
    pub generation: u64,
}

#[derive(Debug)]
pub struct ValidatedTransaction<'a> {
    pub transaction_id: u64,
    pub request_render: bool,
    pub commands: Vec<ValidatedCommand<'a>>,
}

#[derive(Debug)]
pub struct ValidatedCommand<'a> {
    pub opcode: TransactionOpcode,
    pub target: u32,
    pub property: u32,
    pub generation: u64,
    pub payload: ValidatedPayload<'a>,
    pub argument0: u32,
    pub argument1: u32,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum NodeReference {
    Existing(u32),
    TransactionLocal(u32),
}

#[derive(Clone, Debug)]
pub enum ValidatedPayload<'a> {
    None,
    Create {
        local: NodeReference,
        primitive: u16,
        initial_generation: u32,
    },
    Child {
        parent: NodeReference,
        child: NodeReference,
        index: u32,
    },
    ScalarU64 {
        property: u32,
        value: u64,
    },
    ScalarI64 {
        property: u32,
        value: i64,
    },
    ScalarF64 {
        property: u32,
        value: f64,
    },
    GraphemeRange {
        property: u32,
        start: u32,
        end: u32,
    },
    Utf8 {
        property: u32,
        value: &'a str,
    },
    Layout(LayoutPayload),
    Style(StylePayload<'a>),
    Semantic(SemanticPayload<'a>),
    TextContent(TextContentPayload<'a>),
    TextDocumentConfig(TextDocumentConfigPayload<'a>),
    TextEdit(TextEditPayload<'a>),
    Collection(CollectionPayload<'a>),
    Transcript(TranscriptPayload<'a>),
    Animation(AnimationPayload),
    AnimationCancel {
        animation_id: u64,
    },
    Terminal(TerminalPayload<'a>),
    Diagnostic(DiagnosticPayload),
}

#[derive(Clone, Copy, Debug)]
pub struct DimensionAtom {
    pub tag: u16,
    pub value: f32,
}

#[derive(Clone, Debug, Default)]
pub struct Dimension {
    pub minimum: Option<DimensionAtom>,
    pub preferred: Option<DimensionAtom>,
    pub maximum: Option<DimensionAtom>,
}

#[derive(Clone, Debug)]
pub enum GridTrack {
    Dimension(Dimension),
    Fraction(f32),
    MinMax {
        minimum: Dimension,
        maximum: Dimension,
    },
}

#[derive(Clone, Debug, Default)]
pub struct ResponsiveCondition {
    pub min_width_cells: Option<f32>,
    pub max_width_cells: Option<f32>,
    pub min_height_cells: Option<f32>,
    pub max_height_cells: Option<f32>,
    pub min_width_percent: Option<f32>,
    pub max_width_percent: Option<f32>,
    pub min_height_percent: Option<f32>,
    pub max_height_percent: Option<f32>,
}

#[derive(Clone, Debug)]
pub struct ResponsiveLayoutRule {
    pub condition: ResponsiveCondition,
    pub layout: Box<LayoutPayload>,
}

#[derive(Clone, Debug)]
pub struct LayoutPayload {
    pub display: u16,
    pub position: u16,
    pub flex_direction: u16,
    pub flex_wrap: u16,
    pub align_items: u16,
    pub align_self: u16,
    pub align_content: u16,
    pub justify_content: u16,
    pub width: Dimension,
    pub height: Dimension,
    pub min_width: Dimension,
    pub max_width: Dimension,
    pub min_height: Dimension,
    pub max_height: Dimension,
    pub flex_basis: Dimension,
    pub top: Dimension,
    pub right: Dimension,
    pub bottom: Dimension,
    pub left: Dimension,
    pub grow: f32,
    pub shrink: f32,
    pub row_gap: f32,
    pub column_gap: f32,
    pub aspect_ratio: f32,
    pub overflow: u32,
    pub row_tracks: Vec<GridTrack>,
    pub column_tracks: Vec<GridTrack>,
    pub grid_row: u32,
    pub grid_column: u32,
    pub grid_row_span: u32,
    pub grid_column_span: u32,
    pub responsive_rules: Vec<ResponsiveLayoutRule>,
}

#[derive(Clone, Debug)]
pub enum ThemeValue<'a> {
    Color(u32),
    Number(f64),
    Text(&'a str),
    Boolean(bool),
}

#[derive(Clone, Debug)]
pub enum StyleValue<'a> {
    Literal(ThemeValue<'a>),
    Token {
        name: &'a str,
        fallback: Option<ThemeValue<'a>>,
    },
}

#[derive(Clone, Debug)]
pub struct AttributeToken<'a> {
    pub attribute: u32,
    pub token: &'a str,
    pub fallback: Option<bool>,
}

#[derive(Clone, Debug)]
pub struct ScalarToken<'a, T> {
    pub token: &'a str,
    pub fallback: Option<T>,
}

#[derive(Clone, Debug)]
pub struct ThemeToken<'a> {
    pub name: &'a str,
    pub value: ThemeValue<'a>,
}

#[derive(Clone, Debug)]
pub struct StyleRule<'a> {
    pub state_mask: u64,
    pub responsive: ResponsiveCondition,
    pub mode: u16,
    pub reduced_motion: u16,
    pub capability_tier: u16,
    pub minimum_colors: u32,
    pub name: &'a str,
    pub style: Box<StylePayload<'a>>,
    pub source: &'a str,
}

#[derive(Clone, Debug)]
pub struct StylePayload<'a> {
    pub kind: u16,
    pub present_mask: u32,
    pub foreground: Option<StyleValue<'a>>,
    pub background: Option<StyleValue<'a>>,
    pub attributes: u32,
    pub attribute_tokens: Vec<AttributeToken<'a>>,
    pub border: u32,
    pub border_token: Option<ScalarToken<'a, u32>>,
    pub padding: [u16; 4],
    pub padding_token: Option<ScalarToken<'a, u16>>,
    pub opacity: Option<StyleValue<'a>>,
    pub rules: Vec<StyleRule<'a>>,
    pub theme_tokens: Vec<ThemeToken<'a>>,
}

#[derive(Clone, Debug)]
pub enum SemanticScalar<'a> {
    Boolean(bool),
    Text(&'a str),
    Number(f64),
}

#[derive(Clone, Debug)]
pub enum SemanticEntry<'a> {
    Value(SemanticScalar<'a>),
    State {
        key: &'a str,
        value: SemanticScalar<'a>,
    },
    Relationship {
        key: &'a str,
        targets: Vec<NodeReference>,
    },
}

#[derive(Clone, Debug)]
pub struct SemanticPayload<'a> {
    pub kind: u16,
    pub entries: Vec<SemanticEntry<'a>>,
}

#[derive(Clone, Debug)]
pub struct TextEditPayload<'a> {
    pub kind: u16,
    pub start_grapheme: u32,
    pub end_grapheme: u32,
    pub utf8: &'a str,
    pub replacement: &'a str,
    pub search_flags: u32,
    pub content_epoch: u64,
}

#[derive(Clone, Debug)]
pub struct TextContentPayload<'a> {
    pub kind: u16,
    pub source: &'a str,
    pub language: &'a str,
    pub spans: Vec<StyledSpan<'a>>,
}

#[derive(Clone, Debug)]
pub struct StyledSpan<'a> {
    pub text: &'a str,
    pub style: Option<StylePayload<'a>>,
    pub link: Option<&'a str>,
}

#[derive(Clone, Debug)]
pub struct TextDocumentConfigPayload<'a> {
    pub flags: u32,
    pub line_ending: u16,
    pub tab_width: u32,
    pub indentation_style: u16,
    pub indentation_width: u16,
    pub max_graphemes: u64,
    pub validation_rules: Vec<TextValidationRule<'a>>,
}

#[derive(Clone, Debug)]
pub enum TextValidationRule<'a> {
    MinimumLength {
        graphemes: u64,
        message: &'a str,
    },
    MaximumLength {
        graphemes: u64,
        message: &'a str,
    },
    Pattern {
        expression: &'a str,
        flags: u32,
        message: &'a str,
    },
}

#[derive(Clone, Debug)]
pub struct CollectionPayload<'a> {
    pub kind: u16,
    pub key: ValidatedCollectionKey<'a>,
    pub item_descriptors: Vec<CollectionItem<'a>>,
    pub keys: Vec<ValidatedIdentity<'a>>,
    pub index: u64,
    pub secondary_index: u64,
    pub generation: u64,
}

#[derive(Clone, Debug)]
pub enum ValidatedCollectionKey<'a> {
    None,
    Utf8(&'a str),
    CanonicalNumberBits(u64),
}

#[derive(Clone, Debug)]
pub struct CollectionItem<'a> {
    pub key: ValidatedCollectionKey<'a>,
    pub projected_node: NodeReference,
    pub estimated_height: u32,
}

#[derive(Clone, Debug)]
pub struct ValidatedIdentity<'a> {
    pub key: ValidatedCollectionKey<'a>,
    pub node: Option<NodeReference>,
}

#[derive(Clone, Debug)]
pub struct TranscriptPayload<'a> {
    pub kind: u16,
    pub block_id: &'a str,
    pub content: ValidatedTranscriptContent<'a>,
    pub records: Vec<TranscriptBlock<'a>>,
    pub version: u64,
    pub generation: u64,
    pub index: u64,
    pub range: (u32, u32),
    pub flags: u32,
}

#[derive(Clone, Debug)]
pub enum ValidatedTranscriptContent<'a> {
    None,
    Text(TextContentPayload<'a>),
    Utf8(&'a str),
}

#[derive(Clone, Debug)]
pub struct TranscriptBlock<'a> {
    pub id: &'a str,
    pub content: Option<TextContentPayload<'a>>,
    pub version: u64,
    pub flags: u32,
}

#[derive(Clone, Copy, Debug)]
pub struct AnimationPayload {
    pub property: u16,
    pub value_tag: u16,
    pub reduced_motion: u16,
    pub animation_id: u64,
    pub timeline_id: u64,
    pub easing: u16,
    pub timeline_mode: u16,
    pub sequence_index: u32,
    pub duration_nanos: u64,
    pub delay_nanos: u64,
    pub repeat_count: u32,
    pub flags: u32,
    pub from: Option<ValidatedAnimationValue>,
    pub to: ValidatedAnimationValue,
}

#[derive(Clone, Copy, Debug)]
pub enum ValidatedAnimationValue {
    Number(f64),
    Rgba(u32),
}

#[repr(C)]
#[derive(Clone, Copy, Debug, Default)]
pub struct CommandResult {
    pub command_index: u32,
    pub value_tag: u32,
    pub value0: u64,
    pub value1: u64,
}

#[derive(Clone, Copy, Debug, Eq, PartialEq)]
pub enum QueryKind {
    TextSnapshot,
    TextFind,
    TextEncode,
    CollectionVisibleRange,
    TranscriptVisibleRange,
    TerminalCapabilities,
    CollectionScrollPosition,
}

#[derive(Clone, Debug)]
pub struct ValidatedQuery<'a> {
    pub kind: QueryKind,
    pub target: u32,
    pub flags: u32,
    pub argument0: u32,
    pub generation: u64,
    pub range: (u32, u32),
    pub payload: ValidatedQueryPayload<'a>,
}

#[derive(Clone, Debug)]
pub enum ValidatedQueryPayload<'a> {
    None,
    Utf8(&'a str),
}

#[derive(Clone, Debug, Default)]
pub struct QueryResult {
    pub generation: u64,
    pub range: (u32, u32),
    pub value_tag: u32,
    pub value0: u64,
    pub value1: u64,
    pub output: Vec<u8>,
}

#[derive(Clone, Debug)]
pub enum TerminalPayload<'a> {
    ReadClipboard {
        target: u32,
        request_id: u64,
        timeout_nanos: u64,
    },
    WriteClipboard {
        target: u32,
        request_id: u64,
        timeout_nanos: u64,
        media_type: &'a str,
        data: &'a [u8],
    },
    Announce {
        request_id: u64,
        timeout_nanos: u64,
        text: &'a str,
    },
    Suspend {
        request_id: u64,
        timeout_nanos: u64,
    },
    Resume {
        request_id: u64,
        timeout_nanos: u64,
    },
    QueryCapabilities {
        request_id: u64,
        timeout_nanos: u64,
    },
    DiscoverClipboardMediaTypes {
        target: u32,
        request_id: u64,
        timeout_nanos: u64,
    },
}

#[derive(Clone, Copy, Debug)]
pub struct DiagnosticPayload {
    pub mode: u16,
    pub flags: u32,
    pub record_byte_limit: u64,
    pub snapshot_byte_limit: u64,
}

// Decoder invariant: construct ValidatedTransaction only after checking magic,
// ABI major, all offset arithmetic, exact command-byte length, arena bounds,
// opcode/property/value compatibility, target identity, UTF-8, grapheme
// coordinates, generations, exact fixed-record sizes, nested arena ranges, and
// trailing bytes. Numeric Collection keys must be finite; negative zero is
// canonicalized to positive-zero bits and NaN or infinity is rejected. It
// preserves the validated request-render flag and every operation-bearing fixed
// field, converts every command to ValidatedPayload (never a raw payload slice),
// and enforces the opcode/property/value compatibility matrix in native-abi.h.
// Nested offsets are resolved during decoding into typed dimensions, styles,
// semantic scalars/relationships, spans, validation rules, Collection items,
// identities, and Transcript blocks. Borrowed slices survive only as validated
// UTF-8 strings or explicitly opaque terminal content. Runtime mutation accepts
// only ValidatedTransaction, never the untrusted byte slice or a partially
// decoded fixed/nested record.
