# Capabilities

P0 defines the complete `0.1.0` product contract. P1 defines the planned `0.2.0` horizon. P2 items require evidence and a later PRD Evolution pass before they become release commitments.

## P0 — `0.1.0`

### Epic P0-A — Authoring and lifecycle

**Priority:** P0

- **P0-A01:** The default SDK workflow must let a Developer describe a view declaratively and run it through a managed application lifecycle.
- **P0-A02:** The imperative SDK must expose every public Primitive through safe wrappers without requiring access to the private native boundary.
- **P0-A03:** The Declarative SDK and Imperative SDK must provide capability parity without requiring API-shape parity.
- **P0-A04:** The managed lifecycle must own initialization, input processing, Render Pass scheduling, cleanup, and terminal restoration.
- **P0-A05:** The Imperative SDK must offer an advanced embedding surface for Developers who need manual lifecycle and loop control.
- **P0-A06:** Application work must be able to run concurrently while accepted UI mutations remain deterministically ordered and serialized.
- **P0-A07:** The SDK must bound, coalesce, cancel, and apply backpressure to queued UI work according to documented policies.
- **P0-A08:** Ordinary application code must not expose native pointers, numeric native identities, foreign-function calls, or native binary management.
- **P0-A09:** A Developer must be able to batch related UI mutations into a transaction that requests no more than one Render Pass.

**Rationale:** Tuvren succeeds as an SDK only if its safest workflow is also its easiest workflow, while advanced Integrators retain a complete and explicit escape hatch.

### Epic P0-B — Primitives and Components

**Priority:** P0

- **P0-B01:** A Developer must be able to compose public Primitives into a Composition Tree of arbitrary practical depth.
- **P0-B02:** A Developer must be able to add, remove, reorder, and update composed content at runtime while preserving stable identity where declared.
- **P0-B03:** Tuvren must provide first-party `Button`, `ToggleButton`, `Checkbox`, `Radio`, `RadioGroup`, `ProgressBar`, `Meter`, and `Spinner` Components.
- **P0-B04:** Tuvren must provide first-party `Menu`, `MenuItem`, `MenuBar`, `ContextMenu`, `Dialog`, and `AlertDialog` Components.
- **P0-B05:** Tuvren must provide first-party `Select`, `ListBox`, `Tabs`, `CommandPalette`, `CodeView`, `DiffView`, `Toast`, and `Notification` Components.
- **P0-B06:** Every stateful first-party Component must support a documented controlled mode or uncontrolled mode, and each mutable property must have exactly one authority at a time.
- **P0-B07:** First-party Components must share consistent activation, disabled, validation, selection, focus, semantic-state, and animation behavior where those concepts apply.
- **P0-B08:** A Component Author must be able to distribute ordinary packages containing Components, Commands, Keymaps, helpers, and application services without a formal Runtime Extension contract.
- **P0-B09:** Form controls must share consistent value, validation, error, disabled, and submission behavior where those concepts apply.

**Rationale:** A general-purpose library needs a coherent control catalog and stable composition model, not merely a rendering engine or a collection of unrelated examples.

### Epic P0-C — Layout and responsive behavior

**Priority:** P0

- **P0-C01:** A Developer must be able to arrange content using Flexbox layout.
- **P0-C02:** A Developer must be able to arrange content using Grid layout.
- **P0-C03:** A Developer must be able to position overlays and anchored content independently of normal layout.
- **P0-C04:** Layout Constraints must support fixed, percentage, intrinsic, minimum, maximum, grow, shrink, gap, and aspect-ratio sizing.
- **P0-C05:** Responsive conditions must support absolute terminal-cell thresholds.
- **P0-C06:** Responsive conditions must support percentage thresholds relative to the available region.
- **P0-C07:** Layout must recompute after relevant tree, content, style, or Surface changes without application-managed geometry.
- **P0-C08:** When constraints cannot be satisfied, the system must apply a declared clip, scroll, or minimum-size failure behavior instead of producing undefined placement.
- **P0-C09:** Flexbox must be the default layout model when a Developer does not select another model.

