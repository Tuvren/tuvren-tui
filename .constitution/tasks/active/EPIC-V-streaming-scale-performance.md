# Epic V — Streaming-Scale Performance (PERF)

**Epic Status:** Active

Epic V removes the performance ceilings that cap the flagship promise of
long agent sessions with large Transcripts (audit findings Performance-01/02/03,
Test-01, and addendum A2). The scaling benchmarks land first as the epic's
verification spine; every optimization must be measurable by a bench gate
before it lands. Contract-level changes (dirty-gated Render Pass, Transcript
retention) are established through ADR spikes before implementation.
This epic replaces the former first-public-npm scope of Epic V; publishing
now lives in Epic Z.

---

#### PERF-V001 Extend Benchmark Gates to Cover the Identified Hot Paths

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** SAFE-U001
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `ts/bench-render.ts`
  - `ts/bench-ffi.ts`
  - `.github/workflows/ci.yml` (bench gate wiring only)
- **Scope (Out-of-Scope Files):**
  - `native/src/` (no native changes; this ticket only measures)
- **Verification Command:** `bun run ts/bench-render.ts && bun run ts/bench-ffi.ts`
- **Expected Success Output:** `exit 0` with scaling scenarios reported (Transcript streaming at 1k/10k blocks, large Composition Tree, table single-cell update)
- **STOP Conditions:**
  - "STOP if a scaling scenario cannot run headless in CI within a sane time budget; reduce the scenario size and record the ceiling instead of skipping the scenario."
- **Description:** Audit finding Test-01: the current bench gate exercises a trivial 80×24 scene, so none of the audited hot paths are measurable. Add scaling benchmarks for Transcript streaming (accounting cost per appended chunk at large block counts), full-tree Render Pass cost versus tree size, and per-update FFI call counts for collection Widgets. These benches are the before/after evidence for every subsequent Epic V ticket.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the benchmark suite runs
When the Transcript streaming scenario executes at 1k and 10k blocks
Then per-chunk cost is reported for both sizes so scaling behavior is visible

Given the table update scenario executes
When one cell changes in a 100x5 table
Then the number of FFI calls issued is reported

Given CI runs
When the bench gate executes
Then regressions beyond the recorded budgets fail the pipeline
```

---

#### PERF-V002 Spike: Transcript Accounting and Retention Contract (ADR)

- **Type:** Spike
- **Effort:** 2
- **Dependencies:** PERF-V001
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `.constitution/spikes/SPK-PERF-V002.md` (sole output)
- **Scope (Out-of-Scope Files):**
  - `native/src/transcript.rs` (no code changes in a Spike)
- **Verification Command:** `test -s .constitution/spikes/SPK-PERF-V002.md && ! grep -qF '[e.g.,' .constitution/spikes/SPK-PERF-V002.md`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP: no production code changes are allowed inside a Spike ticket."
- **Description:** Audit findings Performance-02 and Performance-03 need a contract before implementation: (a) an accounting strategy that avoids O(total blocks) work per Render Pass and per streamed chunk (e.g., incremental prefix sums), and (b) a retention policy bounding Transcript memory (block cap, byte cap, eviction interaction with anchor-aware viewport semantics per ADR-T33). The spike inventories the current implementation, weighs options, and produces the recommendation a Stage 3 pass adopts as an ADR before PERF-V003/PERF-V004 begin.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the spike completes
When SPK-PERF-V002.md is reviewed
Then it recommends one accounting strategy and one retention policy with measured baseline evidence
And it states how eviction interacts with anchor semantics from ADR-T33
And it lists PERF-V003 and PERF-V004 as the unlocked tickets
```

---

#### PERF-V003 Make Transcript Accounting Incremental

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** PERF-V002
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `native/src/transcript.rs`
  - `native/src/render.rs` (transcript measurement call sites only)
- **Scope (Out-of-Scope Files):**
  - `ts/src/` (host surface unchanged)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && bun run ts/bench-render.ts`
- **Expected Success Output:** `exit 0`; the Transcript streaming bench shows per-chunk cost independent of total block count
- **STOP Conditions:**
  - "STOP if the ADR derived from SPK-PERF-V002 has not been adopted into .constitution/tech-spec/adrs/."
  - "STOP if the incremental structure changes viewport anchor behavior in any golden or replay fixture; report before regenerating."
- **Description:** Audit finding Performance-02: appending a streamed chunk and measuring the viewport both walk every Transcript block, making long sessions quadratic. Implement the accounting strategy chosen by the ADR so append and viewport measurement cost is bounded by the affected blocks, not the total.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Transcript with 10k blocks
When one streamed chunk is appended
Then accounting work is proportional to the affected blocks only
And the streaming bench shows flat per-chunk cost between 1k and 10k blocks

Given existing Transcript replay fixtures
When the native suite runs
Then anchor and viewport behavior is unchanged
```

