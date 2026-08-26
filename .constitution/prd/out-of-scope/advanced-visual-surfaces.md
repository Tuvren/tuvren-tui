# Advanced visual surfaces

- **Context:** Cell-level drawing and terminal-native image presentation would broaden visualization beyond the initial text and Component catalog.
- **Decision:** Deferred to P1 `0.2.0`.
- **Reason:** Both capabilities need one safe, native-backed abstraction with capability detection, fallback, clipping, lifecycle, and benchmark evidence. Developers must not need to write or load native extensions.
- **Consequences:** Downstream `0.1.0` work must not add a public cell Surface or image protocol contract. Rich clipboard behavior remains P0 and must not be deferred with image presentation.
