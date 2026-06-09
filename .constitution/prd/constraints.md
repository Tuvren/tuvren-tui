# Constraints

## 1. Non-Functional Constraints

Stated in concrete, measurable quality attributes.

---

| Constraint Area | Requirement | Measurement | Rationale |
| :--- | :--- | :--- | :--- |
| **Performance** | Memory stays below 20MB for a composition of 100 Widgets. | Resident set size under benchmark fixture | Supports constrained environments such as CI runners, containers, and remote servers. |
| **Performance** | Input latency stays below 50ms from keystroke to Surface update. | End-to-end event-to-render latency | Keeps interaction below the threshold where terminal UIs feel sluggish. |
| **Performance** | A Render Pass stays below 16ms when operating within the intended workload envelope. | Render pass wall-clock time | Preserves 60fps-capable responsiveness for real-time dashboards and streaming workflows. |
| **Performance** | Foreign-function overhead stays below 1ms per cross-boundary call. | FFI call latency benchmark | Ensures the language boundary does not become the bottleneck. |
| **Operability** | The host-language package stays below 100KB. | Bundle size check | Keeps the TypeScript layer intentionally thin so the value remains in the Native Core. |
| **Operability** | Supported public releases install and load on the supported glibc-based Linux, macOS, and Windows targets without requiring a local source build in the ordinary path. | Cross-platform install smoke tests | Productized adoption depends on a trustworthy install path, not just a strong source-checkout story. |
| **Operability** | Every supported public release target in the published matrix receives install and load smoke verification before the productization wave is considered complete. | CI smoke matrix | Cross-platform credibility is part of the framework promise, not an optional afterthought. |
| **Adoption** | Time to Hello World stays below 15 minutes for a competent TypeScript Developer. | First-run guided onboarding benchmark | Reinforces the primary JTBD: shipping faster. |
| **Adoption** | The public story must be understandable as a general-purpose framework without hiding the demanding agentic/operator workloads that prove the design under stress. | Narrative review | The framework needs broad appeal without losing the concrete workload that justifies its deeper architecture. |
| **Adoption** | Ordinary SDK workflows do not require Developers to reach for raw FFI or numeric Handle plumbing. | SDK surface audit | Expert-level DX is required before the first public npm release can represent the framework credibly. |
| **Stability** | Semantic versioning guarantees begin at public v1.0 GA; pre-GA releases may include breaking changes. | Version policy documentation | Sets realistic trust expectations for open source adoption. |
| **Contributor Experience** | Module boundaries, architecture decisions, and build environment remain understandable and reproducible. | Onboarding review | Makes contribution and long-term maintenance realistic. |
| **Accessibility** | Accessibility is not a v0/v1 hard constraint and is tracked as a v2 commitment. | Roadmap note | Keeps MVP scope disciplined while preserving accessibility as a real product requirement. |
