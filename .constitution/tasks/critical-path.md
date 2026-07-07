# Critical Path

## 0. Version

**v9.0.0** — corresponds to the latest entry in `.constitution/tasks/changelog.md`.

---

## 1. Active Backlog Summary

- **Total Active Story Points:** 177
  - Epic U — Safety, Correctness & Gates: 26
  - Epic V — Streaming-Scale Performance: 37
  - Epic W — Architecture Consolidation & Tech Debt: 45
  - Epic X — SDK Productization / Expert-Level DX: 24
  - Epic Y — OpenCode Flagship Client: 19
  - Epic Z — Release Readiness & First Public npm Publish: 26
- **Critical Path:**
  1. `SAFE-U001` → 2. `SAFE-U002` → 3. `SAFE-U003` → 4. `SAFE-U004` → 5. `SAFE-U005` → 6. `SAFE-U006` → 7. `SAFE-U007` → 8. `SAFE-U008` → 9. `SAFE-U009` → 10. `SAFE-U010` → 11. `PERF-V001` → 12. `PERF-V002` → 13. `PERF-V003` → 14. `PERF-V004` → 15. `PERF-V005` → 16. `PERF-V006` → 17. `PERF-V007` → 18. `PERF-V008` → 19. `PERF-V009` → 20. `PERF-V010` → 21. `PERF-V011` → 22. `ARCH-W001` → 23. `ARCH-W002` → 24. `ARCH-W003` → 25. `ARCH-W004` → 26. `ARCH-W005` → 27. `ARCH-W006` → 28. `ARCH-W007` → 29. `ARCH-W008` → 30. `ARCH-W009` → 31. `ARCH-W010` → 32. `ARCH-W011` → 33. `ARCH-W012` → 34. `ARCH-W013` → 35. `SDK-X001` → 36. `SDK-X002` → 37. `SDK-X003` → 38. `SDK-X004` → 39. `SDK-X005` → 40. `SDK-X006` → 41. `FLAG-Y001` → 42. `FLAG-Y002` → 43. `FLAG-Y003` → 44. `FLAG-Y004` → 45. `FLAG-Y005` → 46. `PUB-Z001` → 47. `PUB-Z002` → 48. `PUB-Z003` → 49. `PUB-Z004` → 50. `PUB-Z005` → 51. `PUB-Z006` → 52. `PUB-Z007`

The numbered list is a valid full linearization; tickets whose declared
dependencies are already satisfied may run in parallel with it (e.g.
`PUB-Z001` any time after `SAFE-U001`, `PERF-V008` alongside the Transcript
track).

---

## 2. Planning Assumptions

- The pre-GA deep audit (`.constitution/reports/audit-2026-07-07-161112-pre-ga-deep-audit.md`, commit `8ec41b1`) is the gap inventory for this wave. It supersedes the former SDK-U001 and PUB-V001 audit spikes.
- **Publishing is deliberately deferred to the end of the wave.** `tuvren-tui@0.1.0` ships only after hardening (U), streaming-scale performance (V), consolidation (W), SDK productization (X), and the flagship proof (Y). There is no calendar urgency; correctness ordering wins over publish speed.
- Contract-level changes (dirty-gated Render Pass, Transcript accounting/retention, dual text authority retirement, layout engine upgrade, OpenCode integration) are established through Spike tickets whose recommendations a Stage 3 TechSpec pass adopts as ADRs before the dependent implementation tickets begin.
- Epic letters U and V are reused in place with new scope; the former Epic U (SDK productization) scope now lives in Epic X, and the former Epic V (first public npm) scope now lives in Epic Z. Sequence position is preserved.
- Bun remains the only supported runtime. First public npm publish remains `0.1.0` pre-GA; breaking changes stay allowed before public `v1.0 GA`.
- The canonical remote is `Tuvren/tuvren-tui`; the product story is general-purpose framework first with agentic/transcript-heavy products as the flagship proof workload — Epic Y makes that proof concrete.

---

## 3. Phasing Strategy

### Current Active Scope

