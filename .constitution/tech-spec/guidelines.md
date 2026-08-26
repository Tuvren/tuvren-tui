# Engineering guidelines

## Version

**v9.0.1** — corresponds to `.constitution/tech-spec/changelog.md`.

## Target repository structure

```text
tuvren-tui/
├── package.json                      # Private Bun workspace and canonical scripts
├── bun.lock                          # Canonical host/workspace dependency lock
├── native/
│   ├── src/
│   │   ├── lib.rs                    # Private C ABI entrypoints only
│   │   ├── context.rs                # Explicit context registry and owner-thread checks
│   │   ├── transaction.rs            # Decode, validate, and apply transaction batches
│   │   ├── composition/              # RuntimeNode tree, layout, StyleSheet, Theme, semantics
│   │   ├── interaction/              # Input, focus, modal, selection, pointer, Event ordering
│   │   ├── content/                  # Text Document, StyledText, editing, collections, Transcript
│   │   ├── animation/                # Elapsed time, timelines, reduced motion
│   │   ├── presentation/             # Layout, text projection, cells, diff, writer, frame tiers
│   │   ├── terminal/                 # Backends, Screen Modes, protocols, clipboard, output policy
│   │   └── diagnostics/              # Diagnostic Graph, Trace, Issues, snapshots, replay evidence
│   ├── benches/
│   ├── fuzz/
│   ├── Cargo.toml
│   └── Cargo.lock
├── ts/
│   ├── src/
│   │   ├── index.ts                  # Bare Effect UI SDK entrypoint
│   │   ├── imperative/               # Explicit Imperative SDK and advanced embedding
│   │   ├── components/               # First-party public Components and stable style slots
│   │   ├── runtime/                  # Managed scopes, UI executor, transactions, private Reactivity
│   │   ├── commands/                 # Command and Keymap services
│   │   ├── styling/                  # StyleSpec, StyleSheet, ThemeTokens, ThemeRecipes declarations
│   │   ├── testing/                  # Semantic harness, profiles, drivers, snapshots
│   │   ├── devtools/                 # CLI bridge, inspector views, trace files, source mapping
│   │   ├── ffi/                      # Private symbol table, binary codecs, resolver, error translation
│   │   └── jsx/                      # JSX transforms and private reconciler
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
├── packages/                         # Private exact-version platform packages
├── examples/
│   ├── flagship/                     # Dashboard/form, editor/inspector, streaming, inline/split
│   ├── capabilities/                 # One public example per shipped capability
│   ├── opencode-client/              # Reference adapter and deterministic replay only
│   └── fixtures/
├── benchmarks/
│   ├── fixtures/                     # Equivalent public-API competitive workloads
│   ├── terminal-profiles/
│   └── results/                      # Raw schema-valid evidence, not committed machine noise
├── scripts/                          # Contract, schema, release, and benchmark verification
├── .github/workflows/
├── rust-toolchain.toml
└── devenv.nix
```

Migration may happen incrementally, but completed modules must follow this target ownership. Compatibility forwarding files may exist for one migration wave only and cannot retain obsolete public exports.

## Rust standards

- Read and apply the repository's Rust core standard before authoring or reviewing Rust.
- Use Rust 2024 idioms and `rustfmt`; `cargo clippy -- -D warnings` is mandatory.
- `native/src/lib.rs` contains `extern "C"` entrypoints and delegates immediately. Business logic lives in the owning module.
- Every FFI entrypoint catches unwinding. No panic, borrowed pointer, reference, slice, Rust enum, trait object, or allocator-owned buffer crosses the ABI.
- Unsafe code is limited to audited boundary adapters. Each unsafe block states its preconditions and is covered by malformed-input tests or fuzz targets.
- The transaction decoder performs bounds, alignment, version, opcode, property, identity, UTF-8, grapheme, and payload validation before mutation.
- Once transaction application begins, expected failures are impossible. An unexpected failure freezes and discards the context; no rollback or continued mutation is attempted.
- Runtime state belongs to an explicit context. Interactive use has one active context; tests and replay may create isolated headless contexts.
- Runtime mutation checks the owner executor thread. Background workers may compute immutable application data but never mutate a runtime context.
- Collections and Transcripts use stable keys and generations. Array positions and visible rows are never durable identities.
- All caches and rings have count and byte limits plus observable eviction or wrap behavior.
- The default hard limits are: transaction 8 MiB and 65,535 commands; Event queue 4,096 records and 4 MiB; Grapheme Pool 262,144 entries and 16 MiB; each Collection 10,000 resident items and 32 MiB; each Transcript 10,000 resident blocks and 64 MiB; Text Document 10 MiB by default and 100 MiB absolute; pending terminal requests 64 and 16 MiB combined; live diagnostics 64 MiB. Rejections, evictions, and wraps increment observable counters and emit bounded diagnostic records.
- The cell buffer stores complete grapheme payloads or interned grapheme identities; a single scalar is not a conforming P0 cell representation.

