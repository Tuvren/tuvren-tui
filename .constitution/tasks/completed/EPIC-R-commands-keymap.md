# Epic R — Commands & Keymap Foundations (CMD)

**Epic Status:** SHIPPED (archived)

---

## Epic R Summary

Epic R added `CommandRegistry` (typed command definitions, disposable registration, programmatic execution, `when` predicates), `KeymapRegistry` (key string normalization for `[modifier+]*key` syntax, `when` predicates, first-registered-wins resolution), and `CommandDispatcher` (bridges registry + keymap into the event drain; focus context read from `app.getFocused()`). The `CommandPalette` composite was rebased to consume a `CommandRegistry`. A `commandDispatcher` option was added to both `app.run()` and `createLoop()`.

## Shipping Metrics

- 46 focused tests in `ts/test-commands.test.ts`
- All 433 host tests pass
- Bundle at 72.2 KB under 75 KB budget

## Tickets Completed

| ID | Description | Type | Effort |
| --- | :--- | :--- | :--- |
| CMD-R001 | CommandRegistry with typed definitions and disposal | Feature | 5 |
| CMD-R002 | KeymapRegistry with key normalization and predicates | Feature | 5 |
| CMD-R003 | CommandDispatcher bridging registry into event drain | Feature | 5 |
| CMD-R004 | CommandPalette rebased to consume registry | Feature | 3 |
| CMD-R005 | commandDispatcher option in app.run() and createLoop() | Feature | 3 |
| CMD-R006 | Command and keybinding adoption across examples | Chore | 3 |
