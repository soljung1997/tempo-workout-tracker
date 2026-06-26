# Tempo Documentation

This folder contains planning, architecture, data-model, testing, and project-context documentation for Tempo.

Tempo is a React Native Expo workout tracker with an offline-first local data layer built on Expo SQLite.

## Documents

- `00-brief.md`: Product brief and high-level project framing
- `01-prd.md`: Product requirements document
- `02-ux/flows.md`: Early UX flow notes
- `03-architecture.md`: App architecture and foundation-layer decisions
- `04-data-model.md`: Core data model, relationships, and schema notes
- `05-chat-context.md`: Development context and useful project history
- `modeling-guidelines.md`: Shared modeling conventions for entities, timestamps, deletion, and seed data
- `database-smoke-verification.md`: Manual database initialization and seed verification result
- `test-plan.md`: MVP testing strategy and verification checklist
- `adr/`: Architecture decision records
- `release-notes.md`: Release notes and milestone summaries

## Current Foundation

M1-I1 establishes the base app and data-layer foundation:

- Expo Router app shell with MVP placeholder tabs
- Expo SQLite local persistence
- SQLite schema initialization in `mobile/tempo/src/core/data/db/database.ts`
- Default lookup seed data for exercise categories and muscle groups
- Domain model types under `mobile/tempo/src/core/domain/models`
- Repository contracts and SQLite implementation skeletons under `mobile/tempo/src/core/data/repositories`
- Shared theme/style foundation under `mobile/tempo/constants/styles.ts`
- Manual database smoke verification documented in `database-smoke-verification.md`

## Notes

Documentation should reflect the current Expo/TypeScript implementation. Do not add Room, DAO, ViewModel, Kotlin, or native Android persistence assumptions unless the project intentionally changes direction.