# ADR 0003: Quality and test foundation

Status: Accepted for Step 1.3; execution evidence belongs in [progress](../progress.md).

## Context and decision

The inspected project has Next.js 16.3.8 App Router, strict TypeScript, Tailwind 4, ESLint, pnpm 10.34.6 and Node 22.20.0. GitHub is the configured remote, with main confirmed by remote HEAD. Step 1.2's uncommitted operating contracts are preserved. No existing formatter, runner or CI competes with this setup.

Add Prettier, Vitest plus its matching V8 coverage provider, Playwright Chromium and axe's Playwright integration as exact development dependencies. Keep application/framework versions unchanged. The installed package engine requirements support the pinned Node runtime. No DOM library, component test framework or test-only business logic is justified.

Use `vitest.config.mts` to express ESM unambiguously for Vite without changing the application's module mode. TypeScript includes `.mts` configuration files. Install only the Chromium headless shell for the automated gate; a full headed browser is optional for local interactive debugging. This also avoids the disk-space failure observed during the initial full-browser download.

Use an explicit temporary empty-unit-suite allowance because there is no meaningful unit subject beyond configuration and presentation. Remove it with the first real subject; coverage is not applicable until then. Browser tests must discover and run real tests, cannot pass empty, and use the production build. Runtime error-boundary callback coverage is deferred rather than introducing a public crash seam.

Use one GitHub Actions job: frozen installation, formatting/lint/types/fast tests, one production build, browser installation and Chromium smoke/accessibility checks. Pin verified action SHAs, minimise permissions, upload only failure evidence, and never use production secrets. Local scripts remain portable on Windows and Linux.

## Consequences

The quality gate catches source/config/documentation drift and actual rendered-page regressions without claiming reservation correctness. Viewport and axe checks improve evidence but do not establish complete visual/accessibility conformance. Real PostgreSQL integration will be required for capacity invariants. No arbitrary coverage percentage, redundant build or premature browser matrix is introduced.

Formatting existing maintained files is allowed in this step; identify those changes separately from semantic changes. Do not alter Step 1.2 rules while formatting tables. All AC-001–AC-070 scenarios remain specified, not executed; current tests use separate FOUND/A11Y IDs.

## References

- [Vitest empty-suite behaviour](https://vitest.dev/config/passwithnotests) and [coverage configuration](https://vitest.dev/config/coverage).
- [Playwright production web server configuration](https://playwright.dev/docs/test-webserver) and [accessibility testing](https://playwright.dev/docs/accessibility-testing).
- [Testing strategy](../quality/testing-strategy.md) and [CI operations](../quality/ci.md) own local usage and coverage boundaries.
