# Epic W — Architecture Consolidation & Tech Debt (ARCH)

**Epic Status:** Active

Epic W deepens the seams the audit identified as shallow or duplicated
(loop duplication, dual text authority, dead experiment code, examples
bypassing the public surface, plugin wiring), expands verification coverage
(goldens, substrate gates), and lands the layout-engine upgrade behind that
coverage. Contract-level changes go through ADR spikes.

---

#### ARCH-W001 Unify the Run Loops Into One Core With Thin Adapters

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** SAFE-U004, SAFE-U010
- **Category:** Tech-Debt
- **Scope (In-Scope Files):**
  - `ts/src/loop.ts` (shared loop core lives here; import direction stays acyclic)
  - `ts/src/app.ts` (becomes a thin adapter)
  - `ts/src/dev.ts` (remove the duplicate SIGINT handler)
  - `examples/effect-counter.tsx` (delete the hand-rolled audit branch once `app.run()` gains audit mode)
- **Scope (Out-of-Scope Files):**
  - `ts/src/effect/` (consumes the loop; no structural changes)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0`; `test-runner.test.ts` and `test-examples.test.ts` pass unchanged
- **STOP Conditions:**
  - "STOP if preserving both public option types requires changing the {start, stop} shape pinned by test-examples; the public surfaces must not break."
- **Description:** Audit finding TechDebt-03 and addendum A1 (Strong): `Tuvren.run()` and `createLoop().start()` are near-duplicate loops already drifting. Extract one shared loop core; keep both public entry points as thin adapters carrying their adapter-only concerns (audit mode, signal handlers, debug overlay, try/finally lifecycle). Include the host-side wake seam: a request-render flag checked at top-of-loop plus a capped idle timeout, so signal writes off the input path paint within the bounded idle window (audit Correctness-07). A native waker remains deferred as Speculative.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given both public loop entry points
When applications run through either
Then behavior is identical because both delegate to one shared core
And both public option types and the start/stop shape are preserved

Given a signal write occurs outside the input path
When the loop is idle
Then a Render Pass occurs within the capped idle window

Given app.run is invoked with audit mode
When the loop runs headless
Then audit output works without a hand-rolled branch in examples

Given the dev session helper is active
When the End User sends SIGINT
Then exactly one handler performs shutdown
```

---

#### ARCH-W002 Delete the Retired Background-Render Experiment

- **Type:** Chore
- **Effort:** 2
- **Dependencies:** SAFE-U001
- **Category:** Tech-Debt
- **Scope (In-Scope Files):**
  - `native/src/threaded_render.rs` (delete)
  - `native/src/lib.rs` (remove its bindings)
  - `native/CLAUDE.md` (module map reconciliation)
  - `.constitution/tech-spec/adrs/ADR-T31-background-rendering-opt-in.md` (mark superseded by the No-Go decision report; reconcile, do not rewrite history)
- **Scope (Out-of-Scope Files):**
  - `native/src/render.rs` (the synchronous pipeline is untouched)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && cargo clippy --manifest-path native/Cargo.toml -- -D warnings`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if any live code path imports the module beyond the lib.rs bindings; report the dependency before deleting."
- **Description:** Audit finding TechDebt-01: 1,432 lines of dead experiment code remain after the formal No-Go (TASK-H2 report) and drift from the real pipeline. Delete the module and its bindings. This is consistent with `.constitution/prd/out-of-scope/background-render-threading.md`; the git history and the No-Go report preserve the record.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the retired module is deleted
When the native suite and clippy run
Then the build is green with no references to the removed module
And the module map documentation matches the source tree
```

---

#### ARCH-W003 Spike: Dual Text Authority Retirement Plan (ADR)

- **Type:** Spike
- **Effort:** 3
- **Dependencies:** PERF-V006
- **Category:** Tech-Debt
- **Scope (In-Scope Files):**
  - `.constitution/spikes/SPK-ARCH-W003.md` (sole output)
- **Scope (Out-of-Scope Files):**
  - `native/src/` (no code changes in a Spike)
