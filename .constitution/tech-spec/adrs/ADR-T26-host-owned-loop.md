# ADR-T26: app.run() and app.stop() Remain Host-Owned Loop Constructs

- **Status:** superseded by ADR-T50, ADR-T51, and ADR-T52
- **Supersession:** Managed Effect and imperative lifecycles are the default; a host-controlled manual loop remains only as the advanced Imperative SDK embedding surface.
- **Context:** Loop policy ownership must be explicit and host-controlled.
- **Decision:** `app.run()` and `app.stop()` remain host-owned loop constructs. The Native Core does not own the application event loop; it responds to host-issued commands and render triggers.
- **Consequences:** Loop policy stays explicit and host-driven. The synchronous render contract is preserved; background rendering is opt-in and experimental.
