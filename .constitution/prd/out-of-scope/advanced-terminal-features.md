# Out of Scope: Clipboard Read, Kitty Graphics, Sixel, Inline Images, Advanced MIME Clipboard

Clipboard read support, Kitty graphics, sixel, inline image protocols, and advanced MIME clipboard work are out of scope for the active wave.

## Rationale

The current terminal capability work (Epic O) established write-only OSC52 clipboard support. Clipboard reads are security-sensitive and often disabled or prompt-gated by terminals — adding read support without careful design would create surprising behavior. Kitty graphics, sixel, and inline images require terminal-specific rendering support that is not yet reliably available in the target terminal population.

## Future Consideration

These may be revisited as terminal ecosystem capabilities mature and as real user demand is evidenced through the feedback loop from Epic V.
