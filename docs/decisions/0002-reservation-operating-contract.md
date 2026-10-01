# ADR 0002: Reservation operating contract

Status: Accepted demonstration contract for Step 1.2; runtime implementation deferred.
Date: 2026-10-01.

## Context

The Step 1.1 Next.js foundation exists with its original dependencies, scripts, page and presentation configuration. The repository now has a Git baseline and was clean before this step. Domain rules must be settled before migrations, engine commands or booking screens are built. A fictional restaurant has no external operational facts to infer.

## Decision and authority

- [Restaurant policies](../domain/restaurant-policies.md) are the single authority for configurable schedule, notice, horizon, party, duration, turnaround, cutoff, seating and input defaults. Other documents refer to stable IDs; scenarios are derived illustrations.
- [Lifecycle](../domain/reservation-lifecycle.md) owns the exhaustive transition set, finite pending holds, atomic edits, actual occupancy/cleanup handling and separation of waiting-list and delivery records.
- [Permissions](../security/permission-matrix.md) owns roles, server/database enforcement, action-specific staff assistance and reservation-scoped customer credentials.
- [Acceptance criteria](../quality/acceptance-criteria.md) own traceable future verification scenarios and interaction contracts. They are not executed tests.

Adopt the user's proposed demonstration defaults. Treat service closing as the end of dining plus cleanup, not the last arrival time. Use restaurant-local service dates and wall-clock grids, but elapsed-time comparisons for durations/deadlines. Resolve DST explicitly and retain service-opening dates across overnight windows.

Prefer honest, capacity-backed pending requests over unlimited unallocated demand: pending requires the same atomic resources as confirmation and expires independently of worker timeliness. Pending edits never extend their original deadline; confirmed-to-pending party changes are explicitly acknowledged new approval episodes. A failed edit preserves the entire original agreement.

Reservation state and occupancy are distinct: completed is terminal but may still have cleanup capacity; an overdue pending row has no live hold. Report observed overruns without manufacturing overlapping valid allocations. Keep allocation history and use reasoned Manager resolution when the next booking is at risk.

Staff run the service; Managers manage agreements and operating settings; Owners control identity, sensitive exports, retention and integration administration. Assistance after the customer cutoff is an explicit audited action, never a capacity bypass. Customers need scoped high-entropy credentials, not knowledge of personal details. GET is inert, mutation sessions are short-lived, and ordinary edits cannot transfer ownership.

## Alternatives and consequences

Reject seat-total availability because it ignores table arrangements. Reject application-only check-then-insert because concurrent writers require database coordination/constraints. Reject unbounded pending requests, worker-only expiry, silent reopen and automatic no-show because each creates operational ambiguity. Reject a generic privileged force-booking flag because roles must not weaken allocation correctness.

Snapshots protect existing agreements; policy activation therefore needs a conflict preview and explicit resolution workflow. Completion conflicts need staff attention, not silent truncation of cleanup. Notification delivery is retryable after commit and cannot determine reservation success. Declined/expired metrics remain separate from cancellations.

No unresolved blocker for this contract. Table inventory is intentionally not invented; acceptance fixtures are labelled synthetic. Waitlist offer lifetime/queue policy, production retention periods, verified contact-transfer workflow, delivery provider details and account-wide customer history remain explicit later-phase gates, with their capabilities disabled until specified. They are not licence to implement an unspecified fallback.

## Scope

Documentation only. No new runtime types/config, migrations, authentication, APIs, screens, dependencies or test framework. The architecture and roadmap numbering are preserved. Step 1.3 remains pending until specifically prompted.
