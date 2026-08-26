# ADR-T36: Flagship Examples Are Blocking Release Gates

- **Status:** superseded by ADR-T57
- **Supersession:** Every P0 capability now requires public evidence, and the flagship matrix includes dashboard/form, editor/inspector, streaming, inline/split, styling, accessibility, devtools, and OpenCode reference workloads.
- **Context:** Feature breadth alone does not prove product identity. The framework needs example-driven proof under transcript, pane, and debugging pressure.
- **Decision:** Treat `agent-console` and `ops-log-console` as blocking proof examples for the transcript/devtools wave, and keep `repo-inspector` within the same flagship family once the underlying primitives are stable.
- **Consequences:** Example behavior now constrains implementation choices. Replay fixtures, performance budgets, and example usability are part of release-readiness, not optional showcase material.
