# Stack specification

## Version

**v9.0.5** — corresponds to the latest entry in `.constitution/tech-spec/changelog.md`.

## Implementation posture

Tuvren ships one compiled TypeScript ESM SDK on Bun and one matching Rust native runtime. The public package defaults to the Effect UI SDK and exposes the complete Imperative SDK through an explicit subpath. Rust owns all mutable UI state. TypeScript owns authoring, application orchestration, the private reactive reconciler, the UI executor queue, public errors, and package resolution.

There is no database, network service, or persisted application state in the core product. Durable files owned by Tuvren are Diagnostic Traces, snapshots, terminal profiles, replay fixtures, benchmark results, and release manifests. Their schemas are under `data-models/`.

## Bill of materials

Versions were checked against official release documentation or registries on 2026-08-26. Manifest ranges may admit compatible patches, but release locks and CI use the exact versions in this table.

| Area | Exact baseline | Posture | Reason and compatibility rule |
| :-- | :-- | :-- | :-- |
| Rust toolchain | `1.98.0`, edition `2024` | Adopt | Current stable toolchain; one pinned `rust-toolchain.toml` drives local and CI builds. MSRV equals the pinned release until `1.0.0`. |
| Fuzz-only Rust toolchain | `nightly-2026-08-20` with `rust-src`; cargo-fuzz `0.13.2`; GCC `15.2.0` C++ compiler | Adopt for fuzz jobs only | The dated nightly exists in the official Rust distribution. cargo-fuzz requires nightly, LLVM sanitizer support, and a C++11 compiler; `devenv.nix` provisions and verifies this isolated toolchain without changing the stable production MSRV. Release-gating fuzz jobs run on Linux x64 and arm64 workers. |
| Host runtime | Bun `1.4.0` | Trial | Current stable host and package manager. The 1.4 runtime is a major internal rewrite; it must pass all five target, FFI, lifecycle, and benchmark gates before final `0.1.0`. |
| Host language compiler | TypeScript `5.9.3` | Adopt | Contract declarations pass on this baseline. The Brownfield application source currently fails its own strict check with 188 errors, led by duplicate fields and unsafe Bun FFI casts; Stage 4 must schedule reconciliation. TypeScript `7.0.2` is Hold because its isolated migration check also fails. |
| Declarative application model | Effect `3.22.1` | Adopt | Required peer range `>=3.22.1 <4`; CI and development pin `3.22.1`. Effect 4 prerelease builds are unsupported. |
| Private Reactivity | `@preact/signals-core` `1.14.4` | Adopt internally | Current compatible minor, used only inside reconciliation and hooks. No Signal type or constructor is exported publicly; a scheduled lane tests the latest compatible minor. |
| Native bridge | `bun:ffi` from Bun `1.4.0` | Trial | Private high-performance C ABI bridge. Bun documents it as experimental, so five-target loading, malformed-input fuzzing, panic containment, and ABI benchmarks are release gates. No callback from Rust into TypeScript is permitted. |
| Layout | Taffy `0.14.0` | Adopt | Provides Flexbox and Grid. Enable only `std`, `taffy_tree`, `flexbox`, `grid`, `content_size`, and `detailed_layout_info`; browser block, float, and parser features remain disabled. |
| Terminal I/O | Crossterm `0.29.0` | Adopt | Stable cross-platform baseline behind Tuvren's own Terminal Session and protocol decoders. |
| Markdown | pulldown-cmark `0.13.4` | Adopt | Native CommonMark parser. Enable only the declared GitHub-Flavored Markdown options. |
| Syntax highlighting | syntect `5.3.0` | Adopt | Native code styling with default syntaxes and themes; regex backend remains explicit and benchmarked. |
| Unicode segmentation | unicode-segmentation `1.13.3` | Adopt | Grapheme, word, and sentence boundaries; all public coordinates still use Tuvren grapheme indices. |
| Terminal cell width | unicode-width `0.2.2` | Adopt | Default width model, overridden by negotiated terminal width policy where available. |
| Serialization | serde `1.0.229`, serde_json `1.0.151` | Adopt | Versioned Diagnostic Trace, snapshot, profile, replay, benchmark, and release-manifest shapes. |
| Validation helpers | regex `1.13.1`, base64 `0.23.1`, bitflags `2.13.1` | Adopt | Bounded parsing, protocol payloads, and capability/state masks. |
| Native benchmarks | Criterion `0.8.2` | Adopt | Statistical native microbenchmarks with raw samples and pinned configuration. |
| Property tests | proptest `1.11.0` | Adopt | State-machine and codec invariants for transactions, text, Events, projections, and terminal responses. |
| Native fuzzing | cargo-fuzz `0.13.2`, libfuzzer-sys `0.4.13` | Adopt | Transaction, trace, formatted-text, terminal-response, clipboard, and replay decoders. |
| Schema validation | Ajv `8.20.0`, ajv-formats `3.0.1` | Adopt | Compile every Draft 2020-12 schema and enforce date-time and URI formats. |
| Supply-chain checks | cargo-audit `0.22.2`, cargo-deny `0.20.2`, Bun audit | Adopt | Block advisories, denied licenses or sources, duplicate-risk drift, and unlocked package graphs. |
| Documentation formatting | Prettier `3.9.6`, invoked through `bunx` | Adopt | Markdown uses `--prose-wrap never`; no other package manager participates. |

