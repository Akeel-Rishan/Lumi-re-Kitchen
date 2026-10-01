# Restaurant operating policies

Status: approved demonstration contract for later implementation, not implemented behaviour. Lumière Kitchen is fictional. All configurable values below are demonstration defaults, not claims about a real restaurant. Presentation remains in [restaurant configuration](../../src/config/restaurant.ts); future authoritative settings belong in the database.

This document owns schedule, booking, seating and input defaults. [Lifecycle](reservation-lifecycle.md) owns state/hold rules; [permissions](../security/permission-matrix.md) owns actor and management-token rules; [acceptance criteria](../quality/acceptance-criteria.md) own interaction specifications and derived examples. Stable IDs are cross-document references. Examples elsewhere illustrate these defaults, not independent policy definitions.

## Schedule and booking defaults

| ID | Configurable rule |
| --- | --- |
| POL-01 | One restaurant; Manchester, UK; currency GBP; locale en-GB; IANA timezone Europe/London. |
| POL-02 | Monday closed. Tuesday–Sunday: lunch 12:00–15:00, dinner 17:30–22:30, both closing-day offsets 0. |
| POL-03 | Candidate starts are on a 30-minute local wall-clock grid anchored separately to each service opening. A date override anchors its own grid. |
| POL-04 | Online creation requires start minus authoritative command time to be at least 60 elapsed minutes. Equality is allowed. Check again at transaction admission, not only when displaying slots. |
| POL-05 | Online service date must be between restaurant-local today and today plus 60 calendar days, inclusive. Use calendar addition, not 60 times 24 elapsed hours. A future overnight start must also be in the future and satisfy POL-04. |
| POL-06 | Positive integer guest count: 1–6 eligible for instant confirmation; 7–12 require approval; above 12 directs the customer to staff without creating an ordinary online reservation or hold. Zero, negative and fractional counts are invalid. No above-limit manual booking path in this initial contract. |
| POL-07 | Dining duration: 1–2 guests 90 elapsed minutes; 3–6 guests 120; 7–12 guests 150. Turnaround is 15 elapsed minutes after dining. Snapshot both values on allocation agreement. |
| POL-08 | Start must be an eligible grid point inside a service. Both dining and turnaround must finish at or before closing. Closing is never itself a valid arrival time. |
| POL-09 | Arrival grace before staff may record no_show: 15 elapsed minutes after agreed start; equality is allowed. Time passing alone never declares a no-show. |
| POL-10 | Customer mutation cutoff: start minus command time must be at least 2 elapsed hours. Equality is allowed. Applies to time, party size, cancellation and special-request edits, with additional lifecycle rules. A proposed reschedule must satisfy this cutoff for both the existing and proposed start, as well as POL-04/05. |
| POL-11 | No automatic overbooking, deposit, payment or cancellation fee. Role elevation cannot bypass physical allocation rules. |

### Latest starts derived from POL-02/03/07/08

For each service, select the last grid start for which start + dining + turnaround is no later than closing. Earlier valid starts still depend on notice, horizon and an eligible allocation.

| Guests | Dining + buffer | Latest lunch start → occupancy end | Next lunch grid point (invalid) | Latest dinner start → occupancy end | Next dinner grid point (invalid) |
| --- | --- | --- | --- | --- | --- |
| 1–2 | 90 + 15 = 105 min | 13:00 → 14:45 | 13:30 → 15:15 | 20:30 → 22:15 | 21:00 → 22:45 |
| 3–6 | 120 + 15 = 135 min | 12:30 → 14:45 | 13:00 → 15:15 | 20:00 → 22:15 | 20:30 → 22:45 |
| 7–12 | 150 + 15 = 165 min | 12:00 → 14:45 | 12:30 → 15:15 | 19:30 → 22:15 | 20:00 → 22:45 |

## Time contract

| ID | Requirement |
| --- | --- |
| TIME-01 | Schedules are local wall-clock windows with explicit closing-day offset 0 or 1. Resolve openings/closings to instants before capacity arithmetic. Reservation instants use timezone-aware database timestamps. Store the service-opening local date separately; today and horizon use POL-01's timezone, never browser/server local defaults. |
| TIME-02 | Duration, turnaround, notice, cutoff and deadlines compare actual instants. Occupancy is half-open [start, dining end + turnaround). A subsequent start equal to occupancy end is non-overlapping; it must independently satisfy the slot grid and service rules. |
| TIME-03 | Reject a nonexistent local time; never silently shift it. An ambiguous start or schedule boundary needs an explicit offset/instant. Availability returns service date, zone, resolved start/end instants and offset; the UI disambiguates repeated local times. Bare ambiguous local input is rejected. |
| TIME-04 | An overnight window belongs to its opening date even when arrival/end occurs the following date. Horizon is evaluated on service date. Generate the wall-clock grid across the day boundary; validate every candidate under TIME-03. Cross-date occupancy conflicts are checked by instant, never by service-date buckets. |

Illustration for a future override (not an additional default service): Tuesday 20:00 to Wednesday 02:00 with closing-day offset 1. A Wednesday 00:00 two-person arrival belongs to Tuesday's service date and occupies until Wednesday 01:45. A 00:30 start would end at 02:15 and is ineligible. The service is not duplicated under Wednesday's date. Local display includes both calendar date and offset when needed.

## Overrides, settings changes and snapshots

