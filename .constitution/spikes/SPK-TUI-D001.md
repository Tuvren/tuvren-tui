# Spike report: TUI-D001 selective Event arbitration

## Time box

- **Budget:** 2 focused days
- **Clock start / stop:** fill during execution

## Question

- **Decision this spike must produce:** Can selective two-phase arbitration satisfy P0-G03–P0-G05 and PERF-02 without races, double default behavior, unbounded waits, or a slow path for Events that do not require interception?

## Context and objective

- **Triggering upstream file or section:** `.constitution/reports/2026-08-26-open-decisions.md` OD-02 and `.constitution/tech-spec/adrs/ADR-T58-conditional-event-arbitration.md`
- **Target:** the bounded request/disposition protocol, executor scheduling, timeout, exactly-once behavior, shutdown, and low-latency bypass
- **Archetype / surface:** Library/SDK plus System/Native interaction path

## Codebase baseline

- **State today:** Brownfield Events are drained after native handling and cannot yet prove pre-default interception. TUI-D007 must attach the isolated candidate/control source, pinned configuration, reproducer, and schema-valid raw results before this report begins.
- **Discovered constraints:** Rust never calls TypeScript; the UI executor is the sole mutator; unblocked input p95 targets 8.33 ms, degrades at 11.11 ms, and fails above 16.67 ms.

## Options and trade-offs

- Analyze the TUI-D007 measurements for selective two-phase records, native-only defaults with post-observation, and a No-Go that triggers Stage 1 revision of P0-G03/G04. Compare fast-path and intercepted latency, timeout, handler failure, shutdown, and ordering.

## Recommendation

- **Chosen option:** fill from measured evidence; use “needs Stage 1 Evolution” if no option meets the product constraints.
- **Why it fits:** tie the recommendation to PERF-02, deterministic mutation, no callbacks, and the approved conditional product outcome.
- **Rejected options:** record each rejected mechanism and its measured correctness or latency failure.

## Downstream impact

- **ADRs to write or update:** `.constitution/tech-spec/adrs/ADR-T58-conditional-event-arbitration.md` after any required Stage 1 and Stage 2 Evolution
- **Tickets unblocked in `tasks/active/`:** `TUI-D003`; TUI-D007 is the prerequisite evidence builder
- **Tickets to add or split:** record any executor, Event ABI, or conformance split required by the ratified outcome
- **Spec edits required:** Stage 1 through Stage 3 Evolution must close OD-02 before implementation
