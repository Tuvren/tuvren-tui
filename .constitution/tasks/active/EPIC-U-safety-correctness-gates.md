# Epic U — Safety, Correctness & Gates (SAFE)

**Epic Status:** Active

Epic U stops the bleeding identified by the pre-GA deep audit
(`.constitution/reports/audit-2026-07-07-161112-pre-ga-deep-audit.md`) and
puts the verification gates in place that protect every subsequent epic.
This epic rewrites the former SDK-productization scope of Epic U; that scope
now lives in Epic X. The audit report replaces the former SDK-U001 spike as
the gap inventory.

---

#### SAFE-U001 Gate All Host Suites in CI and Add a Single-Command Verification Baseline

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** None
- **Category:** DX
- **Scope (In-Scope Files):**
  - `.github/workflows/ci.yml`
  - `ts/package.json`
  - `devenv.nix`
  - `CLAUDE.md` (Development Commands section only)
- **Scope (Out-of-Scope Files):**
  - `.github/workflows/release.yml` (do not touch; supply-chain hardening is PUB-Z001)
  - Any test file content (do not modify tests to make them pass)
- **Verification Command:** `bun run verify` (script created by this ticket) and a green CI run on the PR
- **Expected Success Output:** `exit 0` with every host suite (`test-ffi`, `test-jsx`, `test-commands`, `test-effect`, `test-examples`, `test-install`, `test-runner`, `test-extensions`) and the native suite executed
- **STOP Conditions:**
  - "STOP if any currently-orphaned suite (`test-commands`, `test-effect`, `test-extensions`) fails when first gated; report the failures instead of skipping or weakening the suite."
- **Description:** Audit finding Test/CI-01 and DX-01: roughly 2,200 lines of real tests gate nothing in CI, and the local test set differs from the CI set in both directions. Wire every existing host suite and the native suite into CI, and add one repo-root command that runs the full verification baseline locally so "does the repo work" has a single answer.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the repository at the current commit
When a Developer runs the single verification command locally
Then every host suite and the native suite execute
And the CI workflow executes the same set
And test-extensions is gated in at least one of the two

Given a pull request that breaks a previously-orphaned suite
When CI runs
Then the pipeline fails
```

---

#### SAFE-U002 Sanitize Control Sequences in Classic Widget Render Paths

- **Type:** Security
- **Effort:** 3
- **Dependencies:** SAFE-U001
- **Category:** Security
- **Scope (In-Scope Files):**
  - `native/src/render.rs`
  - Native unit tests for the classic Text, Select, Table, and List render paths
- **Scope (Out-of-Scope Files):**
  - `native/src/text_renderer.rs` (reference sanitization behavior; do not regress it)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && cargo clippy --manifest-path native/Cargo.toml -- -D warnings`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if sanitization requires changing the cell/writer data model rather than filtering at content ingestion or emission; that would need a TechSpec pass first."
- **Description:** Audit finding Security-01: the classic render paths special-case only `\n` and write other control bytes (including ESC) into cells, so untrusted Widget content can inject terminal escape sequences. The substrate text renderer already sanitizes. Bring the classic paths to the same sanitization semantics so no End User-visible surface emits raw control bytes from Widget content.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Widget whose content contains ESC, CSI, OSC, or other C0/C1 control bytes
When a Render Pass draws it through a classic render path
Then no raw control byte from the content reaches the Surface output
And printable content renders unchanged

Given the substrate text renderer's existing sanitization tests
When the native suite runs
Then they still pass unchanged
```

---

#### SAFE-U003 Recover From Poisoned Context Lock and Always Restore the Terminal

- **Type:** Security
- **Effort:** 3
- **Dependencies:** SAFE-U001
- **Category:** Correctness
- **Scope (In-Scope Files):**
  - `native/src/context.rs`
  - `native/src/lib.rs` (panic boundary and `tui_get_last_error` path only)
- **Scope (Out-of-Scope Files):**
  - `ts/src/ffi.ts` (host contract stays `0 / -1 / -2`)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml`
- **Expected Success Output:** `exit 0` including a new test that panics inside a context operation and proves subsequent calls still function
- **STOP Conditions:**
  - "STOP if the fix requires changing the public FFI error contract (0 / -1 / -2); that contract is fixed by TechSpec section 4."
  - "STOP if the chosen approach conflicts with ADR-T16; reconcile the ADR explicitly instead of drifting."
