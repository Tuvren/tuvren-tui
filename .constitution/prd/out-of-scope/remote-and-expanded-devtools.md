# Remote and expanded devtools

- **Context:** Devtools could include browser or editor inspectors, remote attachment, live style editing, extension panels, full time travel, state-preserving reload, specialized profilers, telemetry, or assisted diagnosis.
- **Decision:** Deferred to P2.
- **Reason:** The initial adoption problem is local and terminal-native: inspect, record, replay, and prove. Additional surfaces add transport, privacy, compatibility, and maintenance obligations before the Diagnostic Graph and Trace are proven.
- **Consequences:** P0 downstream work must deliver the local Inspect, Timeline, Issues, trace, replay, testing, and diagnostic command contract first. Expanded tooling requires usage evidence and a PRD Evolution pass.
