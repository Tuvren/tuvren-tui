# Epic I — Distribution, examples, OpenCode evidence, and atomic release

Turn the completed runtime into the one-command, five-target, evidence-backed `0.1.0` product required by P0-O01–P0-O19.

#### TUI-I001 Build exact public and platform packages with the private resolver

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A007
- **Category:** Feature-Evolution
- **Capabilities:** P0-O01–P0-O06, RES-02
- **Scope (In-Scope Files):** root `package.json`, `scripts/build-package.ts`, `scripts/test-release-package.ts`, `ts/package.json`, `ts/dist/`, `packages/`, `ts/src/ffi/`, `ts/check-bundle.ts`
- **Scope (Out-of-Scope Files):** documented platform-package installation, source builds outside proven checkouts, musl/Alpine
- **Verification Command:** `bun run test:release-package`
- **Expected Success Output:** packed public package installs and resolves each exact mocked target without native setup
- **STOP Conditions:** STOP if emitted manifests differ from raw contracts or ordinary loading requires an environment variable/toolchain.
- **Description:** Materialize the exact workspace, public, and five auxiliary manifests; compile ESM, declarations and maps; stage native artifacts and licenses; enforce the 100 KB host bundle gate; and implement override → platform package → proven checkout → diagnostic resolver order and ABI equality.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Pack/install tests inspect exports, files, peers, optional packages, binary, source maps, license, resolver order, version mismatch, unsupported targets, and absence of private/raw symbols; `bun run ts/check-bundle.ts` reports at most 100 KB excluding approved peers and artifacts.
```

#### TUI-I002 Ship the `tuvren` developer CLI and hard-restart watch workflow

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-G004, TUI-G005, TUI-G006, TUI-I001
- **Category:** DX
- **Capabilities:** P0-N02, P0-N04, P0-N09, P0-N16, P0-O06
- **Scope (In-Scope Files):** `ts/src/cli/`, CLI integration tests, package binary output
- **Scope (Out-of-Scope Files):** network listeners, remote uploads, state-preserving reload
- **Verification Command:** `bun run test:release-package`
- **Expected Success Output:** help plus the exact `dev`, `doctor`, and `trace view` contracts pass from the packed package
- **STOP Conditions:** STOP if watch mode preserves a context or CLI diagnostics disclose protected values.
- **Description:** Implement the exact `contracts/cli.json` surface: `dev`, `doctor`, and `trace view`, including the terminal-native Inspect/Timeline/Issues workflow reached from development mode, source-mapped errors, diagnostic exit codes, trace confirmation, and hard-restart watch.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Packed CLI tests prove every schema-declared command, option, exit code, no-network default, confirmation boundary, terminal-native inspector path, source maps, restoration, and fresh context identity on watch restart; undeclared `run`, `inspect`, `replay`, or `version` commands are not added.
```

#### TUI-I003 Establish five-target CI, supply-chain, and artifact provenance gates

- **Type:** Security
- **Effort:** 8
- **Dependencies:** TUI-F005, TUI-G007, TUI-I001
- **Category:** Security
- **Capabilities:** P0-O03–P0-O12, OPS-01–OPS-02, SAFE-03
- **Scope (In-Scope Files):** `.github/workflows/`, `scripts/test-platform-smoke.ts`, release scripts, audit policies, lockfiles and provenance fixtures
- **Scope (Out-of-Scope Files):** cross-compile-only proof, mutable action tags, partial target release
- **Verification Command:** `bun run test:platform-smoke`
- **Expected Success Output:** all five native target jobs install, load, initialize, render headlessly, and shut down
- **STOP Conditions:** STOP on missing native execution, unlocked inputs, absent checksum/provenance, or non-atomic target set.
- **Description:** Pin immutable CI inputs; run `cargo audit --file native/Cargo.lock`, `cargo deny check --manifest-path native/Cargo.toml`, and root-workspace `bun audit`; build each target; generate provenance and checksums; validate exact versions; and execute target-native package smokes.
- **Acceptance:**
  - **Mode:** runbook_probe
  - **Evidence:**

```text
Linux x64/arm64, macOS arm64/x64, and Windows x64 logs prove native execution from packed artifacts; audit and provenance reports contain no blocking issue or untraceable artifact.
```

#### TUI-I004 Publish representative examples and the capability traceability map

