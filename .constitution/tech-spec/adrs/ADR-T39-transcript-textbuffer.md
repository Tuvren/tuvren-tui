# ADR-T39: Transcript Content Is Backed by TextBuffer Segments

- **Status:** accepted
- **Context:** `TranscriptBlock.content: String` was mutated in place by `patch_block` and cloned into render-local structures during render. This conflicted with the substrate goal that resize invalidates view projections rather than content storage.
- **Decision:** Each transcript block's content is owned by a `TextBuffer`. Rendering consumes a `TextView` projection per visible block. `append_block`, `patch_block`, and `finish_block` operations mutate the buffer through the substrate's mutation API and bump the corresponding epoch. `DirtyRange` expands to carry both the replaced extent and the replacement extent.
- **Consequences:** Transcript host-facing contract (anchors, follow modes, unread, collapse, hierarchy) is preserved unchanged. Internally, transcript code stops owning text-measurement logic and shares it with every other substantial text surface.
