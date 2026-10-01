# Development roadmap

Only Step 1.1 is authorised. Later steps must not be implemented without their specific step prompt. Each step should end with recorded evidence against its acceptance criteria.

## 1. Product and engineering foundation
- **1.1 — Complete:** Repository inspection, application foundation, architecture documentation, and development handoff. Installation, lint, types, build and local HTTP smoke checks passed; visual limitations are recorded in progress.md.
- **1.2 — Pending:** Restaurant policies, reservation lifecycle, permissions, and acceptance criteria. Review a transition matrix, capacity/expiry policies and role matrix with concrete examples.
- **1.3 — Pending:** Automated quality checks, CI, and test infrastructure. Demonstrate clean-install CI and a meaningful initial test at each required layer.

## 2. Premium design system
- 2.1 — Pending: Agree typography, colour, spacing and responsive tokens; review contrast.
- 2.2 — Pending: Build necessary accessible controls and state patterns; verify keyboard and mobile behaviour.

## 3. Database and security foundations
- 3.1 — Pending: Add migrations for policies, tables, allocations and lifecycle; apply on a clean local database.
- 3.2 — Pending: Add staff authentication, server permissions and database policies; prove allowed and denied access.
- 3.3 — Pending: Add validated server configuration and audit foundations; verify secret isolation.

## 4. Reservation engine
- 4.1 — Pending: Implement schedule and allocation candidate queries; test combinations, overnight services and DST.
- 4.2 — Pending: Implement atomic create with idempotency; race concurrent requests against real PostgreSQL.
- 4.3 — Pending: Implement atomic edits, cancellation and expiry; prove rollback and capacity release.

## 5. Restaurant operations dashboard
- 5.1 — Pending: Implement permitted daily booking and occupancy views; validate service-date filters.
- 5.2 — Pending: Add staff booking/lifecycle actions through shared commands; test conflicts and denied actions.

## 6. Menu and restaurant content management
- 6.1 — Pending: Add draft/publish menu editing and required content fields; verify publication boundaries.
- 6.2 — Pending: Add verified restaurant information and service-setting management; audit changes.

## 7. Premium public restaurant website
- 7.1 — Pending: Implement approved responsive restaurant pages with labelled demo content.
- 7.2 — Pending: Verify accessibility, metadata, performance and content consistency.

## 8. Customer booking and self-service
- 8.1 — Pending: Connect provisional availability and booking UI to shared commands; verify conflicts and successful allocation.
- 8.2 — Pending: Add scoped, verified customer access; test expired credentials, unauthorised edits and cancellation.

## 9. Customer records and staff notifications
- 9.1 — Pending: Add permission-scoped customer history and retention controls; test privacy boundaries.
- 9.2 — Pending: Add durable staff notification views and read state; verify deduplication.

## 10. Automated communications
- 10.1 — Pending: Add transactional outbox delivery and email confirmations; simulate provider failure and retry.
- 10.2 — Pending: Add consent-aware WhatsApp and reminder scheduling; verify cancellation, time basis and receipt idempotency.

## 11. Waiting list
- 11.1 — Pending: Implement eligibility and controlled expiring offers using agreed hold rules.
- 11.2 — Pending: Race acceptance, expiry and booking commands; verify capacity cannot be oversold.

## 12. Verified AI restaurant assistant
- 12.1 — Pending: Add retrieval from published verified content; test missing/conflicting knowledge and prompt injection.
- 12.2 — Pending: Add explicitly authorised tools through shared commands; prove permissions and truthful booking responses.

## 13. Trustworthy analytics
- 13.1 — Pending: Approve event contracts, consent, denominators, statuses, date basis and timezone.
- 13.2 — Pending: Implement reconciled operational and interaction metrics; prove menu interactions are not reported as sales.

## 14. Production readiness and portfolio delivery
- 14.1 — Pending: Verify security, load/concurrency, accessibility, monitoring, backups and restore procedures.
- 14.2 — Pending: Document deployment/rollback and incident response; rehearse in an authorised environment.
- 14.3 — Pending: Prepare truthful demo scenarios and portfolio evidence; obtain separate authorisation for deployment.