- **Epic U — Safety, Correctness & Gates:** Gate every real test suite in CI, add a single-command verification baseline, and fix the audit's safety cluster: control-sequence sanitization, poison-lock recovery with guaranteed terminal restore, swallowed event errors, unbounded event buffer, JSX mount handle leaks, fragment ordering, swallowed native Results, width divergence, and the small-correctness batch.
- **Epic V — Streaming-Scale Performance:** Land scaling benchmarks first, then remove the flagship-workload ceilings: incremental Transcript accounting, bounded retention, dirty-gated Render Passes (restoring the PRD's changed-regions-only promise), clone elimination, encoder hoisting, and per-index delta application for collection Widgets.
- **Epic W — Architecture Consolidation & Tech Debt:** One run-loop core with thin adapters and a wake seam, deletion of the retired background-render experiment, phased dual-text-authority retirement, examples rebased onto the public API, end-to-end Plugin palette wiring with registry subscription, FFI diagnostics at both ends, expanded goldens, behavioral substrate gates, the layout-engine major upgrade behind that armor, and the DX/docs batches.
- **Epic X — SDK Productization / Expert-Level DX:** The ADR-T47 mandate on the consolidated base: handle-safe event/focus ergonomics, wrapper-gap closure (including the four orphaned native bindings), lifecycle ergonomics, reworked per-style examples, diagnostics polish, and the formal productization gate.
- **Epic Y — OpenCode Flagship Client:** A real agent console in `examples/opencode-client/` — SplitPane + streaming Transcript shell, live session integration with interrupts, Commands/Keymaps/palette/Plugin wiring, and replay-fixture CI coverage — as the end-to-end proof of Epics U–X and the launch centerpiece.
- **Epic Z — Release Readiness & First Public npm Publish:** Supply-chain hardening (committed lockfile, dependency audit gate, pinned actions), publishable package payloads, the npm publish workflow, packed/registry resolver smoke, the cross-platform release-candidate dry-run, the `0.1.0` publish, and the post-publish feedback loop.

### Future / Deferred Scope

- No Theme-slot contribution payloads (shape change plus native Handle disposal design) in the active wave; slots stay pre-GA per ADR-T46.
- No devtools panel host for Plugin contributions; the devtools slot remains catalog metadata.
- No native run-loop waker; the host-side wake seam in ARCH-W001 bounds latency, and a native waker is only revisited if that bound proves insufficient.
- No bulk packed-buffer batch FFI; the delta layer (PERF-V009/V010) removes its motivation.
- No Node runtime portability, no React or Solid parity, no musl/Alpine support, no generic widget-breadth wave, and no default background-render promotion — all per the standing `.constitution/prd/out-of-scope/` decisions.
- Post-v0.1 roadmap planning is a future Stage 4 pass fed by the PUB-Z007 feedback loop; no v1.0 compatibility guarantees are made in this wave.

---

## 4. Build Order Diagram

```mermaid
flowchart LR
    subgraph U["Epic U — Safety & Gates"]
        U1[SAFE-U001]
        U2[SAFE-U002]
        U3[SAFE-U003]
        U4[SAFE-U004]
        U5[SAFE-U005]
        U6[SAFE-U006]
        U7[SAFE-U007]
        U8[SAFE-U008]
        U9[SAFE-U009]
        U10[SAFE-U010]
    end
    subgraph V["Epic V — Streaming-Scale Perf"]
        V1[PERF-V001]
        V2[PERF-V002]
        V3[PERF-V003]
        V4[PERF-V004]
        V5[PERF-V005]
        V6[PERF-V006]
        V7[PERF-V007]
        V8[PERF-V008]
        V9[PERF-V009]
        V10[PERF-V010]
        V11[PERF-V011]
    end
    subgraph W["Epic W — Consolidation"]
        W1[ARCH-W001]
        W2[ARCH-W002]
        W3[ARCH-W003]
        W4[ARCH-W004]
        W5[ARCH-W005]
        W6[ARCH-W006]
        W7[ARCH-W007]
        W8[ARCH-W008]
        W9[ARCH-W009]
        W10[ARCH-W010]
        W11[ARCH-W011]
        W12[ARCH-W012]
        W13[ARCH-W013]
    end
    subgraph X["Epic X — SDK Productization"]
        X1[SDK-X001]
        X2[SDK-X002]
        X3[SDK-X003]
        X4[SDK-X004]
        X5[SDK-X005]
        X6[SDK-X006]
    end
    subgraph Y["Epic Y — Flagship Client"]
        Y1[FLAG-Y001]
        Y2[FLAG-Y002]
        Y3[FLAG-Y003]
        Y4[FLAG-Y004]
        Y5[FLAG-Y005]
    end
    subgraph Z["Epic Z — Release & Publish"]
        Z1[PUB-Z001]
        Z2[PUB-Z002]
        Z3[PUB-Z003]
        Z4[PUB-Z004]
        Z5[PUB-Z005]
        Z6[PUB-Z006]
        Z7[PUB-Z007]
    end

    U1 --> U2
    U1 --> U3
    U3 --> U4
    U4 --> U5
    U1 --> U6
    U6 --> U7
    U1 --> U8
    U1 --> U9
    U3 --> U10
    U4 --> U10

    U1 --> V1
    V1 --> V2
    V2 --> V3
    V3 --> V4
    V1 --> V5
    V5 --> V6
    V6 --> V7
    U1 --> V8
    V8 --> V9
    U7 --> V9
    V9 --> V10
    U9 --> V11

    U4 --> W1
    U10 --> W1
    U1 --> W2
    V6 --> W3
    W3 --> W4
    W1 --> W5
    U1 --> W6
    U3 --> W7
    W4 --> W8
    W4 --> W9
    W8 --> W10
    W10 --> W11
    U1 --> W12
    W2 --> W13
    W5 --> W13

    W1 --> X1
    W5 --> X2
    X1 --> X3
    X2 --> X3
    X3 --> X4
    W6 --> X4
    X3 --> X5
    W7 --> X5
    X4 --> X6
    X5 --> X6
    W12 --> X6
    W13 --> X6

    X6 --> Y1
    Y1 --> Y2
    Y2 --> Y3
    Y3 --> Y4
    Y4 --> Y5

    U1 --> Z1
    Z1 --> Z2
    Y5 --> Z2
    Z2 --> Z3
    Z3 --> Z4
    Z4 --> Z5
    Z5 --> Z6
    Z6 --> Z7

    classDef epicU fill:#fde2e2,stroke:#c0392b,color:#5c1010
    classDef epicV fill:#fff4d6,stroke:#d39b14,color:#5c4100
    classDef epicW fill:#e2f0e2,stroke:#2e8b57,color:#0f3d24
    classDef epicX fill:#e6eefc,stroke:#4c78d0,color:#14315f
    classDef epicY fill:#f0e6fc,stroke:#8e5cd0,color:#3a145f
    classDef epicZ fill:#e2f6f6,stroke:#2c9c9c,color:#0f4040
    class U1,U2,U3,U4,U5,U6,U7,U8,U9,U10 epicU
    class V1,V2,V3,V4,V5,V6,V7,V8,V9,V10,V11 epicV
    class W1,W2,W3,W4,W5,W6,W7,W8,W9,W10,W11,W12,W13 epicW
    class X1,X2,X3,X4,X5,X6 epicX
    class Y1,Y2,Y3,Y4,Y5 epicY
    class Z1,Z2,Z3,Z4,Z5,Z6,Z7 epicZ
```
