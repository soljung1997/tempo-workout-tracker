# Database Smoke Verification

## Purpose

Confirm that the local Expo SQLite database initializes successfully and inserts default lookup seed data.

## Verification Date

2026-06-25

## Verification Type

Manual Expo runtime smoke test

## Steps

1. Temporarily imported `db` alongside `initializeDatabase` in `app/_layout.tsx`.
2. Ran `initializeDatabase()` during app startup.
3. Queried seeded lookup table counts:
    - `SELECT COUNT(*) AS count FROM exercise_category;`
    - `SELECT COUNT(*) AS count FROM muscle_group;`
4. Started the app through Expo.
5. Confirmed the app did not crash during database initialization.
6. Confirmed console output showed the expected seed counts.
7. Removed the temporary database query and console logging code.

## Result

Passed.

Observed counts:

- Exercise categories: 4
- Muscle groups: 5

These match the current seed files:

- `EXERCISE_CATEGORY_SEEDS`: 4 rows
- `MUSCLE_GROUP_SEEDS`: 5 rows

## Notes

This smoke check verifies database initialization, table availability, and default lookup seed insertion. It does not verify full repository behavior or feature-level workout plan/session flows.