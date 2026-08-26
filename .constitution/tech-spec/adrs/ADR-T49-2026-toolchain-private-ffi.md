# ADR-T49: Pin the 2026 toolchain and keep FFI private

- **Status:** accepted
- **Context:** Tuvren needs native-class performance through a Bun host, but the current manifests lag 2026 stable releases and Bun documents `bun:ffi` as experimental. The public product must not expose or duplicate the FFI runtime.
- **Decision:** Pin Rust 1.98.0 with edition 2024, Bun 1.4.0, TypeScript 5.9.3, and Effect 3.22.1. Use `bun:ffi` only behind the private SDK codec and exact-version native packages. Treat the bridge as Trial until five-target loading, malformed-input fuzzing, panic containment, and performance gates pass. Hold TypeScript 7 because its isolated check fails the current Bun FFI declarations; hold Effect 4 until stable.
- **Consequences:** The target toolchain is reproducible and current without assuming unverified compiler compatibility. The FFI risk remains explicit and release-blocking while ordinary Developers see only typed SDK errors and values.
