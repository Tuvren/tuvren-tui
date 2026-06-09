# Out of Scope: Public musl/Alpine Linux Support

Public musl/Alpine Linux support is deferred until a separate release-matrix decision.

## Rationale

The Bun-first native-package enforcement strategy uses glibc-targeted auxiliary packages. musl-based distributions (Alpine Linux, WASI targets) require separate package builds and testing coverage that is not yet validated. Declaring support before validation would create a negative user experience.

## Current Policy

Linux auxiliary packages are glibc-targeted. Installing on musl systems fails with a clear diagnostic. This is intentional — not a bug.
