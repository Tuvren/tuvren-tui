# Realign interview record

**Date:** 2026-08-26  
**Target:** Realign  
**Mode:** Brownfield audit followed by ordered Evolution passes  
**Depth:** Full sweep

## Purpose

This report records the rulings from the full Realign interview. Later sessions must honor these rulings without asking the same questions again. The running code remains evidence of feasibility and migration cost. It doesn't define the target product when the interview approved a different contract.

The repository used an earlier version of the constitution framework. Format gaps are migration debt, not proof that the product scope is wrong. Realignment must proceed from the product requirements document (PRD) through Architecture, TechSpec, and Tasks in that order.

## Evidence reviewed

The interview reviewed the following evidence:

- All active PRD, Architecture, TechSpec, Tasks, reports, spikes, and repository instructions. Completed and archived Tasks were listed but not read, as the framework requires.
- The Rust implementation, TypeScript host SDK, examples, package manifests, workflows, and release configuration.
- The July 2026 codebase audit and the active 52-ticket, 177-point Tasks plan.
- The Git history and the GitHub Actions record. The last code delivery was Epic T; the later commit replanned Tasks without changing production code.
- Official documentation for Bun, Effect, OpenTUI, Ink, Ratatui, Taffy, terminal protocols, and GitHub-hosted runners where time-sensitive facts affected a ruling.
- Independent reviews of the native Component boundary, adoption-focused devtools, and public vocabulary. The vocabulary review received no product or repository context.

## Product identity

### Archetype

**Ruling:** Declare `Library/SDK` as the primary archetype and `System/Native` as the secondary archetype, with high confidence.

**Reasoning:** Tuvren ships a TypeScript SDK backed by a native terminal runtime. It enables command-line tools, but it isn't itself a command-line application. Declaring `CLI/Tooling` would select the wrong downstream contract and acceptance defaults.

### Product ambition

**Ruling:** Tuvren must be a general-purpose terminal UI library. Agent clients, developer tools, dashboards, editors, operational consoles, forms, and other interactive terminal applications are representative uses rather than separate product categories.

**Reasoning:** The user rejected a specialist agent-console identity. The agent-focused examples remain demanding proof cases for a general framework.

### Competitive position

**Ruling:** Tuvren must match or beat OpenTUI across representative workloads, remain only marginally slower than Ratatui on comparable hot paths, and materially outperform Ink and similar TypeScript alternatives.

**Reasoning:** Native performance and efficiency are part of the product promise. They aren't optional implementation preferences. Comparative claims must use pinned versions, equivalent fixtures, published methods, and raw results.

## Canonical vocabulary

The interview approved the following vocabulary after a context-free review by an independent developer-team reviewer:

- **Component:** A public reusable authoring abstraction with props, children, composition, and lifecycle behavior.
- **Primitive:** A low-level, native-backed public building block. Concrete names include `Box`, `Text`, and `Input`.
- **RuntimeNode:** An internal retained-tree record with identity, geometry, relationships, and runtime state. Don't expose this term in ordinary SDK workflows.
- **Effect UI SDK:** The declarative SDK built around the Effect TypeScript ecosystem.
- **JSX syntax:** The view-authoring syntax. JSX doesn't imply React, a browser document object model, or a virtual DOM.
- **Reactivity:** The public capability. `Signal` remains an internal term unless a later Evolution pass deliberately exposes a stable signal contract.
- **StyleSpec:** One typed style declaration.
- **StyleSheet:** A registered collection of named `StyleSpec` rules and native state or capability conditions.
- **ThemeTokens:** Semantic values such as colors, spacing, and motion values.
- **ThemeRecipes:** Reusable Component-level styling defaults.
- **RuntimeExtension:** A possible runtime contribution contract that hasn't reached Plugin maturity.
- **Plugin:** A packaged, discoverable extension with a defined lifecycle, compatibility rules, installation model, and permissions. Reserve this term until those guarantees exist.

**Reasoning:** `Component`, `Widget`, and `Node` must not compete as umbrella terms. `Primitive` communicates the low-level boundary more accurately than `Widget`. `StyleSheet` is appropriate because the approved API registers named rules; use `StyleSpec` for an individual rule.

## Developer and SDK experience

### SDK hierarchy

**Ruling:** The imperative SDK is the stable runtime foundation. The Effect UI SDK is the preferred declarative experience. JSX supplies view syntax, and the reactive mechanism remains private. Raw FFI isn't part of an ordinary public workflow.

**Reasoning:** Effect and JSX don't compete. Effect governs application lifecycle, services, typed failures, structured concurrency, Streams, and tests. JSX describes the view. A private fine-grained reactive mechanism can update the view without becoming a second programming model.