---

#### PERF-V004 Bound Transcript Block Retention

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** PERF-V003
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `native/src/transcript.rs`
  - `native/src/lib.rs` (retention configuration symbol if the ADR specifies one)
  - `ts/src/` thin wrapper for the retention option (if specified by the ADR)
- **Scope (Out-of-Scope Files):**
  - `native/src/text_cache.rs` (separate cache; PERF-V011)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if the ADR derived from SPK-PERF-V002 has not been adopted into .constitution/tech-spec/adrs/."
- **Description:** Audit finding Performance-03: Transcript blocks are retained forever, so RSS grows monotonically in the flagship workload. Implement the retention policy from the ADR (bounded blocks/bytes with oldest-first eviction that respects anchor semantics), with the Developer-facing configuration the ADR defines.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Transcript configured with a retention bound
When streamed content exceeds the bound
Then the oldest blocks are evicted and memory stays bounded
And the viewport anchor remains valid after eviction

Given a Transcript with retention unset
When content streams
Then the documented default policy from the ADR applies
```

---

#### PERF-V005 Spike: Dirty-Gated Render Pass Contract (ADR)

- **Type:** Spike
- **Effort:** 3
- **Dependencies:** PERF-V001
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `.constitution/spikes/SPK-PERF-V005.md` (sole output)
- **Scope (Out-of-Scope Files):**
  - `native/src/render.rs` (no code changes in a Spike)
- **Verification Command:** `test -s .constitution/spikes/SPK-PERF-V005.md && ! grep -qF '[e.g.,' .constitution/spikes/SPK-PERF-V005.md`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP: no production code changes are allowed inside a Spike ticket."
- **Description:** Audit finding Performance-01: the pipeline maintains dirty flags but never consults them — every tick re-renders the full Composition Tree and diffs the full buffer. The PRD glossary already defines a Render Pass as recomputing only changed regions, so this spike restores a stated contract. Investigate gating granularity (whole-pass skip when nothing is dirty, subtree gating, layout-vs-paint dirtiness), interaction with animations and the synchronous runner contract (ADR-T26/ADR-T30), and produce the recommendation a Stage 3 pass adopts as an ADR before PERF-V006.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the spike completes
When SPK-PERF-V005.md is reviewed
Then it recommends a gating granularity with measured full-render baseline evidence
And it specifies behavior for animation ticks and forced redraws (resize, theme switch)
And it lists PERF-V006 as the unlocked ticket
```

---

#### PERF-V006 Implement Dirty-Gated Render Passes

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** PERF-V005
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `native/src/render.rs`
  - `native/src/tree.rs` (dirty propagation only)
  - `native/src/layout.rs` (dirty propagation only)
- **Scope (Out-of-Scope Files):**
  - `native/src/threaded_render.rs` (dead code; deleted separately in ARCH-W002)
  - `ts/src/` (host loop unchanged; gating is native-internal)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && bun run ts/bench-render.ts && bun run verify`
- **Expected Success Output:** `exit 0`; bench shows a no-change tick costing a small fraction of a full Render Pass
- **STOP Conditions:**
  - "STOP if the ADR derived from SPK-PERF-V005 has not been adopted into .constitution/tech-spec/adrs/."
  - "STOP if any golden snapshot or replay fixture output changes; dirty gating must be behavior-preserving."
- **Description:** Implement the gating contract from the ADR: consult and correctly propagate dirty state so an unchanged Composition Tree costs near-zero per tick, and only dirty regions are recomputed on partial change. All existing golden snapshots, replay fixtures, and flagship examples must produce identical output.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Composition Tree with no mutations since the last Render Pass
When the loop ticks
Then layout, paint, and diff work is skipped per the ADR's gating level

Given one Widget's content changes
When the next Render Pass runs
Then recomputation is limited to the dirty scope defined by the ADR
And Surface output is byte-identical to a full re-render

Given animations are active
When ticks occur
Then animated Widgets render per the ADR's forced-dirty rules
```

---

#### PERF-V007 Eliminate Per-Render-Pass Deep Clones in Hot Traversal

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** PERF-V006
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `native/src/render.rs`
- **Scope (Out-of-Scope Files):**
  - `native/src/context.rs` (locking model unchanged)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && bun run ts/bench-render.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if removing a clone requires interior mutability changes to the context locking model; record the case and leave that clone."
