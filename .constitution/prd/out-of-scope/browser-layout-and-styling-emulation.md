# Browser layout and styling emulation

- **Context:** Tuvren could reproduce general browser document flow, floats, text-based style parsing, arbitrary relationship selectors, global class matching, specificity, and a general media-query language.
- **Decision:** Rejected for the current roadmap.
- **Reason:** Terminal applications need deterministic layout and native state or capability conditions, not an open-ended browser document and cascade model. Emulation would add ambiguity and runtime cost without improving the approved Component styling contract.
- **Consequences:** Downstream stages must implement only the approved Flexbox, Grid, absolute positioning, typed StyleSpec, restricted StyleSheet, responsive, and precedence outcomes. A general browser-compatibility goal requires a PRD Evolution pass.
