# ADR-T32: TranscriptView Is a First-Class Native Workload

- **Status:** superseded by ADR-T54
- **Supersession:** Transcript remains a native-backed kernel, but v9 adds controlled and bounded-local modes, removal, eviction, reload, generations, and shared projection machinery.
- **Context:** `ScrollBox` plus `Text` was sufficient for simple overflow but could not model stable logical block identity, streaming patch paths, unread anchors, collapse state, or low-churn transcript updates for developer and agent workflows.
- **Decision:** Introduce `NodeType::Transcript`, keep transcript content as ordered logical `TranscriptBlock` records keyed by host-owned `u64` block IDs, and expose transcript-focused mutation and viewport commands through the native ABI and thin host wrappers.
- **Consequences:** Transcript-heavy apps can stream and patch content without host-side tree explosion. The transcript surface becomes a distinct native state model with its own invariants. Middle-of-history arbitrary deletion remains outside the current contract.
