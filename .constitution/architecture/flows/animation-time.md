# Animation and time flow

## Mapping

This flow satisfies PRD capabilities **P0-M01 through P0-M06**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant SDK as Public SDK Facade
    participant Exec as UI Executor
    participant Time as Animation and Time Kernel
    participant Present as Presentation Pipeline
    participant Obs as Diagnostic and Test Observation

    Dev->>SDK: Define property animation, timeline behavior, and reduced-motion policy
    SDK->>Exec: Submit animation transaction
    Exec->>Time: Create, replace, cancel, or group animation
    loop On elapsed-time opportunity
        Time->>Time: Advance from elapsed time
        Time-->>Present: Apply current property values and dirty cause
        Present-->>Obs: Record tier and presentation
    end
    Time-->>Exec: Complete native operation with Animation Event
    Exec-->>SDK: Deliver Event and resolve or interrupt handle after completion
```

## Failure path

Invalid properties or timelines reject before activation. The native Time kernel never resolves an SDK handle directly; completion returns as an Animation Event through the executor-owned drain after native work ends. Under frame pressure, intermediate decorative presentations may be reduced, but elapsed duration, final state, completion, cancellation, and reduced-motion outcomes remain correct. Tests substitute deterministic manual time.
