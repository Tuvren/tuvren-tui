# Epic D — Interaction, Commands, accessibility, and animation

Deliver the shared interaction model for P0-G01–P0-H08 and the accessibility and time foundations in P0-L01–P0-M06. OD-02 remains a decision gate, not an assumed mechanism.

#### TUI-D001 Spike: decide selective Event arbitration feasibility

- **Type:** Spike
- **Effort:** 2
- **Dependencies:** TUI-D007
- **Category:** Correctness
- **Capabilities:** P0-G03–P0-G05, OD-02
- **Scope (In-Scope Files):** `.constitution/spikes/SPK-TUI-D001.md`
- **Scope (Out-of-Scope Files):** all production source and active specification files
- **Verification Command:** `bun run bench:envelope`
- **Expected Success Output:** the pinned arbitration experiment reproduces and the spike report names measured latency, race, timeout, ordering, failure evidence, and a Go/No-Go recommendation
- **STOP Conditions:** STOP after the report; do not implement or edit upstream specs from the spike.
- **Description:** Time-box the decision analysis over the reproducible experimental harness from TUI-D007; compare selective two-phase arbitration with the documented alternatives while non-intercepted Events retain the fast path.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
The report links pinned raw results and the reproducer command, records p95 input latency against PERF-02, timeout and exactly-once disposition behavior, race analysis, recommendation, and required Stage 1–3 Evolution path.
```

#### TUI-D002 Implement normalized input, focus, hit-testing, pointer capture, and drag

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B004, TUI-F002
- **Category:** Correctness
- **Capabilities:** P0-G01–P0-G02, P0-G05–P0-G08
- **Scope (In-Scope Files):** `native/src/interaction/`, Event ABI codec, `ts/src/runtime/`, interaction fixtures
- **Scope (Out-of-Scope Files):** OD-02 arbitration, browser input APIs
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-ffi.test.ts`
- **Expected Success Output:** normalized interaction fixtures pass deterministically
- **STOP Conditions:** STOP if input routing requires a Rust-to-TypeScript callback or bypasses the UI executor.
- **Description:** Normalize Events with one closed shift/control/alt/super modifier set across key, pointer, and wheel paths; route through executor-owned hit-testing, focus, and interaction roots; implement Focus Scopes, modal containment, focus restoration, retained pointer-capture/drag state, typed drag-start/motion/drop/end/capture Events, bounded queues, and handler-failure recovery.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Synthetic and terminal-derived Event sequences preserve order, target, the exact modifier mask, focus, capture, modal boundaries, overflow policy, and cleanup under handler failure and shutdown. Key, pointer-move, pointer-button, and wheel fixtures reject every bit outside `TUVREN_EVENT_MOD_MASK`.
```

#### TUI-D003 Implement only the ratified Event arbitration outcome

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-D001, TUI-D002
- **Category:** Correctness
- **Capabilities:** P0-G03–P0-G05
- **Scope (In-Scope Files):** `native/src/interaction/`, `ts/src/runtime/`, `native/src/transaction.rs`, arbitration conformance tests
- **Scope (Out-of-Scope Files):** an unratified protocol, global synchronous callbacks
- **Verification Command:** `bun run bench:envelope`
- **Expected Success Output:** the ratified interaction contract meets PERF-02 and its exactly-once correctness checks
- **STOP Conditions:** STOP unless OD-02 has been closed through the required upstream Evolution passes; if No-Go changes P0-G03/G04, replan this ticket instead of improvising.
- **Description:** Implement the exact Event interception contract ratified after TUI-D001, preserving deterministic default behavior, timeout, shutdown, and low-latency non-intercepted paths.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
The checker proves one final disposition, no double default, bounded wait, deterministic order, safe timeout/shutdown, and no regression for fast-path Events.
```

