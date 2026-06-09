# Epic P — Tuvren Identity, Packaging, and Release Migration

**Epic Status:** SHIPPED (archived)

---

## Epic P Summary

Epic P completed the hard-cut Tuvren rename across TypeScript, Rust, environment variables, shared-library names, resolver diagnostics, release assets, auxiliary native package stubs, and cross-platform smoke verification.

## Key Changes

- Public package renamed from `kraken-tui` to `tuvren-tui`
- Host facade renamed from `Kraken` to `Tuvren`
- Resolver env var renamed from `KRAKEN_LIB_PATH` to `TUVREN_LIB_PATH`
- Native crate renamed from `kraken_tui` to `tuvren_tui`
- Shared library names updated: `libtuvren_tui.so`, `libtuvren_tui.dylib`, `tuvren_tui.dll`
- Release asset names updated to `tuvren-tui-*` pattern
- Staged-prebuild path removed; resolver now searches `TUVREN_LIB_PATH` → aux scoped package → source build → diagnostic error
- Cross-platform CI smoke gate validated

## Brownfield Note

ADR-T42 is now shipped under Epic P. The GitHub repository now lives at `Tuvren/tuvren-tui`. The staged-prebuild path is removed; the resolver now searches `TUVREN_LIB_PATH` → aux scoped package → source build (repo-checkout only) → diagnostic error.

