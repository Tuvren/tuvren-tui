# Epic E — Virtual Collections, transient feedback, and Transcript

Implement the shared bounded projection machinery for P0-I01–P0-J07.

#### TUI-E001 Implement the native Virtual Collection projection kernel

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B002, TUI-C001
- **Category:** Perf
- **Capabilities:** P0-I01–P0-I06
- **Scope (In-Scope Files):** `native/src/content/`, collection transaction codec, projection property tests and benchmarks
- **Scope (Out-of-Scope Files):** Component-specific data models, unbounded resident collections
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** 100,000 logical-item state fixtures pass identity, mutation, stale-result, and resident-bound invariants; TUI-H001 later measures latency
- **STOP Conditions:** STOP if visible rows or array positions become durable identities.
- **Description:** Implement stable string/number keys, synchronized ordered-key and position indexes, typed native projection descriptors rather than serialized generic items, AbortSignal-aware keyed range loading, generation-stamped insert/update/remove/move/reset, loading/empty/error states, variable heights, selection, focus, scroll and queryable visible range, cancellation, stale rejection, and count/byte eviction.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
Generated mutations, moves, resets, evictions, and range races keep map/order/position state synchronized while preserving key identity, authority, selection/focus, visible range, stale rejection, cancellation, and declared 10,000-item/32 MiB resident limits.
```

#### TUI-E002 Integrate Collection services across List, Table, Select, Menu, and palette

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-B007, TUI-D004, TUI-E001
- **Category:** Feature-Evolution
- **Capabilities:** P0-I01–P0-I08
- **Scope (In-Scope Files):** `ts/src/components/`, `ts/src/runtime/`, shared Collection conformance fixtures
- **Scope (Out-of-Scope Files):** separate loading or selection models per Component
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** all Collection-backed Components pass one shared behavior suite
- **STOP Conditions:** STOP if a Component bypasses the Collection controller or duplicates native projection state.
- **Description:** Retain generic application items in the Host Layer, enforce the exclusive static-items or Data-Source authority union and its single canonical key function, preserve Effect error/environment requirements in returned Views, render items to projected RuntimeNodes, encode typed projection descriptors, and wire incremental Streams/controllers, visible-range and focus callbacks, reload demand, controlled/local state, and shared selection semantics into every Collection-backed Component.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Identical fixtures exercise loading, empty, error, retry, mutation, variable height, selection, focus, scroll, cancellation, stale result, and cleanup across all applicable Components.
```

#### TUI-E003 Implement bounded Toast and Notification feedback

- **Type:** Feature
- **Effort:** 3
- **Dependencies:** TUI-B008, TUI-D002, TUI-D005, TUI-D006
- **Category:** Feature-Evolution
- **Capabilities:** P0-I07, P0-L03–P0-L07
- **Scope (In-Scope Files):** `ts/src/components/`, feedback queue, semantic and manual-clock fixtures
- **Scope (Out-of-Scope Files):** operating-system notifications, unbounded queues
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** feedback ordering, bounds, focus, announcements, and time behavior pass
- **STOP Conditions:** STOP if feedback steals focus or disappears without an accessible state signal.
- **Description:** Compose transient feedback over Overlay, bounded queues, Commands, Semantic announcements, and deterministic time with replacement and dismissal policies.
- **Acceptance:**
  - **Mode:** gherkin
  - **Evidence:**

```text
Given saturated feedback while another control is focused, when notices arrive, expire, replace, or are dismissed, then bounds hold, focus stays stable, order is deterministic, and semantic announcements remain available.
```

#### TUI-E004 Implement the native bounded Transcript state machine

- **Type:** Feature
- **Effort:** 8
- **Dependencies:** TUI-C002, TUI-E001
- **Category:** Perf
- **Capabilities:** P0-J01–P0-J06
- **Scope (In-Scope Files):** `native/src/content/`, Transcript transaction codec, state-machine tests and streaming benchmarks
- **Scope (Out-of-Scope Files):** durable application-history ownership, unbounded retained blocks
- **Verification Command:** `cargo test --manifest-path native/Cargo.toml --locked`
- **Expected Success Output:** 10,000-block and 100-update/second state fixtures pass operation and bounded-memory invariants; TUI-H001 later measures latency
- **STOP Conditions:** STOP if eviction removes visible, anchored, selected, or actively streaming content out of precedence.
- **Description:** Implement controlled durable and bounded-local modes, stable Block IDs, discriminated TextContent for whole-block insert/replace/reset/reload, bounded UTF-8 patch/stream edits, finish/collapse/expand/remove/clear/evict/reload, version rejection, protected eviction, and observable resident demand.
- **Acceptance:**
  - **Mode:** invariant
  - **Evidence:**

```text
State-machine and instrumentation fixtures prove every operation, stale rejection, protection precedence, observable eviction/reload, 10,000-block/64 MiB bounds, and no full-history rescan on streaming append; TUI-H001 owns release timing evidence.
```

#### TUI-E005 Ship Transcript SDK controllers and anchor-aware streaming behavior

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** TUI-A005, TUI-E004
- **Category:** Feature-Evolution
- **Capabilities:** P0-J01–P0-J07
- **Scope (In-Scope Files):** `ts/src/components/`, Transcript controller, Effect/imperative fixtures and examples
- **Scope (Out-of-Scope Files):** application storage, OpenCode-specific contracts
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release --locked && bun test ts/test-jsx.test.ts`
- **Expected Success Output:** both workflows produce identical Transcript state and viewport snapshots
- **STOP Conditions:** STOP if the SDK retains duplicate block content or shifts an End User away from their anchor.
- **Description:** Expose every versioned Transcript operation, resident range, eviction and reload Event, live-edge controls, and anchor-aware viewport behavior through thin SDK surfaces.
- **Acceptance:**
  - **Mode:** contract_test
  - **Evidence:**

```text
Controlled and local fixtures stream above and below the viewport, select and collapse Blocks, evict under pressure, reload history, reject stale patches, and preserve the End User anchor until explicit live-edge return.
```
