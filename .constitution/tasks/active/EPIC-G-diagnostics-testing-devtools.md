# Epic G — Diagnostics, testing, devtools, and recovery

Implement one causal observation surface and public proof harness for P0-N01–P0-N16.

#### TUI-G001 Implement the bounded Diagnostic Graph and causal records

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A004
- **Category:** DX
- **Capabilities:** P0-N01, P0-N03, P0-N10, P0-N13–P0-N14, TOOL-05
- **Scope (In-Scope Files):** `native/src/diagnostics/`, diagnostic ABI codec, correlation and wrap tests
- **Scope (Out-of-Scope Files):** browser/server inspector, raw private identities in public output
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** every late Render Pass has a causal path or explicit unattributed-defect record
- **STOP Conditions:** STOP if recording can grow beyond 64 MiB or silently discard the retained causal path.
- **Description:** Connect input, Event, Command, Effect span, reconciliation, transaction, mutation, dirtying, layout, text, render, diff, terminal write, error, and cleanup identities in bounded deltas and periodic snapshots.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Causality fixtures traverse every phase, verify stable error metadata, force ring wrap, preserve the newest complete causal interval, and account for every unexplained late Render Pass.
```

#### TUI-G002 Implement bounded durable codecs, migrations, and redaction

- **Type:** Security
- **Effort:** 5
- **Dependencies:** TUI-G001
- **Category:** Security
- **Capabilities:** P0-N04–P0-N05, P0-O07–P0-O08, P0-O12, P0-O17, SAFE-02, OPS-05
- **Scope (In-Scope Files):** `native/src/diagnostics/`, `native/fuzz/fuzz_targets/durable_files.rs`, durable corpora, schema codecs, migration registry, redaction fixtures
- **Scope (Out-of-Scope Files):** silent schema reinterpretation, implicit full-content capture
- **Verification Command:** `cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz durable_files`
- **Expected Success Output:** no malformed input escapes limits or privacy policy
- **STOP Conditions:** STOP if a reader allocates or decompresses beyond preflight limits, or if saving full content lacks explicit confirmation.
- **Description:** Implement exact-version schema dispatch, registered migration, encoded/decoded/depth/string bounds, kind-correlated and bounded replay payloads, trace/snapshot/profile/benchmark/release codecs, default redaction, explicit full-content confirmation, and atomic writes.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Fuzz and golden tests reject unknown versions and expansion attacks, migrate only registry entries, preserve schema-valid data, and find zero protected values in default artifacts.
```

