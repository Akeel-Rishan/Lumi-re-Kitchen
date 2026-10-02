# Local quality gate and CI

The [Quality workflow](../../.github/workflows/ci.yml) uses one Ubuntu job named **Foundation quality**. GitHub's remote HEAD was inspected and points to `main`; no default-branch fallback was needed. Triggers are pull requests, pushes to main and manual dispatch. This file documents configuration, not an observed hosted CI pass; see [progress](../progress.md) for actual execution evidence.

## Stages and local equivalents

Use Node from [.nvmrc](../../.nvmrc) and pnpm from [package.json](../../package.json). CI reads these files instead of duplicating versions. From the repository root:

```text
pnpm install --frozen-lockfile
pnpm check
pnpm build
pnpm exec playwright install --only-shell chromium
pnpm test:e2e
```

Chromium installation is a first-run/tool-upgrade prerequisite, not another application build. On Linux/CI use `pnpm exec playwright install --with-deps --only-shell chromium` to include OS dependencies. Windows does not need the Linux system-package step.

The gate uses Playwright's standard headless Chromium shell, so `--only-shell` avoids downloading an unused headed browser. For the optional interactive UI or headed debugging, install full Chromium separately with `pnpm exec playwright install chromium` when disk space permits; it is not needed by CI or `test:e2e`.

PowerShell on this machine blocks the npm.ps1 wrapper and pnpm is not globally installed. For any pnpm command use the pinned launcher, for example:

```powershell
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm install --frozen-lockfile
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm check
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm build
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm exec playwright install --only-shell chromium
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm test:e2e
```

| Script                      | Behaviour                                                                             |
| --------------------------- | ------------------------------------------------------------------------------------- |
| `pnpm format`               | Explicitly writes Prettier formatting to maintained code/config/docs                  |
| `pnpm format:check`         | Read-only formatting check                                                            |
| `pnpm lint`                 | Existing Next.js/TypeScript ESLint rules, warnings fail                               |
| `pnpm typecheck`            | `next typegen` then `tsc --noEmit`; works without stale generated route files         |
| `pnpm test:unit`            | Vitest once; currently reports no unit tests yet under documented temporary allowance |
| `pnpm test:unit:watch`      | Local Vitest watch mode                                                               |
| `pnpm test:coverage`        | V8 unit coverage; currently not applicable, never a claim of 100%                     |
| `pnpm check`                | Formatting → lint → typecheck → fast tests; first failure stops the chain             |
| `pnpm build` / `pnpm start` | Production build / normal production server                                           |
| `pnpm test:e2e`             | Tests the existing production build; starts/stops local server automatically          |
| `pnpm test:e2e:ui`          | Local Playwright interactive UI; build first                                          |

No package script uses Unix-only environment assignment. The check chain uses npm solely as a portable script launcher; pnpm remains the sole dependency manager. Test commands do not rebuild: run build once after application changes, then browser tests. A missing build/server/browser is a failure, not a skipped test.

## Production server and isolation

Playwright runs `npm run start -- --hostname 127.0.0.1 --port 3100` and waits for `http://127.0.0.1:3100`, with a finite startup timeout. This is `next start`, never `next dev`. No production credentials are required. CI always starts its own server and refuses port reuse. Local reuse is off by default; opt in only for a known production server built from the current checkout:

```powershell
$env:PLAYWRIGHT_REUSE_SERVER = "1"
npm.cmd exec --yes --package=pnpm@10.34.6 -- pnpm test:e2e
Remove-Item Env:PLAYWRIGHT_REUSE_SERVER
```

Reuse is ignored when CI is set. No arbitrary external base URL is accepted. Keep port 3100 free otherwise. Test/expect/action/navigation/startup timeouts are finite; browser workers are one and retries zero so failures remain visible. CI enables forbidOnly. No browser-suite pass-with-no-tests flag is set.

## Reports and troubleshooting

```text
pnpm exec playwright test --list
pnpm exec playwright show-report playwright-report
pnpm exec playwright show-trace test-results/<failed-test>/trace.zip
```

HTML report: `playwright-report/index.html`. axe results attach to each scan; inspect violations and incomplete checks. Failure screenshots/traces live under `test-results/`. Vitest coverage (when meaningful tests exist) lives in `coverage/`. Generated outputs are excluded from Git, lint and formatting. Reports contain only synthetic local pages; never attach provider secrets or real guest data.

- Formatting fails: run `pnpm format`, review the diff and rerun check. CI never silently writes files.
- Type generation fails on a clean checkout: verify pinned Node/dependencies; keep `next typegen` in typecheck. Do not disable strict checking.
- Browser executable missing: run the matching Playwright browser installation command. Connection reset/OS dependency errors must be resolved or reported as blocked; never switch to a skip/pass policy.
- Server startup fails: check port 3100, build output and terminal errors; build before browser testing. Do not reuse an unrelated development server.
- Browser console error: inspect the failure trace. Only the intentional missing document's exact native 404 message is permitted; broken assets/application errors must be fixed.
- axe violation: inspect rule/element and fix the actual issue. No blanket rule suppression; an unavoidable exception requires exact scope, reason and follow-up.
- Unit output says no tests: expected only for this foundation. Remove the empty-suite allowance when first real unit behaviour is added. This does not satisfy any domain acceptance scenario.

## Workflow security and maintenance

Only contents: read permission; checkout does not retain credentials. No secrets, deployments, remote migrations, messaging calls or pull_request_target. Superseded runs for a PR/ref are cancelled, job timeout is 20 minutes, and only browser report/trace directories are uploaded on failure with seven-day retention. No environment files or whole-workspace artifacts are uploaded. pnpm downloads are cached using the lockfile; node_modules is installed rather than cached as a substitute.

Action revisions were verified with `git ls-remote` against the official repositories: checkout v4.3.0, setup-node v4.4.0, upload-artifact v4.6.2 and pnpm/action-setup v4.2.0. Workflow references are immutable commit SHAs with readable version comments. Re-verify tags and changes when updating. Do not claim a hosted pass until a run has actually been observed.

Later, an authorised repository administrator should make **Foundation quality** a required status check after confirming its emitted name in a real PR run. No remote settings or branch protection are changed here.

Add unit tests for real pure behaviour and browser tests for real journeys. Reuse the existing runners and single build/job while practical. Database/API integration, reservation concurrency, auth, provider smoke tests, Firefox/WebKit, real-device testing and runtime error injection remain outside current coverage. See [testing strategy](testing-strategy.md) before expanding infrastructure.
