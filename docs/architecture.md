# Application architecture

## Current foundation and intended deployment

Use a modular monolith: Next.js App Router with strict TypeScript and Tailwind CSS; a Vercel-compatible Node deployment later. PostgreSQL through Supabase will provide persistence, with Supabase Auth for staff. Neither integration is installed or called through Step 1.2. No multi-tenant machinery or microservices are needed for one restaurant.

Current executable code is limited to `src/app` and `src/config/restaurant.ts`. There are no path deviations from the brief. The public configuration contains presentation data, never operational authority or secrets. Operational schedules, policy versions, table inventory and permissions will be database-backed.

Step 1.2's authoritative contracts are [restaurant policies](domain/restaurant-policies.md), [reservation lifecycle](domain/reservation-lifecycle.md) and [permissions](security/permission-matrix.md). [Acceptance criteria](quality/acceptance-criteria.md) map their stable IDs to future verification layers/phases. This architecture links to numeric defaults instead of duplicating them. All future module descriptions below remain plans.

## Planned boundaries (not created folders)

| Location | Responsibility and allowed dependencies |
| --- | --- |
| `src/modules/restaurant` | Validated service schedules, closures, timezone and operational policies; source of truth for availability and reservation commands. |
| `src/modules/tables` | Dining areas, physical tables, capacity bounds and explicitly permitted combinations; exports allocation candidates, not a single seat-count approximation. |
| `src/modules/availability` | Read-oriented computation using restaurant policy, table candidates and active allocations. Returns provisional options; cannot confirm bookings. |
| `src/modules/reservations` | Owns lifecycle, create/edit/cancel commands and transactional allocation. All booking channels call these commands. Depends on policies, tables, auth and database boundaries. |
| `src/modules/customers` | Customer records and reservation-history access with minimised personal data; never owns capacity. Self-service uses scoped verified access and reservation commands, not direct row edits. |
| `src/lib/auth` | Supabase staff identity, sessions and permission checks; checks run at every server entry point and are reinforced by database policies. Customer self-service uses separate narrowly scoped credentials. |
| `src/modules/menu` | Menu content, publication and availability labels; no food ordering or sales accounting. |
| `src/modules/restaurant` (content responsibility) | Verified restaurant information with publication status and provenance for website and assistant retrieval; operational settings require stronger permissions. |
| `src/modules/notifications` | Durable outbox consumption, staff notifications, email/WhatsApp delivery, retries, provider receipt handling and deduplication. Reads committed events, never determines booking success. |
| `src/modules/waitlist` | Queue eligibility, controlled offers, deadlines and acceptance; delegates capacity changes to reservation commands. SEP-01 separates enrollment from finite offers; Phase 11 must supply queue rules and configured offer lifetime before enabling offers. |
| `src/modules/assistant` | Retrieval of published, verified restaurant information; responses cite grounded facts or admit missing information. Any authorised booking tool delegates to reservation commands and reports only their result. |
| `src/modules/analytics` | Versioned event contracts and metric definitions, consent and data minimisation. Read models cannot mutate operational state. |
| `src/lib/db` | Server-only database adapters and transactional interfaces; privileges are narrowly scoped. No privileged client is imported into client components. |
| `src/lib/observability` | Structured, redacted logs, correlation IDs, monitoring and audit integration. Audit writes accompany privileged changes; no tokens or unnecessary customer data in logs. |
| `src/components/ui`, `src/components/public`, `src/components/admin` | Reusable presentation only, using module contracts through server entry points. No capacity or permission policy embedded in components. |
| `supabase/migrations` | Versioned schema, constraints, policies, functions and controlled data changes. |
| `tests/unit`, `tests/integration`, `tests/e2e` | Pure policy checks, real database/security/concurrency tests, and user journeys respectively; introduced in 1.3 and expanded with each feature. |

App Router pages, route handlers and server actions are transport boundaries. Validate untrusted input and authenticate/authorise before calling module commands. Server Components are the default; client islands receive only safe, serialisable view data. Modules expose deliberate contracts instead of importing each other's private persistence implementation. Dependency flow is UI/transport → application commands/queries → domain policy and infrastructure. External providers sit behind server-side adapters.

## Reservation correctness invariants

