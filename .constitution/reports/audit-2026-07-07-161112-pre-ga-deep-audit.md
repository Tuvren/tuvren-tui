# Codebase Constitutional Audit Report: pre-ga-deep-audit

- **Timestamp:** 2026-07-07-161112 (resolved via `date`)
- **Target Commit SHA:** 8ec41b10634ad76acc804aecf22cc76eb2c198a7
- **Audit Depth:** deep (7 parallel read-only subagents: native core, TS host, security, tests/CI, docs drift, deps/DX/packaging, performance/extensibility; findings deduplicated and spot-verified against source)

## Executive Summary

Tuvren TUI is in unusually good structural health for a pre-GA codebase: the FFI
pointer boundary is disciplined, credential hygiene is clean, OSC52/OSC8
validation is real and complete, docs drift is low (~2%), there are zero
TODO/FIXME markers in production source, the native suite has 500+ behavioral
tests, and the host layer is strict-TS with near-zero type escape hatches.
Active scope in `.constitution/tasks/active/` honestly reflects unshipped work.

The material risk clusters in four places:

1. **One real security defect.** The legacy (non-substrate) render paths for
   plain `Text`, `Select`, `Table`, and `List` pass raw control characters —
   including ESC — from host-supplied strings straight into terminal output.
   The substrate renderer already defends against this; the classic paths do
   not. For a product whose flagship workload is rendering untrusted agent/log
   output, this is the highest-priority fix in the repo.
2. **A resilience landmine at the FFI boundary.** A caught panic (`-2` path)
   while holding the context write lock poisons the `RwLock` permanently:
   every subsequent call including `tui_shutdown` fails, no error text is
   recordable, and the user's terminal is stranded in raw mode/alt screen.
3. **Streaming-scale performance ceilings.** The render pipeline maintains
   dirty flags but never consults them (full re-layout + full-tree rasterize +
   full-buffer diff every tick); transcript row accounting is O(total blocks)
   per frame and per streamed chunk; transcript retention and the native event
   buffer are unbounded. Each one individually caps the exact agent-console
   workload the PRD names as flagship — and current benchmark gates exercise
   none of them.
4. **Release-gate and publish gaps ahead of EPIC-V.** Roughly 2,200 lines of
   real tests (`test-commands`, `test-effect`, and the entirely orphaned
   `test-extensions`) gate nothing in CI; package manifests are missing
   `files`, `publishConfig.access`, `repository`, and LICENSE/README payloads;
   there is no publish job, no `cargo audit`, and no committed `Cargo.lock`.

A fifth theme is strategic rather than defective: Epic T's plugin slots are
API-complete but write-only (nothing in the framework consumes the palette /
devtools / theme / example registries), and `examples/opencode-client/` is an
empty scaffold — both need a build-or-remove decision before the public launch.

## Findings Table

Sorted by Leverage (Impact/Effort × Confidence × (1 − Risk)):

