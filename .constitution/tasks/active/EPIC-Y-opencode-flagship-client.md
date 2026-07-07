# Epic Y — OpenCode Flagship Client (FLAG)

**Epic Status:** Active

Epic Y builds the real agentic flagship in `examples/opencode-client/`
(currently an empty scaffold — audit finding TechDebt-04 and direction
suggestion 2). The client is the harshest proof workload the critical path
promises: a live agent console exercising Transcript streaming, SplitPane,
the command palette, Plugin slots, and the Effect surface on top of the
performance work from Epic V. It doubles as the end-to-end acceptance proof
for Epics U–X and the launch centerpiece for Epic Z.

---

#### FLAG-Y001 Spike: OpenCode Client Integration Contract

- **Type:** Spike
- **Effort:** 3
- **Dependencies:** SDK-X006
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - `.constitution/spikes/SPK-FLAG-Y001.md` (sole output)
- **Scope (Out-of-Scope Files):**
  - `examples/opencode-client/` (no code changes in a Spike)
- **Verification Command:** `test -s .constitution/spikes/SPK-FLAG-Y001.md && ! grep -qF '[e.g.,' .constitution/spikes/SPK-FLAG-Y001.md`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP: no production code changes are allowed inside a Spike ticket."
- **Description:** Before building, pin the integration contract: how the example talks to an OpenCode-compatible agent session (wire protocol and version, session lifecycle, streaming event shapes, interrupt semantics), what runs live versus against replay fixtures in CI, and the example's scope boundary (a flagship example, not a supported product surface). The spike verifies the current external protocol against live documentation rather than assumptions.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the spike completes
When SPK-FLAG-Y001.md is reviewed
Then the wire protocol, session lifecycle, and streaming event shapes are documented from verified current sources
And the live-versus-replay test boundary is defined
And it lists FLAG-Y002 through FLAG-Y005 as the unlocked tickets
```

---

#### FLAG-Y002 Build the Console Shell: SplitPane Layout and Streaming Transcript

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** FLAG-Y001
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - `examples/opencode-client/` (application shell, panes, Transcript wiring against a mock session)
- **Scope (Out-of-Scope Files):**
  - `ts/src/` (the client consumes the public SDK only; wrapper gaps stop the ticket)
- **Verification Command:** `bun run examples/opencode-client/main.ts` (audit mode) and `bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if the shell needs any internal import; a public-surface gap here is a defect against SDK-X006's gate and must be reported, not worked around."
- **Description:** Build the client shell on the public SDK: SplitPane layout (session Transcript, input area, side panel), a Transcript wired to a mock streaming session producing realistic block volume, and keyboard-driven focus traversal between panes. The run entry point is pinned as `examples/opencode-client/main.ts` (a planning decision, fixed regardless of the internal structure SPK-FLAG-Y001 defines), so the verification command stays stable across the epic.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the client runs against the mock session
When streamed content arrives
Then the Transcript renders blocks with anchor-correct viewport behavior under continuous streaming

Given the SplitPane layout
When the End User resizes the terminal or the pane divider
Then panes reflow correctly

Given the shell's imports
When inspected
Then only public SDK entry points are used
```

---

#### FLAG-Y003 Integrate Live Sessions: Streaming, Input, and Interrupts

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** FLAG-Y002
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - `examples/opencode-client/` (session adapter per the spike contract, input submission, interrupt handling, error/reconnect states)
- **Scope (Out-of-Scope Files):**
  - `ts/src/`, `native/src/` (no framework changes from this epic)
- **Verification Command:** `bun run verify` plus a documented manual live-session check per the spike's boundary
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if the live protocol diverges from SPK-FLAG-Y001; update the spike report first, then resume."
- **Description:** Replace the mock with the real session adapter from the spike contract: stream agent output into Transcript blocks (including rich text for code), submit End User input, handle interrupts, and present connection failures through visible client states rather than crashes.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a live agent session
When the agent streams output including code blocks
Then blocks render with rich text formatting as they arrive

Given the End User submits input or interrupts a running response
When the adapter forwards the action
Then the session responds and the Transcript reflects the state change

Given the session drops
When the client detects it
Then a visible error state appears and the terminal remains usable
```

---

#### FLAG-Y004 Wire Commands, Keymaps, Palette, and Plugin Contributions Into the Client

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** FLAG-Y003
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - `examples/opencode-client/` (Command definitions, Keymaps, palette, at least one Plugin contributing a Command through the extension slots)
- **Scope (Out-of-Scope Files):**
  - `ts/src/extensions.ts` (the subscription primitive shipped in ARCH-W006)
- **Verification Command:** `bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if wiring reveals a slot-contract gap ARCH-W006 did not cover; report it rather than patching the framework from inside an example."
- **Description:** Make the client a real showcase of the interaction stack: session Commands (new session, cancel, copy last response) bound to Keymaps and discoverable through the command palette, plus one Plugin contributing an additional Command end-to-end through the extension slots.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the client is running
When the End User opens the command palette
Then session Commands and the Plugin-contributed Command are listed and executable

Given a Keymap-bound Command
When its key sequence is pressed
Then the Command executes with focus-aware dispatch
```

---

#### FLAG-Y005 Add Replay Fixtures, Tests, and Flagship Documentation

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** FLAG-Y004
- **Category:** Docs
- **Scope (In-Scope Files):**
  - `examples/fixtures/` (recorded session replays)
  - `ts/test-examples.test.ts` (client replay coverage)
  - `README.md` and examples documentation (flagship positioning)
- **Scope (Out-of-Scope Files):**
  - Publish messaging (Epic Z territory)
- **Verification Command:** `bun test ts/test-examples.test.ts && bun run verify`
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if replay determinism cannot be achieved for a scenario; record the flaky scenario and exclude it explicitly instead of shipping nondeterministic CI."
- **Description:** Freeze the client into the verification surface: recorded replay fixtures drive headless CI runs per the spike's live-versus-replay boundary, and documentation positions the client as the flagship example alongside the existing three.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given recorded session fixtures
When the example replay suite runs in CI
Then the client renders deterministically against its fixtures

Given a Developer reads the repository documentation
When they look for the flagship demonstration
Then the client is documented with run instructions and its scope boundary
```
