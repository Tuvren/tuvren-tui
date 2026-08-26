# Actors

## Primary actors

### Terminal application Developer

- **Operating context:** Builds interactive terminal products and knows a typed application language, but does not want to learn systems programming or terminal protocols to deliver a polished result.
- **Goals:** Reach a first render in minutes; compose dashboards, forms, inspectors, editors, consoles, and agent clients; use one coherent action, styling, testing, and lifecycle model; distribute applications without asking End Users to install native tooling.
- **Frictions:** Boilerplate-heavy lifecycle management, incomplete controls, unpredictable text or input behavior, excessive memory use, fragile native installation, and abstractions that collapse under demanding workloads.

### Integrator

- **Operating context:** Adds Tuvren to an existing command-line tool, service client, developer tool, or long-running process with its own asynchronous work and shutdown rules.
- **Goals:** Adopt a managed loop by default; use an advanced imperative embedding surface when necessary; preserve deterministic update ordering; handle application failures without corrupting the terminal; run in alternate, inline, split-footer, and headless modes.
- **Frictions:** Competing event loops, hidden global state, unsafe cleanup, blocking application work, unbounded update queues, and runtime errors that expose native implementation details.

## Secondary actors

### Component Author

- **Operating context:** Builds reusable controls, recipes, Commands, Keymaps, and application services for a team or public package ecosystem.
- **Goals:** Compose stable public Primitives; expose controlled and uncontrolled behavior; define stable styling slots; test semantics without a real terminal; publish ordinary packages without a privileged extension protocol.
- **Frictions:** Private-tree dependencies, unstable state ownership, inconsistent declarative and imperative capabilities, missing accessibility hooks, and premature Plugin contracts.

### End User

- **Operating context:** Uses a Tuvren application through a local terminal, a multiplexer, a remote shell, or a constrained compatibility environment.
- **Goals:** Receive immediate and predictable feedback; navigate every workflow by keyboard; use pointer and clipboard features when available; retain readable output and a restored terminal after exit or failure; understand state without relying on color alone.
- **Frictions:** Broken graphemes, lost focus, unstable scrolling, swallowed input, unsafe paste or clipboard behavior, inaccessible controls, visual corruption, and terminal modes left active after termination.

### Release Maintainer

- **Operating context:** Publishes the SDK and its native runtime across the supported platform matrix and must prove that each version is complete and reproducible.
- **Goals:** Produce atomic matching releases; validate installation and headless operation on every target; publish representative examples and benchmark evidence; diagnose version or platform mismatches precisely.
- **Frictions:** Cross-compilation mistaken for target validation, package drift, unverifiable performance claims, source-only success, and release gates that can be weakened to meet a date.

## Non-human actors

### Host Environment

- **Operating context:** Runs application code, schedules concurrent work, loads the built-in runtime, and can terminate or interrupt the process.
- **Goals:** Resolve one compatible release, serialize accepted UI changes, propagate cancellation, and complete cleanup under normal and abnormal shutdown.
- **Frictions:** Incompatible artifacts, reentrant mutation, direct concurrent boundary calls, leaked resources, and unclear failure categories.

### Terminal Environment

- **Operating context:** Supplies dimensions, input, output, capability responses, permissions, scrollback, and lifecycle behavior that vary by terminal and intermediary.
- **Goals:** Negotiate supported behavior, receive bounded valid output, retain a safe fallback, and return to its prior state after the application ends.
- **Frictions:** Incorrect capability assumptions, malformed or unbounded control data, partial writes, disconnects, multiplexers, permission-gated clipboard access, and ambiguous text width.