| # | Finding | Category | Impact | Effort | Risk | Confidence | Evidence |
|---|---------|----------|--------|--------|------|------------|----------|
| 1 | Terminal escape-sequence injection via classic widget render paths | Security | HIGH | S | LOW | HIGH | `native/src/render.rs:1018-1051` |
| 2 | Caught panic poisons context lock, bricks engine, strands terminal in raw mode | Correctness | HIGH | S | LOW | HIGH | `native/src/context.rs:216,337-381` |
| 3 | ~2,200 lines of real tests gate nothing in CI; `test-extensions` orphaned everywhere | Test/CI | HIGH | S | LOW | HIGH | `.github/workflows/ci.yml:94-108` |
| 4 | npm publish blockers: no `files`, no `publishConfig.access`, no LICENSE/README in tarballs, no publish job | Packaging | HIGH | M | LOW | HIGH | `ts/package.json`, `packages/@tuvren/*/package.json` |
| 5 | `tui_next_event` errors (−1/−2) silently swallowed as "queue empty" | Correctness | MED | S | LOW | HIGH | `ts/src/events.ts:122-123` |
| 6 | Native `event_buffer` unbounded, drained with O(n) `Vec::remove(0)` | Correctness/Perf | MED | S | LOW | HIGH | `native/src/context.rs:31`, `native/src/event.rs:264-271` |
| 7 | Native handles leak when JSX mount throws partway | Correctness | MED | S | LOW | HIGH | `ts/src/jsx/reconciler.ts:167-196` |
| 8 | Transcript accounting O(total blocks) per frame and per streamed chunk (quadratic sessions) | Performance | HIGH | M | MED | HIGH | `native/src/transcript.rs:134-141,450,509` |
| 9 | Render pipeline never consults dirty flags — full re-render + full-buffer diff every tick | Performance | HIGH | L | MED | HIGH | `native/src/render.rs:328-416,413` |
| 10 | Transcript block retention unbounded — RSS grows monotonically in flagship workload | Performance | HIGH | M | MED | HIGH | `native/src/transcript.rs:441-443` |
| 11 | Epic T plugin slots are write-only: no framework surface consumes palette/devtools/themes/examples registries | Architecture | HIGH | M | MED | HIGH | `ts/src/extensions.ts:80-83,251-278` |
| 12 | Per-frame deep clones: widget state (`table_state.clone()`), node content/children in hot traversal | Performance | MED | M | LOW | HIGH | `native/src/render.rs:471-478,1354,1454,1642,1740` |
| 13 | Collection props clear-and-rebuild whole native collection per signal tick; per-call `new TextEncoder()` + double copy | Performance | MED | M | LOW | HIGH | `ts/src/jsx/reconciler.ts:446-536,394-530` |
| 14 | Fragment reconciliation breaks native child ordering when fragment has siblings | Correctness | MED | M | MED | HIGH | `ts/src/jsx/reconciler.ts:679-687,744-761` |
| 15 | Benchmark gates cover a trivial 80×24 ~10-widget scene; none of findings 8/9/12 are measurable | Test/Perf | MED | M | LOW | HIGH | `ts/bench-render.ts:70-131` |
| 16 | `threaded_render.rs`: 1,432-line dead experiment kept after formal No-Go, drifting from render.rs | Tech Debt | MED | S | LOW | HIGH | `native/src/threaded_render.rs:24-30`, `native/src/lib.rs:3047-3075` |
| 17 | Swallowed `Result`s cause silent state drift in transcript render and textarea edit sync | Correctness | MED | M | LOW | MED | `native/src/render.rs:2152-2167`, `native/src/event.rs:505-629` |
| 18 | Signal writes off the input path don't wake the run loop (up to 100 ms paint latency) | Correctness/Perf | MED | M | MED | MED | `ts/src/app.ts:507-538`, `ts/src/loop.ts:111-140` |
| 19 | No single-command verification baseline; local test set ≠ CI set in both directions | DX | MED | M | LOW | HIGH | `devenv.nix:37`, `ts/package.json:15` |
| 20 | Golden snapshots cover 5 basic scenes; zero for Transcript/SplitPane/Table/List/Tabs/Overlay | Test | MED | M | LOW | HIGH | `native/src/lib.rs:4123-4207`, `native/fixtures/` |
| 21 | Dual text authority: `node.content` String coexists with TextBuffer substrate, full copies per keystroke/frame | Tech Debt | MED | L | MED | HIGH | `native/src/render.rs:75-131,606-611`, `native/src/event.rs:476-481` |
| 22 | `Cargo.lock` gitignored + no `cargo audit`/Dependabot + release actions on mutable refs | Deps/Supply chain | MED | S | LOW | HIGH | `.gitignore`, `.github/workflows/release.yml:70,198` |
| 23 | `Tuvren.run()` and `createLoop().start()` are near-duplicate event loops already drifting | Tech Debt | MED | M | MED | HIGH | `ts/src/app.ts:495-543` vs `ts/src/loop.ts:86-141` |
| 24 | taffy 3 majors behind (0.9 → 0.12.1, verified 2026-07-07) | Dependencies | MED | L | MED | HIGH | `native/Cargo.toml:14` |
| 25 | Examples/flagships bypass public API (`ts/src/ffi`, internal imports); duplicated boilerplate | Tech Debt/DX | MED | M | LOW | HIGH | `examples/system-monitor.ts:876-1150`, import map |
| 26 | Text cache LRU is O(n) per access; parse cache keyed per wrap-width duplicates entries | Performance | LOW | M | LOW | HIGH | `native/src/text_cache.rs:30-63`, `native/src/text.rs:103-110` |
| 27 | `dlopen` failures bypass the diagnostics layer; `ffi_wrap` discards panic payloads | DX/Observability | MED | S | LOW | HIGH | `ts/src/ffi.ts:803`, `native/src/lib.rs:100-179` |
| 28 | Substrate gates overclaim: G1/G2/G4 have no behavioral test, G3 is a string-grep | Test/Docs | LOW | M | LOW | HIGH | `native/src/substrate_gates.rs:6-28,383-429` |
| 29 | Four width-measurement implementations with real `.max(1)` divergence (cursor off-by-N) | Correctness | LOW | S | LOW | HIGH | `native/src/render.rs:1197` vs `text_renderer.rs:175` |
| 30 | Doc-drift batch: 4 unbound native fns, `edit_buffer.rs`/`extensions.ts` missing from module maps, `plugin-demo.ts` undocumented | Docs | LOW | S | LOW | HIGH | `native/CLAUDE.md`, `ts/CLAUDE.md`, `README.md` |
| 31 | `examples/opencode-client/` is an empty untracked scaffold | Tech Debt | LOW | S | LOW | HIGH | `examples/opencode-client/` |
| 32 | Assorted small correctness: −2 path untested from TS, stale `eventRegistry` on imperative destroy, falsy option guards, terminal wedged on throwing command handler, unbounded table column alloc | Correctness | LOW | S | LOW | MED | see detailed findings |
| 33 | DX batch: no TS formatter/linter, git hooks Rust-only, no CI build cache, tsconfig missing `noUncheckedIndexedAccess` | DX | LOW | S | LOW | HIGH | `devenv.nix`, `ts/tsconfig.json` |

## Detailed Findings

### [Security-01] Terminal escape-sequence injection via classic widget render paths
- **Evidence:** `native/src/render.rs:1018-1051` (`render_plain_text`), plus the
  analogous char loops in `render_select_options` (~`:1337`), `render_table`
  (~`:1437`), `render_list` (~`:1625`); emission verbatim at
  `native/src/writer.rs:227,241,254`. Ingestion accepts any valid UTF-8
  including ESC/C0/C1 at `native/src/lib.rs:558,806,1087`. Spot-verified: the
  loop special-cases only `'\n'`; every other char — including `0x1b` — is
  written into a `Cell` and emitted unfiltered.
- **Impact:** Untrusted strings shown in plain `Text`, `Input`, `Select`,
  `Table`, or `List` (agent output, log lines, repo file content — e.g. the
  `repo-inspector` example) can smuggle raw escape sequences to the host
  terminal: spoofed UI, cursor/screen corruption, title rewrites, and on some
  emulators clipboard writes or response-injection. The substrate renderer
  (`native/src/text_renderer.rs:210-223`) already skips zero-advance
  graphemes, so this is a known-solved problem that the legacy paths bypass.
- **Effort & Risk:** Effort: S | Risk: LOW (behavior change only for control
  chars that currently corrupt output anyway)
- **Confidence:** HIGH
- **Fix Sketch:** Skip or replace `ch.is_control()` (preserving `'\n'`
  handling) in the four classic loops, and add a defense-in-depth control-char
  filter in `writer.rs` so no future path can emit raw controls into `Cell.ch`.

