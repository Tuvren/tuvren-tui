# ADR-T16: Safe Global State via OnceLock at the FFI Boundary

- **Status:** superseded by ADR-T51 and ADR-T52
- **Supersession:** Explicit context identities and one owner UI executor replace process-global mutable access in the target contract.
- **Context:** The FFI boundary requires safe shared access to native state from multiple host-issued command calls.
- **Decision:** Use `OnceLock<RwLock<...>>` at the FFI boundary to ensure global native state is initialized exactly once and accessed safely across concurrent command invocations.
- **Consequences:** Alias safety is enforced without changing the default synchronous execution model. All public FFI entry points must go through the initialized global state.