## Package and entrypoint contract

The only documented install target is `tuvren-tui`. Platform packages are resolver implementation details and must not appear in ordinary application documentation.

| Entrypoint | Purpose | Public compatibility surface |
| :-- | :-- | :-- |
| `tuvren-tui` | Effect-first Components, JSX types, Effect-native lifecycle, Commands, Keymaps, styling, terminal services, and public errors | `contracts/tuvren-tui.d.ts` |
| `tuvren-tui/jsx-runtime` | Production JSX transform | `contracts/jsx-runtime.d.ts` |
| `tuvren-tui/jsx-dev-runtime` | Development JSX transform | `contracts/jsx-runtime.d.ts` |
| `tuvren-tui/testing` | Effect-oriented semantic harness and drivers | `contracts/testing.d.ts` |
| `tuvren-tui/imperative` | Capability-complete imperative primitives, Components, and managed or manual lifecycle | `contracts/imperative.d.ts` |
| `tuvren-tui/imperative/testing` | Imperative semantic harness and drivers | `contracts/imperative-testing.d.ts` |

There is no public `/effect` entrypoint. Root exports do not expose `@preact/signals-core`, raw FFI symbols, numeric RuntimeNode identities, platform package names, or internal ABI status codes.

`contracts/package-workspace.json` is the raw target root manifest and owns every canonical `bun run` script. `contracts/package-public.json` is the raw target manifest for the documented package. It fixes the complete export map, `tuvren` binary, peer dependency, internal Reactivity dependency, optional platform packages, Bun engine, and published files. The five `contracts/package-platform-*.json` files are the exact private target manifests; `contracts/package-platforms.json` is their generation index. Together they fix every platform package name, `os`/`cpu`/`libc` selector, native filename, published file, and side-effect-free resolver module. Each entry module converts its native file URL with `Bun.fileURLToPath()` so encoded paths and Windows drive letters resolve correctly. Release tooling materializes those records without adding exports. The canonical package build is `bun run build:package`; it writes only `ts/dist/`, `packages/*/index.js`, `packages/*/native/<artifact>`, declaration maps, source maps, licenses, and target manifests before `bun run test:release-package` inspects the packed archives.

## Native build and artifact matrix

| Target | Rust target | Artifact inside private platform package |
| :-- | :-- | :-- |
| glibc Linux x64 | `x86_64-unknown-linux-gnu` | `libtuvren_tui.so` |
| glibc Linux arm64 | `aarch64-unknown-linux-gnu` | `libtuvren_tui.so` |
| macOS arm64 | `aarch64-apple-darwin` | `libtuvren_tui.dylib` |
| macOS x64 | `x86_64-apple-darwin` | `libtuvren_tui.dylib` |
| Windows x64 | `x86_64-pc-windows-msvc` | `tuvren_tui.dll` |

The native crate produces `cdylib` for the SDK and `rlib` for native tests and benchmarks. Linux public artifacts target glibc; musl and Alpine fail with an actionable unsupported-target diagnostic.

## Architecture-flow traceability

| Architecture flow | Physical contracts | Data model or implementation owner |
| :-- | :-- | :-- |
| Authoring and lifecycle | `tuvren-tui.d.ts`, `imperative.d.ts`, `native-abi.h` | `RuntimeContext`, Effect scopes, UI executor |
| Component composition | `shared.d.ts`, both SDK declarations | `RuntimeNode`, first-party Component modules |
| Layout and responsive behavior | `shared.d.ts`, transaction properties | Taffy-backed composition and style kernel |
| Styling and Theme | `shared.d.ts`, transaction properties | Native StyleSheet and Theme registries with provenance |
| Text and rich content | `shared.d.ts`, transaction byte arena | `TextDocument`, `GraphemePool`, StyledText decoder |
| Text editing | both SDK declarations, transaction text-edit opcode, bounded query/copy-out ABI | `TextDocument` operation history and clipboard service |
| Input, Event, focus, and direct manipulation | `shared.d.ts`, Event batch ABI | Interaction kernel; final interception records blocked by OD-02 |
| Command and Keymap | both SDK declarations, transaction ABI | Command registries, scoped Keymap resolution, and UI executor |
| Virtual Collection and transient feedback | both SDK declarations | `VirtualCollectionState`, generations, Resident Projection |
| Transcript and streaming data | `shared.d.ts`, transaction Transcript opcode | `TranscriptState`, stable block identities, Text Documents |
| Terminal, Screen Mode, and clipboard | both SDK declarations, native ABI | `TerminalSession`, terminal profile schema |
| Accessibility semantics | `shared.d.ts`, snapshot schema | `SemanticNode`, announcement Event, conformance harness |
| Animation and time | both SDK declarations, apply/cancel/replace animation opcodes | Native animation registry and manual clock |
| Devtools, testing, and diagnostics | testing declarations, trace and snapshot schemas | Diagnostic Graph and isolated replay context |
| Installation, distribution, safety, and release | `cli.json`, release and benchmark schemas | Resolver, atomic release manifest, target smoke matrix |

