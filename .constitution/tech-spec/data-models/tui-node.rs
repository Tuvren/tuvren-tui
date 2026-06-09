// TuiNode — individual widget state node
// Corresponds to: .constitution/tech-spec/data-models/tui-node.rs

use crate::node_type::NodeType;
use crate::accessibility::AccessibilityRole;
use crate::transcript::TranscriptState;
use crate::split_pane::SplitPaneState;
use crate::table::TableState;
use crate::list::ListState;
use crate::tabs::TabsState;
use crate::overlay::OverlayState;

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
