# Installation, distribution, safety, and release flow

## Mapping

This flow satisfies PRD capabilities **P0-O01 through P0-O19**.

## Behavior view

```mermaid
sequenceDiagram
    actor Maint as Release Maintainer
    actor Dev as Developer
    participant Dist as Distribution and Resolution
    participant Host as Host Environment
    participant SDK as Public SDK Facade
    participant Runtime as Runtime Authority
    participant Obs as Diagnostic and Test Observation

    Maint->>Dist: Publish atomic SDK and five-target artifact set
    Dist->>Dist: Record exact versions, checksums, provenance, declarations, and source mappings
    Dev->>Host: Install with one package-manager command
    Host->>Dist: Resolve target and exact compatible artifact
    Dist-->>SDK: Load compatible runtime or actionable typed failure
    SDK->>Runtime: Initialize headless or interactive context
    Runtime-->>Obs: Produce install, lifecycle, semantic, security, and performance evidence
    Maint->>Obs: Run target smokes, examples, OpenCode reference, and acceptance matrix
    Obs-->>Maint: Report every P0 gate
    alt All P0 gates pass
        Maint->>Dist: Promote final pre-GA release
    else Any gate fails
        Maint->>Dist: Retain private or alpha status
    end
```

## Failure path

Unsupported targets, missing artifacts, version mismatch, load failure, unsafe content, failed cleanup, absent example evidence, or an unmet absolute or ratified comparative gate blocks final release. Diagnostics identify the failed dimension without exposing private boundary statuses.