- **Verification Command:** `test -s .constitution/spikes/SPK-ARCH-W003.md`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP: no production code changes are allowed inside a Spike ticket."
- **Description:** Audit finding TechDebt-02: `node.content` String storage coexists with the TextBuffer substrate (ADR-T37), causing full copies per keystroke and per Render Pass and splitting text authority. Inventory every classic-path consumer of `node.content`, determine which Widgets can move to TextBuffer-backed content, define the migration order and compatibility shims, and produce the recommendation a Stage 3 pass adopts as an ADR before ARCH-W004.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the spike completes
When SPK-ARCH-W003.md is reviewed
Then every node.content consumer is inventoried with its migration disposition
And a phased retirement order with rollback boundaries is recommended
And it lists ARCH-W004 as the unlocked ticket
```

---

#### ARCH-W004 Execute Dual Text Authority Retirement (Phase 1 per ADR)

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** ARCH-W003
- **Category:** Tech-Debt
- **Scope (In-Scope Files):**
  - `native/src/render.rs`
  - `native/src/event.rs`
  - `native/src/text_buffer.rs` / `native/src/text_view.rs` (as directed by the ADR)
  - `.constitution/tech-spec/data-models/tui-node.rs` (reconcile the declared content field with the outcome)
- **Scope (Out-of-Scope Files):**
  - `ts/src/` public API (content-setting surface unchanged)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && bun run verify && bun run ts/bench-render.ts`
- **Expected Success Output:** `exit 0` with goldens and replay fixtures unchanged
- **STOP Conditions:**
  - "STOP if the ADR derived from SPK-ARCH-W003 has not been adopted into .constitution/tech-spec/adrs/."
  - "STOP at the ADR's phase-1 rollback boundary if any golden or replay fixture diverges; do not push into phase 2 within this ticket."
- **Description:** Execute the first retirement phase from the ADR: move the highest-traffic text surfaces off duplicated `node.content` storage onto the TextBuffer substrate so keystrokes and Render Passes stop copying full strings, while classic Widgets not yet migrated keep working through the shim the ADR defines.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the phase-1 Widgets identified by the ADR
When text content is set or edited
Then content lives in one authority (TextBuffer) without a duplicated String copy

Given non-migrated classic Widgets
When they render
Then behavior is unchanged through the compatibility shim

