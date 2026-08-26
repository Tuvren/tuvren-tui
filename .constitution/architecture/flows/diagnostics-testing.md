# Devtools, testing, and diagnostics flow

## Mapping

This flow satisfies PRD capabilities **P0-N01 through P0-N16**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant SDK as Public SDK Facade
    participant Orch as Application Orchestration
    participant Exec as UI Executor
    participant Runtime as Runtime boundaries
    participant Obs as Diagnostic and Test Observation
    participant Inspector as Inspect, Timeline, and Issues

    Runtime-->>Obs: Emit bounded causal records and read-only state projections
    Dev->>SDK: Inspect, record, query semantics, replay, or run headlessly
    SDK->>Obs: Submit diagnostic or test request with privacy policy
    Obs->>Obs: Correlate graph, deltas, snapshots, tiers, errors, and cleanup
    Obs-->>Inspector: Present synchronized Inspect, Timeline, and Issues views
    Inspector-->>Dev: Identify source, cause, interval, remediation, and actions
    Dev->>Inspector: Focus inspector
    Inspector->>SDK: Request diagnostic focus
    SDK->>Orch: Pause application input routing
    Orch->>Exec: Submit inspector-focus transaction
    Exec->>Runtime: Apply focus transfer
    Dev->>Inspector: Return focus to application
    Inspector->>SDK: Release diagnostic focus
    SDK->>Orch: Resume application input routing
    opt Replay
        Dev->>Obs: Supply runtime trace or logical application input
        Obs-->>SDK: Produce validated bounded replay plan
        alt Captured runtime replay
            SDK->>Exec: Open empty isolated runtime context without application handlers
            Exec->>Runtime: Feed captured Event batches with outward application delivery suppressed
            Exec->>Runtime: Apply captured transaction batches once at recorded sequence positions
        else Logical application replay
            SDK->>Orch: Open isolated application context with current handlers
            Orch->>Exec: Submit logical test actions through normal orchestration
            Exec->>Runtime: Apply resulting serialized work
        end
        Runtime-->>Obs: Produce new semantic and visual evidence
    end
    opt Development watch change
        SDK->>Orch: Cancel old application scope
        Orch->>Exec: Shut down old runtime context
        Exec->>Runtime: Clean up and discard private identities
        SDK->>Orch: Open fresh application scope
        Orch->>Exec: Initialize fresh runtime context
    end
```

## Failure path

Diagnostic overflow records a wrap marker. Unattributed late work becomes an explicit tooling defect. Malformed or incompatible traces reject before an isolated replay context starts. Runtime replay never executes current application handlers: captured Events drive only native interaction/default behavior, outward application delivery is suppressed, and captured application transactions are applied exactly once. Logical application replay intentionally executes current handlers and does not also inject captured transactions. If focus transfer fails, application input remains paused until focus ownership is known or the supervisor restores the session. If watch cleanup fails, the old context is discarded and no private identity crosses into the replacement. If the inspector cannot start, the supervisor restores the terminal and emits a redacted report outside the failed context.
