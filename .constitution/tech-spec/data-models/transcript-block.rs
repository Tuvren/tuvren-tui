// TranscriptBlock — individual transcript content block
// Corresponds to: .constitution/tech-spec/data-models/transcript-block.rs

use crate::content_format::ContentFormat;

#[repr(u8)]
pub enum TranscriptBlockKind {
    Message = 0,
    ToolCall = 1,
    ToolResult = 2,
    Reasoning = 3,
    Activity = 4,
    Divider = 5,
}

pub struct TranscriptBlock {
    pub id: u64,                          // host-owned u64 block ID
    pub kind: TranscriptBlockKind,
    pub parent_id: Option<u64>,
    pub role: u8,
    pub buffer_handle: u32,              // TextBuffer Handle for content
    pub view_handle: u32,                 // TextView Handle for projection
    pub content_format: ContentFormat,
    pub code_language: Option<String>,
    pub streaming: bool,
    pub collapsed: bool,
    pub hidden: bool,
    pub unread: bool,
    pub rendered_rows: u32,
    pub version: u64,                     // monotonic version for diff tracking
}
