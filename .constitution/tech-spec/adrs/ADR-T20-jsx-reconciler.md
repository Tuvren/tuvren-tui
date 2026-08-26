# ADR-T20: JSX Reconciler Wraps Imperative Command Protocol

- **Status:** superseded by ADR-T50 and ADR-T51
- **Supersession:** JSX remains view syntax, but the Effect-first surface, private Reactivity, and UI executor replace the public JSX/Signal overlay described here.
- **Context:** The JSX reconciler must provide a declarative surface without becoming a second mutable runtime authority.
- **Decision:** The JSX reconciler wraps the imperative command protocol rather than replacing it. All widget mutations flow through the same host-to-native command path that imperative code uses.
- **Consequences:** Declarative usage remains an overlay on top of the same host/native contract. There is no separate reactive state authority in the Native Core.
