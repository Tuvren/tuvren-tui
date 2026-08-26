# Command and Keymap flow

## Mapping

This flow satisfies PRD capabilities **P0-H01 through P0-H08**.

## Behavior view

```mermaid
sequenceDiagram
    actor Source as End User or application
    participant Orch as Application Orchestration
    participant Command as Command coordinator
    participant Exec as UI Executor
    participant Runtime as Runtime Authority
    participant Obs as Diagnostic and Test Observation

    Source->>Orch: Invoke by Keymap, menu, button, palette, or programmatic call
    Orch->>Command: Resolve stable identity and source context
    Command->>Command: Evaluate visible, enabled, contextual, and scope precedence
    Command->>Command: Apply reject, restart, queue, or parallel policy
    Command->>Obs: Open causal Command span
    Command->>Exec: Submit resulting UI transaction when produced
    Exec->>Runtime: Apply serialized UI changes
    Command-->>Source: Return typed success, interruption, or failure
    Command->>Obs: Close causal Command span
```

## Failure path

Missing, disabled, conflicting, or unavailable Commands return an explicit disposition. Restart cancels prior work before replacement; queue remains bounded; failure travels through the declared error boundary without duplicating action logic across invocation sources.
