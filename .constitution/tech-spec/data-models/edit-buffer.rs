// EditBuffer — operation history for TextArea undo/redo (ADR-T38)
// Corresponds to: .constitution/tech-spec/data-models/edit-buffer.rs

#[derive(Clone)]
pub enum EditOp {
    Insert { pos: usize, text: String },
    Delete { pos: usize, len: usize },
    Replace { pos: usize, old_len: usize, new_text: String },
    CursorMove { pos: usize },
}

pub struct EditBuffer {
    /// Handle of the backing TextBuffer.
    pub buffer: u32,
    /// Operation history.
    pub history: Vec<EditOp>,
    /// Current position in history for undo/redo. 0 means at the beginning (no ops applied).
    pub undo_cursor: usize,
}
