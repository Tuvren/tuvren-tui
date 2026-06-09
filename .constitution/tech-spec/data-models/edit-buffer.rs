// EditBuffer — operation history for TextArea undo/redo (ADR-T38)
// Schema snapshot — NOT COMPILED. Source: native/src/edit_buffer.rs:12-26.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

#[derive(Debug, Clone)]
pub struct EditOp {
    pub start: usize,
    pub deleted_text: String,
    pub inserted_text: String,
    pub generation: u64,
}

pub struct EditBuffer {
    pub buffer: u32,
    pub buffer_epoch: u64,
    pub history: Vec<EditOp>,
    pub undo_cursor: usize,
    pub generation: u64,
}
