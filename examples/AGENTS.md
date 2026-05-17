# AGENTS.md — Examples Usage Guide

Practical lessons from building Tuvren examples. Follow these when creating or modifying examples.

## Quick Start

```bash
# Build the native core first (source checkout)
cargo build --manifest-path native/Cargo.toml --release
bun install --cwd ts  # once after clone

bun run examples/<example>.ts
```

## Example Tiers

Tuvren ships two tiers of examples. Both use the same framework and the same public API — the distinction is workload intensity, not capability category.

### General-purpose framework demos

These show Tuvren doing what most TypeScript developers reach for first: dashboards, editors, inspectors, and interactive CLI surfaces. A good starting point for evaluating the framework.

| File | API | Demonstrates |
|------|-----|-------------|
| `demo.ts` | Imperative | Box, Text, Input, Select, ScrollBox — imperative composition, event loop, theme switching |
| `migration-jsx.tsx` | JSX | Same application as `demo.ts` rewritten with JSX + signals |
| `showcase.ts` | JSX | Signals, animations, choreography, runtime tree mutations, TextArea, multiple themes |
| `system-monitor.ts` | Imperative | All 10 core widgets (Box, Text, Input, TextArea, Select, ScrollBox, Table, List, Tabs, Overlay), 4 themes, animations |
| `accessibility-demo.tsx` | JSX | Roles, labels, descriptions, and accessibility event routing |

### Flagship workload demos

These run Tuvren at its most demanding: continuous streaming output, long-lived transcripts, dense multi-pane layouts, real-time devtools inspection, and CommandPalette navigation — all active simultaneously. They are not a narrow special-case category. They are the most complete proof that the general-purpose framework holds up under the conditions that typically break lightweight terminal UI toolkits: host-side tree churn, viewport stability under streaming, and multi-pane interaction surfaces.

| File | API | Demonstrates |
|------|-----|-------------|
| `agent-console.ts` | Imperative | TranscriptView, SplitPane, TracePanel, CommandPalette, AG-UI replay, devtools overlays |
| `ops-log-console.ts` | Imperative | StructuredLogView, follow mode, level and search filtering, dev overlays |
| `repo-inspector.ts` | Imperative | CodeView, DiffView, nested SplitPane, List navigation, CommandPalette, filesystem integration |

## Core Invariants

1. Rust owns mutable UI state. TypeScript controls via handles and FFI.
2. Handle `0` is invalid/sentinel.
3. `Tuvren.init()` must be called before creating any widgets or themes.
4. Always call `app.shutdown()` on exit.

## Lessons Learned

1. **Init before resources** — `Theme.create()`, widget constructors, etc. all require an initialized context.

2. **Normalize built-in themes for demos** — Built-in themes can over-apply defaults (especially borders). Set `theme.setTypeBorderStyle(nodeType, "none")` explicitly and add borders only where intentional.

3. **Give Text nodes explicit heights** — Status, header, and label rows can collapse without explicit `height: 1`.

4. **Keep animations structural vs. decorative** — Use `positionX/Y` only for intentional movement. Prefer `opacity`, `fgColor`, and `borderColor` for subtle interactive feedback.

5. **Use ASCII spinners for portability** — Unicode spinner glyphs degrade on some fonts. Use `|`, `/`, `-`, `\\` driven by `onTick`.

6. **Theme-dependent contrast** — Light and dark themes need per-surface color overrides. Set explicit colors by theme mode for readability.

7. **Seed TextArea content** — Don't expect users to type test data. Pre-fill with long lines so wrap toggling is obvious.

8. **Keep logs useful** — Log actions (`theme switched`, `subtree inserted`) but avoid flooding with redundant entries.

9. **Cleanup on exit** — Destroy custom themes and runtime subtrees before `app.shutdown()`.

## Construction Pattern

1. `const app = Tuvren.init()`
2. Create custom themes and normalize defaults
3. Build widget tree (imperative or JSX with signals)
4. `app.setRoot(root)` or `render(tree, app)`
5. Create event loop: `createLoop()` or `app.run()` or manual `while` loop
6. Handle events and update state in `onTick`
7. Cleanup and `app.shutdown()`

## When To Use Low-Level FFI

Use the wrapper API first. Use `ffi.*` directly only when the wrappers do not expose a needed operation (for example, querying selected option text). Isolate FFI helpers and route state changes through the high-level API whenever possible.
