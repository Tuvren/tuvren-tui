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

    EU->>Exec: Deliver normalized navigate, select, or scroll input
    Exec->>Interact: Begin serialized hit-test and keyed-intent derivation
    Interact->>Content: Update focus and requested visible range inside the operation
    alt Application-controlled selection
        Interact-->>Orch: Emit keyed selection intent without native selection commit
        Orch->>App: Invoke required selection-change handler
        App-->>Orch: Supply next controlled selection when accepted
        Orch->>Exec: Submit controlled-selection transaction
        Exec->>Content: Commit supplied keyed selection
    else Bounded-local selection
        Interact->>Content: Commit keyed selection and emit change notification
    end
    Content-->>Exec: Commit projection state and keyed range demand
    Exec-->>Orch: Emit keyed range demand with generation
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

Cancelled or stale range results do not alter the Resident Projection. Interaction and Content transitions occur only inside executor-owned operations. Controlled selection never commits from interaction, a controller, or a mutation Stream; those paths emit intent until the application supplies the controlling prop transaction. Bounded-local mode commits and then notifies. Missing stable keys, duplicate keys, overflow, and invalid variable heights produce typed Issues. Loading, empty, and error states remain navigable and semantic rather than collapsing into absent content.
