# Go backend, Next.js/React frontend

meetsync's backend is Go; its frontend is Next.js/React, served as a single responsive web app.

## Why

This matches the existing `enx` project's stack exactly (Go backend, Next.js/React frontend) and deploys onto the same homelab Kubernetes cluster and tooling already in place for other projects — no new language, build pipeline, or deployment pattern to stand up just for this.

## Consequences

- `MatchingEngine` (see [0005](0005-deterministic-matching-ai-scoped-to-io.md)) is a pure Go package: no clock, no DB, no HTTP — exactly the seam `to-tickets` will slice around.
- Vertical-slice tickets cut through: a Go handler/schema layer, an API contract, and a Next.js page/component — the same three layers every ticket touches.
- Persistence technology (Postgres, SQLite, etc.) is a separate, later decision — not fixed by this ADR.