#### TUI-D004 Implement typed Commands and scoped Keymaps in both SDKs

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A005, TUI-D002
- **Category:** Feature-Evolution
- **Capabilities:** P0-H01–P0-H08
- **Scope (In-Scope Files):** `ts/src/commands/`, `ts/src/index.ts`, `ts/src/imperative/`, command and Keymap fixtures
- **Scope (Out-of-Scope Files):** Plugin contribution registries, duplicated action logic in Components
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-commands.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if registration, ID invocation, or a bound activation View loses the typed result/failure/environment envelope.
- **Description:** Implement typed `CommandId<A, E, R>` result/failure/environment contracts preserved by ID lookup and bound activation, registered `TuvrenError` failures, imperative equivalents, reject/restart/queue/parallel concurrency, interruption, visibility/enablement/activation, Command-bound buttons/menu items/palette entries, hierarchical and global scopes, structured normalized Key Sequences, bounded chord timing, conflict reports, rebinding, and deterministic precedence. Imperative invocation completion discriminates succeeded, failed, interrupted (cancelled/restarted/shutdown), and rejected (disabled/contextually unavailable/concurrency) outcomes and maps each interruption/rejection through the closed error registry.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Registry-level adapters invoke one Command programmatically and through Keymap-, menu-, button-, and palette-shaped bindings without requiring Component shells; positive and negative declaration probes prove Button, ToggleButton, MenuItem, and CommandPalette Views retain bound failure/environment requirements and reject erased assignments; concurrency, each cancellation/restart/shutdown/disabled/contextual/concurrency-rejection completion, typed results/failures, captured environments, precedence, and availability updates are deterministic. TUI-B009 owns real catalog binding.
```

#### TUI-D005 Implement the Semantic Tree and accessibility behavior

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B004, TUI-D002
- **Category:** Correctness
- **Capabilities:** P0-L01–P0-L07, P0-N15
- **Scope (In-Scope Files):** `native/src/composition/`, `native/src/interaction/`, semantic snapshot and Primitive conformance fixtures
- **Scope (Out-of-Scope Files):** operating-system screen-reader bridges, color-only semantics
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** Semantic Tree, keyboard traversal, focus-indicator, and announcement kernel fixtures pass
- **STOP Conditions:** STOP if semantic queries require private runtime identities or rendered-cell scraping.
- **Description:** Build roles, names, descriptions, tagged string/number values, tagged boolean/string/number states, relationships, keyboard traversal, visible focus primitives, non-color metadata, bounded announcements, and an independently observable Semantic Tree without stringifying scalar types; TUI-B009 applies them across the final catalog.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Primitive and synthetic-component fixtures query by role and accessible properties, traverse focus by keyboard, verify focus indicators and announcements, and compare semantics independently of cells. Snapshot fixtures reject duplicate IDs, missing child/relationship targets, multiple parents/roots, cycles, and unreachable nodes; no catalog-wide claim is made before TUI-B009.
```

#### TUI-D006 Implement elapsed-time animation and reduced-motion policy

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-B003, TUI-D002
- **Category:** Feature-Evolution
- **Capabilities:** P0-M01–P0-M06, PERF-04
- **Scope (In-Scope Files):** `native/src/animation/`, animation transaction codec, SDK animation surfaces, `ts/test-animation.test.ts`, and deterministic clock fixtures
- **Scope (Out-of-Scope Files):** springs, keyframes, frame-count logical time
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked && bun run test:animation`
- **Expected Success Output:** native deterministic-time fixtures plus Effect and imperative host suites prove completion resolves only after the executor drains the matching Animation Event; TUI-H001 later owns timing benchmarks
- **STOP Conditions:** STOP if dropped presentations slow logical time or suppress final state.
- **Description:** Implement interpolation, easing, delay, repetition, reversal, chaining, groups, interruptible SDK handles, native cancellation and replacement that returns a distinct observable handle, typed completion delivered as an Animation Event through the executor-owned drain before handle resolution, manual test time, global reduced motion, and accessible per-animation overrides.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Native deterministic clock fixtures prove interpolation and final state. Host ordering fixtures for both SDKs assert that no handle resolves before the matching Event is drained by the TypeScript executor, no native callback path exists, cancellation/replacement dispositions match, and reduced motion remains deterministic; TUI-H001 measures PERF-04 across the presentation tiers.
```

#### TUI-D007 Build the reproducible selective-arbitration experiment

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** TUI-D002, TUI-H001
- **Category:** Perf
- **Capabilities:** P0-G03–P0-G05, OD-02
- **Scope (In-Scope Files):** `benchmarks/experiments/event-arbitration/`, pinned experiment configuration, schema-valid raw results and reproducer tests
- **Scope (Out-of-Scope Files):** public Event disposition APIs, production protocol selection, upstream specification edits
- **Verification Command:** `bun run bench:envelope`
- **Expected Success Output:** selective two-phase and control alternatives reproduce with raw latency, timeout, race, failure, ordering, shutdown, and fast-path evidence
- **STOP Conditions:** STOP if the experiment mutates the public contracts or production path; it must remain an isolated evidence harness until TUI-D001 recommends and upstream stages ratify an outcome.
- **Description:** Implement isolated candidate and control protocols over the real UI executor and normalized Event path, pin the environment, seed failure/race cases, and emit raw benchmark data suitable for the OD-02 report.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
One documented command reproduces the candidate and controls against PERF-02 using declared typed metrics and named evidence checks, including no-interceptor p95, intercepted p95, timeout, handler failure, reentrancy, shutdown, coalescing, exactly-once disposition, and default-action counts in schema-valid raw results.
```
