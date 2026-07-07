# Epic Z — Release Readiness & First Public npm Publish (PUB)

**Epic Status:** Active

Epic Z carries the deferred publishing scope (ADR-T48) plus the supply-chain
hardening from the audit (Deps-01). Publishing was deliberately pushed to the
end of the wave: `tuvren-tui@0.1.0` ships only after the codebase is
hardened (U), fast at streaming scale (V), consolidated (W), productized (X),
and proven by the flagship client (Y). The former PUB-V001 publish-contract
spike is satisfied by the audit's Packaging-01 and Deps-01 findings.

---

#### PUB-Z001 Harden the Supply Chain: Lockfile, Audit Gate, Pinned Actions

- **Type:** Security
- **Effort:** 2
- **Dependencies:** SAFE-U001
- **Category:** Security
- **Scope (In-Scope Files):**
  - `.gitignore` (stop ignoring the native lockfile) and the committed `native/Cargo.lock`
  - `.github/workflows/ci.yml` (dependency audit gate)
  - `.github/workflows/release.yml` and `.github/workflows/ci.yml` (pin third-party actions to immutable revisions)
  - Dependency-update automation configuration
- **Scope (Out-of-Scope Files):**
  - `native/Cargo.toml` version bumps (ARCH-W011 owns the layout engine; others via the update automation)
- **Verification Command:** `cargo build --manifest-path native/Cargo.toml --release` with a committed lockfile, plus a green CI run including the audit gate
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if the dependency audit reports an existing vulnerability; report it before gating so the gate lands green."
- **Description:** Audit finding Deps-01: the native lockfile is gitignored (unreproducible release binaries), no dependency-vulnerability gate exists, release workflows reference third-party actions by mutable tags, and no update automation is configured. Close each gap before any binary is published.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the native lockfile is committed
When a release build runs on two machines
Then dependency resolution is identical

Given CI runs
When a dependency with a known vulnerability is present
Then the audit gate fails the pipeline

