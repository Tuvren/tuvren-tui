# ADR-T25: Bounded Native LRU for Rich Text and Wrap Results

- **Status:** accepted
- **Context:** Stable content in rich text widgets and text wrapping benefits from caching to avoid repeated parse and measure work.
- **Decision:** Rich text and wrap results are cached in a bounded native LRU. Cache entries are keyed by content epoch and style fingerprint; eviction uses a simple LRU policy with a configurable capacity.
- **Consequences:** Stable content avoids repeated parse and wrap work inside the Native Core. Cache warming and eviction behavior must be observable through diagnostics.
