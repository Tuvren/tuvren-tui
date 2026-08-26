# Engineering guidelines

## Version

**v9.0.16** — corresponds to `.constitution/tech-spec/changelog.md`.

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
- Use stable `1.98.0` for production code. Fuzz jobs alone use pinned `nightly-2026-08-20` with `rust-src`, cargo-fuzz `0.13.2`, and the C++11 compiler provisioned by `devenv.nix`; every fuzz command names the dated toolchain and `native/fuzz` directory explicitly.
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
- A public Component exposes its props, lifecycle, declared controllers, and semantic APIs, but never its private Primitive root. Composition internals may change without creating a public escape hatch to native identities or duplicated mutable state.
- Every controlled/local property is a mutually exclusive type union. Supplying both controlled and default values is a declaration error; controlled Transcript mode requires `blocks`, while bounded-local mode alone accepts `defaultBlocks`.
- The bare entrypoint must not import the Imperative SDK implementation eagerly unless tree shaking proves that no additional startup or bundle cost results.
- `render` and resource-producing APIs return Effect values. Lifetimes use scopes; Commands use typed interruptible Effects; external updates and Events expose Streams where streaming is the right model.
- `View<E, R>` carries failures and environments from effectful Data Sources or mutation Streams through Component composition into `render`, `mount`, and `testRender`. `provideLayer` discharges the provided environment and adds Layer failures/inputs. A mounted `RenderSession<E>.awaitExit` retains every handler and View failure that can occur after setup.
- Collection render callbacks and child Views contribute their requirements to the returned View. `ErrorBoundary` receives the child error type, discharges that error, preserves the child environment, and adds fallback requirements. Hooks return opaque `ComponentRequirement<E, R>` values that attach through `withRequirements`; dropping a requirement is a conformance failure.
- Do not wrap an Effect API in a Promise and call it Effect-native. Promise conversion exists only at the outer Host Environment integration edge.
- The UI executor is the sole caller of context-bound ABI functions, including input polling, Event and diagnostic drains, mutation, rendering, suspend, resume, and shutdown. Worker callbacks, Effects, Streams, Components, and imperative helpers enqueue typed work.
- Reactivity is private. Public state hooks return Tuvren-owned interfaces and must not expose Signal identity, scheduling, equality, or disposal.
- Validate `unknown` at public and durable-data boundaries. Do not introduce `any` to silence TypeScript 7 migration errors.
- Public errors are tagged or classed `TuvrenError` variants and include stable code, category, operation, optional Component identity, cause, and remediation. Internal statuses never escape.
- Normalized keyboard, pointer-button, pointer-move, and wheel Events share the closed `EventModifier` set (`shift`, `control`, `alt`, `super`) used by replay and ABI codecs; arbitrary modifier strings never enter the public Event union.
- `contracts/error-codes.json` is the closed public error registry. TypeScript code/category unions, public subclasses, native-to-host mappings, trace payloads, and doctor fixtures match it exactly; direct construction of the base `TuvrenError` is protected.
- Declarative and imperative Commands expose the same title, description, category, visibility, enablement, activation condition, concurrency, typed success, typed failure, and interruption semantics. Every imperative invocation completes as succeeded, failed, interrupted with a cancellation/restart/shutdown reason, or rejected as disabled, contextually unavailable, or concurrency-limited; interruption and each rejection have closed-registry error mappings. Buttons, menu items, and palette entries require a Command ID; they never duplicate the action body. Registry lookup failures are `TuvrenError` subclasses with the standard stable metadata.
- `CommandId<A, E, R>` carries its registered result, failure, and environment contract through `invokeById` and every bound activation surface. `graphemeIndex()` is the only public constructor for an arbitrary grapheme position and rejects negative, fractional, or unsafe-integer values.
- Button, ToggleButton, MenuItem, and CommandPalette are generic over their bound Command IDs. Their returned Views include the Command failure and environment requirements in addition to renderer and child requirements; declarative conformance rejects any assignment that erases them. Imperative constructors preserve the same ID result/failure contract without inventing an Effect environment.
- Keymaps use branded hierarchical scope identities; omitted scope identifies the global root in bindings, rebindings, conflict reports, and queries. A Key Sequence is a nonempty ordered array of Key Strokes. Named keys use the lowercase names declared by `NamedKey`; text keys pass through `keyGrapheme`, which requires one NFC grapheme and lowercases logical alphabetic keys while Shift remains a modifier. Modifier fields are an order-independent set. When `physicalCode` is present, its USB HID usage ID is the match discriminator and `key` is the logical fallback for terminals without physical codes. Chords use array order, default to a 1,000 ms inter-stroke timeout, accept 50–5,000 ms, and reset on mismatch, timeout, scope change, focus change, or shutdown. Resolution filters inactive bindings, then orders candidates by nearest focused scope, descending scope priority, an explicit user rebinding over a static binding, and finally most-recent registration. Conflict inspection reports every collision and its deterministic winner before invocation; rebinding and scope disposal update resolution atomically.
- `DataSource.loadRange` receives an `AbortSignal`. A Collection binding is exactly one of static `items + getKey` or `dataSource` with its own canonical `getKey`; the declarations reject two simultaneous authorities or duplicate identity functions. Every Collection mutation carries its generation, and stale completions or mutations are discarded before they reach native state.
- Controlled Collection selection requires `selectedKey`/`selectedKeys` plus `onSelectionChange`; local mode alone accepts the matching default. In controlled mode, controller selection calls, interaction, and selection mutations are intent sources only: the executor invokes the handler and does not commit selection until a later controlled prop transaction supplies it. In local mode those same paths commit native selection and then notify. Contract fixtures exercise both paths and reject simultaneous or handlerless authority.
- TextArea accepts either its ordinary exclusive controlled/local string authority or one `TextDocumentService` authority. The document-bound form forbids `value`, `defaultValue`, and `onValueChange` and exposes document snapshots and changes through the bound service.
- Collection controllers and observers expose native-owned, generation-stamped scroll position independently of visible range, including a stable key anchor, signed row offset, optional pixel offset, and the committed transaction/render identities at which it was observed. The UI executor alone performs the native copy-out after commits and atomically updates the controller cache before firing the observer. `lastScrollPosition()` is a synchronous cache read that returns `undefined` before the first observation and never calls the ABI or claims fresher state.
- Collection selection is a generation-stamped keyed mutation rather than a visible-node flag, so selection survives projection and eviction. Native Collection state maintains both a stable-key map and an explicit ordered-key vector with a synchronized position index. Host-side generic items never cross the ABI; transactions carry bounded typed projection descriptors containing stable keys, projected RuntimeNodes, and estimated heights.
- Transcript append, insert, replace, reset, and reload records embed the same discriminated TextContent payload used by Text Components. Patch and stream chunks are bounded UTF-8 edits against the existing block Text Document.
- Animation creation returns an interruptible handle in both SDKs. Cancellation and replacement are native animation-registry operations, and completion reports `completed`, `cancelled`, or `replaced` without making dropped presentations part of logical time. Replacement resolves the old handle as `replaced` and returns a new handle with a distinct ID and completion lifecycle.
- Primitive and Component imperative wrappers both delegate animation to the same native registry; private Component roots remain inaccessible.

