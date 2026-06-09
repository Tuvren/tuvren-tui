# ADR-T38: Operation-Based Edit History Replaces Snapshot Undo for TextArea

- **Status:** accepted
- **Context:** `TextArea` undo/redo currently stores full-content snapshots. This works for short fields but degrades quickly under multiline edits and is incompatible with the substrate's epoch and dirty-range model.
- **Decision:** Move `TextArea` onto an `EditBuffer` that wraps a `TextBuffer` with an operation history (`insert`, `delete`, `replace`, selection move, cursor move) plus coalescing rules for ordinary single-edit operations. Undo and redo replay operations against the buffer; only structural operations such as bulk paste may produce checkpoint snapshots.
- **Consequences:** Ordinary single-character editing no longer produces full-content snapshots, eliminating an O(content size) memory cost per keystroke. The substrate gains an additional state model (`EditBuffer`) and matching ABI surface.