- **Type:** Chore
- **Effort:** 8
- **Dependencies:** TUI-B009, TUI-D003, TUI-E005, TUI-F005, TUI-G004, TUI-I001
- **Category:** Docs
- **Capabilities:** P0-O13–P0-O14, OPS-03, DX-05–DX-06
- **Scope (In-Scope Files):** `examples/flagship/`, `examples/capabilities/`, example tests, documentation, capability-map script
- **Scope (Out-of-Scope Files):** internal imports, Plugin examples, unsupported P1/P2 claims
- **Verification Command:** `bun run check:capability-map`
- **Expected Success Output:** 100% of P0 IDs map to a published-entrypoint example, automated evidence, architecture flow, and active ticket
- **STOP Conditions:** STOP if an example requires raw native details, private packages, or a systems toolchain.
- **Description:** Build and execute representative dashboard/form, editor/inspector, streaming console, inline/split-footer, styling, accessibility, devtools, and focused capability examples from installed packed artifacts after the complete catalog and OD-02 outcome are integrated.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
The machine-readable map covers every P0 ID exactly, examples execute from packed public entrypoints, every Primitive has imperative evidence, every Component declarative evidence, and performance claims link raw benchmarks.
```

#### TUI-I005 Build the OpenCode reference adapter, client, replay, and performance fixture

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-D004, TUI-E005, TUI-H002, TUI-H006, TUI-I004
- **Category:** DX
- **Capabilities:** P0-O19, OPS-06
- **Scope (In-Scope Files):** `examples/opencode-client/`, `examples/fixtures/`, OpenCode adapter and benchmark fixture
- **Scope (Out-of-Scope Files):** OpenCode types in the SDK, a supported integration contract, Plugin contributions
- **Verification Command:** `bun run bench:comparative`
- **Expected Success Output:** deterministic replay passes and live-adapter fixture meets every binding absolute performance gate
- **STOP Conditions:** STOP if the client needs a core contract change or leaks OpenCode types into public declarations; route the gap upstream.
- **Description:** Build the required published-API reference with SplitPane, streaming Transcript, Text Document input, Commands/Keymaps/palette, interrupts, errors/reconnect, deterministic replay, and live adapter isolated from core contracts.
- **Acceptance:**
  - **Mode:** benchmark
  - **Evidence:**

```text
Replay is identical across 100 runs; live and replay workloads publish schema-valid absolute results; source scans show no OpenCode dependency or type in the SDK.
```

#### TUI-I006 Run the complete release-candidate evidence and atomic-manifest gate

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** TUI-D003, TUI-H003, TUI-H004, TUI-H005, TUI-I002, TUI-I003, TUI-I004, TUI-I005
- **Category:** Correctness
- **Capabilities:** P0-O13–P0-O19, OPS-01–OPS-06, SAFE-01–SAFE-03
- **Scope (In-Scope Files):** `scripts/check-release-candidate.ts`, release validation scripts, schema-valid evidence, release-candidate report and migration guide
- **Scope (Out-of-Scope Files):** weakening a gate for schedule, publishing final artifacts
- **Verification Command:** `bun run check:release-candidate`
- **Expected Success Output:** every P0 command including a fresh `check:abi-parity`, registered error, required benchmark check, trace payload, replay expectation, evidence row, and named cross-field validator passes and `validateAtomicReleaseManifest` accepts exactly six matching artifacts
- **STOP Conditions:** STOP on any missing capability row, unresolved OD-01/OD-02 Evolution, target failure, performance failure, privacy/security failure, undocumented break, or version/provenance mismatch.
- **Description:** Implement and run the Stage 3 aggregate command over exact toolchain, contract, fresh ABI parity, capability-map, semantic, terminal, every named bounded fuzz target, bundle, envelope, comparative, devtools, adoption, OpenCode, supply-chain, target, package, schema, migration, restoration, error-registry and snapshot/trace/replay/benchmark cross-field validation, and atomic-manifest evidence. Seeded contract cases include Semantic Tree graph/scalar and Issue tuple/interval corruption, Trace ordering/identity-equality/instance-subject mapping/parent/domain/status/start/privacy/batch/wrap-boundary/foreign-or-misbased-or-mis-inherited-snapshot corruption, runtime replay handler suppression and exactly-once transaction application, surrogate key and wheel-wire drift, all four bound Command failure/environment propagation paths, all Command completion variants, document-bound TextArea authority, controlled/local List/Table/Select/Menu/palette selection, and executor-cached Collection scroll-position observation.
- **Acceptance:**
  - **Mode:** runbook_probe
  - **Evidence:**

```text
A fresh `check:release-candidate` run executes `check:toolchain` and `check:abi-parity` against the candidate revision, produces one human-readable candidate report and the schema-valid atomic manifest, skips no required subcommand, and proves all artifact versions and source revisions match with no alpha artifact represented as final.
```

#### TUI-I007 Publish the atomic `0.1.0` package set and verify it from the registry

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** TUI-I006
- **Category:** Feature-Evolution
- **Capabilities:** P0-O01–P0-O06, P0-O15–P0-O16
- **Scope (In-Scope Files):** release workflow, `scripts/test-registry-package.ts`, immutable release manifest and post-publish verification report
- **Scope (Out-of-Scope Files):** partial publish, post-`0.1.0` roadmap scope, v1 compatibility promises
- **Verification Command:** `bun run test:registry-package`
- **Expected Success Output:** registry-installed `0.1.0` passes all five target-native smokes plus CLI, declarations, source maps, licenses, checksums, provenance, and exact artifact/version/ABI verification
- **STOP Conditions:** STOP before quarantined publish unless TUI-I006 is clean; never attach the final `latest` tag unless registry verification passes for all six exact artifacts; if publish, verification, or tag promotion partially fails, restore quarantine tags and do not describe the set as final until atomic consistency is restored.
- **Description:** Publish `tuvren-tui` and all five platform packages at exact version `0.1.0` with provenance under one revision-scoped quarantine dist-tag that is not `latest`. Install those exact quarantined registry bytes and verify resolver, ABI, headless render, shutdown, CLI, declarations, maps, licenses, checksums, and provenance on all targets. Only after success, promote the same six immutable versions to the final tag; no rebuild or byte substitution is allowed between verification and promotion.
- **Acceptance:**
  - **Mode:** runbook_probe
  - **Evidence:**

```text
Quarantine-tag metadata and target-native logs prove all six artifacts, exact version/ABI equality, checksums/provenance, ordinary one-command install, no native setup, successful CLI execution, loadable declarations and source maps, complete licenses, and headless render/shutdown on every target. Final-tag metadata is created only afterward and resolves to the identical verified checksums for all six versions.
```
