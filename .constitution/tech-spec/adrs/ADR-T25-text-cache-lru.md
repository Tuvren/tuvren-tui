# ADR-T25: Bounded Native LRU for Rich Text and Wrap Results

- **Status:** accepted
- **Context:** Stable content in rich text widgets and text wrapping benefits from caching to avoid repeated parse and measure work.
- **Decision:** Rich-text, syntax, grapheme, width, wrap, responsive-style, and projection artifacts use bounded native caches. Keys include every semantic input, including content and style epochs, width policy, wrap width, tab width, Capability Tier, and relevant environment conditions. Count and byte limits are mandatory.
- **Consequences:** Stable content avoids repeated work while cache correctness stays explicit. Hits, misses, bytes, eviction, invalidation causes, and worst-case cold behavior are observable and benchmarked.
