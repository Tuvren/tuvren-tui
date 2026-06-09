// TextBuffer — native content storage for substantial text surfaces (ADR-T37)
// Schema snapshot — NOT COMPILED. Source: native/src/.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

/// Bounded cache entry key for visual-line cache.
#[derive(Eq, PartialEq, Hash)]
pub struct VisualLineCacheKey {
    pub content_epoch: u64,
    pub wrap_width: u32,
    pub style_fingerprint: u64,
    pub viewport_rows: u32,
}

/// Single dirty range entry recording both the replaced and replacement extents.
pub struct DirtyRange {
    pub start: usize,
    pub old_end: usize,
    pub new_end: usize,
}

pub struct TextBuffer {
    pub epoch: u64,
    pub style_fingerprint: u64,
    pub line_starts: Vec<usize>,
    pub line_widths: Vec<u32>,
    pub style_spans: Vec<crate::style_span::StyleSpan>,
    pub selection: Option<crate::selection::SelectionRange>,
    pub highlights: Vec<crate::highlight_range::HighlightRange>,
    pub terminal_link_spans: Vec<crate::terminal_link_span::TerminalLinkSpan>,
    pub dirty_ranges: Vec<DirtyRange>,
    pub tab_width: u8,
}
