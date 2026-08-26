# ADR-T33: Anchor-Based Viewport Semantics Override Raw Scroll Position

- **Status:** accepted
- **Context:** Raw row offsets drift under streaming inserts, collapse toggles, and pane resize. Transcript and log workflows need deterministic sticky-bottom behavior and predictable detached reading.
- **Decision:** Track Transcript follow behavior through stable block identities, logical anchors, protected visible and selected ranges, unread state, and explicit live-edge commands rather than raw row offsets. Controlled mode keeps durable history in the application; bounded-local mode owns only its declared resident history.
- **Consequences:** End Users can remain detached from the tail without losing context, and eviction cannot silently delete the application's only history. Generation, eviction, reload, resize, collapse, selection, and streaming cases require deterministic replay fixtures.
