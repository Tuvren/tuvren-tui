# EFF-S0 Effect Integration Contract

Ratification memo for Epic S (`tuvren-tui/effect`).

## Goal

Provide one sanctioned package-first Effect application surface over the existing Tuvren runtime without:

- moving mutable UI state out of Rust
- forcing ordinary `tuvren-tui` users to install `effect`
- turning Tuvren into a React/Svelte-style framework adapter

## Dependency Placement

- `ts/package.json` keeps `effect@^3.21.2` as an optional peer dependency for consumers of `tuvren-tui/effect`
- `peerDependenciesMeta.effect.optional = true` preserves imperative-only installs
- `effect@^3.21.2` is also a local dev dependency so repo tests, examples, and type-checking can exercise the subpath
- the root `tuvren-tui` entrypoint does not import `effect`

## Lifecycle Contract

The Effect package is the primary declarative authoring surface over Tuvren-native surfaces.

- `acquireApp()` / `acquireHeadlessApp()` scope app shutdown through Effect resource management
- `makeTuvrenScope(app)` registers deterministic cleanup for:
  - custom finalizers
  - widgets
  - themes
  - loops
  - command/keymap subscriptions
  - reconciler `Instance`s
- high-level `render()` / `testRender()` own app bootstrapping, package-owned commands/keybindings, and testing ergonomics for normal apps
- `renderScoped()` binds the existing declarative mount/unmount lifecycle into an Effect scope for advanced workflows, but the package does not require React/Svelte-style adapters or external component runtimes

Cleanup failures are surfaced through the Effect runtime / exit cause instead of being swallowed by imperative teardown helpers.

## Event Stream Contract

- `streamEvents()` is implemented over `createLoop()` rather than new native callbacks
- drained events remain host-driven and runner-compatible
- `include` filtering is host-side only; the Native Core event buffer contract is unchanged
- `commandDispatcher` can be threaded through the stream so keymap-triggered commands stay on the sanctioned command path

## Command Binding Contract

- `createCommandService()` adapts `CommandRegistry.execute()` and optional `CommandDispatcher.dispatch()` into Effect effects
- programmatic execution defaults `source` to `"programmatic"`
- dispatch failures reject through Effect instead of being hidden inside the loop

## Example Posture

- the flagship Epic S example is `examples/effect-counter.tsx`
- the happy path lives inside `tuvren-tui/effect`, not in mixed root-package imports
- advanced lifecycle and stream helpers remain public, but they are no longer the headline package story
