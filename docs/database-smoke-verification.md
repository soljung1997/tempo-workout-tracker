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

## Workout Plan Template Verification

## Purpose

Confirm that worokut plan templates and planned exercises can be created, edited, removed, reordered, and persisted through the Expo SQLite-backed repository/service/UI flow.

## Verification Date

Date: 2026-08-04

## Verification Type

Manual Expo runtime smoke test

## Steps

1. Cleared Expo Go local storage after the `plan_exercise` schema/index update.
2. Started the app through Expo.
3. Created a new workout plan template.
4. Edited workout plan metadata.
5. Added multiple exercises to the workout plan.
6. Edited planned exercise target values.
7. Removed a planned exercise.
8. Reordered remaining planned exercises with the Up/Down controls.
9. Navigated away from the workout plan detail screen and returned.
10. Confirmed reordered exercises persisted.
11. Confirmed removed planned exercises did not appear in the active plan exercise list.

## Result

Passed.

## Notes:

- `plan_exercise.order_index` is unique only among active planned exercises through `idx_plan_exercise_active_order`.
- Soft-deleted planned exercises are excluded from the UI list.
- Expo Go local storage must be cleared after schema changes during development.s