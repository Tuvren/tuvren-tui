# Out of Scope: React or Solid Parity

React or Solid parity as the public declarative strategy for the current roadmap is explicitly not a goal.

## Rationale

The imperative core is canonical. The strategic declarative path is `Effect` via `tuvren-tui/effect`, not framework-adapter breadth for React or Solid. The product explicitly rejects React/Solid parity as the main declarative roadmap per the operator preferences recorded in `vision.md`.

## Anti-Pattern Avoided

Do not add React integration layers, Solid adapters, or similar framework-bridge patterns. The Effect path is the sanctioned declarative integration; everything else is anti-scope.
