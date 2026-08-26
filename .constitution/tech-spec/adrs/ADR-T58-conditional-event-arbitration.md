# ADR-T58: Keep cancelable Event arbitration conditional

- **Status:** proposed; blocked by OD-02
- **Context:** Cancelable Component defaults may require synchronous application interception, but a host round trip can threaten the 8.33 ms input-to-Surface goal and introduce reentrancy, missing completion, or shutdown ambiguity.
- **Decision:** Do not add a final Event-disposition ABI in v9.0.0. Prototype the interview's selective two-phase candidate with stable Event identity, bounded pending storage, exactly-once completion, synchronous-only prevention, pointer-movement coalescing, recovery cases, and a measured no-interceptor fast path. If it meets OD-02 evidence, accept an amended ADR and add the bounded request/disposition records to `native-abi.h`. If it fails, return to Stage 1 and Stage 2 before selecting an alternative.
- **Consequences:** Noninterceptable Event normalization, focus, hit-testing, and delivery can proceed. Cancelable-default implementation tickets remain blocked, and no downstream task may infer capture, bubble, timing, or ABI layout from this proposal.
