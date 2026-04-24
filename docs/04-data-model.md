# Tempo — Data Model

## 1. Purpose/Scope
- This document defines the core data model for Tempo v1.
- Source of Truth: SQLite
- Storage priority: local-first, offline-capable
- Goal: support workout planning, workout execution, and workout history without rewriting past records when plans are edited later.

---

## 2. Glossary

| Term | Description |
|------|-------------|
| User | The person using the app |
| Exercise | A reusable movement definition such as Bench Press or Squat |
| Workout Plan | A reusable workout template for a day or session |
| Plan Exercise | A specific exercise entry inside a workout plan |
| Workout Session | One performed workout instance on a specific date/time |
| Session Exercise | A performed exercise inside a workout session |
| Set Log | One performed set with reps, weight, and optional notes |
| Category | Exercise classification such as Push, Pull, Legs, Upper, Lower, Full Body |
| Muscle Group | Primary body area targeted, such as Chest, Back, Quads, Shoulders |
| Snapshot | A copied value stored in history so later edits do not change past records |
| Active | Indicates whether an item is currently usable without deleting its history |

---

## 3. Design Principles
- Plans and history must be separated.
- Editing an exercise or plan must not rewrite past workout history.
- Historical workout records should snapshot important fields such as exercise name.
- Prefer soft-deletion or inactive flags over hard deletion when history exists.
- v1 should stay simple enough for SQLite and easy migration later.

---

## 4. Entities

### A. User
Represents the app owner.

**Fields**
- user_id (PK)
- username
- password_hash
- email
- age
- gender
- created_at
- updated_at

**Notes**
- Tempo v1 may only support one local user, but this table keeps the structure future-safe.

---

### B. Exercise
Represents a reusable master exercise definition.

**Fields**
- exercise_id (PK)
- exercise_name
- category
- muscle_group
- equipment
- default_sets
- default_reps
- default_weight
- default_rest_seconds
- notes
- is_active
- created_at
- updated_at

**Examples**
- Barbell Bench Press
- Dumbbell Row
- Leg Press

**Notes**
- This is the library/master record.
- Defaults are suggestions, not historical truth.

---

### C. WorkoutPlan
Represents a reusable workout template.

**Fields**
- workout_plan_id (PK)
- user_id (FK → User.user_id)
- plan_name
- description
- workout_day
- goal
- is_active
- created_at
- updated_at

**Examples**
- Push Day A
- Upper Body
- Monday Chest/Triceps

**Notes**
- `workout_day` can be a label like Monday, Day 1, Push, etc.
- `goal` can store values like hypertrophy, strength, endurance.

---

### D. PlanExercise
Represents one exercise inside a workout plan.

**Fields**
- plan_exercise_id (PK)
- workout_plan_id (FK → WorkoutPlan.workout_plan_id)
- exercise_id (FK → Exercise.exercise_id)
- exercise_order
- target_sets
- target_reps
- target_weight
- target_rest_seconds
- notes
- is_active
- created_at
- updated_at

**Notes**
- This resolves the many-to-many relationship between WorkoutPlan and Exercise.
- A workout plan has many exercises.
- An exercise can appear in many workout plans.

---

### E. WorkoutSession
Represents one actual workout performed by the user.

**Fields**
- workout_session_id (PK)
- user_id (FK → User.user_id)
- workout_plan_id (FK → WorkoutPlan.workout_plan_id, nullable)
- session_name
- session_date
- start_time
- end_time
- duration_seconds
- energy_rating
- difficulty_rating
- notes
- completed
- created_at
- updated_at

**Notes**
- `workout_plan_id` is nullable so the user can do an unplanned/free workout.
- `session_name` can snapshot the plan name or store a custom name.

---

### F. SessionExercise
Represents one performed exercise inside a workout session.

**Fields**
- session_exercise_id (PK)
- workout_session_id (FK → WorkoutSession.workout_session_id)
- exercise_id (FK → Exercise.exercise_id, nullable if needed later)
- exercise_name_snapshot
- category_snapshot
- muscle_group_snapshot
- exercise_order
- notes
- created_at
- updated_at

**Notes**
- `exercise_name_snapshot` is strongly recommended.
- This protects workout history if the user later renames or edits the master Exercise.
- Category and muscle group snapshots are optional but useful for future analytics.

---

### G. SetLog
Represents one performed set for a session exercise.

**Fields**
- set_log_id (PK)
- session_exercise_id (FK → SessionExercise.session_exercise_id)
- set_number
- reps_completed
- weight_used
- rest_seconds
- rpe
- is_warmup
- is_completed
- notes
- created_at
- updated_at

