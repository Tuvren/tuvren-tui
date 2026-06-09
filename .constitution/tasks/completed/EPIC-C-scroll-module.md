# Epic C — Scroll Module Completion

**Epic Status:** SHIPPED (archived)

---

## Epic C Summary

Epic C completed the Scroll Module by implementing two missing behaviors specified in TechSpec 4.10: scroll position clamping to content bounds, and the single-child constraint for ScrollBox nodes.

## Key Capabilities Delivered

- Scroll positions clamped to computed content bounds
- ScrollBox enforces single-child constraint with descriptive error

## Shipping Metrics

- 2 tickets completed (TASK-C1 and TASK-C2)
- 4 Story Points total

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-C1 | Scroll content bounds clamping | Feature | 3 SP |
| TASK-C2 | ScrollBox single-child enforcement | Feature | 1 SP |

---

## Verbatim Ticket List (from Tasks.md v1.0)

### Epic C: Scroll Module Completion

> **Justification:** TechSpec 4.10 specifies two behaviors that are currently missing: scroll position clamping to content bounds, and the single-child constraint. Without bounds clamping, scroll positions can become nonsensical (scrolling past content into empty space). Without the single-child constraint, multi-child ScrollBox behavior is undefined and untested.

---

**[TASK-C1] Implement content bounds clamping for scroll positions**
- **Type:** Feature
- **Effort:** 3 SP
- **Dependencies:** [TASK-B1]
- **Description:** TechSpec 4.10: "`tui_scroll_by` — Scroll by delta. Clamped to content bounds." And: "The scroll range is `(content_width - scrollbox_width, content_height - scrollbox_height)`." Currently, `scroll_by()` in `scroll.rs:43` only clamps to `>= 0`. **Fix:** After layout computation, the scroll module must query the ScrollBox's computed size and its child's computed size. `set_scroll()` and `scroll_by()` must clamp: `scroll_x` to `[0, max(0, child_width - scrollbox_width)]`, `scroll_y` to `[0, max(0, child_height - scrollbox_height)]`. This requires passing layout information into the scroll module. Two approaches: (a) compute clamping in `scroll.rs` by reading Taffy layout, or (b) compute max scroll bounds during `render()` and store them on the node. Approach (b) is simpler — store `max_scroll_x` and `max_scroll_y` on ScrollBox nodes after layout computation, then use them in `set_scroll()` and `scroll_by()`.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a ScrollBox of size 10x5 containing a child of size 20x15
When tui_set_scroll(handle, 100, 100) is called
Then scroll_x is clamped to 10 (20 - 10)
And scroll_y is clamped to 10 (15 - 5)

Given a ScrollBox of size 10x5 containing a child of size 8x3 (smaller than ScrollBox)
When tui_set_scroll(handle, 5, 5) is called
Then scroll_x is clamped to 0 (child fits, no scrolling needed)
And scroll_y is clamped to 0

Given a ScrollBox with scroll position (5, 5) and max scroll (10, 10)
When tui_scroll_by(handle, 100, 100) is called
Then scroll_x is clamped to 10
And scroll_y is clamped to 10
```

---

**[TASK-C2] Enforce ScrollBox single-child constraint**
- **Type:** Feature
- **Effort:** 1 SP
- **Dependencies:** [TASK-A3]
- **Description:** TechSpec 4.10: "ScrollBox accepts exactly one child. To scroll multiple widgets, wrap them in a Box container." Currently, `tui_append_child()` allows multiple children on ScrollBox nodes. **Fix:** In `tree::append_child()`, if the parent's `node_type` is `ScrollBox` and `children.len() >= 1`, return an error: "ScrollBox accepts exactly one child. Wrap multiple widgets in a Box container." This validation happens in the Tree Module, not at the FFI boundary.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a ScrollBox node with zero children
When tui_append_child(scrollbox, child1) is called
Then it succeeds (returns 0)

Given a ScrollBox node with one child already
When tui_append_child(scrollbox, child2) is called
Then it returns -1 (error)
And tui_get_last_error() contains "ScrollBox accepts exactly one child"
```

---

## Brownfield Note

Epic C shipped ScrollBox content bounds clamping and single-child enforcement. The `ScrollBox` widget in `native/src/tree.rs` and `native/src/layout.rs` enforces that only one child is accepted and that scroll offsets are clamped to valid content ranges. These constraints are reflected in the current native source tree.
