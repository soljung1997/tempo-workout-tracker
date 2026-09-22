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

Confirm that workout plan templates and planned exercises can be created, edited, removed, reordered, and persisted through the Expo SQLite-backed repository/service/UI flow.

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

## Notes

- `plan_exercise.order_index` is unique only among active planned exercises through `idx_plan_exercise_active_order`.
- Soft-deleted planned exercises are excluded from the UI list.
- Expo Go local storage must be cleared after schema changes during development.

## Planned Workout Verification

## Purpose

Verify that planned-workout scheduling, editing, cancellation, listing, and persistence work end to end.

## Verification Date

Date: 2026-09-21

## Verification Type

Manual Expo runtime smoke test

## Steps

1. Cleared Expo Go local storage after completing the planned-workout schema and feature changes.
2. Started the app through Expo and confirmed database initialization completed without errors.
3. Created a new planned workout.
4. Edited the assigned workout plan, planned date, and notes.
5. Confirmed the edited values appeared after returning to the Dashboard.
6. Cancelled a planned workout, setting status to `"cancelled"`.
7. Verified listing planned workouts for the MVP local user.
8. Confirmed scheduled workouts persisted after navigating away and reloading the app.

## Result

Passed.

## Notes

- Cancelled planned workouts remain stored in SQLite but are filtered out of the calendar UI.
- Expo Go local storage must be cleared after schema changes during development.
- The Dashboard loads planned workouts through `listPlannedWorkoutsForUser()` using the MVP local user ID.
- `listPlannedWorkoutsForDate()` and `listPlannedWorkoutsForDateRange()` are implemented but are not currently used by the MVP UI.
- Direct runtime verification of the date and date-range query paths is deferred until a feature depends on them.

