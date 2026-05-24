# Quality Gate Policy

**Version**: 3.0
**Status**: Active
**Date**: May 2026
**Source**: `.github/workflows/ci.yml`, `docs/TechSpec.md`

---

## 1. Overview

This document defines the current quality gates for Tuvren TUI release readiness. Some gates are blocking in CI, while others are reporting-only guardrails that still require human review. Additional local verification commands are listed where the source tree already provides them but CI does not yet treat them as blocking.

For reporting-only benchmark jobs, the benchmark commands themselves are still expected to compile and run successfully in CI. "Reporting-only" means the job does not currently parse the emitted numbers into an automatic regression threshold failure.

Current CI executes the host test and benchmark surfaces on `ubuntu-latest`. Cross-platform build and load smoke now runs on all five supported public release targets (`linux-x64`, `linux-arm64`, `darwin-arm64`, `darwin-x64`, `win32-x64`) as a blocking gate per the Epic P productization contract. `linux-arm64` is cross-compiled on an x64 runner and therefore receives build + install-smoke only (no headless `dlopen` load verification). Benchmark-heavy gates (bundle, FFI overhead, render budget, substrate throughput) remain Linux-blocking until cross-platform performance gates are intentionally promoted.

Repo-side host verification entrypoints that `dlopen` directly are expected to validate the local Cargo-built artifact rather than a packaged binary, so branch verification is tied to the code under review.

---

## 2. Gate Definitions

### Gate 1: Native Tests (including Golden Snapshots)

| Property | Value |
| --- | --- |
| **Metric** | All native tests pass and golden fixtures match committed snapshots |
| **Threshold** | 0 failures |
| **CI Job** | `native-tests` |
| **Enforcement** | `cargo test --manifest-path native/Cargo.toml` |
| **Recovery** | Fix the failure. If render output changed intentionally, regenerate fixtures with `GOLDEN_UPDATE=1 cargo test --manifest-path native/Cargo.toml golden`. |

### Gate 2: Native Code Quality (Clippy + Fmt)

| Property | Value |
| --- | --- |
| **Metric** | Zero clippy warnings and formatting consistency |
| **Threshold** | 0 warnings with `-D warnings` |
| **CI Job** | `native-tests` |
| **Enforcement** | `cargo clippy --manifest-path native/Cargo.toml -- -D warnings` and `cargo fmt --manifest-path native/Cargo.toml -- --check` |

### Gate 3: Native Benchmark Regression

| Property | Value |
| --- | --- |
| **Metric** | Writer, text-cache, and substrate benchmark health |
| **Threshold** | No materially suspicious regression in the benchmark output for tracked suites |
| **CI Job** | `native-benchmarks` |
| **CI Mode** | Mixed: writer/text-cache reporting, substrate threshold-enforced |
| **Enforcement** | `cargo bench --manifest-path native/Cargo.toml --bench writer_bench` and `cargo bench --manifest-path native/Cargo.toml --bench text_cache_bench` must complete successfully in CI. `cargo bench --manifest-path native/Cargo.toml --bench text_substrate_bench` must also satisfy the checked-in threshold parser in `.github/workflows/ci.yml`, so severe append/cursor regressions fail the workflow instead of only printing numbers. |
| **Tracked suites** | `writer_compact_*`, `writer_emit_*`, `writer_pipeline_full`, `cache_insert_1000`, `cache_get_hit_1000`, `cache_eviction_pressure`, `substrate_append_*`, `substrate_set_cursor_*`, `substrate_byte_to_visual_*` |
| **Local supplementary check** | `cargo bench --manifest-path native/Cargo.toml --bench devtools_bench` |

### Gate 4: Writer Throughput Reduction

| Property | Value |
| --- | --- |
| **Metric** | Style and cursor operation reduction versus per-cell emission baseline |
| **Threshold** | `>= 35%` reduction for the tracked writer tests |
| **CI Job** | `native-tests` |
| **Enforcement** | Native unit assertions such as `writer_reduces_ops_*` |

### Gate 5: Host Test Surface

| Property | Value |
| --- | --- |
| **Metric** | Host integration, reconciler, example replay, install smoke, and runner API tests all pass |
| **Threshold** | 0 failures |
| **CI Job** | `host-tests` |
| **Enforcement** | `bun test ts/test-ffi.test.ts`, `bun test ts/test-jsx.test.ts`, `bun test ts/test-examples.test.ts`, `bun test ts/test-install.test.ts`, `bun test ts/test-runner.test.ts` |

### Gate 6: Host Bundle Budget

| Property | Value |
| --- | --- |
| **Metric** | Minified TypeScript bundle size |
| **Threshold** | `< 75KB` |
| **CI Job** | `host-tests` |
| **Enforcement** | `bun run ts/check-bundle.ts` |

### Gate 7: Host Render Performance

| Property | Value |
| --- | --- |
| **Metric** | Host-side render frame time, mutation cycle time, and render-duration counters |
| **Threshold** | Remain within the intended `< 16ms` interactive envelope |
| **CI Job** | `host-benchmarks` |
| **CI Mode** | Blocking |
| **Enforcement** | `bun run ts/bench-render.ts` |

### Gate 8: FFI Call Overhead

| Property | Value |
| --- | --- |
| **Metric** | Single FFI call round-trip latency |
| **Threshold** | `< 1ms` |
| **CI Job** | `host-benchmarks` |
| **CI Mode** | Blocking |
| **Enforcement** | `bun run ts/bench-ffi.ts` |

