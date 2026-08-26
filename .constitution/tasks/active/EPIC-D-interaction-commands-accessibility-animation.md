# Epic D — Interaction, Commands, accessibility, and animation

Deliver the shared interaction model for P0-G01–P0-H08 and the accessibility and time foundations in P0-L01–P0-M06. OD-02 remains a decision gate, not an assumed mechanism.

#### TUI-D001 Spike: decide selective Event arbitration feasibility

- **Type:** Spike
- **Effort:** 2
- **Dependencies:** TUI-A003
- **Category:** Correctness
- **Capabilities:** P0-G03–P0-G05, OD-02
- **Scope (In-Scope Files):** `.constitution/spikes/SPK-TUI-D001.md`
- **Scope (Out-of-Scope Files):** all production source and active specification files
- **Verification Command:** `bun run check:contracts`
- **Expected Success Output:** the spike report names measured latency, race, timeout, ordering, and failure evidence plus a Go/No-Go recommendation
- **STOP Conditions:** STOP after the report; do not implement or edit upstream specs from the spike.
- **Description:** Time-box a prototype of selective two-phase arbitration for supported cancelable interactions while non-intercepted Events retain the fast path.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
The report records the tested protocol, fixtures, p95 input latency against PERF-02, timeout and exactly-once disposition behavior, race analysis, recommendation, and required Stage 1–3 Evolution path.
```

#### TUI-D002 Implement normalized input, focus, hit-testing, pointer capture, and drag

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B004, TUI-F002
- **Category:** Correctness
- **Capabilities:** P0-G01–P0-G02, P0-G05–P0-G08
- **Scope (In-Scope Files):** `native/src/interaction/`, Event ABI codec, `ts/src/runtime/`, interaction fixtures
- **Scope (Out-of-Scope Files):** OD-02 arbitration, browser input APIs
- **Verification Command:** `bun run test:semantic`
- **Expected Success Output:** normalized interaction fixtures pass deterministically
- **STOP Conditions:** STOP if input routing requires a Rust-to-TypeScript callback or bypasses the UI executor.
- **Description:** Normalize Events, route through hit-testing, focus and interaction roots, implement Focus Scopes, modal containment, focus restoration, pointer capture, drag-and-drop, bounded queues, and handler-failure recovery.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Synthetic and terminal-derived Event sequences preserve order, target, focus, capture, modal boundaries, overflow policy, and cleanup under handler failure and shutdown.
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
- **Verification Command:** `bun test ts/test-commands.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if registration loses the Command environment or ID invocation loses the typed failure envelope.
- **Description:** Implement typed result/failure Commands, captured Effect environments, imperative equivalents, reject/restart/queue/parallel concurrency, interruption, availability, hierarchical scopes, chords, conflict reports, rebinding, and precedence.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
One Command fixture invokes through programmatic, Keymap, menu, button, and palette paths; concurrency and interruption are deterministic; all bound surfaces update availability consistently.
```

#### TUI-D005 Implement the Semantic Tree and accessibility behavior

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B006, TUI-B007, TUI-B008, TUI-D002
- **Category:** Correctness
- **Capabilities:** P0-L01–P0-L07, P0-N15
- **Scope (In-Scope Files):** `native/src/composition/`, `native/src/interaction/`, semantic snapshot and Component conformance fixtures
- **Scope (Out-of-Scope Files):** operating-system screen-reader bridges, color-only semantics
- **Verification Command:** `bun run test:semantic`
- **Expected Success Output:** every interactive Component passes keyboard and semantic conformance
- **STOP Conditions:** STOP if semantic queries require private runtime identities or rendered-cell scraping.
- **Description:** Build roles, names, descriptions, values, states, relationships, keyboard completeness, visible focus, non-color meaning, bounded announcements, and an independently observable Semantic Tree.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Catalog-wide tests query by role and accessible properties, traverse every workflow by keyboard, verify focus indicators and announcements, and compare semantics independently of cells.
```

#### TUI-D006 Implement elapsed-time animation and reduced-motion policy

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-B003, TUI-D002
- **Category:** Feature-Evolution
- **Capabilities:** P0-M01–P0-M06, PERF-04
- **Scope (In-Scope Files):** `native/src/animation/`, animation transaction codec, SDK animation surfaces and clock fixtures
- **Scope (Out-of-Scope Files):** springs, keyframes, frame-count logical time
- **Verification Command:** `bun run bench:envelope`
- **Expected Success Output:** animation completion stays within one available presentation interval
- **STOP Conditions:** STOP if dropped presentations slow logical time or suppress final state.
- **Description:** Implement interpolation, easing, delay, repetition, reversal, chaining, groups, cancellation, replacement, completion, manual test time, global reduced motion, and accessible per-animation overrides.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
PERF-04 fixtures induce missed presentations at 120/90/60 tiers and prove elapsed-time completion, deterministic manual-clock snapshots, cancellation, and preserved final state.
```
