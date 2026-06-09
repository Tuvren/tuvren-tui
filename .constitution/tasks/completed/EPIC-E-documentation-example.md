# Epic E — Documentation & Example

**Epic Status:** SHIPPED (archived)

---

## Epic E Summary

Epic E created the first working example application and updated the CLAUDE.md implementation status table to reflect the completed v0 implementation. This validated the "Hello World" JTBD and provided the developer's first contact with the library.

## Key Capabilities Delivered

- `examples/demo.ts` demonstrating all five widget types (Box, Text, Input, Select, ScrollBox)
- Interactive application with keyboard event handling
- CLAUDE.md updated with all modules marked complete

## Shipping Metrics

- 2 tickets completed (TASK-E1 and TASK-E2)
- 4 Story Points total
- v0 MVP fully validated

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-E1 | Example application | Feature | 3 SP |
| TASK-E2 | Update CLAUDE.md | Chore | 1 SP |

---

## Verbatim Ticket List (from Tasks.md v1.0)

### Epic E: Documentation & Example

> **Justification:** Per the PRD: "Time to Hello World: < 15 minutes for a competent TypeScript developer." A working example is the developer's first contact with the library. Without one, the "Hello World" JTBD cannot be validated.

---

**[TASK-E1] Create example application demonstrating all widget types**
- **Type:** Feature
- **Effort:** 3 SP
- **Dependencies:** [TASK-D1, TASK-D2, TASK-D3]
- **Description:** Create `examples/demo.ts` that demonstrates all five widget types (Box, Text, Input, Select, ScrollBox) in a single interactive application. The example should: (1) Create a root Box with column flex direction. (2) Add a Text widget with Markdown content. (3) Add an Input widget for text entry. (4) Add a Select widget with sample options. (5) Wrap a long Text in a ScrollBox. (6) Handle keyboard events (Escape to quit). (7) Render in a loop at ~60fps (16ms timeout). This serves as both documentation and a visual smoke test. The example should be runnable with `bun run examples/demo.ts` after a release build.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a release build of libkraken_tui
When bun run examples/demo.ts is executed
Then the terminal shows a dashboard with:
  - A Markdown-formatted header
  - A text input field with visible cursor
  - A select dropdown with options
  - A scrollable text region
And pressing Tab cycles focus between Input and Select
And pressing Escape cleanly exits the application
And the terminal is restored to its original state after exit
```

---

**[TASK-E2] Update CLAUDE.md implementation status table**
- **Type:** Chore
- **Effort:** 1 SP
- **Dependencies:** [TASK-E1]
- **Description:** The "Implementation Status" table in `CLAUDE.md` is outdated. Update all module statuses to reflect the completed v0 implementation. All modules should show ✅ status with accurate notes. Also update the "Development Commands" section if any new commands were added (e.g., example runner).
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the updated CLAUDE.md
When I read the Implementation Status table
Then every module shows ✅ status
And the Notes column accurately reflects v0 completion
And no module shows ⚠️ or "scaffolding" status
```

---

## Brownfield Note

Epic E shipped the `demo.ts` example and updated `CLAUDE.md` documentation. The `examples/demo.ts` file demonstrates the widget composition, layout, and rendering pattern for new users. The `CLAUDE.md` at the repo root reflects the v0 implementation status and development commands.