## ABI and codec standards

- `contracts/native-abi.h` is the ABI source of truth. Native exports and the Bun symbol table must be generated from or mechanically checked against it.
- All integers use fixed widths. Sizes and offsets are unsigned and checked before addition or multiplication. Floating values use IEEE-754 fields, never undocumented integer bit casts.
- Transaction and Event batches use little-endian versioned records with trailing byte arenas. Decoders reject unknown major versions, invalid lengths, overlapping regions, duplicate identities where forbidden, and trailing garbage.
- Transaction-local node references have the high bit set. Rust allocates private IDs only while committing a fully validated transaction and returns caller-owned local-to-runtime mappings; no host-selected RuntimeNode ID is accepted.
- Each opcode and property family uses the fixed record named by `native-abi.h`. Generic bytes are valid only for declared UTF-8 or opaque content fields, never as a substitute for layout, style, text-edit, Collection, Transcript, animation, terminal, or diagnostic records. Checked-in byte fixtures must decode identically in Rust and TypeScript.
- Wire enums use the fixed numeric tables in `native-abi.h`, never C enum layout. Dimension constraints carry independently tagged minimum, preferred, and maximum atoms; Grid tracks carry typed dimension or minmax records. Numeric Collection keys are finite IEEE-754 values with negative zero normalized and NaN or infinity rejected.
- Rust decoders read fields from bytes explicitly and never cast an untrusted or potentially unaligned buffer to a C or Rust struct. The C structs document layout for generated host codecs and conformance checks.
- Callers own input and output buffers. The runtime never returns a pointer that outlives the call.
- Public Text Document read operations and Collection or Transcript visible-range reads use the bounded `tui_query_copy` protocol. Result-bearing text mutations return indexed scalar command results from the same atomic transaction apply; the host never reconstructs native state from cached writes.
- Every public TextContent form has an explicit wire discriminator. Styled spans carry typed style and validated-link records; Markdown and code parsing and ANSI sanitization remain native. Text Document configuration and bounded validation rules are serializable records enforced before native edits, never host callbacks from Rust.
- Text Document indentation is either tabs or spaces with an explicit width; tab display width is independent. LF, tab indentation, and a tab display width of four are defaults. Tab and space widths accept 1–16. Applicable form controls share required, error, and submission properties. Text controls additionally support the declared native length and regex rules; other domain validation supplies controlled error state without a host callback from Rust.
- Style values may carry typed Theme-token references. The transaction encodes token names and optional fallbacks explicitly, Theme payloads carry typed token records, and Rust resolves them against the active Theme during style evaluation. Resolution proceeds from runtime defaults through ThemeTokens, ThemeRecipes, the built-in Component recipe, the instance StyleSheet, the instance slot override, and finally the inline StyleSpec; later levels win. A token reference changes only the value, not this precedence order.
- Strings are UTF-8 inside the ABI. TypeScript string conversion is transparent; explicit UTF-16LE and UTF-16BE adapters validate byte order and length.
- Public positions are grapheme indices. Internal byte offsets may exist only beside the content epoch they were derived from.
- ABI status values are private: success, buffer-too-small, invalid-input, stale-context, unavailable, and panic-contained. TypeScript copies details immediately and maps them to public errors.
- Rust never invokes a TypeScript callback. Cancelable Event arbitration, if OD-02 is ratified, uses bounded request and disposition records through the executor.
- Pointer capture and drag-and-drop retain source, current drop target, button, pointer identity, coordinates, and capture ownership in the Interaction Kernel. Drag start, motion, drop, end, and capture changes use discriminated public and wire Events and are cleared on release, cancellation, focus loss, or shutdown.
- Clipboard media discovery emits bounded typed chunks. Text helpers use validated UTF-8 and `text/plain;charset=utf-8` over the same permission-aware read/write protocol. Both SDKs query the current Terminal Capability snapshot through bounded native copy-out rather than relying on a prior Event.

