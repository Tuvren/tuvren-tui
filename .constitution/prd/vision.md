# Vision

## 0. Version

**v2.7.0** — corresponds to the latest entry in `.constitution/prd/changelog.md`.

---

## 1. Executive Summary & Target Archetype

- **Target Archetype:** General-purpose terminal UI framework and SDK for TypeScript-first developers, with a productized imperative core as the approved public release direction and Bun-native ergonomics in the current runtime posture.
- **Vision:** Terminal interface development becomes as productive as web UI development without sacrificing performance, inspectability, or the ability to ship demanding terminal products from a TypeScript workflow.
- **Problem:** Developers building terminal applications in the TypeScript ecosystem still face a forced trade-off between ergonomic but resource-heavy solutions, performant but ergonomically hostile primitives, and toolkit surfaces that do not feel productized or extensible enough to trust for real application delivery.

---

## 2. Jobs to Be Done (JTBD)

### Primary
> "When building interactive terminal applications in TypeScript, I want a general-purpose framework with composable interface primitives, native performance, and productized release ergonomics, so I can ship polished terminal apps in hours instead of days without dropping into a systems-language-heavy workflow."

### Secondary
> "When building demanding terminal products such as agent consoles, operator dashboards, repo inspectors, or other information-dense tools, I want the same framework to stay stable under streaming output, long transcripts, dense panes, and heavy inspection surfaces."

### Tertiary
> "When using Bun as my primary runtime, I want a TUI framework designed for Bun's foreign-function model from day one, so I don't fight compatibility shims or WASM overhead."

---

## 3. Product Posture

- **Current Product Emphasis:** Tuvren tells a general-purpose framework story. Its showcase and proving grounds remain demanding agentic and developer-facing products because those workloads stress the performance, viewport, and inspectability requirements that motivated the project in the first place.
- **JTBD Priority Order:** Ship Faster > Productized Trust > Framework Foundations > Bun-native DX > Own the Full Stack

---

## 4. Capability Roadmap Context

| Wave | Scope Emphasis | Summary |
| --- | --- | --- |
| **v0** | Core interaction surface | Widget composition, layout, styling, keyboard and mouse input, scrolling, cross-platform terminal handling, and rich text rendering |
| **v1** | Product polish | Animation system and theming foundation |
| **v2** | Hardening and advanced DX | Core hardening, tree operations for reconciler support, theme inheritance, TextArea, choreography, lightweight JSX reconciler, and foundational accessibility |
| **v3** | Productization and framework foundations | Public rename to Tuvren, package topology, onboarding polish, general-purpose framework positioning, and the queued command/keymap foundation wave |
| **v4** | Declarative and extensibility expansion | Effect-based declarative integration and pre-GA plugin-slot boundaries once command/keymap foundations stabilize |
| **v5** | SDK productization and public pre-GA release | Expert-level SDK DX across imperative, JSX, Effect, plugin, composite, example, and devtools surfaces, followed by the first public npm release as `0.1.0` and a feedback loop before any `v1.0` compatibility guarantees |

---

## 5. Brownfield Transition Note

- **Public name:** `Tuvren` / `tuvren-tui` (Epic P shipped the hard-cut rename)
- **Current source-tree reality:** The repo, packages, examples, and release workflow use `Tuvren` / `tuvren-tui` naming. The rename from Kraken is complete as of Epic P.
- **Planning rule:** This PRD governs the future public product direction. Downstream artifacts must keep the current Brownfield naming explicit anywhere implementation reality still differs.

---

## Appendix: Operator Preferences

_The following are developer-stated implementation preferences. They are preserved for downstream stages but are not product requirements by themselves._

| Preference | Value |
| --- | --- |
| Future public product name | `Tuvren` |
| Future public package name | `tuvren-tui` |
| Hosting organization move | Complete; canonical remote is `Tuvren/tuvren-tui` |
| First public npm release | `0.1.0` pre-GA after SDK productization; `v1.0` compatibility guarantees come later |
| Core implementation language | Rust |
| Target runtime | Bun |
| FFI mechanism | `bun:ffi` |
| Layout engine | Taffy |
| Terminal backend | crossterm |
| Future declarative path | Imperative core remains canonical; declarative integration should center on `Effect`, not React or Solid parity |
| Build artifact | `cdylib` |
| Dev environment | `devenv` (Nix) |
