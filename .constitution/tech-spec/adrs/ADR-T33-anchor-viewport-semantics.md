# ADR-T33: Anchor-Based Viewport Semantics Override Raw Scroll Position

- **Status:** accepted
- **Context:** Raw row offsets drift under streaming inserts, collapse toggles, and pane resize. Transcript and log workflows need deterministic sticky-bottom behavior and predictable detached reading.
- **Decision:** Track transcript follow behavior through `FollowMode`, logical anchor semantics, unread anchors, and explicit jump commands rather than raw row offsets as the primary contract.
- **Consequences:** Operators can remain detached from the tail without losing context. Transcript state must track viewport height and width, unread state, and anchor mode carefully. Replay fixtures and example tests become essential to prevent subtle regressions.
