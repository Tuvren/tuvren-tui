// TextView — viewport projection over a TextBuffer (ADR-T37)
// Schema snapshot — NOT COMPILED. Source: native/src/.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

pub struct TextView {
    pub buffer: u32,
    pub wrap_width: u32,
    pub wrap_mode: WrapMode,
    pub tab_width: u8,
    pub viewport_rows: u32,
    pub scroll_row: u32,
    pub scroll_col: u32,
    pub cursor: Option<CursorPos>,
    pub visual_lines: Vec<VisualLine>,
    pub cache_key_epoch: u64,
}
