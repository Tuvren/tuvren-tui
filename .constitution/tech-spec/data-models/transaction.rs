#![allow(dead_code)]

pub const ABI_MAJOR: u16 = 2;
pub const ABI_MINOR: u16 = 0;
pub const TRANSACTION_MAGIC: u32 = 0x5256_5554;

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

// Decoder invariant: construct ValidatedTransaction only after checking magic,
// ABI major, all offset arithmetic, exact command-byte length, arena bounds,
// opcode/property/value compatibility, target identity, UTF-8, grapheme
// coordinates, generations, and trailing bytes. Runtime mutation accepts only
// ValidatedTransaction, never the untrusted byte slice.
