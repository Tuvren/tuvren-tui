# Risks

## Version

**v4.0.2** — corresponds to the latest entry in `.constitution/architecture/changelog.md`.

## Structural risks and sensitivity points

| ID | Risk or sensitivity point | Architectural consequence | Mitigation or follow-up |
| :-- | :-- | :-- | :-- |
| AR-01 | The single UI executor is both the determinism boundary and a throughput bottleneck. Small changes to batching, queue order, or call granularity can swing PERF-01, PERF-02, and REL-03. | Host-heavy reconciliation or fine-grained transactions can miss the 120 Hz goal even when rendering is fast. | Measure queue wait, boundary cost, mutation count, Render Pass time, and write time separately. Batch and coalesce before considering deeper runtime promotion. |
| AR-02 | OD-02 has not proven selective Event interception. | Prematurely fixing capture, target, bubble, or default-action timing could create deadlock, duplicate completion, lost input, or latency above 8.33 ms. | Keep the boundary conditional. Prototype ordering, failure, reentrancy, shutdown, coalescing, and no-interceptor latency before an Architecture Evolution decision. |
| AR-03 | Controlled values cross application and runtime ownership. | Ambiguous authority can create feedback loops, stale application, or disagreement between presentation and business state. | Require one authority per property, stable generations, explicit change Events, and diagnostics showing the applied source. |
| AR-04 | Private Reactivity and Component reconciliation can create host-side churn. | The Effect UI SDK could reproduce the cost profile Tuvren is intended to beat or accidentally become a second retained mutable UI model. | Retain only authoring identity and reconciliation metadata outside the runtime; send deltas through the UI Executor; benchmark representative Component trees. |
| AR-05 | A Component-per-native-type strategy expands the private boundary without proving performance. | Compatibility cost and duplicated semantics can grow faster than the Component catalog. | Reuse interaction, modal, selection, collection, text, animation, and cell kernels. Apply the OD-01 evidence-driven promotion rule. |
| AR-06 | The present cell representation does not display every multi-scalar grapheme fully even though width and selection logic are grapheme-aware. | P0-E02 visual correctness can fail for joined emoji, flags, keycaps, and modifiers. | Treat the cell model as migration debt. Stage 3 must select a representation that preserves full grapheme output and benchmark its memory effect. |
| AR-07 | Grid, responsive rules, and restricted StyleSheet matching expand invalidation pressure. | A small change to condition matching or style provenance can force broad layout and render work. | Cache resolved rules by relevant state and environment inputs; maintain precise dirty causes; make StyleSpec provenance observable. |
| AR-08 | Virtual Collections and Transcripts combine external asynchronous data with bounded native projections. | Stale loads, incorrect eviction, or unstable identities can lose visible context or silently delete the only copy of data. | Use stable keys, generations, protected eviction precedence, range and eviction Events, cancellation, and application-owned durable history in controlled mode. |
| AR-09 | Modern terminal behavior is fragmented across terminals and intermediaries. | Brand assumptions or incorrect passthrough can corrupt input, leak responses, or strand modes. | Detect behavior, validate responses, degrade individual capabilities, maintain a compatible tier, and test multiplexer chains with replay plus real-terminal evidence. |
| AR-10 | Rich clipboard and paste behavior expands the highest-risk terminal input path. | Unbounded binary content, confused response correlation, permission surprises, or control-byte leakage can compromise reliability and privacy. | Require explicit reads, typed outcomes, bounds, deadlines, correlation, parser fuzzing, and strict separation from keyboard Events. |
| AR-11 | The Diagnostic Graph observes every critical boundary. | It can exceed TOOL budgets, expose sensitive content, or perturb timing enough to hide the original defect. | Make observation modes explicit, bounded, redacted, and measurable; preserve causal gaps as defects rather than fabricate records. |
| AR-12 | Five supported targets and atomic matching artifacts create release coupling. | One missing artifact, loader mismatch, or source-only path can break the one-command adoption promise. | Qualify every target through native smoke execution; reject mismatches before initialization; keep platform artifacts private to the distribution boundary. |
| AR-13 | Two complete SDK workflows can drift semantically. | A capability may exist only declaratively or imperatively, or tests may prove different behavior. | Generate capability inventories, share runtime kernels and semantic fixtures, and make unexplained parity gaps release failures. |
| AR-14 | First-party Component breadth can mask inconsistent interaction contracts. | Controls may disagree about activation, focus, validation, semantics, disabled state, or styling slots. | Define shared behavior kernels and conformance suites before implementing branded compositions. |
| AR-15 | Adaptive frame tiers can become an excuse for silent quality degradation. | Decorative throttling can accidentally affect text, Events, semantics, or final state. | Encode an explicit degradation allowlist, measure tier transitions with hysteresis, and report every transition in diagnostics. |
| AR-16 | OpenCode is required evidence but not a supported integration contract. | Core types or lifecycle may become coupled to a volatile external client protocol. | Keep a replaceable application adapter, deterministic replay fixtures, and SDK-level performance scenarios independent of the live protocol. |

