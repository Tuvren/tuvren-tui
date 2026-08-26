# ADR-T52: Use explicit runtime contexts and discard inconsistent state

- **Status:** accepted
- **Context:** A process-global optional context cannot cleanly support hard-restart watch mode, isolated replay, deterministic tests, or recovery after a contained native panic.
- **Decision:** Replace implicit global UI state with an explicit `TuvrenContextId` registry. One owner executor thread mutates a context. An interactive process has at most one active interactive context; tests and replay may create isolated headless contexts. Expected transaction failures reject during prevalidation. An unexpected failure after mutation begins freezes the context, preserves bounded diagnostics, restores its terminal session, and discards it without rollback or continued mutation.
- **Consequences:** Context restart and replay isolation are deterministic, and no corrupted state survives a panic. The registry and context IDs remain private ABI details. All caches, Events, terminal modes, diagnostics, and private identities are context-scoped.
