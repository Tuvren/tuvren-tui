# Vision

## Version

**v3.0.0** — corresponds to the latest entry in `.constitution/prd/changelog.md`.

## Executive summary

Tuvren is a general-purpose terminal UI library for developers building interactive applications such as agent clients, developer tools, dashboards, editors, operational consoles, and forms. It combines an approachable typed SDK with a high-performance built-in runtime so developers can ship polished terminal experiences without learning systems programming, managing a native binary, or accepting the resource costs of a host-only UI stack.

The product addresses a persistent trade-off: terminal developers can choose low-level native toolkits with strong performance, or higher-level SDKs with easier authoring but weaker efficiency, runtime behavior, and diagnostics. Tuvren must make that compromise unnecessary.

## Archetype

- **Primary:** `Library/SDK`
- **Secondary:** `System/Native`
- **Confidence:** `high`
- **Rationale:** The public product is an SDK embedded into applications, so `Library/SDK` governs its adoption, compatibility, and developer-experience contract. A built-in native runtime owns the demanding terminal, text, interaction, and rendering behavior, so `System/Native` adds frame-budget, memory, lifecycle, and platform requirements. Tuvren can create command-line applications, but it is not itself primarily a command-line tool.

## Jobs to be done

### Build a polished terminal application quickly

When I build an interactive terminal application, I want a coherent declarative SDK with strong defaults and an explicit imperative escape hatch, so I can reach a useful result quickly without learning native implementation details.

### Sustain demanding interactive workloads

When my application displays streaming output, large documents, virtual collections, dense panes, or frequent updates, I want responsiveness and memory use to remain predictable, so the terminal experience can serve as the product rather than a temporary prototype.

### Trust behavior across terminal environments

When I distribute a terminal application, I want input, layout, text, accessibility, cleanup, and capability fallback to behave consistently across supported platforms and terminal tiers, so I do not need application-specific terminal workarounds.

### Diagnose behavior without rebuilding the product

When an interface is visually or behaviorally wrong, I want to inspect the relevant component, style source, event path, semantic state, and render cause locally, so I can find and prove a fix without reverse-engineering the runtime.

### Extend the SDK without forking it

When my team develops reusable application patterns, I want to package Components, Commands, Keymaps, helpers, and application services against public contracts, so we can share them without depending on private runtime internals.

## Positioning

For developers who need rich terminal applications with modern SDK ergonomics and native-class efficiency, Tuvren is a general-purpose terminal UI library that offers a preferred declarative workflow, a capable imperative workflow, and a runtime designed for demanding interaction. Unlike host-only UI libraries, Tuvren moves sustained and correctness-sensitive work into its built-in runtime; unlike low-level native toolkits, it does not require application developers to work in a systems language.

## Product principles

- **One obvious starting point:** The default installation and import lead to the preferred declarative workflow; the imperative workflow remains complete and explicit.
- **Native behavior, not native burden:** Developers benefit from native execution but do not manage, extend, or debug the native boundary in ordinary use.
- **General purpose by contract:** Agent consoles and developer tools are representative stress cases, not a specialist product identity.
- **Modern terminals are the moat:** Tuvren takes advantage of detected modern capabilities while preserving a safe compatible tier.
- **Correctness before visual approximation:** Text positions, focus, events, accessibility, cleanup, and data ownership do not degrade to preserve frame rate.
- **Promotion by evidence:** Reusable behavior moves deeper into the runtime only when measurement shows that composition, batching, identity, caching, and delta updates cannot meet the approved budget.
- **Inspectability is part of usability:** Local diagnostics, semantic tests, traces, and performance evidence are product capabilities rather than contributor-only tools.

## Release horizons

| Horizon | Product meaning |
| :-- | :-- |
| `0.1.0` / P0 | The first public pre-GA release. Every P0 capability and release constraint must pass representative public examples and acceptance evidence. |
| `0.2.0` / P1 | The next planned capability wave, including bidirectional text, advanced editor behavior, richer visual surfaces, application orchestration, and assistive-technology bridges. |
| Later / P2 | Evidence-led ecosystem and platform expansion. These items do not delay `0.1.0` or `0.2.0` unless promoted through a later PRD Evolution pass. |
| `1.0.0` | Compatibility guarantees begin only after public feedback validates the SDK contracts. No date is implied. |

## Appendix: Operator preferences

The following user-approved implementation preferences guide downstream Architecture and TechSpec work. They are not product requirements by themselves.

| Area | Preference |
| :-- | :-- |
| Public identity | Product name `Tuvren`; package name `tuvren-tui`; first public release `0.1.0` pre-GA |
| Ordinary installation | `bun add tuvren-tui`, followed by an import and application run |
| Host and engine | TypeScript SDK on Bun, backed by a Rust `cdylib` through `bun:ffi`; Rust is the sole mutable UI authority |
| Declarative model | The bare `tuvren-tui` import is Effect-first and uses JSX as view syntax; Effect is a required peer dependency; the reactive mechanism and Signals remain private |
| Imperative model | The stable imperative foundation is available from `tuvren-tui/imperative`; raw FFI is not public SDK surface |
| Public entrypoints | `tuvren-tui`, `tuvren-tui/jsx-runtime`, `tuvren-tui/jsx-dev-runtime`, `tuvren-tui/testing`, `tuvren-tui/imperative`, and `tuvren-tui/imperative/testing`; no `tuvren-tui/effect` entrypoint |
| Public styling names | `StyleSpec`, `StyleSheet`, `ThemeTokens`, and `ThemeRecipes` |
| Effect-native behavior | Rendering returns an Effect; scoped resources own lifetimes; Commands may return typed interruptible Effects; Streams carry events and external updates; Services and Layers supply dependencies; the native manual clock integrates with Effect TestClock |
| Runtime internals | Taffy for layout and crossterm for terminal integration, subject to downstream verification |
| Terminal protocols | Detection-first support for Kitty keyboard, clipboard, paste, and graphics capabilities; OSC 52 text fallback; Sixel fallback for images where appropriate |
| Supported host release | Bun only for `0.1.0`; preserve an internal host-adapter boundary for later Node.js evaluation; evaluate Deno only with demonstrated demand |
| Supported native targets | glibc Linux x64 and arm64, macOS arm64 and x64, and Windows x64; musl/Alpine is unsupported initially |
| Build environment | `devenv` with Nix |
| Comparative references | Match or beat OpenTUI across representative workloads, remain within the evidence-ratified margin of Ratatui on comparable hot paths, and materially outperform Ink and similar host-only alternatives |
| Local devtools commands | `bunx tuvren dev ENTRY`, `bunx tuvren doctor`, and `bunx tuvren trace view TRACE_FILE`; framework Commands `tuvren.devtools.toggle`, `tuvren.devtools.pick`, `tuvren.devtools.record`, and `tuvren.devtools.saveTrace`; no examples command is approved |
| Reference integration | An OpenCode example may demonstrate performance and developer experience only; it must not imply a supported OpenCode protocol contract |