### [Correctness-01] Caught panic poisons the context RwLock and permanently bricks the engine
- **Evidence:** `native/src/context.rs:216` (every poison maps to `Err`),
  `context.rs:337-345` (`context_write`), `context.rs:373-381`
  (`destroy_context`), `context.rs:389` (`set_last_error` silently no-ops on
  poison), `native/src/lib.rs:89-104` (`ffi_wrap` panic arm). Spot-verified.
- **Impact:** Any panic inside an FFI call holding the write guard — the `-2`
  path the ABI explicitly supports — poisons the lock. Every subsequent call,
  including `tui_shutdown` and re-`tui_init`, returns −1 forever;
  `tui_get_last_error` cannot record anything; the Crossterm backend never
  shuts down and the user's terminal is left in raw mode / alt screen. The
  only poison recovery in the codebase lives in dead `threaded_render.rs:384`.
- **Effort & Risk:** Effort: S | Risk: LOW (single-threaded model per ADR-T16
  means recovering from poison is semantically safe)
- **Confidence:** HIGH
- **Fix Sketch:** Recover with `unwrap_or_else(|e| e.into_inner())` (or
  `RwLock::clear_poison`) in the context lock accessors, and guarantee
  `tui_shutdown` reaches `backend.shutdown()` even on a poisoned lock. Combine
  with downcasting the panic payload in `ffi_wrap` (see DX-02) so `-2` becomes
  diagnosable.

### [Test/CI-01] Real test suites gate nothing in CI; `test-extensions` is orphaned everywhere
- **Evidence:** `.github/workflows/ci.yml:94-108` runs only
  ffi/jsx/examples/install/runner. `ts/package.json:15` `"test"` includes
  commands/effect but omits `test-extensions.test.ts` (812 lines, 60 tests for
  the just-shipped Epic T plugin system). `test-extensions` also appears in no
  CLAUDE.md/README command list. Spot-verified by grep.
- **Impact:** The command registry/keymap layer (~529 lines of tests), the
  Effect surface (Epic S flagship, ~873 lines), and the entire plugin-slot
  subsystem can regress with green CI. Also unwired: `guardrails-ffi.ts`
  (self-describes as a CI gate) and `devtools_bench` referenced by
  GatePolicy.md:53,164.
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Add `test-commands`, `test-effect`, `test-extensions` to the
  ci.yml host-tests job and the package.json `test` script; reconcile
  GatePolicy Gate 5's enforcement list and the three CLAUDE.md command lists.

### [Packaging-01] First-public-publish blockers across all six manifests (EPIC-V)
- **Evidence:** `ts/package.json` — no `files` (an `npm pack` ships
  `test-*.test.ts`, benches, fixtures, `CLAUDE.md`, `bun.lock`), no
  `repository`/`description`/`keywords`, exports point at raw `./src/*.ts`
  (Bun-only). `packages/@tuvren/*/package.json` — no
  `publishConfig.access: public` (scoped packages default to restricted →
  publish fails), `files` lists only the binary (no LICENSE/README despite
  PUB-V002 and Apache-2.0 distribution requirements). `release.yml` stages
  payloads but has no publish job; `optionalDependencies` pin exact `0.1.0` so
  aux packages must publish before root.
- **Impact:** Publishing today either fails outright (scope access) or ships a
  bloated, license-violating, metadata-less package. These are the concrete
  PUB-V001/V002/V003 checklists.
- **Effort & Risk:** Effort: M | Risk: LOW
- **Confidence:** HIGH (versions and npm behavior verified online 2026-07-07)
- **Fix Sketch:** Add `files`/`repository`/`publishConfig` to all manifests,
  stage LICENSE+README into each payload during release assembly, and add a
  publish job ordered aux-packages-first with `--access public` and
  failure-stop. Decide TS-source vs built `dist/` + `.d.ts` for non-Bun
  consumers.

### [Correctness-02] `tui_next_event` errors are swallowed as "no more events"
- **Evidence:** `ts/src/events.ts:122-123` — `if (result <= 0) break;`
  conflates `0` (empty) with `-1` (native error) and `-2` (caught panic).
- **Impact:** A panicking native event path degrades to a silently frozen
  event stream instead of a diagnosable `TuvrenError`; combined with
  Correctness-01 this is the exact pair that turns a native bug into an
  undebuggable hang.
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** `if (result < 0) checkResult(result, "drainEvents"); if (result === 0) break;`

### [Correctness-03] Native `event_buffer` is unbounded and drained with `Vec::remove(0)`
- **Evidence:** `native/src/context.rs:31`; sole drain site
  `native/src/event.rs:264-271` uses `remove(0)`; ~15 uncapped push sites
  (`event.rs:149,194,237,251,774`, `tree.rs:194`, `splitpane.rs:196,234`).
- **Impact:** A host that generates events without polling grows native memory
  without bound (mouse-move storms accelerate it); backlog drain is O(n²).
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** `VecDeque` with a documented cap (drop-oldest, coalesce
  mouse-moves), mirroring the devtools ring pattern at `devtools.rs:43-45`.

### [Correctness-04] Native handles leak when a JSX mount throws partway
- **Evidence:** `ts/src/jsx/reconciler.ts:167-196` — `createWidget()`
  succeeds, then `applyProps()` (line 180) or a child `mount()` (line 189)
  throws; nothing destroys the created widget or partial subtree.
  `mountComponent` (`:204-218`) disposes the component frame but not partial
  native subtrees.
- **Impact:** Every failed mount (invalid color, native error) orphans native
  nodes until shutdown; retry/error-boundary loops accumulate leaked handles
  and stale effects firing FFI calls against detached nodes.
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Wrap the intrinsic-mount body in try/catch: dispose collected
  cleanups and `widget.destroySubtree()` before rethrowing.

