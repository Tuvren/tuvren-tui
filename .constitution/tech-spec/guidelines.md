# Project Structure and Coding Standards

## 0. Version

**v8.1.0** — corresponds to the TechSpec version.

---

## 1. Repository Layout

```
tuvren-tui/
├── native/                    # Rust Native Core (cdylib)
│   ├── src/
│   │   ├── lib.rs            # FFI entry points (ffi_wrap / ffi_wrap_handle)
│   │   ├── tree.rs           # Composition Tree and TuiNode
│   │   ├── layout.rs         # Taffy-based layout engine
│   │   ├── render.rs         # Render pipeline
│   │   ├── writer.rs         # Terminal instruction compaction
│   │   ├── event.rs          # Input capture and event buffering
│   │   ├── scroll.rs         # Scroll state and nested-scroll handoff
│   │   ├── theme.rs          # Theme and style resolution
│   │   ├── style.rs          # Style application
│   │   ├── animation.rs      # Animation state and transitions
│   │   ├── text_buffer.rs    # TextBuffer native substrate (ADR-T37)
│   │   ├── text_view.rs      # TextView viewport projection (ADR-T37)
│   │   ├── text_renderer.rs  # Unified text renderer
│   │   ├── transcript.rs     # TranscriptState and TranscriptBlock
│   │   ├── split_pane.rs     # SplitPane state
│   │   ├── terminal_capability.rs  # TerminalCapabilityState (ADR-T41)
│   │   └── debug.rs          # Devtools: traces, snapshots, overlays
│   └── Cargo.toml
│
├── ts/                       # TypeScript/Bun Host Layer
│   ├── src/
│   │   ├── index.ts          # Public API entry (Tuvren export)
│   │   ├── commands.ts       # CommandRegistry, CommandDispatcher
│   │   ├── keymap.ts         # KeymapRegistry
│   │   ├── extensions.ts     # ExtensionRegistry, ExtensionContext
│   │   ├── effect/           # tuvren-tui/effect package surface
│   │   └── composites/       # Higher-level composites (CommandPalette, etc.)
│   ├── test-*.test.ts        # Integration tests
│   └── package.json
│
├── examples/                 # Flagship and demo examples
│   ├── agent-console.ts
│   ├── ops-log-console.ts
│   ├── repo-inspector.ts
│   └── effect-counter.tsx
│
└── .github/workflows/
    └── release.yml           # Versioned GitHub release assets
```

---

## 2. FFI Contract Conventions

### Entry Point Style
- All public FFI entry points use `ffi_wrap!` or `ffi_wrap_handle!` macros
- The panic boundary (`-2`) catches any native panic and converts it to an error return
- Handle `(0)` is permanently invalid; every command validates before use

### Naming
- C ABI prefix: `tui_` (e.g., `tui_create_widget`, `tui_transcript_append_block`)
- Host TypeScript wrapper: `Tuvren` class as the primary facade
- Module naming: snake_case for Rust modules, camelCase for TypeScript

---

## 3. Coding Standards

### Rust (Native Core)
- **Edition:** 2021
- **Linting:** `cargo clippy -- -D warnings` enforced in CI
- **Formatting:** `cargo fmt -- --check` enforced in CI
- **Testing:** `cargo test` must pass; golden snapshots for writer/render changes
- **No unsafe in public FFI surface:** All `unsafe` blocks must be contained in internal implementation

### TypeScript (Host Layer)
- **Strict mode:** `--strict` enabled
- **No `any`:** Use `unknown` and type guards for unvalidated data
- **Bundle budget:** 100KB max (enforced in CI via `check-bundle.ts`)
- **Testing:** `bun test ts/test-*.test.ts` must pass

### State Ownership
- **Rule:** Rust owns all mutable UI state. TypeScript holds opaque `u32` Handles.
- **No reverse FFI calls:** The Native Core never initiates calls into the Host Layer.
- **Copy semantics at boundary:** Internal pointers and mutable aliases never leak into host space.

### Error Model
- Success: `0`
- Explicit error: `-1` with `tui_get_last_error()` for message
- Panic caught: `-2`

---

## 4. Test Surface

| Test Suite | Tool | Gate |
| --- | --- | --- |
| Native unit tests | `cargo test` | Required |
| Native formatting | `cargo fmt -- --check` | Required |
| Native linting | `cargo clippy -- -D warnings` | Required |
| Host integration tests | `bun test ts/test-*.test.ts` | Required |
| Bundle budget | `bun run ts/check-bundle.ts` | Required |
| Example replay tests | `bun test ts/test-examples.test.ts` | Required |
| Install smoke tests | GitHub Actions matrix | Required per platform |
