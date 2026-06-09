# Epic S — Effect Declarative Integration (EFF)

**Epic Status:** SHIPPED (archived)

---

## Epic S Summary

After the repo Q&A clarified that the docs had underspecified the intended scope, Epic S was executed as a package-first Effect surface rather than an adapter pass. The shipped-and-retained advanced API includes `acquireApp()`, `acquireHeadlessApp()`, `makeTuvrenScope()`, `renderScoped()`, `streamEvents()`, and `createCommandService()`. The shipped package layer now also includes `render()`, `testRender()`, JSX runtime exports, component tokens, package-owned command/keybinding hooks, keyboard and terminal-size hooks, and the package-first `examples/effect-counter.tsx`. The manifest declares `effect` as an optional peer with local dev/test wiring, while Rust remains the single mutable runtime authority underneath.

## Shipping Metrics

- Package-first `tuvren-tui/effect` surface with full authoring API
- `examples/effect-counter.tsx` as the flagship Effect example
- Updated `ts/test-effect.test.ts` with comprehensive package coverage

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| EFF-S001 | Package-first render() and testRender() API | Feature | 5 |
| EFF-S002 | JSX runtime exports and component tokens | Feature | 5 |
| EFF-S003 | Package-owned command and keybinding hooks | Feature | 5 |
| EFF-S004 | Keyboard and terminal-size hooks | Feature | 3 |
| EFF-S005 | Advanced lifecycle helpers (acquireApp, makeTuvrenScope, etc.) | Feature | 5 |
