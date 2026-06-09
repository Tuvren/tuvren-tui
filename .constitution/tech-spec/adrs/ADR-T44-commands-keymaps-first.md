# ADR-T44: Commands and Keymaps Are the First Framework-Level Host Services

- **Status:** accepted
- **Context:** The product direction is moving from a specialist library posture toward a general-purpose framework story, but the architectural invariant remains that Rust owns mutable UI state.
- **Decision:** Treat commands and keymaps as the first sanctioned framework-level host services after the shipped productization and adoption wave. They live in the Host Layer over the existing imperative command protocol and native event stream. Plugin slots are deferred until commands/keymaps and Effect integration prove their boundaries.
- **Consequences:** The framework can grow more competitive application ergonomics without weakening the native-state boundary. The command dispatch, focus integration, and keybinding resolution APIs must be designed deliberately before a plugin story is added on top.