## Brownfield debt

| ID | Current drift | Required architectural correction |
| :-- | :-- | :-- |
| BD-01 | The bare package exports the Imperative SDK and a public reactive mechanism; the Effect UI SDK uses a separate subpath. | Invert the default facade, hide Reactivity, preserve an explicit complete imperative path, and migrate without retaining competing entrypoints. |
| BD-02 | Commands and Keymaps are asynchronous host registries without the target concurrency policies or one UI executor. | Introduce the bounded executor and shared Command lifecycle before expanding Component behavior. |
| BD-03 | Extension registries and a Plugin example exist despite the rejected P0 Plugin contract. | Remove privileged extension language and retain ordinary package composition only. |
| BD-04 | Public source vocabulary still uses the legacy `Widget` identifier and exposes numeric private identities in several advanced paths. | Migrate public names to Component and Primitive; confine RuntimeNode identity to internal or diagnostic views. |
| BD-05 | Terminal support is primarily write-only clipboard, partial capability flags, alternate screen, and a basic host loop. | Deepen Terminal Session behavior to the P0 capability and Screen Mode contract. |
| BD-06 | Devtools provide snapshots, overlays, counters, and trace rings but not the complete Diagnostic Graph, synchronized views, replay, Issues, or privacy contract. | Evolve one bounded causal observation plane rather than add disconnected debugging utilities. |
| BD-07 | The experimental background renderer remains in the source tree. | Keep it excluded from the default architecture and remove or quarantine it unless new evidence triggers an Evolution pass. |

## STRIDE notes

| Category | Relevant threat | Boundary response |
| :-- | :-- | :-- |
| Spoofing | A terminal or intermediary can claim unsupported capabilities or answer the wrong pending query. | Correlate responses, validate evidence, and degrade on ambiguity. |
| Tampering | Application content, subprocess output, clipboard data, or imported traces can contain control data or malformed structure. | Validate and bound before mutation or output; sanitize terminal-formatted content. |
| Repudiation | A late Render Pass or failed action can lack enough causal evidence to explain responsibility. | Stable causal identities and explicit unattributed-defect markers. |
| Information disclosure | Traces and Issues can capture input, clipboard content, paths, environment data, or protocol payloads. | Redact by default; require confirmation for full content; bound exports. |
| Denial of service | Update queues, paste, clipboard chunks, parsers, collections, Transcripts, or trace imports can exhaust time or memory. | Per-boundary limits, deadlines, cancellation, stale rejection, protected eviction, and observable overflow. |
| Elevation of privilege | Ordinary packages could gain privileged runtime contribution or terminal-control access if treated as Plugins. | No P0 RuntimeExtension system; packages use the same validated public contracts as applications. |
