# Tuvren TUI

General-purpose terminal UI framework for TypeScript/Bun. Native Rust performance, Flexbox layout, and productized ergonomics for building polished terminal applications without a systems-language workflow.

**Status:** Pre-1.0 (`0.1.0`) — actively evolving; breaking changes are possible before `v1.0`.

## Install

Once `tuvren-tui` is published to the npm registry (Epic V first public pre-GA release, Bun ≥ 1.1 required):

```bash
bun add tuvren-tui
```

The native library resolves automatically on supported platforms (`linux-x64`, `linux-arm64`, `darwin-arm64`, `darwin-x64`, `win32-x64`) through the platform-specific auxiliary package installed alongside `tuvren-tui`. If the native layer cannot be found, Tuvren emits an actionable diagnostic with remediation steps.

> **Pre-1.0 note:** Neither `tuvren-tui` nor the `@tuvren` auxiliary packages are on the npm registry yet — binary publishing is deferred until after the SDK productization pass and is planned as `0.1.0` pre-GA. Until then, use the [source checkout path](#development-source-checkout) to build and run Tuvren locally.

## Hello World

Create `hello.ts`:

```ts
import { Tuvren, Box, Text, KeyCode } from "tuvren-tui";

const app = Tuvren.init();

const root = new Box({
  width: "100%",
  height: "100%",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
});

const label = new Text({
  content: "Hello, Tuvren!",
  fg: "#00FF88",
  bold: true,
  height: 1,
});

root.append(label);
app.setRoot(root);

let running = true;
while (running) {
  app.readInput(16);
  for (const event of app.drainEvents()) {
    if (event.type === "key" && event.keyCode === KeyCode.Escape) {
      running = false;
    }
  }
  app.render();
}

app.shutdown();
```

Run it:

```bash
bun run hello.ts
```

Press **Esc** to exit. From install to a running terminal app in under 15 minutes.

## Effect Package

Tuvren ships `tuvren-tui/effect` as the package-first declarative authoring surface over the same native runtime.

Install the official `effect` package when you want this path:

```bash
bun add tuvren-tui effect
```

```tsx
/** @jsxImportSource tuvren-tui/effect */

import {
  Box,
  Text,
  KeyCode,
  computed,
  render,
  useCommand,
  useKeyboard,
  useKeybinding,
  useSignal,
  useTerminalSize,
  useTuvren,
} from "tuvren-tui/effect";

function App() {
  const runtime = useTuvren();
  const count = useSignal(0);
  const status = useSignal("Press i to increment, q or Esc to quit.");
  const size = useTerminalSize();

  useCommand({
    id: "app.increment",
    title: "Increment counter",
    run: () => {
      count.value += 1;
      status.value = "Incremented via package-owned command.";
    },
  });
  useKeybinding({ command: "app.increment", key: "i" });
  useKeyboard((event) => {
    if (event.keyCode === KeyCode.Escape || event.codepoint === "q".codePointAt(0)) {
      runtime.stop();
    }
  });

  return (
    <Box width="100%" height="100%" padding={1} gap={1} flexDirection="column">
      <Text content={computed(() => `Count: ${count.value}`)} fg="#7dd3fc" height={1} />
      <Text content={computed(() => `Terminal: ${size.value.width}x${size.value.height}`)} height={1} />
      <Text content={status} height={1} />
    </Box>
  );
}

await render(() => <App />);
```

The package story is intentionally Tuvren-native: `tuvren-tui/effect` owns authoring ergonomics, commands, keybindings, hooks, and testing helpers, while Rust remains the single mutable UI authority underneath.

## JSX + Signals

Tuvren also supports a JSX + `@preact/signals-core` reconciler for signal-driven interfaces:

```tsx
import { Tuvren, signal, computed, render, createLoop, KeyCode } from "tuvren-tui";
import { jsx } from "tuvren-tui/jsx-runtime";

// tsconfig: { "jsx": "react-jsx", "jsxImportSource": "tuvren-tui" }

const count = signal(0);
const label = computed(() => `Ticks: ${count.value}`);
const app = Tuvren.init();

// In .tsx files the compiler picks jsx/jsxs automatically.
// When calling the factory directly: jsx() for one child, jsxs() for many.
const tree = jsx("Box", {
  width: "100%",
  height: "100%",
  flexDirection: "column",
  children: jsx("Text", {
    key: "label",
    content: label,
    fg: "#00FF88",
    height: 1,
  }),
});

render(tree, app);

const loop = createLoop({
  app,
  onEvent(event) {
    if (event.type === "key" && event.keyCode === KeyCode.Escape) {
      loop.stop();
    }
  },
  onTick() {
    count.value++;
  },
});

await loop.start();
app.shutdown();
```

## What Tuvren Ships

### Native widgets

| Widget | Description |
|--------|-------------|
| `Box` | Layout container with Flexbox semantics |
| `Text` | Rich text: plain, Markdown, and syntax-highlighted code |
| `Input` | Single-line keyboard input |
| `TextArea` | Multiline editable buffer with wrap control |
| `Select` | Arrow-key option selector |
| `ScrollBox` | Scrollable content viewport |
| `Table` | Tabular data display |
| `List` | Navigable item list |
| `Tabs` | Tab bar with switchable panels |
| `Overlay` | Floating layer over the main composition |
| `TranscriptView` | Long-lived streaming log with anchor-based viewport semantics |
| `SplitPane` | Resizable pane pairs for dense multi-panel layouts |

### Host composites

| Composite | Description |
|-----------|-------------|
| `CommandPalette` | Floating command search built from `Overlay`, `Input`, and `List` |
| `TracePanel` | Structured trace viewer over `TranscriptView` |
| `StructuredLogView` | Log-stream surface with follow mode and level filtering |
| `CodeView` | Scrollable syntax-highlighted code display |
| `DiffView` | Side-by-side or inline diff surface |

### Framework services

| Service | Description |
|---------|-------------|
| `CommandRegistry` | Register typed commands with IDs, titles, run handlers, categories, and `when` predicates |
| `KeymapRegistry` | Bind key strings (`ctrl+c`, `escape`, `f5`, `q`) to command IDs; first-registered wins |
| `CommandDispatcher` | Wire a registry + keymap into `app.run()` or `createLoop()` for automatic dispatch |
| `tuvren-tui/effect` | Package-first Effect authoring surface with `render()` / `testRender()`, JSX runtime exports, package-owned command/keybinding hooks, and advanced lifecycle helpers |

**Commands & keymap quick start:**

```ts
import { Tuvren, CommandRegistry, KeymapRegistry, CommandDispatcher, Box, KeyCode } from "tuvren-tui";

const app = Tuvren.init();
const root = new Box();
app.setRoot(root);

const registry = new CommandRegistry();
const keymaps = new KeymapRegistry();

registry.register({ id: "app.quit", title: "Quit", run: () => app.stop() });
keymaps.register({ command: "app.quit", key: "q" });

// CommandDispatcher wires keymaps to the registry automatically in its constructor
const dispatcher = new CommandDispatcher(registry, keymaps, app);
await app.run({ commandDispatcher: dispatcher });
app.shutdown();
```

The `CommandPalette` composite connects to a `CommandRegistry` directly:

```ts
const palette = new CommandPalette({ registry, app });
// Open the palette from a key event; executeSelected() routes through the registry.
```

### Platform and DX features

- **Flexbox layout** via Taffy — directional, aligned, justified, with gap support
- **Incremental rendering** with double-buffered dirty-region diffing
- **Keyboard and mouse** — focus traversal, hit-testing, scroll routing
- **Rich text** — Markdown and syntax highlighting out of the box
- **Theming** — built-in dark/light themes, per-node-type style defaults, runtime switching
- **Animation** — easing, chaining, choreography groups, position offsets
- **JSX reconciler** — `@preact/signals-core` signals drive the composition tree
- **Runner API** — `app.run()` and `createLoop()` manage the event loop for you
- **Commands & keymaps** — typed command registry, key binding resolver, and auto-dispatch in the runner loop
- **Accessibility foundation** — roles, labels, descriptions, accessibility events
- **Devtools** — layout overlays, snapshots, traces, perf counters, dev sessions
- **Native artifact resolver** — `TUVREN_LIB_PATH` → aux scoped package → local Cargo build

## Examples

Two tiers of examples ship with the repo.

**General-purpose framework demos** show how Tuvren handles dashboards, inspectors, editors, and interactive CLI surfaces — the use cases most TypeScript developers reach for first.

**Flagship workload demos** push Tuvren at its most demanding: continuous streaming output, long-lived transcripts, dense multi-pane layouts, and real-time inspection surfaces. They are not a narrow special case — they are proof that the same general-purpose framework holds up under the harshest real workloads.

All examples require a native build first (source checkout path):

```bash
cargo build --manifest-path native/Cargo.toml --release
bun install --cwd ts
```

### General-purpose framework demos

```bash
bun run examples/demo.ts                 # Box, Text, Input, Select, ScrollBox — imperative API
bun run examples/effect-counter.tsx      # Package-first Effect JSX + commands + keyboard hooks
bun run examples/migration-jsx.tsx       # Same app rewritten in JSX + signals
bun run examples/showcase.ts             # Animations, themes, TextArea, runtime tree ops
bun run examples/system-monitor.ts       # 9 core widgets: Box, Text, Input, TextArea, Select, Table, List, Tabs, Overlay
bun run examples/accessibility-demo.tsx  # Roles, labels, descriptions, accessibility events
```

### Flagship workload demos

```bash
bun run examples/agent-console.ts    # TranscriptView, SplitPane, TracePanel, CommandPalette, AG-UI replay
bun run examples/ops-log-console.ts  # StructuredLogView, follow mode, level and search filtering
bun run examples/repo-inspector.ts   # CodeView, DiffView, nested SplitPane, List, CommandPalette
```

To validate a specific branch binary rather than whatever the resolver finds, set `TUVREN_LIB_PATH` before running (use `.so` on Linux, `.dylib` on macOS, `.dll` on Windows):

```bash
TUVREN_LIB_PATH=native/target/release/libtuvren_tui.so bun run examples/agent-console.ts
```

## Core Model

| Layer | Responsibility |
|-------|---------------|
| **Native Core** | Rust `cdylib` — owns all mutable UI state, layout resolution, and rendering |
| **Host Layer** | TypeScript/Bun — thin wrapper over `bun:ffi`, stateless, ergonomic |

**Boundary invariant:** TypeScript holds opaque `u32` Handles; Rust owns the tree and all mutable state. Control flows one direction: the host calls into the native core; the native core never calls back.

**FFI contract:** `0` success, `-1` explicit error via `tui_get_last_error()`, `-2` panic caught at the boundary. `Handle(0)` is the invalid sentinel.

## Development (Source Checkout)

For contributors and branch validation:

```bash
# Build native core
cargo build --manifest-path native/Cargo.toml --release

# Install host dependencies (once after cloning)
bun install --cwd ts

# Run the full host test surface
bun test ts/test-ffi.test.ts
bun test ts/test-jsx.test.ts
bun test ts/test-commands.test.ts
bun test ts/test-effect.test.ts
bun test ts/test-examples.test.ts
bun test ts/test-install.test.ts
bun test ts/test-runner.test.ts

# Native tests and quality checks
cargo test --manifest-path native/Cargo.toml
cargo fmt --manifest-path native/Cargo.toml -- --check
cargo clippy --manifest-path native/Cargo.toml -- -D warnings
```

Repo-side FFI tests and benchmark harnesses target the local Cargo-built artifact under `native/target/release/` so branch validation is never shadowed by old packaged artifacts.

## Verification and Budgets

```bash
# Bundle budget (enforced at ≤ 100KB)
bun run ts/check-bundle.ts

# FFI and render benchmarks
bun run ts/bench-ffi.ts
bun run ts/bench-render.ts
```

## Documentation

| Document | What it covers |
|----------|---------------|
| [PRD](./.constitution/prd/vision.md) | Product intent, actors, glossary, capabilities, scope |
| [Architecture](./.constitution/architecture/strategy.md) | Logical boundaries, container flows, resilience, risks |
| [TechSpec](./.constitution/tech-spec/stack.md) | ABI, state model, interface contracts, verification surface |
| [Tasks](./.constitution/tasks/critical-path.md) | Active execution plan plus archived completed scope |
| [GatePolicy](./.constitution/reports/GatePolicy.md) | CI quality gates and release verification policy |
| [Migration Guide](./.constitution/spikes/tuvren-migration-inventory.md) | Kraken → Tuvren hard-cut migration inventory |

## License

Apache License 2.0 — see [LICENSE.md](./LICENSE.md)
