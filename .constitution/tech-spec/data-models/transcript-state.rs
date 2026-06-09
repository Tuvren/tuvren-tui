// TranscriptState — transcript surface state
// Corresponds to: .constitution/tech-spec/data-models/transcript-state.rs

use std::collections::HashMap;
use crate::transcript_block::TranscriptBlock;
use crate::follow_mode::FollowMode;
use crate::viewport_anchor::ViewportAnchorKind;

#[repr(u8)]
pub enum SplitAxis {
    Horizontal = 0,
    Vertical = 1,
}

pub struct TranscriptState {
    pub blocks: Vec<TranscriptBlock>,
    pub block_index: HashMap<u64, usize>,   // block_id -> blocks index
    pub follow_mode: FollowMode,
    pub anchor_kind: ViewportAnchorKind,
    pub unread_anchor: Option<u64>,
    pub unread_count: u32,
    pub sticky_threshold_rows: u32,
    pub tail_attached: bool,
    pub viewport_rows: u32,
    pub viewport_width: u32,
    pub role_colors: [u32; 5],
}
