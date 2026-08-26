# Changelog

This changelog records Stage 1 product-contract versions. It follows Semantic Versioning and Keep a Changelog conventions.

## [v3.0.0] — 2026-08-26

### Added

- Declared `Library/SDK` as the primary archetype and `System/Native` as the secondary archetype with high confidence.
- Defined the complete P0 `0.1.0`, P1 `0.2.0`, and evidence-led P2 capability horizons.
- Added atomic requirements for the Effect UI SDK, Imperative SDK, Components, native-backed Primitives, layout, styling, text, editing, Events, Commands, Virtual Collections, Transcript behavior, terminal integration, clipboard, accessibility, animation, devtools, testing, safety, distribution, and release evidence.
- Added the 120 Hz goal, 90 Hz degraded tier, 60 Hz failure threshold, reference workload envelope, adoption timing, devtools overhead, privacy, reliability, and platform release meters.
- Added approved canonical terms for Component, Primitive, RuntimeNode, SDK surfaces, styling, rich text, data projection, semantics, terminal capability, and diagnostics.

### Changed

- Reframed Tuvren as a truly general-purpose terminal UI library rather than an agent-focused toolkit or command-line application.
- Made the preferred declarative workflow the default product experience while retaining a capability-complete imperative foundation and advanced embedding surface.
- Replaced the earlier Widget vocabulary and solution-shaped domain context with a technology-independent Component and Primitive product model.
- Replaced broad roadmap epics with testable product outcomes and explicit release priorities.
- Promoted accessibility foundations, animation, rich clipboard behavior, Grid, the first-party Component catalog, and local devtools into the P0 contract.
- Moved bidirectional text, advanced editor behavior, cell and image surfaces, application routing, form orchestration, spring and keyframe animation, and assistive-technology bridges to P1 `0.2.0`.
- Limited `0.1.0` third-party extensibility to ordinary package composition and reserved RuntimeExtension and Plugin contracts for evidence-led evolution.

### Removed

- Removed Plugin slots, background rendering, a public reactive primitive, a separate declarative package entrypoint, and raw native-boundary knowledge from the initial product contract.
- Removed browser framework parity, general browser layout emulation, generic runtime-tree persistence, and a built-in remote-session service from the active roadmap.

### Security

- Made untrusted terminal, clipboard, subprocess, content, trace, and native-boundary handling a measured release requirement.
- Added default diagnostic redaction and artifact-provenance gates.

## [v2.7.0]

### Changed

- Increased the host bundle budget from 75 KB to 100 KB to accommodate planned framework services while keeping the host layer intentionally thin.

## [v2.6.0]

### Changed

- Clarified the planned package-first declarative application surface over the same native runtime authority.

## [v2.5.0]

### Added

- Sequenced commands and keymaps, declarative integration, extension slots, SDK productization, and a first public pre-GA release.

## [v2.4.0]

### Changed

- Reframed the product as a general-purpose framework and adopted the Tuvren public identity.

## [v2.3.0]

### Changed

- Reformatted Stage 1 to the prior constitution skeleton while preserving approved scope and operator preferences.

## [v2.2.0]

### Added

- Added Commands and Keymaps as a P0 capability.

## [v2.1.0]

### Added

- Added productized installation and release trust as a P0 capability.

## [v2.0.0]

### Changed

- Rewrote the product contract from a specialist library to a general-purpose framework posture.

## [v1.x]

Earlier Stage 1 history remains available in version control.
