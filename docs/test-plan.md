# Tempo — Test Plan

## 1. Scope
Validate the MVP features of Tempo:
- workout plan creation
- workout execution/logging
- workout history
- basic analytics

## 2. Test Types

### A. Unit Tests
Validate core logic in isolation.

- volume calculation
- PR detection logic (if implemented)
- unit conversion rules (kg/lb)
- date/time formatting helpers
- workout summary calculations

### B. Integration Tests
Validate that app layers work correctly together.

- Room DAO operations: insert, update, delete, query
- session creation from workout plan
- set logging persistence
- history retrieval
- migration tests when schema changes

### C. UI / E2E Smoke Tests
Manual testing is acceptable for MVP.

- create plan → start workout → log sets → finish workout
- start workout from existing plan
- kill app mid-session → reopen → continue session
- view workout history details
- analytics screen loads and displays expected aggregates
- inactive exercises/plans do not break existing history

## 3. Manual Release Checklist
Before any MVP build is considered usable:

- fresh install works
- no crashes in core flows
- data persists after app restart
- workout history remains accurate after editing a plan
- basic accessibility: readable text and tappable buttons
- basic empty states display correctly
- no broken navigation between core screens

## 4. Notes
- For MVP, prioritize correctness of stored workout history over advanced automation.
- Manual testing is acceptable early on, but repeatable test cases should be added as features stabilize.
- Migration testing becomes required once the SQLite schema changes after initial implementation.