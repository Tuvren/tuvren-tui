# ADR-T29: Prebuilt Artifact Matrix Plus Source-Build Fallback

- **Status:** accepted
- **Context:** The install contract must support both published prebuilt binaries and source-checkout development workflows.
- **Decision:** Prebuilt artifact matrix plus source-build fallback are part of the install contract. The resolver searches `TUVREN_LIB_PATH`, then the auxiliary scoped native package, then the local Cargo build (repo-checkout only), then fails with a diagnostic.
- **Consequences:** Distribution UX is treated as implementation contract, not post-hoc packaging polish. Source-build fallback is authorized only when the resolver can prove it was loaded from a Tuvren workspace.
