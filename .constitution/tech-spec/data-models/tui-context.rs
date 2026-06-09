// TuiContext — root native UI state container
// Schema snapshot — NOT COMPILED. Source: native/src/context.rs:23-89.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

pub struct TuiContext {
    // Tree Module
    pub tree: taffy::TaffyTree<()>,
    pub nodes: HashMap<u32, TuiNode>,
    pub next_handle: u32,
    pub root: Option<u32>,

    // Event Module
    pub event_buffer: Vec<TuiEvent>,
    pub focused: Option<u32>,

    // Render Module
    pub front_buffer: Buffer,
    pub back_buffer: Buffer,
    pub backend: Box<dyn TerminalBackend>,
    pub terminal_capabilities: TerminalCapabilityState,

    // Writer Module (v3, ADR-T24)
    pub writer_state: WriterState,

    // Text Module
    pub syntax_set: syntect::parsing::SyntaxSet,
    pub theme_set: syntect::highlighting::ThemeSet,
    pub text_cache: TextCache,

    // Native Text Substrate (ADR-T37, Epic M)
    pub text_buffers: HashMap<u32, TextBuffer>,
    pub text_views: HashMap<u32, TextView>,
    pub edit_buffers: HashMap<u32, EditBuffer>,
    pub next_substrate_handle: u32,

    // Theme Module
    pub themes: HashMap<u32, Theme>,
    pub theme_bindings: HashMap<u32, u32>,
    pub next_theme_handle: u32,

    // Animation Module (v1)
    pub animations: Vec<Animation>,
    pub animation_chains: HashMap<u32, u32>,
    pub choreo_groups: HashMap<u32, ChoreographyGroup>,
    pub next_anim_handle: u32,
    pub next_choreo_group_handle: u32,
    pub last_render_time: Option<Instant>,

    // Diagnostics
    pub last_error: String,
    pub debug_mode: bool,
    pub perf_layout_us: u64,
    pub perf_render_us: u64,
    pub perf_diff_cells: u32,
    pub perf_write_bytes_estimate: u64,
    pub perf_write_runs: u32,
    pub perf_style_deltas: u32,
    pub perf_text_parse_us: u64,
    pub perf_text_wrap_us: u64,
    pub perf_text_cache_hits: u32,
    pub perf_text_cache_misses: u32,

    // Dev Mode (ADR-T34)
    pub debug_overlay_flags: u32,
    pub debug_trace_flags: u32,
    pub debug_traces: [VecDeque<DebugTraceEntry>; 4],
    pub debug_frames: VecDeque<DebugFrameSnapshot>,
    pub next_debug_seq: u64,
    pub frame_seq: u64,
}
