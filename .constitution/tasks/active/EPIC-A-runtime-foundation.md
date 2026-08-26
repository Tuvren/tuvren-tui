# Epic A — Runtime foundation and public SDK boundary

Establish the Stage 3 physical contract before capability work builds on it. This epic owns P0-A01–P0-A09 and the foundational portions of P0-O07–P0-O10.

#### TUI-A001 Establish the pinned toolchain and root Bun workspace

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** None
- **Category:** Dependency-Upgrade
- **Capabilities:** P0-A08, P0-O07, OPS-05
- **Scope (In-Scope Files):** `rust-toolchain.toml`, `native/Cargo.toml`, `native/Cargo.lock`, root `package.json`, root `bun.lock`, `ts/package.json`, removal of `ts/bun.lock`, `devenv.nix`
- **Scope (Out-of-Scope Files):** `.constitution/prd/`, `.constitution/architecture/`, public behavior beyond the Stage 3 contracts
- **Verification Command:** `bun install --frozen-lockfile && bun install --cwd .constitution/tech-spec/contracts --frozen-lockfile && cargo check --manifest-path native/Cargo.toml --locked && cargo +nightly-2026-08-20 --version && cargo +nightly-2026-08-20 fuzz --version && c++ --version`
- **Expected Success Output:** every command exits 0 with exact production and fuzz tool versions and no competing nested host lock
- **STOP Conditions:** STOP if a pinned Stage 3 dependency cannot build on a supported target; report the compatibility evidence for a Stage 3 Evolution pass.
- **Description:** Adopt the exact Rust and Bun workspace dependency baselines, move host dependency ownership to the root workspace, commit canonical locks, and preserve the independent contract-validation lock.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Frozen root and contract installs resolve the exact Stage 3 baselines; locked Cargo check uses stable Rust 1.98.0; the fuzz-only checks report nightly-2026-08-20, cargo-fuzz 0.13.2, and GCC 15.2.0; `devenv shell` exposes the same tools; no `ts/bun.lock` or unlocked direct dependency remains.
```

#### TUI-A008 Migrate the host module layout and repair the strict TypeScript baseline

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** TUI-A001
- **Category:** Tech-Debt
- **Capabilities:** P0-A08, DX-06
- **Scope (In-Scope Files):** `ts/src/`, `ts/tsconfig.json`, host forwarding files and source tests
- **Scope (Out-of-Scope Files):** new public behavior, weakened compiler options, compatibility forwarding beyond one migration wave
- **Verification Command:** `bun ts/node_modules/typescript/bin/tsc -p ts/tsconfig.json --noEmit`
- **Expected Success Output:** `exit 0` with the existing 188 strict errors resolved and no new suppressions
- **STOP Conditions:** STOP if moving a host module would change an approved public contract or runtime ownership boundary; route that change through Stage 3.
- **Description:** Move Brownfield TypeScript into the Stage 3 host ownership layout, repair duplicate fields and unsafe FFI casts, retain temporary forwarding only where allowed, and keep strict/noUnchecked/exact-optional compilation enabled.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
The complete host source typechecks with zero errors, target ownership paths exist, forwarding imports are acyclic and migration-scoped, and no `any`, unsafe double assertion, public native identity, or CommonJS shim is introduced.
```

