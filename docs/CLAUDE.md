# AI Agent Instruction Manual: Documentation Layer Guide

> **System Context:** This repository uses a four-stage planning chain under `.constitution/`. The canonical documents live in modular files under that directory — not as flat files in `docs/`.

## The 4-Stage Constitution Chain

1. **`.constitution/prd/`** — conceptual product layer: problem, actors, glossary, capabilities, constraints, and scope boundaries
2. **`.constitution/architecture/`** — logical system layer: containers, flows, resilience, and risks
3. **`.constitution/tech-spec/`** — physical implementation layer: stack, ADRs, state model, interfaces, structure, and verification contract
4. **`.constitution/tasks/`** — execution layer: active critical path, current tasks, and archived completed work

**Authority flow:** PRD -> Architecture -> TechSpec -> Tasks

---

## Documentation Routing Table

| If you need to know... | Target File | Specific Section |
| --- | --- | --- |
| What product and scope Tuvren serves | `.constitution/prd/vision.md` | Executive Summary, Capabilities, Boundary Analysis |
| Which term should be used consistently | `.constitution/prd/glossary.md` | Ubiquitous Language |
| What the logical boundaries are | `.constitution/architecture/strategy.md` | Architectural Strategy, System Containers, Critical Execution Flows |
| What concrete interfaces, state, and tests exist | `.constitution/tech-spec/stack.md` | Stack, State & Data Modeling, Interface Contract, Implementation Guidelines |
| What should happen next | `.constitution/tasks/critical-path.md` | Active Critical Path, Ticket List |
| What was already delivered in the previous wave | `.constitution/tasks/completed/` | Archived epic summaries |
| How CI and release gates currently work | `.constitution/reports/GatePolicy.md` | all sections |

---

## Documentation Rules

1. **Respect layer boundaries.** Do not move stack or ABI detail into the PRD. Do not move product intent into TechSpec. Do not invent contracts in Tasks.
2. **Preserve continuity.** Version history, archived completed scope, operator preferences, and major historical decisions are part of the trust surface.
3. **Use current framework shape.** The canonical docs now follow the four-stage constitution skeleton; keep future revisions in that format.
4. **Treat code as Brownfield truth.** If a doc drifts from the source tree, reconcile explicitly instead of silently preserving stale future-tense language.
5. **Keep active and archived scope separate.** `.constitution/tasks/active/` should not let completed execution masquerade as the active backlog.

---

## When Revising Docs

### Product-layer change
- Start with `.constitution/prd/`
- Validate whether the requested change is really a scope change or only an implementation/architecture change

### Logical design change
- Confirm the PRD already authorizes the change
- Revise `.constitution/architecture/` before touching `.constitution/tech-spec/`

### Implementation contract change
- Confirm Architecture already authorizes it
- Revise `.constitution/tech-spec/`
- Then revise `.constitution/tasks/` if execution implications change

### Execution-plan change
- Only revise `.constitution/tasks/` once the upstream contract is already present
- Preserve archived scope if it still explains current reality

---

## Current Repo-Specific Notes

- `.constitution/tech-spec/` is a Brownfield-first implementation spec. Its Brownfield notes reflect Epic P as shipped; read them as current reality rather than future-state intent.
- `.constitution/tasks/` marks **Epic O** (Terminal Capability Hardening), **Epic P** (Tuvren Identity, Packaging, and Release Migration), **Epic Q** (Adoption and Framework Positioning), **Epic R** (Commands & Keymap Foundations), **Epic S** (Effect Declarative Integration), and **Epic T** (Plugin Slots and Extensibility) as shipped. Active scope runs through **Epic U** (SDK Productization / Expert-Level DX) and **Epic V** (First Public npm Publish and Feedback Loop). Older v7 material remains continuity context, not the active backlog.
- `.constitution/reports/GatePolicy.md` reflects the current CI host test surface, including install smoke and runner tests.
- The migration from `docs/PRD.md`, `docs/Architecture.md`, `docs/TechSpec.md`, `docs/Tasks.md` to the `.constitution/` modular structure was completed in the constitution-migration PR. The old flat docs are deleted; use the modular constitution chain for all planning and reference work.
