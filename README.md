# Lumière Kitchen

An Arizonix demonstration project for a fictional restaurant in Manchester, UK. **Step 1.1 only:** runnable application foundation, temporary welcome page and engineering handoff. Reservations and other product features are not implemented.

## Local setup

Use Node **22.20.0** (see `.nvmrc`) and pnpm **10.34.6**. No credentials or `.env.local` file are required. `.env.example` intentionally contains comments only.

On this Windows environment pnpm is not globally installed and PowerShell blocks npm.ps1. The `.cmd` launcher works without changing execution policy or installing pnpm globally:

```powershell
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm install --frozen-lockfile
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm dev
```

Open http://localhost:3000. Stop the server with Ctrl+C.

If pinned pnpm is already available, the equivalent commands are:

| Purpose | Command |
| --- | --- |
| Install locked dependencies | `pnpm install --frozen-lockfile` |
| Local development | `pnpm dev` |
| Lint | `pnpm lint` |
| Type checking (including route type generation) | `pnpm typecheck` |
| Production build | `pnpm build` |
| Production start after build | `pnpm start` |

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

The directory was empty and was not a Git repository. The single pnpm lockfile is supplied for version control; no Git commit or remote action has been performed. Future module locations are documented, not scaffolded as unused folders.

## Environment and verification

Integration-specific schema validation will be added alongside each provider, at the server boundary, with redacted errors. Public values and privileged secrets must remain separate. No provider may be initialised unconfigured at import/build time.

Run lint, typecheck and build, then start the production server. Check `/` returns the demo page and `/missing-page` returns the custom 404; follow Back to home. Manually inspect 360px, 768px and 1440px widths for overflow, use 200% zoom, and Tab/Enter through the skip and recovery links. Detailed checks and error-boundary limitations are in engineering standards and progress.

Next authorised work requires the specific **1.2** prompt. Full test infrastructure and CI belong to **1.3**.
