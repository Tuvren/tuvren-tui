# Epic A — Runtime foundation and public SDK boundary

Establish the Stage 3 physical contract before capability work builds on it. This epic owns P0-A01–P0-A09 and the foundational portions of P0-O07–P0-O10.

#### TUI-A001 Establish the pinned toolchain, target repository shape, and contract gate

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** None
- **Category:** Dependency-Upgrade
- **Capabilities:** P0-A08, P0-O07, OPS-05
- **Scope (In-Scope Files):** `rust-toolchain.toml`, `native/Cargo.toml`, `native/Cargo.lock`, `ts/package.json`, `ts/bun.lock`, `scripts/`, root build configuration
- **Scope (Out-of-Scope Files):** `.constitution/prd/`, `.constitution/architecture/`, public behavior beyond the Stage 3 contracts
- **Verification Command:** `bun run check:contracts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if a pinned Stage 3 dependency cannot build on a supported target; report the compatibility evidence for a Stage 3 Evolution pass.
- **Description:** Adopt the exact toolchain and dependency baselines, migrate the target module layout, repair the existing 188-error TypeScript baseline without weakening strictness, and implement one contract check for declarations, schemas, manifests, ABI headers, fixtures, and generated symbol parity.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
`check:contracts` uses the frozen contract lock, TypeScript 5.9.3 and Effect 3.22.1, compiles the C and C++ header, validates every registered schema and manifest, verifies byte fixtures, and reports no Brownfield TypeScript errors.
```

#### TUI-A002 Implement explicit contexts and the single UI executor

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A001
- **Category:** Correctness
- **Capabilities:** P0-A04–P0-A07, REL-03
- **Scope (In-Scope Files):** `native/src/context.rs`, `ts/src/runtime/`, `ts/src/index.ts`, `ts/src/imperative/`
- **Scope (Out-of-Scope Files):** Component catalog, terminal protocol decoders, background rendering
- **Verification Command:** `bun test ts/test-runner.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if any context-bound ABI call can originate outside the owner executor thread.
- **Description:** Replace implicit global mutation with explicit interactive and isolated headless contexts, one serialized executor queue, managed Effect scopes, manual imperative lifecycle, cancellation, coalescing, shutdown, and deterministic cleanup.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Saturation and lifecycle tests prove one writer, ordered accepted work, bounded queues, no reentrant mutation, and cleanup of every context across normal, interrupted, and failed runs.
```

#### TUI-A003 Implement the typed transaction ABI and host codec

- **Type:** Security
- **Effort:** 8
- **Dependencies:** TUI-A002
- **Category:** Security
- **Capabilities:** P0-A08–P0-A09, SAFE-01
- **Scope (In-Scope Files):** `native/src/lib.rs`, `native/src/transaction.rs`, `ts/src/ffi/`, generated ABI checks
- **Scope (Out-of-Scope Files):** public numeric identities, TypeScript callbacks from Rust, Event arbitration disposition records
- **Verification Command:** `cargo fuzz run transaction_decode`
- **Expected Success Output:** no crash, panic escape, out-of-bounds access, or invariant violation for the maintained corpus and configured CI duration
- **STOP Conditions:** STOP if the implementation requires exposing RuntimeNode IDs or relaxing full-batch prevalidation.
- **Description:** Implement ABI 2.0 decoding, opcode/property/value compatibility, typed complex payloads, transaction-local node references, caller-owned mappings, exact-version loading, panic containment, and one Render Pass request per committed batch.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Rust and TypeScript decode checked-in byte fixtures identically; malformed, misaligned, overlapping, stale, oversized, or incompatible records are rejected before mutation; post-validation unexpected failure freezes and discards the context.
```

#### TUI-A004 Enforce transaction scheduling, backpressure, and render-request semantics

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-A003
- **Category:** Perf
- **Capabilities:** P0-A06–P0-A09, PERF-03, REL-03
- **Scope (In-Scope Files):** `ts/src/runtime/`, `native/src/context.rs`, `native/src/presentation/`, executor saturation tests
- **Scope (Out-of-Scope Files):** final 120/90/60 tuning, comparative performance cuts
- **Verification Command:** `bun run bench:envelope`
- **Expected Success Output:** idle Render Pass count is 0 and every committed transaction requests at most one Render Pass
- **STOP Conditions:** STOP if coalescing would weaken Event order, final state, accessibility semantics, or cleanup.
- **Description:** Connect dirty causes, transaction commits, priority input work, bounded queues, cancellation, coalescing, and explicit render requests without polling or idle presentation.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
PERF-03 and REL-03 fixtures show zero unexplained idle passes, bounded saturation behavior, deterministic order, and no lost shutdown at the full update-burst envelope.
```