#### TUI-G003 Implement Effect and imperative semantic test harnesses

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-D005, TUI-G002
- **Category:** DX
- **Capabilities:** P0-N05–P0-N06, P0-N15, REL-02
- **Scope (In-Scope Files):** `ts/src/testing/`, headless test ABI, semantic query, replay, snapshot, trace, cleanup and leak fixtures
- **Scope (Out-of-Scope Files):** private-runtime query APIs, real-time sleeps in deterministic tests
- **Verification Command:** `bun run test:semantic`
- **Expected Success Output:** Effect and imperative harness suites pass shared fixtures
- **STOP Conditions:** STOP if synthetic input bypasses the Event codec or cleanup cannot prove retained-resource counts.
- **Description:** Implement typed semantic queries, complete interaction drivers including raw Events, Terminal Profiles, manual clock, visual idle, stable snapshots, automatic failure traces, runtime/application replay, cleanup, and leak reports.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
The same fixture passes through both harnesses; 100 deterministic replays produce identical cell/style/cursor/Semantic Tree snapshots; cleanup reports zero leaked contexts, nodes, requests, or retained bytes.
```

#### TUI-G004 Build terminal-native Inspect, Timeline, and Issues views

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-G003
- **Category:** DX
- **Capabilities:** P0-N01–P0-N04, P0-N12–P0-N14, TOOL-04–TOOL-05
- **Scope (In-Scope Files):** `ts/src/devtools/`, diagnostic Components, source mapping and inspector fixtures, `scripts/study-style-defect.ts`
- **Scope (Out-of-Scope Files):** browser UI, network listener, remote upload, live state editing
- **Verification Command:** `bun run study:style-defect`
- **Expected Success Output:** median source-location time is under 60 seconds; a median of 120 seconds or more fails
- **STOP Conditions:** STOP if inspector focus allows application input through or requires a public private-node identity.
- **Description:** Build local Inspect, Timeline, and Issues views over the Diagnostic Graph, including geometry, clipping, scroll, style provenance, focus, Events, semantics, dirty regions, Render Passes, source links, actions, and explicit application-input pause.
- **Acceptance:**
  - **Mode:** stat_threshold
  - **Evidence:**

```text
Moderated seeded-defect runs record median time under 60 seconds; focus-isolation tests prove app input pauses; every Issue contains phase, stable error, Component, source, cause, preceding work, trace interval, remediation, and actions.
```

#### TUI-G005 Implement error boundaries, last-good recovery, supervision, and hard-restart watch

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-A006, TUI-G001
- **Category:** Correctness
- **Capabilities:** P0-N07–P0-N08, P0-N11, P0-N16, P0-O09–P0-O10, P0-O18
- **Scope (In-Scope Files):** `ts/src/runtime/`, `ts/src/devtools/`, recovery and watch fixtures
- **Scope (Out-of-Scope Files):** soft reload preserving runtime IDs, continuing an inconsistent context
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-runner.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if a watch restart or failed context reuses private runtime identity.
- **Description:** Add declarative error boundaries, recoverable last-good overlays, root supervisor fallback, bounded failure evidence, explicit restart, and watch mode that tears down and creates a fresh context.
- **Acceptance:**
  - **Mode:** gherkin
  - **Evidence:**

```text
Given subtree, root, native, and watch failures, when recovery or restart runs, then the declared last-good/fallback policy appears, terminal state is safe, old resources leak zero, and all private identities are fresh.
```

#### TUI-G006 Implement the local diagnostic command surface

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** TUI-F005, TUI-G003
- **Category:** DX
- **Capabilities:** P0-N09–P0-N10, OPS-02
- **Scope (In-Scope Files):** `ts/src/cli/`, diagnostic probes, seeded load-failure fixtures
- **Scope (Out-of-Scope Files):** package publication, automatic destructive repair
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-install.test.ts`
- **Expected Success Output:** every seeded cause receives the correct code and actionable remediation
- **STOP Conditions:** STOP if a probe mutates an application context before compatibility checks complete.
- **Description:** Implement doctor-style checks for host version, platform, package consistency, loading, headless operation, declarative integration, source maps, capabilities, and multiplexer effects using stable errors.
- **Acceptance:**
  - **Mode:** runbook_probe
  - **Evidence:**

```text
Seed host, target, artifact, version, load, initialization, render, source-map, capability, and multiplexer failures; the command exits nonzero with the exact cause and remediation and never emits a generic boundary error.
```

#### TUI-G007 Harden every untrusted parser and native boundary

- **Type:** Security
- **Effort:** 5
- **Dependencies:** TUI-A003, TUI-C003, TUI-D002, TUI-F002, TUI-F003, TUI-G002
- **Category:** Security
- **Capabilities:** P0-O07–P0-O12, SAFE-01–SAFE-02
- **Scope (In-Scope Files):** all `native/fuzz/fuzz_targets/`, all maintained corpora/artifacts policy, parser inventories, malformed-input tests, CI fuzz jobs
- **Scope (Out-of-Scope Files):** network services, unsupported parsers
- **Verification Command:** `cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz transaction_decode && cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz event_decode && cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz terminal_response && cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz durable_files`
- **Expected Success Output:** every maintained target/corpus completes its configured CI duration without memory unsafety, panic escape, control injection, privacy leak, or unbounded allocation
- **STOP Conditions:** STOP release progression if any external content/control boundary lacks a named validator, limit, timeout/correlation rule where applicable, and test owner.
- **Description:** Inventory and fuzz transactions, Events, formatted text, terminal responses, clipboard chunks, traces, snapshots, profiles, replay, and release evidence under the declared resource and privacy limits.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
The machine-readable inventory maps 100% of boundaries to validators and named owners; transaction, Event/formatted-content, terminal/clipboard, and durable-file targets plus malformed/size/timeout/correlation suites all pass under sanitizers where supported.
```