## TypeScript standards

- Read and apply the repository's TypeScript core standard before authoring or reviewing TypeScript.
- Compile with TypeScript `5.9.3`, `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `verbatimModuleSyntax`, `isolatedModules`, and declaration plus source-map output.
- Ship ESM only. Do not add CommonJS wrappers.
- Public code uses Component and Primitive. `RuntimeNode`, ABI handles, binary opcodes, and `@preact/signals-core` remain private.
- The bare entrypoint must not import the Imperative SDK implementation eagerly unless tree shaking proves that no additional startup or bundle cost results.
- `render` and resource-producing APIs return Effect values. Lifetimes use scopes; Commands use typed interruptible Effects; external updates and Events expose Streams where streaming is the right model.
- Do not wrap an Effect API in a Promise and call it Effect-native. Promise conversion exists only at the outer Host Environment integration edge.
- The UI executor is the sole caller of context-bound ABI functions, including input polling, Event and diagnostic drains, mutation, rendering, suspend, resume, and shutdown. Worker callbacks, Effects, Streams, Components, and imperative helpers enqueue typed work.
- Reactivity is private. Public state hooks return Tuvren-owned interfaces and must not expose Signal identity, scheduling, equality, or disposal.
- Validate `unknown` at public and durable-data boundaries. Do not introduce `any` to silence TypeScript 7 migration errors.
- Public errors are tagged or classed `TuvrenError` variants and include stable code, category, operation, optional Component identity, cause, and remediation. Internal statuses never escape.

## ABI and codec standards

- `contracts/native-abi.h` is the ABI source of truth. Native exports and the Bun symbol table must be generated from or mechanically checked against it.
- All integers use fixed widths. Sizes and offsets are unsigned and checked before addition or multiplication. Floating values use IEEE-754 fields, never undocumented integer bit casts.
- Transaction and Event batches use little-endian versioned records with trailing byte arenas. Decoders reject unknown major versions, invalid lengths, overlapping regions, duplicate identities where forbidden, and trailing garbage.
- Transaction-local node references have the high bit set. Rust allocates private IDs only while committing a fully validated transaction and returns caller-owned local-to-runtime mappings; no host-selected RuntimeNode ID is accepted.
- Each opcode and property family uses the fixed record named by `native-abi.h`. Generic bytes are valid only for declared UTF-8 or opaque content fields, never as a substitute for layout, style, text-edit, Collection, Transcript, animation, terminal, or diagnostic records. Checked-in byte fixtures must decode identically in Rust and TypeScript.
- Wire enums use the fixed numeric tables in `native-abi.h`, never C enum layout. Dimension constraints carry independently tagged minimum, preferred, and maximum atoms; Grid tracks carry typed dimension or minmax records. Numeric Collection keys are finite IEEE-754 values with negative zero normalized and NaN or infinity rejected.
- Rust decoders read fields from bytes explicitly and never cast an untrusted or potentially unaligned buffer to a C or Rust struct. The C structs document layout for generated host codecs and conformance checks.
- Callers own input and output buffers. The runtime never returns a pointer that outlives the call.
- Strings are UTF-8 inside the ABI. TypeScript string conversion is transparent; explicit UTF-16LE and UTF-16BE adapters validate byte order and length.
- Public positions are grapheme indices. Internal byte offsets may exist only beside the content epoch they were derived from.
- ABI status values are private: success, buffer-too-small, invalid-input, stale-context, unavailable, and panic-contained. TypeScript copies details immediately and maps them to public errors.
- Rust never invokes a TypeScript callback. Cancelable Event arbitration, if OD-02 is ratified, uses bounded request and disposition records through the executor.

## Tests and evidence

- Test public behavior before private helpers. A refactor that preserves behavior should not require rewriting the conformance suite.
- Each P0 capability ID maps to at least one public example and automated acceptance test.
- Every Primitive has imperative conformance; every first-party Component has Effect UI SDK conformance; shared fixtures prove semantic parity.
- Text fixtures include joined emoji, flags, modifiers, combining marks, CJK, ambiguous widths, tabs, hyperlinks, selection, cursor, wrap, clip, search, editing, and negotiated width profiles.
- Terminal tests include modern, compatible, multiplexer, denial, timeout, malformed response, partial write, disconnect, suspend, resume, and restoration cases.
- Property tests cover transaction atomicity, Event order, Command concurrency, stale generation, eviction protection, grapheme coordinates, and style precedence.
- Fuzz targets cover transaction batches, Event batches, formatted text, terminal responses, clipboard chunks, Diagnostic Traces, snapshots, profiles, and replay fixtures.
- Performance evidence publishes pinned versions, hardware, warmup, samples, statistics, raw schema-valid results, engine time, terminal-write time, and input-to-Surface time.
- Benchmark adaptation uses 120 Hz, 90 Hz, and 60 Hz tiers with hysteresis and an explicit degradation allowlist.

## Observability and privacy

- Every input, Event, Command, Effect span, transaction, mutation, dirty cause, layout, text operation, Render Pass, terminal write, error, and cleanup operation receives a causal identity.
- Diagnostic-off code performs no steady-state diagnostic allocation and remains below 1% CPU overhead.
- Passive metadata remains below 3%; full trace remains below 10%, uses bounded memory, and reports visible overhead.
- Raw input, clipboard content, terminal payloads, environment values, and absolute paths are redacted by default. Full-content traces require confirmation.
- Temporary debug output uses the ticket-scoped prefix required by the execution workflow and must not remain in a milestone commit.

## Compatibility and migration

- Public package exports are checked from the declaration artifacts under `contracts/`.
- Breaking pre-GA changes require a changelog and migration guide in the same release. Keep one minor of deprecation when safe; otherwise document the hard cut.
- The migration removes root imperative exports, the `/effect` subpath, public Signals, Extension registries, and the legacy public-object name. It provides codemods for import paths and mechanical renames where practical.
- Platform packages and ABI versions are exact-match implementation details; no cross-version ABI compatibility is promised.
- Durable schema readers reject unknown major versions and may accept known older majors only through explicit migrations.
- Before decompression or object allocation, durable readers enforce the encoded size from `contracts/durable-file-limits.json`. Streaming parsers enforce the decoded size, nesting depth, and per-string UTF-8 byte limit during parsing; decompression aborts at the decoded expansion bound. Schema array maxima are additional constraints, not substitutes for byte and depth limits.
- Diagnostic snapshots encode the dense Surface as `row-major-rle-v1`. A cross-field validator requires every run count to be positive and their checked sum to equal `width × height`; reconstruction expands runs in row-major order and rejects overflow, underfill, or trailing cells. This keeps ordinary snapshots compact while still representing the 3,000 × 1,000 stretch Surface inside an explicit 512 MiB encoded/1 GiB decoded ceiling.
- Historical schema files never change after publication. Readers consult `contracts/schema-migrations.json`, migrate only registered versions into the current in-memory model, and reject unknown versions before interpreting payload fields.

## Commits

Use Conventional Commits with a descriptive subject and body when the change has non-obvious motivation. Milestone commits name the ticket IDs once Stage 4 defines them. Do not include assistant branding.

## Verification commands

### Brownfield commands that exist before migration

```bash
cargo build --manifest-path native/Cargo.toml --release
cargo check --manifest-path native/Cargo.toml --locked
cargo test --manifest-path native/Cargo.toml --locked
cargo fmt --manifest-path native/Cargo.toml -- --check
cargo clippy --manifest-path native/Cargo.toml --locked -- -D warnings
bun install --cwd ts --frozen-lockfile
bun test ts/test-ffi.test.ts
bun test ts/test-jsx.test.ts
bun test ts/test-commands.test.ts
bun test ts/test-effect.test.ts
bun test ts/test-examples.test.ts
bun test ts/test-install.test.ts
bun test ts/test-runner.test.ts
bun run ts/check-bundle.ts
bun run ts/bench-ffi.ts
bun run ts/bench-render.ts
```

### Required commands not yet implemented

Stage 4 must schedule these commands before relying on them as gates:

```bash
bun install --frozen-lockfile    # Install the target root workspace and produce no nested ts lock
bun run check:contracts          # Typecheck declarations, compile ABI header, validate every JSON Schema and contract file
bun ts/node_modules/typescript/bin/tsc -p ts/tsconfig.json --noEmit # Brownfield: currently exits 2 with 188 errors; Stage 4 schedules repair
bun install --cwd .constitution/tech-spec/contracts --frozen-lockfile
bun run --cwd .constitution/tech-spec/contracts check
bun run build:package            # Emit the exact public and platform package layouts declared by the package contracts
bun run check:capability-map     # Prove every P0 ID has an example, test, flow, and task
bun run check:release-candidate  # Run every P0 contract, semantic, terminal, fuzz, bundle, benchmark, adoption, target, package, OpenCode, and atomic-manifest gate
bun run test:semantic            # Shared Effect and imperative semantic conformance
bun run test:terminal            # Protocol, Screen Mode, restoration, and multiplexer profiles
bun run test:platform-smoke      # Install/load/init/headless-render/shutdown on all five targets
bun run test:release-package     # Pack, install, exact-version resolve, declarations, source maps, CLI, and licenses
bun run bench:envelope           # Absolute workload envelope and 120/90/60 tiers
bun run bench:comparative        # OD-01 fixtures and raw results
bun run bench:devtools           # Off, passive, and full-trace overhead
bun run study:onboarding         # 5/10/30/10-minute adoption tasks
bun run study:style-defect       # Median source-location task
cargo fuzz run transaction_decode
cargo fuzz run event_decode
cargo fuzz run terminal_response
cargo fuzz run durable_files
cargo audit
cargo deny check
bun audit --cwd ts
```