#### TUI-A005 Ship the Effect-first root and capability-complete imperative subpath

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A004
- **Category:** DX
- **Capabilities:** P0-A01–P0-A05, DX-05–DX-06
- **Scope (In-Scope Files):** `ts/src/index.ts`, `ts/src/imperative/`, `ts/src/jsx/`, `ts/src/runtime/`, declaration build
- **Scope (Out-of-Scope Files):** public Signals, `/effect`, raw FFI, separate declarative package
- **Verification Command:** `bun test ts/test-effect.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if the root surface needs Promise-wrapped Effect APIs or exports Reactivity identity.
- **Description:** Implement root Effect lifecycle, JSX syntax, private Reactivity, scopes, Streams, and services while exposing the complete advanced Imperative SDK only at `tuvren-tui/imperative` with no Rust knowledge required.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Packed declarations match the raw contracts; the root has no imperative or Signal leakage; both workflows render, update, fail with typed errors, and clean up through the same runtime authority.
```

#### TUI-A006 Implement failure supervision, stable errors, and terminal-safe lifecycle exits

- **Type:** Security
- **Effort:** 5
- **Dependencies:** TUI-A005
- **Category:** Correctness
- **Capabilities:** P0-A04, P0-N07–P0-N11, P0-O09–P0-O11, P0-O18, REL-01
- **Scope (In-Scope Files):** `ts/src/runtime/`, `ts/src/errors/`, `native/src/context.rs`, `native/src/terminal/`, lifecycle fault tests
- **Scope (Out-of-Scope Files):** browser crash reporting, remote upload, process-global permanent failure
- **Verification Command:** `bun run test:terminal`
- **Expected Success Output:** every connected exit path restores the prior terminal state; disconnect paths close cleanly
- **STOP Conditions:** STOP if a recoverable failure would discard a healthy context or an unrecoverable failure would preserve mutable private identities.
- **Description:** Map private statuses to stable public errors, preserve the last known-good Surface for recoverable failures, supervise unrecovered roots, restore terminal state, discard inconsistent contexts, and allow explicit restart.
- **Acceptance:**
  - **Mode:** gherkin
  - **Evidence:**

```text
Given success, interruption, Command failure, Component failure, application exception, contained native panic, partial-commit invariant failure, and disconnect, when the lifecycle exits, then REL-01 restoration and the declared recovery/discard policy hold.
```

#### TUI-A007 Remove superseded runtime surfaces and provide migration tooling

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** TUI-A005
- **Category:** Tech-Debt
- **Capabilities:** P0-A08, P0-B08, OPS-04
- **Scope (In-Scope Files):** `ts/src/`, `native/src/threaded_render.rs`, migration scripts, changelog and migration guide
- **Scope (Out-of-Scope Files):** new RuntimeExtension or Plugin protocol, compatibility aliases beyond the declared migration window
- **Verification Command:** `bun run check:contracts`
- **Expected Success Output:** `exit 0` with no forbidden export or retired native module
- **STOP Conditions:** STOP if removal would erase a capability that is not represented by the new package contracts.
- **Description:** Remove root imperative exports, `/effect`, public Signals, Extension registries, Plugin vocabulary, global context access, per-property hot-path ABI use, and the background-render experiment; provide mechanical import and rename migrations where practical.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Export and source scans find no forbidden surface; migration fixtures compile against the new entrypoints; every breaking change has same-release guidance.
```