Given the release workflow file
When its third-party actions are inspected
Then each is pinned to an immutable revision
```

---

#### PUB-Z002 Finalize Package Metadata, LICENSE Payloads, and README Packaging

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** PUB-Z001, FLAG-Y005
- **Category:** DX
- **Scope (In-Scope Files):**
  - `ts/package.json` (files array, publish access configuration, repository URL, LICENSE/README payloads)
  - `packages/@tuvren/*/package.json` (same, for all five auxiliary packages)
  - LICENSE propagation into every publishable payload
- **Scope (Out-of-Scope Files):**
  - `ts/src/` code (metadata only)
- **Verification Command:** `cd ts && bun pm pack --dry-run` and the same for each auxiliary package
- **Expected Success Output:** `exit 0` with each tarball listing LICENSE, README, and only intended files
- **STOP Conditions:**
  - "STOP if any tarball would include source that is not part of the documented package contract; fix the files array, do not publish-and-hope."
- **Description:** Audit finding Packaging-01: all six manifests lack files arrays, publish access configuration, tarball LICENSE/README payloads, and canonical repository URLs. Finalize metadata for `tuvren-tui` and the five auxiliary packages with explicit pre-GA 0.1.0 messaging.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given npm packages are prepared for public publish
When each packed tarball is inspected
Then it contains LICENSE and README material and only the intended files
And package URLs point to Tuvren/tuvren-tui
And pre-GA 0.1.0 messaging is explicit
```

---

#### PUB-Z003 Add the npm Publish Workflow for Public and Auxiliary Packages

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** PUB-Z002
- **Category:** DX
- **Scope (In-Scope Files):**
  - `.github/workflows/release.yml` (publish steps with provenance-appropriate gating)
- **Scope (Out-of-Scope Files):**
  - Package code and metadata (frozen by PUB-Z002)
- **Verification Command:** Workflow dry-run on a release-candidate tag without publish secrets exposure
- **Expected Success Output:** `exit 0` with publish steps reached and gated correctly
- **STOP Conditions:**
  - "STOP if publish ordering could leave the public package live while a required auxiliary package failed; ordering must be dependency-safe with failure stopping promotion."
- **Description:** ADR-T48: extend the release workflow to publish `tuvren-tui` and all auxiliary native packages in dependency-safe order (auxiliaries before the public package), gated on required secrets, with failed publishes stopping before promotion and GitHub release artifacts still produced for manual acquisition.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a release tag for v0.1.0
When the publish workflow runs with required secrets
Then auxiliary packages publish before the public package
And a failed publish stops the run before promotion
And GitHub release artifacts remain available for manual acquisition
```

---

#### PUB-Z004 Add Aux-Package Resolver Smoke Against Packed and Registry Packages

- **Type:** Feature
- **Effort:** 5
- **Dependencies:** PUB-Z003
- **Category:** DX
- **Scope (In-Scope Files):**
  - `ts/test-install.test.ts` and smoke scripts
  - `.github/workflows/` smoke wiring
- **Scope (Out-of-Scope Files):**
  - `ts/src/resolve.ts` resolver order (contract is fixed; the smoke proves it)
- **Verification Command:** `bun test ts/test-install.test.ts` plus the packed-install smoke job
- **Expected Success Output:** `exit 0`
- **STOP Conditions:**
  - "STOP if the resolver falls back to a source build in a packed-install environment; that is the exact failure this smoke exists to catch."
- **Description:** Prove the resolver loads the native library from packed or registry-installed auxiliary packages rather than only source builds: a clean install from packed tarballs must resolve `@tuvren/tuvren-tui-<platform>-<arch>` by package name.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a clean package-manager install using packed or published packages
When Tuvren resolves the native library
Then it finds the matching auxiliary package by package name
And ordinary published installs do not fall back to source builds
```

---

#### PUB-Z005 Run the Release-Candidate Dry-Run and Cross-Platform Install Smoke

- **Type:** Chore
- **Effort:** 5
- **Dependencies:** PUB-Z004
- **Category:** DX
- **Scope (In-Scope Files):**
  - Release-candidate verification scripts and workflow matrix entries
  - `.constitution/reports/` (record the RC result)
- **Scope (Out-of-Scope Files):**
  - Any production code (an RC failure spawns fix tickets; it is not fixed inside this ticket)
- **Verification Command:** The RC matrix run across the supported platform table in TechSpec stack.md §5
- **Expected Success Output:** `exit 0` on every supported platform/architecture pair
- **STOP Conditions:**
  - "STOP if any supported platform fails install or load; no publish step may run before the dry-run passes."
- **Description:** Run the full release-candidate pass: build, pack, install, and load on each supported platform; record linux-arm64 runner limitations explicitly; produce the go/no-go record for the publish.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given a v0.1.0 release candidate
When the dry-run and smoke matrix complete
Then supported platforms install and load successfully
And linux-arm64 limitations or runner gaps are explicitly recorded
And no publish step runs before the dry-run passes
```

---

#### PUB-Z006 Publish v0.1.0 to npm

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** PUB-Z005
- **Category:** Feature-Evolution
- **Scope (In-Scope Files):**
  - Release tag and workflow execution
  - Release notes (pre-GA statement)
- **Scope (Out-of-Scope Files):**
  - Any code change (the RC is what ships)
- **Verification Command:** Post-publish: `bun add tuvren-tui` in a clean project followed by a minimal render smoke
- **Expected Success Output:** `exit 0`; the package and all supported auxiliaries visible on the public registry
- **STOP Conditions:**
  - "STOP if the published payload differs from the RC tarballs; unpublish windows are short and irreversible actions need a clean retry, not a patch-over."
- **Description:** ADR-T48: publish `tuvren-tui@0.1.0` and matching auxiliary native packages, verify the public install path end-to-end, and state pre-GA status in the release notes.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given the release candidate has passed
When the v0.1.0 publish runs
Then the public package and all supported auxiliary packages are available from npm
And README install guidance works through bun add tuvren-tui
And release notes state that the package is pre-GA
```

---

#### PUB-Z007 Establish Feedback Intake and the Post-Publish Triage Loop

- **Type:** Chore
- **Effort:** 3
- **Dependencies:** PUB-Z006
- **Category:** Docs
- **Scope (In-Scope Files):**
  - Repository issue templates and labels
  - Triage and follow-up planning documentation
- **Scope (Out-of-Scope Files):**
  - Roadmap commitments (post-v0.1 planning is a future Stage 4 pass fed by this loop)
- **Verification Command:** Manual review: templates render on the issue tracker and labels exist
- **Expected Success Output:** Issue intake paths exist for install, DX, platform, and API feedback
- **STOP Conditions:**
  - "STOP if feedback volume immediately reveals a critical install defect; that becomes a hotfix ticket, not a triage-doc question."
- **Description:** Establish the feedback loop for install, DX, platform, and API issues after the first public release: labeled intake, documented triage expectations, and hooks feeding the post-v0.1 planning pass before any v1.0 commitments.
- **Acceptance Criteria (Gherkin):**
```gherkin
Given v0.1.0 is public
When users report install or SDK feedback
Then the repo has documented issue labels, triage expectations, and follow-up planning hooks
And feedback can inform the post-v0.1 roadmap before v1.0 commitments
```
