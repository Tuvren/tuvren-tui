# Epic U — SDK Productization / Expert-Level DX (SDK)

**Epic Status:** Active

---

## SDK-U001: Audit SDK DX and Public Surface Gaps

- **Type:** Spike
- **Effort:** 3
- **Dependencies:** Epic T shipped
- **Capability / Contract Mapping:** PRD §4 Epic 14, TechSpec ADR-T47 and §4.7
- **Description:** Audit imperative, JSX, Effect, plugin, composite, example, and devtools surfaces for raw handle, FFI, lifecycle, documentation, and wrapper gaps.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the SDK surfaces after Epic T
When the audit completes
Then every routine raw FFI or numeric Handle dependency in examples and docs is classified
And the Epic U implementation tickets have a prioritized gap list
```

---

## SDK-U002: Add Handle-Safe Event and Focus Ergonomics

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** SDK-U001
- **Capability / Contract Mapping:** TechSpec §4.7
- **Description:** Add public ergonomics so ordinary event and focus handling can avoid numeric Handle comparison.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given an application handles events or focus
When it uses the public SDK happy path
Then it can identify target widgets through handle-safe references or helpers
And raw numeric Handle plumbing is only needed for advanced internals
```

---

## SDK-U003: Close Wrapper Gaps and Remove Example FFI Dependence

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** SDK-U001
- **Capability / Contract Mapping:** TechSpec §4.7
- **Description:** Add missing public wrappers where examples currently reach into `ffi.*` for routine widget state.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the public examples build real TUI workflows
When they need ordinary widget values or state
Then they use public SDK wrappers rather than direct ffi calls
And any remaining direct ffi usage is isolated as advanced/internal demonstration code
```

---

## SDK-U004: Improve App, Widget, Theme, and Plugin Lifecycle Ergonomics

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** SDK-U002, SDK-U003
- **Capability / Contract Mapping:** TechSpec ADR-T47
- **Description:** Improve cleanup and lifecycle APIs across apps, widgets, themes, Effect scopes, and extensions.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given an application creates SDK resources
When it exits normally or through an error path
Then cleanup helpers dispose resources predictably
And docs show the preferred lifecycle pattern for each public surface
```

---

## SDK-U005: Rework Imperative, JSX, Effect, and Plugin Examples

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** SDK-U004
- **Capability / Contract Mapping:** PRD §5 Adoption constraints
- **Description:** Rework examples so each public development style has a clear, polished happy path.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Developer evaluates Tuvren examples
When they inspect imperative, JSX, Effect, and plugin examples
Then each example demonstrates the recommended public SDK path
And examples avoid internal implementation details unless explicitly labeled advanced
```

---

## SDK-U006: Polish Diagnostics, Devtools, and Error Guidance

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** SDK-U004
- **Capability / Contract Mapping:** Architecture §5.3, TechSpec §4.7
- **Description:** Improve diagnostics and docs for resolver errors, lifecycle mistakes, command/plugin failures, devtools inspection, and debugging.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Developer hits a common SDK error
When the error or diagnostic is shown
Then it explains the likely cause, remediation, and relevant public API
And devtools documentation points to the maintained inspection path
```

---

## SDK-U007: Add SDK Productization Gate and Docs Review

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** SDK-U005, SDK-U006
- **Capability / Contract Mapping:** TechSpec ADR-T47, reports/GatePolicy.md
- **Description:** Add a release-readiness gate for expert-level SDK DX before npm publish.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given Epic U is complete
When the SDK productization gate runs
Then public examples, docs, wrapper coverage, lifecycle guidance, diagnostics, and bundle budget are reviewed
And Epic V cannot begin until the gate is green
```
