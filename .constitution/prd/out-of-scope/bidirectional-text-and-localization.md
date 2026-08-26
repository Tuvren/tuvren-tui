# Bidirectional text and localization

- **Context:** International use requires both correct bidirectional or right-to-left text behavior and application-facing localization workflows.
- **Decision:** Bidirectional and right-to-left text is deferred to P1 `0.2.0`; a first-party localization framework is deferred pending demand.
- **Reason:** Bidirectional behavior affects measurement, cursor movement, selection, hit-testing, wrapping, and editing and must build on the P0 grapheme contract. Localization policy belongs primarily to applications until repeated SDK-level needs are demonstrated.
- **Consequences:** P0 must remain Unicode- and grapheme-correct but must not claim bidirectional layout support. Downstream stages must not invent a localization framework without a later PRD Evolution pass.
