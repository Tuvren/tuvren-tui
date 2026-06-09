# Epic J — Tree Operations for Reconciler (ADR-T17, ADR-T18)

**Epic Status:** SHIPPED (archived)

---

## Epic J Summary

Epic J implemented the tree operation prerequisites for the reconciler: `destroy_subtree()` with post-order traversal, indexed `insert_child()` with detach/reparent semantics, and full cross-module cleanup integration.

## Key Capabilities Delivered

- Native post-order `destroy_subtree()` in Tree Module
- Cross-module cleanup (animations, theme bindings, Taffy, focus/root state)
- `tui_destroy_subtree()` FFI and TypeScript bindings
- Indexed `insert_child()` with reparanting and Taffy child order updates
- `tui_insert_child()` FFI and TypeScript bindings with reorder regression suite

## Shipping Metrics

- 5 tickets completed (TASK-J1 through J5)
- 20 Story Points total

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-J1 | Implement Native Post-Order `destroy_subtree()` in Tree Module | Feature | 5 SP |
| TASK-J2 | Integrate Subtree Destruction Cleanup Across Modules | Feature | 5 SP |
| TASK-J3 | Expose `tui_destroy_subtree()` Through FFI and TS Bindings | Feature | 2 SP |
| TASK-J4 | Implement `insert_child(parent, child, index)` with Reparenting | Feature | 5 SP |
| TASK-J5 | Expose `tui_insert_child()` + Host API + Reorder Regression Suite | Feature | 3 SP |

---

## Verbatim Ticket List (from Tasks.md v4.0)

### Epic J: Tree Operations for Reconciler (ADR-T17, ADR-T18)

**[TASK-J1] Implement Native Post-Order `destroy_subtree()` in Tree Module**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-I2]
- **Description:** Add recursive post-order subtree destruction in `tree.rs` with structural correctness guarantees.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a tree with depth > 2
When destroy_subtree(root_child) is executed
Then all descendants are removed before the parent node
And no dangling parent/child references remain
```

**[TASK-J2] Integrate Subtree Destruction Cleanup Across Modules**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-J1]
- **Description:** Ensure subtree destruction cancels animations, clears theme bindings, detaches from Taffy, updates focus/root state, and leaves event pipeline consistent.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a subtree with active animations and theme bindings
When tui_destroy_subtree(handle) is called
Then all related animations and theme bindings are removed
And layout/render/focus queries do not reference destroyed handles
```

**[TASK-J3] Expose `tui_destroy_subtree()` Through FFI and TS Bindings**

- **Type:** Feature
- **Effort:** Story Points: 2
- **Dependencies:** [TASK-J2]
- **Description:** Add FFI entrypoint and TS wrapper surface for subtree destruction with consistent errors.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a valid subtree root handle
When the host calls tui_destroy_subtree(handle)
Then it returns 0
And subsequent reads on any destroyed handle return an error
```

**[TASK-J4] Implement `insert_child(parent, child, index)` with Reparenting**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-J2]
- **Description:** Add indexed insertion in native tree logic, including detach/reparent semantics and Taffy child order updates.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a parent with children [A, B, C]
When insert_child(parent, X, 1) is executed
Then child order becomes [A, X, B, C]
And layout child ordering matches tree ordering
```

**[TASK-J5] Expose `tui_insert_child()` + Host API + Reorder Regression Suite**

- **Type:** Feature
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-J4]
- **Description:** Add FFI and TS wrappers for indexed insertion and cover keyed-reorder invariants with integration tests.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given an existing child under another parent
When tui_insert_child(new_parent, child, 0) is called
Then child is detached from the old parent and inserted at index 0
And no duplicate parent references exist
```

---

## Brownfield Note

ADR-T17 (Subtree Destruction) and ADR-T18 (Indexed Insertion) shipped under Epic J. The `destroy_subtree()` in `native/src/tree.rs` performs post-order traversal to clean up all descendants. `insert_child()` with reparenting detaches a node from its old parent and inserts at the target index. The FFI surface exposes `tui_destroy_subtree()` and `tui_insert_child()` through `ffi_wrap` in `native/src/lib.rs`. Cross-module cleanup (animations, theme bindings, Taffy, focus/root state) is enforced by the native tree module.
