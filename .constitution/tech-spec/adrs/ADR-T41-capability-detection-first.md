# ADR-T41: Terminal Capabilities Are Detection-First and Gracefully Degraded

- **Status:** accepted
- **Context:** Terminal features such as Kitty keyboard progressive enhancement, OSC52 clipboard writes, OSC8 hyperlinks, color-depth queries, pixel-size reporting, and multiplexer passthrough vary by emulator, transport, and user setting.
- **Decision:** Add a `TerminalCapabilityState` owned by the Native Core and populated by the active `TerminalBackend`. Detection combines conservative built-ins, environment and multiplexer hints, and protocol probes where a feature has a reliable query. Features that cannot be confirmed must degrade to no-op or legacy behavior. OSC52 support is write-only; clipboard reads are explicitly out of scope.
- **Consequences:** Capability-sensitive behavior becomes observable through FFI and host APIs instead of hidden in backend assumptions. The backend grows a small protocol layer, but the core invariant remains intact.