### Package entrypoints

**Ruling:** The bare `tuvren-tui` import is the Effect-first declarative SDK. The imperative SDK is available from `tuvren-tui/imperative`.

The public package contains these entrypoints:

- `tuvren-tui`
- `tuvren-tui/jsx-runtime`
- `tuvren-tui/jsx-dev-runtime`
- `tuvren-tui/testing`
- `tuvren-tui/imperative`
- `tuvren-tui/imperative/testing`

Don't publish a separate `tuvren-tui/effect` entrypoint.

**Reasoning:** Developers expect a bare package import to represent the recommended workflow. Specialized or lower-level modes use subpaths. This arrangement gives Tuvren one obvious starting point without hiding the imperative foundation.

### Effect dependency

**Ruling:** Declare one supported Effect major as a required peer dependency. Verify the stable major during the TechSpec pass. Bun installs peer dependencies by default, which preserves one-command onboarding and avoids a second Effect runtime in applications that already use Effect.

**Reasoning:** A nested direct dependency can duplicate Effect runtime identity. An optional peer would make the default declarative import fail after the documented one-command installation.

### Effect-native behavior

**Ruling:** The Effect UI SDK must be genuinely Effect-native:

- `render` returns an Effect value.
- Application and terminal lifetimes use scoped resources.
- Commands can return typed, interruptible Effects.
- Events and external updates can use Streams.
- Services and Layers provide dependencies and test substitutions.
- Tests bridge the native manual clock with Effect TestClock.
- Tuvren hooks hide the reactive implementation.

**Reasoning:** A Promise-based JSX wrapper with a few Effect helpers doesn't make Effect a defining declarative model.

### Capability parity

**Ruling:** The imperative and Effect SDKs have capability parity without API shape parity. Every Primitive has a safe imperative wrapper, and every first-party Component is available through Effect JSX. Both surfaces share native behavior, accessibility, styling slots, Events, Commands, and tests.

**Reasoning:** Effect adds workflow composition. It must not become the only route to UI capabilities. The imperative SDK must not imitate Effect syntax.

### Installation and onboarding

**Ruling:** The ordinary installation flow is `bun add tuvren-tui`, followed by an import and application run. Developers must not need Rust, FFI knowledge, manual binary downloads, native build steps, or environment variables.

Set these adoption goals:

- Scaffold to first render within 5 minutes.
- Complete an interactive Hello World within 10 minutes.
- Complete a small application with multiple Primitives, input, state updates, and cleanup within 30 minutes.
- Add a semantic interaction test within 10 minutes.

Source builds and `TUVREN_LIB_PATH` remain contributor and diagnostic paths.

### Lifecycle and loops

**Ruling:** The recommended imperative and Effect entrypoints own initialization, the application loop, cleanup, and terminal restoration. Manual `init`, input polling, Event drain, Render Pass, and shutdown APIs remain an advanced imperative embedding surface.

**Reasoning:** The safe path must restore the terminal after success, interruption, a Command failure, an Effect failure, or an unexpected exception. Custom loops remain necessary for embedding, benchmarks, and framework work.

## Runtime ownership and concurrency

### Mutable authority

**Ruling:** Rust remains the only mutable UI runtime authority. Application domain state can live in TypeScript and Effect, but layout, rendering, focus, hit-testing, text editing, scrolling, terminal behavior, and ephemeral interaction state remain in Rust.

### Concurrent application work

**Ruling:** Applications can run concurrent asynchronous work. Native UI state and rendering remain serialized. Multithreaded UI mutation or background rendering isn't a product requirement.

**Reasoning:** Agent streams, network work, file operations, and background jobs need concurrency. Deterministic UI state doesn't require parallel mutation or a second renderer.

### UI executor

**Ruling:** One UI executor owns native mutation calls. Effect fibers and asynchronous services submit ordered UI transactions to the executor. A transaction batches mutations and requests no more than one Render Pass.

Worker threads can't call FFI directly. The executor must define ordering, backpressure, coalescing, cancellation, and queue limits. Devtools correlate transactions with their originating Effect spans.

## Component and Primitive boundary

### Native-first rule

**Ruling:** Rust owns expensive, repeated, correctness-sensitive, or cross-cutting mechanisms. TypeScript owns public composition, styling recipes, application callbacks, Effect services, and domain state.

Promote reusable kernels rather than branded Components. Appropriate native kernels include layout, text, editing, focus, event ordering, collection virtualization, modal behavior, animation, transcript behavior, and cell drawing. `Checkbox` and `Menu` remain Component names over those kernels.

