# Domain model

This model describes the product concepts Developers and End Users interact with. It does not prescribe implementation containers, processes, protocols, or deployment topology.

```mermaid
classDiagram
    class Developer
    class EndUser
    class ComponentAuthor
    class TerminalEnvironment

    class DeclarativeSDK
    class ImperativeSDK
    class Component {
        public properties
        lifecycle behavior
        stable style slots
    }
    class Primitive {
        native-backed behavior
        semantic state
    }
    class CompositionTree
    class Surface {
        rows
        columns
    }
    class LayoutConstraint
    class StyleSpec
    class StyleSheet
    class ThemeToken
    class ThemeRecipe

    class Event {
        identity
        route
        disposition
    }
    class Command {
        stable identity
        availability
        concurrency policy
    }
    class Keymap
    class FocusScope

    class StyledText
    class TextDocument
    class Transcript
    class TranscriptBlock {
        stable identity
        lifecycle state
    }
    class VirtualCollection
    class DataSource
    class ResidentProjection

    class SemanticTree
    class TerminalCapability
    class CapabilityTier
    class ScreenMode
    class RenderPass
    class DiagnosticGraph
    class DiagnosticTrace

    Developer --> DeclarativeSDK : uses by default
    Developer --> ImperativeSDK : uses explicitly
    ComponentAuthor --> Component : packages
    DeclarativeSDK --> Component : describes
    ImperativeSDK --> Primitive : controls
    Component *-- Primitive : composes
    CompositionTree *-- Component : contains
    CompositionTree *-- Primitive : contains
    CompositionTree --> Surface : produces

    Component --> LayoutConstraint : is arranged by
    Primitive --> LayoutConstraint : is arranged by
    Component --> StyleSheet : accepts
    StyleSheet *-- StyleSpec : registers
    ThemeRecipe --> Component : supplies defaults
    ThemeRecipe --> ThemeToken : resolves

    EndUser --> Event : originates
    Event --> Component : targets
    Event --> Primitive : targets
    Command --> Component : updates presentation
    Keymap --> Command : invokes
    FocusScope --> Component : bounds navigation

    StyledText --> Component : supplies content
    TextDocument --> StyledText : presents as
    Transcript *-- TranscriptBlock : orders
    Transcript --> ResidentProjection : bounds
    VirtualCollection --> DataSource : requests ranges from
    VirtualCollection --> ResidentProjection : presents through

    CompositionTree --> SemanticTree : describes meaning as
    TerminalEnvironment --> TerminalCapability : reports
    TerminalCapability --> CapabilityTier : selects
    ScreenMode --> Surface : determines ownership of
    RenderPass --> Surface : updates
    CompositionTree --> RenderPass : supplies accepted changes to
    DiagnosticGraph --> CompositionTree : explains
    DiagnosticGraph --> Event : explains
    DiagnosticGraph --> Command : explains
    DiagnosticGraph --> RenderPass : explains
    DiagnosticTrace --> DiagnosticGraph : records causality from
```

## Ownership invariants

- A Component is the public reusable authoring abstraction; a Primitive is the public low-level building block beneath it.
- The internal RuntimeNode concept does not participate in the public problem-space model.
- Each controlled or uncontrolled property has one authority at a time.
- An application's durable data remains distinct from its bounded Resident Projection.
- A Render Pass applies accepted changes to a Surface; it does not create a second source of application truth.
- The Semantic Tree expresses meaning independently of the cells presented on a Surface.
- Terminal Capabilities determine behavior through detection, and a Capability Tier groups the resulting guarantees.
