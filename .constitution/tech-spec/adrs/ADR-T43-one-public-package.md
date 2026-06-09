# ADR-T43: One Public Package Sits Above Internal Scoped Native Packages

- **Status:** accepted
- **Context:** The current install story relies on GitHub native assets, `TUVREN_LIB_PATH`, auxiliary package stubs, and source-checkout fallback. That is workable for source checkouts but falls short of the productized install experience needed for a competitive framework release.
- **Decision:** Keep one public package as the only documented install target and move platform-native distribution behind auxiliary scoped packages published under the Tuvren organization. `tuvren-tui` remains the public facade; auxiliary packages such as `@tuvren/tuvren-tui-linux-x64` carry the shared libraries that the resolver loads after it first checks `TUVREN_LIB_PATH`.
- **Consequences:** End-user install UX becomes simpler and less error-prone. The release workflow and resolver gain packaging responsibilities that must stay aligned across CI, diagnostics, and test coverage.
