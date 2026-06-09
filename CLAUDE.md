# AI Agent Instruction Manual

Guidance for AI agents working in this repository. Domain-specific details live in `native/CLAUDE.md` for the Rust core and `ts/CLAUDE.md` for the TypeScript/Bun host layer.

---

## Project Overview

**Tuvren TUI** (formerly Kraken TUI) is a Rust-native terminal UI engine with TypeScript/Bun bindings over FFI. Epic P completed the hard-cut rename; the codebase now uses `tuvren-tui`, `Tuvren`, `TUVREN_LIB_PATH`, `tuvren_tui` (crate), and `libtuvren_tui.*` throughout.

**Core invariant:** Rust owns all mutable UI state. TypeScript holds opaque `u32` Handles and issues commands. Control flow is unidirectional: the Host Layer calls into the Native Core; the Native Core never calls back into the Host Layer.

**Canonical document chain** (read in order for design and planning questions):
1. [`.constitution/prd/`](./.constitution/prd/) — product intent, actors, glossary, capabilities, constraints, and scope
2. [`.constitution/architecture/`](./.constitution/architecture/) — logical boundaries, containers, flows, resilience, and risks
3. [`.constitution/tech-spec/`](./.constitution/tech-spec/) — concrete implementation contract, ABI, state model, and verification surface
4. [`.constitution/tasks/`](./.constitution/tasks/) — active execution plan plus archived completed scope

**Information flow:** PRD -> Architecture -> TechSpec -> Tasks

---

## Current Repo Status

- The canonical constitution chain under `.constitution/` is current and should be treated as the source of truth for planning work.
- `.constitution/tasks/` marks **Epic O** (Terminal Capability Hardening), **Epic P** (Tuvren Identity, Packaging, and Release Migration), **Epic Q** (Adoption and Framework Positioning), **Epic R** (Commands & Keymap Foundations), **Epic S** (Effect Declarative Integration), and **Epic T** (Plugin Slots and Extensibility) as shipped. Active scope is now **Epic U** (SDK Productization / Expert-Level DX) and **Epic V** (First Public npm Publish and Feedback Loop).
- `.constitution/tasks/active/` separates active scope from archived completed scope. Do not mistake archived waves for the current backlog.
- The transcript/devtools/split-pane/flagship-example wave is already implemented in source.

---

## Development Commands

Run all commands from the repository root unless stated otherwise.

```bash
# Build
cargo build --manifest-path native/Cargo.toml --release
cargo check --manifest-path native/Cargo.toml

# Native tests and quality
cargo test --manifest-path native/Cargo.toml
cargo fmt --manifest-path native/Cargo.toml -- --check
cargo clippy --manifest-path native/Cargo.toml -- -D warnings

# Host tests
bun test ts/test-ffi.test.ts
bun test ts/test-jsx.test.ts
bun test ts/test-commands.test.ts
bun test ts/test-effect.test.ts
bun test ts/test-examples.test.ts
bun test ts/test-install.test.ts
bun test ts/test-runner.test.ts

# Benchmarks and budgets
bun run ts/check-bundle.ts
bun run ts/bench-ffi.ts
bun run ts/bench-render.ts

# Flagship examples
cargo build --manifest-path native/Cargo.toml --release && bun run examples/agent-console.ts
cargo build --manifest-path native/Cargo.toml --release && bun run examples/ops-log-console.ts
cargo build --manifest-path native/Cargo.toml --release && bun run examples/repo-inspector.ts

# Broader showcase examples
cargo build --manifest-path native/Cargo.toml --release && bun run examples/demo.ts
cargo build --manifest-path native/Cargo.toml --release && bun run examples/effect-counter.tsx
cargo build --manifest-path native/Cargo.toml --release && bun run examples/migration-jsx.tsx
cargo build --manifest-path native/Cargo.toml --release && bun run examples/system-monitor.ts
cargo build --manifest-path native/Cargo.toml --release && bun run examples/accessibility-demo.tsx
```

**Dependency note:** Run `cd ts && bun install` once after cloning to install `@preact/signals-core`.

---

## Architecture At A Glance

```text
TypeScript/Bun (thin command client, composites, examples, dev session helpers)
  ↓
C ABI via bun:ffi
  ↓
Rust cdylib (single mutable UI authority)
  ├─ Tree, Layout, Style, Theme, Animation
  ├─ Render, Writer, Event, Scroll, Terminal
  ├─ Text + bounded Text Cache
  ├─ Native Text Substrate: TextBuffer + TextView + unified text renderer (ADR-T37)
  ├─ Terminal Capability State: detection-first flags, OSC52, OSC8, Kitty keyboard negotiation
  ├─ Transcript state and anchor-aware viewport semantics
  ├─ SplitPane layout and resize semantics
  ├─ Devtools: overlays, snapshots, traces, perf counters
  ├─ Runner-compatible synchronous render pipeline
  └─ Accessibility foundation on TuiNode metadata
```

**FFI contract:** `0` success, `-1` explicit error via `tui_get_last_error()`, `-2` panic caught at the boundary. `Handle(0)` is the invalid sentinel.

---

## Working Rules

### When changing product or planning docs
1. Respect the document chain. Fix upstream artifacts before downstream artifacts.
2. Keep each artifact in its own layer. Do not repair PRD or Architecture defects inside TechSpec or Tasks.
3. Preserve active scope separately from archived completed scope.
4. When Brownfield reality differs from a doc, report and reconcile the drift explicitly.

### When changing Rust FFI surface
1. Read the relevant contract in `.constitution/tech-spec/` section 4.
2. Read the related ADRs in `.constitution/tech-spec/adrs/`.
3. Read the state model in `.constitution/tech-spec/` section 3.
4. Implement feature logic in the appropriate `native/src/*.rs` module.
5. Add or update the `extern "C"` entry point in `native/src/lib.rs` via `ffi_wrap()` or `ffi_wrap_handle()`.

### When changing the host layer
1. Keep wrappers thin. Rust still owns mutable UI state and performance-critical semantics.
2. Prefer composites over new native widgets unless the TechSpec or active Tasks plan explicitly justifies native promotion.
3. The active native library resolver contract (Epic P / ADR-T43) is: `TUVREN_LIB_PATH` env override → `@tuvren/tuvren-tui-<platform>-<arch>` aux package via `import.meta.resolve()` → Cargo source build (repo checkout only, proven by workspace markers) → diagnostic error. The staged-prebuild path is removed.
4. Repo-side verification entrypoints that `dlopen` directly should target the local Cargo build, not staged prebuilds, so branch validation cannot be shadowed by old packaged artifacts.

### When picking what to read
- Product/scope question -> `.constitution/prd/`
- Boundary/flow question -> `.constitution/architecture/`
- ABI/state/test/release question -> `.constitution/tech-spec/`
- Current execution priority -> `.constitution/tasks/critical-path.md`

---

## Migration Note

The constitution was migrated from flat `docs/PRD.md`, `docs/Architecture.md`, `docs/TechSpec.md`, `docs/Tasks.md` to the modular `.constitution/` directory structure. The old flat docs are deleted; use the four-stage constitution chain for all planning and reference work.
