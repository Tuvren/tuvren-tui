# ADR-T26: app.run() and app.stop() Remain Host-Owned Loop Constructs

- **Status:** accepted
- **Context:** Loop policy ownership must be explicit and host-controlled.
- **Decision:** `app.run()` and `app.stop()` remain host-owned loop constructs. The Native Core does not own the application event loop; it responds to host-issued commands and render triggers.
- **Consequences:** Loop policy stays explicit and host-driven. The synchronous render contract is preserved; background rendering is opt-in and experimental.
