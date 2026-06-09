# AI Agent Instruction Manual: Constitution Framework

Reference for the four-stage constitution chain under `.constitution/`.

---

## Canonical Document Chain

| Layer | Directory | Governs |
| --- | --- | --- |
| Product | `.constitution/prd/` | What to build and why |
| Architecture | `.constitution/architecture/` | Logical shape of the system |
| TechSpec | `.constitution/tech-spec/` | Concrete implementation contract |
| Tasks | `.constitution/tasks/` | Ordered execution plan |

**Authority flow:** PRD -> Architecture -> TechSpec -> Tasks

---

## Documentation Routing Table

| If you need to know... | Target File |
| --- | --- |
| What product and scope Tuvren serves | `.constitution/prd/vision.md` |
| Which term should be used consistently | `.constitution/prd/glossary.md` |
| What the logical boundaries are | `.constitution/architecture/strategy.md` |
| What concrete interfaces, state, and tests exist | `.constitution/tech-spec/stack.md` |
| What should happen next | `.constitution/tasks/critical-path.md` |
| What was already delivered | `.constitution/tasks/completed/` |
| How CI and release gates work | `.constitution/reports/GatePolicy.md` |

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
  ├─ Terminal Capability State: detection-first flags, OSC52, OSC8, Kitty keyboard
  ├─ Transcript state and anchor-aware viewport semantics
  ├─ SplitPane layout and resize semantics
  ├─ Devtools: overlays, snapshots, traces, perf counters
  ├─ Runner-compatible synchronous render pipeline
  └─ Accessibility foundation on TuiNode metadata
```

**FFI contract:** `0` success, `-1` explicit error via `tui_get_last_error()`,
`-2` panic caught at the boundary. `Handle(0)` is the invalid sentinel.

---

## Working Rules

### When changing product or planning docs
1. Respect the document chain. Fix upstream artifacts before downstream.
2. Keep each artifact in its own layer.
3. Preserve active scope separately from archived completed scope.
4. When Brownfield reality differs from a doc, reconcile the drift explicitly.

### When changing Rust FFI surface
1. Read the relevant contract in `.constitution/tech-spec/` section 4.
2. Read the related ADRs in `.constitution/tech-spec/adrs/`.
3. Read the state model in `.constitution/tech-spec/` section 3.
4. Add or update the `extern "C"` entry point in `native/src/lib.rs`.

### When changing the host layer
1. Keep wrappers thin. Rust owns all mutable UI state.
2. Prefer composites over new native widgets unless TechSpec or Tasks justifies it.
3. The resolver contract: `TUVREN_LIB_PATH` → aux package → Cargo source build → error.
4. Repo-side verification entrypoints should target the local Cargo build.

### When picking what to read
- Product/scope -> `.constitution/prd/`
- Boundary/flow -> `.constitution/architecture/`
- ABI/state/test/release -> `.constitution/tech-spec/`
- Current priority -> `.constitution/tasks/critical-path.md`

---

## Documentation Rules

1. **Respect layer boundaries.** Do not move stack or ABI detail into PRD.
   Do not move product intent into TechSpec. Do not invent contracts in Tasks.
2. **Preserve continuity.** Archived scope and historical decisions are part of the
   trust surface.
3. **Treat code as Brownfield truth.** Reconcile drift explicitly.
4. **Keep active and archived scope separate.** Do not let completed work masquerade
   as the active backlog.

---

## When Revising Docs

### Product-layer change
Start with `.constitution/prd/`. Validate whether the change is scope vs.
implementation.

### Logical design change
Confirm PRD already authorizes it. Revise `.constitution/architecture/` before
touching `.constitution/tech-spec/`.

### Implementation contract change
Confirm Architecture authorizes it. Revise `.constitution/tech-spec/`, then
`.constitution/tasks/` if execution implications change.

### Execution-plan change
Only revise `.constitution/tasks/` once the upstream contract is present.
