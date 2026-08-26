# Built-in remote session hosting

- **Context:** The library could own remote connectivity, session transport, or server-side terminal rendering.
- **Decision:** Deferred to P2 pending a distinct product need.
- **Reason:** Tuvren applications already need to run correctly inside remote shells and multiplexers. Owning remote sessions would create a separate networking, authentication, authorization, recovery, and operations product.
- **Consequences:** P0 must support remote execution environments but must not expose a built-in remote-rendering or session-server contract.
