# Accessibility semantics flow

## Mapping

This flow satisfies PRD capabilities **P0-L01 through P0-L07**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    actor EU as End User
    participant SDK as Public SDK Facade
    participant Exec as UI Executor
    participant Comp as Composition and Style Kernel
    participant Interact as Interaction Kernel
    participant Obs as Diagnostic and Test Observation

    Dev->>SDK: Declare role, name, description, value, state, relationships, and announcement
    SDK->>Exec: Submit validated semantic transaction
    Exec->>Comp: Update Semantic Tree on runtime timeline
    EU->>Interact: Navigate by keyboard
    Interact->>Comp: Move focus within declared Focus Scope
    Comp->>Comp: Resolve visible focus and non-color state cues
    Comp-->>Obs: Expose Semantic Tree and bounded announcement
    Obs-->>SDK: Provide semantic queries and snapshots
```

## Failure path

Missing required semantics, invisible focus, color-only meaning, invalid relationships, or an unbounded announcement produces an Issue and fails Component conformance. Reduced motion changes presentation, not the resulting semantic state.
