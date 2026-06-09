# Epic B — Render Pipeline Completion

**Epic Status:** SHIPPED (archived)

---

## Epic B Summary

Epic B completed the render pipeline by implementing four functional gaps identified in the Render Module: ScrollBox content clipping, visual cursor rendering for Input widgets, Select widget options list rendering, and opacity blending in render output.

## Key Capabilities Delivered

- ScrollBox clips child content to computed bounds during rendering
- Input widget renders a visible cursor when focused
- Select widget renders its full options list with selected option highlighted
- Opacity blending applied to foreground colors during rendering

## Shipping Metrics

- 4 tickets completed (TASK-B1 through B4)
- 10 Story Points total
- Zero behavior change for v0 apps (opacity blending is additive)

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-B1 | ScrollBox content clipping | Feature | 3 SP |
| TASK-B2 | Input cursor rendering | Feature | 2 SP |
| TASK-B3 | Select options list rendering | Feature | 3 SP |
| TASK-B4 | Opacity blending in render | Feature | 2 SP |

---

## Verbatim Ticket List (from Tasks.md v1.0)

### Epic B: Render Pipeline Completion

> **Justification:** The Render Module (`render.rs`) implements the full pipeline (layout → clear → render → diff → output → swap → clean) but has four functional gaps. The TechSpec explicitly requires ScrollBox content clipping (Section 4.10). The PRD requires Input text entry (Epic 4) and Select option selection (Epic 4), which are non-functional without visual cursor and options rendering.

---

**[TASK-B1] Implement ScrollBox content clipping during render**
- **Type:** Feature
- **Effort:** 3 SP
- **Dependencies:** [TASK-A3]
- **Description:** Per TechSpec 4.10: "The ScrollBox node's single child content is clipped to the ScrollBox's bounds during rendering." Currently, `render_node()` in `render.rs:171-181` offsets child positions by `(scroll_x, scroll_y)` but does not clip — cells outside the ScrollBox bounds are written to the front buffer. **Fix:** Pass a clip rectangle through the render traversal. When rendering children of a ScrollBox, constrain all `front_buffer.set()` calls to the ScrollBox's computed layout bounds. Cells outside the clip rect are discarded. This requires either: (a) adding `clip_x, clip_y, clip_w, clip_h` parameters to `render_node()`, or (b) computing intersection before each `set()` call. Approach (a) is cleaner and enables nested ScrollBox clipping in the future.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a ScrollBox at position (5, 5) with size 10x10
And a child Text widget with content "AAAAAAAAAAAAAAAAAAAAAA" (22 chars wide)
And scroll_x = 0
When render() is called
Then cells at columns 5-14 contain 'A'
And cells at column 15 and beyond do NOT contain 'A' (clipped)

Given the same ScrollBox with scroll_x = 5
When render() is called
Then the child content is shifted 5 columns left
And cells outside the ScrollBox bounds are still clipped
```

---

**[TASK-B2] Implement visual cursor rendering for Input widgets**
- **Type:** Feature
- **Effort:** 2 SP
- **Dependencies:** [TASK-A3]
- **Description:** The Input widget tracks `cursor_position` but the render pipeline does not visually indicate the cursor location. Without a visible cursor, the End User cannot determine where typed characters will be inserted. **Fix:** In `render_node()`, after rendering the Input content text, draw a cursor indicator at the cursor position. The cursor should be rendered by inverting the foreground/background colors at the cursor cell position (standard terminal cursor convention). If the cursor is at the end of the content, render an inverted space character. Only render the cursor when the Input widget is focused (check `ctx.focused == Some(handle)`).
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a focused Input widget with content "hello" and cursor_position = 3
When render() is called
Then the cell at content offset 3 (the 'l') has inverted fg/bg colors
And all other content cells have normal fg/bg colors

Given an unfocused Input widget
When render() is called
Then no cursor indicator is rendered (all cells have normal colors)

Given a focused Input with cursor at end of content (position = content length)
When render() is called
Then an inverted space character is rendered at the position after the last character
```

---

**[TASK-B3] Implement Select widget options list rendering**
- **Type:** Feature
- **Effort:** 3 SP
- **Dependencies:** [TASK-A3]
- **Description:** The Select widget currently renders only the selected option text. Per PRD Epic 4: "End User can select from a list of options using arrow keys + Enter." For the End User to see available options, the Select widget must render its full options list with the selected option visually highlighted. **Implementation:** Render each option on a separate row within the Select widget's content area. The selected option (`selected_index`) should be rendered with inverted colors (fg ↔ bg swap). If no option is selected, no inversion is applied. If the options list exceeds the widget height, show a visible subset centered on the selected option (viewport scrolling within the Select).
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Select widget with options ["Red", "Green", "Blue"] and selected_index = 1
When render() is called
Then "Red" is rendered on the first row with normal colors
And "Green" is rendered on the second row with inverted fg/bg
And "Blue" is rendered on the third row with normal colors

Given a Select widget with 20 options and a height of 5 rows
And selected_index = 10
When render() is called
Then 5 options are visible centered around index 10
And the selected option has inverted colors
```

---

**[TASK-B4] Implement opacity blending in render output**
- **Type:** Feature
- **Effort:** 2 SP
- **Dependencies:** [TASK-A3]
- **Description:** `VisualStyle.opacity` (0.0–1.0) is stored per node but not applied during rendering. The TechSpec defines `tui_set_style_opacity()` as a v0 function, so it must have visible effect. In a terminal context, true alpha blending is not possible. **Implementation:** Opacity affects foreground color intensity. At opacity 1.0, colors render normally. At opacity 0.0, the foreground is fully transparent (renders as the background color or default). Intermediate values linearly interpolate between foreground and background. Apply opacity to the `fg` color in the cell when `opacity < 1.0`. This requires modifying `render_plain_text()` and `render_styled_spans()` to read the node's opacity and blend before writing cells.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Text widget with fg = 0x01FFFFFF (white RGB), bg = 0x01000000 (black RGB), opacity = 0.5
When render() is called
Then the foreground color of rendered cells is approximately 0x01808080 (grey — midpoint blend)

Given a Text widget with opacity = 1.0
When render() is called
Then the foreground color is unchanged from the widget's fg_color

Given a Text widget with opacity = 0.0
When render() is called
Then the foreground color equals the background color (fully transparent)
```

---

## Brownfield Note

Epic B shipped ScrollBox clipping, cursor rendering, Select widget options, and opacity blending in the Render Module. The fixes are reflected in `native/src/render.rs` where `render_box`, cursor handling, and `render_select` implement the corrected behavior. The `opacity` field on visual styles is resolved during render pass blending.
