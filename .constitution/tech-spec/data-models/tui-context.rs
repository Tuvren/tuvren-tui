// TuiContext — root native UI state container
// Corresponds to: .constitution/tech-spec/data-models/tui-context.rs

use std::collections::{HashMap, VecDeque};
use crate::terminal_capability::TerminalCapabilityState;
use crate::theme::Theme;
use crate::event::TuiEvent;
use crate::debug::{DebugTraceEntry, DebugFrameSnapshot};

pub struct TuiContext {
    /// Next available Handle value. Handle(0) is permanently invalid.
    pub next_handle: u32,
    /// Root widget Handle, if any.
    pub root: Option<u32>,
    /// Terminal capability state, initialized by the active TerminalBackend.
    pub terminal_capabilities: TerminalCapabilityState,
    /// Ordered event buffer for drained events.
    pub event_buffer: Vec<TuiEvent>,
    /// All registered themes keyed by Handle.
    pub themes: HashMap<u32, Theme>,
    /// Theme bindings: widget Handle -> theme Handle.
    pub theme_bindings: HashMap<u32, u32>,
    /// Debug overlay flag mask.
    pub debug_overlay_flags: u32,
    /// Debug trace flag mask.
    pub debug_trace_flags: u32,
    /// Per-kind bounded debug trace rings [kind -> entries].
    pub debug_traces: [VecDeque<DebugTraceEntry>; 4],
    /// Debug frame snapshot history.
    pub debug_frames: VecDeque<DebugFrameSnapshot>,
    /// Monotonic sequence number for debug trace entries.
    pub next_debug_seq: u64,
    /// Monotonic frame counter.
    pub frame_seq: u64,
}

// Invariant: Handle(0) is permanently invalid.
// All Handles are u32 and owned by TuiContext; host layer holds opaque u32 references.