**Reasoning:** A TypeScript Component creates native Primitives. The native runtime performs steady-state layout and rendering. A native node type for each control adds ABI and maintenance cost without automatically improving a hot path.

### Component catalog

**Ruling:** Ship the following first-party Components in `0.1.0`:

- `Button` and `ToggleButton`.
- `Checkbox`.
- `Radio` and `RadioGroup`.
- `ProgressBar`, `Meter`, and `Spinner`.
- `Menu`, `MenuItem`, `MenuBar`, and `ContextMenu`.
- `Dialog` and `AlertDialog`.
- Public Select, ListBox, and Tabs Components over shared native kernels.
- `CommandPalette`, `CodeView`, and `DiffView`.
- Toast and Notification Components.

Rust must provide reusable activation, interaction-root, modal, selection, focus, collection, semantic-state, and animation behavior underneath these Components.

### Controlled and uncontrolled state

**Ruling:** Support controlled and uncontrolled modes, but declare exactly one authority for each property. Effect Components use Effect application state for business values. Rust stores the applied value and ephemeral interaction state. Imperative Components can use native-owned uncontrolled state.

### Native promotion

**Ruling:** A Component becomes eligible for native backing only after batching, stable identity, caching, and delta reconciliation fail to meet a measured budget. Promote only if native-state affinity or repeated hot work justifies the change, semantics are mature, and the public Component contract remains unchanged.

The benchmark work must determine the final hard promotion cuts. Intended evidence includes material host cost and a native prototype that improves latency or memory without semantic regressions.

### Later visual primitives

**Ruling:** Target a native-backed Canvas or cell-surface Primitive for `0.2.0`. Developers don't write Rust or load native extensions. Use the same release for the unified Image Component, Kitty graphics, and Sixel fallback.

## Styling and themes

### Restricted native StyleSheet

**Ruling:** `0.1.0` uses typed TypeScript declarations backed by a restricted native StyleSheet engine. Don't implement CSS text parsing, arbitrary descendant or sibling selectors, CSS specificity, global class-name matching, or a general media-query language.

Rust owns token resolution, state matching, capability conditions, light and dark mode, reduced motion, responsive conditions, inheritance, precedence, resolved-style caching, and dirty propagation.

Support these state and environment conditions:

- Focused, pointer-over, active, disabled, selected, checked, mixed, expanded, and invalid state.
- Light and dark terminal mode.
- Reduced motion.
- Terminal width and height conditions.
- Color and capability tier.

**Reasoning:** Property-only styling moves state transitions into TypeScript. A full CSS engine adds selector and cascade complexity that doesn't match terminal interfaces. Restricted rules let native state changes update styles without host callbacks or FFI traffic.

### Component overrides

**Ruling:** Developers can override styles at Theme, Component-instance, and stable named-slot levels. Internal Primitive trees remain private and replaceable.

Use deterministic precedence:

1. Runtime defaults.
2. `ThemeTokens`.
3. `ThemeRecipes`.
4. Built-in Component recipes.
5. Instance StyleSheets.
6. Instance slot overrides.
7. Explicit inline overrides.

State variants resolve in Rust. Devtools must show the winning, overridden, and inactive declarations with source locations and reasons.

## Layout and responsiveness

### Layout models

**Ruling:** Flexbox and Grid are P0 native layout models. Flexbox is the default. Grid provides two-dimensional dashboard, form, and inspector layout. Support absolute positioning for overlays and anchors.

Support fixed, percentage, intrinsic, min and max, grow and shrink, gap, and aspect-ratio sizing. Don't add browser floats or browser document-flow emulation.

### Responsive conditions

**Ruling:** Native StyleSheet and layout declarations can respond to terminal and parent dimensions through absolute cell values and percentages. Developers define breakpoints. If no responsive rule fits, the application must declare clip, scroll, or minimum-size failure behavior.

## Text, editing, and content

### Unicode contract

**Ruling:** `0.1.0` must correctly handle UTF-8 text, grapheme clusters, ZWJ emoji, flags, modifiers, combining marks, CJK width, ambiguous width, tabs, selection, cursor movement, hit-testing, wrapping, clipping, search, and editing. Use terminal-negotiated width behavior when available.

TypeScript strings are UTF-16 code-unit sequences. Convert them transparently to validated UTF-8 at the boundary. Rust and FFI use UTF-8. Public positions use grapheme coordinates rather than UTF-8 byte offsets or UTF-16 code-unit offsets. Provide explicit adapters for UTF-16LE and UTF-16BE byte streams.

