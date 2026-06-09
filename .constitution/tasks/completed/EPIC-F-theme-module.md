# Epic F — Theme Module

**Epic Status:** SHIPPED (archived)

---

## Epic F Summary

Epic F implemented the Theme Module with style_mask bitfield tracking, theme CRUD operations, built-in dark/light themes, theme-aware style resolution in the render pipeline, and full TypeScript bindings.

## Key Capabilities Delivered

- `style_mask: u8` bitfield on VisualStyle tracking which properties were explicitly set
- `theme.rs` module with Theme struct, built-in dark (handle 1) and light (handle 2) themes
- 9 new FFI entry points for theme management
- Theme-aware style resolution algorithm (explicit → theme NodeType default → theme global default)
- TypeScript `Theme` class with full API

## Shipping Metrics

- 6 tickets completed (TASK-F1 through F6)
- 19 Story Points total
- 26 new Rust unit tests (100 total), 11 new FFI tests (65 total)

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-F1 | Add `style_mask` to VisualStyle + update style setters | Chore | 3 SP |
| TASK-F2 | Implement `theme.rs` — data model + context + built-in themes | Feature | 3 SP |
| TASK-F3 | Theme FFI — 9 new `extern "C"` entry points | Feature | 5 SP |
| TASK-F4 | Theme-aware style resolution in Style + Render Modules | Feature | 3 SP |
| TASK-F5 | TypeScript `Theme` class and FFI bindings | Feature | 2 SP |
| TASK-F6 | Theme integration tests (Rust unit + FFI) | Chore | 3 SP |

---

## Verbatim Ticket List (from Tasks.md v2.0)

### Epic F: Theme Module

> **Justification:** Per Martin Fowler (_Refactoring_): "Before you start adding a new capability to a program, look carefully at the existing structure." The TechSpec ADR-T12 introduces `style_mask` as a minimal, backwards-compatible change to `VisualStyle`. Without it, theme resolution cannot distinguish "not set" from "explicitly set to default" — a fundamental correctness requirement. Foundation before feature.

---

**[TASK-F1] Add `style_mask` to `VisualStyle` and update style setters**
- **Type:** Chore
- **Effort:** 3 SP
- **Dependencies:** None
- **Description:** Per ADR-T12. Add `pub style_mask: u8` to the `VisualStyle` struct in `style.rs`. Update `VisualStyle::default()` to initialize `style_mask: 0`. Update all four `tui_set_style_*` functions in `lib.rs` to set the corresponding mask bit after mutating the property. Bit layout: 0=fg_color, 1=bg_color, 2=border_color, 3=border_style, 4=attrs (any decoration), 5=opacity. No behavior change for v0 apps — the mask is inert until a theme is bound (F4).
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a fresh node with default VisualStyle
Then visual_style.style_mask == 0b00000000

Given a node where tui_set_style_color(handle, 0, 0x01FF0000) was called (fg_color)
Then visual_style.style_mask bit 0 is set (== 0b00000001)

Given a node where tui_set_style_color and tui_set_style_opacity were called
Then visual_style.style_mask bits 0 and 5 are set (== 0b00100001)

