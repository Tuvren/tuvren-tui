# ADR-T46: Plugin Slots Are Pre-GA Framework Contribution Points

- **Status:** accepted
- **Context:** Plugin slots are useful only after commands/keymaps and Effect establish the host-service boundaries they will extend. The project intends first public npm publish to be a `0.1.0` pre-GA release, not `v1.0`.
- **Decision:** Allow Epic T to define plugin slots before first public npm publish and before `v1.0` GA. Slots must be bounded host-layer contribution points for commands, keymaps, command palettes, devtools panels, themes, and showcase/example integrations. They must not let plugins own Widget state, bypass the Native Core, or mutate private native structures.
- **Consequences:** Tuvren can publish with a credible extensibility story while preserving pre-GA breaking-change freedom. Plugin API stability is explicitly not guaranteed until a later `v1.0` compatibility pass.
