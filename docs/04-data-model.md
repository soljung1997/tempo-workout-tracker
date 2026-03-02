# Tempo — Data Model

## Entities (draft)

### WorkoutPlan
- id (PK)
- name
- createdAt / updatedAt

### PlanExercise
- id (PK)
- planId (FK → WorkoutPlan)
- name (or exerciseId if using an exercise library)
- orderIndex
- defaultSets (optional)
- defaultReps (optional)
- notes (optional)

### WorkoutSession
- id (PK)
- planId (nullable FK)
- startedAt
- finishedAt (nullable until completed)
- title (optional snapshot name)

### SetLog
- id (PK)
- sessionId (FK → WorkoutSession)
- exerciseName (snapshot) or planExerciseId (FK)
- setNumber
- weight
- reps
- rpe (optional)
- note (optional)
- createdAt

## Relationships
- WorkoutPlan 1..* PlanExercise
- WorkoutSession 1..* SetLog

## Rules (decide early)
- Do we snapshot exercise names into SetLog (recommended) so edits to plans don't rewrite history?
- How do we handle deleting a plan referenced by past sessions?
