// TextBuffer — native content storage for substantial text surfaces (ADR-T37)
// Corresponds to: .constitution/tech-spec/data-models/text-buffer.rs

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
    /// Monotonically increasing epoch; bumped on byte mutations only.
    pub epoch: u64,
    /// Bumped on style / selection / highlight / link changes.
    pub style_fingerprint: u64,
    /// Line-start byte offsets into the content string.
    pub line_starts: Vec<usize>,
    /// Cached per-line measured widths in cells.
    pub line_widths: Vec<u32>,
    /// Style spans over the content (start byte, end byte, style handle).
    pub style_spans: Vec<crate::style_span::StyleSpan>,
    /// Optional selection range.
    pub selection: Option<crate::selection::SelectionRange>,
    /// Highlight ranges for search/match visualization.
    pub highlights: Vec<crate::highlight_range::HighlightRange>,
    /// OSC8 hyperlink metadata.
    pub terminal_link_spans: Vec<crate::terminal_link_span::TerminalLinkSpan>,
    /// Dirty range list. Each entry records old and new extents.
    pub dirty_ranges: Vec<DirtyRange>,
    /// Tab width in cells.
    pub tab_width: u8,
    // Note: The content String itself is a private implementation detail.
    // All reads and writes go through the substrate API.
}