Target full Unicode bidirectional and right-to-left behavior for `0.2.0`, including mixed runs, visual and logical indexing, cursor movement, selection, and hit-testing.

### Content forms

**Ruling:** `0.1.0` supports these native-rendered content forms:

- Plain text.
- Canonical `StyledText` or `TextDocument` data.
- Markdown with a declared CommonMark and GitHub Flavored Markdown feature set.
- Syntax-highlighted code.
- Sanitized ANSI text.

The ANSI parser may retain allowlisted styling and validated OSC 8 links. It must reject cursor movement, title changes, clipboard operations, and terminal control.

Diffs, diagnostics, structured data, and structured logs are Components over the canonical document model. AsciiDoc, reStructuredText, HTML subsets, mathematics, and diagrams use adapters unless demand and measurement justify a native parser.

### Editing

**Ruling:** `0.1.0` Input and TextArea editing supports:

- Grapheme, word, line, and document navigation.
- Keyboard and mouse selection.
- Cut, copy, paste, and the modern clipboard contract.
- Operation-based undo and redo.
- Find and replace.
- Soft wrap, no wrap, and horizontal scrolling.
- Configurable tabs and indentation.
- Line-ending normalization.
- Validation, maximum length, read-only, disabled, and secure-input modes.
- Controlled and uncontrolled values.

Target multicursor editing, folding, syntax-aware indentation, and language server integration for `0.2.0`.

## Input and terminal capabilities

### Input baseline

**Ruling:** `0.1.0` supports keyboard input, pointer click and movement, drag, release, wheel input, focus and blur, resize, bracketed paste, Unicode text input, and capability-aware clipboard operations.

### Modern terminal tiers

**Ruling:** Modern terminal behavior is a product advantage. Define two tiers:

- **Modern:** Full negotiated behavior and the primary release experience.
- **Compatible:** Safe ANSI rendering and basic input with advanced features reported as unavailable.

Detect capabilities by protocol behavior rather than terminal-name allowlists. Degrade individual capabilities rather than the application.

### Modern protocol roadmap

**Ruling:** The `0.1.0` modern baseline includes:

- Truecolor with 256-color and 16-color fallback.
- Synchronized output.
- OSC 8 hyperlinks.
- Full Kitty keyboard semantics, including repeat and release distinctions.
- Enhanced pointer, focus, and bracketed-paste behavior.
- Kitty-level clipboard and paste-event behavior.
- Cell and pixel geometry queries.
- Terminal theme, palette, and color-depth detection.
- Explicit character-width negotiation where available.

Target Kitty graphics, Sixel, Image, and Canvas integration for `0.2.0`.

### Clipboard

**Ruling:** Reopen clipboard reads and rich media-type transport from the advanced-terminal exclusion. Aim for Kitty-level capability:

- Permission-aware reads and writes.
- Clipboard and primary selection.
- Media-type discovery.
- Chunked binary payloads.
- Explicit unavailable, denied, busy, and completion responses.
- Paste-event negotiation.
- Plain-text convenience APIs.
- Bounded payloads, timeouts, validation, and request correlation.

Use OSC 52 as a text fallback. Parse responses in the native input decoder so protocol bytes never leak as keyboard Events. Don't shell out to platform clipboard commands. Require an explicit application request; don't read the clipboard in the background.

### Screen modes and remote environments

**Ruling:** `0.1.0` supports alternate-screen, inline, split-footer, and headless modes with explicit selection and deterministic suspend, resume, and teardown.

Applications can run through SSH, tmux, Zellij, and GNU Screen. Detect the terminal and intermediary chain, use verified passthrough, preserve ordering and restoration, and report degraded capabilities. Don't include an SSH server or remote-rendering service in the root package.

### External output

**Ruling:** Provide explicit `capture`, `scrollback`, `passthrough`, and `disabled` output modes. Don't replace `console.*` globally by default. Dev mode can enable capture. Route subprocess output through Effect Streams and the sanitized ANSI path.

## Accessibility

**Ruling:** `0.1.0` requires complete keyboard operation, visible focus, roles, names, descriptions, values, control states, a native semantic tree, no color-only information, reduced motion, semantic snapshots, and an announcement API.

Target full operating-system assistive-technology and screen-reader bridges for `0.2.0` because terminal environments don't expose one uniform protocol.

**Reasoning:** Accessibility is part of the release contract rather than a roadmap note. The semantic tree also enables better testing and devtools.

## Events, Commands, and application services

### Event model

**Ruling:** Use selective two-phase arbitration for cancelable Events if a feasibility prototype meets ordering, latency, and recovery requirements.

