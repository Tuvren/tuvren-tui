# Critical path

## Version

**v10.0.0** — corresponds to the latest entry in `.constitution/tasks/changelog.md`.

## Active backlog summary

- **Total active story points:** 350 across 55 tickets. Completed and deferred work contributes 0.
  - Epic A — Runtime foundation and public SDK boundary: 44
  - Epic B — Composition, layout, styling, and Components: 61
  - Epic C — Text, rich content, and editing: 34
  - Epic D — Interaction, Commands, accessibility, and animation: 36
  - Epic E — Virtual Collections, transient feedback, and Transcript: 32
  - Epic F — Modern terminal session and Screen Modes: 34
  - Epic G — Diagnostics, testing, devtools, and recovery: 42
  - Epic H — Performance and adoption evidence: 22
  - Epic I — Distribution, examples, OpenCode evidence, and atomic release: 45
- **Critical path (111 points):**
  1. `TUI-A001`
  2. `TUI-A002`
  3. `TUI-A003`
  4. `TUI-A004`
  5. `TUI-A005`
  6. `TUI-A006`
  7. `TUI-F001`
  8. `TUI-F002`
  9. `TUI-D002`
  10. `TUI-D005`
  11. `TUI-G003`
  12. `TUI-G004`
  13. `TUI-I004`
  14. `TUI-I005`
  15. `TUI-H004`
  16. `TUI-I006`
  17. `TUI-I007`

The path is the longest effort-weighted chain under the declared dependencies. Tickets whose prerequisites are satisfied may execute in parallel; the one-work-item execution workflow still reviews and integrates their milestone commits independently.

## Planning assumptions

- This is a Brownfield replacement plan for the realigned PRD v3.0.0, Architecture v4.0.0, and TechSpec v9.0.0. It supersedes the prior Plugin-era active Epics U–Z instead of preserving incompatible work as active.
- `.constitution/tasks/completed/` remains historical continuity and was listed, not read or modified. Superseded active files are removed rather than moved into completed history because they were plans, not delivered scope.
- The current source remains useful Brownfield evidence, but target paths and commands follow Stage 3. TUI-A001 owns the migration to the root Bun workspace and repairs the known strict TypeScript baseline.
- OD-02 is represented only by `TUI-D001` and the gated `TUI-D003`. A No-Go requires Stage 1–3 Evolution and Stage 4 replanning; it does not authorize an improvised interaction contract.
- OD-01 is represented only by `TUI-H004`. The 120/90/60 absolute tiers remain binding before and after it; comparative margins become gates only through Stage 1–3 Evolution.
- `tuvren-tui@0.1.0` is the first public release. The OpenCode client is required release evidence through an application adapter and replay fixture, never a core integration contract.
- Story points use the required Fibonacci values and describe roughly one to three focused solo-dev days per ticket. An 8-point ticket is a concentrated high-complexity slice, not an unbounded epic.

## Phasing strategy

### Active `0.1.0` scope

1. Establish the pinned build, exact contracts, explicit contexts, UI executor, typed transaction ABI, and public SDK split.
2. Build reusable native composition, layout, style, text, interaction, Collection, Transcript, terminal, animation, and diagnostic kernels behind thin SDK surfaces.
3. Complete the first-party Component catalog, accessibility semantics, testing/devtools, recovery, security, and bounded-resource behavior.
4. Prove absolute performance and adoption constraints, close OD-01/OD-02 through their required Evolution paths, package all five targets, and exercise representative examples including OpenCode.
5. Publish only after the atomic release candidate satisfies every P0 gate.

### Deferred scope

- All PRD P1 `0.2.0` capabilities: bidirectional text, multiple cursors, folding, language intelligence, public cell Surface, images, routing, form orchestration, springs/keyframes, and assistive-technology bridges.
- All P2 RuntimeExtension, Plugin ecosystem, remote devtools, additional host/target, and remote-session commitments.
- Musl/Alpine, Node compatibility, public FFI, state-preserving reload, background native authority, arbitrary terminal controls, integrated Select search, and competitor-relative hard cuts not ratified through OD-01.

## Build order diagram

Each arrow means “depends on.”

