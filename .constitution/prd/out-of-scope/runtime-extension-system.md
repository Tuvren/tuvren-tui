# RuntimeExtension and Plugin system

- **Context:** Third-party packages could be discovered and activated through privileged contribution slots in the initial release.
- **Decision:** Deferred to P2.
- **Reason:** A RuntimeExtension needs stable activation, cleanup, isolation, error, and compatibility behavior. A Plugin additionally needs discovery, installation, permissions, and lifecycle guarantees. No evidence yet shows that ordinary package composition is insufficient.
- **Consequences:** `0.1.0` extensibility consists of ordinary packages exporting Components, Commands, Keymaps, helpers, and application services. Downstream stages must not call these packages Plugins or create contribution slots without a PRD Evolution pass.
