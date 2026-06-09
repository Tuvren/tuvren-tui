# Changelog

Local Stage 3 Changelog. Tracks semantic versioning for the TechSpec layer.

---

## v8.1.0

- Bumped host bundle budget from 75KB to 100KB across `check-bundle.ts`, `test-runner.test.ts`, CI workflow, README, GatePolicy, PRD, and TechSpec to reflect framework growth from Epics R–T.

## v8.0.0

- Ratified pre-GA plugin slot contract (Epic T): bounded extension contribution types (`CommandRegistry`, `KeymapRegistry`, palette, devtools, themes, examples), `ExtensionDiagnostic`, and `ExtensionContext` with `Pick<KeymapRegistry, "register" | "resolve">` to withhold `setRegistry` from extensions.

## v7.9.0

- Executed Epic S with the clarified package-first scope: `tuvren-tui/effect` now exposes a package-first authoring surface with `render()` / `testRender()`, JSX runtime exports, package-owned commands and keybindings, keyboard and terminal-size hooks, component tokens, retained advanced lifecycle helpers, updated package coverage, and a package-first `effect-counter.tsx` example over the same native runtime authority.

## v7.8.0

- Marked Epic R shipped: `CommandRegistry`, `KeymapRegistry`, and `CommandDispatcher` implemented in the Host Layer; `CommandPalette` rebased to consume the registry; `commandDispatcher` option wired into `app.run()` and `createLoop()`; 46 focused command/keymap tests added.

## v7.7.0

- Extended the implementation contract through Epics R-V: command/keymap services, Effect integration, pre-GA plugin slots, SDK productization, and first public npm publish as `0.1.0`.

## v7.6.0

- Activated the next productization contract: future public naming moves to Tuvren, native distribution moves toward auxiliary scoped platform packages behind one public package, and command/keymap plus Effect direction are recorded as the next framework-expansion path.

## v7.4.1

- Landed Epic O Brownfield updates: native terminal capability state, diagnostic query APIs, write-only OSC52, OSC8 text-buffer link spans, Kitty keyboard disambiguation negotiation, and conservative multiplexer degradation are now implemented.

## v7.0.0 - v7.4.0

- Substrate and surface rebase wave (Epic M, N) landed: native text substrate, TextView, EditBuffer, unified text renderer, and rebased text surfaces.

## v6.x series

- Earlier version history preserved in git logs.