**Rationale:** Dashboards, forms, editors, inspectors, and overlays require both familiar layout models and deterministic behavior under constrained terminal sizes.

### Epic P0-D — Styling and themes

**Priority:** P0

- **P0-D01:** A Developer must be able to declare typed StyleSpecs and register named rules in a StyleSheet.
- **P0-D02:** StyleSpecs must support focused, pointer-over, active, disabled, selected, checked, mixed, expanded, and invalid state conditions.
- **P0-D03:** StyleSpecs must support light, dark, reduced-motion, width, height, color, and Capability Tier conditions.
- **P0-D04:** A Developer must be able to define semantic Theme Tokens and reusable Theme Recipes.
- **P0-D05:** A Developer must be able to override first-party Component appearance at Theme, Component-instance, and stable named-slot levels.
- **P0-D06:** A Component's internal Primitive tree must remain private and replaceable without invalidating supported style overrides.
- **P0-D07:** Style resolution must use this deterministic order: runtime defaults, Theme Tokens, Theme Recipes, built-in Component recipe, instance StyleSheet, instance slot override, and explicit inline override.
- **P0-D08:** State or environment changes must update applicable styles without requiring application callbacks.
- **P0-D09:** Diagnostics must identify winning, overridden, and inactive declarations with their sources and reasons.

**Rationale:** A restricted typed styling contract provides dynamic native behavior and safe Component customization without importing browser selector and cascade complexity.

### Epic P0-E — Text and rich content

**Priority:** P0

- **P0-E01:** Text measurement, wrapping, clipping, selection, cursor movement, hit-testing, searching, and editing must use user-perceived grapheme boundaries.
- **P0-E02:** Text behavior must correctly handle joined emoji, flags, modifiers, combining marks, wide characters, ambiguous-width characters, and tabs.
- **P0-E03:** The SDK must accept ordinary host-language strings without exposing their code-unit representation in public text positions.
- **P0-E04:** Public text positions must use grapheme-based coordinates.
- **P0-E05:** A Developer must be able to import and export UTF-8, UTF-16LE, and UTF-16BE text through explicit adapters.
- **P0-E06:** A Developer must be able to present plain text, StyledText, a declared CommonMark and GitHub-Flavored Markdown feature set, code, and sanitized terminal-formatted text.
- **P0-E07:** StyledText must be the canonical public contract for custom formatted or rich content.
- **P0-E08:** Diff, diagnostic, structured-data, and log presentation must be Components built over the canonical rich-text contract.
- **P0-E09:** A Developer must be able to adapt additional content formats into StyledText without registering a privileged parser extension.
- **P0-E10:** Sanitized terminal-formatted text may retain allowlisted styling and validated hyperlinks.
- **P0-E11:** Sanitized terminal-formatted text must reject cursor movement, title changes, clipboard operations, and other terminal control.

**Rationale:** Text is the core terminal data model. Visual correctness is insufficient when positions, selection, and editing disagree about what an End User perceives as one character.

### Epic P0-F — Text editing

**Priority:** P0

- **P0-F01:** A Text Document must support grapheme, word, line, and document navigation.
- **P0-F02:** A Text Document must support keyboard and pointer selection.
- **P0-F03:** A Text Document must support operation-based undo and redo.
- **P0-F04:** A Text Document must support find and replace.
- **P0-F05:** A Developer must be able to choose wrapping or horizontal scrolling.
- **P0-F06:** A Developer must be able to configure tab, indentation, and line-ending behavior.
- **P0-F07:** A Developer must be able to declare validation, maximum length, read-only, disabled, and secure-entry behavior.
- **P0-F08:** Editable Components must support controlled and uncontrolled content with one declared authority at a time.
- **P0-F09:** A Text Document must support cut, copy, and paste through the active clipboard contract.
- **P0-F10:** A Text Document must normalize configured line endings at its declared input or output boundary.

