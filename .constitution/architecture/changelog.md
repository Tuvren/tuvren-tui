# Changelog

This changelog records Stage 2 architecture versions. It follows Semantic Versioning and Keep a Changelog conventions.

## [v4.0.7] — 2026-08-26

### Fixed

- Routed completed Interaction and Animation Events through the UI Executor before application or SDK delivery.

## [v4.0.6] — 2026-08-26

### Fixed

- Required Collection and Transcript native operations to complete through the UI Executor before intents or Events reach application orchestration.

## [v4.0.5] — 2026-08-26

### Fixed

- Routed normalized Collection and Transcript input into the UI Executor before hit-testing or keyed-intent derivation.

## [v4.0.4] — 2026-08-26

### Fixed

- Split Virtual Collection selection into application-controlled intent and bounded-local commit paths.
- Split runtime replay from logical application replay so captured Events suppress current application handlers and captured transactions apply exactly once.

## [v4.0.3] — 2026-08-26

### Fixed

- Routed accessibility focus and Transcript interaction through executor-owned operations and corrected the container diagram so normalized Terminal input enters the UI Executor before the Interaction Kernel.

## [v4.0.2] — 2026-08-26

### Fixed

- Routed text-editing and Virtual Collection interaction transitions through explicit executor-owned serialized operations, matching the governing single-writer invariant and the corrected input flow.

## [v4.0.1] — 2026-08-26

### Fixed

- Made the UI Executor initiation and ownership of input, Interaction, and Composition transitions explicit in the input flow, removing an apparent second native mutation path.

## [v4.0.0] — 2026-08-26

### Added

- Added a bounded single-writer UI Executor between application orchestration and the mutable runtime authority.
- Defined distinct logical boundaries for public authoring, application orchestration, composition and styling, interaction, content projections, animation and time, presentation, terminal sessions, diagnostics and testing, and distribution.
- Added explicit state ownership, trust boundaries, failure containment, performance-overrun behavior, diagnostic observation, release resilience, sensitivity points, Brownfield debt, and STRIDE notes.
- Added one critical flow per P0 capability epic with exact capability-ID mappings and failure paths.

### Changed

- Reframed the architecture as an in-process layered SDK over a single-writer modular native runtime, aligned to the `Library/SDK` primary and `System/Native` secondary archetypes.
- Replaced the stale two-container facade/core view with a module and pipeline diagram that exposes ordering, mutation, content, terminal, and observation seams.
- Made the Effect UI SDK the preferred authoring surface while retaining a capability-complete Imperative SDK.
- Replaced the legacy public-object vocabulary, numeric private-identity exposure, separate declarative-package, Plugin-slot, and host-driven loop assumptions with the approved Component, Primitive, private RuntimeNode, ordinary package composition, and managed lifecycle contract.
- Made 120 Hz, 90 Hz, and 60 Hz presentation tiers, input priority, terminal restoration, and diagnostic overhead architectural concerns.

### Removed

- Removed background rendering, privileged extension registration, public Reactivity, and eager host or runtime Event arbitration as settled architectural contracts.
- Removed code-level boundary statuses and concrete package topology from Stage 2; Stage 3 owns those contracts.

### Security

- Added validation, bounds, correlation, timeout, redaction, artifact provenance, and safe-context-restart tactics across all untrusted boundaries.

## [v3.5.0]

### Changed

- Reframed the former separate declarative package as a package-first application surface over the same native authority.

## [v3.4.0]

### Added

- Extended the former roadmap through Commands, Keymaps, declarative integration, Plugin slots, SDK productization, and first public pre-GA release.

## [v3.3.0]

### Changed

- Rebalanced the prior architecture around a general-purpose framework posture and elevated productization and host-side services.

## [v3.2.1]

### Fixed

- Clarified Text and Transcript responsibilities as a deepening of existing logical contexts.

## [v3.2.0]

### Changed

- Reformatted the architecture to the previous Stage 2 skeleton.

## [v3.1.0]

### Changed

- Added transcript-heavy surfaces, anchor-aware viewports, developer inspection, and pane-oriented workflows to the architectural emphasis.

## [v3.0.0]

### Changed

- Aligned the prior architecture with the earlier rendering, text, runner, control, editing, distribution, testing, and experimental threading direction.

## [v2.3.0]

### Added

- Added retained-tree operations and a reconciler boundary to the earlier architecture.

## [v2.2.0]

### Changed

- Moved performance budgets to the implementation contract and corrected the earlier architecture structure.
