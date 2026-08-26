# Epic B — Composition, layout, styling, and Components

Build the reusable native kernels and public composition catalog for P0-B01–P0-D09.

#### TUI-B001 Rebuild RuntimeNode composition over the small Primitive inventory

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A003
- **Category:** Feature-Evolution
- **Capabilities:** P0-B01–P0-B02
- **Scope (In-Scope Files):** `native/src/composition/`, tree transaction handlers, composition property tests
- **Scope (Out-of-Scope Files):** branded native controls, public RuntimeNode IDs
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if a first-party Component requires a new native node kind before OD-01 evidence applies the promotion rule.
- **Description:** Implement stable tree identity, parent/child mutation, root replacement, state authority, dirty propagation, and cleanup for Box, Text, Input, TextArea, Scroll, Overlay, Collection, Transcript, and Split Primitives.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Property tests cover arbitrary practical depth, add/remove/reorder/update, stable identity, invalid cycles, transaction atomicity, and deterministic teardown.
```

#### TUI-B002 Implement complete Flexbox, Grid, absolute, and responsive layout

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B001
- **Category:** Feature-Evolution
- **Capabilities:** P0-C01–P0-C09
- **Scope (In-Scope Files):** `native/src/composition/`, `native/src/presentation/`, layout fixtures and goldens
- **Scope (Out-of-Scope Files):** browser block/float layout, application-managed geometry
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if Taffy 0.14 cannot represent a declared LayoutSpec field without a Stage 3 contract change.
- **Description:** Map the complete LayoutSpec to Taffy Flexbox and Grid, add absolute anchors, axis gaps, placement and spans, intrinsic and percentage dimensions, width and height responsive rules, automatic recomputation, and deterministic overflow policies.
- **Acceptance:**
  - **Mode:** visual_regression
  - **Evidence:**

```text
Goldens cover all layout modes, cell and percentage breakpoints, unsatisfied constraints, resize recomputation, nested panes, overlays, and a 300×100 reference Surface with zero unexplained geometry changes.
```

#### TUI-B003 Implement native StyleSheet and Theme resolution with provenance

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B001
- **Category:** Feature-Evolution
- **Capabilities:** P0-D01–P0-D09
- **Scope (In-Scope Files):** `native/src/composition/`, `ts/src/styling/`, style diagnostics and property tests
- **Scope (Out-of-Scope Files):** CSS selectors, unrestricted cascade, public access to private Component trees
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:** STOP if an override cannot be expressed through Theme, instance StyleSheet, named slot, or inline StyleSpec without exposing private structure.
- **Description:** Implement typed rules, state and environment conditions, ThemeTokens, ThemeRecipes, stable named slots, automatic invalidation, exact precedence, source provenance, and per-instance overrides.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Generated combinations prove the seven-level precedence order and diagnostics identify winning, overridden, and inactive declarations with source and reason.
```

#### TUI-B004 Implement Primitive wrappers and reconciliation parity

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A005, TUI-B001
- **Category:** DX
- **Capabilities:** P0-A02–P0-A03, P0-B01–P0-B02, DX-05
- **Scope (In-Scope Files):** `ts/src/jsx/`, `ts/src/imperative/`, `ts/src/runtime/`, Primitive conformance fixtures
- **Scope (Out-of-Scope Files):** duplicated mutable state in TypeScript, declarative View children in imperative constructors
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** every Primitive passes shared semantic fixtures through both workflows
- **STOP Conditions:** STOP if a wrapper needs direct host mutation outside the UI executor.
- **Description:** Implement keyed JSX reconciliation and imperative Primitive/Component wrappers over identical transactions, including failure-safe partial mount, fragment ordering, disposal, lifecycle ownership, and animation delegation.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Shared fixtures prove create, update, reorder, destroy, failure cleanup, and semantic parity with no leaked node, handler, or context.
```

#### TUI-B005 Build the form, activation, and progress Component families

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B003, TUI-B004
- **Category:** Feature-Evolution
- **Capabilities:** P0-B03, P0-B06–P0-B09
- **Scope (In-Scope Files):** `ts/src/components/`, shared Component fixtures and examples
- **Scope (Out-of-Scope Files):** native Component kinds, form orchestration beyond individual controls
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** structural shell and controlled/local authority fixtures pass
- **STOP Conditions:** STOP if any mutable property has two simultaneous authorities.
- **Description:** Compose the structural shells, public props, controlled/local state boundaries, stable slots, and native-kernel attachment points for Button, ToggleButton, Checkbox, Radio, RadioGroup, ProgressBar, Meter, and Spinner.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
A generated shell matrix proves one state authority, prop-to-transaction mapping, stable slot names, deterministic composition, update/disposal behavior, and no duplicated interaction, semantic, or animation state.
```

