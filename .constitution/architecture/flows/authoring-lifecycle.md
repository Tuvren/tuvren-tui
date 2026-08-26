# Authoring and lifecycle flow

## Mapping

This flow satisfies PRD capabilities **P0-A01 through P0-A09**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant SDK as Public SDK Facade
    participant Orch as Application Orchestration
    participant Exec as UI Executor
    participant Runtime as Runtime Authority
    participant Session as Terminal Session

    Dev->>SDK: Start managed Effect UI SDK or Imperative SDK application
    SDK->>Orch: Open scoped lifecycle
    Orch->>Exec: Submit initialization transaction
    Exec->>Runtime: Apply ordered initialization
    Runtime->>Session: Enter selected Screen Mode
    Session-->>Runtime: Ready with Capability Tier
    Dev->>SDK: Describe view or issue imperative operations
    SDK->>Orch: Validate and reconcile intent
    Orch->>Exec: Submit bounded transaction
    Exec->>Runtime: Apply serialized commands
    Exec->>Runtime: Request at most one Render Pass
    Runtime-->>SDK: Typed transaction outcome
    Dev->>SDK: End application or receive interruption
    SDK->>Orch: Close scope and cancel child work
    Orch->>Exec: Drain or cancel pending UI work
    Exec->>Runtime: Shut down context
    Runtime->>Session: Restore terminal
```

## Failure path

Invalid intent rejects before enqueue. Saturation applies the declared backpressure or rejection policy without unbounded storage. Recoverable application, Command, Component, and validation failures preserve the active context and last known-good Surface where possible. An unrecovered root-lifecycle or runtime-invariant failure cancels scoped work, preserves bounded diagnostics, restores the terminal, and discards the inconsistent runtime context rather than reusing it.
