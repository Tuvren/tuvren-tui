# Epic L — Declarative Reconciler (ADR-T20)

**Epic Status:** SHIPPED (archived)

---

## Epic L Summary

Epic L delivered the declarative reconciler with JSX factory (`jsx`, `jsxs`, `Fragment`), signal-based reactive prop updates, keyed child reconciliation, package split (`kraken-tui` core + `kraken-tui/effect`), async loop utilities, and full bundle budget verification.

## Key Capabilities Delivered

- Package split: `kraken-tui` core + `kraken-tui/effect`
- Runtime JSX factory (`jsx`, `jsxs`, `Fragment`) with parent-before-child mounting
- Signal-based reactive prop updates with imperative setter binding
- Keyed child reconciliation using native O(1) tree primitives (`insert_child` + `destroy_subtree`)
- Async loop utilities for animation-aware pacing (~60fps render cadence)
- Core bundle budget (<50KB) enforcement

## Shipping Metrics

- 7 tickets completed (TASK-L0 through L6)
- 28 Story Points total

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-L0 | Spike JSX Factory + Signals Contract Validation | Spike | 2 SP |
| TASK-L1 | Establish Package Split (`kraken-tui` Core + `kraken-tui/effect`) | Chore | 3 SP |
| TASK-L2 | Implement Runtime JSX Factory and Child Mount Ordering | Feature | 5 SP |
| TASK-L3 | Implement Signal-Based Reactive Prop Updates and Cleanup | Feature | 5 SP |
| TASK-L4 | Implement Keyed Child Reconciliation with `insert_child` + `destroy_subtree` | Feature | 5 SP |
| TASK-L5 | Async Loop Utilities and Optional Effect Integration | Feature | 3 SP |
| TASK-L6 | Reconciler Verification, Bundle Budget, and Migration Example | Chore | 5 SP |

---

## Verbatim Ticket List (from Tasks.md v4.1)

### Epic L: Declarative Reconciler (ADR-T20)

**[TASK-L0] Spike JSX Factory + Signals Contract Validation**

- **Type:** Spike
- **Effort:** Story Points: 2
- **Dependencies:** [TASK-K4, TASK-K8, TASK-K10]
- **Description:** Validate runtime contract for JSX factory semantics, signal effect lifecycle, and keyed child updates before implementation.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given ADR-T20 requirements
When the spike is completed
Then an implementation contract exists for create/update/unmount flows
And it explicitly maps each flow to existing FFI operations
```

**[TASK-L1] Establish Package Split (`kraken-tui` Core + `kraken-tui/effect`)**

- **Type:** Chore
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-L0]
- **Description:** Create package boundaries, exports, and Bun build config to support optional effect integration without bloating core.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given the package build output
When the core package is installed without effect package
Then imperative and JSX APIs work without optional dependencies
```

**[TASK-L2] Implement Runtime JSX Factory and Child Mount Ordering**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-L1]
- **Description:** Implement JSX runtime (`jsx`, `jsxs`, `Fragment`) that instantiates Widgets and mounts children in deterministic order.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a JSX tree with nested children
When rendered through the factory
Then native nodes are created in parent-before-child order
And child order matches JSX declaration order
```

**[TASK-L3] Implement Signal-Based Reactive Prop Updates and Cleanup**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-L2]
- **Description:** Bind signal changes directly to imperative setters and ensure teardown removes effects and native nodes safely.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a signal-bound style prop
When the signal value changes
Then the corresponding FFI setter is called with the new value
And no duplicate effects are retained after unmount
```

**[TASK-L4] Implement Keyed Child Reconciliation with `insert_child` + `destroy_subtree`**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-L3]
- **Description:** Add keyed list reconciliation that reorders/mounts/unmounts children using native O(1) tree primitives.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a keyed child list reordered from [A,B,C] to [C,A,B]
When reconciliation runs
Then child ordering is updated via insert operations without full subtree recreation
And removed keys trigger subtree destruction exactly once
```

**[TASK-L5] Async Loop Utilities and Optional Effect Integration**

- **Type:** Feature
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-L4]
- **Description:** Provide host utilities for animation-aware loop pacing and optional Effect-layer adapters consistent with v2 loop guidance.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given active animations are present
When the async loop utility runs
Then input polling becomes non-blocking and render cadence targets ~60fps
And idle mode increases blocking timeout to reduce CPU usage
```

**[TASK-L6] Reconciler Verification, Bundle Budget, and Migration Example**

- **Type:** Chore
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-L5]
- **Description:** Add reconciliation integration tests, guard core bundle budget (<50KB), and include a complete imperative-to-JSX migration example.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given CI test and bundle-size checks
When reconciler artifacts are built
Then keyed update and unmount tests pass
And the core host package stays within the documented size budget
```