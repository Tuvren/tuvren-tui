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
        Interact->>Content: Stage keyed selection intent without native selection commit
        Content-->>Exec: Complete native operation with selection intent and range demand
    else Bounded-local selection
        Interact->>Content: Commit keyed selection and stage change notification
        Content-->>Exec: Complete native operation with notification and range demand
    end
    Exec-->>Orch: Deliver selection intent/notification and range demand after completion
    Orch->>App: Invoke selection-change handler when emitted
    App-->>Orch: Supply next controlled selection when accepted
    Orch->>Exec: Submit later controlled-selection transaction
    Exec->>Content: Commit supplied keyed selection in a new operation
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

Cancelled or stale range results do not alter the Resident Projection. Interaction and Content transitions occur only inside executor-owned operations. Controlled selection never commits from interaction, a controller, or a mutation Stream; those paths return intent to the executor, complete native work, and only then notify application orchestration. A controlling prop change enters a later transaction. Bounded-local mode commits, completes, and then notifies. No native kernel calls application code or reenters mutation. Missing stable keys, duplicate keys, overflow, and invalid variable heights produce typed Issues. Loading, empty, and error states remain navigable and semantic rather than collapsing into absent content.
