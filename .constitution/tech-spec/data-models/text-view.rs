// TextView — viewport projection over a TextBuffer (ADR-T37)
// Corresponds to: .constitution/tech-spec/data-models/text-view.rs

use crate::cursor_pos::CursorPos;
use crate::wrap_mode::WrapMode;
use crate::visual_line::VisualLine;

pub struct TextView {
    /// Handle of the backing TextBuffer.
    pub buffer: u32,
    /// Wrap width in cells. 0 means no wrapping.
    pub wrap_width: u32,
    pub wrap_mode: WrapMode,
    pub tab_width: u8,
    pub viewport_rows: u32,
    pub scroll_row: u32,
    pub scroll_col: u32,
    pub cursor: Option<CursorPos>,
    /// Cached visual lines for the current viewport.
    pub visual_lines: Vec<VisualLine>,
    /// Epoch of the content when the cache was last valid.
    pub cache_key_epoch: u64,
}
