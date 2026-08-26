# Styling and Theme flow

## Mapping

This flow satisfies PRD capabilities **P0-D01 through P0-D09**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant SDK as Public SDK Facade
    participant Exec as UI Executor
    participant Comp as Composition and Style Kernel
    participant Present as Presentation Pipeline
    participant Obs as Diagnostic and Test Observation

    Dev->>SDK: Register StyleSheet, ThemeTokens, and ThemeRecipes
    Dev->>SDK: Apply Theme, instance, slot, or inline override
    SDK->>Exec: Submit typed style transaction with source identity
    Exec->>Comp: Store declarations and supported conditions
    Comp->>Comp: Match state and environment conditions
    Comp->>Comp: Resolve approved precedence order
    Comp-->>Present: Provide resolved style and dirty scope
    Comp-->>Obs: Record winning, overridden, and inactive declarations
    Present-->>Obs: Record style-related Render Pass work
```

## Failure path

Unknown properties, conditions, or private slots reject at the SDK or runtime validation seam. A condition mismatch selects the next valid declaration; it does not invoke application code or fall back to a general selector cascade.