**Notes**
- This is the most important historical performance table.
- Keep it simple in v1.
- `rpe` is optional but very useful if you want progression logic later.

---

## 5. Optional v1.1 / Future Entities

### A. BodyMetric
For weight or body measurements.

**Fields**
- body_metric_id (PK)
- user_id (FK → User.user_id)
- metric_type
- metric_value
- recorded_at
- notes

**Examples**
- body_weight = 68.5
- body_fat = 14.2

---

### B. PersonalRecord
For tracking best lifts.

**Fields**
- pr_id (PK)
- user_id (FK → User.user_id)
- exercise_id (FK → Exercise.exercise_id)
- record_type
- record_value
- achieved_at
- notes

**Examples**
- 1RM estimate
- max weight
- max reps at weight

---

## 6. Relationships

### Core Relationships
- One **User** can have many **WorkoutPlans**
- One **User** can have many **WorkoutSessions**
- One **WorkoutPlan** can have many **PlanExercises**
- One **Exercise** can belong to many **PlanExercises**
- One **WorkoutSession** can have many **SessionExercises**
- One **SessionExercise** can have many **SetLogs**
- One **Exercise** can be referenced by many **SessionExercises**

### Relationship Summary
- User 1 → N WorkoutPlan
- User 1 → N WorkoutSession
- WorkoutPlan 1 → N PlanExercise
- Exercise 1 → N PlanExercise
- WorkoutSession 1 → N SessionExercise
- SessionExercise 1 → N SetLog

---

## 7. Recommended Rules

### Historical Integrity
- **Yes**, snapshot exercise names into `SessionExercise`.
- Recommended snapshot fields:
    - exercise_name_snapshot
    - category_snapshot
    - muscle_group_snapshot

### Plan Editing
- Editing a **WorkoutPlan** or **PlanExercise** should only affect future workouts.
- Existing **WorkoutSession**, **SessionExercise**, and **SetLog** records must remain unchanged.

### Deletion Rules
- Do **not** hard-delete an `Exercise` if it is referenced by workout history.
- Prefer:
    - `is_active = false`
    - hide from selection lists
    - preserve history

- Do **not** hard-delete a `WorkoutPlan` if it is referenced by past sessions.
- Prefer:
    - `is_active = false`

### Session Creation Rule
- A `WorkoutSession` may optionally be created from a `WorkoutPlan`.
- When this happens, the plan structure is copied into `SessionExercise` and then executed as historical data.

### Ordering Rule
- `exercise_order` should be stored in both:
    - `PlanExercise`
    - `SessionExercise`
- This preserves intended order and performed order separately if needed.

### Nullable Rule
- `workout_plan_id` in `WorkoutSession` should be nullable for ad hoc workouts.
- `exercise_id` in `SessionExercise` can remain non-null in v1, but making it nullable gives future flexibility if an exercise gets retired.

---

## 8. Suggested SQLite-Oriented Schema Notes

### Naming
- Use singular table names or plural consistently. Pick one and do not do the usual human thing of changing your mind halfway.
- Recommended singular style:
    - user
    - exercise
    - workout_plan
    - plan_exercise
    - workout_session
    - session_exercise
    - set_log

### Common Column Conventions
- PKs: integer primary key autoincrement
- timestamps: `TEXT` in ISO-8601 format
- booleans: `INTEGER` with 0/1

### Example Timestamp Format
- `2026-04-10T20:41:00`

---

## 9. Minimal v1 Table Priority
If you want the leanest useful version first, build in this order:

1. User
2. Exercise
3. WorkoutPlan
4. PlanExercise
5. WorkoutSession
6. SessionExercise
7. SetLog

That is enough for:
- creating plans
- selecting exercises
- logging workouts
- preserving workout history correctly

---

## 10. Open Questions for Refinement
- Should `category` be free text or enum-like constrained values?
- Should `muscle_group` support multiple groups later?
- Should `WorkoutPlan` represent one day only, or should there also be a higher-level `Program` table later?
- Should warm-up sets be stored in `SetLog` or hidden by default in UI?
- Should rest time be planned and actual as separate fields later?

---

## 11. Recommended v1 Answer to Current Rule Questions

- **Do we snapshot exercise names into SetLog?**
    - Better to snapshot into `SessionExercise`, not directly into every `SetLog`.
    - This avoids repetition while still preserving history.

- **How do we handle deleting a plan referenced by past sessions?**
    - Do not truly delete it.
    - Mark it inactive.
    - Keep historical references intact.