- **Description:** Audit finding Performance-04: hot traversal clones widget state (e.g., table state) and node content/children per Render Pass. Replace clones with borrows or targeted copies where the borrow checker permits within the existing locking model.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the render benchmarks from PERF-V001
When the hot-traversal scenarios run after this change
Then per-pass allocation volume is measurably reduced
And all native tests and goldens pass unchanged
```

---

#### PERF-V008 Hoist Text Encoding at FFI Call Sites

- **Type:** Chore
- **Effort:** 2
- **Dependencies:** SAFE-U001
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `ts/src/ffi.ts`
  - `ts/src/jsx/reconciler.ts`
  - All host call sites currently allocating a per-call encoder or intermediate copy (~30 sites per audit addendum A2a)
- **Scope (Out-of-Scope Files):**
  - `native/src/lib.rs` (zero ABI change; the length-delimited contract already accepts this)
- **Verification Command:** `bun run verify && bun run ts/bench-ffi.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if any call site retains the encoded buffer across the FFI call boundary asynchronously; the safety argument depends on synchronous native copy-in."
- **Description:** Audit addendum A2a (verified): every string symbol is length-delimited and native copies synchronously inside the call, so per-call encoder construction and intermediate buffer copies are pure waste. Use one module-level encoder and pass the encoded bytes directly.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a host call passing string content across the FFI
When the call executes
Then exactly one encode occurs with no intermediate copy
And the FFI benchmark shows reduced per-call allocation

Given the full host suite
When it runs after the change
Then all tests pass unchanged
```

---

#### PERF-V009 Add a Delta Layer for Table Collection Props

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** PERF-V008, SAFE-U007
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `ts/src/jsx/reconciler.ts`
  - `ts/test-jsx.test.ts`
- **Scope (Out-of-Scope Files):**
  - `native/src/lib.rs` (Table's per-index ABI is already complete)
- **Verification Command:** `bun test ts/test-jsx.test.ts && bun run ts/bench-render.ts`
- **Expected Success Output:** `exit 0`; the table update bench shows 1 FFI call for a single-cell change (down from full clear-and-rebuild)
- **STOP Conditions:**
  - "STOP if the last-applied cache cannot be kept on the reconciler instance across effect disposal/re-creation; a handle-keyed global cache is forbidden (it desyncs under imperative mutation of JSX-owned Handles)."
- **Description:** Audit addendum A2b: collection props currently clear and rebuild the whole native table per signal tick. Diff the incoming rows against a last-applied cache stored on the reconciler instance and issue only per-index native calls for changed cells/rows. The cache must survive the reconciler's effect disposal and re-creation during keyed updates — this is the subtlest correctness point.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a 100x5 table rendered via JSX
When one cell's value changes on a signal tick
Then exactly one native cell-set call is issued

Given rows are inserted, removed, and reordered across updates
When the reconciler applies the delta
Then native table state matches the JSX data exactly

Given the reconciler disposes and re-creates the update effect for an instance
When the next update applies
Then the delta cache remains correct and no stale full rebuild occurs
```

---

#### PERF-V010 Complete Indexed Native Mutation for List, Select, and Tabs

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** PERF-V009
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `native/src/lib.rs` (six mirror symbols: set-at-index and insert-at-index for List, Select, Tabs)
  - The corresponding `native/src/*.rs` widget modules
  - `ts/src/ffi.ts` and `ts/src/jsx/reconciler.ts` (extend the delta layer to these Widgets)
- **Scope (Out-of-Scope Files):**
  - Any bulk packed-buffer batch ABI (explicitly deferred as Speculative)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if the new symbols require semantics beyond mirroring the existing Table per-index contract; that would need a TechSpec section 4 pass."
- **Description:** Audit addendum A2c: List, Select, and Tabs lack the per-index mutation symbols Table already has, forcing clear-and-rebuild. Add the six mirror functions following the existing Table ABI shape and `ffi_wrap` conventions, then route the PERF-V009 delta layer through them.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a List, Select, or Tabs Widget rendered via JSX
When one item changes on a signal tick
Then a single per-index native call is issued instead of a rebuild

Given the new symbols are called with out-of-range indices
When the native layer validates them
Then they return -1 with a diagnostic per the FFI error contract
```

---

#### PERF-V011 Make Text Cache Access O(1) and Fix Parse-Cache Keying

- **Type:** Feature
- **Effort:** 2
- **Dependencies:** SAFE-U009
- **Category:** Perf
- **Scope (In-Scope Files):**
  - `native/src/text_cache.rs`
  - `native/src/text.rs`
- **Scope (Out-of-Scope Files):**
  - `native/src/text_renderer.rs` (substrate rendering unchanged)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if changing parse-cache keying alters rich-text output for any fixture; report before regenerating."
- **Description:** Audit finding Performance-06: the text cache LRU is O(n) per access, and the parse cache keys entries per wrap-width, duplicating parse results for the same content. Make LRU access O(1) (per the bounded-cache intent of ADR-T25) and key parsing by content so wrap variations share one parse.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given repeated access to cached text entries
When the cache is hit
Then access cost does not scale with cache size

Given the same rich text rendered at two wrap widths
When both are parsed
Then parsing occurs once and only wrapping differs
```
