# Devtools, testing, and diagnostics flow

## Mapping

This flow satisfies PRD capabilities **P0-N01 through P0-N16**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant SDK as Public SDK Facade
    participant Runtime as Runtime boundaries
    participant Obs as Diagnostic and Test Observation
    participant Inspector as Inspect, Timeline, and Issues

    Runtime-->>Obs: Emit bounded causal records and read-only state projections
    Dev->>SDK: Inspect, record, query semantics, replay, or run headlessly
    SDK->>Obs: Submit diagnostic or test request with privacy policy
    Obs->>Obs: Correlate graph, deltas, snapshots, tiers, errors, and cleanup
    Obs-->>Inspector: Present synchronized Inspect, Timeline, and Issues views
    Inspector-->>Dev: Identify source, cause, interval, remediation, and actions
    opt Replay
        Dev->>Obs: Supply runtime trace or logical application input
        Obs->>Runtime: Reproduce bounded runtime intents or test actions
        Runtime-->>Obs: Produce new semantic and visual evidence
    end
```

## Failure path

Diagnostic overflow records a wrap marker. Unattributed late work becomes an explicit tooling defect. Malformed or incompatible traces reject safely. If the inspector cannot start, the supervisor restores the terminal and emits a redacted report outside the failed context.