Given a node with style_mask set
When tui_render() is called with no theme bound
Then rendering output is identical to v0 behavior (mask is not consulted)
```

---

**[TASK-F2] Implement `theme.rs` — Theme data model, context integration, built-in themes**
- **Type:** Feature
- **Effort:** 3 SP
- **Dependencies:** None
- **Description:** Per TechSpec Section 3.3 (Theme struct) and ADR-T15. Create `native/src/theme.rs`. Define the `Theme` struct as specified. Add to `TuiContext` in `context.rs`: `themes: HashMap<u32, Theme>`, `theme_bindings: HashMap<u32, u32>`, `next_theme_handle: u32` (starts at 3). Update `tui_init()` to create built-in dark (handle 1) and light (handle 2) themes with the palettes defined in ADR-T15. Add to `types.rs`: no new enums needed (mask is a plain `u8`). Add `theme.rs` to the module tree in `lib.rs`. Implement: `create_theme()`, `destroy_theme(id)`, and the setter functions (`set_theme_color`, `set_theme_flag`, `set_theme_border`, `set_theme_opacity`) — all setting mask bits. Implement binding management: `apply_theme(theme_id, node)`, `clear_theme(node)`.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given tui_init() has been called
Then a theme with handle 1 exists with dark palette (fg=0x01E0E0E0, bg=0x011E1E2E)
And a theme with handle 2 exists with light palette (fg=0x01222222, bg=0x01F5F5F5)
And next_theme_handle == 3

Given tui_create_theme() is called
Then a new theme handle >= 3 is returned
And the new theme has mask == 0 (no defaults set yet)

Given tui_set_theme_color(theme, 0, 0x01FF0000) is called (fg_color)
Then the theme's fg_color == 0x01FF0000
And the theme's mask bit 0 is set

Given tui_destroy_theme(1) is called (built-in dark theme)
Then it returns -1 (built-in themes cannot be destroyed)

Given tui_apply_theme(theme_handle, node_handle) is called
Then theme_bindings[node_handle] == theme_handle
```

---

**[TASK-F3] Implement Theme FFI — 9 new `extern "C"` entry points**
- **Type:** Feature
- **Effort:** 5 SP
- **Dependencies:** [TASK-F1, TASK-F2]
- **Description:** Per TechSpec Section 4.15. Add 9 new `extern "C"` functions to `lib.rs`, each following the `ffi_wrap()` pattern. Functions: `tui_create_theme`, `tui_destroy_theme`, `tui_set_theme_color`, `tui_set_theme_flag`, `tui_set_theme_border`, `tui_set_theme_opacity`, `tui_apply_theme`, `tui_clear_theme`, `tui_switch_theme`. For `tui_switch_theme`: call `apply_theme(theme_id, ctx.root.unwrap_or_default())` — return -1 if no root. For `tui_apply_theme` and `tui_clear_theme`: mark the target subtree dirty after modifying `theme_bindings`. For `tui_destroy_theme`: before destroying, iterate `theme_bindings` and remove all bindings referencing the destroyed theme, then mark affected subtrees dirty.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a release build of libkraken_tui
When tui_create_theme() is called
Then it returns a handle >= 3 and != 0

Given a theme with tui_set_theme_color(theme, 1, 0x01000000) set (bg=black)
When tui_apply_theme(theme, node) is called
Then it returns 0
And theme_bindings contains node → theme

Given a node with a theme binding
When tui_clear_theme(node) is called
Then it returns 0
And the node is no longer in theme_bindings
And the node is marked dirty

Given tui_switch_theme(theme) is called with no root set
Then it returns -1
And tui_get_last_error() contains a meaningful message

Given tui_destroy_theme(theme) where theme is bound to 3 nodes
When tui_destroy_theme(theme) is called
Then it returns 0
And all 3 theme bindings are removed
And all 3 nodes are marked dirty
```

---

**[TASK-F4] Implement theme-aware style resolution in the Style Module and Render pipeline**
- **Type:** Feature
- **Effort:** 3 SP
- **Dependencies:** [TASK-F1, TASK-F2]
- **Description:** Per TechSpec ADR-T12 resolution algorithm. Add a `pub(crate) fn resolve_style(handle: u32, ctx: &TuiContext) -> VisualStyle` function to `style.rs`. Algorithm: (1) Start with the node's `visual_style`. (2) For each of the 6 style properties, if the corresponding `style_mask` bit is NOT set, walk the ancestor chain (`parent → grandparent → ...` via `tree_bindings`) to find the nearest theme binding. (3) If a theme is found and its `mask` bit IS set for that property, use the theme's value. (4) Return the merged `VisualStyle`. Update the Render Module (`render.rs`) to call `resolve_style()` for each node instead of reading `node.visual_style` directly. The performance impact is O(depth) per node per render for nodes without explicit styles — acceptable for typical TUI depths (3–10).
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a node with style_mask == 0 (no explicit styles)
And a theme bound to its parent with fg_color = 0x01FFFFFF and mask bit 0 set
When resolve_style(node) is called
Then the resolved fg_color == 0x01FFFFFF (from theme)

Given a node with fg_color = 0x01FF0000 and style_mask bit 0 set (explicitly red)
And a theme bound to its parent with fg_color = 0x01FFFFFF
When resolve_style(node) is called
Then the resolved fg_color == 0x01FF0000 (explicit wins over theme)

Given a node with no theme in any ancestor
When resolve_style(node) is called
Then the resolved style equals node.visual_style unchanged

Given a node with a theme bound to itself and a different theme on its parent
When resolve_style(node) is called
Then the nearest theme (node's own binding) is used, not the parent's
```

