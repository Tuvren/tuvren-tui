// EditBuffer — operation history for TextArea undo/redo (ADR-T38)
// Schema snapshot — NOT COMPILED. Source: native/src/.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

#[derive(Clone)]
pub enum EditOp {
    Insert { pos: usize, text: String },
    Delete { pos: usize, len: usize },
    Replace { pos: usize, old_len: usize, new_text: String },
    CursorMove { pos: usize },
}

pub struct EditBuffer {
    pub buffer: u32,
    pub history: Vec<EditOp>,
    pub undo_cursor: usize,
}
