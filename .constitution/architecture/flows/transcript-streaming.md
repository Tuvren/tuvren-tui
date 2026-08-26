# Transcript and streaming-data flow

## Mapping

This flow satisfies PRD capabilities **P0-J01 through P0-J07**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    actor EU as End User
    participant Orch as Application Orchestration
    participant Exec as UI Executor
    participant Content as Content and Projection Kernel
    participant Interact as Interaction Kernel
    participant Present as Presentation Pipeline

    Dev->>Orch: Insert, stream, patch, finish, replace, collapse, expand, remove, or clear stable block
    Orch->>Exec: Submit Transcript transaction with block identity and generation
    Exec->>Content: Apply serialized Transcript update
    Content->>Content: Reject stale update and mutate bounded Resident Projection
    EU->>Exec: Deliver normalized scroll, selection, or live-edge input
    Exec->>Interact: Begin serialized hit-test and keyed Transcript intent derivation
    Interact->>Content: Update anchor, selection, or follow intent inside the operation
    Content->>Content: Protect visible, anchored, selected, and streaming blocks
    Content-->>Orch: Emit resident-range, eviction, or reload Event
    Content-->>Present: Provide visible blocks and stable anchor projection
    Present-->>EU: Preserve reading position or follow live edge as declared
```

## Failure path

A stale update, missing durable range, or memory-pressure eviction cannot silently delete application-controlled history or displace a protected anchor. Interaction never mutates Transcript state outside an executor-owned operation. The local mode applies its declared bound; controlled mode requests reload from the application.