Given a keystroke into a migrated editable Widget
When the edit syncs
Then no full-content copy occurs on the edit path
```

---

#### ARCH-W005 Rebase Examples and Flagships Onto the Public API

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** ARCH-W001
- **Category:** Tech-Debt
- **Scope (In-Scope Files):**
  - `examples/*.ts`, `examples/*.tsx` (all shipped examples and flagships)
  - `ts/test-examples.test.ts` (assert no internal imports)
- **Scope (Out-of-Scope Files):**
  - `ts/src/` public API additions (missing wrappers belong to SDK-X002; log gaps instead)
- **Verification Command:** `bun test ts/test-examples.test.ts && bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if an example genuinely cannot express its behavior through the public API; record the exact missing wrapper as input for SDK-X002 and leave that call site with an explicit advanced-usage marker."
- **Description:** Audit finding TechDebt-04/DX (examples bypass the public surface): flagships import `ts/src/ffi` and internal modules and duplicate loop boilerplate. Move all examples to the public entry points (including the unified loop from ARCH-W001), deduplicate boilerplate, and add a test that fails when an example imports internals without an advanced marker. Gaps discovered here are the concrete input for Epic X wrapper work.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given every shipped example and flagship
When their imports are inspected
Then only public package entry points are used, or the site carries an explicit advanced marker

Given the example replay suite
When it runs after the rebase
Then all fixtures pass unchanged
```

---

#### ARCH-W006 Wire the Plugin Palette Slot End-to-End and Add Registry Subscription

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** SAFE-U001
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - `ts/src/extensions.ts` (subscribe primitive)
  - `examples/plugin-demo.ts` (attachment demonstration: Plugin registries wired to the app's Command dispatcher and palette)
  - `ts/test-extensions.test.ts`
- **Scope (Out-of-Scope Files):**
  - Theme-slot payloads and devtools panel host (deferred; see critical-path Future scope)
- **Verification Command:** `bun test ts/test-extensions.test.ts && bun run examples/plugin-demo.ts` (audit mode)
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if wiring requires changing contribution shapes; pre-GA slots allow additive change only within ADR-T46's bounds."
- **Description:** Audit finding Architecture-01 (corrected) and addendum A3: the palette consumer exists, but no example constructs the wire, and each per-instance registry never reaches a running app's dispatcher. Add a subscription primitive so hosts can observe contribution changes, and make the plugin demo attach Plugin-contributed Commands and Keymaps to a live application so a contributed Command actually executes.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Plugin contributing Commands, Keymaps, and palette entries
When the demo application activates it
Then the contributed Command is executable through the palette and its Keymap

Given a Plugin is deactivated
When contributions are withdrawn
Then subscribed hosts observe the removal and the palette no longer lists the entry
```

---

#### ARCH-W007 Route Load Failures Through Diagnostics and Preserve Panic Payloads

- **Type:** Feature
- **Effort:** 2
- **Dependencies:** SAFE-U003
- **Category:** DX
- **Scope (In-Scope Files):**
  - `ts/src/ffi.ts` (native library load failures use the diagnostics layer)
  - `native/src/lib.rs` (`ffi_wrap` preserves panic payload messages)
- **Scope (Out-of-Scope Files):**
  - `ts/src/resolve.ts` resolver order (the resolver contract is fixed)
- **Verification Command:** `bun test ts/test-install.test.ts && cargo test --manifest-path native/Cargo.toml`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if payload preservation requires allocating in the panic path in a way that can itself panic; use a best-effort static fallback."
- **Description:** Audit finding DX-02: a failed native library load bypasses the actionable-diagnostics layer (PRD Epic 10 promises actionable diagnostics), and `ffi_wrap` discards panic payloads so `-2` errors lose their message. Route load failures through the diagnostics path and capture panic payload text into the last-error slot.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the native library fails to load
When the Developer sees the error
Then it includes the resolver stages attempted and remediation guidance

Given a native panic with a message is caught at the boundary
When the host reads the last error after a -2
Then the panic message text is available
```

---

#### ARCH-W008 Expand Golden Snapshot Coverage to Composite and Stateful Widgets

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** ARCH-W004
- **Category:** DX
- **Scope (In-Scope Files):**
  - `native/fixtures/` (new goldens)
  - `native/src/lib.rs` golden test harness section
- **Scope (Out-of-Scope Files):**
  - Widget rendering logic (goldens capture current behavior; rendering fixes are separate tickets)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if capturing a golden reveals a rendering bug; report it instead of goldening the bug."
- **Description:** Audit finding Test-02: goldens stop at 5 basic scenes. Add golden scenes for Transcript, SplitPane, Table, List, Tabs, and Overlay — the Widgets the deep epics just touched — so the taffy upgrade (ARCH-W011) and future render changes have regression armor.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given golden scenes exist for Transcript, SplitPane, Table, List, Tabs, and Overlay
When the native suite runs
Then each scene's Surface output is compared byte-for-byte against its golden

Given a rendering regression in any covered Widget
When the suite runs
Then the golden comparison fails
```

---

#### ARCH-W009 Make Substrate Gates Assert Real Behavior

- **Type:** Chore
- **Effort:** 2
- **Dependencies:** ARCH-W004
- **Category:** DX
- **Scope (In-Scope Files):**
  - `native/src/substrate_gates.rs`
- **Scope (Out-of-Scope Files):**
  - `native/src/text_renderer.rs` (behavior under test, not under change)
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if a gate cannot be expressed behaviorally because the substrate lacks the hook; record the gap rather than keeping a string-grep assertion."
- **Description:** Audit finding Test-03: substrate gates G1/G2/G4 have no behavioral assertion and G3 is a string grep, giving false confidence about ADR-T37 conformance. Replace each gate with a behavioral test of the property it claims, updated for the post-retirement (ARCH-W004) reality.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given each substrate gate
When the native suite runs
Then the gate exercises the runtime behavior it names rather than source text
And a deliberate violation of the gated property fails the gate
```

---

#### ARCH-W010 Spike: Layout Engine Major-Version Upgrade Assessment

- **Type:** Spike
- **Effort:** 2
- **Dependencies:** ARCH-W008
- **Category:** Dependency-Upgrade
- **Scope (In-Scope Files):**
  - `.constitution/spikes/SPK-ARCH-W010.md` (sole output)
- **Scope (Out-of-Scope Files):**
  - `native/Cargo.toml` (no dependency changes in a Spike)
- **Verification Command:** `test -s .constitution/spikes/SPK-ARCH-W010.md`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP: no production code changes are allowed inside a Spike ticket."
- **Description:** Audit finding Deps-02: the layout engine is three majors behind (0.9 → 0.12.1, verified 2026-07-07). Assess the API delta across the majors, known layout-behavior changes, and the migration surface in the native layout module; recommend upgrade-in-one-step versus stepwise, using the ARCH-W008 goldens as the regression net.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the spike completes
When SPK-ARCH-W010.md is reviewed
Then it lists the breaking API changes affecting the layout module
And it recommends an upgrade path with expected golden-visible behavior differences
And it lists ARCH-W011 as the unlocked ticket
```

---

#### ARCH-W011 Upgrade the Layout Engine Across Three Majors

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** ARCH-W010
- **Category:** Dependency-Upgrade
- **Scope (In-Scope Files):**
  - `native/Cargo.toml`
  - `native/src/layout.rs` and call sites the spike identified
  - `native/fixtures/` (only where the spike predicted legitimate layout-behavior differences)
  - `.constitution/tech-spec/stack.md` §2 (reconcile the pinned version)
- **Scope (Out-of-Scope Files):**
  - `native/src/render.rs` beyond layout call sites
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml && bun run verify && bun run ts/bench-render.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if a golden diff appears that the spike did not predict; report it before regenerating any golden."
  - "STOP if the upgrade degrades the render benchmarks beyond recorded budgets."
- **Description:** Execute the upgrade path chosen by SPK-ARCH-W010, adapting the layout module to the new API, verifying against the expanded goldens and flagship replays, and reconciling the stack BOM.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the layout engine at the target major version
When the full verification baseline runs
Then all tests pass and only spike-predicted golden diffs exist, each reviewed and regenerated deliberately

Given the flagship examples
When their replay fixtures run
Then layout output matches expectations
```

---

#### ARCH-W012 DX Batch: Host Formatter/Linter, Hooks, CI Cache, Strict Indexing

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** SAFE-U001
- **Category:** DX
- **Scope (In-Scope Files):**
  - `devenv.nix` (host-side hooks alongside the existing native hooks)
  - `ts/tsconfig.json` (`noUncheckedIndexedAccess`)
  - `.github/workflows/ci.yml` (build caching)
  - Host formatter/linter configuration files created by their own tooling CLIs
- **Scope (Out-of-Scope Files):**
  - `native/` toolchain configuration (already covered)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0` with formatting and lint checks included in the baseline
- **STOP Conditions:**
  - "STOP if enabling strict indexed access surfaces more than a focused batch of type errors; land the flag change with targeted fixes and report any remainder rather than weakening other compiler options."
- **Description:** Audit finding DX-03 batch: the host layer has no formatter/linter gate, git hooks cover only the native side, CI rebuilds without caching, and the TS config misses unchecked-index safety. Close each gap using the standard tooling initialization CLIs.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the verification baseline runs
When host formatting or lint violations exist
Then the baseline fails

Given a commit is created locally
When hooks run
Then both native and host checks execute

Given CI runs twice on the same dependency set
When the second run executes
Then dependency and build caches are reused
```

---

#### ARCH-W013 Reconcile Documentation Drift

- **Type:** Chore
- **Effort:** 2
- **Dependencies:** ARCH-W002, ARCH-W005
- **Category:** Docs
- **Scope (In-Scope Files):**
  - `native/CLAUDE.md`, `ts/CLAUDE.md` (module maps)
  - `README.md`
  - `CLAUDE.md` (Development Commands)
- **Scope (Out-of-Scope Files):**
  - `.constitution/prd/`, `.constitution/architecture/` (upstream layers change only via their own stages)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0`; a manual doc pass confirms every documented symbol, module, and command exists
- **STOP Conditions:**
  - "STOP if reconciliation reveals product-level drift (scope claims that are untrue); report it for a PRD-layer pass instead of patching downstream docs."
- **Description:** Audit finding Docs-01 batch: four documented native functions are unbound (until SDK-X002 binds them — coordinate the wording), module maps miss real modules, and the plugin demo is undocumented. Reconcile docs with the post-W source tree.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the module maps and README
When compared against the source tree
Then every listed module and command exists and every shipped module is listed

Given the plugin demonstration example
When a Developer reads the examples documentation
Then the demo and its slots are documented
```
