# Changelog

Local Stage 4 Changelog. Tracks semantic versioning for the Tasks layer.

---

## v8.2.0

- Executed Epic T: `ExtensionRegistry` with activation/deactivation lifecycle, bounded contribution slots for commands, keymaps, palette, devtools, themes, and examples; 60 focused tests in `test-extensions.test.ts`; `examples/plugin-demo.ts` exercising all slots; bundle at 79.6 KB under 100 KB budget. Epic U is now the active wave.

## v8.1.0

- Executed Epic S with the clarified package-first scope: `tuvren-tui/effect` now exposes package-first `render()` / `testRender()`, JSX runtime exports, component tokens, package-owned command/keybinding hooks, retained advanced lifecycle helpers, an updated `effect-counter.tsx` example, and focused package coverage.

## v8.0.0

- Marked Epic R shipped: `CommandRegistry`, `KeymapRegistry`, `CommandDispatcher` implemented in the Host Layer; `CommandPalette` rebased to the registry; `commandDispatcher` wired into `app.run()` and `createLoop()`; 46 focused tests in `test-commands.test.ts`; all 433 host tests pass; bundle at 72.2 KB under 75 KB budget. Epic S is now the active wave.

## v7.9.0

- Planned the full Epics R-V sequence: commands/keymaps, Effect, pre-GA plugin slots, SDK productization, and first public npm publish as `0.1.0`.

## v7.8.0

- Marked Epic Q shipped after the adoption and framework positioning wave landed. Epic R is now the next queued wave.

## v7.7.0

- Marked Epic P shipped after the full hard-cut Tuvren rename landed. Epic Q is now the only active wave.

## v7.6.0

- Activated the first post-Epic-O roadmap wave: Epic P covers the hard-cut Tuvren rename plus packaging and release trust, Epic Q covers adoption and framework positioning.

## v7.0.0 - v7.5.0

- Substrate and hardening waves (Epic M, N, O) completed. Version history preserved in git logs.
