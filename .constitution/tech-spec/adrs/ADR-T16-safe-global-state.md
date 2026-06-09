# ADR-T16: Safe Global State via OnceLock at the FFI Boundary

- **Status:** accepted
- **Context:** The FFI boundary requires safe shared access to native state from multiple host-issued command calls.
- **Decision:** Use `OnceLock<RwLock<...>>` at the FFI boundary to ensure global native state is initialized exactly once and accessed safely across concurrent command invocations.
- **Consequences:** Alias safety is enforced without changing the default synchronous execution model. All public FFI entry points must go through the initialized global state.
