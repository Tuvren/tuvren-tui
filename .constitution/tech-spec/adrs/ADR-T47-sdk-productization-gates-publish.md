# ADR-T47: SDK Productization Gates Public Publishing

- **Status:** superseded by ADR-T50 and ADR-T57
- **Supersession:** The productization gate remains but now uses the approved entrypoints, Component and Primitive vocabulary, semantic parity, and full P0 evidence without Plugin surfaces.
- **Context:** The Native Core and FFI contracts are disciplined, but ordinary SDK workflows still expose too much handle plumbing, lifecycle management, wrapper incompleteness, and low-level event handling for a public framework-quality release.
- **Decision:** Epic U is a required SDK productization pass before npm publish. It must improve the imperative, JSX, Effect, plugin, composite, example, and devtools surfaces together, close routine wrapper gaps, reduce normal application reliance on raw FFI and numeric Handles, and make lifecycle/error guidance coherent.
- **Consequences:** First public npm publish waits until the SDK feels like an expert-level framework surface rather than only a strong native engine. The host bundle budget still applies, so productization must improve ergonomics without moving performance-critical state out of Rust.
