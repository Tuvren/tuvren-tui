# Native Primitive inflation

- **Context:** Every requested Component could be promoted into a distinct native-backed Primitive in pursuit of performance or catalog breadth.
- **Decision:** Rejected as a default strategy.
- **Reason:** Branded native controls increase compatibility and maintenance cost without proving that their hot work benefits from promotion. Tuvren should first use stable identity, batching, caching, delta reconciliation, and reusable native kernels.
- **Consequences:** Downstream stages may promote behavior only after measurements show a missed budget and a native prototype provides a material latency or memory improvement without changing the public Component contract. OD-01 must ratify the final hard cuts.
