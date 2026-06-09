# Flow: First Public Package Install

## 1. Mapping

- **PRD Capability:** Epic 10 — Productized Installation & Release Trust; Epic 14 — Expert-Level SDK Developer Experience
- **Status:** Planned future flow for Epic V after SDK productization; not shipped Brownfield npm behavior.

---

## 2. Sequence Diagram

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant PM as Package Manager
    participant Public as tuvren-tui Package
    participant Aux as @tuvren/tuvren-tui-<platform>-<arch> Package
    participant Host as Host Resolver
    participant Core as Native Core

    Dev->>PM: Install tuvren-tui@0.1.0
    PM->>Public: Fetch public package
    PM->>Aux: Fetch matching optional native package when supported
    Dev->>Host: Run application
    Host->>Aux: Resolve native library by package name
    Host->>Core: Load native library and initialize runtime
```
