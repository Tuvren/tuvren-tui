# Additional native targets

- **Context:** The initial release could claim targets outside the five-target supported matrix, including lightweight C-library distributions.
- **Decision:** Deferred to P2.
- **Reason:** A supported target must install, load, initialize, render headlessly, and shut down on that target from a published artifact. Building an artifact elsewhere is not sufficient evidence.
- **Consequences:** Unsupported targets must fail with a clear diagnostic. Downstream stages must not imply support until native execution is part of the release matrix and Stage 1 expands the product contract.