The intended flow is:

1. Rust normalizes input and performs hit-testing.
2. The host dispatches capture, target, and bubble handlers.
3. The host returns consumed and prevent-default disposition.
4. Rust applies the default action when allowed.

Use a native fast path for noncancelable Events or Event classes with no host interceptor. Coalesce pointer movement and bound pending Events. Synchronous handlers can prevent a default; an asynchronous result can't cancel an action that has committed.

**Reasoning:** Eager native defaults can't support Dialog interception, Component retargeting, or application Keymaps. Host-owned behavior violates the native-first boundary. Selective arbitration balances both needs.

### Commands and Keymaps

**Ruling:** Commands are the main application-action abstraction. Commands have stable IDs, metadata, enabled and visible conditions, context predicates, and Effect-native execution. Each Command declares a reject, restart, queue, or parallel concurrency policy.

Programmatic calls, Keymaps, Menus, Buttons, and CommandPalette use the same Command path. Keymaps use focused Component, containing scope, application, and default precedence. Support multi-key sequences, conflict diagnostics, and End User rebinding. Rust normalizes keys; TypeScript and Effect resolve application Commands.

### Shared collection substrate

**Ruling:** Lists, Tables, Selects, Menus, and related controls share one native virtual-collection substrate with stable keys, range requests, incremental mutation, selection, focus, scrolling, visible-range computation, loading, empty, error states, and variable-height items where allowed.

Support controlled application data and bounded local data. Effect range loads use cancellation and stale-response protection.

### Adjacent services

**Ruling:** `0.1.0` includes native FocusScope and modal-navigation foundations, pointer capture, drag-and-drop Event semantics, Toast and Notification Components, and consistent value, validation, error, disabled, and submission contracts for form controls.

Target opinionated navigation, routing, higher-level Form orchestration, schema integration, and screen-history transitions for `0.2.0`.

## Transcript model

**Ruling:** Support controlled and bounded-local Transcript modes.

In controlled mode, the application owns durable logical history. Rust owns the resident projection, text storage, viewport anchors, selection, collapse state, and rendering. In local mode, Tuvren owns bounded in-memory history for smaller applications.

Use stable application block identities. Support insert, stream or patch, finish, replace, collapse, expand, remove, clear, projection eviction, and range reload. Protect visible, anchored, selected, and streaming blocks from eviction. Emit observable range and eviction Events. Use generations to reject stale loads.

**Reasoning:** Tuvren is a UI runtime, not an application database. The native projection must remain bounded without silently deleting an application's only copy of history.

## Performance and efficiency

### Representative envelope

**Ruling:** Design and benchmark `0.1.0` against this goal envelope:

- Surfaces up to 300x100 cells.
- 1,000 mounted Primitives.
- 10,000 resident Transcript blocks.
- Bursts of 100 content updates per second.
- Text documents up to 10 MiB.
- Virtual collections with 100,000 logical items without mounting each item.
- Multiple panes, overlays, syntax highlighting, selection, and devtools in one application.
- A 10x stretch fixture for scaling analysis without a full frame-rate promise.

### Frame tiers

**Ruling:** Use three performance stops:

- 120 Hz goal: 8.33 ms.
- 90 Hz degraded tier: 11.11 ms.
- 60 Hz worst acceptable tier: 16.67 ms.

Falling below 60 Hz inside the declared envelope fails the release gate. The renderer adapts among the tiers with hysteresis. Animations use elapsed time. Prioritize input over decorative work. Don't render unchanged UIs to maintain a nominal rate. Correctness, text quality, and Event delivery never degrade to recover frame rate.

Measure engine time separately from terminal write time and retain an end-to-end input-to-Surface meter.

### Intended comparative margins

**Ruling:** Use these intended margins until benchmark evidence establishes the hard cuts:

- OpenTUI: no more than 5% slower on any primary p95 latency fixture and a win across the aggregate suite.
- Ratatui: within 15% on comparable hot update and render paths. Report Bun startup and baseline runtime memory separately.
- Ink: at least 3x faster across the aggregate interactive workload and materially lower incremental memory.

Publish fixtures, versions, hardware, warmup, statistics, and raw results.

### Adaptive animation

**Ruling:** Rust owns animation timing, easing, delay, repeat, reverse, chaining, grouped timelines, cancellation, replacement, completion, and dirty propagation. Support color, opacity, position, dimension, and scroll transitions. Effect wrappers compose completion and interruption. Support global and per-animation reduced motion and deterministic manual-clock tests.

Target spring physics and complex keyframe authoring for `0.2.0`.

## Devtools and testing

