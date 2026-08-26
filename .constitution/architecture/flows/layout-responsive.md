# Layout and responsive behavior flow

## Mapping

This flow satisfies PRD capabilities **P0-C01 through P0-C09**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant SDK as Public SDK Facade
    participant Exec as UI Executor
    participant Comp as Composition and Style Kernel
    participant Present as Presentation Pipeline
    participant Session as Terminal Session
    participant Obs as Diagnostic and Test Observation

    Dev->>SDK: Declare Flexbox, Grid, absolute, size, and responsive constraints
    SDK->>Exec: Submit validated layout intent
    Exec->>Comp: Apply constraints and mark precise dirty causes
    Session-->>Present: Report Surface and parent dimensions
    Present->>Comp: Read retained structure and responsive conditions
    Present->>Present: Resolve layout, intrinsic size, clipping, and hit geometry
    Present-->>Obs: Record geometry, active conditions, and layout time
    Present-->>Session: Provide positioned Surface update
```

## Failure path

Unsupported or contradictory constraints fail with a source-linked Issue. If no responsive condition fits, the declared clip, scroll, or minimum-size behavior applies; the pipeline never invents undefined geometry or browser document-flow behavior.
