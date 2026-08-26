# ADR-T30: Goldens and Benchmark Gates for Rendering-Sensitive Changes

- **Status:** accepted
- **Context:** Writer, cache, and replay-sensitive changes must be caught systematically before landing.
- **Decision:** Character, style, cursor, Semantic Tree, terminal-intent, ABI-byte, and diagnostic goldens are required for sensitive changes. Benchmarks emit `benchmark-result.schema.json`, measure engine, terminal-write, and input-to-Surface time separately, and enforce the absolute 120/90/60 tiers inside the reference envelope. Comparative gates remain provisional until OD-01 ratifies them.
- **Consequences:** Rendering and performance regressions have reproducible evidence. A baseline update includes a human explanation and raw results; it never converts an unexplained regression into success.
