# ADR-T35: Minimal Native Expansion, Not Generic Widget Inflation

- **Status:** superseded by ADR-T54
- **Supersession:** The evidence-driven promotion principle remains, while the target now defines reusable native interaction, collection, modal, text, style, animation, and presentation kernels.
- **Context:** Dense application layouts required better pane behavior, but the product did not need a broad new wave of native widgets to prove its identity.
- **Decision:** Add `SplitPane` as the only new native layout primitive in this wave and keep `CommandPalette`, `TracePanel`, `StructuredLogView`, `CodeView`, and `DiffView` as host composites over existing primitives unless measured pressure justifies native promotion later.
- **Consequences:** The native surface stays focused and smaller. The host layer must maintain disciplined composite abstractions and preserve the invariant that Rust still owns the performance-critical state.
