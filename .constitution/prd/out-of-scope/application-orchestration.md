# Application routing and form orchestration

- **Context:** Shared navigation and whole-form coordination can reduce repeated application code.
- **Decision:** Deferred to P1 `0.2.0`.
- **Reason:** These contracts should be designed from proven Commands, Focus Scopes, validation, lifecycle, and real application examples rather than imposed before those foundations stabilize.
- **Consequences:** First-party `0.1.0` forms and multi-view examples may compose public primitives, but they must not freeze a router or form-controller contract.