### Adoption loop

**Ruling:** `0.1.0` must ship a local, terminal-native Inspect, Record, and Prove loop. Don't require a browser, server, account, network listener, editor extension, or remote upload.

Provide these commands:

- `bunx tuvren dev ENTRY`
- `bunx tuvren doctor`
- `bunx tuvren trace view TRACE_FILE`
- `bunx tuvren examples` or an equivalent no-clone browser.

Use hard-restart watch mode rather than preserving native Handles across a soft reload.

### Shared observation graph

**Ruling:** Rust owns one versioned diagnostic graph. The graph maps author Components to private Primitives and includes geometry, clipping, scrolling, styles and provenance, focus, Events, accessibility, dirty causes, and Render Pass identity. It doesn't become mutable TypeScript UI state.

The inspector contains three synchronized views:

- **Inspect:** Author tree, Surface picker, layout, styles, Events, accessibility, and optional runtime internals.
- **Timeline:** Causal records, Render Pass bars, frame reconstruction, recording, and replay.
- **Issues:** Errors, accessibility violations, invalid styles, lifecycle leaks, unsupported capabilities, and dropped records.

The inspector renders as a compositor layer and pauses application input when focused.

### Causal traces

**Ruling:** Correlate terminal input, Event routing, Commands, Effect spans, reconciliation, native mutation, dirty propagation, layout, text, rendering, diff, terminal writes, errors, and cleanup.

Store bounded deltas with periodic snapshots. Report ring wrap. A versioned `.tuvren-trace` file contains records, snapshots, terminal profile, performance tier, and redaction policy.

Runtime replay reproduces native command behavior. Application replay runs logical End User input against application fixtures and Effect Layers. Don't claim time travel for arbitrary external state.

### Test harness

**Ruling:** `tuvren-tui/testing` and `tuvren-tui/imperative/testing` provide keyboard, paste, pointer, drag, scroll, resize, and raw Event drivers; terminal capability profiles; one manual clock; Effect TestClock integration; visual idle waits; character, style, cursor, semantic, and diagnostic snapshots; automatic traces on failure; cleanup; and leak checks.

Use semantic queries such as `getByRole` before Component IDs, Handles, or runtime-tree queries.

### Error and package diagnostics

**Ruling:** Recoverable failures open **Issues** over the last good Surface and show the phase, stable code, Component, source, Effect Cause, preceding Event or Command, related trace interval, remediation, copy-report, save-trace, and restart actions.

If the overlay can't start, a supervisor restores the terminal and prints the report. `doctor` verifies Bun, platform, architecture, libc, native package selection, ABI agreement, library loading, headless initialization, Effect compatibility, source maps, terminal, multiplexer, and capabilities.

### Privacy and overhead

**Ruling:** Don't capture raw input, clipboard content, protocol payloads, environment values, or absolute paths by default. Redact input content in exported traces. Require confirmation before saving full-content traces. Bound trace parsing and decompression.

Set these intended tooling budgets:

- Disabled tooling: less than 1% CPU overhead and no steady-state allocation.
- Passive metadata: less than 3% overhead.
- Full trace recording: less than 10% overhead with bounded memory and visible overhead reporting.

Defer browser and editor inspectors, live prop editing, source write-back, remote attachment, extension panels, arbitrary application-state time travel, state-preserving hot reload, built-in CPU or heap profiling, telemetry exports, and AI integrations until P0 usage justifies them.

## Security, failure, and error contracts

### Trust boundaries

**Ruling:** Treat Developer content, subprocess output, terminal responses, clipboard payloads, replay files, and FFI arguments as untrusted.

`0.1.0` requires typed terminal-protocol builders, strict boundary validation, bounded resources, query timeouts and correlation, parser fuzzing, documented unsafe invariants, locked builds, immutable CI actions, dependency audits, package provenance, artifact checksums, and redacted diagnostics.

### Failure recovery

**Ruling:** Validation failures, unavailable capabilities, permission denial, timeouts, and application errors are recoverable. Component and Effect error boundaries can render fallbacks. A terminal disconnect or unrecoverable write failure ends the active session cleanly.

A Rust panic indicates a violated invariant. Catch the panic, restore the terminal, preserve diagnostics, discard the affected native context, and permit a clean restart. Don't continue mutating a context that might be inconsistent. No failure can permanently prevent process reinitialization.

### Public errors

**Ruling:** Hide internal FFI status codes from ordinary Developers. Imperative APIs throw or reject with typed `TuvrenError` variants. Effect APIs use tagged errors in the Effect error channel. Each error includes a stable code, category, operation, Component identity where applicable, cause, and remediation.

