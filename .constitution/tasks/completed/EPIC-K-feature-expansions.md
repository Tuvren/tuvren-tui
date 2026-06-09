# Epic K — Feature Expansions (ADR-T19, ADR-T21, ADR-T22 + Choreography)

**Epic Status:** SHIPPED (archived)

---

## Epic K Summary

Epic K delivered per-NodeType theme defaults, TextArea node model with full editing semantics, position animation via render_offset, additional easing variants, and the choreography MVP for grouped animation sequencing.

## Key Capabilities Delivered

- Theme `type_defaults` data model with `HashMap<NodeType, VisualStyle>`
- Style resolution precedence: explicit > NodeType default > theme global default > node stored value
- 4 `tui_set_theme_type_*` FFI functions and TS Theme API
- TextArea node model with cursor, wrap mode, and line buffer helpers
- TextArea editing semantics (Enter, Backspace join, Up/Down cursor, bounds clamping)
- TextArea render with cursor, wrap mode, and viewport behavior
- `tui_textarea_set_cursor`, `tui_textarea_get_cursor`, `tui_textarea_get_line_count`, `tui_textarea_set_wrap` FFI + TS
- Position animation via `render_offset` (ADR-T22)
- CubicIn, CubicOut, Elastic, Bounce easing variants
- Choreography MVP with fan-in/fan-out and timeline grouping

## Shipping Metrics

- 12 tickets completed (TASK-K0 through K11)
- 39 Story Points total

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-K0 | Spike Animation Choreography Contract (TBD in TechSpec) | Spike | 2 SP |
| TASK-K1 | Add Theme `type_defaults` Data Model and Native Setters | Feature | 3 SP |
| TASK-K2 | Extend Style Resolution Precedence for Per-NodeType Defaults | Feature | 3 SP |
| TASK-K3 | Add 4 `tui_set_theme_type_*` FFI Functions and TS Theme API | Feature | 3 SP |
| TASK-K4 | Theme Inheritance Regression Tests (Native + FFI + TS) | Chore | 2 SP |
| TASK-K5 | Introduce TextArea Node Model and Internal Buffer Helpers | Feature | 3 SP |
| TASK-K6 | Implement TextArea Editing Semantics in Event Module | Feature | 5 SP |
| TASK-K7 | Render TextArea Cursor, Wrap Mode, and Viewport Behavior | Feature | 5 SP |
| TASK-K8 | Add TextArea FFI Surface and TypeScript `TextArea` Widget API | Feature | 3 SP |
| TASK-K9 | Add Position Animation via `render_offset` (ADR-T22) | Feature | 5 SP |
| TASK-K10 | Add New Easing Variants and Host Enum Support | Feature | 3 SP |
| TASK-K11 | Implement Choreography MVP + Verification Suite | Feature | 5 SP |

---

## Verbatim Ticket List (from Tasks.md v4.0)

### Epic K: Feature Expansions (ADR-T19, ADR-T21, ADR-T22 + Choreography)

**[TASK-K0] Spike Animation Choreography Contract (TBD in TechSpec)**

- **Type:** Spike
- **Effort:** Story Points: 2
- **Dependencies:** [TASK-J5]
- **Description:** Time-boxed ADR-level definition for choreography API shape (fan-in/fan-out, timeline grouping, cancellation semantics) and minimal viable FFI additions.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given choreography is marked as TBD in the specification
When the spike completes
Then a written contract defines function signatures and lifecycle semantics
And implementation tickets are unblocked without ambiguous API assumptions
```

**[TASK-K1] Add Theme `type_defaults` Data Model and Native Setters**

- **Type:** Feature
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-J5]
- **Description:** Extend `Theme` with `HashMap<NodeType, VisualStyle>` and internal mutation APIs for per-type defaults.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a theme and NodeType::Text
When a type default fg color is set
Then the theme stores that value under Text type defaults
And the corresponding mask bit is set for that type default
```

**[TASK-K2] Extend Style Resolution Precedence for Per-NodeType Defaults**

- **Type:** Feature
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-K1]
- **Description:** Implement ADR-T21 precedence: explicit node style > theme NodeType default > theme global default > node stored value.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given explicit style is unset on a Text node
And the active theme has both Text-specific and global fg defaults
When style is resolved
Then the Text-specific default wins over global default
```

**[TASK-K3] Add 4 `tui_set_theme_type_*` FFI Functions and TS Theme API**

- **Type:** Feature
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-K2]
- **Description:** Implement and expose `tui_set_theme_type_color|flag|border|opacity` end-to-end.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a Theme instance in TypeScript
When setTypeColor("Text", "fg", "#00AAFF") is called
Then tui_set_theme_type_color is invoked with correct encoded arguments
And native resolution reflects that default during render
```

