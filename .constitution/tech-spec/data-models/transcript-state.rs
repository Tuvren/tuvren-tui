// TranscriptState — transcript surface state
// Schema snapshot — NOT COMPILED. Source: native/src/types.rs:813-828.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

pub struct TranscriptState {
    pub blocks: Vec<TranscriptBlock>,
    pub block_index: HashMap<u64, usize>,
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
