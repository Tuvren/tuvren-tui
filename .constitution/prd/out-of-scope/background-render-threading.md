# Out of Scope: Background Render Threading as Default Contract

Background render threading as part of the default product contract is out of scope unless later evidence justifies promotion.

## Rationale

The architecture preserves synchronous rendering as the default contract. Background rendering can look attractive under benchmark pressure but can undermine event ordering, state visibility, and terminal lifecycle guarantees. Any promotion of experimental threading requires benchmark parity, semantic parity, and shutdown parity — a high bar that is not met by the current implementation.

## Decision

Background rendering remains opt-in and experimental. The canonical contract stays synchronous.