#### TUI-A009 Implement the multi-language contract validator

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** TUI-A001
- **Category:** Correctness
- **Capabilities:** P0-A08, P0-O07, OPS-05
- **Scope (In-Scope Files):** `scripts/check-contracts.ts`, root `package.json`, frozen Stage 3 declarations/schemas/registries/model artifacts, contract validation fixtures
- **Scope (Out-of-Scope Files):** application behavior, release-candidate aggregation
- **Verification Command:** `bun run check:contracts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if a contract cannot be checked mechanically; identify the missing Stage 3 artifact instead of embedding an undocumented rule.
- **Description:** Implement the pre-implementation self-validator for public declarations, exact package manifests and scripts, immutable schemas and registries, the closed error-code registry, named snapshot/trace/replay/benchmark/atomic-release cross-field validators, and standalone C11/C++17 ABI plus Rust model compilation. Snapshot validation includes rooted Semantic Tree, exact Issue registry tuples, and ordered unsigned intervals; Trace validation includes strict sequence/time ordering, owned-versus-parent correlation, closed transaction status, every embedded snapshot, enclosing-context/transaction/render basis, retained Issue domains, privacy/replay-start coupling, and canonical exact ABI payload bytes. Production symbol coverage and cross-language byte parity belong to TUI-A003 after the target ABI exists.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
The command uses Effect 3.22.1 and TypeScript 5.9.3 from the contract lock, validates every raw contract and schema, executes every named cross-field validator including seeded sample-count/metric/replay-index, Issue tuple/interval, Semantic Tree graph, and Trace order/correlation/status/embedded-snapshot/privacy/start/payload drift, compiles each frozen C and Rust model independently, and fails on seeded contract drift without claiming parity with code that TUI-A003 has not built yet.
```

#### TUI-A010 Migrate native source into the target module ownership layout

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** TUI-A001
- **Category:** Tech-Debt
- **Capabilities:** P0-A08, SAFE-01
- **Scope (In-Scope Files):** `native/src/`, `native/Cargo.toml`, native module tests and one-wave forwarding modules
- **Scope (Out-of-Scope Files):** public ABI or behavior changes, TypeScript source, forwarding beyond one migration wave
- **Verification Command:** `bun run check:native`
- **Expected Success Output:** rustfmt, Rust 1.98.0 locked Clippy with warnings denied, and locked native tests all exit 0
- **STOP Conditions:** STOP if a move changes a Stage 3 ownership boundary, ABI record, or runtime behavior; route that change upstream instead of hiding it in the migration.
- **Description:** Move Brownfield native source into context, transaction, composition, interaction, content, animation, presentation, terminal, and diagnostics ownership while preserving behavior; repair the Rust 1.98.0 lint diagnostics in the moved source; and retain temporary migration forwarding only where permitted.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Rustfmt, locked Clippy with `-D warnings`, and locked tests pass the complete Rust 1.98.0 graph; module ownership matches the target tree; forwarding is acyclic and migration-scoped; no duplicate mutable authority appears; and ABI symbols remain mechanically identical.
```

#### TUI-A002 Implement explicit contexts and the single UI executor

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A008, TUI-A009, TUI-A010
- **Category:** Correctness
- **Capabilities:** P0-A04–P0-A07, REL-03
- **Scope (In-Scope Files):** `native/src/context.rs`, `ts/src/runtime/`, `ts/src/index.ts`, `ts/src/imperative/`
- **Scope (Out-of-Scope Files):** Component catalog, terminal protocol decoders, background rendering
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-runner.test.ts`
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
- **Scope (In-Scope Files):** root `package.json`, `scripts/check-abi-parity.ts`, `native/src/lib.rs`, `native/src/transaction.rs`, `native/fuzz/Cargo.toml`, `native/fuzz/fuzz_targets/transaction_decode.rs`, transaction corpus, `ts/src/ffi/`, generated ABI/symbol checks and cross-language byte fixtures
- **Scope (Out-of-Scope Files):** public numeric identities, TypeScript callbacks from Rust, Event arbitration disposition records
- **Verification Command:** `bun run check:abi-parity && cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz transaction_decode -- -max_total_time=60`
- **Expected Success Output:** generated production-symbol coverage and every TypeScript/Rust byte fixture pass before the bounded fuzz target completes with no crash, panic escape, out-of-bounds access, or invariant violation
- **STOP Conditions:** STOP if the implementation requires exposing RuntimeNode IDs or relaxing full-batch prevalidation.
- **Description:** Implement ABI 2.0 decoding, opcode/property/value compatibility, typed complex payloads, transaction-local node references, caller-owned mappings and indexed mutation results, bounded query/copy-out reads, exact-version loading, panic containment, generated production symbol coverage, TypeScript/Rust byte-fixture parity, and one Render Pass request per committed batch.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Generated checks cover every implemented ABI symbol; Rust and TypeScript decode checked-in byte fixtures identically; query and transaction outputs preflight caller capacities and never expose retained pointers; malformed, misaligned, overlapping, stale, oversized, or incompatible records are rejected before mutation; post-validation unexpected failure freezes and discards the context.
```

#### TUI-A004 Enforce transaction scheduling, backpressure, and render-request semantics

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-A003
- **Category:** Perf
- **Capabilities:** P0-A06–P0-A09, PERF-03, REL-03
- **Scope (In-Scope Files):** `ts/src/runtime/`, `native/src/context.rs`, `native/src/presentation/`, executor saturation tests
- **Scope (Out-of-Scope Files):** final 120/90/60 tuning, comparative performance cuts
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-runner.test.ts`
- **Expected Success Output:** `exit 0` with idle-pass and transaction scheduling assertions enabled
- **STOP Conditions:** STOP if coalescing would weaken Event order, final state, accessibility semantics, or cleanup.
- **Description:** Connect dirty causes, transaction commits, priority input work, bounded queues, cancellation, coalescing, and explicit render requests without polling or idle presentation.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Runner fixtures show zero unexplained idle passes, at most one Render Pass request per transaction, bounded saturation behavior, deterministic order, and no lost shutdown; TUI-H001 later measures the full envelope.
```

#### TUI-A005 Ship the Effect-first root and capability-complete imperative subpath

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A004
- **Category:** DX
- **Capabilities:** P0-A01–P0-A05, DX-05–DX-06
- **Scope (In-Scope Files):** `ts/src/index.ts`, `ts/src/imperative/`, `ts/src/jsx/`, `ts/src/runtime/`, declaration build
- **Scope (Out-of-Scope Files):** public Signals, `/effect`, raw FFI, separate declarative package
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-effect.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if the root surface needs Promise-wrapped Effect APIs or exports Reactivity identity.
- **Description:** Implement root Effect lifecycle, View-carried renderer/child/hook error and environment requirements, generic Error Boundary discharge, post-mount RenderSession failure retention, JSX syntax, private Reactivity, scopes, Streams, and services while exposing the complete advanced Imperative SDK only at `tuvren-tui/imperative` with no Rust knowledge required.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Packed declarations match the raw contracts; strict probes prove loader/Stream requirements survive nested View composition and handler failures survive through awaitExit; the root has no imperative or Signal leakage; both workflows render, update, fail with typed errors, and clean up through the same runtime authority.
```