- **Description:** Audit finding Correctness-01: a panic caught at the FFI boundary poisons the context RwLock; every later call then maps poison to an error, `set_last_error` no-ops, and shutdown can no longer run — bricking the engine and stranding the End User's terminal in raw mode. Make lock poisoning recoverable (or unpoisonable) so one caught panic degrades a single call, not the process, and guarantee terminal restore remains reachable after any caught panic.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a native call panics and is caught at the FFI boundary returning -2
When the host issues subsequent FFI calls
Then those calls execute normally instead of failing on a poisoned lock
And tui_get_last_error returns the panic diagnostic

Given a caught panic occurred earlier in the session
When shutdown runs
Then raw mode and the alternate screen are restored
```

---

#### SAFE-U004 Propagate `tui_next_event` Errors Instead of Treating Them as Queue-Empty

- **Type:** Feature
- **Effort:** 2
- **Dependencies:** SAFE-U003
- **Category:** Correctness
- **Scope (In-Scope Files):**
  - `ts/src/events.ts`
  - Host tests covering the event drain
- **Scope (Out-of-Scope Files):**
  - `native/src/event.rs` (native side is correct; this is a host drain fix)
- **Verification Command:** `bun test ts/test-ffi.test.ts && bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if distinguishing -1/-2 from queue-empty requires a new native symbol; log the gap and reduce scope to surfacing the error without draining further."
- **Description:** Audit finding Correctness-02: the host event drain breaks on any result `<= 0`, silently swallowing explicit errors (-1) and caught panics (-2) as "no more Events". Surface these as diagnosable errors through the host error path so failures on the input path are visible instead of silent.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the native layer returns -1 or -2 during the Event drain
When the host processes Events for a Render Pass
Then the error is surfaced through the host error path with the native diagnostic
And it is distinguishable from an ordinary empty Event queue

Given an ordinary empty Event queue
When the host drains Events
Then behavior is unchanged
```

---

#### SAFE-U005 Bound the Native Event Buffer and Drain It Without O(n) Removal

- **Type:** Feature
- **Effort:** 2
- **Dependencies:** SAFE-U004
- **Category:** Correctness
- **Scope (In-Scope Files):**
  - `native/src/context.rs`
  - `native/src/event.rs`
  - `.constitution/tech-spec/data-models/tui-context.rs` (reconcile the declared buffer shape with the implementation)
- **Scope (Out-of-Scope Files):**
  - `ts/src/events.ts` (host drain contract unchanged)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if a bounded buffer requires deciding a drop policy that changes observable Event semantics beyond oldest-first eviction; record the question for a TechSpec pass."
- **Description:** Audit finding Correctness-03: the native Event buffer grows without bound if the host stops draining, and each drain removes from the front of a Vec at O(n). Introduce a bounded double-ended queue with oldest-first eviction and O(1) pop, and reconcile the data-model document.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the host stops draining Events while input continues
When the buffer reaches its bound
Then the oldest Events are evicted and memory stays bounded

Given a large buffered Event backlog
When the host drains it
Then each drain step completes without shifting the remaining backlog
```

---

#### SAFE-U006 Fix Native Handle Leaks on Partial JSX Mount and Stale Event Registry on Destroy

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** SAFE-U001
- **Category:** Correctness
- **Scope (In-Scope Files):**
  - `ts/src/jsx/reconciler.ts`
  - `ts/src/events.ts` (eventRegistry cleanup on imperative destroy)
  - `ts/test-jsx.test.ts`
- **Scope (Out-of-Scope Files):**
  - `native/src/tree.rs` (native destroy semantics are correct)
- **Verification Command:** `bun test ts/test-jsx.test.ts && bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if cleanup requires new native symbols; the existing destroy surface must be sufficient."
- **Description:** Audit findings Correctness-04 and part of Correctness-08: when a JSX mount throws partway, already-created native Handles are never destroyed; and imperatively destroying a Widget leaves stale entries in the host event registry. Make mount failure unwind created Handles and destroy paths clean their registry entries.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a JSX mount throws after creating some native Widgets
When the error propagates
Then every Handle created by the failed mount is destroyed
And the Composition Tree contains no orphaned Widgets

Given a Widget with Event subscriptions is destroyed imperatively
When later Events are routed
Then no stale registry entry receives or blocks them
```

---

