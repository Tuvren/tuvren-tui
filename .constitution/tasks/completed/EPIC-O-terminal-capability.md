# Epic O — Terminal Capability Hardening

**Epic Status:** SHIPPED (archived)

---

## Epic O Summary

Epic O shipped native terminal capability state, diagnostic query APIs, write-only OSC52, OSC8 text-buffer link spans, Kitty keyboard disambiguation negotiation, and conservative multiplexer degradation with tested fallback behavior.

## Key Capabilities Delivered

- `TerminalCapabilityState` owned by Native Core, populated by `TerminalBackend`
- `tui_terminal_get_capabilities()`, `tui_terminal_get_capabilities_checked()`, `tui_terminal_get_info()`
- Write-only OSC52 clipboard support
- OSC8 hyperlink metadata on TextBuffer
- Kitty keyboard protocol negotiation on init, restoration on shutdown
- Conservative multiplexer detection (tmux, screen, Zellij) with graceful degradation

## Brownfield Note

ADR-T41 is now shipped under Epic O. The source tree has explicit terminal capability state, diagnostic query APIs, conservative multiplexer degradation, write-only OSC52, OSC8 link metadata, Kitty keyboard disambiguation negotiation, and tested fallback behavior.
