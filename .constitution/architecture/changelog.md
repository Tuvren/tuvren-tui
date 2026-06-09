# Changelog

Local Stage 2 Changelog. Tracks semantic versioning for the Architecture layer.

---

## v3.5.0

- Reframed Epic S at the architectural layer: `tuvren-tui/effect` is now the package-first Effect application surface over the same native runtime authority, with JSX authoring, package-owned commands/keybindings, testing helpers, and advanced escape hatches instead of an adapter-like orchestration stub.

## v3.4.0

- Extended the roadmap architecture through Epics R-V: commands/keymaps, Effect, pre-GA plugin slots, SDK productization, and first public npm release as `0.1.0`.

## v3.3.0

- Rebalanced the architecture around a general-purpose Tuvren framework posture, elevated productization to an architectural concern, and added host-side framework-service direction with explicit Brownfield transition notes.

## v3.2.1

- Clarified the Text and Transcript bounded-context responsibilities so the substrate work ratified downstream is recognized as a deepening of existing logical contexts rather than a new container.

## v3.2.0

- Reformatted to the current stage-2 framework skeleton and clarified logical boundaries without changing the approved cross-language architecture.

## v3.1

- Clarified the next-phase logical emphasis without changing the core architectural invariant: transcript-heavy surfaces for long-lived applications, anchor-aware viewport behavior, developer tooling/inspection, and pane-oriented workflows are now the primary logical extensions of the existing Native Core and Host Layer split.

## v3.0

- Aligned Architecture with v3 TechSpec scope: terminal writer stage (ADR-T24), rich-text wrap cache (ADR-T25), host Runner API (ADR-T26), dashboard staple widgets (ADR-T27), editor-grade TextArea extensions (ADR-T28), distribution prebuild strategy (ADR-T29), deterministic golden and benchmark gates (ADR-T30), and conditional background render thread policy (ADR-T31). Updated FFI contract semantics and event drain flows (`tui_read_input` + `tui_next_event`).

## v2.3

- Added v2 scope: Tree Module operations (subtree destruction, indexed insertion), v2 module additions (Reconciler Layer), new Appendix B decisions for v2. Resolved Risk 1 with safe concurrency primitives. Added Risk 7 (background render thread — explicitly descoped to v3). Updated Appendix A with ADR-004 amendment. **v2 COMPLETE — March 2026**.

## v2.2

- Removed §6 Performance Budgets (implementation-level detail; migrated to TechSpec §5.5). Removed stale `lrsa-320` marker. Fixed duplicate §6 numbering — Logical Risks & Technical Debt is now the sole §6 per the Architecture output standard.
