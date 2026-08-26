# ADR-T31: Background Rendering Remains Experimental and Opt-In

- **Status:** superseded; target behavior rejected by PRD v3.0.0 and ADR-T51
- **Supersession:** Background rendering is not a public or experimental target contract. Application concurrency submits work to one serialized UI executor and synchronous Render Pass.
- **Context:** Background rendering can look attractive under benchmark pressure but undermines event ordering and state visibility guarantees.
- **Decision:** Background rendering remains experimental and opt-in. The canonical contract stays synchronous. Any promotion of experimental threading requires benchmark parity, semantic parity, and shutdown parity with the synchronous path.
- **Consequences:** The default render contract is synchronous. Teams wanting background rendering must explicitly opt into experimental behavior with full awareness of the semantic trade-offs.
