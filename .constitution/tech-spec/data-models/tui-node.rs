// TuiNode — individual widget state node
// Schema snapshot — NOT COMPILED. Source: native/src/.

#![allow(dead_code)]
#![allow(unused_imports)]

// NOT COMPILED — schema reference only.

pub struct TuiNode {
    pub node_type: NodeType,
    // Accessibility metadata (ADR-T23)
    pub role: Option<AccessibilityRole>,
    pub label: Option<String>,
    pub description: Option<String>,
    // Widget-type-specific optional state
    pub table_state: Option<TableState>,
    pub list_state: Option<ListState>,
    pub tabs_state: Option<TabsState>,
    pub overlay_state: Option<OverlayState>,
    pub transcript_state: Option<TranscriptState>,
    pub split_pane_state: Option<SplitPaneState>,
}

// TranscriptState is attached only to NodeType::Transcript.
// SplitPaneState is attached only to NodeType::SplitPane.
