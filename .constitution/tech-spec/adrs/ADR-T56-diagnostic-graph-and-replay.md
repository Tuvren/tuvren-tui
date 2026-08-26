# ADR-T56: Use one bounded Diagnostic Graph for devtools and tests

- **Status:** accepted
- **Context:** Existing overlays, snapshots, counters, and trace rings do not provide the synchronized Inspect, Timeline, Issues, replay, privacy, and causal-path contract required by P0.
- **Decision:** Every internal boundary writes fixed, bounded causal records into a context-owned Diagnostic Graph using stable correlation identities. Bounded deltas plus periodic snapshots serialize to the versioned schemas in `data-models/`. Inspect, Timeline, Issues, semantic tests, visual snapshots, runtime replay, and application replay are projections of this graph. Observation is read-only; replay runs through an isolated Application Orchestration and UI Executor context. Inspector focus pauses application input, and watch mode hard-restarts the context.
- **Consequences:** One observation model explains application and runtime behavior without becoming mutable UI state. Disabled, passive, and full-trace modes must meet their overhead gates. Redaction is default, full-content export requires confirmation, and ring wrap is explicit.
