# SQLite for persistence

meetsync stores its data (Gathering, Topic, Participant, Busy Block, and everything else that needs to survive a restart) in SQLite, as a single file on disk. This resolves the open question [ADR-0009](0009-go-backend-nextjs-frontend.md) deferred.

## Why

A Gathering is scoped to one small friend group with no accounts (see [ADR-0001](0001-link-identity-no-accounts.md)) — write volume and concurrency are both low, and there's no multi-tenant scaling pressure that would justify a client-server database. SQLite also needs no separate service to provision or operate alongside the Go API, which matches Release 1's bias toward minimal moving parts (see [ADR-0013](0013-release-1-raw-tally-no-matching-engine.md)).

## Consequences

- Runs as a single replica: SQLite's file locking doesn't support multiple writers, so the Go API deployment on the homelab Kubernetes cluster is capped at `replicas: 1` with the database file on a mounted persistent volume, not scaled horizontally.
- No separate database service to deploy or credential — the API pod owns its own data file.
- If a later phase needs multi-replica writes or a shared database with `enx`, migrating off SQLite is a distinct, separate decision — this ADR only settles Release 1.
