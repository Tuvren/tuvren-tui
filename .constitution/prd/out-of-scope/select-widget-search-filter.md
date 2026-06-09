# Out of Scope: Select-Widget Search and Filter in v0

Select-widget search and filter is explicitly out of scope for the v0 capability set.

## Rationale

The core widget composition and input system is the critical path. Search and filter within a Select widget is a higher-order interaction pattern that can be layered on top once the foundation is stable. Adding it to v0 would expand scope without proportionally improving the core value proposition.

## Anti-Pattern Avoided

Do not conflate this with Epic 4 (Input & Focus), which covers keyboard navigation and selection within a Select. That capability is P0 and must remain in scope.
