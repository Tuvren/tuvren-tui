# Declarative framework-adapter parity

- **Context:** Tuvren could offer several equal first-party declarative adapters modeled after unrelated UI ecosystems.
- **Decision:** Rejected for the current roadmap.
- **Reason:** One preferred declarative model and one complete imperative model provide a coherent lifecycle, error, concurrency, testing, and documentation story. Adapter breadth would divide effort and encourage competing programming models.
- **Consequences:** Downstream stages must not add first-party adapter parity or expose the private reactive mechanism. A third-party package may compose public imperative contracts without becoming an endorsed SDK surface.
