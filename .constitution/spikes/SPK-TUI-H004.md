# Spike report: TUI-H004 comparative performance gates

## Time box

- **Budget:** 3 focused days after benchmark fixtures and the OpenCode reference are stable
- **Clock start / stop:** fill during execution

## Question

- **Decision this spike must produce:** Which comparative margins against the leading hybrid SDK, Ratatui, and host-only alternatives are fair, repeatable release gates in addition to the binding 120/90/60 absolute tiers?

## Context and objective

- **Triggering upstream file or section:** `.constitution/reports/2026-08-26-open-decisions.md` OD-01 and `.constitution/prd/constraints.md` comparative targets
- **Target:** equivalent public-API fixtures, pinned versions, engine/process/write separation, statistical comparison, native-promotion evidence, and OpenCode reference results
- **Archetype / surface:** performance-constrained Library/SDK and System/Native product evidence

## Codebase baseline

- **State today:** the PRD records provisional 5%, 15%, and 3× ambitions but intentionally does not make them release gates.
- **Discovered constraints:** absolute p95 tiers remain binding; no implementation may use competitor-private shortcuts; terminal profiles, hardware, warmup, samples, statistics, and raw results are required.

## Options and trade-offs

- Evaluate ratifying the provisional margins, adjusting each margin to the measured variance and workload coverage, or retaining only absolute gates. Analyze native Component promotion separately from marketing comparisons.

## Recommendation

- **Chosen option:** fill from reproducible raw evidence, including a no-comparative-gate outcome if equivalence or variance is inadequate.
- **Why it fits:** preserve performance ambition without turning stylistic or incomparable benchmarks into product contracts.
- **Rejected options:** record any excluded implementation or fixture and the exact comparability defect.

## Downstream impact

- **ADRs to write or update:** `ADR-T30-golden-benchmark-gates.md`, `ADR-T54-retained-native-kernels.md`, or new Stage 3 ADRs only after Stage 1/2 Evolution
- **Tickets unblocked in `tasks/active/`:** `TUI-I006`
- **Tickets to add or split:** record measured native-promotion candidates or benchmark-gate maintenance work
- **Spec edits required:** Stage 1 through Stage 3 Evolution must close OD-01 before final release gating
