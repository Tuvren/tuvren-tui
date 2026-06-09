# ADR-T40: Terminal Capability Hardening Follows Stable Substrate

- **Status:** accepted
- **Context:** Kitty keyboard protocol, OSC52, hyperlink emission, palette and capability detection, pixel and cell resolution, and terminal multiplexer variance hardening are real product needs, but the content substrate beneath the widgets was the bottleneck.
- **Decision:** Treat terminal capability hardening as the next implementation wave (Epic O) now that Epic M (substrate foundation) and Epic N (surface rebase) are complete. Capability work stays inside the existing Native Core / Terminal Emulator boundary and must not change the host-driven event and render loop.
- **Consequences:** The framework can now improve terminal fidelity without destabilizing the text substrate. The wave remains bounded to backend capability detection, negotiated input improvements, safe escape-sequence emission, and reporting APIs.
