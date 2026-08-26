# Component composition flow

## Mapping

This flow satisfies PRD capabilities **P0-B01 through P0-B09**.

## Behavior view

```mermaid
sequenceDiagram
    actor Author as Component Author
    actor Dev as Developer
    participant SDK as Public SDK Facade
    participant Orch as Application Orchestration
    participant Exec as UI Executor
    participant Comp as Composition and Style Kernel
    participant Obs as Diagnostic and Test Observation

    Author->>SDK: Package Component over public Primitives and contracts
    Dev->>SDK: Compose first-party and packaged Components
    SDK->>Orch: Produce author tree with stable identities
    Orch->>Orch: Reconcile private Component output to Primitive deltas
    Orch->>Exec: Submit create, update, reorder, and destroy transaction
    Exec->>Comp: Apply ordered RuntimeNode changes
    Comp->>Comp: Resolve controlled or uncontrolled authority per property
    Comp-->>Obs: Record Component-to-Primitive mapping and dirty causes
    Comp-->>SDK: Expose typed changes and semantic state
```

## Failure path

Invalid composition, conflicting property authority, or unsupported Component state rejects with Component context before corrupting the retained tree. A failed package composition has no privileged recovery path and cannot register private runtime behavior.
