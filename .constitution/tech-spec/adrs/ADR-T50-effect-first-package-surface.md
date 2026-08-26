# ADR-T50: Make the bare package Effect-first

- **Status:** accepted
- **Context:** The current package defaults to imperative exports, exposes Signals, and places Effect under a separate path. PRD v3.0.0 instead makes the Effect UI SDK the preferred declarative experience while requiring a complete explicit Imperative SDK.
- **Decision:** The bare `tuvren-tui` entrypoint exports Effect-native rendering, Components, Commands, Keymaps, hooks that hide Reactivity, public errors, and JSX support. Move the complete imperative surface to `/imperative`; provide the approved testing and JSX subpaths; remove `/effect` and public Signal exports. Effect 3 is one required peer major. Ordinary packages compose public contracts; no RuntimeExtension or Plugin registry ships in `0.1.0`.
- **Consequences:** Installation has one obvious starting point and no duplicate Effect runtime. Existing imports require a pre-GA migration and codemod. The root bundle must stay within 100 KB despite becoming the preferred declarative surface.
