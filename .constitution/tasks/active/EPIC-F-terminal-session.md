# Epic F — Modern terminal session and Screen Modes

Deliver detection-first modern-terminal behavior and a safe compatible tier for P0-K01–P0-K16.

#### TUI-F001 Implement the Terminal Session state machine and capability profiles

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A006
- **Category:** Correctness
- **Capabilities:** P0-K01–P0-K03, P0-K08, P0-K12, P0-K15
- **Scope (In-Scope Files):** `native/src/terminal/`, Terminal Profile codec, capability fixtures
- **Scope (Out-of-Scope Files):** terminal-name allowlists, built-in remote sessions
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** modern, compatible, remote-shell, and multiplexer profiles pass independently
- **STOP Conditions:** STOP if one unavailable capability demotes unrelated supported behavior or response bytes leak into input Events.
- **Description:** Implement negotiation, detection-first capability state, modern and compatible tiers, color/palette/theme/geometry/width results, per-capability degradation, bounded pending requests, correlation, and restoration states.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Profile tests cover success, absence, partial responses, tmux/zellij/screen passthrough, timeout, malformed response, disconnect, and response/input separation.
```

#### TUI-F002 Implement enhanced keyboard, pointer, focus, paste, and resize decoders

- **Type:** Security
- **Effort:** 5
- **Dependencies:** TUI-F001
- **Category:** Security
- **Capabilities:** P0-G01, P0-K02–P0-K03, P0-K15
- **Scope (In-Scope Files):** `native/src/terminal/`, `native/src/interaction/`, protocol fuzz targets and fixtures
- **Scope (Out-of-Scope Files):** application Event handlers, terminal-name inference
- **Verification Command:** `cargo fuzz run terminal_response`
- **Expected Success Output:** maintained corpus has no crash, control injection, unbounded allocation, or response/input confusion
- **STOP Conditions:** STOP if a partial or ambiguous sequence cannot be resolved within documented bounds.
- **Description:** Decode Kitty-level keyboard events, repetition and release, text, pointer, focus, bounded paste, and resize while preserving compatible fallbacks and strict response channel ownership.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Protocol fixtures and fuzzing prove exact normalized Events, partial-read recovery, size and timeout limits, multiplexer behavior, and zero terminal responses emitted as keyboard input.
```

#### TUI-F003 Implement permission-aware rich clipboard requests and text fallback

- **Type:** Security
- **Effort:** 8
- **Dependencies:** TUI-C004, TUI-F001
- **Category:** Security
- **Capabilities:** P0-F09, P0-K04–P0-K06, P0-K13–P0-K15
- **Scope (In-Scope Files):** `native/src/terminal/`, clipboard transaction/Event codec, SDK terminal services and security tests
- **Scope (Out-of-Scope Files):** clipboard polling, image presentation, raw clipboard tracing
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** read/write/fallback/status fixtures pass with bounded request storage
- **STOP Conditions:** STOP if a read can start without an explicit application request or content can enter default diagnostics.
- **Description:** Implement clipboard and primary selection, media discovery, bounded binary chunks, typed correlated statuses, OSC-compatible paths, richer Kitty-level behavior where available, paste Events, text convenience, timeout, validation, and fallback.
- **Acceptance:**
  - **Mode:** gherkin
  - **Evidence:**

```text
Given available, denied, busy, malformed, timed-out, compatible-only, and rich-capability profiles, when explicit reads/writes occur, then the exact status, media bytes, bounds, correlation, fallback, and privacy rules hold.
```

#### TUI-F004 Implement alternate, inline, split-footer, headless, and external-output policy

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-A006, TUI-F001
- **Category:** Feature-Evolution
- **Capabilities:** P0-K07–P0-K12, P0-K16, REL-01
- **Scope (In-Scope Files):** `native/src/terminal/`, `ts/src/runtime/`, Screen Mode and pseudo-terminal fixtures
- **Scope (Out-of-Scope Files):** default global output capture, remote-rendering service
- **Verification Command:** `bun test ts/test-runner.test.ts`
- **Expected Success Output:** all mode/output combinations restore deterministically
- **STOP Conditions:** STOP if inline or split-footer output corrupts scrollback or suspend/resume loses negotiated state without revalidation.
- **Description:** Implement four Screen Modes, capture/scrollback/passthrough/disabled external output, opt-in global capture, sanitized captured formatting, deterministic suspend/resume, and disconnect cleanup.
- **Acceptance:**
  - **Mode:** hitl_sil
  - **Evidence:**

```text
Automated pseudo-terminal logs plus representative real-terminal probes show correct screen ownership, scrollback, external output, suspend/resume, restoration, and clean disconnect for each interactive mode.
```

#### TUI-F005 Gate the complete terminal and restoration matrix

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** TUI-F002, TUI-F003, TUI-F004
- **Category:** Correctness
- **Capabilities:** P0-K01–P0-K16, REL-01, SAFE-01
- **Scope (In-Scope Files):** `ts/test-terminal.test.ts`, terminal profiles, CI terminal jobs and reports
- **Scope (Out-of-Scope Files):** unsupported terminals as product targets
- **Verification Command:** `bun run test:terminal`
- **Expected Success Output:** `exit 0` across the declared automated and hardware matrix
- **STOP Conditions:** STOP release progression on any reproducible stranded terminal mode, missing correlation, unsafe fallback, or profile-specific input leak.
- **Description:** Consolidate protocol, Screen Mode, external-output, multiplexer, clipboard, fault, suspend/resume, restoration, and disconnect evidence into one release-gating suite.
- **Acceptance:**
  - **Mode:** hitl_sil
  - **Evidence:**

```text
The matrix records profile and terminal versions and passes every required state transition; skipped modern capabilities are explicit per profile and never silently counted as success.
```
