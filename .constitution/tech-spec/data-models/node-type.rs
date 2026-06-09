// NodeType — widget type enumeration
// Corresponds to: .constitution/tech-spec/data-models/node-type.rs

#[repr(u8)]
pub enum NodeType {
    Box = 0,
    Text = 1,
    Input = 2,
    Select = 3,
    ScrollBox = 4,
    TextArea = 5,
    Table = 6,
    List = 7,
    Tabs = 8,
    Overlay = 9,
    Transcript = 10,
    SplitPane = 11,
}
