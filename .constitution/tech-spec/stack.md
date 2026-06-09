# Stack Specification

## 0. Version

**v8.1.0** — corresponds to the latest entry in `.constitution/tech-spec/changelog.md`.

---

## 1. Bill of Materials (BOM)

- **Primary Language / Runtime:** Rust 2021 for the Native Core, TypeScript 5.x for the Host Layer, and Bun 1.3.x as the primary runtime for host execution and FFI loading.
- **Primary Frameworks / Libraries:** Taffy for layout, Crossterm for terminal I/O, pulldown-cmark and syntect for rich text, and `@preact/signals-core` for the optional JSX reconciler layer.
- **State Stores / Persistence:** All runtime UI state lives in the Native Core in memory. There is no external database or persisted state store in the canonical product contract.
- **Infrastructure / Tooling:** Cargo, Bun, GitHub Actions CI, GitHub release artifacts with checksum sidecars, Criterion benchmarks, headless terminal backend, replay fixtures, and golden snapshot utilities.
- **Testing / Quality Tooling:** `cargo test`, `cargo fmt`, `cargo clippy`, native benchmarks, Bun integration tests, example replay tests, install smoke tests, runner API tests, and bundle-budget checks.
- **Version Pinning / Compatibility Policy:** The framework remains pre-1.0 (`0.1.0` in both native and host packages), so breaking changes are allowed whenever they reduce duplication or remove design debt before public release. This file defines the current contract for the active branch; compatibility is owed to the documented contract, not to superseded interim shapes.

---

## 2. Native Core Bill of Materials

| Component | Choice | Verified Source State | Decision |
| --- | :--- | :--- | :--- |
| Language | Rust | `edition = "2021"` | Keep the Native Core as the sole owner of mutable UI state and compute-heavy workflows. |
| Layout engine | Taffy | `0.9` | Keep the current layout model and extend through the existing constraint engine rather than introducing a parallel layout path. |
| Terminal backend | Crossterm | `0.29` | Keep terminal I/O and capability handling behind the existing backend abstraction. |
| Rich text parser | pulldown-cmark | `0.13` | Keep Markdown parsing native-side for transcript and code-heavy interfaces. |
| Syntax highlighting | syntect | `5.3` | Keep native syntax highlighting for code and diff viewing surfaces. |
| Text measurement | unicode-width + unicode-segmentation | `0.2` and `1.12` | Keep native text width and grapheme handling for cursor, wrap, and viewport correctness. |
| Serialization | serde + serde_json | `1.0` | Use JSON copy-out for debug snapshots and trace payloads. |

---

## 3. Host Layer Bill of Materials

| Component | Choice | Verified Source State | Decision |
| --- | :--- | :--- | :--- |
| Runtime | Bun | `1.3.8` verified locally | Keep Bun as the default runtime and FFI host. |
| Language | TypeScript | `^5.0.0` | Keep strict typed wrappers and examples in TypeScript. |
| FFI mechanism | `bun:ffi` | built-in | Preserve the direct native-library loading path rather than adding an alternate bridge. |
| Reactivity | `@preact/signals-core` | `^1.8.0` | Preserve the lightweight JSX/signals path without promoting it to the primary lifecycle model. |
| Additional runtime deps | none beyond signals in the root package; `effect@^3.21.2` as optional peer + local dev dependency for `tuvren-tui/effect` | current package state | Keep the host bundle intentionally thin in the imperative core; Effect belongs only to the optional subpath and must not become a mandatory root-package runtime dependency. |
| Public package contract | `tuvren-tui` (Epic P shipped the rename from `kraken-tui`) | `ts/package.json`, source tree | One public package as the user-facing contract; the hard rename is complete. |
| Optional declarative subpath | `tuvren-tui/effect` over the official `effect` package | `ts/package.json`, `ts/effect/index.ts`, `ts/src/effect/` | Provide one sanctioned package-first Effect application surface over the same core runtime, with JSX authoring, package-owned command/keybinding services, testing helpers, and advanced escape hatches without introducing a second mutable runtime. |
| Native package topology | current Brownfield: GitHub assets plus auxiliary scoped package stubs; approved public publish follows in Epic V | release workflow, resolver contract, approved roadmap | Resolve platform-native libraries through auxiliary scoped packages published under the Tuvren organization, while keeping `tuvren-tui` as the only public package. |

---

## 4. Build, Test, and Release Artifacts

| Artifact | Format | Source of Truth |
| --- | :--- | :--- |
| Native Core | Shared library (`.so`, `.dylib`, `.dll`) | `native/target/release/` for source builds; versioned GitHub release assets for published native binaries |
| Host Package | ESM TypeScript package (`tuvren-tui`, Epic P shipped the rename) | `ts/package.json`, `ts/src/` |
| Native Package Set | Auxiliary scoped npm packages carrying per-platform shared libraries (`@tuvren/tuvren-tui-*`); stubs committed, public npm publish deferred to Epic V | `packages/@tuvren/` |
| Release Artifacts | Versioned platform builds with `.sha256` sidecars named `tuvren-tui-*` (Epic P renamed from `kraken-tui-*`) | `.github/workflows/release.yml` |
| Flagship Examples | Bun entrypoints | `examples/agent-console.ts`, `examples/ops-log-console.ts`, `examples/repo-inspector.ts` |
| Replay Fixtures | JSON fixtures and headless assertions | `examples/fixtures/`, `ts/test-examples.test.ts` |

---

## 5. Release and Distribution Matrix

| Platform | Architecture | Release asset | Auxiliary native package |
| --- | :--- | :--- | :--- |
| Linux | x64 | `tuvren-tui-<tag>-linux-x64.so` | `@tuvren/tuvren-tui-linux-x64` |
| Linux | arm64 | `tuvren-tui-<tag>-linux-arm64.so` | `@tuvren/tuvren-tui-linux-arm64` |
| macOS | arm64 | `tuvren-tui-<tag>-darwin-arm64.dylib` | `@tuvren/tuvren-tui-darwin-arm64` |
| macOS | x64 | `tuvren-tui-<tag>-darwin-x64.dylib` | `@tuvren/tuvren-tui-darwin-x64` |
| Windows | x64 | `tuvren-tui-<tag>-win32-x64.dll` | `@tuvren/tuvren-tui-win32-x64` |

The repo-owned release workflow publishes **versioned GitHub release assets** with SHA-256 sidecars. The resolver searches `TUVREN_LIB_PATH`, then the auxiliary scoped native package, then the local Cargo build (repo-checkout only). Standalone release assets are available for manual acquisition via `TUVREN_LIB_PATH`; they are not part of the automatic resolver path. Source-build fallback remains valid for repo-side development and verification. npm publish of `tuvren-tui` and auxiliary packages is deferred to Epic V after SDK productization, with `0.1.0` as the planned first public pre-GA release.

Linux auxiliary packages are glibc-targeted. Epic P validated that declaring `"libc": ["glibc"]` in each Linux aux `package.json` causes Bun ≥1.1 to filter them on musl hosts, so Alpine Linux installs will not silently load an incompatible `.so`. musl-targeted packages remain out of scope; unsupported installs fail with a clear diagnostic.
