# `tuvren-tui/effect`

Public package wrapper for the package-first Effect surface.

- `index.ts` exposes the main authoring API
- `jsx-runtime.ts` and `jsx-dev-runtime.ts` support `jsxImportSource`
- `package.json` mirrors the subpath contract for source checkouts and editor tooling

Implementation lives in `../src/effect/`. This directory exists so the source tree is physically package-shaped rather than only export-map-shaped.