- Availability shown to a customer is provisional until an atomic booking operation succeeds.
- Every booking source uses the same reservation commands and capacity rules.
- A table cannot have overlapping active occupancy allocations.
- Dining duration and turnaround time both affect occupancy.
- Party capacity and permitted table combinations are distinct from total restaurant seat count.
- Pending requests follow LIFE-03's bounded capacity-backed hold and command-time expiry. Waiting-list enrollment consumes no capacity; future offers follow SEP-01's separate finite-hold contract, with mechanics gated on Phase 11.
- Reservation edits must succeed atomically or preserve the original booking.
- Booking creation and external-event processing require idempotency, including rejection of mismatched payloads reusing a key.
- Cancellation, expiry and other lifecycle changes must release capacity consistently.
- Restaurant-local service dates and UTC instants must be handled deliberately, including daylight-saving transitions and overnight services.
- Staff permissions must be enforced server-side and in database access policies, not only by hiding buttons.
- Public clients must never receive privileged Supabase credentials.
- A reservation reference alone is not authentication for customer self-service. SELF-01–08 define hashed high-entropy credentials, finite scoped sessions, rotation, revocation, rate limits and inert GET; implementation remains deferred.
- Notifications are delivered after a successful transaction through a reliable outbox or equivalent durable design.
- AI responses cannot bypass permissions or independently invent booking confirmations.
- Analytics definitions must specify their denominator, date basis, timezone and included statuses.
- Menu interaction data does not represent sales data.

## Database concurrency design (future implementation)

Execute booking mutations in transactional PostgreSQL operations, such as restricted database functions called from server commands. Re-evaluate authoritative policy and capacity inside the transaction. Lock candidate allocation resources in deterministic table order, or use equivalent coordination with bounded retry for serialisation failures/deadlocks. Do not hold a database transaction open while calling providers.

Represent occupancy per physical table, including every table in a combination, using half-open time ranges covering dining plus turnaround. Intended constraints include an exclusion constraint on overlapping active occupancy ranges per table, foreign keys, valid ranges and unique idempotency keys. Exact schema and active-state representation are deferred to database design. Application-level check-then-insert does not prevent double-booking.

For edits, acquire relevant old and new resources, validate and replace allocations within one transaction; rollback keeps the original booking intact. Cancellation and expiration transition lifecycle and release allocations in the same transaction. Offer acceptance and expiry must contend on the same record/resources, so exactly one transition wins. Read-only availability treats deadline-passed holds as logically expired; a mutation reconciles stale hold records under locks before reuse. Durable workers persist expiry and notification intents but their punctuality is not required for correctness (LIFE-01/03).

Reservation state is not a complete capacity predicate. Completed bookings retain a separate cleanup interval (LIFE-06); expired holds stop consuming at their deadline even if status persistence lags. Allocation history is immutable/auditable; active interval versions are changed atomically. Actual physical overruns become operational incidents that suppress new availability and flag affected bookings without overwriting future allocations (LIFE-05). Settings changes preview/reconcile conflicts before activation and preserve agreed snapshots (SET-02/03).

Waiting-list enrollment, offer holds, reservations, delivery attempts, reminder scheduling and marketing consent are distinct entities/concerns. Offer acceptance transfers exclusive resource ownership into the reservation command transaction (SEP-01). Email/WhatsApp delivery state belongs to communication records; provider failure after commit never changes reservation success (SEP-02). Declined/expired outcomes are not cancellation events and remain separate in analytics (LIFE-08).

Commit reservation, allocations, idempotency outcome, audit record and notification outbox event together. Workers deliver only committed events, retry with backoff, deduplicate provider events and expose failed deliveries for staff resolution. Delivery may be at least once; consumers must be idempotent. Booking success remains independent of immediate provider availability.

## Time, security and metrics

Use `timestamptz` for persisted instants and an explicit service-opening local date. Overnight occupancy can cross service-date boundaries; overlap checks use instants, not date buckets. TIME-01–04 define explicit closing-day offsets, rejection of nonexistent times and offset/instant disambiguation of repeated local times. Format with POL-01's locale/timezone rather than the server/browser default.

Introduce server-only environment validation when an integration is added: validate required names, formats and allowed values at the integration boundary, fail with redacted configuration errors, and separate public configuration from secrets. Do not initialise unconfigured providers during import or build. Supabase row-level policies and server permissions must both be tested; service-role credentials bypass policies and therefore require tightly controlled server usage.

Audit records should capture actor, action, target, timestamp, correlation ID and safe change details with restricted access. Separate security audit from behavioural analytics. Define retention, consent and deletion policy before collecting customer data. Metrics must distinguish service date, booking-created date and event time, and state cancellation/no-show treatment. No fabricated revenue or conversion claims.