```mermaid
flowchart LR
  subgraph A["A — Runtime foundation"]
    A1[TUI-A001] --> A2[TUI-A002] --> A3[TUI-A003] --> A4[TUI-A004] --> A5[TUI-A005]
    A5 --> A6[TUI-A006]
    A5 --> A7[TUI-A007]
  end
  subgraph B["B — Composition, layout, style"]
    B1[TUI-B001] --> B2[TUI-B002]
    B1 --> B3[TUI-B003]
    B1 --> B4[TUI-B004]
    B3 --> B5[TUI-B005]
    B4 --> B5
    B5 --> B6[TUI-B006]
    B5 --> B7[TUI-B007]
    B5 --> B8[TUI-B008]
  end
  subgraph C["C — Text and editing"]
    C1[TUI-C001] --> C2[TUI-C002]
    C1 --> C3[TUI-C003]
    C2 --> C4[TUI-C004]
    C3 --> C5[TUI-C005]
    C4 --> C5
  end
  subgraph D["D — Interaction and time"]
    D1[TUI-D001] --> D3[TUI-D003]
    D2[TUI-D002] --> D3
    D2 --> D4[TUI-D004]
    D2 --> D5[TUI-D005]
    D2 --> D6[TUI-D006]
  end
  subgraph E["E — Collections and Transcript"]
    E1[TUI-E001] --> E2[TUI-E002]
    E1 --> E4[TUI-E004] --> E5[TUI-E005]
    E3[TUI-E003]
  end
  subgraph F["F — Terminal session"]
    F1[TUI-F001] --> F2[TUI-F002]
    F1 --> F3[TUI-F003]
    F1 --> F4[TUI-F004]
    F2 --> F5[TUI-F005]
    F3 --> F5
    F4 --> F5
  end
  subgraph G["G — Diagnostics and testing"]
    G1[TUI-G001] --> G2[TUI-G002] --> G3[TUI-G003] --> G4[TUI-G004]
    G1 --> G5[TUI-G005]
    G3 --> G6[TUI-G006]
    G2 --> G7[TUI-G007]
  end
  subgraph H["H — Performance evidence"]
    H1[TUI-H001] --> H2[TUI-H002] --> H3[TUI-H003]
    H2 --> H4[TUI-H004]
    H5[TUI-H005]
  end
  subgraph I["I — Distribution and release"]
    I1[TUI-I001] --> I2[TUI-I002]
    I1 --> I3[TUI-I003]
    I4[TUI-I004] --> I5[TUI-I005]
    I2 --> I6[TUI-I006]
    I3 --> I6
    I4 --> I6
    I5 --> I6
    I6 --> I7[TUI-I007]
  end

  A3 --> B1
  A5 --> B4
  A5 --> C4
  B1 --> C1
  B3 --> C3
  B8 --> C5
  A3 --> D1
  B4 --> D2
  F2 --> D2
  A5 --> D4
  B6 --> D5
  B7 --> D5
  B8 --> D5
  B3 --> D6
  B2 --> E1
  C1 --> E1
  B7 --> E2
  D4 --> E2
  B8 --> E3
  D2 --> E3
  C2 --> E4
  A5 --> E5
  A6 --> F1
  C4 --> F3
  A6 --> F4
  F3 --> C5
  A4 --> G1
  D5 --> G3
  A6 --> G5
  F5 --> G6
  A3 --> G7
  C3 --> G7
  F3 --> G7
  A4 --> H1
  C1 --> H1
  E1 --> H1
  E4 --> H1
  F4 --> H1
  G4 --> H3
  G3 --> H5
  A7 --> I1
  G4 --> I2
  G5 --> I2
  G6 --> I2
  F5 --> I3
  G7 --> I3
  B6 --> I4
  B7 --> I4
  B8 --> I4
  C5 --> I4
  D6 --> I4
  E5 --> I4
  F5 --> I4
  G4 --> I4
  D4 --> I5
  E5 --> I5
  H2 --> I5
  I5 --> H4
  I4 --> H5
  D3 --> I6
  H3 --> I6
  H4 --> I6
  H5 --> I6
```
