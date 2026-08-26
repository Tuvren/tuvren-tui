# Constraints

## Reference workload envelope

Performance gates apply to representative fixtures at or below this `0.1.0` envelope. Each benchmark must publish the hardware, operating system, Terminal Capability profile, fixture, warmup, sample count, statistics, and raw results. Measurements must report engine time and terminal-write time separately, plus end-to-end input-to-Surface time where applicable.

| Dimension | `0.1.0` envelope | Stretch analysis |
| :-- | :-- | :-- |
| Surface | 300 × 100 cells | 10× the relevant dimension or density |
| Mounted content | 1,000 Primitives | 10,000 Primitives |
| Transcript | 10,000 resident Transcript Blocks | 100,000 resident Transcript Blocks |
| Update burst | 100 accepted updates per second | 1,000 accepted updates per second |
| Text Document | 10 MiB | 100 MiB |
| Virtual Collection | 100,000 logical items | 1,000,000 logical items |
| Composition | Multiple panes and overlays with syntax styling, selection, and local devtools | The same composition at 10× one dominant load dimension |

Stretch analysis must identify growth curves and failure modes. It does not promise the `0.1.0` frame-rate goals at 10× scale.

## Performance and resource constraints

| ID | Scale | Meter | Goal | Degraded or stretch | Fail |
| :-- | :-- | :-- | :-- | :-- | :-- |
| PERF-01 | p95 active Render Pass service time inside the reference envelope | Pinned headless and real-terminal benchmark profiles | At most 8.33 ms, sustaining 120 Hz | At most 11.11 ms sustains the 90 Hz degraded tier | More than 16.67 ms, or less than 60 Hz sustained responsiveness, is a release failure |
| PERF-02 | p95 input-to-Surface latency for unblocked interactive Events inside the reference envelope | Timestamp normalized input and observable Surface completion | At most 8.33 ms | At most 11.11 ms in the degraded tier | More than 16.67 ms is unacceptable |
| PERF-03 | Idle Render Pass count | Observe an initialized unchanged application for 60 seconds | 0 passes without input, accepted mutation, time-driven behavior, capability change, or required repair | Not applicable | Any unexplained Render Pass fails the gate |
| PERF-04 | Animation time accuracy under missed presentation opportunities | Compare declared duration with observable completion under induced load | Completion follows elapsed time within one available presentation interval | Preserve final state by reducing intermediate presentations | Slowing logical time or losing the final state is unacceptable |
| PERF-05 | Per-call host-to-engine boundary overhead | Isolated warmed p95 call benchmark with payload classes reported separately | Less than 1 ms | Lower overhead without contract loss | 1 ms or more for the baseline call fixture fails the gate |
| RES-01 | Incremental resident memory for the established 100-Primitive baseline fixture | Peak resident memory above an initialized empty application | Less than 20 MiB | Publish growth through the full reference envelope and 10× analysis | Unbounded growth, a leak across repeated mount and teardown, or 20 MiB or more on the baseline fixture fails |
| RES-02 | Primary host SDK bundle size | Production bundle excluding peer dependencies, source mappings, declarations, and native artifacts | At most 100 KB | Less than 75 KB | More than 100 KB fails unless Stage 1 explicitly changes the product budget |
| RES-03 | Diagnostic storage | Long-run trace and event-pressure fixtures | Bounded by declared count and byte limits with observable truncation | Lower limits without losing the causal path | Unbounded growth, silent loss of the retained causal path, or process exhaustion fails |

Frame adaptation must use hysteresis to avoid oscillation among 120 Hz, 90 Hz, and 60 Hz tiers. It must prioritize input over decorative work. It may reduce animation presentation density or coalesce eligible updates, but it must not weaken text correctness, Event ordering, accessibility semantics, final state, or terminal cleanup.

## Adoption and SDK constraints

| ID | Scale | Meter | Goal | Stretch | Fail |
| :-- | :-- | :-- | :-- | :-- | :-- |
| DX-01 | Time from an empty supported project to first render | Moderated task using only published documentation and the ordinary install path | At most 5 minutes | Not set | More than 5 minutes or any native setup requirement fails |
| DX-02 | Time to complete an interactive Hello World | Moderated task including input, state change, and clean exit | At most 10 minutes | Not set | More than 10 minutes fails |
| DX-03 | Time to complete a small application | Moderated task with multiple Primitives, input, state updates, and cleanup | At most 30 minutes | Not set | More than 30 minutes fails |
| DX-04 | Time to add a semantic interaction test | Moderated task starting from the completed Hello World | At most 10 minutes | Not set | More than 10 minutes fails |
| DX-05 | Public capability parity | Automated inventory mapping public Primitives and first-party Components to both SDK workflows | 100% of Primitives have safe imperative wrappers and 100% of first-party Components are available declaratively | Not applicable | Any unexplained capability gap fails release |
| DX-06 | Private-native-detail exposure | Public API, examples, errors, and onboarding audit | 0 ordinary workflows expose raw native calls, numeric native identities, native toolchains, or manual native binary management | 0 across advanced workflows except explicitly named diagnostics | Any such requirement in the default workflow fails release |

## Reliability, safety, and privacy constraints