### [Performance-01] Render pipeline maintains dirty flags but never consults them
- **Evidence:** `native/src/render.rs:328-416` — unconditional
  `compute_layout` (`:346`), full front-buffer clear (`:356`), full tree walk
  (`:359-361`), full W×H cell diff (`:1830-1856`); `clear_dirty_flags` at
  `:413` consumes flags only devtools ever read. The run loop
  (`ts/src/app.ts:537`, `ts/src/loop.ts:139`) renders every tick including
  idle wakeups. Spot-verified.
- **Impact:** O(nodes + W×H) per frame regardless of change: a 200×50 terminal
  is ~10,000 cell comparisons plus whole-tree rasterization per tick even on a
  static screen. Terminal *output* is minimized; CPU is not. This is the
  dominant wasted cost and the architectural ceiling for battery/CPU claims.
- **Effort & Risk:** Effort: L | Risk: MED (land behind golden + benchmark
  gates per ADR-T30)
- **Confidence:** HIGH
- **Fix Sketch:** First a cheap frame-level short-circuit (no dirty node, no
  animation, no resize → skip layout/rasterize/diff entirely); then
  incremental dirty-rect rasterization. Also feeds fixes for per-frame clones
  (Performance-04) and scratch-buffer reuse.

### [Performance-02] Transcript accounting is O(total blocks) per frame and per streamed chunk
- **Evidence:** `native/src/transcript.rs:134-141`
  (`compute_total_visible_rows` scans every block, each with a parent-chain
  `is_block_hidden` walk `:107-127`), invoked from `append_block` (`:450`),
  every `patch_block` chunk (`:509`), and multiple times per frame via anchor
  math; `render.rs:2175-2193` additionally walks all blocks per frame. Also
  `transcript.rs:78-93` + `text_view.rs:444-478`: the wrap-cache key includes
  `content_epoch`, so每 streamed chunk rewraps the whole block (O(len²) per
  block over a stream).
- **Impact:** Streaming sessions are quadratic: at tens of thousands of blocks
  every chunk and frame pays a full-transcript scan — directly capping the
  flagship agent-console scrollback story.
- **Effort & Risk:** Effort: M | Risk: MED (anchor semantics must be preserved
  — gate with the existing 72 transcript tests)
- **Confidence:** HIGH
- **Fix Sketch:** Maintain an incrementally updated total-rows (prefix-sum /
  Fenwick over `rendered_rows`) updated on append/patch/collapse; track a
  dirty-buffer set instead of scanning all blocks per frame; rewrap from the
  first dirty line using the TextBuffer's existing dirty-range machinery.

### [Performance-03] Transcript block retention is unbounded
- **Evidence:** `native/src/transcript.rs:441-443` (append with no limit);
  each block permanently owns a `TextBuffer` + `TextView` (`:59-76`); only
  host-driven `clear_blocks` (`:347`) removes. No ADR documents unbounded
  retention as intentional (T32/T39 checked).
- **Impact:** Native RSS grows monotonically for the exact long-session
  streaming workload the product targets; contrast with the genuinely bounded
  devtools rings and text cache.
- **Effort & Risk:** Effort: M | Risk: MED (eviction must preserve anchor and
  unread semantics)
- **Confidence:** HIGH
- **Fix Sketch:** Native max-blocks/max-bytes retention knob with oldest-block
  eviction preserving anchors; document in ADR-T32/T39.

### [Architecture-01] Epic T plugin slots: palette consumer shipped but never demonstrated; devtools/theme/example slots are metadata-only
- **Evidence (corrected by follow-up investigation, see Addendum):**
  `ts/src/extensions.ts:37-59` (contribution shapes), `:118-136` (registry has
  `register`/`list` only — no `subscribe`). The palette slot IS consumed:
  `CommandPalette._sourceCommands()` exists at
  `ts/src/composites/command-palette.ts:248-264` with injection points
  (`paletteRegistry` option, `setPaletteRegistry`). However, no example or doc
  ever constructs the wire (`plugin-demo.ts` reads only its own writes), and
  each `ExtensionRegistry` owns its own `CommandRegistry`/`KeymapRegistry`
  instances (`extensions.ts:145-146`) — different from any dispatcher an app
  builds — so plugin commands never reach a running app in practice. The
  devtools/theme/example contributions are `{id, title}` label-only shapes
  with no payload a consumer could act on; Epic T's spec
  (`.constitution/tasks/completed/EPIC-T-plugin-slots.md`) shipped them
  explicitly as metadata, with example rework planned in Epic U SDK-U005.
- **Impact:** The one shipped consumer path (palette + commands + keymaps via
  `CommandDispatcher`) is undiscoverable and undemonstrated; the other three
  slots cannot drive anything until their contribution shapes carry payloads —
  planned phasing, not drift, but worth an explicit decision before GA.
- **Effort & Risk:** Effort: S (demonstrate palette/dispatcher attachment) /
  M–L (theme/devtools payloads, separate feature work) | Risk: LOW / MED
- **Confidence:** HIGH
- **Fix Sketch:** Under Epic U SDK-U005: build the attachment example
  (`new CommandDispatcher(reg.commands, reg.keymaps, app)` →
  `app.run({commandDispatcher})`; `new CommandPalette({registry: reg.commands,
  paletteRegistry: reg.palette})`) and add a `subscribe()` primitive to
  `makeRegistry()`. Treat theme-slot payloads as a follow-up spike; leave
  devtools/examples slots as metadata or drop them.

### [Performance-04] Per-frame deep clones of widget state and node fields
- **Evidence:** `native/src/render.rs:1454` (`table_state.clone()` including
  all rows), `:1354` (Select options), `:1642` (List), `:1740` (Tabs);
  `render.rs:471-478` clones `content`, `code_language`, and the `children`
  Vec for every node every frame.
- **Impact:** A 10k-row table copies all row data each frame to draw ~30
  visible rows; 100 text nodes at 60 fps ≈ 12,000 heap allocations/second on
  an idle screen.
