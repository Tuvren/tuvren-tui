# ADR-T53: Store complete graphemes in the cell model

- **Status:** accepted
- **Context:** The current cell stores one scalar, so joined emoji, flags, keycaps, and modifiers measure correctly but render only their first scalar. This violates P0 text correctness.
- **Decision:** Keep Text Documents as validated UTF-8 with cached grapheme boundaries and expose public coordinates only as grapheme indices. Intern complete grapheme strings in a context-owned `GraphemePool`; cells store a `GraphemeId`, display width, continuation flag, and style identity. The writer resolves the primary cell's full grapheme and never emits continuation cells. Negotiated terminal width policy participates in projection cache keys.
- **Consequences:** The Surface represents every required grapheme without storing a heap string per cell. Grapheme interning and cache invalidation add memory and lookup cost that must pass the workload and 20 MiB baseline gates. Byte offsets never cross the public SDK.
