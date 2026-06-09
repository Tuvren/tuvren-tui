# Epic G — Animation Module

**Epic Status:** SHIPPED (archived)

---

## Epic G Summary

Epic G implemented the Animation Module with an interpolation engine, easing functions (Linear, EaseIn, EaseOut, EaseInOut), RGB color interpolation, animation lifecycle management, render pipeline integration, and TypeScript bindings.

## Key Capabilities Delivered

- `animation.rs` module with interpolation engine and easing functions
- `tui_animate()` and `tui_cancel_animation()` FFI entry points
- Animation advancement integrated into `tui_render()` pipeline
- TypeScript `widget.animate()` and `widget.cancelAnimation()` methods
- 12+ new Rust unit tests, 4+ new FFI tests

## Shipping Metrics

- 5 tickets completed (TASK-G1 through G5)
- 15 Story Points total

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| TASK-G1 | Implement `animation.rs` — engine + lifecycle | Feature | 5 SP |
| TASK-G2 | Animation FFI — 2 new `extern "C"` entry points | Feature | 2 SP |
| TASK-G3 | Animation advancement in `tui_render()` pipeline | Feature | 3 SP |
| TASK-G4 | TypeScript animation bindings in `ffi.ts` + `widget.ts` | Feature | 2 SP |
| TASK-G5 | Animation integration tests (Rust unit + FFI + TS) | Chore | 3 SP |

---

## Verbatim Ticket List (from Tasks.md v2.0)

### Epic G: Animation Module

> **Justification:** Per Eliyahu Goldratt (_The Goal_): "The throughput of a system is determined by its constraint." The animation engine (G1) is the constraint for the entire Epic G. Every subsequent ticket — FFI, render integration, TypeScript bindings, tests — depends on it. Per Uncle Bob (_Clean Architecture_): the interpolation math and easing functions belong in the domain (animation.rs), not scattered across the render pipeline or FFI layer.

---

**[TASK-G1] Implement `animation.rs` — interpolation engine and animation lifecycle**
- **Type:** Feature
- **Effort:** 5 SP
- **Dependencies:** [TASK-F6]
- **Description:** Per TechSpec Section 3.3 (Animation struct), ADR-T13, ADR-T14. Create `native/src/animation.rs`. Add to `types.rs`: `AnimProp` enum (Opacity=0, FgColor=1, BgColor=2, BorderColor=3) and `Easing` enum (Linear=0, EaseIn=1, EaseOut=2, EaseInOut=3). Add to `TuiContext` in `context.rs`: `animations: Vec<Animation>`, `next_anim_handle: u32` (starts at 1), `last_render_time: Option<Instant>`. Implement in `animation.rs`: `start_animation(target, property, target_bits, duration_ms, easing) -> u32` — captures current property value as start_bits, replaces any existing animation on the same (target, property) pair; `advance_animations(ctx, elapsed_ms)` — advances all active animations, applies interpolated values via style setters (setting style_mask bits), marks dirty, removes completed; `cancel_animation(ctx, anim_id)`. Implement easing functions as pure `fn ease_*( t: f32) -> f32`. Implement interpolation: f32 lerp for opacity (bit-cast), per-channel RGB lerp for color properties (non-RGB: snap at t=1.0). Implement conflict resolution: if `tui_animate()` targets a property already being animated, capture current interpolated value and replace.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given an animation from opacity 1.0 to 0.0 over 1000ms
When advance_animations(500) is called (50% elapsed)
Then the node's opacity style is approximately 0.5 (Linear) or per easing function

Given EaseIn easing at t=0.5
Then the interpolation alpha is 0.25 (t*t = 0.25, advances slowly early)

Given EaseOut easing at t=0.5
Then the interpolation alpha is 0.75 (1 - (0.5)^2 = 0.75, advances quickly early)

Given an animation on fg_color from 0x01000000 to 0x01FFFFFF over 1000ms
When advance_animations(500) is called
Then the node's fg_color is approximately 0x01808080 (RGB midpoint)

Given an animation from a non-RGB color (0x00000000) to 0x01FF0000 over 500ms
When advance_animations(250) is called (50% elapsed, before completion)
Then the property value remains at start (no RGB interpolation possible)
When advance_animations(251) is called (crossing t=1.0)
Then the property snaps to 0x01FF0000

Given two tui_animate() calls targeting the same (node, opacity) property
Then the second call replaces the first
And the second animation starts from the first animation's current value at replacement time

Given advance_animations is called after elapsed >= duration
Then the animation is removed from the registry
And the node retains the end value exactly
```

---

**[TASK-G2] Implement Animation FFI — 2 new `extern "C"` entry points**
- **Type:** Feature
- **Effort:** 2 SP
- **Dependencies:** [TASK-G1]
- **Description:** Per TechSpec Section 4.16. Add 2 new `extern "C"` functions to `lib.rs` following the `ffi_wrap()` pattern. `tui_animate(handle: u32, property: u8, target_bits: u32, duration_ms: u32, easing: u8) -> u32`: validate handle, validate property (0–3), validate easing (0–3), call `animation::start_animation()`, return animation handle (0 on error). `tui_cancel_animation(anim_handle: u32) -> i32`: call `animation::cancel_animation()`, return 0 on success, -1 if not found. Note: `tui_destroy_node()` must also be updated to call `animation::cancel_all_for_node(ctx, handle)` before removing the node.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a valid node handle
When tui_animate(handle, 0, target_bits, 500, 0) is called (opacity, linear)
Then it returns a non-zero animation handle

Given an invalid property value (e.g., 99)
When tui_animate(handle, 99, target_bits, 500, 0) is called
Then it returns 0 (error)
And tui_get_last_error() describes the invalid property

Given a valid animation handle returned by tui_animate
When tui_cancel_animation(anim_handle) is called
Then it returns 0 (success)
And the animation is no longer in ctx.animations

Given an animation handle that has already completed
When tui_cancel_animation(expired_handle) is called
Then it returns -1 (not found)
```

