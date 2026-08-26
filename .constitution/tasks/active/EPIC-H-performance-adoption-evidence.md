# Epic H — Performance and adoption evidence

Prove the binding absolute constraints first, optimize the native hot paths, and close OD-01 only from reproducible evidence.

#### TUI-H001 Build the absolute workload-envelope benchmark harness

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** TUI-A004, TUI-C001, TUI-D002, TUI-E001, TUI-E004, TUI-F004
- **Category:** Perf
- **Capabilities:** P0-O13, PERF-01–PERF-05, RES-01, RES-03
- **Scope (In-Scope Files):** `benchmarks/`, `ts/bench-ffi.ts`, `ts/bench-render.ts`, benchmark schema validation and reports
- **Scope (Out-of-Scope Files):** comparative hard cuts, unpinned benchmark versions
- **Verification Command:** `bun run bench:envelope`
- **Expected Success Output:** schema-valid raw results for every reference-envelope fixture and stretch analysis
- **STOP Conditions:** STOP if engine, terminal-write, or input-to-Surface time cannot be measured separately.
- **Description:** Build pinned headless and real-terminal fixtures for 300×100, 1,000 Primitives, 10,000 Transcript Blocks, 100 updates/second, 10 MiB text, 100,000 logical Collection items, composite panes, and 10× one-axis analysis; declare every additional timing, count, allocation, memory, accuracy, and pass/fail metric through the extensible evidence schema and validate sample count, definitions, value types, statistics, and required checks before accepting output.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
Results publish hardware, OS, Terminal Profile, versions, warmup, samples, typed metric definitions and summaries, named correctness checks, raw data, separated times, resident memory, growth curves, and pass/fail against all absolute PRD meters.
```

#### TUI-H002 Optimize native kernels and adaptive presentation to the 120/90/60 tiers

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-H001
- **Category:** Perf
- **Capabilities:** PERF-01–PERF-05, RES-01–RES-03
- **Scope (In-Scope Files):** `native/src/presentation/`, hot composition/content paths, `ts/src/runtime/`, profile-guided benchmark evidence
- **Scope (Out-of-Scope Files):** contract weakening, background runtime authority, premature Component promotion
- **Verification Command:** `bun run bench:envelope`
- **Expected Success Output:** no absolute release failure and documented tier adaptation with hysteresis
- **STOP Conditions:** STOP if an optimization weakens Unicode, Event order, semantics, final state, privacy, or cleanup; route any public/native promotion change through OD-01 and Stage 3.
- **Description:** Remove deep clones and repeated scans, hoist encoding, use indexed deltas and dirty regions, bound caches, prioritize input, and implement hysteretic 120/90/60 presentation density based on the real normalized input path. TUI-I006 reruns the full envelope after the ratified OD-02 outcome lands through TUI-D003.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
p95 Render Pass and input-to-Surface hit 8.33 ms goal or 11.11 ms degraded tier and never exceed 16.67 ms; boundary calls stay below 1 ms; idle passes are zero; baseline memory stays below 20 MiB incremental.
```

#### TUI-H003 Prove diagnostics-off, passive, and full-trace overhead

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** TUI-G004, TUI-H002
- **Category:** Perf
- **Capabilities:** TOOL-01–TOOL-03, RES-03
- **Scope (In-Scope Files):** `benchmarks/devtools.ts`, diagnostic benchmark fixtures and raw results
- **Scope (Out-of-Scope Files):** hiding overhead, unbounded trace settings
- **Verification Command:** `bun run bench:devtools`
- **Expected Success Output:** off <1%, passive <3%, full trace <10% with visible reporting
- **STOP Conditions:** STOP if disabled diagnostics allocate steadily or any mode exceeds its PRD fail threshold.
- **Description:** Compare identical representative workloads with diagnostics off, passive metadata, and bounded full tracing while measuring CPU, allocations, memory, and causal completeness.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
Raw paired results meet TOOL-01–TOOL-03, show no steady-state off allocation, display overhead in full mode, force bounded wrap, and preserve render causality.
```

#### TUI-H004 Spike: ratify comparative gates from equivalent public workloads

- **Type:** Spike
- **Effort:** 3
- **Dependencies:** TUI-D003, TUI-H002, TUI-H006, TUI-I005
- **Category:** Perf
- **Capabilities:** OD-01, OPS-06
- **Scope (In-Scope Files):** `.constitution/spikes/SPK-TUI-H004.md`
- **Scope (Out-of-Scope Files):** production code, Stage 1 constraints, benchmark-specific private API shortcuts
- **Verification Command:** `bun run bench:comparative`
- **Expected Success Output:** reproducible raw results and a Go/adjust/no-gate recommendation for each provisional comparison
- **STOP Conditions:** STOP after the report; do not convert provisional margins into gates without the required Stage 1–3 Evolution passes.
- **Description:** Analyze the pinned, reproducible raw measurements produced by TUI-H006 and the OpenCode evidence from TUI-I005; decide which comparisons are fair enough to recommend as release gates.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
The report links the fixture sources and reproducer, separates engine/process/write costs, checks statistical comparability, analyzes the provisional 5%/15%/3× margins, recommends final cuts or rejection, and names all unblocked Evolution work.
```

#### TUI-H005 Run the four moderated adoption studies

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** TUI-G003, TUI-I004
- **Category:** DX
- **Capabilities:** DX-01–DX-04
- **Scope (In-Scope Files):** onboarding study scripts, published documentation, anonymized result reports
- **Scope (Out-of-Scope Files):** invented stretch or fail bands, native setup workarounds
- **Verification Command:** `bun run study:onboarding`
- **Expected Success Output:** first render ≤5 minutes, interactive Hello World ≤10, small app ≤30, semantic test ≤10
- **STOP Conditions:** STOP release progression if any ordinary path requires native setup or misses its approved goal.
- **Description:** Run the approved published-doc-only tasks with fresh supported projects and representative TypeScript Developers, recording confusion and intervention without changing scoring mid-study.
- **Acceptance:**
  - **Mode:** stat_threshold
  - **Evidence:**

```text
The result set records participant background, exact task start/end, interventions, failures, and whether every approved DX-01–DX-04 threshold passed.
```

#### TUI-H006 Build equivalent comparative workload adapters

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** TUI-H001, TUI-I004
- **Category:** Perf
- **Capabilities:** OD-01, OPS-06
- **Scope (In-Scope Files):** `benchmarks/comparative.ts`, `benchmarks/fixtures/comparative/`, pinned OpenTUI/Ratatui/host-only adapters, terminal profiles, schema-valid raw results and reproducer documentation
- **Scope (Out-of-Scope Files):** comparative gate decisions, private competitor APIs, production SDK behavior
- **Verification Command:** `bun run bench:comparative`
- **Expected Success Output:** all equivalent public-API workloads reproduce across pinned implementations with separated engine/process/write results
- **STOP Conditions:** STOP if a fixture cannot be made behaviorally equivalent through public APIs; record and exclude the incomparable row instead of biasing it.
- **Description:** Implement and pin the dashboard/form, editor/inspector, streaming, hot-update, input, and OpenCode-representative adapters needed for fair comparative measurement, including warmup, samples, hardware, process isolation, and raw schema validation.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
One documented command builds and runs every comparable fixture, records exact versions and terminal profiles, separates engine/process/write costs, emits schema-valid raw results, and explains every excluded or adapted behavior without selecting final gates.
```
