# Select search and filter

- **Context:** The first Select Component could include an integrated searchable or filterable interaction mode.
- **Decision:** Deferred pending representative application evidence.
- **Reason:** P0 already supplies Select, Command Palette, Text Document input, Commands, and Virtual Collection behavior. Usage must show whether one integrated Select contract improves consistency more than composition does.
- **Consequences:** P0 Select must provide correct selection, focus, controlled and uncontrolled state, accessibility, and virtualization where needed. Downstream stages must not make integrated search a `0.1.0` release gate.
