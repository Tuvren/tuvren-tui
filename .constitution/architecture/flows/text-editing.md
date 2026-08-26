# Text editing flow

## Mapping

This flow satisfies PRD capabilities **P0-F01 through P0-F10**.

## Behavior view

```mermaid
sequenceDiagram
    actor EU as End User
    actor Dev as Developer
    participant Orch as Application Orchestration
    participant Exec as UI Executor
    participant Interact as Interaction Kernel
    participant Content as Content and Projection Kernel
    participant Session as Terminal Session
    participant Present as Presentation Pipeline

    EU->>Session: Navigate, select, edit, paste, undo, redo, find, or replace
    Session->>Interact: Deliver normalized input
    Interact->>Content: Apply editing action at grapheme boundary
    Content->>Content: Update Text Document and operation history
    Content-->>Orch: Emit controlled-value or validation change when applicable
    Dev->>Orch: Accept or replace controlled value
    Orch->>Exec: Submit latest-generation controlled update
    Exec->>Content: Apply accepted authority value
    Content-->>Present: Provide cursor, selection, wrap, and visible text projection
```

## Failure path

Read-only, disabled, maximum-length, validation, secure-entry, or stale-generation rules reject or contain the edit according to the declared mode. Invalid clipboard input is bounded and sanitized before it can alter the Text Document.
