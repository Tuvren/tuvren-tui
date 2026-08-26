# Background rendering as a default contract

- **Context:** Rendering could run in parallel with application work or UI mutation.
- **Decision:** Rejected for the current product contract.
- **Reason:** Applications need concurrent asynchronous work, but parallel mutable UI authority would complicate ordering, state visibility, terminal ownership, failure recovery, and shutdown. The product requirement is deterministic serialized UI behavior, not background rendering.
- **Consequences:** Downstream stages must not make multithreaded UI mutation or background rendering part of the public contract. A future experiment requires benchmark, semantic, and lifecycle evidence plus a PRD Evolution pass.
