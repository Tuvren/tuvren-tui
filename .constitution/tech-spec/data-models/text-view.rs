// TextView — viewport projection over a TextBuffer (ADR-T37)
// Schema snapshot — NOT COMPILED. Source: native/src/text_view.rs:60-72.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

/// Composite invalidation key for the wrap cache. Private; used internally
/// by the cache invalidation logic. Includes content_epoch, wrap_width,
/// wrap_mode, tab_width, and style_fingerprint.
struct CacheKey { /* 5 fields, private */ }

pub struct TextView {
    pub buffer: u32,
    pub wrap_width: u32,
    pub wrap_mode: WrapMode,
    pub tab_width: u8,
    pub viewport_rows: u32,
    pub scroll_row: u32,
    pub scroll_col: u32,
    pub cursor: Option<CursorPos>,
    /// Visual lines are the wrap-projection over the TextBuffer. Clipped to
    /// viewport_rows at render time; scroll/height changes do not rebuild
    /// the projection. Resize invalidates it only when wrap_width changes.
    pub visual_lines: Vec<VisualLine>,
    /// Composite invalidation key: content_epoch, wrap_width, wrap_mode,
    /// tab_width, style_fingerprint. Private; participates in cache logic.
    cached_key: CacheKey,
    /// Next cache key epoch; incremented each time the projection is rebuilt.
    pub cache_key_epoch: u64,
}