- **Effort & Risk:** Effort: M | Risk: LOW–MED (borrow restructuring)
- **Confidence:** HIGH
- **Fix Sketch:** Split read-phase from write-phase (or split borrows) so
  renderers read state in place and slice only the visible range; use
  `std::mem::take`/restore for the recursion-carrying `children`.

### [Performance-05] Host collection props rebuild everything per signal tick; encoder churn on every string
- **Evidence:** `ts/src/jsx/reconciler.ts:446-536` — `options`/`items`/`tabs`/
  `rows` all clear-and-reinsert on any change, bound inside `effect()`
  (`:288-292`); `:394-530` (10 sites) plus `ts/src/widget.ts:385,391` — every
  string prop does `new TextEncoder().encode()` then a second copy via
  `Buffer.from`.
- **Impact:** Appending one row to a signal-bound 100×5 table re-issues ~500
  FFI calls with ~500 fresh encoders and double copies — N+1 across the exact
  boundary the project budgets.
- **Effort & Risk:** Effort: S (encoder hoist) / M (collection diffing) |
  Risk: LOW/MED
- **Confidence:** HIGH
- **Fix Sketch:** Module-level shared `TextEncoder`, pass the `Uint8Array`
  directly to the FFI ptr arg; cache last-applied arrays per handle and patch
  only deltas; longer-term propose a packed batch setter through the TechSpec
  process.

