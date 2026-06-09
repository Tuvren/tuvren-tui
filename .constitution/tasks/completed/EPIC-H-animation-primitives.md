# Epic H — v1 Elevation (Post-Audit)

**Epic Status:** SHIPPED (archived)

---

## Epic H Summary

Epic H completed the v1 elevation work by adding built-in animation primitives (spinner, progress, pulse), animation chaining API with runtime scheduling, and behavioral verification tests for themed render output and animation progression.

## Key Capabilities Delivered

- Built-in animation primitives: spinner, progress, pulse
- Animation chaining API (`tui_chain_animation`) with runtime scheduling
- Behavioral verification tests for themed output and animation progression

## Shipping Metrics

- 3 tickets completed (TASK-H1 through H3)
- 11 Story Points total

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-H1 | Built-in animation primitives (spinner, progress, pulse) | Feature | 5 SP |
| TASK-H2 | Animation chaining API and runtime scheduling | Feature | 3 SP |
| TASK-H3 | Behavioral verification for themed output + animation progression | Chore | 3 SP |

---

## Verbatim Ticket List (from Tasks.md v2.1)

### Epic H: v1 Elevation (Post-Audit)

> **Justification:** Per Goldratt (_The Goal_), once a prior constraint is resolved, the system constraint moves. With Epics F and G closed, the new constraint is product-level readiness: missing v1 capabilities (primitives/chaining) and behavioral proof. Epic H isolates this final-mile work without reopening closed foundation epics.

---

**[TASK-H1] Built-in animation primitives (spinner, progress, pulse)**
- **Type:** Feature
- **Effort:** 5 SP
- **Dependencies:** [TASK-G5]
- **Description:** Implement built-in animation primitives required by PRD Epic 8. Add native helper entry points for `tui_start_spinner`, `tui_start_progress`, and `tui_start_pulse` that compose existing animation registry behavior. Add TS wrappers on `Widget` (`spinner()`, `progress()`, `pulse()`) with ergonomic defaults and explicit cancellation handles.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a widget handle
When widget.spinner({ interval: 80 }) is called
Then a non-zero animation handle is returned
And repeated renders visibly advance the spinner state

Given a widget handle
When widget.progress({ duration: 1000, easing: "linear" }) is called
Then a non-zero animation handle is returned
And progress reaches 100% after the duration elapses

Given a widget handle
When widget.pulse({ duration: 600, easing: "easeInOut" }) is called
Then a non-zero animation handle is returned
And the pulsing cycle updates across consecutive renders
```

---

**[TASK-H2] Animation chaining API and runtime scheduling**
- **Type:** Feature
- **Effort:** 3 SP
- **Dependencies:** [TASK-H1]
- **Description:** Implement chaining so animation B starts automatically after animation A completes. Add `tui_chain_animation(after_anim, next_anim)` and runtime queueing in `animation.rs` for pending links. Ensure cancellation semantics are explicit: cancelling the parent prevents automatic scheduling of chained successors.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given animation A and animation B
When tui_chain_animation(A, B) is called
Then it returns 0
And B does not start before A completes

Given chained animations A -> B
When A completes during tui_render()
Then B is activated on the next render cycle

Given chained animations A -> B
When tui_cancel_animation(A) is called before completion
Then B is not auto-started
```

---

**[TASK-H3] Behavioral verification for themed render output and animation progression**
- **Type:** Chore
- **Effort:** 3 SP
- **Dependencies:** [TASK-H2]
- **Description:** Add executable behavior assertions (not status-code-only checks) for v1 done criteria: themed color resolution in rendered buffers, animation progression in rendered buffers over elapsed time, primitive behavior over frame progression, and chaining order guarantees. Expand both Rust render integration tests and TS FFI tests.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a text node with no explicit fg/bg
And a dark theme applied at root
When tui_render() is called
Then rendered cells use theme fg/bg values

Given an opacity animation from 1.0 to 0.0 over 500ms
When two renders occur around the midpoint
Then rendered output reflects intermediate opacity before final value

Given chained animations A -> B
When renders advance past A completion
Then B starts only after A completion and in-order
```