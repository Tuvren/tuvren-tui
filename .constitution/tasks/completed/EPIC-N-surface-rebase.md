# Epic N — Substrate Surface Rebase (CORE)

**Epic Status:** SHIPPED (archived)

---

## Epic N Summary

Epic N migrated existing surfaces (Text, Markdown, code spans, TextArea with EditBuffer-based undo, transcript blocks) onto the native text substrate, re-evaluated CodeView and DiffView posture, and added substrate replay, golden, and append-cost coverage gates.

## Key Capabilities Delivered

- Text, Markdown, and code-style span rendering migrated onto TextBuffer/TextView with unified renderer
- TextArea rebased onto EditBuffer + TextView with O(1) operation-history undo
- Transcript block content rebased onto TextBuffer with visible-block TextView projections
- CodeView/DiffView re-evaluated against new substrate
- Substrate replay, golden, and append-cost benchmark coverage

## Shipping Metrics

- 5 tickets completed (CORE-N1 through N5)
- 29 Story Points total

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| CORE-N1 | Rebase Text, Markdown, and Code Spans Onto Substrate | Feature | 5 SP |
| CORE-N2 | Rebase TextArea Onto EditBuffer and TextView | Feature | 8 SP |
| CORE-N3 | Rebase Transcript Block Content Onto Substrate | Feature | 8 SP |
| CORE-N4 | Re-Evaluate CodeView and DiffView Posture | Chore | 3 SP |
| CORE-N5 | Add Substrate Replay, Golden, and Append-Cost Coverage | Chore | 5 SP |

---

## Verbatim Ticket List (from Tasks.md v7.3)

### Epic N — Substrate Surface Rebase (CORE)

