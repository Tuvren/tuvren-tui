# Changelog

Local Stage 3 Changelog. Tracks semantic versioning for the TechSpec layer.

---

## v8.1.0

- Bumped host bundle budget from 75KB to 100KB across `check-bundle.ts`, `test-runner.test.ts`, CI workflow, README, GatePolicy, PRD, and TechSpec to reflect framework growth from Epics R–T.

## v8.0.0

- Ratified pre-GA plugin slot contract (Epic T): bounded extension contribution types (`CommandRegistry`, `KeymapRegistry`, palette, devtools, themes, examples), `ExtensionDiagnostic`, and `ExtensionContext` with `Pick<KeymapRegistry, "register" | "resolve">` to withhold `setRegistry` from extensions.

## v7.9.0

- Executed Epic S with the clarified package-first scope: `tuvren-tui/effect` now exposes a package-first authoring surface with `render()` / `testRender()`, JSX runtime exports, package-owned commands and keybindings, keyboard and terminal-size hooks, component tokens, retained advanced lifecycle helpers, updated package coverage, and a package-first `effect-counter.tsx` example over the same native runtime authority.

## v7.8.0

- Marked Epic R shipped: `CommandRegistry`, `KeymapRegistry`, and `CommandDispatcher` implemented in the Host Layer; `CommandPalette` rebased to consume the registry; `commandDispatcher` option wired into `app.run()` and `createLoop()`; 46 focused command/keymap tests added.

## v7.7.0

- Extended the implementation contract through Epics R-V: command/keymap services, Effect integration, pre-GA plugin slots, SDK productization, and first public npm publish as `0.1.0`.

## v7.6.0

- Activated the next productization contract: future public naming moves to Tuvren, native distribution moves toward auxiliary scoped platform packages behind one public package, and command/keymap plus Effect direction are recorded as the next framework-expansion path.

## v7.4.1

- Landed Epic O Brownfield updates: native terminal capability state, diagnostic query APIs, write-only OSC52, OSC8 text-buffer link spans, Kitty keyboard disambiguation negotiation, and conservative multiplexer degradation are now implemented.

## v7.4.0

- Activated the Epic O terminal-capability contract: capability discovery becomes detection-first, OSC52 is write-only, OSC8 hyperlinks are range-scoped, Kitty keyboard support is negotiated, and multiplexer variance is an explicit implementation concern.

## v7.3.2

- Closed the last Epic N contract drift: `EditBuffer` coalescing and substrate-backed text surfaces are now documented as shipped Brownfield reality rather than pending target state.

## v7.3.1

- Completed the substrate authority cut for Epic N: transcript blocks now store substrate handles instead of mirrored mutable strings, the substrate benchmark suite is a first-class native gate, and the pre-public contract no longer preserves backward compatibility for its own sake.

## v7.3.0

- Reshaped Epic N around Brownfield reality: dirty ranges now record both pre- and post-replacement extents, the substrate benchmark gate explicitly lands before transcript rebase, and the getter ceiling notes now match the shipped explicit-overflow behavior.

## v7.2.11

- Tightened the substrate ABI and transcript rebase contract: oversized `usize` values now fail explicitly instead of truncating, and dirty-range semantics are documented as a deliberate CORE-N3 decision point rather than an implicit behavior.

## v7.2.10

- Reconciled ADR-T37 and the spike memo with the shipped substrate reality: flat-`String` backing is the current contract, the borrowed-`&str` payload path is authoritative, and the host FFI surface is mechanically exercised end to end.

## v7.2.9

- Fixed `tui_text_view_get_cache_epoch` to refresh projections before reporting cache state and aligned the spike memo with the shipped one-copy payload path.

## v7.2.8

- Wired the substrate ABI into the Bun FFI symbol table: every `tui_text_buffer_*` and `tui_text_view_*` substrate symbol is now listed in the §4.4 status-returning error-model entry; `tui_text_buffer_clear_dirty_ranges` is added to the drain API.

## v7.2.7

- Two renderer correctness fixes: (1) cursor suppression at a soft-wrap boundary now also checks that the next visual row is within the rendered window; (2) tabs now excluded from the wide-glyph `glyph_clipped` path so clipped tab cells inside the rect are painted with the merged style.

## v7.2.6

- Two correctness fixes plus three hot-path optimizations: (1) `wrap_segment` recomputes tab advance after wrap reset; (2) cursor mapping agrees across `set_cursor`, `byte_to_visual`, and `ensure_projection` for word-wrap consumed-whitespace gaps; (3) `render_text_view` reads projection by reference instead of cloning; (4) `clear_last_error` peeks under a read lock first; (5) `read_utf8_payload` returns `&str` instead of `String` for single-copy boundary.

## v7.2.5

- Three substrate correctness fixes: `wrap_segment` now recomputes `run_col` after wrap-reset; renderer no longer double-draws cursor at soft-wrap boundary; left-clipped wide glyphs and tabs now fill visible trailing cells. Added `tui_text_buffer_clear_dirty_ranges` consumer drain ABI.

## v7.2.4

- Documents the implicit `u32::MAX` ceiling on substrate getters; renderer cursor `UNDERLINE` restricted to primary cell; word-wrap no longer emits phantom zero-length visual rows after consumed inter-word whitespace.

## v7.2.3

- Substrate FFI clears `last_error` on every successful call; `byte_to_visual` and `set_cursor` both reject non-grapheme offsets; unified renderer fills every cell a tab grapheme advances through with the merged cell style.

## v7.2.2

- Documents the substrate value-returning getters error model (return `0` on error, diagnostic via `tui_get_last_error()`); added explicit cursor-reconciliation invariant for width-changing buffer edits.

## v7.2.1

- Reconciled §3.4 storage shape with shipped flat-`String` `TextBuffer`; tightened §5.4.1 G3 row to describe the name-based source-grep gate.

## v7.2.0

- Promoted Native Text Substrate sections from target state to current Brownfield reality: `TextBuffer`, `TextView`, and unified text renderer have shipped under Epic M; `EditBuffer` remains target state pending CORE-N2.

## v7.1.0

- Ratified the Native Text/Cell/View Substrate scope: added ADRs for substrate ownership, operation-based edit history, transcript content backing, and deferral of terminal capability hardening; added state, ABI, and structural acceptance gates for `TextBuffer`, `TextView`, and `EditBuffer`.

## v7.0.0

- Converted the prior forward-looking delta spec into the canonical brownfield implementation contract and reconciled transcript, devtools, split-pane, and flagship-example scope with the current source tree.

## v6.0.0

- Reoriented the next planned phase around transcript-first UX, developer tooling, minimal native expansion, and flagship examples for developer and agent workflows.
