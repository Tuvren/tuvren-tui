# ADR-T37: Native Text/Cell/View Substrate Is the Single Path for Substantial Text

- **Status:** superseded by ADR-T53 and ADR-T54
- **Supersession:** The shared native text substrate remains, but v9 requires grapheme-indexed public positions and complete interned grapheme payloads in the cell model.
- **Context:** The existing text path patched block strings in place, render code cloned visible block content into temporary owned `String`s, row counts were recomputed from text width per widget, and `TextArea` undo/redo was snapshot-oriented. This was too shallow under large agent traces, streaming code output, multiline edits, mixed-width Unicode, nested scroll regions, and terminal resize churn.
- **Decision:** Introduce a single native content/render substrate inside the Native Core composed of:
  - `TextBuffer`: canonical content storage with content epochs, line-start markers, dirty ranges, cached width metrics, grapheme boundaries, tab expansion policy, style spans, selection ranges, and highlights
  - `TextView`: viewport/wrap projection over a `TextBuffer` with visual lines, soft-wrap cache, scroll row/col, cursor mapping, byte-grapheme-cell-visual-row conversions, and resize invalidation
  - A unified text renderer that draws a `TextView` into the existing cell buffer
- **Consequences:** Widget code stops re-implementing Unicode width, wrap row counting, and clipping. Streamed content append invalidates only affected buffer and view epochs. Resize invalidates view projections rather than content storage.
