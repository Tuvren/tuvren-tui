# ADR-T38: Operation-Based Edit History Replaces Snapshot Undo for TextArea

- **Status:** accepted
- **Context:** `TextArea` undo/redo currently stores full-content snapshots. This works for short fields but degrades quickly under multiline edits and is incompatible with the substrate's epoch and dirty-range model.
- **Decision:** Move editable Primitives onto an operation history over a Text Document using grapheme-indexed `insert`, `delete`, `replace`, selection, and cursor operations plus bounded coalescing. Undo and redo replay operations; only declared structural edits such as bulk paste may produce bounded checkpoints.
- **Consequences:** Ordinary editing avoids O(document size) snapshots. History, checkpoints, secure-input redaction, controlled generations, line-ending normalization, and stale-operation behavior become tested state contracts.