#### TUI-B006 Build the menu and dialog Component families

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B005
- **Category:** Feature-Evolution
- **Capabilities:** P0-B04, P0-B06–P0-B08
- **Scope (In-Scope Files):** `ts/src/components/`, composite fixtures and capability examples
- **Scope (Out-of-Scope Files):** Collection-backed selection controls, privileged package contributions, browser overlays
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** menu/dialog shell composition and authority fixtures pass
- **STOP Conditions:** STOP if a shell implements Command, focus, modal, or semantic behavior before its shared kernel exists.
- **Description:** Compose the structural shells, controlled/local open state, stable slots, and kernel attachment points for Menu, MenuItem, MenuBar, ContextMenu, Dialog, and AlertDialog.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Family tests prove state authority, deterministic private trees, stable named slots, update/disposal, and explicit attachment points without prematurely implementing Command, focus, modal, semantic, or animation behavior.
```

#### TUI-B007 Build the selection and navigation Component shells

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B005
- **Category:** Feature-Evolution
- **Capabilities:** P0-B05–P0-B08
- **Scope (In-Scope Files):** `ts/src/components/`, Select/ListBox/Tabs/CommandPalette fixtures
- **Scope (Out-of-Scope Files):** integrated Select search, duplicated Collection or Command kernels
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** each shell passes state, slot, composition, and lifecycle fixtures
- **STOP Conditions:** STOP if a shell invents data loading, selection, or Command behavior instead of delegating to the approved shared services.
- **Description:** Compose Select, ListBox, Tabs, and CommandPalette shells with controlled/local selection, stable style slots, and attachment points for the shared Collection, Command, focus, and semantic integrations.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Shell fixtures prove one authority per property, stable trees and slots, empty/error presentation hooks, cleanup, and no duplicated Collection, Command, focus, semantic, or native state.
```

#### TUI-B008 Build code, diff, Toast, and Notification shells

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-B005
- **Category:** Feature-Evolution
- **Capabilities:** P0-B05–P0-B08, P0-E08, P0-I07
- **Scope (In-Scope Files):** `ts/src/components/`, CodeView/DiffView/Toast/Notification fixtures
- **Scope (Out-of-Scope Files):** rich-text parsing internals, unbounded feedback queues
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** all four shells pass slot, state, composition, and cleanup fixtures
- **STOP Conditions:** STOP if a shell duplicates StyledText, animation, time, accessibility, or bounded-feedback behavior.
- **Description:** Compose CodeView, DiffView, Toast, and Notification shells over the canonical rich-content, Overlay, time, and semantic contracts so their later kernel integrations remain replaceable.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Shell fixtures prove controlled inputs, source and language metadata, stable slots, kernel attachment points, and deterministic teardown without duplicating rich-text, feedback, motion, or semantic state.
```

#### TUI-B009 Integrate and gate the complete Component catalog

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B006, TUI-B007, TUI-B008, TUI-C005, TUI-D002, TUI-D004, TUI-D005, TUI-D006, TUI-E002, TUI-E003, TUI-G003, TUI-I001
- **Category:** Correctness
- **Capabilities:** P0-B03–P0-B09, DX-05
- **Scope (In-Scope Files):** `ts/src/components/`, `ts/test-semantic.test.ts`, `examples/fixtures/component-package/`, packed external-package conformance fixtures
- **Scope (Out-of-Scope Files):** new native Component kinds, privileged RuntimeExtension or Plugin contracts
- **Verification Command:** `bun run test:semantic`
- **Expected Success Output:** every first-party Component and the external Component-package fixture pass the shared catalog matrix
- **STOP Conditions:** STOP if a Component duplicates a shared kernel, exposes a private tree/identity, or the ordinary external package requires unpublished entrypoints.
- **Description:** Bind structural shells to the shared interaction, Command, Collection, text, feedback, semantic, animation, and test kernels; prove stable slots and behavior; and pack/install a normal external package exporting Components, Commands, Keymaps, helpers, and application services.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Catalog-wide tests prove activation, disabled, validation, selection, focus, modal state, semantics, animation, controlled/local authority, named-slot overrides, cleanup, and declarative availability; the external package installs against packed public entrypoints and uses no privileged or private contract.
```