**Rationale:** Editors, forms, command palettes, and consoles require a trustworthy editing substrate rather than application-specific key handling.

### Epic P0-G — Input, Events, focus, and direct manipulation

**Priority:** P0

- **P0-G01:** The system must normalize keyboard input, key repetition, key release, text input, pointer movement, click, drag, release, wheel, focus, blur, resize, and bounded paste input when the Terminal Environment can report them.
- **P0-G02:** The system must route Events according to hit-testing, focus, modal state, and interaction-root boundaries.
- **P0-G03:** A Developer must be able to observe Event capture, target, and bubble phases for Events declared interceptable.
- **P0-G04:** A Developer must be able to stop propagation or prevent a supported cancelable default action before that action is applied.
- **P0-G05:** Noncancelable or unintercepted Events must retain a low-latency path.
- **P0-G06:** Event arbitration must preserve exactly-once completion, deterministic ordering, bounded pending storage, and recovery from handler failure or shutdown.
- **P0-G07:** A Developer must be able to define Focus Scopes that contain navigation, restore prior focus, or trap focus for modal content.
- **P0-G08:** The system must support pointer capture and drag-and-drop behavior.

**Rationale:** Predictable interaction requires one routing model across Primitives and Components. The final arbitration mechanism remains blocked on the feasibility evidence recorded as OD-02; downstream stages must not weaken these outcomes silently.

### Epic P0-H — Commands and Keymaps

**Priority:** P0

- **P0-H01:** A Developer must be able to define a Command with a stable identity, metadata, availability condition, and typed result or failure.
- **P0-H02:** A Command must be invocable programmatically and through a Keymap, menu, button, or command palette without duplicating action logic.
- **P0-H03:** A Command must be able to declare reject, restart, queue, or parallel behavior for concurrent invocation.
- **P0-H04:** A running Command must be interruptible when its declared behavior permits interruption.
- **P0-H05:** Keymaps must support hierarchical scopes, multi-key chords, conflict reporting, and End User rebinding.
- **P0-H06:** Command availability must update all bound presentation surfaces consistently.
- **P0-H07:** A Command must be able to declare enabled, visible, and contextual conditions independently.
- **P0-H08:** Keymap resolution must use documented precedence across the focused Component, containing Focus Scopes, the application, and framework defaults.

**Rationale:** Commands provide a single application action model across keyboard, pointer, menus, palettes, tests, and programmatic workflows.

### Epic P0-I — Collections, selection, and transient feedback

**Priority:** P0

- **P0-I01:** A Data Source must supply stable keys, keyed range loading, and incremental mutations to a Virtual Collection.
- **P0-I02:** A Virtual Collection must expose selection, focus, scroll position, and visible range.
- **P0-I03:** A Virtual Collection must represent loading, empty, and error states.
- **P0-I04:** A Virtual Collection must support variable-height items where the chosen presentation permits them.
- **P0-I05:** A Virtual Collection must support controlled and local state with one declared authority per property.
- **P0-I06:** Range loading must support cancellation and reject stale results.
- **P0-I07:** Applications must be able to present bounded Toast and Notification feedback without disrupting active focus.
- **P0-I08:** List, table, Select, and Menu Components must share the Virtual Collection behavior instead of defining incompatible data-loading and selection models.

**Rationale:** Large lists, tables, menus, palettes, and results need one efficient data and interaction model instead of repeated Component-specific implementations.

### Epic P0-J — Transcript and streaming data

**Priority:** P0

- **P0-J01:** A Transcript must support both application-controlled durable history and bounded local history.
- **P0-J02:** Every Transcript Block must have a stable identity.
- **P0-J03:** A Developer must be able to insert, stream, patch, finish, replace, collapse, expand, remove, clear, evict, and reload Transcript Blocks.
- **P0-J04:** Eviction must protect visible, anchored, selected, and actively streaming content according to documented precedence.
- **P0-J05:** The system must expose resident-range changes, eviction, and reload demand as observable Events.
- **P0-J06:** Versioned Transcript updates must reject stale results.
- **P0-J07:** Streaming updates must preserve the End User's anchor unless the End User explicitly returns to the live edge.

