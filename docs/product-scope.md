# Product scope

Lumière Kitchen is a fictional restaurant in Manchester, United Kingdom, built as an Arizonix portfolio demonstration. No address, telephone number, review, trading history or business result is asserted as real. Any later sample records must be visibly labelled demo data.

The intended product is a single-restaurant operations and customer experience platform: a responsive public website; real table allocation and capacity management; staff administration; menu and restaurant-content CMS; secure reservation self-service; customer profiles and history; email and WhatsApp confirmations and reminders; staff notifications; controlled waiting-list offers; an assistant grounded in verified restaurant information; reliable operational and behaviour analytics; permissions, audit records, monitoring and deployment procedures.

The initial locale is en-GB, currency GBP, and restaurant timezone Europe/London. Presentation configuration is separate from authoritative operational settings. Persist reservation instants using PostgreSQL timezone-aware types; display dates in restaurant-local time.

Payments, ordering, delivery, POS integration, automatic Instagram/Facebook ingestion and multi-tenant SaaS infrastructure are excluded. Staff may eventually record bookings received through those channels using the same reservation commands as the public website.

Step 1.1 implements only application setup, a temporary welcome page, recovery states and engineering documentation. It does not provide reservations or any other operational feature. Later phases require their specific step prompt.

Step 1.2 defines the demonstration operating contract in [restaurant policies](domain/restaurant-policies.md), [reservation lifecycle](domain/reservation-lifecycle.md), [permission matrix](security/permission-matrix.md) and [acceptance criteria](quality/acceptance-criteria.md). Those documents own the rules and stable requirement IDs; their examples are synthetic and unexecuted. See [ADR 0002](decisions/0002-reservation-operating-contract.md) for decisions and explicit later-phase gates. No runtime rules, migrations, authentication, booking interface or test infrastructure are added by Step 1.2.
