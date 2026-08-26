# Strategy

## Version

**v4.0.7** — corresponds to the latest entry in `.constitution/architecture/changelog.md`.

## Architectural pattern

Tuvren is an in-process, layered SDK around a single-writer retained UI runtime. Two public authoring surfaces—the Effect UI SDK and Imperative SDK—converge on one bounded UI executor. The executor is the only mutation gateway into a modular native runtime that owns the Composition Tree, interaction state, content projections, layout, rendering, terminal session, and diagnostic graph.

The runtime is a modular monolith, not a set of processes or services. Its internal boundaries hide distinct sources of complexity while sharing one application context and one serialized mutation timeline. Application domain state remains outside the runtime. Tuvren stores only applied values, declared uncontrolled values, and ephemeral UI state.

## Why this pattern fits

The `Library/SDK` archetype requires one-command adoption, coherent public contracts, capability parity, and no native burden in ordinary workflows. The `System/Native` secondary archetype requires one mutable authority, deterministic input and rendering, strict terminal lifecycle control, bounded memory, and active Render Pass service within the 8.33 ms goal and 16.67 ms failure threshold.

The layered single-writer pattern satisfies both:

- Public authoring and application concurrency remain ergonomic without allowing concurrent mutation of runtime state.
- One UI executor defines ordering, backpressure, cancellation, coalescing, and transaction boundaries before work reaches the runtime.
- Expensive, repeated, correctness-sensitive behavior stays within the retained runtime instead of returning to the SDK on every interaction.
- The terminal session is a trust and lifecycle boundary rather than incidental output plumbing.
- Diagnostics observe the same causal timeline as interaction and rendering without becoming a second mutable UI model.
- Headless execution substitutes the Terminal Environment at a boundary that preserves the rest of the runtime path.

## Governing invariants

1. The runtime is the sole mutable UI authority.
2. Application domain state remains application-owned; controlled properties have one authority at a time.
3. All runtime mutations enter through one serialized UI executor.
4. One accepted UI transaction requests no more than one Render Pass.
5. The runtime never calls application code from inside a mutation or Render Pass.
6. The Effect UI SDK and Imperative SDK share capabilities and runtime semantics, not necessarily API shapes.
7. Component internals remain private; stable named slots and semantic contracts are the customization boundary.
8. Terminal Capabilities are detected individually, and one unavailable capability does not unnecessarily demote the application.
9. Diagnostic observation is bounded and read-only with respect to application UI state.
10. Correctness, Event ordering, text behavior, accessibility, terminal restoration, and final state do not degrade to protect frame rate.

## Logical layering

| Layer | Architectural role | Primary PRD trace |
| :-- | :-- | :-- |
| Public authoring | Effect UI SDK, Imperative SDK, Components, public errors, testing facade | P0-A, P0-B, P0-N |
| Application orchestration | Managed lifecycle, structured concurrent work, Commands, Keymaps, private Reactivity, reconciliation, error boundaries | P0-A, P0-G, P0-H |
| UI executor | Ordered transactions, backpressure, batching, cancellation, coalescing, Render Pass requests | P0-A06–P0-A09, REL-03 |
| Runtime authority | Composition, style, interaction, text, projections, animation, semantics, rendering | P0-B–P0-M |
| Terminal session | Screen Modes, capability negotiation, input/output, clipboard, external output, cleanup | P0-K, REL-01, SAFE-01 |
| Diagnostics and test observation | Diagnostic Graph, Trace, Issues, replay, headless profiles, semantic snapshots | P0-N, TOOL-01–TOOL-05 |
| Distribution and resolution | Atomic artifacts, target selection, compatibility checks, local diagnostics | P0-O, OPS-01–OPS-06 |

## Trade-offs accepted

- **Serialized UI work can become a bottleneck.** Tuvren accepts this sensitivity in exchange for deterministic ownership. The response is batching, caching, delta work, bounded projections, and measurement—not parallel mutable UI state.
- **The native boundary increases release complexity.** Tuvren accepts a multi-artifact release matrix to provide native-class performance without exposing native setup to Developers.
- **Two SDK workflows increase surface area.** Capability parity is worth the maintenance cost because the preferred Effect UI SDK and explicit Imperative SDK serve different integration jobs. Shared runtime behavior limits semantic duplication.
- **Restricted styling and layout reject browser parity.** This keeps state-driven styling and layout resolution predictable within terminal budgets.
- **Modern capability use increases environmental variance.** Detection-first degradation and a compatible tier contain that variance while preserving the modern-terminal advantage.
- **Local diagnostics consume budget.** The Diagnostic Graph is mandatory, but disabled and passive modes have strict overhead limits and bounded storage.
- **Event interception remains conditional.** Architecture does not ratify the provisional two-phase mechanism. OD-02 must produce feasibility evidence before the interception lifecycle and boundary protocol become binding.

## Native promotion rule

Components remain public compositions over Primitives and reusable runtime kernels. A Component is eligible for deeper runtime promotion only after stable identity, batching, caching, and delta reconciliation miss an approved budget; a prototype must then show material latency or memory improvement without changing the Component contract. OD-01 must ratify the final promotion cuts.

## Brownfield transition

The repository already demonstrates the modular runtime, terminal boundary, retained tree, synchronous Render Pass, text substrate, Transcript projection, capability state, deterministic headless rendering, and bounded diagnostic traces. It does not yet implement the target boundary contract completely:

- The current bare SDK export is imperative rather than Effect-first.
- The current declarative surface lives under a separate package path and exposes its reactive mechanism.
- Current Commands, Keymaps, and reconciliation call the runtime without a dedicated bounded UI executor.
- Current extension registries exceed the approved `0.1.0` package-composition boundary.
- Current public vocabulary and several source types still use the legacy `Widget` identifier.
- Current terminal, clipboard, styling, Grid, Component catalog, accessibility, diagnostics, and release evidence cover only part of P0.
- Current Event delivery does not settle OD-02's conditional interception behavior.

Downstream stages must describe these as migration work. They must not rewrite the target architecture to preserve stale Brownfield surfaces.