| ID | Scale | Meter | Goal | Stretch | Fail |
| :-- | :-- | :-- | :-- | :-- | :-- |
| REL-01 | Terminal restoration across exit paths | Automated pseudo-terminal matrix covering success, interruption, Command failure, declarative-workflow failure, unexpected application exception, runtime failure, and disconnect | 100% restore the prior terminal state or end a disconnected context cleanly | Broader fault injection | Any reproducible stranded mode or corrupted terminal fails release |
| REL-02 | Deterministic replay | Replay the same accepted input and time sequence 100 times | Identical character, style, cursor, and Semantic Tree snapshots in all 100 runs | 1,000 identical runs | Any unexplained divergence fails |
| REL-03 | Bounded asynchronous UI work | Saturation tests for update queues, range loads, paste, clipboard, Events, and shutdown | Every queue has documented limits, ordering, cancellation, coalescing, and overflow behavior | Stable service under 10× burst analysis | Unbounded storage, deadlock, reentrant mutation, stale application, or lost shutdown fails |
| SAFE-01 | Untrusted-data boundary coverage | Contract inventory plus fuzz, malformed-input, size-limit, timeout, and correlation tests | 100% of external content and control boundaries have validation and bounds with a named test owner | Continuous fuzzing on every parser | Raw control injection, memory unsafety, unbounded allocation, or an unhandled malformed response fails release |
| SAFE-02 | Diagnostic privacy | Golden tests over errors, issues, snapshots, and Diagnostic Traces | 0 raw input values, clipboard contents, terminal payloads, environment values, or absolute paths recorded by default | Explicit field-level redaction reports | Any default disclosure of a protected class fails release |
| SAFE-03 | Dependency and artifact provenance | Reproducible release audit | Locked dependency graph, immutable CI inputs, checksums for published artifacts, and recorded provenance for every release | Independently reproducible artifacts | Unpinned release inputs, missing checksums, or an untraceable published artifact fails release |

## Operability and release constraints

| ID | Scale | Meter | Goal | Stretch | Fail |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OPS-01 | Supported-target release health | Native execution on Linux x64 and arm64, macOS arm64 and x64, and Windows x64 | All 5 targets install, load, initialize, render headlessly, and shut down from the published artifact | Add representative real-terminal smoke coverage on every target | A missing target run, source-build dependency, or incompatible paired artifact fails release |
| OPS-02 | Diagnostic accuracy for load failures | Seeded failures spanning host version, target, artifact, version, loading, initialization, and headless rendering | Correct cause and actionable remediation for every seeded failure | One-command automated repair where safe | A generic native-boundary error or incorrect remediation fails |
| OPS-03 | Public example coverage | Traceability matrix from shipped capability to published example and acceptance evidence | 100% coverage; every performance claim also maps to a reproducible benchmark | Multiple representative examples for high-risk capabilities | Any shipped capability without evidence fails final release |
| OPS-04 | Pre-GA change communication | Release audit for each breaking public change | Changelog and migration guidance in the same release; one-minor deprecation where safe; automated migration when practical | No avoidable breaking changes | An undocumented breaking change fails release |
| OPS-05 | Versioned evidence schemas | Compatibility tests for Diagnostic Trace and snapshot schemas | Schema versions evolve independently of the SDK version and fail incompatibility explicitly | Readers support the documented compatibility window | Silent misinterpretation or unversioned schema change fails |
| OPS-06 | OpenCode reference evidence | Deterministic replay and live-adapter performance and developer-experience fixtures | Meets every absolute performance constraint and every comparative gate ratified through OD-01 without leaking OpenCode contracts into the SDK | Exceeds the evidence-ratified comparative goals | Omitting the reference, missing an applicable gate, or coupling core SDK contracts to OpenCode fails final release |

## Devtools constraints

| ID | Scale | Meter | Goal | Stretch | Fail |
| :-- | :-- | :-- | :-- | :-- | :-- |
| TOOL-01 | Cost when diagnostics are disabled | Representative benchmark comparison | Less than 1% CPU overhead and no steady-state diagnostic allocation | Statistically indistinguishable | 1% or more CPU overhead or steady-state diagnostic allocation fails |
| TOOL-02 | Passive diagnostic cost | Representative benchmark comparison | Less than 3% overhead | Less than 2% | 3% or more fails |
| TOOL-03 | Full-trace cost | Representative benchmark comparison under bounded recording | Less than 10% overhead with bounded memory and visible overhead reporting | Less than 7% | 10% or more, unbounded storage, or hidden overhead fails |
| TOOL-04 | Time to locate a seeded style defect | Moderated task from visible layout defect to the responsible StyleSpec source | Median under 60 seconds | Median under 30 seconds | Median of 120 seconds or more fails |
| TOOL-05 | Render causality | Instrumented late-Render-Pass fixtures | Every late Render Pass has a complete causal path or an explicit unattributed-defect marker | 100% complete causal paths | A late pass with neither explanation nor defect marker fails |

## Comparative performance targets pending evidence

These are product ambitions, not final release gates. OD-01 requires pinned versions, equivalent public-API fixtures, representative terminal profiles, separate engine and process measurements, and published raw results before Stage 1 can ratify hard comparative cuts.

| Reference | Provisional target |
| :-- | :-- |
| Leading hybrid terminal SDK | No more than 5% slower on any primary p95 latency fixture, with an aggregate-suite win |
| Pure native terminal toolkit | Within 15% on comparable hot update and Render Pass paths |
| Host-only terminal UI alternative | At least 3× faster across the aggregate interactive workload, with materially lower incremental memory |

The 120 Hz, 90 Hz, and 60 Hz absolute tiers remain binding regardless of OD-01. Evidence may tighten or replace the comparative targets, but it may not silently weaken the absolute failure threshold.
