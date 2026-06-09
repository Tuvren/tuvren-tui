# Tuvren Hard-Cut Migration Inventory

**Spike:** PROD-P001  
**Status:** Complete — all items inventoried; no upstream document contradictions found.  
**References:** PRD §1.3, Architecture §1.4 and Risk 9, TechSpec ADR-T42, ADR-T43, §1.4, §4.3

---

## 1. Purpose

This document enumerates every public-facing Kraken-era name and release/distribution touchpoint that had to change as part of the hard-cut rename from Kraken to Tuvren. Historical downstream rename ticket labels (PROD-P002 through PROD-P006) referenced this inventory directly; their detailed ticket bodies are now archived out of `.constitution/tasks/`. No compatibility aliases were planned — the rename was a pre-1.0 hard cut per ADR-T42.

---

## 2. Public Package Contract

| Old name | New name | File | Ticket |
|----------|----------|------|--------|
| `kraken-tui` (npm package name) | `tuvren-tui` | `ts/package.json` | PROD-P002 |
| `kraken-tui` (jsxImportSource) | `tuvren-tui` | `ts/tsconfig.json` | PROD-P002 |
| Subpath export `kraken-tui` (root) | `tuvren-tui` | `ts/package.json` exports | PROD-P002 |
| Subpath export `kraken-tui/jsx-runtime` | `tuvren-tui/jsx-runtime` | `ts/package.json` exports | PROD-P002 |
| Subpath export `kraken-tui/jsx-dev-runtime` | `tuvren-tui/jsx-dev-runtime` | `ts/package.json` exports | PROD-P002 |
| Subpath export `kraken-tui/effect` | `tuvren-tui/effect` | `ts/package.json` exports | PROD-P002 |

---

## 3. Host Facade and Public TypeScript Symbols

| Old symbol | New symbol | File | Ticket |
|------------|------------|------|--------|
| `class Kraken` | `class Tuvren` | `ts/src/app.ts` | PROD-P002 |
| `class KrakenError` | `class TuvrenError` | `ts/src/errors.ts` | PROD-P002 |
| `type KrakenEvent` | `type TuvrenEvent` | `ts/src/events.ts` | PROD-P002 |
| `type KrakenEventType` | `type TuvrenEventType` | `ts/src/events.ts` | PROD-P002 |
| `KrakenFragment` (re-export alias) | `TuvrenFragment` | `ts/src/index.ts` | PROD-P002 |
| `interface RunOptions.onEvent: (event: KrakenEvent)` | `TuvrenEvent` | `ts/src/app.ts` | PROD-P002 |
| `DevSessionOptions.createApp` return type | `Tuvren` | `ts/src/dev.ts` | PROD-P002 |
| `LoopOptions.app: Kraken` | `Tuvren` | `ts/src/loop.ts` | PROD-P002 |

---

## 4. Compiler-Facing Import-Source Settings

| Setting | Old value | New value | File | Ticket |
|---------|-----------|-----------|------|--------|
| `jsxImportSource` | `kraken-tui` | `tuvren-tui` | `ts/tsconfig.json` | PROD-P002 |
| JSX import comment in `ts/src/index.ts` | `kraken-tui` | `tuvren-tui` | `ts/src/index.ts` | PROD-P002 |
| `ts/src/effect/index.ts` subpath reference | `kraken-tui/effect` | `tuvren-tui/effect` | `ts/src/effect/index.ts` | PROD-P002 |

---

## 5. Resolver Environment Variable

| Old name | New name | Files | Ticket |
|----------|----------|-------|--------|
| `KRAKEN_LIB_PATH` | `TUVREN_LIB_PATH` | `ts/src/resolver.ts`, `ts/src/diagnostics.ts`, `ts/test-install.test.ts` | PROD-P003 |

No long-lived compatibility alias for `KRAKEN_LIB_PATH` is planned.

---

## 6. Native Crate and Shared Library Names

| Old name | New name | File | Ticket |
|----------|----------|------|--------|
| `kraken_tui` (Cargo crate name) | `tuvren_tui` | `native/Cargo.toml` | PROD-P003 |
| `libkraken_tui.so` | `libtuvren_tui.so` | `ts/src/resolver.ts`, resolver logic | PROD-P003 |
| `libkraken_tui.dylib` | `libtuvren_tui.dylib` | `ts/src/resolver.ts`, resolver logic | PROD-P003 |
| `kraken_tui.dll` | `tuvren_tui.dll` | `ts/src/resolver.ts`, resolver logic | PROD-P003 |

