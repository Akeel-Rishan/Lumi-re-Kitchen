# Development handoff

Current step: **1.2 — Complete**. Documentation and consistency review completed on 2026-10-01. Step 1.1 evidence is preserved below as historical context.

## Step 1.2 handoff

Scope: documentation only; operating policies, lifecycle, permissions and traceable future acceptance criteria. No application source, presentation configuration, dependency, migration, authentication, UI or test-framework change is authorised or made.

Inspection: all Step 1.1 files and scripts present; existing Git baseline `7419937` and clean working tree. No applicable AGENTS.md found in repository or ancestor directories. Initial `git status --short` encountered sandbox ownership protection; `git -c safe.directory='C:/Users/PC/Desktop/Lumière Kitchen' status --short` succeeded without a persistent/global configuration change. Prior work is preserved.

Created: [restaurant policies](domain/restaurant-policies.md), [lifecycle](domain/reservation-lifecycle.md), [permissions](security/permission-matrix.md), [acceptance criteria](quality/acceptance-criteria.md), [ADR 0002](decisions/0002-reservation-operating-contract.md). Updated README, product scope, architecture, roadmap and this progress record.

Adopted the requested configurable demonstration defaults; [POL-01–11](domain/restaurant-policies.md#schedule-and-booking-defaults) are their single authority. Specific decisions include complete service fit including cleanup, explicit DST/overnight semantics, snapshotted agreements, finite pending holds with no edit-based deadline extension, atomic edit rollback, separate completed-cleanup capacity, action-specific staff waivers and reservation-scoped credentials. No actual inventory or real contact details were invented.

### Consistency review

Reviewed all nine reservation states for meaning, capacity, actors, entry evidence, next states, customer wording and notification intent. The 12 ordinary creation/transition rows each specify actors and preconditions; acknowledged confirmed-to-pending party edits are separately defined. Terminal records cannot be reopened. Completed cleanup, past-deadline pending rows and actual occupancy incidents are explicitly distinguished from status alone.

Checked equality boundaries for notice, horizon, customer cutoff, hold expiry and no-show grace. Latest lunch/dinner times include both dining and buffer. Verified calendar/DST examples with the installed Node Intl timezone data and arithmetic. Pending edits cannot extend the hold deadline; approval/expiry serialize and re-evaluate time under locks. Edit failure preserves a live original booking; independent natural expiry is not prevented by rollback.

Reviewed all role boundaries against lifecycle actors. Staff cannot perform Manager future edits/approvals/reassignment or Owner administration. Completion requiring an extension/after-closing incident resolution escalates to Manager/Owner and remains conflict-checked; factual violation recording does not authorise a bookable extension. All roles retain the double-booking invariant. Disabled identities and customer scope are server/database obligations, not UI controls.

Declined/expired remain distinct from cancellation metrics; waitlist enrollment/offer holds and communication delivery remain separate from reservation state. Provider failure cannot reverse a committed booking. Token lifetime, rotation/revocation, scoped sessions, inert GET, non-enumeration and contact-transfer restrictions are explicit. Pending/result copy cannot imply confirmation.

All 70 scenarios include a stable ID, requirement reference, Given/When/Then, verification layer and target phase. All remain **unexecuted future specifications**, not passing product tests. Definitions use 105 stable requirement IDs across policies, lifecycle, security and UX. Relative Markdown links/anchors resolve; existing source/config references exist, while module paths in architecture remain explicitly planned and intentionally absent. Documentation describes intended behaviour, not implemented engine/security/UI.

### Step 1.2 verification commands and outcomes

| Exact command | Outcome |
| --- | --- |
| `git -c safe.directory='C:/Users/PC/Desktop/Lumière Kitchen' status --short` | Clean before edits. Final changes are confined to README and requested documentation; no user work discarded. Command-local ownership exception only. |
| `npm.cmd run lint` | Passed, exit 0, zero warnings. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm.cmd run typecheck` | Passed, exit 0; route type generation and strict TypeScript checking. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm.cmd run build` | Passed, exit 0; Next.js 16.3.8/Turbopack production build, static `/` and `/_not-found`. |
| `node "$env:TEMP\lumiere-step12-review.cjs"` | One-off local documentation review passed: Markdown file/link/anchor checks, unique definition IDs, 70 structured scenarios with valid references, nine states, 12 transitions, 27 permission rows; service arithmetic, +60-day horizon, weekday and DST fixtures checked. Temporary review script is outside the repository and is not test scaffolding. |
| `git -c safe.directory='C:/Users/PC/Desktop/Lumière Kitchen' diff --check` | Passed. Git only noted the existing LF-to-CRLF checkout convention; no whitespace errors. |

The initial one-off review parser expected requirement definitions at line starts and missed the inline LIFE-08 definition. Moved that definition to its own paragraph for readability/discoverability and reran successfully. This was a documentation-review issue, not a product-test failure. No dependency installation or version/config changes were needed. The pre-existing ESLint support caveat remains in ADR 0001.

Not performed: future domain/security/concurrency/UI scenarios, new tests/CI, browser or runtime smoke checks. There is no application/UI change in this step; existing build/lint/type checks are the required regression checks. Step 1.1's browser limitations remain historical and are not presented as resolved.

No remaining Step 1.2 blocker or material unresolved operating ambiguity. Explicit later-phase gates: actual table inventory, finite offer lifetime/queue rules (Phase 11), production retention periods, verified contact-transfer workflow and provider-specific secure delivery. None is silently treated as implemented or granted a permissive fallback. See ADR 0002.

Next step: **1.3** only with its specific prompt. All later phases remain pending. No reservation engine, migrations, authentication, dashboard, booking UI or test framework was implemented.

## Step 1.1 historical handoff

Step 1.1 was completed on 2026-10-01 with the manual browser limitations recorded below. Statements about its originally empty/non-Git directory describe that inspection, not the current repository.

Implemented application foundation, central public restaurant configuration, temporary landing page, not-found and application-error recovery, scope, architecture, roadmap and engineering standards.

Inspection: empty workspace; no Git repository or existing application, package manager, lockfile, Node configuration, environment conventions or test setup. Applicable ancestor AGENTS.md files were absent. No user work was modified or discarded.

Architectural decisions: Next.js App Router modular monolith; strict TypeScript; Tailwind 4; pnpm; Node 22.20.0; Supabase database/Auth planned only; GBP, en-GB, Europe/London; presentation separated from operational authority. See ADR 0001 and architecture for concurrency, permissions, outbox and analytics invariants.

## Verification evidence

All commands ran from the project root. PowerShell uses npm.cmd to avoid the machine's blocked npm.ps1 wrapper. Running package scripts with npm does not install dependencies or create an npm lockfile; dependency management remains pnpm.

| Exact command | Outcome |
| --- | --- |
| `Get-Location; Get-ChildItem -Force; git status --short; node --version; npm --version; pnpm --version` | Empty folder; Git reported not a repository; Node v22.20.0; npm.ps1 blocked by execution policy; pnpm absent. No pre-existing files or failures to preserve. Ancestor AGENTS.md checks found none. |
| `npm.cmd view next version; npm.cmd view pnpm version; npm.cmd view react version; npm.cmd view eslint-config-next peerDependencies --json; npm.cmd view tailwindcss version; npm.cmd view typescript version` | Initial sandbox access failed with EACCES. Repeated with approved registry access and `--fetch-retries=0` on each query; registry metadata succeeded. |
| `npm.cmd exec --yes --package=pnpm@10 -- pnpm add --save-exact next@16.3.8 react@19.3.0 react-dom@19.3.0` | Failed on ECONNRESET downloading large packages. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm add --save-exact next@16.3.8 react@19.3.0 react-dom@19.3.0 --network-concurrency=2 --fetch-timeout=120000` | Repeated connection resets; stopped to retry with a larger timeout. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm add --save-exact next@16.3.8 react@19.3.0 react-dom@19.3.0 --network-concurrency=2 --fetch-timeout=600000 --fetch-retries=1` | Connection resets persisted; replaced with resumable archive download/cache recovery. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm add --save-dev --save-exact typescript@5.9.3 @types/node@22 @types/react@19.3.0 @types/react-dom@19 eslint@9 eslint-config-next@16.3.8 tailwindcss@4.3.3 @tailwindcss/postcss@4.3.3 postcss@8 --network-concurrency=4 --fetch-timeout=600000` | Partially cached packages; stopped after ESLint support warning to evaluate current major. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm add --save-dev --save-exact typescript@5.9.3 @types/node@22 @types/react@19.3.0 @types/react-dom@19 eslint@10 eslint-config-next@16.3.8 tailwindcss@4.3.3 @tailwindcss/postcss@4.3.3 postcss@8 --network-concurrency=16 --fetch-timeout=600000` | Cached most packages; failed with ECONNRESET. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm store add "$env:TEMP\lumiere-next-16.3.8.tgz" "$env:TEMP\lumiere-swc-16.3.8.tgz"` | Cached verified archives; see recovery details below. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm install --prefer-offline --network-concurrency=16 --fetch-timeout=600000` | Retried large archives because cache entries used file identities; stopped to correct cache identity. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm install --offline` | Passed after cache recovery; revealed ESLint 10 incompatibility with transitive plugin peers. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm add --save-dev --save-exact eslint@9.39.5 --prefer-offline` | Passed; peer conflicts resolved. Registry marks ESLint 9 unsupported; compatibility decision recorded in ADR 0001. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm.cmd run typecheck` | Passed: Next route type generation and strict tsc --noEmit. |
| `npm.cmd run lint` | Passed, zero warnings under --max-warnings=0. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm.cmd run build` | Passed using Next.js 16.3.8 / Turbopack; generated static `/` and `/_not-found`. |
| `$env:NEXT_TELEMETRY_DISABLED = '1'; npm.cmd run start -- --hostname 127.0.0.1 --port 3100` | Production server started without provider credentials; stopped with Ctrl+C after smoke checks. |
| `npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm install --offline --frozen-lockfile` | Passed: lockfile up to date, no resolution or download required. |

Installed runtime: Next.js 16.3.8, React/React DOM 19.3.0. Tooling: pnpm 10.34.6, TypeScript 5.9.3, ESLint 9.39.5, Tailwind/PostCSS plugin 4.3.3, PostCSS 8.5.28. Exactly one lockfile, with registry resolutions and no temporary archive dependencies. pnpm skipped unrs-resolver's install script by default; lint and build succeeded without approving it.

### Download recovery

The npm endpoint returned HTTP 200 to `curl.exe -I --max-time 20 https://registry.npmjs.org/next/-/next-16.3.8.tgz`, but large transfers repeatedly reset. Initial curl automatic retries also reset progress. Downloaded each archive to TEMP with repeated fresh resume requests, using the following form (at most 30 attempts, stop on success):

```powershell
curl.exe --silent --show-error -L -C - --max-time 120 --output "$env:TEMP\lumiere-next-16.3.8.tgz" https://registry.npmjs.org/next/-/next-16.3.8.tgz
curl.exe --silent --show-error -L -C - --max-time 120 --output "$env:TEMP\lumiere-swc-16.3.8.tgz" https://registry.npmjs.org/@next/swc-win32-x64-msvc/-/swc-win32-x64-msvc-16.3.8.tgz
npm.cmd view next@16.3.8 dist.integrity --fetch-retries=0
npm.cmd view @next/swc-win32-x64-msvc@16.3.8 dist.integrity --fetch-retries=0
```

Computed SHA-512 with Node's crypto module; both exactly matched registry integrity. pnpm store add indexed them under file identities. Copied those two verified cache index entries to their corresponding registry identities after checking package names and version, without changing archive contents. This is a local installation workaround, not a project dependency or a required setup procedure. Normal installation uses the supplied lockfile. No production service was configured or altered.

### HTTP smoke check

Ran the following PowerShell/Node assertion script against the production server; both routes passed. The initial version used a literal curly apostrophe in a PowerShell pipe, which changed the assertion string's encoding; inspecting the response proved the page text correct. Using the Unicode escape below resolved the harness failure without an application change.

```powershell
@'
const assert = require('node:assert/strict');
(async () => {
  for (const [path, status, text] of [['/', 200, 'Arizonix demonstration project'], ['/missing-page', 404, 'This page isn\u2019t here.']]) {
    const response = await fetch('http://127.0.0.1:3100' + path);
    const html = await response.text();
    assert.equal(response.status, status);
    assert.ok(html.includes(text));
    assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1);
    assert.ok(html.includes('id="main-content"'));
    if (path === '/') {
      assert.ok(html.includes('Bookings are not available yet.'));
      assert.ok(html.includes('Lumi\u00e8re Kitchen'));
    } else assert.ok(html.includes('href="/"'));
    console.log('PASS ' + path + ': HTTP ' + status + ', expected content, one h1, main landmark and recovery/notice');
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
'@ | node
```

## Checks not performed and limitations

No browser automation tool is available in this session. No visual inspection at 360/768/1440px, keyboard interaction, zoom, screen-reader check, or deliberate runtime-error injection was performed. Do not treat source inspection or HTTP assertions as visual verification. Follow the precise manual checklist in engineering-standards.md. The application-error boundary covers child page rendering; it does not wrap its own root layout. Source inspection confirmed Next 16.3.8's installed error-boundary types include retry.

Calculated CSS colour contrast using sRGB relative luminance: primary text 12.45:1, muted text 5.22:1, accent text 5.98:1 on the warm background, and white on accent 6.74:1. Fluid widths, wrapping and focus styles were reviewed in source, but horizontal overflow remains a manual browser check. No dedicated development-server session was needed for the production HTTP smoke check. Full test infrastructure belongs to 1.3.

No remaining installation or build blocker. Future tooling maintenance should revisit ESLint 10 once all configured plugins support it; no peer or lint rules were suppressed.

At the end of Step 1.1, policies, lifecycle and permissions were open for Step 1.2. These are now addressed in the linked Step 1.2 contracts; Phase 11's offer configuration/queue mechanics and other explicit implementation gates remain deferred. No external services have been configured.

Historical next step was 1.2. Current handoff appears above. No later product features have been implemented.
