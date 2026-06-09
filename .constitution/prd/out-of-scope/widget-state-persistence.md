# Out of Scope: Widget State Persistence

Widget state persistence through serialization and deserialization of the Composition Tree is out of scope.

## Rationale

The canonical runtime model is in-memory, single-process. Persisting and restoring widget trees introduces complex concerns around handle stability, event queue state, focus state, and scroll position that are not yet resolved. The first priority is making the in-memory model solid before adding persistence surface area.

## Anti-Pattern Avoided

This is not the same as the transcript persistence discussed in Epic 5 and the transcript substrate. Transcript state is managed natively and has its own state model; general widget tree serialization is a separate, larger problem.
