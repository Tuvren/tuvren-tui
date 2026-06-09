# ADR-T30: Goldens and Benchmark Gates for Rendering-Sensitive Changes

- **Status:** accepted
- **Context:** Writer, cache, and replay-sensitive changes must be caught systematically before landing.
- **Decision:** Goldens and benchmark gates are required for writer-, cache-, and replay-sensitive changes. Any change to the Writer, cache eviction policy, or replay fixture format requires updating golden snapshots or benchmark baselines.
- **Consequences:** Performance and rendering regressions must be caught systematically. The CI gate includes golden snapshot comparisons and latency budget assertions.
