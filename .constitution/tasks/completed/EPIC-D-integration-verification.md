# Epic D — Integration & Verification

**Epic Status:** SHIPPED (archived)

---

## Epic D Summary

Epic D added comprehensive integration and verification coverage for the render pipeline, event pipeline, and ScrollBox-specific behaviors. It also expanded TypeScript FFI integration tests to cover all 62 FFI functions.

## Key Capabilities Delivered

- Render pipeline integration tests with MockBackend cell assertions
- Event pipeline integration tests with terminal input injection
- ScrollBox rendering and scroll behavior tests
- TypeScript FFI integration test expansion covering all 62 FFI functions

## Shipping Metrics

- 4 tickets completed (TASK-D1 through D4)
- 9 Story Points total
- 124 total tests after v0 completion (70 Rust + 54 FFI)

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-D1 | Render pipeline integration tests | Chore | 3 SP |
| TASK-D2 | Event pipeline integration tests | Chore | 2 SP |
| TASK-D3 | ScrollBox rendering tests | Chore | 2 SP |
| TASK-D4 | TS FFI integration test expansion | Chore | 2 SP |

---

## Verbatim Ticket List (from Tasks.md v1.0)

### Epic D: Integration & Verification

> **Justification:** Per Gene Kim's _Accelerate_ research, "the ability to run automated tests is a key predictor of delivery performance." The Render Module is the most complex module (~150 LOC of traversal, clipping, and diffing logic) with **zero test coverage**. Unit tests validate individual modules; integration tests validate the pipeline.

---

**[TASK-D1] Add render pipeline integration tests with MockBackend cell assertions**
- **Type:** Chore
- **Effort:** 3 SP
- **Dependencies:** [TASK-B1, TASK-B2, TASK-B3, TASK-B4]
- **Description:** Create integration tests that exercise the full render pipeline: create nodes → set properties → call `render()` → assert cell contents in the front buffer via MockBackend. Test scenarios: (1) Basic Box with Text child — verify text appears at computed position. (2) Nested Boxes with flex direction — verify child layout positions. (3) Bordered Box — verify border characters at edges. (4) Text with Markdown formatting — verify bold spans have `CellAttrs::BOLD`. (5) Background color fill — verify cells have correct `bg` value. (6) Invisible node — verify it is not rendered. Add these as `#[cfg(test)]` tests in `render.rs` or a new `tests/integration.rs` file.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a root Box (80x24) with a Text child containing "Hello"
When render() is called with a MockBackend
Then the front buffer cell at (0, 0) contains 'H'
And the front buffer cell at (4, 0) contains 'o'

Given a Box with border_style = Single and size 10x5
When render() is called
Then cell (0, 0) contains '┌' (top-left corner)
And cell (9, 0) contains '┐' (top-right corner)
And cell (0, 4) contains '└' (bottom-left corner)
And cell (1, 0) contains '─' (horizontal border)
```

---

**[TASK-D2] Add event pipeline integration tests**
- **Type:** Chore
- **Effort:** 2 SP
- **Dependencies:** [TASK-A4]
- **Description:** Create integration tests that exercise the event pipeline end-to-end: inject `TerminalInputEvent`s into MockBackend → call `read_input()` → drain events → assert TuiEvent output. Test scenarios: (1) Key press → Key event in buffer with correct code/modifiers. (2) Tab → FocusChange event generated, focus advances. (3) Character input on focused Input → content updated, Change event generated. (4) Mouse click → hit-test resolves correct target. (5) Scroll wheel → ScrollBox scroll position updated. (6) Enter on focused Input → Submit event. (7) Arrow keys on focused Select → Change event with updated index.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a tree with two Input widgets and focus on the first
When a Tab key event is injected and read_input() is called
Then a FocusChange event is in the buffer with from=input1 and to=input2
And ctx.focused == Some(input2)

Given a focused Input with content "hello"
When a Backspace key event is injected and read_input() is called
Then the Input content is "hell"
And a Change event is in the buffer targeting the Input handle
```

---

**[TASK-D3] Add ScrollBox rendering and scroll tests**
- **Type:** Chore
- **Effort:** 2 SP
- **Dependencies:** [TASK-C1, TASK-C2]
- **Description:** Create tests for ScrollBox-specific rendering behavior: (1) Child content rendered with scroll offset applied. (2) Content outside ScrollBox bounds is clipped (from TASK-B1). (3) Scroll bounds clamping works (from TASK-C1). (4) Second child rejected (from TASK-C2). (5) Scroll position persists across renders.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a ScrollBox (10x5) at (0, 0) with a child containing a 20-char string
And scroll_x = 5
When render() is called
Then the visible content starts from character index 5
And no content appears outside columns 0-9

Given a ScrollBox with one child
When a second child is appended
Then the operation fails with error code -1
And the ScrollBox still has exactly one child
```

---

**[TASK-D4] Expand TypeScript FFI integration tests**
- **Type:** Chore
- **Effort:** 2 SP
- **Dependencies:** [TASK-D1, TASK-A5]
- **Description:** Expand `ts/test-ffi.test.ts` to cover all 62 FFI functions with round-trip verification. Current tests cover basic scenarios. Add: (1) Input widget: cursor movement, character insertion, backspace, max length, password masking. (2) Select widget: add/remove/clear options, selection, get_option text retrieval. (3) Layout: all dimension properties, all flex enum values, edges, gap. (4) Style: all color properties, all flags, all border styles, opacity. (5) Focus: set_focusable, focus_next/prev cycle, focus_change event generation. (6) Scroll: set/get/scroll_by. (7) Content: set/get with UTF-8, format, code language. (8) Diagnostics: perf counters, debug mode. Requires a release build first (`cargo build --manifest-path native/Cargo.toml --release`).
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a release build of libkraken_tui
When bun test ts/test-ffi.test.ts is executed
Then all tests pass
And every one of the 62 FFI functions is called at least once
And no memory leaks are detected (no segfaults, no ASAN violations)
```