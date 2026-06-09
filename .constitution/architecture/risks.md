# Risks

## 0. Version

**v3.5.0** — corresponds to the latest entry in `.constitution/architecture/changelog.md`.

---

## 1. Logical Risks & Technical Debt

### Risk 1 — Centralized Native State Remains a Scaling Constraint

- **Why it matters:** A single native authority keeps semantics simple, but it also means the render and mutation pipeline must remain carefully budgeted as workload density increases.
- **Mitigation or follow-up:** Preserve clear module boundaries, keep diagnostics strong, and treat any move toward background orchestration as an evidence-driven exception rather than a default.

---

### Risk 2 — Rich Text Extensibility Can Reintroduce Host-Side Latency

- **Why it matters:** Built-in formats fit the architecture well, but developer-defined pre-processing can shift expensive work back to the Host Layer.
- **Mitigation or follow-up:** Keep built-in formats native-first and document custom-format caching expectations clearly.

---

### Risk 3 — Handle Space and Lifecycle Discipline Depend on Long-Lived Hygiene

- **Why it matters:** Opaque Handle systems simplify the boundary, but they also make leak detection and lifecycle discipline essential for long-running applications.
- **Mitigation or follow-up:** Preserve explicit destroy semantics, leak warnings, and strong diagnostics around invalid-handle usage.

---

### Risk 4 — Terminal Backend and Capability Variation Remain a Hard External Dependency

- **Why it matters:** The product depends on real terminal behavior that Tuvren does not control.
- **Mitigation or follow-up:** Keep backend abstraction, degrade gracefully, and continue using examples and replay fixtures to catch capability-sensitive regressions.

---

### Risk 5 — Layout and Pane Density Can Push the Intended Workload Envelope

- **Why it matters:** Deeply nested or pane-heavy application shapes are now central to the product identity, which increases pressure on layout and clipping correctness.
- **Mitigation or follow-up:** Preserve subtree invalidation, measure dense examples continuously, and resist feature additions that bypass the existing layout model without evidence.

---

### Risk 6 — Cross-Language Maintenance Cost Is Real Even When Performance Wins

- **Why it matters:** A cross-language framework gains performance and ergonomics, but it also carries more boundary contracts, packaging surface, and testing responsibility than a single-language framework.
- **Mitigation or follow-up:** Keep the facade narrow, maintain strong integration tests, and document the boundary contract rigorously.

---

### Risk 7 — Background Rendering Remains Tempting but Semantically Expensive

- **Why it matters:** Background rendering can look attractive under benchmark pressure but can easily undermine event ordering, state visibility, and terminal lifecycle guarantees.
- **Mitigation or follow-up:** Preserve synchronous rendering as the default contract and require benchmark, semantic, and shutdown parity before any promotion of experimental threading.

---

### Risk 8 — Host-Layer Framework Growth Can Reintroduce Split-Brain State

- **Why it matters:** Commands, keymaps, Effect integration, and plugin slots increase framework ergonomics, but they also increase the risk that host-side orchestration quietly starts owning mutable UI semantics that the architecture reserves for the Native Core.
- **Mitigation or follow-up:** Treat host-side framework services as orchestration over the existing command protocol only. Plugin slots are allowed pre-GA after commands/keymaps and Effect stabilize, but they must remain bounded contribution points rather than alternate Widget state authorities.

---

### Risk 9 — Hard-Cut Rename and Productization Work Can Fracture Delivery

- **Why it matters:** The move from Kraken to Tuvren, combined with package and release-contract changes, creates a real chance of shipping a stronger architecture behind a weaker public install story if the cutover is partial or incoherent.
- **Mitigation or follow-up:** Keep identity, package topology, SDK productization, release automation, diagnostics, and onboarding aligned across the canonical document chain. Epic P shipped the rename and package topology, Epic Q shipped adoption positioning, Epic U owns expert-level SDK productization, and Epic V owns first public npm publish plus feedback.
