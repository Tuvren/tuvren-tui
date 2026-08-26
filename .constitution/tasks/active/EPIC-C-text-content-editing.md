# Epic C — Text, rich content, and editing

Replace the partial text substrate with the complete grapheme-based P0-E01–P0-F10 contract.

#### TUI-C001 Implement full-grapheme cells, bounded interning, and one width policy

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B001
- **Category:** Correctness
- **Capabilities:** P0-E01–P0-E04, P0-E02, RES-01
- **Scope (In-Scope Files):** `native/src/content/`, `native/src/presentation/`, Unicode fixtures and benchmarks
- **Scope (Out-of-Scope Files):** bidirectional layout, localization framework, single-scalar cell compatibility
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if a visual cell can discard any scalar in a grapheme cluster.
- **Description:** Unify segmentation, measurement, hit-testing, wrapping, clipping, selection, cursor, and rendering over complete graphemes; bound the Grapheme Pool by count and bytes with observable behavior.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Joined emoji, flags, modifiers, combining marks, keycaps, CJK, ambiguous widths, tabs, clipping, and cursor round trips agree across every text path and never exceed declared pool limits.
```

#### TUI-C002 Implement the native Text Document editing state machine

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-C001
- **Category:** Feature-Evolution
- **Capabilities:** P0-F01–P0-F08, P0-F10
- **Scope (In-Scope Files):** `native/src/content/`, text-edit transaction decoder, property and model tests
- **Scope (Out-of-Scope Files):** multiple cursors, folding, language intelligence, bidi behavior
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if editing requires full-document snapshots for undo or exposes byte/code-unit positions publicly.
- **Description:** Implement grapheme, word, line, and document navigation and selection commands consumed by the Interaction Kernel; operation history; find/replace; wrap or horizontal scroll; independent tab display width, tabs/spaces indentation and indentation width, line endings; limits; validation; secure entry; and single-authority controlled/local state.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
State-machine tests generate edits, navigation, selection, undo/redo, find/replace, normalization, stale epochs, limits, and teardown while preserving grapheme-boundary and history invariants.
```

#### TUI-C003 Implement rich-text parsing, styling, projection, and sanitization

- **Type:** Security
- **Effort:** 8
- **Dependencies:** TUI-C001, TUI-B003
- **Category:** Security
- **Capabilities:** P0-E06–P0-E11, SAFE-01
- **Scope (In-Scope Files):** `native/src/content/`, `native/src/presentation/`, formatted-content corpus and decoder cases owned by `native/fuzz/fuzz_targets/durable_files.rs`
- **Scope (Out-of-Scope Files):** privileged parser extensions, arbitrary terminal control, image protocols
- **Verification Command:** `cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz durable_files -- -max_total_time=60`
- **Expected Success Output:** maintained formatted-content corpus produces no crash, escape, or unbounded allocation
- **STOP Conditions:** STOP if sanitized content can perform cursor movement, title, clipboard, or terminal-mode control.
- **Description:** Make StyledText canonical; implement the exact tables, GitHub-compatible footnotes, strikethrough, task-list, and GFM Markdown flags; apply the declared raw-HTML, link, image-alt, and ANSI sanitization policy; add code highlighting, bounded parse caches, and adapters for custom host formats.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Allowlisted formatting survives; styled spans preserve the distinction between absent style and an explicit style payload; control operations and malformed sequences are rejected; cache keys include every behavior input; output remains grapheme-correct and bounded.
```

#### TUI-C004 Ship grapheme Text Document APIs and UTF adapters in both SDKs

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-A005, TUI-C002
- **Category:** DX
- **Capabilities:** P0-E03–P0-E05, P0-F01–P0-F08, P0-F10
- **Scope (In-Scope Files):** `ts/src/`, `ts/src/imperative/`, text declaration and conformance tests
- **Scope (Out-of-Scope Files):** raw UTF-16 coordinates, Promise-wrapped Effect services
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** Effect and imperative text fixtures pass with identical snapshots
- **STOP Conditions:** STOP if an adapter silently repairs malformed UTF-16 or exposes a code-unit index.
- **Description:** Implement the declared TextDocumentService and imperative TextDocument over bounded native query and indexed transaction-result records, with validating `graphemeIndex()` construction, branded grapheme ranges, cursor and selection operations, find/replace, undo/redo, and explicit UTF-8, UTF-16LE, and UTF-16BE import/export.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Declaration tests and round-trip fixtures prove typed Effect failures, imperative parity, byte-order validation, line-ending policy, and identical grapheme coordinates.
```

#### TUI-C005 Integrate editable and rich-content Components

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-B008, TUI-C003, TUI-C004, TUI-D002, TUI-F003
- **Category:** Feature-Evolution
- **Capabilities:** P0-E06–P0-E09, P0-F05–P0-F10
- **Scope (In-Scope Files):** `native/src/interaction/`, `ts/src/components/`, Text/Input/TextArea/CodeView/DiffView fixtures and examples
- **Scope (Out-of-Scope Files):** advanced editor P1 scope, integrated Select filtering
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** all text Component fixtures pass through published entrypoints
- **STOP Conditions:** STOP if a Component creates a second content authority or bypasses the active clipboard contract.
- **Description:** Connect text presentation and editing Components to Text Documents, StyledText, validation, secure entry, wrapping, horizontal scroll, source adapters, the shared clipboard service, and executor-owned keyboard/pointer selection routing from the Interaction Kernel. Declarative TextArea accepts a TextDocumentService binding as its sole content authority and retrieves snapshots/changes through that service; its type contract rejects simultaneous value/defaultValue/onValueChange authority.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Representative form, document-bound editor, code, diff, structured-data, log, keyboard/pointer selection, validation, clipboard, and cleanup scenarios match between public SDK workflows and prove the Interaction-to-Content editing path without duplicate content authority.
```