## Platforms and distribution

### Runtime reach

**Ruling:** Bun is the only supported host runtime for `0.1.0`. Preserve a host-adapter boundary for later Node.js evaluation. Don't commit to Deno until demand justifies it.

### Supported targets

**Ruling:** Support these five targets:

- glibc Linux x64.
- glibc Linux arm64.
- macOS arm64.
- macOS x64.
- Windows x64.

A target qualifies only after its package builds, installs, loads, initializes, renders headlessly, and shuts down on that target. Cross-compilation alone doesn't qualify. Musl and Alpine Linux remain unsupported.

### Package and ABI compatibility

**Ruling:** The public package and all platform packages share one exact version and release atomically. The native ABI is private to the matching package set. Reject mismatches before initialization with a diagnostic.

Ship compiled ESM, TypeScript declarations, and source maps. Don't rely on raw TypeScript as the only package payload. The `tuvren-tui` package includes the `tuvren` executable. Platform packages remain implementation details.

### Pre-1.0 policy

**Ruling:** Pre-1.0 minor releases can break public APIs, but each break requires a changelog entry, migration guide, and an automated codemod when practical. Keep a one-minor deprecation period when compatibility doesn't compromise the design. Version trace, snapshot, and replay schemas independently.

Define 1.0 guarantees only after public feedback.

## Examples and release discipline

### Proof rule

**Ruling:** A capability isn't shipped until it has a public example and automated acceptance evidence. Performance-sensitive capabilities also require representative benchmark fixtures.

Examples use published entrypoints only. Imperative and Effect examples prove capability parity without duplicating every application. The flagship set must include a dashboard or form, an editor or inspector, a streaming agent console, an inline or split-footer tool, and a styling, accessibility, and devtools demonstration.

### OpenCode example

**Ruling:** The OpenCode client is a release-gating performance and developer experience reference. It isn't a supported integration contract. Isolate the live protocol behind an application adapter and use deterministic replay in CI. Don't place OpenCode types or lifecycle rules in core SDK contracts.

### Release staging

**Ruling:** Use private or clearly tagged `0.1.0-alpha.*` builds during implementation and external testing. Don't publish final `0.1.0` until every approved P0 capability, example, semantic test, platform smoke, security gate, devtools path, and competitive benchmark passes.

Don't weaken `0.1.0` to publish sooner. Target Canvas, images, BiDi and RTL, advanced editor features, routing, Form orchestration, and Runtime Extensions for `0.2.0` or a later release as recorded in this report.

## Existing-surface disposition

### Retain and deepen

Retain the following foundations and reconcile them to the target contract:

- Rust as the only mutable UI authority.
- The one-way host-to-native command boundary.
- Safe opaque identities at the private ABI.
- Native layout, text, rendering, terminal, Event, scroll, transcript, SplitPane, animation, and diagnostic foundations.
- Imperative wrappers as the low-level SDK foundation.
- Commands and Keymaps as application-action foundations.
- Headless testing and deterministic snapshots.
- One public package with platform-specific binary packages hidden underneath.

### Replace or retire

The following surfaces don't represent the target product:

- Retire the public `ExtensionRegistry` and contribution-slot system. Don't publish an experimental replacement in `0.1.0`.
- Retire the background-render prototype, feature flag, benchmark, and private ABI symbols. Git history and the decision report preserve the experiment.
- Replace the OpenAPI artifact. Tuvren has no HTTP API.
- Replace standalone root JSX and public signals with the Effect-first root package and private reactivity.
- Replace `Widget`, public `Node`, and ambiguous `Effect SDK` vocabulary with the approved terms.
- Replace the Promise-first Effect wrapper with an Effect-native SDK.
- Replace the narrow style and Theme API with the restricted native StyleSheet and Theme model.
- Replace the custom-format-handler promise with the canonical document and adapter contract.

### Treat as defects

The following repository behavior is a defect rather than product intent:

- Raw control characters can reach classic render paths.
- A caught panic can prevent terminal restoration or later initialization.
- Event errors can be treated as an empty queue.
- Event, Transcript, and diagnostic resources can grow without complete bounds.
- Render Passes can ignore dirty state.
- Transcript accounting can scale with total history per update.
- Text state can have competing authorities.
- Public examples can depend on private files and raw FFI.
- Some native functions lack safe SDK wrappers.
- CI omits shipped Command, Effect, and extension tests.
- Package metadata, publish automation, lockfiles, audits, and provenance are incomplete.
- The macOS x64 workflow uses a retired runner label.
- Linux arm64 lacks native load evidence even though the PRD claims full target verification.
- The quality policy describes gates that the workflow doesn't complete.

