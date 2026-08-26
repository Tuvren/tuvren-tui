# ADR-T45: Effect Is the Sanctioned Declarative Integration Path

- **Status:** superseded by ADR-T50
- **Supersession:** Effect moves from a separate sanctioned subpath to the bare default entrypoint, and root Signals become private implementation detail.
- **Context:** The current repo ships an imperative core and a lightweight JSX/signals overlay, while the strategic product direction explicitly rejects React/Solid parity as the main declarative roadmap.
- **Decision:** Keep the imperative/runtime authority in the native core and make `tuvren-tui/effect` the sanctioned package-first declarative surface over the same Bun and FFI contract. The existing root JSX/signals exports remain supported Brownfield reality, but they are secondary to the Effect package rather than the strategic north star.
- **Consequences:** Declarative consumers get a real package surface instead of a thin adapter. The core package still avoids absorbing a second mutable runtime. Epic S must shape `tuvren-tui/effect` as a self-contained authoring path.
