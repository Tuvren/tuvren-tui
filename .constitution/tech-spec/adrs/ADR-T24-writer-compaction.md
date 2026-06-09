# ADR-T24: Writer Compaction and Cursor/Style Delta Minimization

- **Status:** accepted
- **Context:** High-frequency transcript and dashboard workloads depend on efficient terminal emission.
- **Decision:** Writer compaction and cursor/style delta minimization are first-class parts of the render path. The Writer context tracks dirty cursor and style regions and emits only the minimal terminal instruction sequence.
- **Consequences:** High-frequency update surfaces avoid redundant escape sequence emission. The Writer becomes a hot-path component that must be profiled in any layout or render change.
