# Advanced editor behavior

- **Context:** Multiple cursors, folding, syntax-aware indentation, and language-intelligence integration would make the editing surface suitable for deeper editor workflows.
- **Decision:** Deferred to P1 `0.2.0`.
- **Reason:** These behaviors depend on a proven grapheme-correct Text Document, selection, undo, viewport, and testing foundation. Shipping them first would multiply state and interaction risk.
- **Consequences:** `0.1.0` must provide the complete P0 editing contract but must not claim advanced editor parity. Downstream work may prepare compatible foundations without exposing speculative public contracts.
