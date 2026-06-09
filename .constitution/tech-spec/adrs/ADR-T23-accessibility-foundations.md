# ADR-T23: Accessibility Foundations on TuiNode

- **Status:** accepted
- **Context:** Foundational accessibility support is needed without redefining the render pipeline.
- **Decision:** Accessibility foundations live on `TuiNode` as optional `role`, `label`, and `description` metadata. These are stored as optional fields on the node and exposed through the event and diagnostics surface.
- **Consequences:** Foundational accessibility remains available without redesigning the widget state model. Full screen-reader integration is deferred to v2 per the non-functional constraints.
