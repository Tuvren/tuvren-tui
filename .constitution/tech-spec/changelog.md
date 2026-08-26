# Changelog

This changelog records Stage 3 implementation-contract versions. It follows Semantic Versioning and Keep a Changelog conventions.

## [v9.0.20] — 2026-08-26

### Fixed

- Made the validated Rust transaction model field-complete for render requests, creation, Collection, Transcript, animation, terminal, and diagnostic operations and removed raw post-validation payload bytes.
- Assigned TypeScript 5.9.3 to the root private workspace and made the strict host aggregate build the locked release library before running FFI-backed suites.

## [v9.0.19] — 2026-08-26

### Fixed

- Added a deterministic Effect/imperative host animation suite that proves handles resolve only after executor-owned Animation Event drain, and included it in the strict host aggregate.

## [v9.0.18] — 2026-08-26

### Fixed

- Completed Interaction and Animation Event delivery through the UI Executor with no native-to-host callback path.
- Defined Transcript unbound, teardown, cache-clear, pending-cancel, and rebind dispositions and removed declarative controller injection from imperative constructors.
- Added the canonical strict host aggregate to release candidates and specified every ABI return/result status and output-initialization rule.

## [v9.0.17] — 2026-08-26

### Fixed

- Required Collection/Transcript native completion before application delivery and defined Transcript controller-to-target binding plus executor-cached visible ranges.
- Bound ring-wrap payload identities to correlation fields and required unknown Event modifier bits to fail every live/test/replay decoder.
- Changed final publication to quarantined exact artifacts, full registry verification, and same-byte final-tag promotion.

## [v9.0.16] — 2026-08-26

### Fixed

- Added authoritative transaction/render identities to typed ring-wrap records and required the wrap baseline to match before inheritance.
- Replaced untyped Trace payloads with a public kind-discriminated record union and unified Event modifiers across keyboard, pointer, wheel, and replay contracts.
- Added machine-checked toolchain and post-registry package commands and made fresh ABI parity an explicit aggregate release gate.

## [v9.0.15] — 2026-08-26

### Fixed

- Required duplicate Command/Effect identities to agree, stabilized Command-instance and diagnostic-subject mappings, and added typed ring-wrap versus tooling-defect records.
- Made retained post-wrap snapshots explicitly inherit still-current transaction/render identities from the sole wrap baseline.
- Added positive and negative requirement-propagation probes for all four bound Command surfaces and listed `check:abi-parity` in the canonical verification inventory.

## [v9.0.14] — 2026-08-26

### Fixed

- Propagated bound Command failure/environment requirements through Button, ToggleButton, MenuItem, and CommandPalette Views while preserving imperative typed IDs.
- Added native Effect-span and opaque Component/Text-Document diagnostic subject identities plus the frozen `check:abi-parity` workspace script.
- Bound embedded snapshots to the enclosing Trace context and a retained or explicit wrap-baseline transaction/render basis.

## [v9.0.13] — 2026-08-26

### Fixed

- Added native Diagnostic Record IDs and parent IDs required by public Trace causality and made Menu participate in controlled/local Collection selection.
- Defined runtime replay as handler-suppressed native Event processing plus exactly-once captured transactions, distinct from logical application replay.
- Closed transaction Trace statuses and extended Trace/snapshot validation to exact error tuples, ordered retained Issue intervals, and every embedded snapshot.

## [v9.0.12] — 2026-08-26

### Fixed

- Separated Trace-owned record identity from backward parent linkage and restricted runtime replay to confirmed no-wrap capture from context initialization using exact Event and transaction batches.
- Preserved semantic string/number/boolean scalar types through tagged native storage and ABI encoding; added Issue registry validation and wire-exact replay key/wheel constraints.
- Defined Collection scroll-position access as an executor-populated committed cache observation and made controlled Collection selection paths intent-only until the controlling prop commits.
- Added contextually unavailable Command completion/error mapping and split static contract self-validation from post-implementation ABI parity work.

## [v9.0.11] — 2026-08-26

### Fixed

