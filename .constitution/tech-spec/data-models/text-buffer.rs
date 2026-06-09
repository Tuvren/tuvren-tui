// TextBuffer — native content storage for substantial text surfaces (ADR-T37)
// Schema snapshot — NOT COMPILED. Source: native/src/text_buffer.rs:24-41.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.
// DirtyRange, StyleSpan, SelectionRange, HighlightRange, TerminalLinkSpan
// live in native/src/types.rs.

/// Single dirty range entry recording both the replaced and replacement extents.
pub struct DirtyRange {
    pub start: usize,
    pub old_end: usize,
    pub new_end: usize,
}

pub struct TextBuffer {
    /// The canonical content string. All mutations go through the substrate API.
    pub content: String,
    /// Increases monotonically per byte-changing mutation.
    pub epoch: u64,
    /// Bumped when style spans, selection, or highlights change. Participates
    /// in `TextView` cache invalidation but not in `epoch`.
    pub style_fingerprint: u64,
    /// Byte offset of every line start. Always non-empty; `[0]` for empty.
    pub line_starts: Vec<usize>,
    /// Cached per-line cell width, computed against `tab_width`.
    pub line_widths: Vec<u32>,
    pub style_spans: Vec<StyleSpan>,
    pub terminal_link_spans: Vec<TerminalLinkSpan>,
    pub selection: Option<SelectionRange>,
    pub highlights: Vec<HighlightRange>,
    pub dirty_ranges: Vec<DirtyRange>,
    pub tab_width: u8,
}
