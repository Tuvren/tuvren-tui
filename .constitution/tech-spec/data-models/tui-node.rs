// TuiNode — individual widget state node
// Schema snapshot — NOT COMPILED. Source: native/src/types.rs:1001-1054.

#![allow(dead_code)]

// NOT COMPILED — schema reference only.

pub struct TuiNode {
    // Core layout
    pub node_type: NodeType,
    pub taffy_node: taffy::NodeId,
    // Content / text substrate handles
    pub content: String,
    pub content_format: ContentFormat,
    pub code_language: Option<String>,
    pub text_buffer_handle: Option<u32>,
    pub text_view_handle: Option<u32>,
    pub edit_buffer_handle: Option<u32>,
    // Tree structure
    pub children: Vec<u32>,
    pub parent: Option<u32>,
    // Visual
    pub visual_style: VisualStyle,
    pub dirty: bool,
    pub focusable: bool,
    pub visible: bool,
    pub scroll_x: i32,
    pub scroll_y: i32,
    pub show_scrollbar: bool,
    pub scrollbar_side: u8,  // 0=right, 1=left
    pub scrollbar_width: u8, // valid 1..=3
    pub render_offset: (f32, f32),
    pub z_index: i32,
    // Input widget state
    pub cursor_position: u32,
    pub max_length: u32,
    pub mask_char: u32,
    // TextArea widget state
    pub cursor_row: u32,
    pub cursor_col: u32,
    pub wrap_mode: u8,
    pub textarea_view_row: u32,
    pub textarea_view_col: u32,
    // Select widget state
    pub options: Vec<String>,
    pub selected_index: Option<u32>,
    // Accessibility (ADR-T23)
    pub role: Option<AccessibilityRole>,
    pub label: Option<String>,
    pub description: Option<String>,
    // Widget-type-specific optional state
    pub textarea_state: Option<TextAreaState>,
    pub table_state: Option<TableState>,
    pub list_state: Option<ListState>,
    pub tabs_state: Option<TabsState>,
    pub overlay_state: Option<OverlayState>,
    pub transcript_state: Option<TranscriptState>,
    pub split_pane_state: Option<SplitPaneState>,
}
