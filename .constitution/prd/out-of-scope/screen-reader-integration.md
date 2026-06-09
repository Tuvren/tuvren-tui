# Out of Scope: Full Screen-Reader Integration Beyond Foundational Accessibility

Full screen-reader integration beyond foundational accessibility is deferred to v2.

## Rationale

Foundational accessibility (role, label, description metadata on TuiNode) is part of v2 scope. Full screen-reader integration — including live region announcements, focus management beyond keyboard nav, and AT-specific output — requires deeper platform integration work and user testing that is not compatible with the pre-v1 delivery timeline.

## Anti-Pattern Avoided

Epic 4 (Input & Focus) already covers keyboard-driven focus traversal. That is distinct from screen-reader output, which is tracked as a v2 commitment per the non-functional constraints.