## Markdown and formatted-text profile

- Markdown uses pulldown-cmark `0.13.4` with exactly `ENABLE_TABLES`, `ENABLE_FOOTNOTES`, `ENABLE_STRIKETHROUGH`, `ENABLE_TASKLISTS`, and `ENABLE_GFM`. All other option flags are disabled.
- Raw HTML is rendered as escaped text. Links permit only `https`, `http`, and `mailto`; invalid or control-bearing destinations render as text and produce a diagnostic. Markdown images render their alt text and a validated link only because terminal image protocols are P1.
- Sanitized ANSI accepts printable text plus SGR reset, bold, dim, italic, underline, inverse, and 16/256/true-color foreground/background styling. It strips and diagnoses cursor movement, erasure, modes, title, hyperlinks, clipboard, device-control, and every other control sequence.

## Tests and evidence

- Test public behavior before private helpers. A refactor that preserves behavior should not require rewriting the conformance suite.
- Each P0 capability ID maps to at least one public example and automated acceptance test.
- Every Primitive has imperative conformance; every first-party Component has Effect UI SDK conformance; shared fixtures prove semantic parity.
- Text fixtures include joined emoji, flags, modifiers, combining marks, CJK, ambiguous widths, tabs, hyperlinks, selection, cursor, wrap, clip, search, editing, and negotiated width profiles.
- Terminal tests include modern, compatible, multiplexer, denial, timeout, malformed response, partial write, disconnect, suspend, resume, and restoration cases.
- Property tests cover transaction atomicity, Event order, Command concurrency, stale generation, eviction protection, grapheme coordinates, and style precedence.
- Fuzz targets cover transaction batches, Event batches, formatted text, terminal responses, clipboard chunks, Diagnostic Traces, snapshots, profiles, and replay fixtures.
- Every directly executable fuzz verification uses the pinned target plus `-max_total_time=60`; longer CI campaigns may raise the declared duration through the owning script but never leave a ticket command unbounded.
- Performance evidence publishes pinned versions, hardware, warmup, samples, statistics, raw schema-valid results, engine time, terminal-write time, and input-to-Surface time.
- Benchmark evidence declares every non-core metric with a unit and value type, records per-sample values plus per-metric statistics, and carries named pass/fail checks for correctness properties such as timeout, reentrancy, exactly-once disposition, idle passes, animation accuracy, boundary calls, CPU overhead, and allocation behavior.
- Benchmark percentiles use sorted nearest-rank without interpolation; means use binary64 arithmetic with the declared 1e-9 absolute-or-relative tolerance; exact, min, max, and sum follow `benchmark-validation.json`. Evidence builders never choose their own percentile or rounding convention.
- Benchmark adaptation uses 120 Hz, 90 Hz, and 60 Hz tiers with hysteresis and an explicit degradation allowlist.

