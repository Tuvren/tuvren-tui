# Epic V — First Public npm Publish and Feedback Loop (PUB)

**Epic Status:** Active

---

## PUB-V001: Audit First Public Publish Contract

- **Type:** Spike
- **Effort:** 3
- **Dependencies:** Epic U shipped
- **Capability / Contract Mapping:** PRD §4 Epic 10, TechSpec ADR-T48 and §4.3
- **Description:** Audit the first public npm publish requirements for `tuvren-tui@0.1.0` and matching auxiliary packages.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the SDK is productized
When the publish audit completes
Then package metadata, registry access, publish tokens, release workflow, platform payloads, and smoke requirements are documented
And any blocker is resolved before PUB-V002
```

---

## PUB-V002: Finalize Package Metadata, LICENSE Payloads, and README Packaging

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** PUB-V001
- **Capability / Contract Mapping:** TechSpec ADR-T48
- **Description:** Finalize package metadata, `files` arrays, README/license payloads, repository URLs, and pre-GA messaging for public npm packages.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given npm packages are prepared for public publish
When package metadata and payload lists are reviewed
Then each package contains required LICENSE and README material
And package URLs point to Tuvren/tuvren-tui
And pre-GA 0.1.0 messaging is explicit
```

---

## PUB-V003: Add npm Publish Workflow for Public and Auxiliary Packages

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** PUB-V002
- **Capability / Contract Mapping:** TechSpec §4.3
- **Description:** Add release workflow steps to publish `tuvren-tui` and all auxiliary native packages with provenance-appropriate gating.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a release tag for v0.1.0
When the publish workflow runs with required secrets
Then the public package and matching auxiliary packages are published in dependency-safe order
And failed publishes stop before promotion
And GitHub release artifacts remain available for manual acquisition
```

---

## PUB-V004: Add Aux-Package Resolver Smoke Against Packed/Registry Packages

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** PUB-V003
- **Capability / Contract Mapping:** TechSpec §4.3, reports/GatePolicy.md
- **Description:** Add smoke tests proving the resolver can load an auxiliary package path from packed or registry-installed packages rather than only source builds.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a clean package-manager install using published or packed packages
When Tuvren resolves the native library
Then it finds the matching auxiliary package by package name
And ordinary published installs do not fall back to source builds
```

---

## PUB-V005: Run Release Candidate Dry-Run and Cross-Platform Install Smoke

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** PUB-V004
- **Capability / Contract Mapping:** PRD §5, reports/GatePolicy.md
- **Description:** Run a release-candidate verification pass across supported platforms before public publish.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a v0.1.0 release candidate
When the dry-run and smoke matrix complete
Then supported platforms install and load successfully
And linux-arm64 limitations or runner gaps are explicitly recorded
And no publish step runs before the dry-run passes
```

---

## PUB-V006: Publish v0.1.0 Public npm Release

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** PUB-V005
- **Capability / Contract Mapping:** TechSpec ADR-T48
- **Description:** Publish `tuvren-tui@0.1.0` and matching auxiliary native packages to npm.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the release candidate has passed
When the v0.1.0 publish runs
Then the public package and all supported auxiliary packages are available from npm
And README install guidance works through bun add tuvren-tui
And release notes state that the package is pre-GA
```

---

## PUB-V007: Add Feedback Intake and Post-Publish Triage Loop

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** PUB-V006
- **Capability / Contract Mapping:** PRD §1.1 and §5
- **Description:** Establish a feedback loop for install, DX, platform, and API issues after the first public release.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given v0.1.0 is public
When users report install or SDK feedback
Then the repo has documented issue labels, triage expectations, and follow-up planning hooks
And feedback can inform the post-v0.1 roadmap before v1.0 commitments
```