## Resolution and release policy

The resolver order is:

1. `TUVREN_LIB_PATH`, only as an explicit contributor or diagnostic override.
2. The exact-version private platform package resolved through the Host Environment.
3. The local Cargo release artifact, only when workspace markers prove a source checkout.
4. A typed diagnostic failure.

The SDK package and all platform packages publish atomically with the same exact version and release manifest. ABI compatibility is private and exact-version only. A mismatch rejects before context creation.

Pre-`1.0` minor releases may break public SDK contracts only with a changelog, migration guide, one-minor deprecation when safe, and a codemod when practical. Diagnostic Trace, snapshot, terminal-profile, replay, benchmark-result, and release-manifest schemas version independently. Every exact schema version is a new immutable artifact with `$id` `https://tuvren.dev/schema/<family>/<semver>/schema.json`; its checked-in filename adds `-<semver>` once more than one version exists. A schema major may break readers, a minor may add optional fields, and a patch may only correct prose or narrow a validator defect through a newly versioned artifact—it never replaces a published file. Readers dispatch on `schemaVersion` before parsing the payload, support the current major and the immediately previous major for one SDK minor through a named migrator, and reject all unregistered versions. `contracts/schema-migrations.json` maps every supported version to its immutable artifact, exact `$id`, and named migration path.

JSON Schema validates each durable shape but cannot enforce cross-artifact equality. Release verification must additionally run `validateAtomicReleaseManifest` as defined by `contracts/release-validation.json`; that validator proves exact artifact membership, SemVer, package/artifact version equality, ABI equality, checksums, package manifests, source revisions, and provenance before any publish begins.

`bun run check:release-candidate` is the aggregate release gate. Its target implementation executes contract, native quality, and capability checks; semantic, terminal, target, and package suites; every named fuzz target; the 100 KB bundle check; envelope, comparative, and devtools benchmarks; adoption studies; OpenCode replay and live evidence; supply-chain audits; and `validateAtomicReleaseManifest`. It fails on the first missing, skipped, stale, or nonconforming required result, checks every constituent artifact against the candidate source revision, and writes a human-readable release-candidate report plus the existing schema-valid atomic release manifest. It does not introduce a durable evidence-index format.

Diagnostic snapshots use `row-major-rle-v1` cell runs. `validateDiagnosticSnapshotRuns` in `contracts/snapshot-validation.json` performs the checked cross-field sum, exact dense reconstruction, and cursor bounds that JSON Schema cannot express.

## Dependency and upgrade policy

- Commit `native/Cargo.lock`, the root `bun.lock`, and the independent `.constitution/tech-spec/contracts/bun.lock`; CI uses frozen Bun workspace and contract installs plus `--locked` Cargo operations. Remove the competing `ts/bun.lock` during workspace migration. Production builds use stable `1.98.0`; fuzz commands select `+nightly-2026-08-20` explicitly and never determine the MSRV.
- Production dependencies use explicit compatible ranges in manifests and exact versions in lockfiles. Toolchains and release automation use exact versions or immutable commit hashes.
- One scheduled compatibility lane tests the latest patch of Rust stable, Bun stable, Effect 3, TypeScript 5.9, and every direct Rust dependency without updating the release lock.
- Contract validation has its own frozen `contracts/bun.lock`, generated through Bun, and resolves the exact Effect `3.22.1`, TypeScript `5.9.3`, Reactivity `1.14.4`, and schema-validator baselines instead of borrowing the Brownfield application lock.
- Major dependency upgrades require a TechSpec Evolution pass when they affect public types, the private ABI, terminal behavior, layout, Unicode, schemas, or performance evidence.
- TypeScript 7 remains Hold until the public declarations, Bun FFI types, emitted declarations, and all examples pass with no suppression added solely for the upgrade.
- Effect 4 remains unsupported until it is stable and a PRD-compatible Effect-native surface passes a dedicated TechSpec Evolution review.
- Bun FFI remains Trial until the final `0.1.0` release gates prove it on every supported target. Its experimental vendor status must remain visible in risk and release documentation.

## Verification evidence for this pass

- Local source resolves Rust `1.93.1`, Bun `1.3.8`, TypeScript `5.9.3`, Effect `3.21.2`, Taffy `0.9.2`, and the other lockfile versions recorded in the Brownfield audit.
- Official sources report Rust `1.98.0`, Bun `1.4.0`, TypeScript `7.0.2`, Effect `3.22.1`, Taffy `0.14.0`, and the native crate versions pinned above.
- An isolated TypeScript `7.0.2` typecheck failed current source declarations; this is the evidence for Hold rather than an assumption of compatibility.
- Effect `3.22.1` declarations confirm `Effect<A, E, R>`, `Stream<A, E, R>`, `Layer<ROut, E, RIn>`, scoped effects, and `runPromise` signatures used by the public contract.