## Observability and privacy

- Every input, Event, Command, Effect span, transaction, mutation, dirty cause, layout, text operation, Render Pass, terminal write, error, and cleanup operation receives a causal identity.
- Diagnostic-off code performs no steady-state diagnostic allocation and remains below 1% CPU overhead.
- Passive metadata remains below 3%; full trace remains below 10%, uses bounded memory, and reports visible overhead.
- Raw input, clipboard content, terminal payloads, environment values, and absolute paths are redacted by default. A confirmed runtime-replay capture must be selected in context-creation options, starts with the empty-context record, records an unbroken no-wrap prefix, and includes exact versioned Event and complete committed-transaction batches; diagnostic mutation records are metadata and are never replayed separately. Environment values and absolute paths remain redacted.
- Recoverable Issues persist phase, stable error, Component, source, bounded cause summary, preceding Event or Command, trace interval, remediation, and available report/trace/restart actions in snapshots and replay.
- Temporary debug output uses the ticket-scoped prefix required by the execution workflow and must not remain in a milestone commit.

## Compatibility and migration

- Public package exports are checked from the declaration artifacts under `contracts/`.
- Breaking pre-GA changes require a changelog and migration guide in the same release. Keep one minor of deprecation when safe; otherwise document the hard cut.
- The migration removes root imperative exports, the `/effect` subpath, public Signals, Extension registries, and the legacy public-object name. It provides codemods for import paths and mechanical renames where practical.
- Platform packages and ABI versions are exact-match implementation details; no cross-version ABI compatibility is promised.
- Durable schema readers reject unknown major versions and may accept known older majors only through explicit migrations.
- Before decompression or object allocation, durable readers enforce the encoded size from `contracts/durable-file-limits.json`. Streaming parsers enforce the decoded size, nesting depth, and per-string UTF-8 byte limit during parsing; decompression aborts at the decoded expansion bound. Schema array maxima are additional constraints, not substitutes for byte and depth limits.
- Diagnostic snapshots encode the dense Surface as `row-major-rle-v1`. A cross-field validator requires every run count to be positive and their checked sum to equal `width × height`; reconstruction expands runs in row-major order and rejects overflow, underfill, or trailing cells. It also proves Semantic Tree ID uniqueness, valid child and relationship targets, one rooted acyclic tree, reachability, exact tagged scalar values/states, and exact Issue code/category/operation registry tuples. This keeps ordinary snapshots compact while still representing the 3,000 × 1,000 stretch Surface inside an explicit 512 MiB encoded/1 GiB decoded ceiling.
- Historical schema files never change after publication. Readers consult `contracts/schema-migrations.json`, migrate only registered versions into the current in-memory model, and reject unknown versions before interpreting payload fields.
- `validateApplicationReplay` rejects nonmonotonic event time, unreachable or duplicate zero-based expectation indexes, surrogate key codes, and wheel deltas outside the exact signed-integer Event wire domain. `validateBenchmarkResult` recomputes core/custom statistics and checks sample count, metric definitions, value types, and required named checks. Both validators run in `check:contracts`; the release-candidate gate additionally requires every release-gating check to pass.
- Public Diagnostic Trace records form a `kind`-discriminated union whose payload types match `trace-validation.json`, including closed committed/rejected transactions and typed ring-wrap/tooling-defect records. `validateDiagnosticTraceRecords` rejects unknown fields, checks exact error tuples and closed transaction statuses, proves unsigned sequence uniqueness/order, timestamp order, unique native-owned record identities and backward-only `parentRecordId` references, requires duplicate Command/Effect identities to agree, preserves stable command-instance and subject mappings, and requires the native Effect span or trace-scoped opaque Component/Text-Document subject appropriate to each producer without exposing runtime handles. A ring-wrap record carries the transaction/render identities current at eviction, and the sole wrap baseline must match them before later snapshots may inherit an unsuperseded identity. Every embedded snapshot is checked against the enclosing context and declared basis; retained Issue intervals are validated. Runtime replay additionally requires context-creation-enabled confirmed full-content capture from an empty context with no wrap/gap and exact versioned Event/transaction bytes plus available migrations. It suppresses outward application-handler delivery while captured Events drive native default behavior and captured transactions apply once; logical application replay runs current handlers and injects no captured transaction.