**Rationale:** Long-running consoles and agent applications require bounded memory and stable viewport semantics without surrendering durable data ownership.

### Epic P0-K — Terminal integration and Screen Modes

**Priority:** P0

- **P0-K01:** The system must detect Terminal Capabilities from reported behavior rather than depend on terminal-name allowlists.
- **P0-K02:** The modern Capability Tier must use available high-color, synchronized-output, hyperlink, enhanced keyboard, pointer, focus, paste, clipboard, geometry, theme, palette, color-depth, and width-negotiation behavior.
- **P0-K03:** The compatible Capability Tier must preserve safe basic input and display when modern behavior is unavailable.
- **P0-K04:** Clipboard support must include permission-aware reads and writes, clipboard and primary selection, media-type discovery, bounded binary chunks, typed responses, paste Events, and a text convenience path where supported.
- **P0-K05:** Clipboard operations must enforce size bounds, timeouts, validation, and request-response correlation.
- **P0-K06:** The product must provide a text-only clipboard fallback when richer clipboard behavior is unavailable.
- **P0-K07:** A Developer must be able to run in alternate, inline, split-footer, and headless Screen Modes.
- **P0-K08:** Applications must run through local terminals, remote shells, and common terminal multiplexers without requiring a built-in remote-rendering service.
- **P0-K09:** A Developer must be able to choose capture, scrollback-preserving, passthrough, or disabled behavior for external output.
- **P0-K10:** Global application-output capture must be opt-in.
- **P0-K11:** Captured subprocess terminal formatting must be sanitized before presentation.
- **P0-K12:** When one modern Terminal Capability is unavailable, the system must degrade that capability without unnecessarily demoting the rest of the application.
- **P0-K13:** Clipboard reads must occur only after an explicit application request and must never run as background polling.
- **P0-K14:** Clipboard operations must distinguish unavailable, denied, busy, completed, malformed, and timed-out outcomes.
- **P0-K15:** Terminal response bytes consumed by capability or clipboard handling must never surface as keyboard Events.
- **P0-K16:** Each interactive Screen Mode must support deterministic suspend and resume behavior.

**Rationale:** Modern terminal support differentiates Tuvren, but capability detection, security bounds, and a safe compatibility tier keep applications dependable.

### Epic P0-L — Accessibility semantics

**Priority:** P0

- **P0-L01:** Every interactive workflow must be operable by keyboard.
- **P0-L02:** Focused interactive content must have a visible focus indicator.
- **P0-L03:** Components must expose applicable role, name, description, value, state, and relationship semantics.
- **P0-L04:** Essential meaning must not depend on color alone.
- **P0-L05:** Motion must honor reduced-motion preference without losing state feedback.
- **P0-L06:** Tests and diagnostics must expose the Semantic Tree independently of rendered cells.
- **P0-L07:** Applications must be able to publish bounded semantic announcements.

**Rationale:** Accessibility is part of the initial correctness contract, even before platform assistive-technology bridges are available.

### Epic P0-M — Animation and time

**Priority:** P0

- **P0-M01:** A Developer must be able to animate supported color, opacity, position, dimension, and scroll properties.
- **P0-M02:** Animations must support interpolation, easing, delay, repetition, reversal, chaining, groups, cancellation, replacement, and completion observation.
- **P0-M03:** Animations must advance by elapsed time rather than an assumed frame count.
- **P0-M04:** Tests must be able to control animation time deterministically.
- **P0-M05:** Reduced-motion behavior must replace or complete motion without hiding the resulting state.
- **P0-M06:** A Developer must be able to set reduced-motion behavior globally and override it for an individual animation when that override remains accessible.

