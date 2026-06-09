# Epic M — Native Text Substrate (CORE)

**Epic Status:** SHIPPED (archived)

---

## Epic M Summary

Epic M delivered the native text substrate foundation: a contract memo, `TextBuffer` with chunked storage and dirty ranges, `TextView` with viewport/wrap projections, the unified text renderer, and a Unicode/wrapping test gate suite.

## Key Capabilities Delivered

- TextBuffer with content epochs, line-start markers, dirty ranges, cached width metrics, grapheme boundaries, tab expansion, style spans, selection ranges, highlights
- TextView with visual lines, soft-wrap cache keyed by (content_epoch, wrap_width, wrap_mode, tab_width, style_fingerprint, viewport_rows), scroll, cursor mapping, stable anchors
- Unified text renderer handling clipping, wide chars, combining marks, ZWJ emoji, CJK width, tab expansion, selections, highlights, cursor
- Native test gate suite for grapheme, wcwidth, wrap, tab, resize, cursor, selection, ZWJ emoji, CJK, zero-width codepoints, wide-glyph clipping

## Shipping Metrics

- 5 tickets completed (CORE-M0 through M4)
- 28 Story Points total

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| CORE-M0 | Spike Native Text Substrate Contract | Spike | 2 SP |
| CORE-M1 | Implement Native TextBuffer | Feature | 8 SP |
| CORE-M2 | Implement Native TextView Projection | Feature | 8 SP |
| CORE-M3 | Implement Unified Native Text Renderer | Feature | 5 SP |
| CORE-M4 | Add Unicode and Wrapping Native Test Gate | Chore | 5 SP |

---

## Verbatim Ticket List (from Tasks.md v7.2)

### Epic M — Native Text Substrate (CORE)

**CORE-M0 Spike Native Text Substrate Contract**
- **Type:** Spike
- **Effort:** 2
- **Dependencies:** None
- **Capability / Contract Mapping:** TechSpec ADR-T37, §3.4, §4.4
- **Description:** Time-box the substrate contract before implementation begins. Lock the `TextBuffer` mutation API, content-epoch model, dirty-range semantics, `TextView` cache-key shape, `EditBuffer` operation list, and the ABI ownership and copy semantics for each surface. Emit a contract memo that downstream tickets reference.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the active CORE wave is ratified
When the spike is closed
Then a TextBuffer mutation contract, TextView cache-key contract, and EditBuffer operation list are documented
And ABI handle ownership and copy semantics for each surface are decided
And open structural questions that block CORE-M1 are listed explicitly or marked resolved
```

**CORE-M1 Implement Native TextBuffer**
- **Type:** Feature
- **Effort:** 8
- **Dependencies:** CORE-M0
- **Capability / Contract Mapping:** TechSpec ADR-T37, §3.4, §4.4 `text_buffer`
- **Description:** Implement chunked or rope-style content storage with content epochs, line-start markers, dirty ranges, cached width metrics, grapheme boundaries, tab expansion policy, style spans, selection ranges, and highlights. Expose the documented `tui_text_buffer_*` ABI surface in `lib.rs` through `ffi_wrap` / `ffi_wrap_handle` entry points.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a freshly created TextBuffer
When content is appended and a byte range is replaced
Then the content epoch increases monotonically per mutation
And dirty ranges identify only the affected region
And line-start markers, grapheme counts, and width metrics stay consistent with the stored content

Given a TextBuffer with style spans, selection ranges, and highlights set
When the underlying byte range is replaced
Then ranges are reconciled against the new content
And invalid handles or out-of-range byte offsets return the documented error semantics
```

**CORE-M2 Implement Native TextView Projection**
- **Type:** Feature
- **Effort:** 8
- **Dependencies:** CORE-M1
- **Capability / Contract Mapping:** TechSpec ADR-T37, §3.4, §4.4 `text_view`
- **Description:** Implement the viewport / wrap projection over `TextBuffer`. Visual lines, soft-wrap cache keyed by `(content_epoch, wrap_width, wrap_mode, tab_width, style_fingerprint, viewport_rows)`, scroll row and column, cursor mapping, byte-grapheme-cell-visual-row conversions, horizontal scroll, resize invalidation, and stable anchors.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a TextView over a stable TextBuffer
When wrap width or viewport rows change
Then only the affected wrap-cache entries are invalidated
And the underlying buffer epoch and metrics remain unchanged

Given a TextView with an active cursor
When buffer content above the cursor is replaced
Then byte to visual mapping reflects the new content
And the view's stable anchors remain inside the buffer's valid byte range

Given a resize event that changes viewport width
When the view recomputes
Then visual lines are re-wrapped without invalidating buffer storage
```

**CORE-M3 Implement Unified Native Text Renderer**
- **Type:** Feature
- **Effort:** 5
- **Dependencies:** CORE-M2
- **Capability / Contract Mapping:** TechSpec ADR-T37, §5.4.1
- **Description:** Implement the single text-rendering path that draws a `TextView` into Kraken's existing cell buffer. One implementation handles clipping, wide chars, combining marks, ZWJ and emoji, CJK width, tab expansion, selections, highlights, cursor rendering, and style merging. Add golden coverage for the renderer.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a TextView containing mixed-width Unicode content
When the unified renderer draws into a clipped region
Then wide glyphs do not split across the clip boundary
And combining marks render attached to their base grapheme
And selections, highlights, and the cursor layer with correct precedence

Given an existing widget that previously hand-rolled text rendering
When the widget is migrated to the unified renderer
Then golden snapshots match the documented baseline
And no widget-local code computes wrapped row counts
```

**CORE-M4 Add Unicode and Wrapping Native Test Gate**
- **Type:** Chore
- **Effort:** 5
- **Dependencies:** CORE-M3
- **Capability / Contract Mapping:** TechSpec §5.4.1
- **Description:** Add a native test suite under `cargo test` covering grapheme segmentation, `wcwidth` behavior, soft-wrapping, tab expansion, resize-driven wrap invalidation, cursor mapping, selection across grapheme boundaries, ZWJ emoji, CJK width, zero-width codepoints, and wide-glyph clipping. Each gate listed in TechSpec §5.4.1 must be enforced by at least one named native test.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the substrate test suite
When cargo test runs in the native crate
Then grapheme, wcwidth, wrap, tab, resize, cursor, and selection edge cases are covered by named tests
And each structural gate listed in TechSpec section 5.4.1 is enforced by at least one native test
And the suite fails when any documented Unicode behavior regresses
```

---

## Brownfield Note

ADR-T37 (Native Text Substrate) shipped under Epic M. The `TextBuffer` in `native/src/text_buffer.rs` provides content storage with flat-`String` backing, content epochs, dirty ranges, line-start markers, grapheme boundaries, tab expansion, style spans, selection ranges, and highlights. `TextView` in `native/src/text_view.rs` provides viewport/wrap projections keyed by `(content_epoch, wrap_width, wrap_mode, tab_width, style_fingerprint, viewport_rows)`. The unified text renderer in `native/src/render.rs` handles all text drawing. `native/src/substrate_gates.rs` enforces the §5.4.1 Unicode/wrapping structural gates.
