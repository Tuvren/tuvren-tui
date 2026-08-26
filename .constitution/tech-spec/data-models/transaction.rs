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
    pub commands: Vec<ValidatedCommand<'a>>,
}

#[derive(Debug)]
pub struct ValidatedCommand<'a> {
    pub opcode: TransactionOpcode,
    pub target: u32,
    pub property: u32,
    pub generation: u64,
    pub payload: &'a [u8],
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
    Create { local: NodeReference, primitive: u16 },
    Child { parent: NodeReference, child: NodeReference, index: u32 },
    ScalarU64 { property: u32, value: u64 },
    ScalarI64 { property: u32, value: i64 },
    ScalarF64 { property: u32, value: f64 },
    Bytes { property: u32, value: &'a [u8] },
    Layout(LayoutPayload<'a>),
    Style(StylePayload<'a>),
    TextEdit(TextEditPayload<'a>),
    Collection(CollectionPayload<'a>),
    Transcript(TranscriptPayload<'a>),
    Animation(AnimationPayload),
    Terminal(TerminalPayload<'a>),
    Diagnostic(DiagnosticPayload),
}

#[derive(Clone, Debug)]
pub struct LayoutPayload<'a> {
    pub fixed_record: &'a [u8],
    pub row_tracks: &'a [u8],
    pub column_tracks: &'a [u8],
    pub responsive_rules: &'a [u8],
}

#[derive(Clone, Debug)]
pub struct StylePayload<'a> {
    pub fixed_record: &'a [u8],
    pub rules: &'a [u8],
}

#[derive(Clone, Debug)]
pub struct TextEditPayload<'a> {
    pub kind: u16,
    pub start_grapheme: u32,
    pub end_grapheme: u32,
    pub utf8: &'a str,
    pub content_epoch: u64,
}

#[derive(Clone, Debug)]
pub struct CollectionPayload<'a> {
    pub kind: u16,
    pub key: ValidatedCollectionKey<'a>,
    pub item: &'a [u8],
    pub generation: u64,
}

#[derive(Clone, Debug)]
pub enum ValidatedCollectionKey<'a> {
    Utf8(&'a str),
    CanonicalNumberBits(u64),
}

#[derive(Clone, Debug)]
pub struct TranscriptPayload<'a> {
    pub kind: u16,
    pub block_id: &'a str,
    pub content: &'a [u8],
    pub version: u64,
    pub generation: u64,
}

#[derive(Clone, Copy, Debug)]
pub struct AnimationPayload {
    pub property: u16,
    pub animation_id: u64,
    pub timeline_id: u64,
    pub easing: u16,
    pub timeline_mode: u16,
    pub sequence_index: u32,
    pub duration_nanos: u64,
    pub delay_nanos: u64,
}

#[derive(Clone, Debug)]
pub struct TerminalPayload<'a> {
    pub kind: u16,
    pub request_id: u64,
    pub media_type: &'a str,
    pub data: &'a [u8],
}

#[derive(Clone, Copy, Debug)]
pub struct DiagnosticPayload {
    pub mode: u16,
    pub record_byte_limit: u64,
    pub snapshot_byte_limit: u64,
}

// Decoder invariant: construct ValidatedTransaction only after checking magic,
// ABI major, all offset arithmetic, exact command-byte length, arena bounds,
// opcode/property/value compatibility, target identity, UTF-8, grapheme
// coordinates, generations, exact fixed-record sizes, nested arena ranges, and
// trailing bytes. Numeric Collection keys must be finite; negative zero is
// canonicalized to positive-zero bits and NaN or infinity is rejected. It
// converts every command to ValidatedPayload and enforces
// the opcode/property/value compatibility matrix in native-abi.h. Runtime
// mutation accepts only ValidatedTransaction, never the untrusted byte slice.