**Rationale:** Motion communicates progress and state in modern terminal applications, but it must remain deterministic, cancelable, and subordinate to correctness.

### Epic P0-N — Devtools, testing, and diagnostics

**Priority:** P0

- **P0-N01:** A Developer must be able to inspect Components and their private Primitives, geometry, clipping, scrolling, style provenance, focus, Events, accessibility semantics, dirty regions, and Render Passes through one Diagnostic Graph.
- **P0-N02:** Local devtools must provide Inspect, Timeline, and Issues views inside the terminal workflow without requiring a browser, server, account, network listener, editor extension, or remote upload.
- **P0-N03:** A Diagnostic Trace must connect input, Event routing, Command or application work, reconciliation, mutation, dirtying, layout, text, rendering, terminal writes, errors, and cleanup.
- **P0-N04:** A Developer must be able to record, save, inspect, and replay a versioned Diagnostic Trace.
- **P0-N05:** Replay must support both runtime-level activity and application-input scenarios.
- **P0-N06:** Testing support must provide semantic queries, interaction drivers, Terminal Capability profiles, a manual clock, visual-idle detection, stable snapshots, automatic trace capture, and cleanup or leak checks.
- **P0-N07:** Errors must render over the last known-good Surface when recovery is possible.
- **P0-N08:** A supervisor must provide a safe fallback when local recovery cannot continue.
- **P0-N09:** A local diagnostic command must check host compatibility, platform support, package consistency, runtime loading, headless operation, declarative integration, source mappings, Terminal Capabilities, and multiplexer effects.
- **P0-N10:** Public failures must use typed errors with stable code, category, operation, Component context where applicable, cause, and remediation.
- **P0-N11:** A Developer must be able to place error boundaries around declarative subtrees and preserve the last known-good Surface when recovery is possible.
- **P0-N12:** When the inspector takes focus, application input must pause until focus returns to the application.
- **P0-N13:** Recoverable Issues must identify the failing phase, stable error, affected Component, source, cause, preceding Event or Command, related trace interval, remediation, and available report, trace, or restart actions.
- **P0-N14:** Diagnostic recording must use bounded deltas and periodic snapshots and must report when retained history wraps.
- **P0-N15:** Test authors must be able to query the Semantic Tree by role and accessible properties without using private runtime identities.
- **P0-N16:** Development watch mode must restart the application context instead of preserving private runtime identities across a soft reload.

**Rationale:** Inspect, record, and prove is the adoption loop. Diagnostics must explain both application mistakes and native-runtime failures without exposing the private boundary.

### Epic P0-O — Installation, distribution, safety, and release trust

**Priority:** P0

- **P0-O01:** A Developer must be able to install the product with one package-manager command on every supported target.
- **P0-O02:** Ordinary installation must not require a systems-language toolchain, source build, manual native download, or environment-variable configuration.
- **P0-O03:** The public SDK and built-in runtime must resolve as one exact compatible version.
- **P0-O04:** A version or platform mismatch must fail with an actionable diagnostic before application mutation begins.
- **P0-O05:** Every supported target must prove install, load, initialization, headless Render Pass, and shutdown on that target; cross-compilation alone is insufficient.
- **P0-O06:** The product must publish compiled module output, type declarations, source mappings, and its local developer command through the primary package.
- **P0-O07:** The system must treat application content, subprocess output, terminal responses, clipboard data, Diagnostic Traces, and the native boundary as untrusted.
- **P0-O08:** External data and control operations must use strict validation, bounded resources, timeouts, correlation, and safe output construction.
- **P0-O09:** Recoverable validation, capability, permission, timeout, application, and Component failures must not terminate the process or corrupt the terminal.
- **P0-O10:** After an unrecoverable runtime failure, the system must preserve bounded diagnostics, restore the terminal, discard the inconsistent application context, and permit an explicit restart path when safe.
- **P0-O11:** A terminal disconnect or unrecoverable terminal write failure must end the active application context cleanly.
- **P0-O12:** Diagnostic data must omit raw input, clipboard content, terminal protocol payloads, environment values, and absolute paths by default.
- **P0-O13:** Every shipped capability must have a public example and acceptance evidence; performance claims must include reproducible benchmarks.
- **P0-O14:** The release must include representative dashboard or form, editor or inspector, streaming console, inline or split-footer, styling, accessibility, and devtools examples using only published entrypoints.
- **P0-O15:** A final `0.1.0` release must not ship until every P0 release gate passes; a date must not weaken a gate.
- **P0-O16:** Pre-release validation may use private or alpha artifacts, but those artifacts must not be represented as the final public release.
- **P0-O17:** Saving a Diagnostic Trace with full application content must require explicit Developer confirmation.
- **P0-O18:** A failed application context must not permanently prevent the process from creating a new application context.

