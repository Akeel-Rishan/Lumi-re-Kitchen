# Lumière Kitchen

An Arizonix demonstration project for a fictional restaurant in Manchester, UK. Step 1.1 supplies the runnable foundation and temporary welcome page; Step 1.2 defines operating contracts and future acceptance criteria. Reservations and other product features are not implemented.

## Local setup

Use Node **22.20.0** (see `.nvmrc`) and pnpm **10.34.6**. No credentials or `.env.local` file are required. `.env.example` intentionally contains comments only.

Use `pnpm.cmd` in PowerShell if its script wrapper is blocked. If pnpm is not installed globally, npm can launch the pinned version without changing execution policy:

```powershell
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm install --frozen-lockfile
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm dev
```

Open http://localhost:3000. Stop the server with Ctrl+C.

If pinned pnpm is already available, the equivalent commands are:

| Purpose                                         | Command                                   |
| ----------------------------------------------- | ----------------------------------------- |
| Install locked dependencies                     | `pnpm install --frozen-lockfile`          |
| Local development                               | `pnpm dev`                                |
| Apply / check formatting                        | `pnpm format` / `pnpm format:check`       |
| Combined static and fast checks                 | `pnpm check`                              |
| Lint                                            | `pnpm lint`                               |
| Type checking (including route type generation) | `pnpm typecheck`                          |
| Fast tests / watch                              | `pnpm test:unit` / `pnpm test:unit:watch` |
| Unit coverage (not applicable yet)              | `pnpm test:coverage`                      |
| Production build                                | `pnpm build`                              |
| Production start after build                    | `pnpm start`                              |
| Production browser tests / UI                   | `pnpm test:e2e` / `pnpm test:e2e:ui`      |

For any command in the table on Windows, replace `pnpm` with `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm` if needed. On other systems use `npm exec` instead of `npm.cmd`. The initial installation needs registry access; the app itself makes no external-service calls.

## Project layout

- `src/app`: App Router layout, welcome page, stylesheet and recovery states.
- `src/config/restaurant.ts`: public branding, locale, currency and timezone; never authoritative reservation policy.
- `docs/product-scope.md`: product boundaries and assumptions.
- `docs/architecture.md`: future module responsibilities and correctness invariants.
- `docs/development-roadmap.md`: ordered work with explicit authorisation gates.
- `docs/engineering-standards.md`: quality standards and manual checks.
- `docs/decisions/0001-application-foundation.md`: foundation decision and official framework references.
- `docs/progress.md`: verification evidence, limitations and next-step handoff.

## Operating contracts (Step 1.2)

- [Restaurant policies](docs/domain/restaurant-policies.md): authoritative configurable demonstration defaults, service dates, tables and setting changes.
- [Reservation lifecycle](docs/domain/reservation-lifecycle.md): states, transitions, finite holds, atomic edits and cleanup.
- [Permission matrix](docs/security/permission-matrix.md): actor boundaries and secure reservation-scoped access.
- [Acceptance criteria](docs/quality/acceptance-criteria.md): interaction specifications and 70 unexecuted Given/When/Then scenarios for later phases.
- [ADR 0002](docs/decisions/0002-reservation-operating-contract.md): decisions, tradeoffs and later-phase gates.

The directory was empty during Step 1.1. At Step 1.2 inspection it has an existing Git baseline and a clean working tree. One pnpm lockfile remains authoritative; this step makes no commits or remote changes. Future module locations are documented, not scaffolded as unused folders.

## Environment and verification

Integration-specific schema validation will be added alongside each provider, at the server boundary, with redacted errors. Public values and privileged secrets must remain separate. No provider may be initialised unconfigured at import/build time.

Step 1.3 adds Prettier, a Node Vitest runner and Chromium/axe tests against the production application. There are **no unit tests yet** and unit coverage is **not applicable**; the temporary empty-suite allowance must be removed with the first meaningful unit subject. Browser tests are real checks of the existing foundation, not the future operating contracts.

Standard sequence: `pnpm install --frozen-lockfile`, `pnpm check`, `pnpm build`, then `pnpm test:e2e`. First install the required browser with `pnpm exec playwright install --only-shell chromium` (Linux CI uses `--with-deps`). Playwright starts `next start` on 127.0.0.1:3100; no separate manual server or duplicate build is needed. Existing-server reuse is disabled unless explicitly opted in locally. See [CI operations](docs/quality/ci.md) for exact Windows commands, reports, troubleshooting and workflow security, and [testing strategy](docs/quality/testing-strategy.md) for coverage boundaries.

Manual focus appearance, reading order, 200% zoom and assistive-technology review remain necessary. Automated axe/viewport checks do not prove full accessibility or visual quality. Runtime error-boundary injection is deferred; no crash route is added. Hosted CI results must be observed before claiming a pass; this repository has no passing-run badge.

Step 2.1 defines the [brand direction](docs/design/brand-direction.md), [semantic tokens and contrast](docs/design/design-tokens.md), and [typography/layout rules](docs/design/typography-and-layout.md). The existing welcome and recovery screens use these foundations; there is no final homepage, admin shell or shared component library. System fonts require no download. See [ADR 0004](docs/decisions/0004-design-foundation.md).

Next work requires the specific **2.2 — Accessible shared components** prompt. Step 1.2's acceptance scenarios remain specifications, not executed business tests.
