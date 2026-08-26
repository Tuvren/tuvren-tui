# Changelog

This changelog records Stage 3 implementation-contract versions. It follows Semantic Versioning and Keep a Changelog conventions.

## [v9.0.3] — 2026-08-26

### Fixed

- Added the fuzz-only `nightly-2026-08-20` toolchain, rust-src, cargo-fuzz 0.13.2, C++11 compiler, supported worker policy, and explicit dated-toolchain commands without changing the stable production MSRV.
- Added `--locked` to every canonical native release build executed by semantic, terminal, and benchmark workspace scripts.

## [v9.0.2] — 2026-08-26

### Fixed

- Removed the undeclared durable evidence-index promise from the aggregate release gate; the command now emits a human-readable candidate report and the existing schema-valid atomic manifest while checking constituent evidence freshness directly.
- Made every root-invoked cargo-fuzz command select the declared `native/fuzz/` project explicitly with `--fuzz-dir`.
- Made semantic, terminal, and benchmark workspace scripts rebuild the current native release artifact before any Bun process loads it.

## [v9.0.1] — 2026-08-26

### Fixed

- Added the root-owned `check:release-candidate` command so Stage 4 can verify the complete P0 evidence set and atomic manifest through one declared executable gate instead of treating the narrower package test as release proof.

## [v9.0.0] — 2026-08-26

### Added

- Added a version-pinned 2026 bill of materials with adoption posture, exact lock and upgrade policy, and explicit TypeScript 7 and Bun FFI evidence.
- Added raw TypeScript declaration contracts for every public package entrypoint, a private C ABI header, and a parseable CLI command contract.
- Added schema-valid durable models for Diagnostic Traces, snapshots, terminal profiles, application replay, benchmark results, and atomic release manifests.
- Added target physical modules for the UI executor, explicit runtime contexts, transaction codec, native behavior kernels, full-grapheme cells, terminal state machine, diagnostics, and release validation.
- Added ADRs for the toolchain and private bridge, Effect-first package surface, batched UI transactions, context isolation, grapheme cells, retained kernels, modern terminal protocol handling, diagnostics, distribution, and conditional Event arbitration.

### Changed

- Replaced the fictional HTTP/OpenAPI host contract with ecosystem-native SDK declarations and a private native ABI contract.
- Replaced the global implicit runtime context with explicit context identities owned by one UI executor thread.
- Replaced per-call mutation as the target hot path with prevalidated transaction batches and one Render Pass request per transaction.
- Made Effect 3 the required declarative peer major at the bare package entrypoint; moved the Imperative SDK to its approved explicit subpath and made Reactivity private.
- Upgraded the target toolchain and direct dependency baselines while recording Brownfield migration rather than claiming those upgrades are already shipped.
- Replaced single-scalar cells and byte-oriented public positions with full-grapheme cell payloads and grapheme-indexed public contracts.
- Expanded terminal, clipboard, Screen Mode, StyleSheet, Grid, Component, accessibility, projection, diagnostic, testing, and release contracts to the complete P0 scope.

### Deprecated

- Deprecated root imperative exports, the `/effect` entrypoint, public Signals, Extension registries, global runtime access, numeric public identities, and direct per-property mutation calls.

### Removed

- Removed Plugin slots and background rendering from the target implementation contract.
- Removed ephemeral runtime structs masquerading as durable schema artifacts.

### Security

- Added ABI prevalidation, fuzz targets, strict terminal and durable-file decoding, diagnostic redaction, explicit clipboard requests, exact artifact matching, checksums, and provenance.

## [v8.1.0]

### Changed

- Increased the prior host bundle budget from 75 KB to 100 KB.

## [v8.0.0]

### Added

- Added the former pre-GA Plugin-slot contract, now superseded by v9.0.0.

## [v7.9.0]

### Added

- Added the former separate declarative package surface, now superseded by the bare Effect-first entrypoint.

## [v7.8.0]

### Added

- Added the first host-side Command and Keymap implementation.

## [v7.7.0]

### Changed

- Extended the former contract through productization and first publish planning.

## [v7.6.0]

### Changed

- Activated the Tuvren naming and auxiliary-platform-package direction.

## [v7.4.1]

### Added

- Recorded the shipped first terminal-capability implementation.

## [v7.4.0]

### Added

- Added the earlier detection-first, write-only clipboard, hyperlink, and enhanced-keyboard contract.

## [v7.3.2]

### Fixed

- Reconciled the operation-based edit and native text substrate with Brownfield source.

## [v7.3.1]

### Changed

- Moved Transcript block content onto substrate identities.

## [v7.3.0]

### Changed

- Refined dirty-range, getter, and benchmark behavior.

## [v7.2.0]

### Added

- Recorded the shipped native TextBuffer, TextView, and unified renderer.

## [v7.1.0]

### Added

- Added the former native text substrate, edit history, Transcript backing, ABI, and acceptance contracts.

## [v7.0.0]

### Changed

- Converted the earlier forward-looking specification into a Brownfield contract.

## [v6.0.0]

### Changed

- Reoriented the prior contract around Transcript, devtools, minimal native expansion, and flagship examples.