**[TASK-K4] Theme Inheritance Regression Tests (Native + FFI + TS)**

- **Type:** Chore
- **Effort:** Story Points: 2
- **Dependencies:** [TASK-K3]
- **Description:** Add tests covering precedence, nearest ancestor behavior, and backward compatibility for themes without type defaults.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given an existing v1 theme without type defaults
When rendered under v2 resolver
Then visual output remains unchanged from v1 behavior
```

**[TASK-K5] Introduce TextArea Node Model and Internal Buffer Helpers**

- **Type:** Feature
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-J5]
- **Description:** Add `NodeType::TextArea`, node fields (`cursor_row`, `cursor_col`, `wrap_mode`), and robust line-buffer utility functions.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a newly created TextArea node
When queried internally
Then its cursor defaults to row 0 col 0
And wrap_mode defaults to off
```

**[TASK-K6] Implement TextArea Editing Semantics in Event Module**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-K5]
- **Description:** Handle multi-line editing behavior (Enter newline, Backspace join at col 0, Up/Down cursor movement, bounds clamping).
- **Acceptance Criteria (Gherkin):**

```gherkin
Given TextArea content "abc\ndef" and cursor at row 1 col 0
When Backspace is pressed
Then lines are joined into "abcdef"
And cursor moves to row 0 col 3
```

**[TASK-K7] Render TextArea Cursor, Wrap Mode, and Viewport Behavior**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-K6]
- **Description:** Extend Render/Scroll integration for TextArea visual behavior under soft-wrap and horizontal-scroll modes.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a narrow TextArea with wrap_mode enabled
When long content is rendered
Then visual lines wrap within widget width
And cursor remains visible at the correct rendered position
```

**[TASK-K8] Add TextArea FFI Surface and TypeScript `TextArea` Widget API**

- **Type:** Feature
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-K7]
- **Description:** Implement and expose `tui_textarea_set_cursor`, `tui_textarea_get_cursor`, `tui_textarea_get_line_count`, `tui_textarea_set_wrap` plus TS class wrappers.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given a TextArea widget in TypeScript
When setCursor(2, 4) and setWrap(true) are called
Then the corresponding FFI functions return success
And getCursor()/getLineCount() round-trip expected values
```

**[TASK-K9] Add Position Animation via `render_offset` (ADR-T22)**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-J5]
- **Description:** Add `AnimProp::PositionX/Y`, update animation advancement to write node `render_offset`, and update render path to apply offsets without touching Layout.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given an animation targeting PositionX from 0 to 10
When renders advance through the animation duration
Then visual output shifts horizontally by interpolated offsets
And computed layout dimensions remain unchanged
```

**[TASK-K10] Add New Easing Variants and Host Enum Support**

- **Type:** Feature
- **Effort:** Story Points: 3
- **Dependencies:** [TASK-K9]
- **Description:** Implement `CubicIn`, `CubicOut`, `Elastic`, and `Bounce` easing behavior natively and expose them in TS APIs.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given an animation configured with Bounce easing
When elapsed time advances from 0 to duration
Then interpolated values follow non-linear bounce behavior
And easing enum values map consistently between Rust and TypeScript
```

**[TASK-K11] Implement Choreography MVP + Verification Suite**

- **Type:** Feature
- **Effort:** Story Points: 5
- **Dependencies:** [TASK-K0, TASK-K10]
- **Description:** Implement choreography APIs agreed in spike output (fan-in/fan-out/timeline minimum) and add cancellation/order guarantees tests.
- **Acceptance Criteria (Gherkin):**

```gherkin
Given two animations in a choreography group
When the group start command is issued
Then all scheduled animations begin according to the declared timeline rules
And cancelling the group prevents unscheduled followers from starting
```

---

## Brownfield Note

ADR-T19 (TextArea), ADR-T21 (Theme Inheritance), and ADR-T22 (Position Animation) shipped under Epic K. `NodeType::TextArea` in `native/src/types.rs` provides multi-line editing with cursor, wrap mode, and line buffer. Theme `type_defaults` in `native/src/theme.rs` stores per-NodeType visual style defaults with precedence resolution. `AnimProp::PositionX/Y` in `native/src/animation.rs` writes `render_offset` on nodes for position animation without touching layout. `ChoreoGroup` and `ChoreoMember` in `native/src/animation.rs` implement the choreography MVP.