**Rationale:** Native-class performance is not useful if installation, recovery, security, privacy, or release evidence remains prototype-grade.

## P1 — `0.2.0`

### Epic P1-A — International text and advanced editing

**Priority:** P1

- **P1-A01:** Text display, navigation, selection, hit-testing, and editing must support bidirectional and right-to-left text.
- **P1-A02:** Text editing must support multiple cursors and selections.
- **P1-A03:** Text editing must support folding.
- **P1-A04:** Text editing must support syntax-aware indentation.
- **P1-A05:** A Developer must be able to connect language-intelligence data to editor Components through a public contract.

**Rationale:** These capabilities broaden editor and international usage after the initial text substrate is proven.

### Epic P1-B — Visual surfaces and richer media

**Priority:** P1

- **P1-B01:** A Developer must be able to draw styled cells through a native-backed cell Surface without writing native extensions.
- **P1-B02:** A Developer must be able to present images through one Component that selects a detected modern path or compatible fallback.

**Rationale:** Cell drawing and images enable richer visualization while preserving the no-native-burden product contract.

### Epic P1-C — Application orchestration

**Priority:** P1

- **P1-C01:** A Developer must be able to model application navigation and nested views through a shared routing contract.
- **P1-C02:** A Developer must be able to coordinate field validation, submission, and errors across a form through a shared orchestration contract.

**Rationale:** Routing and form orchestration should build on proven Commands, focus, validation, and lifecycle behavior rather than precede them.

### Epic P1-D — Advanced animation and assistive technology

**Priority:** P1

- **P1-D01:** Animations must support spring and keyframe definitions.
- **P1-D02:** The Semantic Tree and announcements must connect to supported operating-system assistive technologies.

**Rationale:** Advanced motion and assistive-technology bridges need the deterministic time and Semantic Tree foundations from `0.1.0`.

## P2 — Evidence-led expansion

### Epic P2-A — Ecosystem and tooling expansion

**Priority:** P2

- **P2-A01:** Tuvren may define a Runtime Extension contract after real packages demonstrate needs that ordinary composition cannot meet.
- **P2-A02:** Tuvren may define a Plugin ecosystem only after discovery, installation, lifecycle, permissions, compatibility, and coordinated teardown are product commitments.
- **P2-A03:** Devtools may add browser or editor inspectors, remote attachment, live editing, panel extensions, full time travel, state-preserving reload, specialized profilers, telemetry, or assisted diagnosis after local terminal-native workflows are proven.

**Rationale:** Ecosystem protocols and remote tooling create durable compatibility and security obligations. They require adoption evidence, not speculative surface area.

### Epic P2-B — Platform expansion

**Priority:** P2

- **P2-B01:** Tuvren may support additional host environments when demand and an equivalent native loading, lifecycle, testing, and performance contract are demonstrated.
- **P2-B02:** Tuvren may support additional native targets when releases can be built, installed, and tested on those targets.
- **P2-B03:** Tuvren may add a built-in remote-rendering or remote-session service only after a distinct product need is established.

**Rationale:** Platform breadth must not dilute the initial product's support and performance guarantees.
