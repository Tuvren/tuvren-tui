# Capabilities

## 1. Functional Capabilities

Grouped by Epic. Each capability is technology-agnostic.

---

### Epic 1 — Widget Composition

- **Priority:** P0
- **Capability:** A Developer can create atomic visual elements for display, input, selection, and scrolling.
- **Capability:** A Developer can compose Widgets into hierarchical layouts of arbitrary depth.
- **Capability:** A Developer can add and remove Widgets from the Composition Tree at runtime.
- **Capability:** A Developer can set and update Widget content dynamically.
- **Rationale:** Without fast composition, the framework fails its primary job of helping Developers ship polished terminal interfaces in hours instead of days.

---

### Epic 2 — Spatial Layout

- **Priority:** P0
- **Capability:** A Developer can define spatial relationships between Widgets using Flexbox-compatible Layout Constraints such as direction, alignment, justification, and gap.
- **Capability:** A Developer can specify dimensional bounds including fixed, percentage, min/max, flex-grow, and flex-shrink behavior.
- **Capability:** Layout resolves automatically on Composition Tree mutation without Developer intervention.
- **Capability:** Layout adapts to Surface dimensions, including terminal resize.
- **Rationale:** Familiar layout semantics are central to Tuvren's promise of web-like productivity in a terminal environment.

---

### Epic 3 — Visual Styling

- **Priority:** P0
- **Capability:** A Developer can apply foreground and background color to any Widget using named colors, hex values, and the 256-color palette.
- **Capability:** A Developer can apply text decoration such as bold, italic, and underline.
- **Capability:** A Developer can apply border styles to container Widgets.
- **Capability:** A Developer can batch multiple style mutations into a single Render Pass.
- **Rationale:** Terminal applications must still look polished and legible to compete with web dashboards and desktop tooling.

---

### Epic 4 — Input & Focus

- **Priority:** P0
- **Capability:** An End User can type text into input Widgets via keyboard.
- **Capability:** An End User can navigate between interactive Widgets via keyboard-driven focus traversal in depth-first, DOM-order sequence.
- **Capability:** An End User can select from a list of options using arrow keys and Enter.
- **Capability:** A Developer can subscribe to keyboard Events on any Widget.
- **Capability:** An End User can click a Widget to focus it.
- **Capability:** An End User can scroll via mouse wheel within scrollable regions.
- **Capability:** A Developer can subscribe to mouse Events such as click and scroll on any Widget.
- **Capability:** The system performs hit-testing to route mouse Events to the correct Widget in the Composition Tree.
- **Rationale:** Real terminal applications live or die on input correctness, focus predictability, and low-friction event handling.

---

### Epic 5 — Scrollable Regions

- **Priority:** P0
- **Capability:** A Developer can designate a container Widget as scrollable when content exceeds its bounds.
- **Capability:** An End User can scroll through overflow content via keyboard or mouse.
- **Capability:** Scroll position is maintained across Render Passes.
- **Rationale:** Streaming logs, transcripts, and dense inspection surfaces require reliable viewport behavior to be usable.

---

### Epic 6 — Cross-Platform Terminal Abstraction

- **Priority:** P0
- **Capability:** The system operates on major OS families without platform-specific Developer code.
- **Capability:** The system adapts to terminal capabilities such as color depth and dimensions.
- **Capability:** The system manages terminal mode lifecycle, including raw mode and alternate screen handling, transparently.
- **Rationale:** A terminal UI framework that requires platform-specific application code fails the "ship faster" promise for OSS and team adoption.

---

### Epic 7 — Rich Text Rendering

- **Priority:** P0
- **Capability:** A Developer can render Markdown-formatted text within a Widget.
- **Capability:** A Developer can render syntax-highlighted code blocks within a Widget.
- **Capability:** The system parses rich text formats into styled spans without Developer intervention.
- **Capability:** A Developer can extend the parsing pipeline with custom format handlers.
- **Rationale:** Developer tools, agent interfaces, and dense dashboards all depend on rich textual presentation rather than plain strings alone.

