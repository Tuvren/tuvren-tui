# Open decisions

**Date:** 2026-08-26  
**Interview target:** Realign

No earlier open-decision register exists in `.constitution/reports/`.

## OD-01: Final comparative benchmark gates

**Status:** Open  
**Owner:** Evidence-producing performance spike, followed by PRD, Architecture, TechSpec, and Tasks Evolution reviews  
**Blocks:** Final absolute performance constraints, native-promotion cuts, and the `0.1.0` performance release gate

**Question asked:** Do the proposed competitive margins express the intended ambition for OpenTUI, Ratatui, and Ink?

**User response:** The margins are good as intended targets, but the final hard cuts must come from actual benchmarks.

**Provisional direction:** Use these intended margins:

- No more than 5% slower than OpenTUI on any primary p95 latency fixture, with an aggregate-suite win.
- Within 15% of Ratatui on comparable hot update and render paths.
- At least 3x faster than Ink across the aggregate interactive workload, with materially lower incremental memory.

**Evidence required to resolve:**

- Pinned competitor versions or commits.
- Equivalent public-API fixtures and terminal profiles.
- Separate engine and full-process measurements.
- Published hardware, warmup, sample count, statistics, and raw results.
- Representative 120 Hz, 90 Hz, and 60 Hz workloads.
- Startup, update, render, input-to-Surface, FFI, memory, Transcript, collection, editing, and shutdown results.
- A recommended noninferiority margin and failure threshold per metric.

The downstream stage must not convert the provisional margins into hard gates without this evidence and an explicit decision record. After the spike, Stage 1 must ratify the product constraints before downstream stages adopt them.

## OD-02: Selective two-phase Event arbitration feasibility

**Status:** Open  
**Owner:** Event-protocol feasibility spike, followed by Architecture, TechSpec, and Tasks Evolution reviews  
**Blocks:** Final Event lifecycle, default-action timing, Event ABI, and dependent Component interaction contracts

**Question asked:** Should Tuvren adopt selective two-phase arbitration for cancelable Events and a native fast path for noncancelable or unintercepted Events?

**User response:** Yes, if the design is feasible.

**Provisional direction:** Rust normalizes input and hit-tests. The host runs synchronous capture, target, and bubble handlers. The host returns consumed and prevent-default disposition. Rust then applies an allowed default action. Noncancelable or unintercepted Events use a native fast path.

**Evidence required to resolve:**

- A prototype with stable Event identities and exactly-once completion.
- Deterministic ordering across input, focus, default actions, Commands, and rendering.
- Recovery behavior for handler failure, missing completion, reentrancy, cancellation, shutdown, and queue overflow.
- Component retargeting and interaction-root behavior.
- Modal, editor, Keymap, pointer, paste, wheel, drag, and activation cases.
- Pointer-movement coalescing and bounded pending storage.
- Input-to-Surface latency inside the 120 Hz budget on pinned hardware.
- A measured fast path when no interceptor exists.

If the prototype fails, the downstream stage must return to the user with the measured limitation and alternatives. It must not silently choose eager native defaults or host-owned control behavior.
