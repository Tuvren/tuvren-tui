# ADR-T34: Dev Mode Is Core Product Work

- **Status:** accepted
- **Context:** Long-lived complex terminal applications are difficult to debug without inspecting layout, focus, dirty propagation, viewport state, and render cost.
- **Decision:** Add native debug snapshot and trace APIs, bounded per-kind trace rings, overlay rendering, host-side inspector and HUD surfaces, and deterministic dev-session helpers.
- **Consequences:** The implementation gains a stable diagnostics surface that examples and developers can rely on. Debug JSON contracts, overlay flags, and overhead budgets become part of the maintained public surface.
