# Epic I — Core Hardening (ADR-T16 + Budget Enforcement)

**Epic Status:** SHIPPED (archived)

---

## Epic I Summary

Epic I replaced unsafe global state (`static mut CONTEXT`) with `OnceLock<RwLock<TuiContext>>`, hardened the FFI entry points with explicit locking, enforced deterministic lifecycle semantics for init/shutdown/reinit, and added memory and performance guardrails.

## Key Capabilities Delivered

- `OnceLock<RwLock<TuiContext>>` replacing `static mut CONTEXT`
- Explicit lock acquisition in all FFI entry points
- Deterministic handle invalidation after shutdown
- Budget-focused regression checks for memory, FFI overhead, render budget

## Shipping Metrics

- 5 tickets completed (TASK-I0 through I4)
- 18 Story Points total
- v2 foundation complete

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-I0 | Spike Safe Global State Migration Plan | Spike | 2 SP |
| TASK-I1 | Replace `static mut CONTEXT` with `OnceLock<RwLock<TuiContext>>` | Feature | 5 SP |
| TASK-I2 | Refactor FFI Entry Points for Explicit Locking | Chore | 3 SP |
| TASK-I3 | Harden Init/Shutdown/Reinit Lifecycle Semantics | Chore | 3 SP |
| TASK-I4 | Memory and Performance Guardrails (Syntect + Counters) | Chore | 5 SP |

---

## Verbatim Ticket List (from Tasks.md v4.0)

### Epic I: Core Hardening (ADR-T16 + Budget Enforcement)

**[TASK-I0] Spike Safe Global State Migration Plan**

- **Type:** Spike
- **Effort:** Story Points: 2
- **Dependencies:** None
- **Description:** Time-boxed design/verification spike to define lock acquisition policy (`read` vs `write`), re-init semantics, panic/poison handling, and success metrics before touching all FFI entrypoints.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given current usage of static mut CONTEXT
When the spike is completed
Then a migration note exists defining lock boundaries for every FFI function category
And it includes measurable regression checks for render latency and FFI overhead
```

**[TASK-I1] Replace `static mut CONTEXT` with `OnceLock<RwLock<TuiContext>>`**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-I0]
- **Description:** Implement ADR-T16 in `context.rs`; remove `#[allow(static_mut_refs)]`; introduce safe context accessors and initialization guards.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a fresh process
When tui_init() is called
Then TuiContext is initialized through OnceLock<RwLock<_>>
And no static mut global context remains in the codebase
```

**[TASK-I2] Refactor FFI Entry Points for Explicit Locking**

- **Type:** Chore
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-I1]
- **Description:** Update `lib.rs` FFI dispatch to acquire read/write locks consistently while preserving existing error-code semantics and `catch_unwind` behavior.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given any public FFI function
When it executes
Then it acquires the correct lock mode for its operation
And panic conversion to -2 behavior is unchanged
```

**[TASK-I3] Harden Init/Shutdown/Reinit Lifecycle Semantics**

- **Type:** Chore
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-I2]
- **Description:** Define and enforce deterministic behavior for repeated `tui_init()` / `tui_shutdown()` calls with locked context; verify all handles become invalid after shutdown.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given tui_init() was called and nodes were created
When tui_shutdown() is called and then tui_init() is called again
Then previous handles are invalid
And the new context starts clean with no leaked state
```

**[TASK-I4] Memory and Performance Guardrails (Syntect + Counters)**

- **Type:** Chore
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-I3]
- **Description:** Add budget-focused regression checks for memory footprint, FFI overhead, render budget, and input latency; include syntect-heavy scenarios and failure diagnostics.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given benchmark and stress scenarios for rich text and animation
When the guardrail suite runs
Then memory stays under documented limits for target workloads
And regressions fail CI with actionable counter output
```

---

## Brownfield Note

ADR-T16 (Safe Global State) shipped under Epic I. The `static mut CONTEXT` in `native/src/context.rs` was replaced with `OnceLock<RwLock<TuiContext>>`. All FFI entry points in `native/src/lib.rs` acquire explicit read/write locks. `tui_init()` / `tui_shutdown()` / `tui_reinit()` have deterministic lifecycle semantics. Handle(0) is the invalid sentinel.