| ID | Requirement |
| --- | --- |
| SET-01 | Precedence: explicit closures/blocked intervals, then date-specific service overrides, then recurring weekly schedule. An override replaces the entire service list for its opening date, including an explicitly empty list; it never appends windows. Reject internally overlapping service definitions. A closure applies to overlapping occupancy even where the service opened the previous day. |
| SET-02 | Preview setting changes against all affected future allocations, pending holds, cleanup blocks and already-issued offers. Show affected references, time ranges and conflict reasons under authorised staff access. Save a draft; do not activate conflicting changes. Offer resolution via valid table reassignment, explicitly agreed reschedule, or authorised cancellation with reason/customer communication. Each booking command remains atomic; a batch is not assumed globally atomic. Recompute conflicts and policy version at activation; stale previews fail. Until resolved, the previous settings remain authoritative. |
| SET-03 | Existing reservations retain agreed dining duration/buffer and policy version after defaults change. A changed default alone does not resize historical or future agreed allocations. New closures/table deactivation cannot silently invalidate them. Rescheduling or party-size change re-evaluates current policy and capacity and snapshots the new agreement only on success. Contact/request-only changes do not reset duration, buffer or deadlines. |
| SET-04 | Managers/Owners may resolve settings conflicts through permitted commands, with reason and audit; never edit capacity rows or silently cancel customers in bulk. A safety incident can immediately suppress new offers for affected resources and flag existing bookings at risk without deleting them. Resolving physical safety and contacting guests remains staff work, not an automatic claim of extra capacity. |

## Tables and allocation

| ID | Requirement |
| --- | --- |
| CAP-01 | Each physical table has a stable unique identifier, dining area, positive integer guest capacity, active state and operational blocked intervals. Inactive or blocked tables are ineligible for new allocations; deactivation/blocking with future allocations follows SET-02. |
| CAP-02 | A party needs one eligible table or an explicitly configured combination. A combination has a stable ID, distinct constituent IDs, one permitted dining area and a declared effective capacity no greater than the sum of constituent capacities. Its capacity is authoritative for that arrangement; unused seats on unrelated tables cannot be pooled. All constituents must be active and unblocked. |
| CAP-03 | A combination occupies every constituent for the whole occupancy interval. A physical table cannot be in overlapping active allocations, regardless of reservation source, owner or combination ID. Cleanup and live holds also block allocation. |
| CAP-04 | Among options satisfying every constraint, minimise effective capacity minus guest count; then minimise number of constituent tables; then sort lexicographically by stable option identifier. Normalise identifiers consistently so ties are deterministic. Preferences are best-effort only, displayed as such, and do not override this ranking or become guaranteed requirements in the initial product. Special requests cannot waive any rule. |
| CAP-05 | Guest count means people in a booking. Physical seating capacity means seats in inventory/arrangement. Reservable availability means a permitted, unblocked allocation at a specific time. Occupancy time includes dining and turnaround. No operational guest cap is enabled initially; a later service/area guest cap is an additional constraint with its own time basis, not a replacement for table checks. |
| CAP-06 | Every source uses shared reservation commands. Lock/coordinate all candidate physical resources in deterministic order, check current policy, live holds and occupancy, and commit reservation, every allocation, idempotency outcome, audit and outbox together in PostgreSQL. Database constraints enforce non-overlap. No partial combination, lost update or application-only check-then-insert. Contention can return a safe conflict; availability was provisional. |
| CAP-07 | Early seating/occupancy extension must atomically adjust allocations against all other bookings and blocks. Late arrival does not extend the end. If an overrun is observed, flag an operational incident, preserve next bookings, and suppress new availability on the affected resource until resolved. A physical overrun is a reported fact, not permission to insert overlapping allocations. LIFE-05/06 distinguish permitted planned extensions from factual incident resolution after an actual overrun; recording that violation never widens bookable service windows or waives non-overlap. |

## Guest details and exceptional assistance

| ID | Requirement |
| --- | --- |
| DATA-01 | Initial booking requires a name (service identification), email (transactional confirmation and secure management link) and phone (urgent service contact). Collect only necessary contact data; do not require account creation, birth date, payment data or identity documents. Validate name 1–100 Unicode code points after trimming, email at most 254 characters with syntactic validation, and phone in normalised international format of at most 15 digits plus leading +. Name/email/phone are not proof of reservation ownership. |
| DATA-02 | Optional special requests: maximum 500 Unicode code points after trimming, plain untrusted text. Reject over-limit input with retained form data; escape on output, do not render markup or execute instructions. Prompt guests not to enter unnecessary sensitive information; allergy/access needs should be discussed with staff and are not automatically guaranteed by a note. No AI instruction authority or marketing consent is inferred from requests. |
| OPS-01 | Staff assistance after the customer cutoff is action-specific: Staff can cancel with reason; Manager/Owner can amend future bookings or reassign/extend allocations with reason and impact review. They may explicitly waive only online notice/horizon and the customer cutoff for a staff-assisted command. They cannot waive service fit, party limits/approval, table rules, pending expiry, no-show grace or atomicity. Record each waived rule. Manual creation follows the same defaults unless an authorised Manager/Owner selects this explicit waiver. |
| OPS-02 | Ordinary future rescheduling is limited to live pending/confirmed reservations before their start. Arrived/seated bookings use dedicated operational commands, not customer rescheduling. Staff actual-event recording is separate from booking creation; seating cannot be recorded ahead of the guest's arrival. Exceptional corrections require a future separately specified audited workflow; no generic force-status or reopen action is authorised here. |

After-cutoff UI must provide a staff-contact path using verified published contact details when later configured, never invented numbers or email addresses. Until those exist, explicitly say contact details are unavailable in this demonstration; do not render a dead contact action.