### [Test-01] Benchmark gates don't exercise any identified hot path
- **Evidence:** `ts/bench-render.ts:70-131` gates a fixed 80×24 headless scene
  of ~10 widgets; no large-terminal sweep, no transcript-at-scale bench, no
  reconciler prop-application bench. (Positive: all budgets are numerically
  enforced with `process.exit(1)`, and `check-substrate-benchmarks.ts` fails
  on missing benches — the gate style is right, the coverage isn't.)
- **Impact:** Regressions in Performance-01/02/03/04/05 pass every current
  gate; the render-budget PASS is not evidence of scaling health.
- **Effort & Risk:** Effort: M | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Add gated scaling benches: 200×50 and 300×80 render,
  transcript render/append at 1k/10k blocks, a "static frame" bench asserting
  near-zero cost once dirty-gating lands.

### [TechDebt-01] `threaded_render.rs` retained as 1,432 lines of drifting dead code after a formal No-Go
- **Evidence:** `.constitution/reports/TASK-H2-threaded-render-decision.md` =
  No-Go; `prd/out-of-scope/background-render-threading.md` confirms;
  `native/src/threaded_render.rs:24-30` opens with `#![allow(dead_code)]`;
  FFI stubs at `lib.rs:3047-3075` never start the thread; renders from
  pre-ADR-T37 `node.content`; duplicates `blend_opacity`/clip/diff helpers;
  CI never compiles the feature (`ci.yml:33`).
- **Impact:** An unmaintained parallel renderer that drifts with every
  render.rs change, shipped into the first public 0.1.0 surface; misleads
  readers about a capability that doesn't exist.
- **Effort & Risk:** Effort: S (delete) | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Delete module, feature flag, bench, and FFI stubs — git
  history plus the decision report preserve the experiment.

### [Correctness-05] Swallowed `Result`s cause silent native/host state drift
- **Evidence:** `native/src/render.rs:2007,2152-2167` (`let _ =` on transcript
  wrap/render; `y` still advances at `:2170`, corrupting anchor math for the
  rest of the frame); `native/src/event.rs:505-629` (edit applied to buffer,
  then a later sync failure returns `false` leaving `node.content`, cursor,
  undo, and the Change event unapplied); `transcript.rs:484` vs `:498`
  (patch appends, failed projection leaves `version`/`rendered_rows` stale).
- **Impact:** Real failures never surface through the 0/−1/−2 contract;
  half-applied edits and blank-rendered blocks with no diagnostic.
- **Effort & Risk:** Effort: S–M | Risk: LOW
- **Confidence:** MED–HIGH
- **Fix Sketch:** Propagate to the FFI return or at minimum `set_last_error`
  + debug trace; order mutations so sync failures can't strand a half-edit.

### [Correctness-06] Fragment reconciliation breaks native child ordering with siblings present
- **Evidence:** `ts/src/jsx/reconciler.ts:744-761` (fragment update appends
  new children to the ancestor's end, no reorder pass); `:679-687` (reorder
  loop compares fragment-local index against the ancestor's absolute native
  index). `ts/test-jsx.test.ts:620-706` covers only fragment-as-only-child.
- **Impact:** `<Box><Text/><Fragment>…</Fragment><Text/></Box>` trees that add
  fragment children during reconcile render them after trailing siblings; the
  index mismatch can trigger spurious moves that scramble sibling order.
- **Effort & Risk:** Effort: M | Risk: MED
- **Confidence:** HIGH
- **Fix Sketch:** Compute the fragment's native start offset (sum of preceding
  siblings' native child counts) and use `startOffset + i` for both comparison
  and insertion; add a fragment-with-siblings test. Related (same file): keyed
  and unkeyed children share one key namespace (`:644,654` — `key ?? i`
  collides `key={0}` with positional 0); namespace fallback keys.

### [Correctness-07] Signal writes off the input path don't wake the run loop
- **Evidence:** `ts/src/app.ts:507-538`, `ts/src/loop.ts:111-140` — in
  `onChange` mode the loop blocks in `readInput(idleTimeout)` (100 ms
  default); signal effects mutate native state synchronously but nothing
  requests a render or interrupts the wait. No `requestRender`/wake exists.
- **Impact:** Timer/async/stream-driven updates (the normal agent-console
  pattern) paint up to 100 ms late; `continuous` mode masks it at the cost of
  Performance-01's full-frame spin.
- **Effort & Risk:** Effort: M | Risk: MED
- **Confidence:** MED
- **Fix Sketch:** Expose `app.requestRender()` and have reconciler signal
  effects set a coalesced frame-dirty flag the loop checks; unblock the input
  wait (short-poll fallback or self-pipe).

### [DX-01] No single-command verification baseline; local and CI test sets diverge both ways
- **Evidence:** No justfile/Makefile/root package.json scripts; `devenv.nix:37`
  `enterShell` only sets toolchain; `ts/package.json:15` covers TS only (never
  `cargo test`), includes commands/effect (which CI skips) and excludes
  extensions (which nothing runs).
- **Impact:** No one command proves "the repo works"; local green ≠ CI green.
- **Effort & Risk:** Effort: M | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Add a devenv script (e.g. `verify`) chaining fmt-check,
  clippy, `cargo test`, the full `bun test` set, and check-bundle; make it the
  canonical mirror of CI.

### [Test-02] Golden snapshot coverage stops at 5 basic scenes
- **Evidence:** `native/fixtures/` holds 6 goldens; `assert_golden` called only
  for empty screen, single text, bordered box, nested layout, input cursor
  (`lib.rs:4123-4207`) plus one substrate buffer
  (`text_renderer.rs:677`). Zero goldens for Transcript, SplitPane, Table,
  List, Tabs, Overlay, ScrollBox, TextArea. Harness itself is sound
  (byte-for-byte diff, `GOLDEN_UPDATE=1` blessing).
- **Impact:** The visually complex widgets — the engine's core value — have
  state-level tests but no rendered-output regression protection; prerequisite
  for safely landing Performance-01.
- **Effort & Risk:** Effort: M | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Add golden scenes for transcript viewport (follow +
  scrolled-back + collapsed), splitpane, table/list/tabs, overlay stacking.

### [Deps-01] Supply-chain and reproducibility gaps ahead of first binary release
- **Evidence:** `.gitignore` excludes `Cargo.lock` (non-reproducible native
  release builds, nothing for `cargo audit` to pin); no
  `cargo audit`/`cargo deny`/Dependabot in CI; `release.yml:70,198` uses
  mutable action refs (`dtolnay/rust-toolchain@stable`,
  `softprops/action-gh-release@v2`) inside a `contents: write` job. (CI
  triggers, secrets handling, and the absence of install hooks all verified
  clean.)
- **Impact:** A repointed third-party action executes with release-asset write
  access; advisories ship silently; two release builds can differ.
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Commit `Cargo.lock` (binary-shipping convention), add
  `cargo audit` job + Dependabot (cargo, npm, actions), pin third-party
  actions to commit SHAs.

### [Deps-02] taffy is 3 majors behind (0.9 → 0.12.1)
- **Evidence:** `native/Cargo.toml:14`; latest 0.12.1 published 2026-07-03
  (verified against crates.io on audit day). Everything else is current:
  crossterm 0.29, pulldown-cmark 0.13.x, effect ^3.21, signals-core one
  trivial minor behind.
- **Impact:** Core layout engine misses correctness/perf work; 0.10–0.12
  carried breaking style/measure API changes, so the gap compounds.
- **Effort & Risk:** Effort: M–L | Risk: MED
- **Confidence:** HIGH
- **Fix Sketch:** Dedicated migration spike for `layout.rs`; do not auto-bump.

### [TechDebt-02] Dual text authority: `node.content` vs TextBuffer substrate
- **Evidence:** `native/src/render.rs:75-131` (per-frame clone + full-content
  string equality per Text node), `:606-611` (TextArea copies whole buffer to
  String per frame), `native/src/event.rs:476-481` (whole-content copy + line
  split per keystroke), `native/src/lib.rs:185-205` (cursor clamped against
  `node.content` while snapshots treat the buffer as authority — business
  logic in lib.rs, contra the zero-logic rule).
- **Impact:** O(content) per keystroke/frame defeating ADR-T37's epoch design;
  two clamping semantics that can disagree.
- **Effort & Risk:** Effort: L | Risk: MED
- **Confidence:** HIGH
- **Fix Sketch:** Make TextBuffer sole authority for TextArea/Input; replace
  string-equality gates with content-epoch compares; move clamp helpers into
  `textarea.rs`.

### [TechDebt-03] Duplicate event loops; examples bypass the public API
- **Evidence:** `ts/src/app.ts:495-543` vs `ts/src/loop.ts:86-141` — same
  drain/dispatch/render body maintained twice, already diverged (audit mode
  only in loop.ts, signal handlers only in app.ts). Examples:
  `examples/system-monitor.ts:876,883,1116-1150`,
  `examples/migration-jsx.tsx:211-238` call raw `ffi.*`; 8 examples duplicate
  init/loop/shutdown boilerplate; several import `../ts/src/jsx/jsx-runtime`
  or `../ts/src/widget` internals.
- **Impact:** Loop fixes land in one copy; examples — the public teaching
  surface for the npm launch — teach patterns impossible against the published
  package and reveal missing wrapper getters (`getContent`, `getParent`,
  `Select.getSelected`).
- **Effort & Risk:** Effort: M | Risk: LOW–MED
- **Confidence:** HIGH
- **Fix Sketch:** Implement `Tuvren.run()` as a thin delegate over
  `createLoop`; add the missing read-back wrappers; extract
  `examples/_shared/runExample()`; migrate example imports to the package
  entry before PUB-V006.

### [Performance-06] Text cache LRU is O(n) per access; parse cache keyed per wrap-width
- **Evidence:** `native/src/text_cache.rs:30-43,57-63` (linear
  `lru_order.iter().position()` per hit/insert — byte-bound eviction itself is
  verified real); `native/src/text.rs:103-110` (parse key includes
  `wrap_width` though parsing is width-independent → same content stored N
  times for N widths).
- **Impact:** Every cache hit on a text-heavy frame pays O(entries); duplicate
  entries burn the 8 MiB budget.
- **Effort & Risk:** Effort: M | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Use the existing `last_access_tick` for lazy min-tick
  eviction (or an intrusive LRU); drop `wrap_width` from the parse key.

### [DX-02] Failure diagnostics gaps at both ends of the FFI
- **Evidence:** `ts/src/ffi.ts:803` — raw `dlopen` unwrapped, so
  resolved-but-unloadable binaries (arch mismatch, missing glibc symbol)
  bypass the rich resolver diagnostics in `diagnostics.ts`;
  `native/src/lib.rs:100-179` — every panic becomes the literal string
  `"internal panic"` (payload discarded); `lib.rs:2849-2851` — interior-NUL
  error messages return null, indistinguishable from "no error".
- **Impact:** The most common real-world install failure and every `-2` are
  undiagnosable — poor DX exactly where EPIC-V consumers land.
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** try/catch the `dlopen` and re-throw through
  `formatLoadError`; downcast panic payloads into the error message; replace
  interior NULs before `CString::new`.

### [Test-03] Substrate gate suite overclaims; legacy test-only code gives false coverage
- **Evidence:** `native/src/substrate_gates.rs:6-28` admits G1/G4 are
  source-review-only and G2 deferred, while `native/CLAUDE.md` claims the
  module enforces "every §5.4.1 invariant by named native test"; G3
  (`:392-429`) is a string-grep defeated by renaming; G8 (`:383-389`) is a
  `size_of > 0` tautology. Separately `render.rs:1215-1297` keeps ~140 lines
  of `#[cfg(test)]`-only legacy wrap/cursor code whose green tests assert
  nothing about the shipped substrate path. Also untested end-to-end: the `-2`
  panic return from the TS side (`ts/src/errors.ts:26` handles it; no test
  produces it).
- **Impact:** Documented enforcement is partly human review; dead-algorithm
  tests inflate confidence; half the documented return-code contract is
  unverified.
- **Effort & Risk:** Effort: M | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Align CLAUDE.md wording with the honest docstring, promote
  G1/G4 or mark them manual; delete legacy helpers and port cases onto
  `text_view::compute_visual_lines`; add one TS test driving a `-2`.

### [Correctness-08] Small-correctness batch
- **Evidence & Impact:**
  - `ts/src/widget.ts:55-62` + `ts/src/jsx/reconciler.ts:280-282` — imperative
    `destroy()` never clears the module-level `eventRegistry`; stale entries
    block re-registration and can fire the wrong handler if native recycles
    `u32` handles. (Effort S, Risk LOW, Confidence MED)
  - `ts/src/widgets/box.ts:26-27` et al — falsy guards (`if (options.width)`)
    silently drop `width: 0`; JSX path only skips `undefined`. (S/LOW/HIGH)
  - `ts/src/app.ts:531-533` — a rejected command handler propagates out of
    `run()` with the terminal still in raw/alt-screen mode; the most common
    first-run failure for adopters. (S/LOW/MED)
  - `native/src/lib.rs:965,974` — table column `count: u32` unbounded →
    multi-GB self-DoS allocation from a buggy host. (S/LOW/MED)
  - `native/src/render.rs:1197` vs `text_renderer.rs:175` — four width
    implementations with a real `.max(1)` divergence: Input cursor column
    disagrees with the substrate renderer for combining marks. (S/LOW/HIGH)
- **Fix Sketch:** Registry-clear hook on destroy; normalize guards to
  `!= null`; best-effort shutdown on dispatch rethrow; clamp column counts;
  consolidate width measurement into one `text_buffer.rs` helper.

### [DX-03] Tooling batch
- **Evidence:** No biome/eslint/prettier config anywhere; `devenv.nix`
  git-hooks run clippy+rustfmt on `\.rs$` only (no `tsc --noEmit`/format for
  TS); no `Swatinem/rust-cache` in any of 6+ CI jobs; `ts/tsconfig.json` is
  `strict` but lacks `noUncheckedIndexedAccess` (relevant for manual FFI
  struct unpacking).
- **Impact:** Public-SDK surface has no style gate; TS errors surface only in
  CI; every CI job cold-compiles.
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Add Biome + TS git-hook entries mirroring the Rust hooks;
  add rust-cache; enable `noUncheckedIndexedAccess` and clean up fallout.

### [Docs-01] Doc-drift batch (low, post-Epic-T staleness)
- **Evidence:** 4 native fns shipped with no host binding or doc note
  (`tui_scroll_set_scrollbar_side/width/show_scrollbar`, `tui_set_z_index` —
  grep of `ts/src/` = 0 hits); `edit_buffer.rs` missing from native/CLAUDE.md
  module map; `extensions.ts` + `devtools/` missing from ts/CLAUDE.md file
  map; `test-extensions.test.ts` and `examples/plugin-demo.ts` absent from
  every command list/README tier; CLAUDE.md FFI template shows
  `#[unsafe(no_mangle)]` while code uses `#[no_mangle]`. (Verified clean: no
  `kraken` residue, no stale `docs/` tree, no undocumented required env vars.)
- **Impact:** Agents and contributors routed by the constitution miss the
  newest surfaces; four ready-made native capabilities sit unreachable.
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** One docs pass adding the missing rows/commands; bind the 4
  functions (see direction suggestion 3) or mark them internal.

### [TechDebt-04] `examples/opencode-client/` is an empty untracked scaffold
- **Evidence:** Only empty directories (`src/app/widgets/`, `test/fixtures/`);
  `git ls-files` returns nothing; referenced by no doc.
- **Impact:** Misleads readers into thinking an OpenCode integration exists;
  violates the Brownfield-truth doc rule.
- **Effort & Risk:** Effort: S | Risk: LOW
- **Confidence:** HIGH
- **Fix Sketch:** Build it or delete it — see direction suggestion 2.

## Verified-Clean Surfaces

Worth recording so future audits don't re-tread: credential hygiene (no
secrets, no committed .env, no install hooks in any manifest); OSC52/OSC8
validation (size-bounded, terminator-smuggling blocked, scheme allowlist,
multiplexer gating); FFI pointer discipline (null/len guards, UTF-8
validation, clamped copy-outs); no shell-outs anywhere in build/install
scripts; CI trigger model (`pull_request` with `contents: read`); resolver
source-build fallback correctly gated to repo checkouts; extension registry
error isolation and disposable rollback; Effect layer leak hygiene; devtools
ring bounds and text-cache byte-bound eviction both verified true in code; no
prompt-injection or agent-steering content anywhere in the repo.

