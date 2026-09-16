# FitMe API

Backend for a fitness platform where people build workout routines, track streaks, organise activities into groups, and share progress with others.

**Stack:** NestJS · TypeScript · MongoDB (Mongoose) · Redis · BullMQ · Swagger

---

## Architecture

A modular monolith with queue-backed background work, deliberately not a distributed system — the domain is small enough that module boundaries give the separation we need without the operational cost of separate services. Notifications are the one exception, split out because delivery failures shouldn't propagate back into user-facing requests.

```
src/
├── modules/
│   ├── auth/           authentication and guards
│   ├── token/          token issue, refresh and revoke
│   ├── user/           accounts and profiles
│   ├── routine/        workout routines
│   ├── exercise/       exercise catalogue
│   ├── category/       exercise categorisation
│   ├── group/          shared activity groups
│   ├── streak/         streak calculation, queue-processed
│   ├── images/         upload and sizing
│   ├── cache/          Redis-backed caching
│   ├── event-emitter/  in-process domain events
│   ├── pagination/     shared pagination contracts
│   ├── seeder/         development data
│   └── health-check/   liveness and readiness (Terminus)
├── lib/
│   └── BaseRepository  shared persistence layer
├── common/             DTOs, events, types, utilities
├── filters/            global exception handling
├── middlewares/        guards and request middleware
└── config/             environment loading, validated with Joi
```

## Design decisions

### BaseRepository

Every module's persistence goes through one generic repository rather than repeating Mongoose queries per feature. It handles filtering, pagination, field population and private-field stripping in one place, so a new module inherits all of it:

- `create`, `findOne`, `findOneOrFail`, `findAll`, `findAllSelect`
- Composable filters applied through a filter registry rather than ad-hoc query building
- Offset/limit pagination with sorting
- Declarative `populate` — nested relations expressed as strings, resolved into Mongoose populate options
- A `privateFields` list per repository, so sensitive fields are stripped by default instead of remembering to exclude them at each call site

`findOneOrFail` exists so controllers don't each re-implement "fetch, check null, throw 404."

### The store pattern

Modules whose domain spans more than one model — `routine`, `streak`, `group`, `exercise` — use a `store/` directory rather than a single repository. A store owns several related repositories and presents one interface to the service, which keeps multi-model operations out of the service layer without collapsing distinct models into one repository.

### Streaks are queue work, not request work

Streak calculation runs through **BullMQ** rather than inline. Streaks depend on activity across time and users, so computing one during a request would make write latency depend on how much history a user has. Instead, activity emits an event, a job is queued, and the processor batches the work.

This also makes streaks resilient: a failed calculation retries rather than failing the user's original action, which had nothing to do with streaks.

### Events over direct calls

Domain events decouple the module that causes something from the modules that care. Creating an activity emits an event; streaks subscribe. Neither module imports the other, so the streak rules can change without touching activity code.

### MongoDB

The core entities — routines holding activities holding exercises — are naturally document-shaped and are read far more often than they're written. Cross-document transactions aren't needed for this domain, so the flexibility of a document model outweighs the relational guarantees we'd otherwise pay for.

## Getting started

**Requirements:** Node.js 18+, MongoDB, Redis

```bash
npm install
cp .env.sample .env     # fill in Mongo and Redis connection details
npm run start:dev
```

Configuration is validated with Joi at boot, so a missing or malformed variable fails immediately and loudly rather than surfacing as a confusing error later.

```bash
npm run test            # unit tests
npm run test:e2e        # end-to-end
npm run test:cov        # coverage
```

Seed development data:

```bash
npm run seed
```

## API documentation

Swagger is served at `/api` once the app is running. DTOs are annotated with `class-validator`, so the documented contract and the enforced contract are the same thing.

## Related services

- **[notification-service](https://github.com/fitmeorg/notification-service)** — delivery, kept separate so notification failures never affect user-facing requests
- **[fitme-app](https://github.com/fitmeorg/fitme-app)** — mobile client

## Team

Architecture, data modelling, queue design and UI design by [@iTheia](https://github.com/iTheia). Implementation primarily by [@banana-guards](https://github.com/banana-guards). The system was designed collaboratively in live sessions before being built.
