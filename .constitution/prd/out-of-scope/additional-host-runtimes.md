# Additional host environments

- **Context:** Tuvren could support more than one host environment in its first public release.
- **Decision:** Deferred to P2.
- **Reason:** Each host adds native loading, lifecycle, scheduling, packaging, testing, and performance obligations. The initial release must prove one excellent path before expanding the matrix.
- **Consequences:** Downstream stages must preserve a feasible adapter boundary but must not promise a second host environment without demand evidence and a PRD Evolution pass.