#### TUI-A006 Implement failure supervision, stable errors, and terminal-safe lifecycle exits

- **Type:** Security
- **Effort:** 5
- **Dependencies:** TUI-A005
- **Category:** Correctness
- **Capabilities:** P0-A04, P0-N07–P0-N11, P0-O09–P0-O11, P0-O18, REL-01
- **Scope (In-Scope Files):** `ts/src/runtime/`, `ts/src/errors/`, `native/src/context.rs`, `native/src/terminal/`, lifecycle fault tests
- **Scope (Out-of-Scope Files):** browser crash reporting, remote upload, process-global permanent failure
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-runner.test.ts`
- **Expected Success Output:** `exit 0` across lifecycle fault fixtures; TUI-F005 later owns the terminal matrix
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
- **Scope (In-Scope Files):** `ts/src/`, `native/src/threaded_render.rs`, `examples/plugin-demo.ts`, `ts/test-extensions.test.ts`, `ts/check-bundle.ts`, migration scripts, changelog and migration guide
- **Scope (Out-of-Scope Files):** new RuntimeExtension or Plugin protocol, compatibility aliases beyond the declared migration window
- **Verification Command:** `bun run check:contracts`
- **Expected Success Output:** `exit 0` with no forbidden export or retired native module
- **STOP Conditions:** STOP if removal would erase a capability that is not represented by the new package contracts.
- **Description:** Remove root imperative exports, `/effect`, public Signals, Extension registries, Plugin vocabulary, global context access, per-property hot-path ABI use, and the background-render experiment; provide mechanical import and rename migrations where practical.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Repository-wide export, source, example, test, and bundle scans find no forbidden surface; stale Plugin fixtures are deleted or migrated; migration fixtures compile against the new entrypoints; every breaking change has same-release guidance.
```
