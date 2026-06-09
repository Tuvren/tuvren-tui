# ADR-T42: Public Product and Package Naming Move to Tuvren

- **Status:** accepted
- **Context:** The Brownfield source tree and release workflow used the Kraken name across the public package, host facade, resolver environment variable, native crate/library names, and release asset names.
- **Decision:** Execute a hard pre-`1.0` rename of the public surface from Kraken to Tuvren. The approved target-state uses `tuvren-tui` as the public package, `Tuvren` as the primary host facade, `TUVREN_LIB_PATH` as the resolver override, `tuvren_tui` as the native crate name, platform-correct shared-library names, and `tuvren-tui-*` release artifact names. The C ABI prefix remains `tui_*` to avoid gratuitous ABI churn.
- **Consequences:** Productization, install guidance, and diagnostics become consistent with the new organization and public identity. The rename is a hard cut; long-lived compatibility aliases are intentionally not part of the contract.
