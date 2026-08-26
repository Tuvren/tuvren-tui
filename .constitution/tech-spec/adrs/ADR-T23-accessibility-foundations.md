# ADR-T23: Accessibility Foundations on TuiNode

- **Status:** superseded by ADR-T54 and ADR-T56
- **Supersession:** P0 requires a complete Semantic Tree, states, relationships, announcements, snapshots, and conformance rather than optional metadata alone.
- **Context:** Foundational accessibility support is needed without redefining the render pipeline.
- **Decision:** Accessibility foundations live on `TuiNode` as optional `role`, `label`, and `description` metadata. These are stored as optional fields on the node and exposed through the event and diagnostics surface.
- **Consequences:** Foundational accessibility remains available without redesigning the widget state model. Full screen-reader integration is deferred to v2 per the non-functional constraints.
