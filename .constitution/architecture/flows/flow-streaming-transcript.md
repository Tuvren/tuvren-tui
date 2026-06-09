# Flow: Streaming Transcript Update with Stable Viewport

## 1. Mapping

- **PRD Capability:** Epic 5 — Scrollable Regions; current product emphasis on long-lived developer and agent workflows

---

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    actor Dev as Developer Code
    participant Host as Host Bindings
    participant Transcript as Transcript Context
    participant Scroll as Scroll Context
    participant Render as Render Context
    participant Term as Terminal

    Dev->>Host: Append or patch transcript content while operator is reading
    Host->>Transcript: Submit logical block update
    Transcript->>Transcript: Update block model, unread markers, and collapse state
    Transcript->>Scroll: Recompute viewport anchor and follow behavior
    Transcript->>Render: Mark transcript surface dirty
    Host->>Render: Trigger render pass
    Render->>Term: Emit clipped update without losing operator position
```
