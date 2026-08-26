# ADR-T51: Use one batched UI transaction ABI

- **Status:** accepted
- **Context:** Per-property FFI calls and asynchronous host registries cannot provide the Architecture's single-writer ordering, one-Render-Pass transaction rule, or competitive boundary overhead at the full workload envelope.
- **Decision:** One TypeScript UI executor encodes little-endian versioned transaction batches defined by `contracts/native-abi.h` and `data-models/transaction.rs`. Each batch has a fixed header, fixed command records, and a trailing byte arena. Rust decodes and validates the entire batch before mutation, applies it in command order, and issues at most one Render Pass request. Events and diagnostics drain in bounded caller-owned batches. Rust never calls TypeScript.
- **Consequences:** FFI traffic and reconciliation overhead can be measured and amortized. The codec becomes a security-critical parser with property tests, fuzzing, byte-level goldens, and exact ABI versioning. Existing individual mutation exports are migration-only and disappear before final `0.1.0`.