---

**[TASK-G3] Integrate animation advancement into the `tui_render()` pipeline**
- **Type:** Feature
- **Effort:** 3 SP
- **Dependencies:** [TASK-G1]
- **Description:** Per TechSpec Section 4.11 (updated render pipeline) and ADR-T13. Modify `tui_render()` in `lib.rs` (or the delegated render function in `render.rs`) to execute animation advancement as the first step: (1) Compute `elapsed_ms = if let Some(last) = ctx.last_render_time { now.duration_since(last).as_millis() as f32 } else { 0.0 }`. (2) Call `animation::advance_animations(&mut ctx, elapsed_ms)`. (3) Set `ctx.last_render_time = Some(now)`. (4) Proceed with the existing pipeline (theme resolution → layout → buffer → diff → I/O). Update perf counter ID 6 (`active animation count`) to return `ctx.animations.len() as u64`. Ensure `last_render_time` is initialized to `None` in `tui_init()`.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given an animation from opacity 1.0 to 0.0 over 500ms on a Text widget
When tui_render() is called (first call, 0ms elapsed)
Then the opacity in the rendered buffer is 1.0

Given tui_render() was called and 250ms have elapsed
When tui_render() is called again
Then the opacity in the rendered buffer is approximately 0.5
And the Text node is marked dirty between renders

Given tui_render() is called after the animation's duration has elapsed
Then the animation is no longer in ctx.animations
And the node's opacity is exactly the end value (0.0)

Given tui_get_perf_counter(6) is called with 3 active animations
Then it returns 3
```

---

**[TASK-G4] TypeScript animation bindings in `ffi.ts` and `widget.ts`**
- **Type:** Feature
- **Effort:** 2 SP
- **Dependencies:** [TASK-G2]
- **Description:** Add `tui_animate` and `tui_cancel_animation` symbol declarations to `ts/src/ffi.ts`. Add an `animate(options)` method to the `Widget` base class in `ts/src/widget.ts`. The `options` parameter: `{ property: "opacity" | "fgColor" | "bgColor" | "borderColor", target: number | string, duration: number, easing?: "linear" | "easeIn" | "easeOut" | "easeInOut" }`. The method maps the property name to `AnimProp` enum value. For opacity: `target` is a `number` (0.0–1.0) — perform f32 → u32 bit-cast using `Float32Array`/`Uint32Array`. For colors: `target` is a color string or number — parse via existing `style.ts` color parser. Returns the animation handle as `number`. Add `cancelAnimation(handle: number)` to Widget. Export `AnimProp` and `Easing` enum constants from `index.ts`.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a Text widget and import { Widget } from "kraken-tui"
When widget.animate({ property: "opacity", target: 0.5, duration: 300, easing: "easeOut" }) is called
Then tui_animate is called with property=0, target_bits=f32_bits(0.5), duration_ms=300, easing=2
And the return value is a non-zero animation handle

Given widget.animate({ property: "fgColor", target: "#FF0000", duration: 500 })
Then tui_animate is called with property=1, target_bits=0x01FF0000, duration_ms=500, easing=0 (default linear)

Given the animation handle h from widget.animate(...)
When widget.cancelAnimation(h) is called
Then tui_cancel_animation(h) is called
```

---

**[TASK-G5] Animation integration tests (Rust unit + FFI + TypeScript)**
- **Type:** Chore
- **Effort:** 3 SP
- **Dependencies:** [TASK-G3, TASK-G4]
- **Description:** Add Rust unit tests in `animation.rs` covering: (1) Linear interpolation at t=0, 0.25, 0.5, 0.75, 1.0. (2) EaseIn, EaseOut, EaseInOut at t=0.5 — verify expected alpha values. (3) RGB color interpolation at midpoint. (4) Non-RGB snap behavior at t<1 and t>=1. (5) Conflict replacement: second animation on same property captures in-progress value. (6) Completion: animation removed after duration elapsed, end value applied. (7) Cancellation: animation removed, property frozen at current interpolated value. (8) `tui_render()` advances animations before layout — verify via MockBackend cell inspection. Expand `ts/test-ffi.test.ts` to cover both animation FFI functions. Total target: ≥12 new Rust tests, ≥4 new FFI tests.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the Rust unit test suite
When cargo test --manifest-path native/Cargo.toml is run
Then all previous tests still pass
And >= 12 new animation-specific tests pass

Given a release build of libkraken_tui
When bun test ts/test-ffi.test.ts is run
Then tui_animate and tui_cancel_animation are exercised with round-trip assertions
And an animation that has elapsed its full duration is no longer in the registry

Given the TypeScript test suite
When bun test is run from ts/
Then widget.animate() correctly bit-casts f32 opacity to u32
And widget.animate() correctly encodes color strings
```

---

## Brownfield Note

ADR-T13 (Animation Module) and ADR-T14 (Animation Chaining) shipped under Epic G. The `Animation` struct in `native/src/animation.rs` manages animation lifecycle, easing, and target tracking. The animation system supports chaining via `chain_next` references and provides `Linear` and `EaseIn` easing variants. The TypeScript `Widget.animate()` method at `ts/src/widgets.ts` encodes opacity and color values for the FFI boundary.
