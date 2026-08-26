# ADR-T48: First Public npm Release Is 0.1.0 Pre-GA

- **Status:** superseded by ADR-T57
- **Supersession:** Final `0.1.0` remains pre-GA but requires the complete atomic package, target, example, security, devtools, OpenCode, and benchmark evidence matrix.
- **Context:** The package manifests already carry version `0.1.0`, the source tree is pre-`1.0`, and semantic-versioning guarantees are intentionally deferred until GA.
- **Decision:** Epic V owns the first public npm publish of `tuvren-tui@0.1.0` and matching `@tuvren/tuvren-tui-*` auxiliary packages after Epic U. Publishing must include package metadata, LICENSE payloads, publish automation, packed/registry install smoke, and a feedback triage loop.
- **Consequences:** Public users can install the framework through `bun add tuvren-tui`, but all public messaging must state that `0.1.0` is pre-GA and may include breaking changes before `v1.0`.
