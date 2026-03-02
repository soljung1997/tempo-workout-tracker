# Tempo — Test Plan

## Scope
Validate the MVP features: plan creation, workout logging, history, and basic analytics.

## Test types
### Unit tests
- Volume calculation
- PR detection logic (if implemented)
- Unit conversion (kg/lb) rules

### Integration tests
- Room DAO operations (insert/update/delete)
- Migration tests (when schema changes)

### UI / E2E smoke tests (manual is fine for MVP)
- Create plan → start workout → log sets → finish
- Kill app mid-session → reopen → continue
- View history details
- Analytics screen loads and displays expected aggregates

## Manual release checklist
- Fresh install works
- No crashes in core flows
- Data persists after restart
- Basic accessibility: readable text, buttons tappable