The C ABI prefix `tui_*` is intentionally preserved to avoid gratuitous ABI churn (ADR-T42).

---

## 7. Release Asset Names

| Old pattern | New pattern | Workflow file | Ticket |
|-------------|-------------|---------------|--------|
| `kraken-tui-<tag>-linux-x64.so` | `tuvren-tui-<tag>-linux-x64.so` | `.github/workflows/release.yml` | PROD-P003 |
| `kraken-tui-<tag>-linux-arm64.so` | `tuvren-tui-<tag>-linux-arm64.so` | `.github/workflows/release.yml` | PROD-P003 |
| `kraken-tui-<tag>-darwin-arm64.dylib` | `tuvren-tui-<tag>-darwin-arm64.dylib` | `.github/workflows/release.yml` | PROD-P003 |
| `kraken-tui-<tag>-darwin-x64.dylib` | `tuvren-tui-<tag>-darwin-x64.dylib` | `.github/workflows/release.yml` | PROD-P003 |
| `kraken-tui-<tag>-win32-x64.dll` | `tuvren-tui-<tag>-win32-x64.dll` | `.github/workflows/release.yml` | PROD-P003 |
| `kraken-tui-<platform>-<arch>` (artifact cache name) | `tuvren-tui-<platform>-<arch>` | `.github/workflows/release.yml` | PROD-P003 |
| `Kraken TUI <tag>` (release name) | `Tuvren TUI <tag>` | `.github/workflows/release.yml` | PROD-P003 |

---

## 8. Auxiliary Native Packages (New Topology)

The approved target-state (ADR-T43) introduces one public package (`tuvren-tui`) backed by auxiliary scoped native packages. Epic P created the package stubs in the Brownfield source; Epic V owns the first public publish cycle and package-manager smoke coverage.

| Package name | Platform | Architecture | Ticket |
|-------------|----------|--------------|--------|
| `@tuvren/tuvren-tui-linux-x64` | Linux | x64 | PROD-P004 |
| `@tuvren/tuvren-tui-linux-arm64` | Linux | arm64 | PROD-P004 |
| `@tuvren/tuvren-tui-darwin-arm64` | macOS | arm64 | PROD-P004 |
| `@tuvren/tuvren-tui-darwin-x64` | macOS | x64 | PROD-P004 |
| `@tuvren/tuvren-tui-win32-x64` | Windows | x64 | PROD-P004 |

Each package carries a single shared library. The public package references all five as optional dependencies. `TUVREN_LIB_PATH` still takes priority so manual/air-gapped installs remain supported.

**Musl enforcement strategy (Bun-first):** Linux auxiliary packages declare `"libc": ["glibc"]` in their `package.json`. Bun's package manager (Bun ≥ 1.1) respects the `libc` field in optional dependency filtering, which prevents glibc-targeting packages from being silently installed on musl/Alpine hosts. If the bun version in use does not enforce `libc` filtering, the resolver must detect a musl host at runtime (check `/proc/version` or `ldd --version`) and fail with a clear diagnostic. Public musl/Alpine support remains out of scope for this wave per PRD §6.

---

## 9. Resolver Search Order Change

| Step | Brownfield | Approved Target-State |
|------|-----------|----------------------|
| 1 | `KRAKEN_LIB_PATH` env override | `TUVREN_LIB_PATH` env override |
| 2 | `ts/prebuilds/<platform>-<arch>/<libName>` (staged prebuild) | Resolve `@tuvren/tuvren-tui-<platform>-<arch>` by package name and derive `<libName>` from the resolved package root |
| 3 | `native/target/release/<libName>` (always) | `native/target/release/<libName>` only in repo checkouts (proven by `native/Cargo.toml` existing at `packageRoot/../native/Cargo.toml`; the `ts/package.json` check was dropped as it always exists when the resolver loads and provides no discrimination signal) |
| 4 | Diagnostic error | Diagnostic error with new Tuvren naming |

The staged `ts/prebuilds/` path is removed from the default resolver order as part of the package topology migration.

---

## 10. Internal Environment Variables (Non-Public)

