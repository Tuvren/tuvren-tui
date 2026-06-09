# Epic A — Code Quality & Safety Foundation

**Epic Status:** SHIPPED (archived)

---

## Epic A Summary

Epic A established the code quality and safety foundation for the project. The initial codebase had 20 clippy errors, 10 clippy warnings, rustfmt violations, and a null-termination correctness bug in `tui_get_last_error()`. This epic fixed all of these issues and added a `package.json` for the TypeScript layer.

## Key Capabilities Delivered

- Zero clippy errors across all FFI entry points
- Zero clippy warnings across all Rust source files
- Rustfmt compliance across all 10 Rust source files
- Fixed null-termination bug in `tui_get_last_error()`
- TypeScript `package.json` with test/bench scripts

## Shipping Metrics

- 5 tickets completed (TASK-A1 through A5)
- 34 Story Points total
- 27 existing Rust unit tests preserved

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-A1 | Fix clippy `not_unsafe_ptr_arg_deref` errors across all FFI entry points | Chore | 2 SP |
| TASK-A2 | Fix clippy warnings (collapsible_if, too_many_arguments, useless_conversion, while_let_loop) | Chore | 1 SP |
| TASK-A3 | Apply rustfmt formatting to all Rust source files | Chore | 1 SP |
| TASK-A4 | Fix `tui_get_last_error` null-termination correctness bug | Security | 2 SP |
| TASK-A5 | Add `package.json` for TypeScript layer | Chore | 1 SP |

---

## Verbatim Ticket List (from Tasks.md v1.0)

### Epic A: Code Quality & Safety Foundation

> **Justification:** Per Gene Kim's _Accelerate_ research, code quality gates (linting, formatting) must pass before any feature work. A codebase with 20 clippy errors and a null-termination bug is a liability, not a foundation.

---

**[TASK-A1] Fix clippy `not_unsafe_ptr_arg_deref` errors across all FFI entry points**
- **Type:** Chore
- **Effort:** 2 SP
- **Dependencies:** None
- **Description:** 20 FFI functions in `lib.rs` that accept raw pointers (`*mut i32`, `*mut u8`, `*mut TuiEvent`, etc.) trigger clippy error `not_unsafe_ptr_arg_deref` because they dereference raw pointers inside `unsafe {}` blocks within public `extern "C"` functions not marked `unsafe`. The fix is to add `#[allow(clippy::not_unsafe_ptr_arg_deref)]` at the crate level in `lib.rs` (these are FFI entry points — the caller is already in unsafe territory per the C ABI contract) or mark each function with `/// # Safety` documentation. Affected functions: `tui_get_terminal_size`, `tui_set_content`, `tui_get_content`, `tui_set_code_language`, `tui_get_code_language`, `tui_select_get_option`, `tui_set_layout_dimension`, `tui_set_layout_edges`, `tui_get_layout`, `tui_measure_text`, `tui_get_scroll`, `tui_next_event`, and others taking raw pointers.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the Rust crate at native/
When I run cargo clippy --manifest-path native/Cargo.toml
Then there are zero errors of type not_unsafe_ptr_arg_deref
And the existing 27 unit tests still pass
```

---

**[TASK-A2] Fix clippy warnings (collapsible_if, too_many_arguments, useless_conversion, while_let_loop)**
- **Type:** Chore
- **Effort:** 1 SP
- **Dependencies:** None
- **Description:** 10 clippy warnings exist across four categories: (1) `collapsible_if` in `event.rs:77` — nested if-blocks for mouse focus can be collapsed. (2) `too_many_arguments` in `render.rs:198` and `render.rs:273` — `render_border` and `render_plain_text` exceed 7-argument threshold. Refactor into parameter structs or `#[allow]` with justification. (3) `useless_conversion` in `tree.rs:92` — redundant `NodeId::from(NodeId::new(0))`. (4) `while_let_loop` in `tree.rs:159` — `mark_dirty_ancestors` loop can be written as `while let`.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the Rust crate at native/
When I run cargo clippy --manifest-path native/Cargo.toml
Then there are zero warnings
And the existing 27 unit tests still pass
```

---

**[TASK-A3] Apply rustfmt formatting to all Rust source files**
- **Type:** Chore
- **Effort:** 1 SP
- **Dependencies:** [TASK-A1, TASK-A2]
- **Description:** `cargo fmt --check` reports formatting violations across `context.rs`, `event.rs`, `layout.rs`, `lib.rs`, `render.rs`, `style.rs`, `terminal.rs`, `text.rs`, `tree.rs`, and `types.rs`. Run `cargo fmt` to auto-fix. Verify no behavioral changes.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the Rust crate at native/
When I run cargo fmt --manifest-path native/Cargo.toml --check
Then the exit code is 0 (no formatting differences)
And the existing 27 unit tests still pass
```

---

**[TASK-A4] Fix `tui_get_last_error` null-termination correctness bug**
- **Type:** Security
- **Effort:** 2 SP
- **Dependencies:** [TASK-A3]
- **Description:** `tui_get_last_error()` in `lib.rs:936` returns `ctx.last_error.as_ptr() as *const c_char`. Rust's `String` is **NOT null-terminated**. The TypeScript layer reads this via `bun:ffi` as a C string (reads until null byte), which causes undefined behavior — potential buffer overread. **Fix:** Change `last_error` storage to ensure null termination. Two approaches: (a) Store a `CString` instead of `String` for `last_error` in `context.rs`, or (b) Append a null byte to the `String` before returning the pointer. Option (b) is simpler — `set_last_error()` should push a `\0` byte, and `tui_get_last_error()` can return the pointer safely. Also update `tui_clear_error()` to maintain the invariant.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a context with an error message "test error"
When tui_get_last_error() is called
Then the returned pointer contains "test error\0" (null-terminated)
And reading the pointer as a C string produces exactly "test error"
And no memory is read past the null terminator

Given a context with tui_clear_error() called
When tui_get_last_error() is called
Then it returns a null pointer
```

---

**[TASK-A5] Add `package.json` for TypeScript layer**
- **Type:** Chore
- **Effort:** 1 SP
- **Dependencies:** None
- **Description:** The `ts/` directory has no `package.json`. While Bun can operate without one, a `package.json` is needed for: (1) declaring the project name and version, (2) defining `scripts` for `bun test` and `bun run bench`, (3) enabling proper `bun install` workflows, (4) declaring `typescript` as a dev dependency for type checking. Create `ts/package.json` with name `kraken-tui`, version `0.1.0`, type `module`, and appropriate scripts.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the ts/ directory
When I run cat ts/package.json
Then a valid JSON file exists with name "kraken-tui" and version "0.1.0"
And "scripts" contains "test" and "bench" entries
And the "type" field is set to "module"
```