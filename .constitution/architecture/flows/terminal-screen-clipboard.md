# Terminal, Screen Mode, and clipboard flow

## Mapping

This flow satisfies PRD capabilities **P0-K01 through P0-K16**.

## Behavior view

```mermaid
stateDiagram-v2
    [*] --> Uninitialized
    Uninitialized --> Negotiating: initialize selected Screen Mode
    Negotiating --> ActiveModern: modern capabilities verified
    Negotiating --> ActiveCompatible: compatible tier selected
    ActiveModern --> ActiveModern: degrade or recover one capability
    ActiveModern --> ActiveCompatible: modern tier no longer safe
    ActiveCompatible --> ActiveCompatible: process basic input and output
    ActiveModern --> Suspended: suspend
    ActiveCompatible --> Suspended: suspend
    Suspended --> Negotiating: resume and revalidate
    ActiveModern --> ClipboardPending: explicit clipboard request
    ActiveCompatible --> ClipboardPending: explicit supported clipboard request
    ClipboardPending --> ActiveModern: completed, denied, busy, malformed, or timeout
    ClipboardPending --> ActiveCompatible: fallback or unavailable
    ActiveModern --> Restoring: shutdown, write failure, or disconnect
    ActiveCompatible --> Restoring: shutdown, write failure, or disconnect
    Suspended --> Restoring: shutdown
    Restoring --> [*]: prior terminal state restored or disconnect finalized
```

## Failure path

Negotiation ambiguity selects the compatible tier or degrades one capability. Clipboard requests are explicit, bounded, correlated, and typed; response bytes never become keyboard Events. A write failure or disconnect ends the active context and attempts deterministic restoration rather than continuing with uncertain terminal state.