- Restricted runtime Trace replay to confirmed full-content artifacts carrying versioned exact Event, transaction, and mutation bytes; added ordered sequence/time and backward causal-link validation.
- Added native-owned Collection scroll-position queries and observers independently of visible range.
- Added discriminated imperative Command completion, interruption/rejection errors, and declarative TextArea binding to TextDocumentService without duplicate state authority.
- Aligned semantic snapshot declarations and schema and required unique, rooted, acyclic, reachable child/relationship graphs.

## [v9.0.10] — 2026-08-26

### Fixed

- Made controlled/default state authorities mutually exclusive, including Transcript mode discrimination.
- Propagated renderer, child, hook, and Error Boundary requirements through View types; made typed Command IDs preserve ID-invocation contracts; added a validating grapheme-index constructor.
- Added a closed public error registry and discriminated subclasses plus exact per-kind Diagnostic Trace payload validation.
- Pinned benchmark percentile/mean/tolerance rules and corrected Cargo/Bun supply-chain command paths.

## [v9.0.9] — 2026-08-26

### Fixed

- Parameterized View and RenderSession requirements so Collection loader/Stream and post-mount handler failures or environments remain visible through render, mount, and test APIs.
- Made static items and Data Sources mutually exclusive Collection authorities with one canonical key function.
- Added named replay and benchmark cross-field validators for reachable expectations, sample counts, metric definitions/types/statistics, and required checks; bounded every executable fuzz command.
- Renamed native Transcript block generation to content version to keep it distinct from range-request generation.

## [v9.0.8] — 2026-08-26

### Fixed

- Added explicit Virtual Collection order/position state and typed native projection descriptors while keeping generic application items in the Host Layer.
- Required Transcript block mutations to embed discriminated TextContent, made animation replacement return an independently observable handle, and added retained drag/capture state with typed public and wire Events.
- Extended benchmark evidence with typed metric definitions, per-metric summaries, and correctness checks; expanded durable Issues to the complete causal/action shape; unified clipboard timeout spelling.

## [v9.0.7] — 2026-08-26

### Fixed

- Added Text Document indentation policy, clipboard media discovery and text helpers, imperative capability snapshots, and matching native request/query records.
- Replaced opaque Keymap strings with normalized structured Key Sequences, made global scope addressable by omission, required Command-bound Buttons, and made registry failures proper `TuvrenError` subclasses.
- Unified required/error/submission form-control properties, declared the exact Markdown and ANSI sanitization profile, and tightened testing types to immutable schema versions and serializable external-update values.

## [v9.0.6] — 2026-08-26

### Fixed

- Added discriminated native records for plain, styled, Markdown, code, and sanitized ANSI content plus serializable Text Document constraints and validation rules.
- Added generation-stamped keyed Collection selection, imperative Component animation, optional cursor consistency, mutually exclusive Button actions, named-key replay coverage, and typed Application Replay testing in both SDK workflows.
- Mirrored layout `stretch` correctly and aligned implementation guidance with Architecture v4.0.1 executor-owned input transitions.

## [v9.0.5] — 2026-08-26

### Fixed

- Separated flex/grid display from relative/absolute positioning and added bounded native query and transaction-result records for public Text Document and visible-range reads.
- Completed declarative and imperative parity for typed Commands, private Component composition, hierarchical Keymaps, Command-bound buttons and palettes, interruptible animations, cancellable range loads, and generation-stamped Collection mutations.
- Made Theme-token references executable through typed style and Theme wire records, and correlated every application-replay event kind with a bounded payload schema.

## [v9.0.4] — 2026-08-26

### Fixed

- Corrected Bun workspace discovery for scoped platform packages and required `Bun.fileURLToPath()` for platform-native library paths.
- Added the executable stable-Rust native quality gate and enabled `isolatedModules` in declaration conformance.
- Added declarative and imperative Theme activation, shared Collection bindings across Table/Select/ListBox/Menu/palette, the full approved Transcript operation set and ABI records, retained animation endpoints/timeline state, and cooperative imperative Command cancellation.

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
