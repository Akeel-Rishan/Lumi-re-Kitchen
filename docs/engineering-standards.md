# Engineering standards

- Work only on the specifically authorised step. Inspect instructions and working-tree changes first; preserve user work. Keep one pnpm lockfile and review dependency changes.
- Strict TypeScript, no unjustified `any`, suppression comments, disabled lint rules or skipped build type checking. Prefer small, named components and explicit module contracts.
- Server Components by default. Client Components only for interaction. No unnecessary global state, empty modules, unused abstractions, speculative provider packages or placeholder production APIs.
- Presentation reads configuration; domain rules live in modules and are enforced at the database boundary where required. Validate input, authorise commands and keep secrets server-side.
- Use consistent double quotes, semicolons and two-space indentation. Run lint, type checking and production build before handoff. ESLint is a separate command, not an assumed part of the build.
- Each feature must consider loading, empty, error, success, permission-denied and conflict states wherever applicable. Prevent duplicate submissions; show actionable, truthful errors without stack traces or secrets. Never display booking success before the transaction succeeds.
- Semantic landmarks, logical headings, meaningful labels, visible focus, keyboard operation and at least 44px touch targets. Check 360px, 768px and 1440px, text zoom, contrast and reduced motion when motion exists. Avoid unnecessary ARIA, navigation or external assets.
- Use actual constraints and concurrent database integration tests for booking correctness. Test idempotency, edit rollback, expiry races, permissions, daylight-saving changes and overnight services. Avoid snapshots that merely mirror markup. Full test infrastructure belongs to 1.3.
- Add dependencies only when used. Pin the runtime and package manager; use frozen-lockfile installation for reproducibility. Do not create additional lockfiles.
- Never commit credentials, log personal data unnecessarily, or expose privileged environment variables with NEXT_PUBLIC. Introduce redacted schema validation alongside each integration, without making unrelated builds require credentials.
- Observability must distinguish user conflicts from faults and correlate commands, database work and delivery attempts. External integrations require retry and deduplication design.
- Future migrations need repeatable application, policy tests and rollback/recovery planning. Production readiness must cover backups, restore rehearsal, monitoring, accessibility and deployment procedures.
- Do not deploy, provision paid resources, send messages, push commits or alter external services as part of Step 1.1.

## Foundation manual checks

1. Run the app and open `/` at viewport widths 360, 768 and 1440 CSS pixels. Check no horizontal scrollbar, clipping or overlapping text; confirm the disclosure and reservation notice remain readable.
2. At 200% text/browser zoom, confirm content reflows. At each width compare `document.documentElement.scrollWidth` with `window.innerWidth` in browser developer tools.
3. Tab from a fresh page: the skip link becomes visible; Enter moves focus to main content. Open `/missing-page`, Tab to Back to home, verify visible focus and activate it with Enter.
4. Check dark text on warm background and white button text remain legible. System fonts should render with no font or image network requests.
5. Error recovery is source-reviewed in 1.1. To verify later in a disposable local change, make the page throw a generic Error during render, check the boundary exposes no error details, restore the page, and use Try again / Back to home. Do not retain a throwing route in production.
