# Input, Event, focus, and direct-manipulation flow

## Mapping

This flow satisfies PRD capabilities **P0-G01 through P0-G08**. P0-G03 and P0-G04 remain contingent on OD-02.

## Behavior view

```mermaid
sequenceDiagram
    actor EU as End User
    participant Term as Terminal Environment
    participant Session as Terminal Session
    participant Interact as Interaction Kernel
    participant Comp as Composition and Style Kernel
    participant Orch as Application Orchestration
    participant Exec as UI Executor

    EU->>Term: Provide keyboard, pointer, focus, paste, or resize input
    Term->>Session: Deliver raw input or terminal response
    Session->>Session: Decode and separate responses from End User input
    Session->>Exec: Enqueue normalized bounded input
    Exec->>Interact: Begin serialized executor-owned input operation
    Interact->>Comp: Hit-test and resolve focus, modal, capture, and interaction root
    Interact->>Interact: Order Event and applicable default behavior
    opt OD-02 ratified for this Event class
        Interact->>Orch: Offer cancelable interaction before default commits
        Orch-->>Interact: Return supported disposition within the ratified lifecycle
    end
    Interact->>Comp: Apply allowed focus or interaction transition inside operation
    Interact-->>Exec: Complete transition and ordered Event record
    Exec-->>Orch: Deliver ordered observable Event
    Orch->>Exec: Submit resulting UI transaction
```

## Failure path

Malformed input, missing target, handler failure, reentrancy, shutdown, or queue pressure cannot leave a pending Event unbounded or apply a transition twice. Input polling and every Interaction or Composition transition occur only in the serialized operation initiated by the UI Executor; Terminal Session decoding never mutates UI state directly. Until OD-02 is ratified, downstream design must not assume capture, bubble, disposition timing, or a host round trip.