---

**[TASK-F5] TypeScript `Theme` class and FFI bindings**
- **Type:** Feature
- **Effort:** 2 SP
- **Dependencies:** [TASK-F3, TASK-F4]
- **Description:** Create `ts/src/theme.ts`. Define a `Theme` class that wraps the theme handle. Constructor: calls `tui_create_theme()` and stores the handle. Methods: `setColor(prop, color)`, `setFlag(prop, value)`, `setBorder(style)`, `setOpacity(value)` — each delegates to the corresponding FFI function. `apply(widget)`: calls `tui_apply_theme(this.handle, widget.handle)`. `clear(widget)`: calls `tui_clear_theme(widget.handle)`. `destroy()`: calls `tui_destroy_theme(this.handle)`. Add static constants: `Theme.DARK = 1`, `Theme.LIGHT = 2`. Add the 9 new symbol declarations to `ts/src/ffi.ts`. Export `Theme` from `ts/src/index.ts`. Update `Kraken` class in `app.ts` to add `switchTheme(theme: Theme | number)` convenience method.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given import { Theme } from "kraken-tui"
When const t = new Theme() is called
Then t.handle is a number >= 3

Given Theme.DARK
Then Theme.DARK === 1

Given const t = new Theme(); t.setColor(0, 0x01FF0000)
When t.apply(someWidget) is called
Then tui_apply_theme is called with t.handle and someWidget.handle

Given app.switchTheme(Theme.DARK) is called after tui_init
Then tui_switch_theme(1) is called
```

---

**[TASK-F6] Theme integration tests (Rust unit + FFI)**
- **Type:** Chore
- **Effort:** 3 SP
- **Dependencies:** [TASK-F4, TASK-F5]
- **Description:** Add Rust unit tests in `theme.rs` covering: (1) style_mask bits set correctly for each setter. (2) Theme mask bits set correctly for each theme setter. (3) Resolution: unset property takes theme default. (4) Resolution: set property ignores theme default. (5) Resolution: nearest ancestor wins over distant ancestor. (6) Resolution: no theme → returns node's own style unchanged. (7) Built-in theme handles exist after init. (8) Destroy removes bindings and marks dirty. Expand `ts/test-ffi.test.ts` to cover all 9 theme FFI functions with round-trip verification. Total target: ≥15 new Rust tests, ≥9 new FFI tests.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the Rust unit test suite
When cargo test --manifest-path native/Cargo.toml is run
Then all existing 70 tests still pass
And >= 15 new theme-specific tests pass
And zero test failures

Given a release build of libkraken_tui
When bun test ts/test-ffi.test.ts is run
Then all 9 theme FFI functions are tested
And theme resolution produces correct colors in rendered output
And tui_destroy_theme correctly invalidates bindings
```

---

## Brownfield Note

ADR-T12 (Theme Module) and ADR-T15 shipped under Epic F. The `Theme` struct in `native/src/theme.rs` provides `Theme.DARK` and `Theme.LIGHT` built-in themes. Theme resolution in `native/src/style.rs` applies the precedence: explicit node style > theme NodeType default > theme global default > node stored value. The TypeScript `Theme` class at `ts/src/theme.ts` exposes `new Theme()`, `Theme.DARK`, `Theme.LIGHT`, and `Tuvren.switchTheme()`.
