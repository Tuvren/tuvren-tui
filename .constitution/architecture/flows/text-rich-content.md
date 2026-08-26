# Text and rich-content flow

## Mapping

This flow satisfies PRD capabilities **P0-E01 through P0-E11**.

## Behavior view

```mermaid
sequenceDiagram
    actor Dev as Developer
    participant SDK as Public SDK Facade
    participant Exec as UI Executor
    participant Content as Content and Projection Kernel
    participant Present as Presentation Pipeline
    participant Session as Terminal Session

    Dev->>SDK: Provide plain text, StyledText, declared Markdown, code, or sanitized terminal text
    SDK->>SDK: Convert supported external encoding to validated text
    SDK->>Exec: Submit content transaction
    Exec->>Content: Apply content using grapheme coordinates
    Content->>Content: Parse, sanitize, style, segment, and cache bounded artifacts
    Present->>Content: Request measured visible projection
    Content-->>Present: Return complete graphemes, widths, spans, links, and clipping data
    Present->>Session: Emit validated visible text intent
```

## Failure path

Malformed encoding, forbidden terminal control, invalid links, or out-of-range grapheme positions reject with typed content context. Sanitization may retain allowlisted style and validated hyperlinks but never cursor, title, clipboard, or other terminal-control operations.
