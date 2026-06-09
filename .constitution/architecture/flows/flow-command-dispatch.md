# Flow: Command Dispatch from Keymap Resolution

## 1. Mapping

- **PRD Capability:** Epic 11 — Commands & Keymap Foundations
- **Status:** Planned future flow for Epic R after the shipped productization and adoption waves; not shipped Brownfield runtime behavior.

---

## 2. Focus-Awareness Note

Epic R must obtain focused-context data from the Native Core through drained event payloads or an explicit query path; host-side framework services must not invent shadow focus state.

---

## 3. Sequence Diagram

```mermaid
sequenceDiagram
    actor EU as End User
    participant Term as Terminal
    participant Event as Native Event Context
    participant Host as Host Framework Services
    participant App as Developer Application
    participant Core as Native Core

    EU->>Term: Press a bound key sequence
    Term->>Event: Deliver raw key input
    Event->>Core: Buffer normalized key event through the existing facade
    App->>Host: Drain events and evaluate active keymap
    Host->>Host: Resolve focused context, command binding, and dispatch policy
    Host-->>App: Invoke the selected command
    App->>Core: Apply resulting widget or state mutations through normal host wrappers
    Core->>Core: Recompute dirty state for the next host-driven render
```
