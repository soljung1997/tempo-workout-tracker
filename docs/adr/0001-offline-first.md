# ADR 0001: Offline-first storage

## Status
Accepted

## Context
Tempo is used in gyms where connectivity can be unreliable. Logging must be instant and durable.

## Decision
- Expo SQLite is the MVP source of truth.
- Local writes happen first.
- Cloud sync is deferred.
- Persist set logs immediately on save.
- UI reads through repository/service APIs backed by Expo SQLite

## Consequences
- We must handle SQLite schema migrations as the local schema evolves.
- We should add export/backup in a later iteration.