#### SAFE-U007 Fix Fragment Reconciliation Ordering With Siblings Present

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** SAFE-U006
- **Category:** Correctness
- **Scope (In-Scope Files):**
  - `ts/src/jsx/reconciler.ts`
  - `ts/test-jsx.test.ts`
- **Scope (Out-of-Scope Files):**
  - `ts/src/effect/` (Effect surface consumes the fixed reconciler; no changes there)
- **Verification Command:** `bun test ts/test-jsx.test.ts && bun test ts/test-effect.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if correct ordering requires an insert-at-index native symbol that does not exist for the affected container; log the exact gap for PERF-V010."
- **Description:** Audit finding Correctness-06: reconciling a fragment that has siblings appends fragment children at the wrong native positions, breaking Composition Tree order. Fix child index accounting so fragments interleave correctly with sibling Widgets across updates.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a JSX tree where a fragment has preceding and following siblings
When the fragment's children change across a signal update
Then the native child order matches the JSX order exactly

Given nested fragments among siblings
When the tree re-renders repeatedly
Then ordering remains stable across Render Passes
```

---

#### SAFE-U008 Surface Swallowed Native Results in Transcript Render and Textarea Edit Sync

- **Type:** Feature
- **Effort:** 2
- **Dependencies:** SAFE-U001
- **Category:** Correctness
- **Scope (In-Scope Files):**
  - `native/src/render.rs` (transcript render result handling)
  - `native/src/event.rs` (textarea edit sync result handling)
- **Scope (Out-of-Scope Files):**
  - `native/src/transcript.rs` (accounting changes belong to PERF-V003)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if a swallowed Result marks a genuinely unreachable branch; document it with an explicit reason instead of adding error plumbing."
- **Description:** Audit finding Correctness-05: transcript render and textarea edit-sync paths discard `Result`s, so failures silently drift native state from what the host believes. Route these Results into the established error/diagnostic path so drift is observable.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a transcript render or textarea edit sync operation fails internally
When the operation completes
Then the failure is recorded through the native error/diagnostic path
And no code path discards the Result silently
```

---

#### SAFE-U009 Unify Width Measurement Into One Shared Implementation

- **Type:** Chore
- **Effort:** 2
- **Dependencies:** SAFE-U001
- **Category:** Correctness
- **Scope (In-Scope Files):**
  - `native/src/render.rs`
  - `native/src/text_renderer.rs`
  - `native/src/text.rs` (or the module chosen to own the shared helper)
- **Scope (Out-of-Scope Files):**
  - `native/src/text_cache.rs` (cache mechanics belong to PERF-V011)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if unification changes golden snapshot output for existing fixtures; report the diff before regenerating any golden."
- **Description:** Audit finding Correctness-08 (width divergence): four width-measurement implementations disagree on zero-width handling (`.max(1)` in some, not others), producing cursor off-by-N against wrapped text. Consolidate to one shared width function used by all callers.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given text containing zero-width or combining graphemes
When cursor position and wrap width are computed for the same content
Then both derive from the same width implementation
And cursor position matches the rendered glyph column
```

---

#### SAFE-U010 Small-Correctness Batch: -2 Path Test, Option Guards, Command Handler Failure, Column Bound

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** SAFE-U003, SAFE-U004
- **Category:** Correctness
- **Scope (In-Scope Files):**
  - `ts/test-ffi.test.ts` (exercise the -2 caught-panic path from the host)
  - `ts/src/` falsy option guards identified by the audit (Correctness-08 batch)
  - `ts/src/commands.ts` and the loop error path (terminal restore when a Command handler throws)
  - `native/src/render.rs` (bound table column allocation)
- **Scope (Out-of-Scope Files):**
  - `ts/src/loop.ts` structural changes (loop unification is ARCH-W001)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if the throwing-Command-handler fix requires restructuring the loop rather than wrapping dispatch; defer the structural part to ARCH-W001 and note it."
- **Description:** Audit finding Correctness-08 batch: the -2 caught-panic path has no host-side test; several option checks treat legitimate falsy values (0, empty string) as absent; a throwing Command handler can leave the terminal in raw mode; table column count allocation is unbounded. Fix each with focused tests.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a native call that panics
When the host invokes it through the FFI wrapper
Then a host test observes -2 and the diagnostic message

Given a Command handler that throws during dispatch
When the loop processes it
Then the terminal is restored and the error is reported

Given a Widget option legitimately set to 0 or an empty string
When the option is applied
Then it is honored rather than treated as unset
```
