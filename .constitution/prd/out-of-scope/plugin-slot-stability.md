# Out of Scope: Stable Plugin-Slot Compatibility Before v1.0 GA

Plugin-slot extensibility before command/keymap foundations and declarative integration stabilize is deferred. Stable plugin API compatibility guarantees are explicitly not offered before `v1.0` GA.

## Rationale

The framework needs real public usage data before locking in plugin API contracts. Pre-GA plugin slots (Epic T) are allowed as bounded host-layer contribution points, but their APIs are explicitly unstable until a later `v1.0` compatibility pass.

## Anti-Pattern Avoided

Do not promise plugin API stability before v1.0. Any documentation or messaging must clearly indicate pre-GA status of plugin slots.
