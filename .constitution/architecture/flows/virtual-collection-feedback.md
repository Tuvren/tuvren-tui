# Virtual Collection and transient-feedback flow

## Mapping

This flow satisfies PRD capabilities **P0-I01 through P0-I08**.

## Behavior view

```mermaid
sequenceDiagram
    actor EU as End User
    participant Interact as Interaction Kernel
    participant Content as Content and Projection Kernel
    participant Orch as Application Orchestration
    participant Exec as UI Executor
    participant App as Application
    participant Present as Presentation Pipeline

    EU->>Interact: Navigate, select, or scroll collection
    Interact->>Content: Update focus, selection, and requested visible range
    Content-->>Orch: Emit keyed range demand with generation
    Orch->>App: Request range through Data Source
    App-->>Orch: Return keyed items or loading, empty, or error result
    Orch->>Exec: Submit range-result transaction with generation
    Exec->>Content: Apply serialized range result
    Content->>Content: Reject stale data and update bounded Resident Projection
    Content-->>Present: Provide visible keyed items and variable heights
    Orch->>Exec: Submit Toast or Notification transaction
    Exec->>Content: Add or expire bounded feedback
```

## Failure path

Cancelled or stale range results do not alter the Resident Projection. Missing stable keys, duplicate keys, overflow, and invalid variable heights produce typed Issues. Loading, empty, and error states remain navigable and semantic rather than collapsing into absent content.