### Treat as partial alignment

The active Tasks plan correctly prioritizes safety, scaling, consolidation, SDK quality, a demanding flagship example, and release hardening. Its detailed scope doesn't cover the product contract approved in this interview. Regenerate the active plan after the upstream Evolution passes rather than patching the v9 plan in place.

## Stage ownership

### PRD

Stage 1 owns these changes:

- Archetype and product identity.
- Actors, jobs, and onboarding outcomes.
- Canonical vocabulary.
- P0 and later capabilities.
- Performance, security, accessibility, platform, adoption, and release constraints.
- Modern-terminal positioning.
- `0.1.0` and `0.2.0` scope boundaries.
- Reopened and superseded out-of-scope decisions.
- The problem-space model for Components, Primitives, Commands, documents, Transcripts, virtual collections, Themes, and terminal capabilities.

### Architecture

Stage 2 owns these changes:

- Effect UI SDK, imperative SDK, UI executor, and native runtime boundaries.
- Component-to-Primitive ownership and the private RuntimeNode tree.
- Native StyleSheet, virtual collection, document, Event, terminal protocol, diagnostics, and test boundaries.
- Controlled data-source and resident-projection flows.
- Event arbitration and Command flows.
- Failure, terminal restoration, privacy, and observability design.
- Package-load, clipboard, render-pacing, devtools, testing, and release flows.

### TechSpec

Stage 3 owns these changes:

- Verified language, runtime, dependency, and tool versions.
- Package exports, peer dependency policy, compiled artifacts, and native package mapping.
- ABI, TypeScript declarations, headers or interface descriptions, schemas, trace formats, and testing contracts.
- Physical models for styles, semantic metadata, Events, UI transactions, documents, collections, Transcripts, traces, and terminal protocols.
- Architecture Decision Records (ADRs) for the Effect-first package, serialized UI executor, StyleSheet engine, Event arbitration, terminal tiers, clipboard, virtual data, diagnostics, and private ABI.
- Superseding ADRs for background rendering, standalone Effect integration, extension slots, and the earlier package topology.
- Concrete verification commands.

### Tasks

Stage 4 owns these changes:

- A replacement active backlog derived from the realigned TechSpec.
- Evidence-producing spikes for the open decisions.
- Atomic tickets with explicit acceptance modes, dependencies, stops, paths, and commands.
- Retirement and migration work for surfaces that don't match the target.
- Representative examples and benchmark fixtures before implementation claims.
- Release sequencing and final reconciliation.

## Ordered realignment plan

Run the following skills in order. Use Evolution mode for each pass.

### Product requirements pass

Run `defining-product-requirements` first.

Scope the pass to the approved archetype, vocabulary, actors, capabilities, quantified constraints, modern-terminal position, release boundaries, and out-of-scope corrections. The pass must carry the open benchmark decision without inventing hard cuts.

### Architecture pass

After Stage 1 is approved, run `designing-solution-architecture`.

Scope the pass to the SDK and runtime boundaries, UI executor, native-first mechanism policy, StyleSheet engine, virtual data, Event flow, terminal protocols, devtools, testing, recovery, and critical P0 flows. Don't select vendors or versions.

### Technical implementation pass

After Stage 2 is approved, run `specifying-technical-implementation`.

Scope the pass to verified 2026 versions, package topology, real ABI and SDK contracts, physical state models, ADRs, test commands, trace formats, terminal protocols, and migration disposition. The pass must preserve unresolved evidence gates instead of guessing.

### Engineering execution pass

After Stage 3 is approved, run `planning-engineering-execution`.

Replace the active v9 backlog with an ordered, dependency-valid plan. Preserve completed history. Schedule benchmark and Event-arbitration spikes before dependent contracts or implementation. Use the framework's explicit acceptance modes rather than Gherkin-only tickets.

### Evidence reconciliation loop

Run only the evidence-producing spikes before dependent implementation. After the spikes finish, reconcile their decisions through the constitution:

1. For comparative benchmark gates, run a PRD Evolution pass to ratify the hard product constraints. Then review Architecture, TechSpec, and Tasks in order.
2. For Event arbitration, run an Architecture Evolution pass to select the logical protocol. Then review TechSpec and Tasks in order.

Don't execute tickets that depend on either open decision until the matching reconciliation reaches Tasks.

## Interview close

The interview produced two explicitly unresolved evidence gates. The `2026-08-26-open-decisions.md` file records them. No other approved topic may be reopened downstream without a product change or contradictory evidence.
