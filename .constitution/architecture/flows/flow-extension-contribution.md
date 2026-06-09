# Flow: Extension Contribution Registration

## 1. Mapping

- **PRD Capability:** Epic 13 — Extension Slots and Framework Contributions
- **Status:** Planned future flow for Epic T after commands/keymaps and Effect stabilize; not shipped Brownfield runtime behavior.

---

## 2. Authority Note

Extensions may contribute host-layer services and UI composites, but all Widget mutation still flows through ordinary Host-to-Core commands.

---

## 3. Sequence Diagram

```mermaid
sequenceDiagram
    participant Plugin as Extension Package
    participant Host as Host Framework Services
    participant App as Developer Application
    participant Core as Native Core

    App->>Host: Register extension during application setup
    Host->>Plugin: Provide bounded ExtensionContext
    Plugin-->>Host: Contribute commands, keymaps, palette items, devtools panels, themes, or examples
    Host->>Host: Validate contributions and attach them to registries
    App->>Host: Invoke contributed service through normal framework APIs
    Host->>Core: Apply resulting Widget mutations through ordinary wrappers
```