| Old name | New name | File | Notes |
|----------|----------|------|-------|
| `KRAKEN_AUDIT_RENDER_ONCE` | `TUVREN_AUDIT_RENDER_ONCE` | `ts/src/loop.ts`, `examples/demo.ts`, `audit/run-example.ts` | Internal test/audit env var, not part of the public API contract |
| `KRAKEN_AUDIT_TICKS` | `TUVREN_AUDIT_TICKS` | `ts/src/loop.ts`, `audit/run-example.ts` | Internal test/audit env var |

---

## 11. Native Internal Strings

| Old value | New value | File | Notes |
|-----------|-----------|------|-------|
| `"kraken-headless"` (terminal_program) | `"tuvren-headless"` | `native/src/terminal_capabilities.rs` | User-visible via `getTerminalInfo()` diagnostic copy-out; renamed for consistency. |
| `"kraken://"` (OSC8 allowed scheme) | `"tuvren://"` | `native/src/terminal_capabilities.rs` | Part of the OSC8 link scheme allowlist; renamed as a hard cut with no compatibility window needed pre-1.0. |

---

## 12. Documentation and Onboarding Touchpoints

| File | What changes | Ticket |
|------|-------------|--------|
| `README.md` | All install instructions, import examples, package name | ADOPT-Q001 |
| `examples/*.ts`, `examples/*.tsx` | Import source (`../ts/src/index`), `Kraken` → `Tuvren`, `KrakenEvent` → `TuvrenEvent` | ADOPT-Q001, ADOPT-Q002 |
| `examples/AGENTS.md` | `Kraken.init()` references | ADOPT-Q001 |
| `.constitution/reports/GatePolicy.md` | Product name, cross-platform gate additions | PROD-P006 |

---

## 13. Upstream Document Contradiction Check

No contradictions found between PRD §1.3, Architecture §1.4, TechSpec ADR-T42/ADR-T43/§4.3, and this inventory. The approved target-state naming (`tuvren-tui`, `Tuvren`, `TUVREN_LIB_PATH`, `tuvren_tui`, `libtuvren_tui.*`, `@tuvren/*`) is consistent across all four upstream artifacts.

The `tui_*` ABI prefix is explicitly preserved by ADR-T42 and is not part of the rename scope.

---

## 14. Gaps and Deferred Items

- **Organization move**: The GitHub repository transfer is complete; the canonical repo is `Tuvren/tuvren-tui`. The npm organization and publish-token setup remain Epic V responsibilities before first public publish.
- **Musl runtime detection fallback**: If Bun's `libc` optional-dependency filtering cannot be confirmed for the deployed Bun version, the resolver must add an explicit musl detection gate. This is validated in PROD-P005.
- **npm registry publishing**: The CI workflow scaffolding for publishing auxiliary packages (PROD-P004) prepares the package manifests and workflow steps, but actual publishing requires the `@tuvren` npm organization and a publish token in GitHub Actions secrets.
- **Aux-package resolver smoke test**: The cross-platform smoke gate (PROD-P006) validates the source-build path of the resolver. The auxiliary-package branch (`resolveAuxPackage` + `import.meta.resolve`) is not covered by the current smoke matrix because it requires a published or locally staged `@tuvren/*` package. Epic V owns the packed/registry install smoke for step 2 of the resolver; the unit behavior of `fileURLToPath` + `existsSync` is verified at the module level.
- **User-visible Kraken strings in examples**: ~~Deferred to Epic Q~~ — completed in Epic P. All example titles, ARIA labels, markdown headings, and docstrings across `examples/*.{ts,tsx}` and `examples/AGENTS.md` now use Tuvren naming. Only historical and changelog references to "Kraken" remain in the archived Epic summaries in `.constitution/tasks/completed/` and the migration inventory itself, which are intentionally kept for continuity context.
- **`linux-arm64` load smoke**: The cross-platform CI gate cross-compiles `linux-arm64` on an x64 runner and therefore cannot run a native headless `dlopen` smoke. Upgrading this to a full load smoke requires a native arm64 CI runner and is tracked as a future gate upgrade.
- **Apache-2.0 LICENSE in aux packages**: Apache-2.0 §4(c) requires a copy of the License to be included with redistributed works. The aux `package.json` files declare `"license": "Apache-2.0"` but the tarball `files` arrays do not include a LICENSE file. This must be added to each aux package before the first `npm publish` cycle in Epic V. The release workflow's payload assembly step is the natural place to copy the repo LICENSE.md into each `packages/@tuvren/...` directory before upload.
