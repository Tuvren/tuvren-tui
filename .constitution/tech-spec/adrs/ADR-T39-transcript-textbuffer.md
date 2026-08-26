# ADR-T39: Transcript Content Is Backed by TextBuffer Segments

- **Status:** accepted
- **Context:** `TranscriptBlock.content: String` was mutated in place by `patch_block` and cloned into render-local structures during render. This conflicted with the substrate goal that resize invalidates view projections rather than content storage.
- **Decision:** Each Transcript Block references a Text Document. Insert, stream, patch, finish, replace, collapse, expand, remove, clear, eviction, and reload operations use stable string identities and generations through the transaction codec. Rendering consumes bounded visible projections and shares the unified text path.
- **Consequences:** Transcript code does not own a competing text or width model. Application-controlled history remains outside the runtime while the Resident Projection, selection, anchors, collapse, and streaming state remain native.