### Gate 9: Cross-Platform Install and Load Smoke (Epic P — PROD-P006)

| Property | Value |
| --- | --- |
| **Metric** | Native library resolver and headless load succeed on every supported public release target |
| **Threshold** | 0 failures across the full platform matrix |
| **CI Job** | `cross-platform-smoke` |
| **CI Mode** | Blocking |
| **Platform matrix** | `linux-x64`, `linux-arm64`, `darwin-arm64`, `darwin-x64`, `win32-x64` |
| **Enforcement** | Each platform builds the native library from source and runs `bun test ts/test-install.test.ts`. Native targets (`linux-x64`, `darwin-arm64`, `darwin-x64`, `win32-x64`) also run a headless `dlopen` smoke confirming `tui_init_headless` / `tui_shutdown` succeed. `linux-arm64` is cross-compiled on an x64 runner and receives build + install-smoke only; load smoke requires a native arm64 runner and is tracked as a future gate upgrade. |
| **Benchmark promotion** | Benchmark-heavy gates (Gates 3, 7, 8) remain Linux-only. Promoting any benchmark gate to a multi-platform blocking check requires an explicit decision tracked in `Tasks.md`. |
| **Release timing** | This gate is pre-merge blocking in CI. No separate post-publish verification step exists at this time; Epic V will add packed/registry install smoke before the first public npm publish. |

---

## 3. Gate Flow

```text
CI Trigger
  |
  |-- native-tests --------- native tests + fmt + clippy + writer assertions
  |-- native-benchmarks ----- writer/text-cache reporting + substrate threshold gate
  |-- host-tests ------------ ffi + jsx + examples + install + runner + bundle
  |-- host-benchmarks ------- ffi bench + render bench (blocking)
  |-- cross-platform-smoke -- build + install-smoke on all 5 targets; load smoke on 4 (linux-arm64 is cross-compile only) (PROD-P006)
  `-- quality-gate ---------- aggregate pass/fail result
```

---

## 4. Gate-to-Contract Mapping

| Gate | Primary Contract | Source of Truth |
| --- | --- | --- |
| Gate 1 | Render and replay correctness | `docs/TechSpec.md`, `native/fixtures/`, native test suite |
| Gate 2 | Native implementation hygiene | `docs/TechSpec.md`, Rust lint/format rules |
| Gate 3 | Writer, text-cache, and substrate throughput health | `docs/TechSpec.md`, native benches |
| Gate 4 | Terminal emission efficiency | `docs/TechSpec.md`, writer tests |
| Gate 5 | Host wrapper and example correctness | `docs/TechSpec.md`, `ts/` test suite |
| Gate 6 | Host bundle-size constraint | `docs/PRD.md`, `docs/TechSpec.md`, `ts/check-bundle.ts` |
| Gate 7 | Interactive render budget target | `docs/PRD.md`, `docs/TechSpec.md`, render bench |
| Gate 8 | Foreign-function overhead target | `docs/PRD.md`, `docs/TechSpec.md`, FFI bench |
| Gate 9 | Cross-platform install and load trust | `docs/PRD.md` §5, `docs/TechSpec.md` §5.4, `docs/Tasks.md` archived Epic P summary |

---

## 5. Fixture Update Protocol

When intentional render changes cause golden mismatches:

1. Confirm the change is intentional.
2. Regenerate the fixtures with `GOLDEN_UPDATE=1 cargo test --manifest-path native/Cargo.toml golden`.
3. Review the updated fixture output.
4. Commit the fixture changes alongside the code change.

---

## 6. Benchmark Baseline Notes

- Criterion baselines are machine-local and are not committed to git.
- `native-benchmarks` reports writer/text-cache suites and blocks on the substrate threshold parser.
- `host-benchmarks` is currently blocking for the scripted FFI and render budget checks.
- `devtools_bench` exists in the source tree and should be used during devtools-sensitive changes even though it is not currently a blocking CI step.

---

## 7. Cross-Platform Verification Notes (Epic P)

The `cross-platform-smoke` job was introduced in Epic P (PROD-P006) to satisfy the PRD §5 requirement that every supported public release target receives install and load verification before the productization wave is considered complete. Epic V will extend release verification with package-manager install smoke against packed or published `tuvren-tui@0.1.0` and auxiliary native packages.

**Benchmark promotion policy:** Benchmark-heavy gates (Gates 3, 7, 8) remain Linux-blocking because:
- Native benchmark variance across CI runners is harder to interpret across OS families without establishing stable cross-platform baselines.
- The substrate, writer, and FFI benchmarks are micro-benchmarks that measure native code paths already validated by Gate 1 correctness tests.
- Promoting benchmark gates to multi-platform blocking adds CI cost and flakiness risk without proportional safety benefit at this stage.

When the decision is made to promote any benchmark gate to multi-platform enforcement, that change must be tracked as an explicit ticket in `Tasks.md` with a rationale for the threshold values chosen on each platform.

**musl/Alpine exclusion:** Linux auxiliary packages declare `"libc": ["glibc"]` in their `package.json`. Bun's package manager (Bun ≥ 1.1) respects the `libc` field for optional dependency filtering, preventing glibc-targeting packages from installing on musl hosts. The resolver also surfaces a clear diagnostic when the native library cannot be found. Public musl/Alpine support is out of scope per PRD §6 until a musl-targeted build and testing path is explicitly added to `Tasks.md`.
