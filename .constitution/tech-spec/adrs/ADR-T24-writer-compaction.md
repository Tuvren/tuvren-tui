# ADR-T24: Writer Compaction and Cursor/Style Delta Minimization

- **Status:** accepted
- **Context:** High-frequency transcript and dashboard workloads depend on efficient terminal emission.
- **Decision:** Writer compaction, complete-grapheme emission, synchronized-output framing, and cursor/style delta minimization are first-class parts of the Presentation Pipeline. The Writer tracks prior terminal state and emits only validated changed runs from primary cells.
- **Consequences:** High-frequency update surfaces avoid redundant terminal output without truncating graphemes or emitting continuation cells. Writer changes require golden terminal intent, real-terminal tests, and separate write-time profiling.
