# ADR 0001: Offline-first storage

## Status
Accepted

## Context
Tempo is used in gyms where connectivity can be unreliable. Logging must be instant and durable.

## Decision
- Use **Room** as the source of truth.
- Persist set logs immediately on save.
- UI reads from database-backed streams (Flow) where appropriate.

## Consequences
- We must handle Room schema migrations.
- We should add export/backup in a later iteration.
