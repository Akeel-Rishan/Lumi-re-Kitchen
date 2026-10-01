# ADR 0001: Application foundation

Status: Accepted for Step 1.1. Date: 2026-10-01.

## Context

Inspection found an empty directory, no Git repository, no applicable ancestor AGENTS.md, no package manifest, lockfile, environment files, app, styling or tests. There is no existing user code to replace. Node 22.20.0 is installed; pnpm is not globally installed. PowerShell blocks npm.ps1; use npm.cmd without changing execution policy.

## Decision

Manually scaffold in the current directory using Next.js 16 App Router, React 19, strict TypeScript, Tailwind 4 through its PostCSS plugin and ESLint flat configuration. Select stable published versions and record their exact resolution in package.json and pnpm-lock.yaml. Use Node 22.20.0 (supported Next.js runtime) and pnpm 10. No global package installation is required: npm.cmd exec can launch pinned pnpm.

Use the requested src layout with alias `@/*`; no path mapping deviations. A modular monolith will use Supabase PostgreSQL and staff Auth in later steps. Privileged operations remain on the server and use transactional database enforcement. Vercel-compatible deployment is intended but not performed.

Branding lives in src/config/restaurant.ts. Service schedules, table policies and other authoritative operational settings do not belong in that public file. Keep the welcome page intentionally temporary, with system fonts and explicit fictional-demo disclosure. Only the error boundary requires a Client Component.

## Consequences

The foundation runs without external credentials or network provider calls. No database, AI, notification, scheduler or UI library dependencies are justified yet. Tests and CI are deferred to 1.3; subsequent product work requires its own prompt. There are no generated empty future-module directories. TypeScript 5.9 is selected as a stable compatible release within the established Next.js/ESLint ecosystem, rather than adopting a new compiler major during foundation setup.

The lockfile is delivered as a project file. No Git commit is made because the inspected directory is not a Git repository; initialise version control separately when appropriate.

Resolved tooling compatibility: ESLint 10 satisfies eslint-config-next's top-level range but not the bundled import, React and accessibility plugins' peer ranges. Pin ESLint 9.39.5 to keep the complete set compatible; npm marks this major unsupported. Track migration to ESLint 10 when those plugins support it, rather than suppressing peer checks or removing rules. TypeScript remains 5.9.3. pnpm's default lifecycle-script protection skips unrs-resolver's install script; the installed platform package is sufficient if verification passes, so no blanket script approval is added.

## Framework references

- [Next.js installation](https://nextjs.org/docs/app/getting-started/installation): compatible Node runtime, App Router setup and separate ESLint command.
- [Next.js error boundary](https://nextjs.org/docs/app/api-reference/file-conventions/error): client boundary and retry recovery (stable in 16.3).
- [Tailwind PostCSS installation](https://tailwindcss.com/docs/installation/using-postcss): Tailwind 4 plugin and CSS import, without a Tailwind 3 configuration.

Registry metadata and installed package declarations resolve exact versions; do not copy newer documentation APIs blindly into the locked version.
