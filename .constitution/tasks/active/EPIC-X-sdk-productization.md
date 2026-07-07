# Epic X — SDK Productization / Expert-Level DX (SDK)

**Epic Status:** Active

Epic X carries the original productization mandate (PRD Epic 14, ADR-T47)
forward onto the hardened, consolidated base delivered by Epics U–W. The
former SDK-U001 audit spike is satisfied by the pre-GA deep audit report
(`.constitution/reports/audit-2026-07-07-161112-pre-ga-deep-audit.md`) plus
the wrapper-gap log produced by ARCH-W005.

---

#### SDK-X001 Add Handle-Safe Event and Focus Ergonomics

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** ARCH-W001
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - `ts/src/` public event/focus surface
  - `ts/test-commands.test.ts` / focused new host tests
- **Scope (Out-of-Scope Files):**
  - `native/src/event.rs` (native routing unchanged; ergonomics are host-side)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if handle-safe references require a new native identity concept; Handles remain the native identity per the glossary."
- **Description:** PRD Epic 14: ordinary Event and focus handling should not require numeric Handle comparison. Provide public helpers or references so a Developer identifies target Widgets through the SDK happy path, with raw Handle plumbing needed only for advanced internals.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given an application handles Events or focus
When it uses the public SDK happy path
Then it identifies target Widgets through handle-safe references or helpers
And raw numeric Handle plumbing is only needed for advanced internals
```

---

#### SDK-X002 Close Wrapper Gaps Including the Four Orphaned Native Bindings

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** ARCH-W005
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - `ts/src/ffi.ts` (bind `tui_scroll_set_scrollbar_side`, `tui_scroll_set_scrollbar_width`, `tui_scroll_set_show_scrollbar`, `tui_set_z_index`)
  - `ts/src/` public wrappers (ScrollBox options, overlay z-index prop, plus the gap list logged by ARCH-W005)
  - Focused host tests
- **Scope (Out-of-Scope Files):**
  - `native/src/lib.rs` (the native halves already exist and are tested)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if a logged gap requires a new native symbol rather than a wrapper; route it through a TechSpec section 4 pass instead of adding ad-hoc ABI."
- **Description:** Audit direction suggestion 3 plus the ARCH-W005 gap log: four native functions are implemented and tested natively but unreachable from the host, and examples surfaced further routine-state wrapper gaps. Bind and wrap them so examples need no direct FFI for routine Widget state.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the four orphaned native functions
When a Developer configures scrollbar side, width, visibility, or overlay stacking
Then public SDK options exist without direct FFI calls

Given the wrapper-gap list from the examples rebase
When Epic X completes
Then each gap is closed or explicitly documented as advanced-only
```

---

#### SDK-X003 Improve App, Widget, Theme, Effect, and Plugin Lifecycle Ergonomics

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** SDK-X001, SDK-X002
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - `ts/src/` lifecycle and disposal surfaces across app, Widgets, Themes, Effect scopes, and Plugins
  - Focused host tests
- **Scope (Out-of-Scope Files):**
  - `native/src/context.rs` (native lifecycle fixed by SAFE-U003)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if a lifecycle helper would require the Native Core to call back into the Host Layer; control flow stays unidirectional."
- **Description:** Original Epic U mandate (ADR-T47): cleanup and lifecycle APIs across every public surface should dispose resources predictably on normal exit and error paths, with a documented preferred pattern per surface.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given an application creates SDK resources
When it exits normally or through an error path
Then cleanup helpers dispose resources predictably
And docs show the preferred lifecycle pattern for each public surface
```

---

#### SDK-X004 Rework Imperative, JSX, Effect, and Plugin Examples

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** SDK-X003, ARCH-W006
- **Category:** DX
- **Scope (In-Scope Files):**
  - `examples/` (per-style happy-path examples)
  - `ts/test-examples.test.ts`
- **Scope (Out-of-Scope Files):**
  - `examples/opencode-client/` (built in Epic Y)
- **Verification Command:** `bun test ts/test-examples.test.ts && bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if an example still needs internals after SDK-X002; that indicates an unclosed wrapper gap, not an example problem."
- **Description:** Original Epic U mandate: each public development style (imperative, JSX, Effect, Plugin) gets a clear, polished happy path on the post-W public API, avoiding internal details unless explicitly labeled advanced.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Developer evaluates Tuvren examples
When they inspect imperative, JSX, Effect, and Plugin examples
Then each demonstrates the recommended public SDK path
And internal implementation details appear only under explicit advanced labels
```

---

#### SDK-X005 Polish Diagnostics, Devtools, and Error Guidance

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** SDK-X003, ARCH-W007
- **Category:** DX
- **Scope (In-Scope Files):**
  - `ts/src/` error message surfaces
  - Devtools and debugging documentation
- **Scope (Out-of-Scope Files):**
  - Devtools panel host for Plugin contributions (deferred; Future scope)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if improving a diagnostic requires new native symbols; log for a TechSpec pass."
- **Description:** Original Epic U mandate: common SDK errors (resolver failures, lifecycle mistakes, Command/Plugin failures) explain cause, remediation, and the relevant public API; devtools documentation points to the maintained inspection path.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Developer hits a common SDK error
When the error or diagnostic is shown
Then it explains the likely cause, remediation, and relevant public API
And devtools documentation points to the maintained inspection path
```

---

#### SDK-X006 Run the SDK Productization Gate and Docs Review

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** SDK-X004, SDK-X005, ARCH-W012, ARCH-W013
- **Category:** DX
- **Scope (In-Scope Files):**
  - `.constitution/reports/GatePolicy.md` (record the gate)
  - `ts/check-bundle.ts` budget confirmation
- **Scope (Out-of-Scope Files):**
  - Package manifests (Epic Z territory)
- **Verification Command:** `bun run verify && bun run ts/check-bundle.ts`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if any gate dimension (examples, docs, wrappers, lifecycle, diagnostics, bundle budget) is red; the flagship epic and the publish epic must not begin against a red gate."
- **Description:** ADR-T47's release-readiness gate: review public examples, docs, wrapper coverage, lifecycle guidance, diagnostics, and the bundle budget as a formal checkpoint. Epic Y (flagship) and Epic Z (publish) are gated on this ticket.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given Epics U through X are complete
When the SDK productization gate runs
Then examples, docs, wrapper coverage, lifecycle guidance, diagnostics, and bundle budget are each reviewed and recorded
And Epic Y and Epic Z remain blocked until the gate is green
```