## Product & Feature Direction Suggestions

1. **Ship "streaming-scale" as a named engineering epic before GA.**
   Findings Performance-01/02/03 plus Correctness-03 all cap the same PRD
   promise: long agent sessions with large transcripts
   (`.constitution/tasks/critical-path.md` §2 names transcript-heavy products
   the flagship proof workload). The fixes share machinery (prefix-sums,
   dirty gating, retention bounds) and share a verification story (the scaling
   benches of Test-01 and the goldens of Test-02 land first, then the
   optimizations land behind them). Evidence: `transcript.rs:134-141,441-443`,
   `render.rs:328-416`, `context.rs:31`.
2. **Decide the OpenCode client's fate — build the agentic flagship or delete
   the scaffold.** `examples/opencode-client/` is empty while the critical
   path explicitly positions agent consoles as the harshest proof workload. A
   real client exercising TranscriptView + SplitPane + CommandPalette + the
   Effect surface would be the strongest launch asset and would force the
   plugin-slot wiring (Architecture-01) to become real. Fold into Epic U
   SDK-U005 or remove the directory.
3. **Give Epic U an early win by binding the four orphaned native functions.**
   `tui_scroll_set_scrollbar_side/width/show_scrollbar` and `tui_set_z_index`
   are implemented, tested natively, and unreachable from TS — exactly the
   wrapper gap SDK-U003 describes. The hard native half is done; only thin
   `ScrollBox` options and an overlay `zIndex` prop remain.