**CORE-N1 Rebase Text, Markdown, and Code Spans Onto Substrate**
- **Type:** Feature
- **Effort:** 5
- **Dependencies:** Substrate foundation (Epic M, shipped)
- **Capability / Contract Mapping:** TechSpec ADR-T37, §5.4.1
- **Description:** Migrate `Text`, `Markdown`, and code-style span rendering paths onto `TextBuffer` content and `TextView` projections drawn through the unified renderer. Remove ad-hoc width and wrap math from the migrated widgets. Public host API for these widgets remains unchanged. Each migrated surface adds a substrate-routing assertion (e.g. inspecting that the widget's render path calls `text_renderer::render_text_view` rather than recomputing geometry) so the §5.4.1 G3/G4 gates have behavioral coverage and not just visual goldens. Search-match highlight colors emitted via `tui_text_buffer_set_highlight` route through the active theme rather than the hard-coded `highlight_kind_bg` palette in the renderer; this avoids a follow-on visual regression once Markdown and code-search surfaces start using highlights.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Text or Markdown widget
When its content is set or replaced through the existing host API
Then the widget stores its content in a TextBuffer and its projection in a TextView
And no widget-local code computes wrapped row counts
And the widget's render path is asserted (by test, not by review) to call text_renderer::render_text_view

Given existing widget golden snapshots
When the migrated widgets render the same content
Then snapshots match the documented baseline

Given a search-match or syntax highlight applied via tui_text_buffer_set_highlight
When the surface renders under a non-default theme
Then the highlight background routes through theme bindings rather than the renderer's v1 hard-coded palette
```

**CORE-N2 Rebase TextArea Onto EditBuffer and TextView**
- **Type:** Feature
- **Effort:** 8
- **Dependencies:** Substrate foundation (Epic M, shipped)
- **Capability / Contract Mapping:** TechSpec ADR-T38, §3.4, §4.4 `edit_buffer`
- **Description:** Move `TextArea` state onto an `EditBuffer` wrapping a `TextBuffer` with a `TextView` projection. Replace the existing snapshot-based undo and redo with an operation history plus coalescing rules for ordinary single-edit operations. Preserve the host `TextArea` public API and the existing keyboard behavior. Adds a substrate-routing assertion that `TextArea::render` reaches `text_renderer::render_text_view` (G3/G4 behavioral coverage) so a future regression that reintroduces widget-local wrap math fails in CI rather than slipping past G3's name-based source grep.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a TextArea editing several pages of content
When the user performs ordinary single-character insertions and deletions
Then operation history grows in O(1) per edit
And no full-content snapshot is stored for those edits
And undo and redo recover the prior cursor and selection state

Given the existing TextArea host wrapper and keyboard tests
When the rebased widget is loaded
Then the public host API and keyboard behavior remain unchanged from the prior TechSpec contract

Given the rebased TextArea
When its render path is exercised in tests
Then a behavioral assertion confirms the widget routes through text_renderer::render_text_view
```

**CORE-N3 Rebase Transcript Block Content Onto Substrate**
- **Type:** Feature
- **Effort:** 8
- **Dependencies:** Substrate foundation (Epic M, shipped); CORE-N5 append-cost benchmark must exist before this rebase ships (see "Pre-Rebase Performance Gate" below)
- **Capability / Contract Mapping:** TechSpec ADR-T39, §3.4
- **Description:** Replace `TranscriptBlock.content: String` with `TextBuffer`-backed segment storage. Render visible blocks through `TextView` projections via the unified renderer. `append_block`, `patch_block`, and `finish_block` mutate the buffer through the substrate API and bump the corresponding epoch. Transcript-specific state (`anchor_kind`, `follow_mode`, unread anchors, collapse state, parent and hierarchy, role coloring) is unchanged. The host `TranscriptView` public API stays stable. The rebase wires `tui_text_buffer_clear_dirty_ranges` into the per-frame render path so `dirty_ranges` does not grow unbounded across the session lifetime, and adds a substrate-routing assertion that the transcript visible-block render reaches `text_renderer::render_text_view`.
- **Pre-Rebase Performance Gate:** The shipped substrate stores buffer content in a flat `String` and `recompute_line_metadata` rescans the entire content per mutation, so per-token streaming `append` is O(N) and cumulative cost is O(N²) in buffer size. Transcript streaming is the headline workload that this rebase will lean on, so before this rebase merges, the CORE-N5 benchmark gate (see below) must report append cost as a function of buffer size; if the curve is unacceptable, this ticket is blocked on incremental line-metadata invalidation in `text_buffer.rs` (separate ticket if needed) before proceeding.
- **Open Contract Question — Dirty-Range Scope:** `DirtyRange` records only the post-replacement extent (`[start, start + payload.len())`). For a shrinking edit such as `replace_range(0, 6, "x")` the dirty list reports `[0, 1)` and not the removed `[1, 6)` tail. This is sufficient for cache-invalidation consumers (wrap cache is keyed by `content_epoch` + geometry, so any mutation invalidates the whole projection), but it is NOT sufficient if a consumer wants incremental cell-level repaint. Before this rebase merges, decide explicitly: either keep the cache-invalidation-only contract (matches today's whole-frame redraw) and document it on the consumer site, or propose an ADR-T39 amendment that extends `DirtyRange` with both pre- and post-replacement extents. The decision is logged on the rebase commit so future reviewers see the deliberate choice.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a streaming transcript with a visible reading position
When patch_block append operations arrive
Then only the affected block's TextBuffer epoch advances
And the visible-block render path does not clone block content into a temporary owned String

Given the canonical transcript replay fixtures (append, patch, collapse, unread, resize, detach)
When the rebased transcript runs them
Then anchor, follow, unread, and collapse behavior matches the prior fixture outputs
And the host TranscriptView public API behaves identically to the pre-rebase contract

Given the CORE-N5 append-cost benchmark
When CORE-N3 ships
Then the recorded append-cost-vs-buffer-size curve is documented and within the bound CORE-N5 establishes

Given a long-running transcript session that issues thousands of append / patch operations
When the per-frame render path runs
Then tui_text_buffer_clear_dirty_ranges is called once per buffer per frame
And dirty_ranges memory stays bounded across the session
```

**CORE-N4 Re-Evaluate CodeView and DiffView Posture**
- **Type:** Chore
- **Effort:** 3
- **Dependencies:** CORE-N1, CORE-N3
- **Capability / Contract Mapping:** TechSpec ADR-T35, ADR-T37
- **Description:** Re-run the host-composite-versus-native-promotion question for `CodeView` and `DiffView` against the new substrate. Update `docs/reports/code-diff-native-measurement.md` with substrate-era measurements and a recommendation. If the recommendation changes the prior posture, propose an ADR update to TechSpec.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the new substrate is in use by Text, Markdown, and Transcript surfaces
When CodeView and DiffView are exercised on representative content
Then a written measurement exists describing whether native promotion is warranted post-substrate
And the recommendation is reflected in TechSpec ADR status if it changes the prior posture
```

**CORE-N5 Add Substrate Replay, Golden, and Append-Cost Coverage**
- **Type:** Chore
- **Effort:** 5
- **Dependencies:** CORE-N1, CORE-N2, CORE-N3
- **Capability / Contract Mapping:** TechSpec §5.4.1, ADR-T36
- **Description:** Add replay and golden coverage for substrate-driven surfaces: large transcripts, long code blocks, nested scroll, collapse and expand, tail-follow, resize-driven wrap invalidation, and selection and cursor overlays. Existing flagship example replay tests in `ts/test-examples.test.ts` stay green. Add a Criterion benchmark gate in `native/benches/` (or extend an existing one) that measures `tui_text_buffer_append` cost as a function of pre-existing buffer size at 1 KiB, 16 KiB, 256 KiB, and 4 MiB. The benchmark output goes into `docs/reports/` so the curve is reviewable, and CORE-N3's pre-rebase gate consumes it. The same benchmark file also measures `tui_text_view_set_cursor` and `tui_text_view_byte_to_visual` as a function of the offset's distance from byte 0, so the wave-4 grapheme-boundary scan (currently bounded but still O(prefix-length)) is measured before transcript-tail interactions ship. If the curve is unacceptable, the optimization is "scan from the containing line via `line_starts` instead of from byte 0", tracked as a separate ticket.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the substrate-driven Text, TextArea, and Transcript surfaces
When the replay and golden suite runs in CI
Then large-transcript, long-code, nested-scroll, collapse and expand, tail-follow, resize, and selection and cursor scenarios all pass
And the existing flagship example replay tests in ts/test-examples.test.ts remain green
And any regression in the structural gates listed in TechSpec section 5.4.1 fails the suite

Given a Criterion benchmark of tui_text_buffer_append at increasing buffer sizes
When the benchmark runs locally and in CI
Then the recorded append-cost-vs-buffer-size curve is published under docs/reports/
And the curve sets the bound that CORE-N3's pre-rebase gate enforces

Given a Criterion benchmark of tui_text_view_set_cursor and tui_text_view_byte_to_visual at increasing prefix lengths
When the benchmark runs
Then the grapheme-boundary scan cost as a function of offset is published under docs/reports/
And the curve informs whether the line-bounded scan optimization is required before transcript-tail interactions ship
```