## Commits

Use Conventional Commits with a descriptive subject and body when the change has non-obvious motivation. Milestone commits name the ticket IDs once Stage 4 defines them. Do not include assistant branding.

## Verification commands

### Brownfield commands that exist before migration

```bash
cargo build --manifest-path native/Cargo.toml --release --locked
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
bun run check:toolchain          # Assert exact Bun, stable/nightly Rust, cargo-fuzz, and GCC versions before other gates
bun run check:contracts          # Typecheck declarations, compile ABI header, validate every JSON Schema and contract file
bun run check:abi-parity         # Compare implemented symbols and TypeScript/Rust decoding over every checked-in ABI byte fixture
bun run check:native             # Run rustfmt, locked Clippy with warnings denied, and locked native tests on Rust 1.98.0
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
bun run test:registry-package    # Reinstall published artifacts and verify five targets, CLI, types, maps, licenses, checksums, and provenance
bun run bench:envelope           # Absolute workload envelope and 120/90/60 tiers
bun run bench:comparative        # OD-01 fixtures and raw results
bun run bench:devtools           # Off, passive, and full-trace overhead
bun run study:onboarding         # 5/10/30/10-minute adoption tasks
bun run study:style-defect       # Median source-location task
cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz transaction_decode -- -max_total_time=60
cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz event_decode -- -max_total_time=60
cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz terminal_response -- -max_total_time=60
cargo +nightly-2026-08-20 fuzz run --fuzz-dir native/fuzz durable_files -- -max_total_time=60
cargo audit --file native/Cargo.lock
cargo deny check --manifest-path native/Cargo.toml
bun audit
```