## Addendum: Deep-Dive Investigations (same day)

Three findings originally rated "worth exploring" were investigated with
dedicated read-only design assessments. Updated verdicts:

### A1. Event-loop unification (`app.run()` vs `createLoop()`) — upgraded to **Strong**
The two loop bodies (`ts/src/app.ts:495-543`, `ts/src/loop.ts:78-148`) are
behaviorally identical except four adapter-level concerns: audit mode
(loop-only), SIGINT/SIGTERM handlers (app-only), `debugOverlay` (app-only),
try/finally lifecycle (app-only). Proposed design: shared `runLoopCore` in
`loop.ts` (existing acyclic import direction), with `createLoop` and
`Tuvren.run` as thin adapters preserving both public option types and the
`{start, stop}` shape that `test-examples.test.ts:140` pins. Side benefit:
`app.run()` gains audit mode, eliminating the hand-rolled audit branch in
`examples/effect-counter.tsx:101-125`. Note `dev.ts:73-84` installs a second
SIGINT handler on top of app.run's — resolve during unification.
The related wake seam is feasible **host-only**: the sole input primitive is
`tui_read_input(timeout_ms)` (blocking crossterm poll on stdin, no interrupt),
so a `requestRender` flag checked at top-of-loop plus a capped idle timeout
bounds latency without native changes. A native self-pipe waker
(`tui_wake()`) is Speculative — defer unless the ≤idleTimeout latency proves
to matter. Effort: S–M; Risk: LOW; existing `test-runner.test.ts` +
`test-effect.test.ts:704-794` coverage pins the behavior.

### A2. FFI codec/delta adapter — split verdicts, core upgraded to **Strong**
Verified facts: all string symbols are `(handle, ptr, byte_len)`
length-delimited (no NUL needed); native copies synchronously inside the call
(`lib.rs:566-569`, `:1094-1097`), so shared/scratch buffers are safe; bun:ffi
accepts bare `Uint8Array` for `ptr` args (already done for `Int32Array` at
`reconciler.ts:462-464`), so every `Buffer.from` is a pure removable copy.
- **(a) Encoder hoist — Strong, Effort S.** Module-level `TextEncoder`, pass
  the `Uint8Array` directly, at ~30 sites. Zero ABI change; halves hot-path
  allocations.
- **(b) Host-side delta layer — Strong for Table, Effort M.** Table already
  has a complete per-index ABI (`insert_row`/`remove_row`/`set_cell`);
  diffing turns the 100×5-one-cell-changed case from 601 FFI calls + ~1000
  allocations into 1 + 1 (~600×). Cache last-applied arrays on the reconciler
  `Instance` (not a handle-keyed global — imperative mutation of JSX-owned
  handles would silently desync it), and ensure the cache survives
  `updateResolvedInstance`'s effect disposal/re-creation
  (`reconciler.ts:776-784`) — the subtlest correctness point.
- **(c) Native ABI completion — Worth exploring, Effort M.** List/Select/Tabs
  lack `set@idx`/`insert@idx` (six small mirror functions would complete
  them). A bulk packed-buffer batch ABI remains **Speculative** — the delta
  layer removes most of its motivation.

### A3. Plugin-slot wiring — rescoped (see corrected Architecture-01)
The original finding overstated the gap: the palette consumer shipped in Epic
T (EXT-T004); the missing piece is the attachment example and a
`subscribe()` registry primitive (**Strong, Effort S**, fits Epic U
SDK-U005). Theme-slot wiring is **Worth exploring** (Effort M–L: contribution
shape must carry a `Theme` handle/builder, plus native-handle disposal on
deactivation). Devtools-slot wiring is **Speculative** (needs a panel host
that doesn't exist and richer shapes). The examples slot has no sensible
runtime consumer — leave as catalog metadata or drop.
