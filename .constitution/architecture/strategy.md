# Strategy

## 0. Version

**v3.5.0** — corresponds to the latest entry in `.constitution/architecture/changelog.md`.

---

## 1. Architectural Pattern & Archetype Alignment

- **Architectural Pattern:** Modular monolith with a cross-language facade.
- **Why this pattern fits:** Tuvren is a single-process framework rather than a networked product. The PRD asks for native performance, low memory use, and fast developer onboarding; a modular monolith avoids the operational premium of distributed systems while still preserving clean boundaries between the native performance engine and the host-facing API.
- **Core trade-offs accepted:** The architecture favors explicit host-driven control over hidden background orchestration, keeps all mutable UI state in one native authority, and accepts a tighter internal coupling inside the native core in exchange for lower latency and a smaller foreign-function surface.

---

## 2. Core Architectural Invariant

- **Invariant:** The Native Core is the performance engine; Host Language Bindings are the steering layer.
- **Meaning:** Layout computation, tree traversal, buffer diffing, text parsing, hit-testing, scroll semantics, and event classification remain in the Native Core. The Host Layer stays responsible for ergonomics, application loop policy, developer-assigned identifiers, and composition patterns built on top of the command protocol.

---

## 3. Architectural Rationale

- The cross-language split preserves one performance-critical authority while letting Developers work from a familiar host language API.
- The facade boundary prevents internal native module complexity from leaking into application code.
- The host-driven render and event loop model keeps state visibility and terminal lifecycle explicit, which matters for deterministic debugging and long-lived workflows.

---

## 4. Current Architectural Emphasis

| Emphasis | Choice | Why it matters |
| --- | --- | --- |
| **General-purpose framework posture** | Keep the architecture broad enough for general terminal application shapes instead of treating one showcase workload as the whole product definition. | The product story now targets a framework, not only a specialist library. |
| **Flagship demanding workloads** | Continue treating long-lived transcript, log, trace, and pane-heavy surfaces as the proving grounds that validate the broader framework design. | Agentic and operator-style products still justify the hardest architectural requirements. |
| **Anchor-aware viewports** | Prefer logical viewport anchors, unread markers, and nested-scroll handoff over raw row-offset management where streaming surfaces require it. | The general-purpose story must still survive demanding update churn in flagship workloads. |
| **Developer tooling as product work** | Treat overlays, snapshots, traces, and inspection surfaces as architecture-level concerns. | The framework must be inspectable before it can be dependable. |
| **Host-layer framework services** | Commands, keymaps, Effect integration, and pre-GA plugin slots belong in the Host Layer over the same native authority rather than as parallel mutable runtimes. | The framework needs application-level ergonomics without weakening the native-state invariant. |
| **SDK productization as architecture work** | Handle-safe event ergonomics, lifecycle clarity, wrapper completeness, examples, diagnostics, and devtools polish are treated as architectural adoption work before public npm publish. | A competitive framework needs a trustworthy developer surface, not only a strong engine. |
| **Productization as release work** | Distribution, install trust, release verification, and feedback intake remain architecture-governed workstreams, but first npm publish is deferred until after SDK productization. | Public `0.1.0` should expose a credible pre-GA framework while preserving pre-`1.0` flexibility. |

---

## 5. Brownfield Transition Note

- **Public product name:** `Tuvren` (Epic P shipped the hard-cut rename)
- **Current source-tree reality:** The repo now lives at `Tuvren/tuvren-tui`; package names, examples, and release workflow use `Tuvren` / `tuvren-tui` naming. The rename from Kraken is complete as of Epic P, and the GitHub organization move is complete as pre-Epic-R operational cleanup.
- **Current framework-service reality:** Epic R and Epic S are both shipped. Commands/keymaps already live in the Host Layer, and `tuvren-tui/effect` now provides the real package-first authoring surface over the same native authority rather than an adapter-like helper layer.
- **Architectural interpretation:** The logical design is governed by the public framework direction. Downstream artifacts must distinguish current Brownfield naming from approved future-state naming where the two still differ.
