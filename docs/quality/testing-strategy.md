# Testing strategy

Step 1.3 adds test infrastructure for the existing foundation only. [Operating acceptance criteria](acceptance-criteria.md) AC-001–AC-070 remain specified, not executed. No reservation engine, database, authentication, provider or final design system exists to test yet.

## Layers and responsibility

| Layer                | Runner/infrastructure                                                  | Intended responsibility                                                                               | Current state                                                                                                                       |
| -------------------- | ---------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Unit                 | Vitest, Node environment                                               | Deterministic domain calculations, state rules and small server utilities; explicit clocks and inputs | Configured; **no unit tests yet** because current files are presentation/configuration, without a meaningful pure behaviour subject |
| Database integration | Real isolated PostgreSQL, runner selected with database implementation | Transactions, constraints, row policies, multi-table allocation and concurrent requests               | Not created; introduce with Phase 3/4 capabilities                                                                                  |
| API integration      | Application boundary plus isolated dependencies                        | Input validation, authentication, authorisation, idempotency and error contracts                      | Not created; introduce alongside the relevant commands                                                                              |
| End-to-end           | Playwright Chromium against `next start` after a production build      | Rendered pages and real browser/customer/staff interaction                                            | Foundation landing, 404, keyboard and responsive checks only                                                                        |
| Accessibility        | axe with Playwright plus manual evaluation                             | Supported WCAG A/AA rules, then focus/reading order/zoom/assistive technology review                  | Landing and 404 automated scans at each configured width                                                                            |

Mocked database tests **cannot prove double-booking prevention**. Later concurrency tests must use real PostgreSQL transactions and actual constraints, not application-level mock assertions. Missing required integration infrastructure must fail explicitly; never use skip/pass fallbacks to turn absent database coverage green.

## Unit discovery and temporary empty-suite allowance

[vitest.config.mts](../../vitest.config.mts) discovers only `tests/unit/**/*.test.ts`, resolves `@` to `src`, uses Node and excludes Playwright discovery. Do not create empty folders or a dummy assertion to satisfy the runner. No DOM environment or React Testing Library is installed. Async Server Components are verified through the browser rather than unsupported unit rendering.

`test:unit` runs once; `test:unit:watch` watches locally. `passWithNoTests: true` is a **temporary, visible foundation exception**, not proof of tested business functionality. Vitest prints that no tests were found. Remove the allowance as soon as the first meaningful unit-testable behaviour is introduced, in that same change. Tests must then fail if discovery finds none. A real assertion/configuration/import failure still returns nonzero today. Playwright never allows an empty browser suite to succeed, and both runners reject focused tests in CI.

## Coverage

`test:coverage` uses the V8 provider at exactly the Vitest version. Measured scope is `src/**/*.{ts,tsx}`, including application code that is not yet unit covered. Exclusions are declarations, generated code and test files; framework/dependency/report output is outside the source include. Do not exclude actual app code to raise a percentage. No arbitrary whole-project threshold is set.

With no unit tests, coverage is **not applicable yet**. `test:coverage` selects Vitest's coverage mode; the configuration prints an explicit N/A message and does not enable percentage reporting unless the unit discovery directory contains matching test files. This avoids the provider's misleading 100% result for zero branch opportunities. Use the package command instead of adding `--coverage` directly. Once meaningful unit subjects exist, remove the empty-suite allowance and inspect text, HTML and LCOV outputs in `coverage/`. Reservation invariants need targeted branch coverage plus real database integration coverage, including DST, cutoffs, stale edits, expiry and concurrent resource claims. Browser/axe success is not unit coverage.

## Foundation browser coverage

[playwright.config.ts](../../playwright.config.ts) defines three Chromium projects: 360×800, 768×1024 and 1440×1000. Each runs five tests: three foundation cases and two accessibility scans, **15 browser executions** in total. These are desktop Chromium viewport simulations, not proof on real mobile hardware. Browser locale is en-GB and timezone Europe/London. Future date-sensitive tests must also use a different browser timezone, such as America/New_York, to prove restaurant-local behaviour rather than accidental browser-zone dependence.

| ID         | Current executable check                                                                                                                | Scope limit                                                                                                      |
| ---------- | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| FOUND-01   | Root HTTP 200, one main/h1, visible restaurant identity/disclosure/reservation notice, essential-content fit and document/body overflow | No final homepage or booking journey                                                                             |
| FOUND-02   | Custom not-found HTTP 404, usable recovery target, keyboard Tab/Enter navigation back home, responsive fit                              | Exact status is intentional: the current static Next.js 404 responds 404; do not relax it if a regression occurs |
| FOUND-03   | Skip link is reachable/visible on focus and Enter focuses main                                                                          | Automated focus movement, not full focus-appearance conformance                                                  |
| A11Y-01/02 | axe landing/404 scans using WCAG 2/2.1 A/AA and supported 2.2 AA tags, no disabled rules                                                | Tool-supported rules only; review incomplete results manually                                                    |

Tests use semantic locators and web-first assertions, no fixed sleeps or broad page snapshots. A small shared helper checks real repeated content-fit conditions and browser health; no page-object framework. Browser errors and external network requests fail the test. The only console exception is Chromium's exact native 404 resource message at the single deliberate missing-page document URL; application errors, asset errors and all other URLs remain failures. This is not an axe rule exception. The tests require no provider credentials and block unexpected external requests before continuing them.

The existing error boundary has no safe dedicated fault-injection seam. Its visible recovery/callback test is deferred until a meaningful component seam exists. Do not add a public crash route or production switch, and do not claim the 404 test covers runtime error recovery. Firefox/WebKit are a later deliberate expansion, not part of this gate.

## Test data, isolation and future traceability

- No real customer data or secrets in fixtures, screenshots, traces or reports. Use clearly synthetic deterministic examples.
- Tests are independent and must not depend on execution order. Each browser test gets an isolated page/context; keep worker counts conservative.
- Control dates/clocks explicitly in time-sensitive unit, database, API and browser tests. Avoid unseeded randomness.
- Ordinary CI uses deterministic adapters/test doubles for external providers. Real-provider smoke checks, if ever added, are separate and explicitly opt-in.
- Destructive resets may target only an explicitly isolated test database after verifying its identity; never infer a safe target from a missing environment variable.
- Add a meaningful test beside each new executable capability, referencing the relevant `AC-NNN` and requirement ID in its test name/comment. Update a traceability entry only when that exact scenario is implemented and execution evidence exists.
- Current FOUND/A11Y checks partially exercise foundation accessibility/responsiveness principles; they do **not** execute future booking/admin scenarios AC-067–AC-070. Keep all AC IDs specified until their capabilities exist.

## Manual review still required

Automated scans do not prove full accessibility conformance or visual quality. Review focus visibility, reading order, 200% zoom/reflow, understandable error copy, contrast in actual rendering, touch use and real assistive technology. Inspect axe incomplete results in attachments. Review the restrained landing page at all three widths; no redesign is part of this step. See [CI operations](ci.md) for commands and report inspection.
