# Composition Tree persistence

- **Context:** Tuvren could serialize and later restore the full live Composition Tree and its interaction state.
- **Decision:** Rejected for the initial roadmap.
- **Reason:** Persisting runtime identity, pending Events, focus, selection, animation, and ephemeral Component state would mix application data ownership with runtime projection state.
- **Consequences:** Applications own durable domain state. Transcript persistence and reload remain supported through stable Transcript Block identities, but downstream stages must not treat that as permission to serialize the live Composition Tree.
