# Actors

## 1. Primary Actor

### The General-Purpose Terminal Application Builder

- **Role:** The General-Purpose Terminal Application Builder
- **Operating Context:** Comfortable with TypeScript and terminal tooling, but unwilling to spend weeks learning a new paradigm or a systems language just to ship terminal applications with professional polish.
- **Goals:**
  - Build dashboards, inspectors, prompts, editors, and operator surfaces quickly
  - Rely on strong defaults
  - Reach a meaningful first application shape fast
  - Trust the install and release path enough to recommend the framework to others
- **Frictions:**
  - Boilerplate-heavy frameworks
  - Missing defaults
  - Memory-heavy React-style solutions
  - Unproductized install flows
  - Any approach that makes the first real interface take more than roughly 30 minutes
- **Current Workarounds:** Cobbled-together ANSI escape sequences, Ink with growing memory concerns, or leaving the terminal for a web dashboard that breaks the workflow.

---

## 2. Secondary Actor

### The Agentic Product Builder

- **Role:** The Agentic Product Builder
- **Operating Context:** Building assistants, operator consoles, repo tooling, or other long-lived terminal products where streaming output, dense panes, and stable viewports are not edge cases but the product's normal workload.
- **Goals:**
  - Reuse the same framework for demanding agentic and developer-facing products
  - Maintain viewport stability, inspectability, and performance under continuous updates
- **Frictions:**
  - Host-side tree explosion
  - Fragile viewport behavior under streaming churn
  - Weak diagnostics
  - Framework stories that sound general-purpose but break down under real operator workloads

---

## 3. Tertiary Actor

### The Bun Ecosystem Native

- **Role:** The Bun Ecosystem Native
- **Operating Context:** Already committed to Bun and wants tools that feel native to the runtime rather than ported from a Node.js or browser-first worldview.
- **Goals:**
  - Use a zero- or near-zero-dependency terminal UI framework
  - Integrate cleanly with Bun's foreign-function model
- **Frictions:**
  - WASM layers
  - Compatibility shims
  - Polyfill-heavy stacks
  - Tools that feel architecturally foreign to Bun
