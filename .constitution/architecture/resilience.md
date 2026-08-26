# Resilience

## Version

**v4.0.7** — corresponds to the latest entry in `.constitution/architecture/changelog.md`.

## Trust boundaries

Tuvren has no network identity boundary in its primary product shape. Its critical trust boundaries are the public SDK input, UI Executor queue, private native boundary, terminal input and response stream, subprocess output, clipboard, Diagnostic Trace import or export, and release artifact set.

All external content and control data crosses a validating boundary before it reaches mutable runtime state or terminal output. Validation includes structural checks, size limits, correlation, timeouts, safe output construction, and an explicit unsupported or denied result where applicable.

## Failure handling

| Failure class | Containment boundary | Logical tactic | Observable outcome |
| :-- | :-- | :-- | :-- |
| Invalid public intent | Public SDK Facade | Reject before enqueue; preserve current context | Typed error with operation, cause, context, and remediation |
| Queue saturation | UI Executor | Prioritize input, coalesce eligible work, cancel stale work, reject or backpressure at the declared limit | Transaction disposition and queue Issue; no unbounded growth |
| Application task or Command failure | Application Orchestration | Structured cancellation and error boundary; keep last known-good Surface | Fallback Component or recoverable Issue |
| Interceptable Event handler failure | Application Orchestration and Interaction Kernel | OD-02 must define deadline and exactly-once recovery before ratification | No stuck default action, unbounded pending Event, or duplicate completion |
| Stale Data Source or Transcript result | Content and Projection Kernel | Compare stable identity and generation; reject stale result | Observable stale disposition without projection rollback |
| Resident Projection pressure | Content and Projection Kernel | Evict outside protected visible, anchored, selected, and streaming content; request reload later | Observable range and eviction Events |
| Text or formatted-content parser failure | Content and Projection Kernel | Reject malformed input or present safe plain fallback where declared | Typed content Issue without terminal control execution |
| Frame-budget pressure | Presentation Pipeline | Hysteretic 120/90/60 tiers, input priority, eligible coalescing, reduced decorative presentation | Correct final Surface and visible tier diagnostics |
| Runtime invariant failure | Runtime Authority supervisor | Catch at the private boundary, freeze the context, preserve bounded diagnostics, restore terminal, discard context | Safe report and explicit clean restart path |
| Terminal capability denial or absence | Terminal Session | Degrade only the affected capability and select a safe fallback | Typed capability outcome; application remains usable where possible |
| Clipboard timeout, denial, or malformed response | Terminal Session | Bound request, correlate response, discard invalid bytes, complete with typed status | No response bytes leak as keyboard Events |
| Partial or failed terminal write | Terminal Session | Stop further mutation of the active session, attempt restoration, end context cleanly | Unrecoverable write Issue and no false success |
| Terminal disconnect | Terminal Session | Cancel pending terminal work and end the active context | Deterministic cleanup without waiting indefinitely |
| Diagnostic ring wrap | Diagnostic and Test Observation | Retain bounded deltas and periodic snapshots; record wrap marker | Trace remains parseable and reports lost interval |
| Mismatched release artifact | Distribution and Resolution | Reject before runtime initialization | Actionable diagnostic naming the incompatible dimension |

## State integrity

- The UI Executor is the only writer into runtime state. Worker tasks submit immutable transaction requests and never mutate the runtime directly.
- A transaction validates all expected failure conditions before mutation and then applies as one logical unit in deterministic command order. Tuvren does not promise rollback after application begins. An unexpected failure during application freezes and discards the affected runtime context after preserving bounded diagnostics and restoring the terminal; the system never continues from partially applied state.
- Controlled properties accept the application's latest valid generation. Uncontrolled properties remain runtime-owned after initialization until authority changes explicitly.
- The Composition Tree, Semantic Tree, focus state, layout, hit-testing, selection, and rendered Surface advance on one serialized timeline.
- The last known-good Surface remains available for recoverable Issues and supervisor fallback.
- Diagnostic records may refer to runtime identity but never become mutation authority.
- Runtime replay uses recorded runtime intents; application replay uses logical End User input and application fixtures. Neither claims arbitrary external-state time travel.

## Performance overrun policy

The Presentation Pipeline measures engine service time separately from terminal-write time and retains end-to-end input-to-Surface correlation. It does not render unchanged applications to maintain a nominal rate.

When the 8.33 ms goal is missed, the pipeline may move to the 11.11 ms degraded tier with hysteresis. It may coalesce eligible changes or reduce decorative animation presentations. Crossing 16.67 ms within the reference envelope is a release defect, not an accepted operating mode. Text correctness, Event delivery, semantic state, terminal cleanup, and the final animation state are never degradation levers.

## Observability

- Every input, Event, Command, application span, transaction, mutation, dirty cause, layout, text operation, Render Pass, terminal write, error, and cleanup action carries a causal identity into the Diagnostic Graph.
- Every late Render Pass has a complete causal path or an explicit unattributed tooling defect.
- Inspect, Timeline, and Issues are synchronized projections of one Diagnostic Graph.
- Diagnostics-disabled mode emits no steady-state diagnostic allocation and stays below the approved CPU overhead.
- Passive and full-trace modes report their visible bounded overhead.
- Exported diagnostics redact raw input, clipboard content, terminal payloads, environment values, and absolute paths by default. Full-content export requires confirmation.

## Configuration

- Managed lifecycle is the default; manual lifecycle is an explicit Imperative SDK embedding mode.
- Screen Mode, external-output mode, Capability Tier evidence, reduced motion, queue budgets, diagnostic level, and privacy policy are explicit configuration domains.
- Global output capture and clipboard reads are opt-in.
- Capability behavior derives from detection evidence, not terminal-name policy.
- Headless configuration replaces the Terminal Environment only; it does not bypass orchestration, mutation, layout, rendering, semantics, or cleanup paths.

## Release resilience

- The public SDK and target artifact set release atomically at one exact version.
- A supported target qualifies only through install, load, initialization, headless render, and shutdown on that target.
- Locked inputs, immutable automation, artifact checksums, and provenance make each release auditable.
- Pre-GA breaking changes ship with migration guidance, a deprecation period where safe, and automated migration where practical.
- Diagnostic Trace and snapshot schemas carry independent versions and fail incompatibility explicitly.