---

### Epic 8 — Animation

- **Priority:** P1
- **Capability:** A Developer can define timed transitions on Widget properties such as opacity and foreground, background, or border color.
- **Capability:** The system provides built-in animation primitives such as spinners, progress indicators, and pulsing states.
- **Capability:** Animations are frame-budget-aware and degrade gracefully under load.
- **Capability:** A Developer can cancel or chain animations programmatically.
- **Rationale:** Motion is a polish and feedback layer, not the critical path, but it materially improves perceived quality for interactive apps.

---

### Epic 9 — Theming

- **Priority:** P1
- **Capability:** A Developer can define a Theme as a named collection of Style defaults.
- **Capability:** A Developer can apply a Theme to a subtree of the Composition Tree.
- **Capability:** A Developer can switch Themes at runtime without rebuilding the Composition Tree.
- **Capability:** The system provides a constraint-based Theme inheritance model for nested subtrees.
- **Capability:** The system ships with at least two built-in Themes: light and dark.
- **Rationale:** Theming improves reuse, consistency, and adaptation across applications without forcing Developers to restyle every Widget manually.

---

### Epic 10 — Productized Installation & Release Trust

- **Priority:** P0
- **Capability:** A Developer can install the framework on supported platforms without requiring a local Rust toolchain in the ordinary public install path.
- **Capability:** A Developer receives actionable diagnostics when the native layer cannot be found or loaded.
- **Capability:** Release artifacts, package naming, and platform support feel stable and trustworthy enough for the framework to be adopted in production terminal applications.
- **Rationale:** A framework cannot compete credibly at product level if its install, release, and runtime-loading story feels like a source-checkout-only developer experience.

---

### Epic 11 — Commands & Keymap Foundations

- **Priority:** P0
- **Capability:** A Developer can define reusable commands and trigger them through keyboard-driven keymaps without reimplementing focus-aware dispatch and command routing in every app.
- **Capability:** The framework provides a consistent foundation for command palettes, keyboard shortcuts, and other application-level interaction patterns over the same core runtime.
- **Rationale:** Moving from a productized imperative core to a competitive framework requires first-class application orchestration primitives, and commands plus keymaps are the minimum viable moat for that transition.

---

### Epic 12 — Package-First Effect Application Surface

- **Priority:** P1
- **Capability:** A Developer can build ordinary Tuvren applications primarily from `tuvren-tui/effect` without routine knowledge of raw Handles, manual loop setup, or root imperative lifecycle wiring.
- **Capability:** `tuvren-tui/effect` acts as a self-contained package surface with JSX authoring, package-owned commands and keybindings, testing helpers, and advanced escape hatches over the same native runtime authority.
- **Rationale:** A competitive framework needs a real declarative package in the role that other ecosystems reserve for their primary authoring packages, while still keeping Rust as the mutable runtime authority.

---

### Epic 13 — Extension Slots and Framework Contributions

- **Priority:** P1
- **Capability:** A Developer can extend framework-level services through bounded contribution points for commands, keymaps, command palettes, devtools panels, themes, and showcase/example integrations.
- **Capability:** Extension slots remain pre-GA and explicitly do not create `v1.0` compatibility guarantees before the product has real public feedback.
- **Rationale:** Extension boundaries need to exist before public adoption grows, but they must be shaped after commands/keymaps and declarative integration so the framework does not lock in the wrong host-service contract.

---

### Epic 14 — Expert-Level SDK Developer Experience

- **Priority:** P0
- **Capability:** A Developer can build polished TUIs through the public SDK without routine knowledge of Rust internals, raw FFI calls, numeric Handles, or native lifecycle details.
- **Capability:** Imperative, JSX, Effect, plugin, composite, example, and devtools surfaces feel coherent, documented, and production-grade before the first public npm release.
- **Rationale:** Public publishing should expose a framework-quality SDK, not merely a strong native engine with bindings.
