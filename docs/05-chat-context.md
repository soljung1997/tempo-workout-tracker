# Tempo Chat Context

## Project identity
- **Name:** Tempo
- **Type:** Android workout tracker
- **Owner/Author:** Jee Won Jung
- **Core idea:** Lightweight, offline-first workout tracker for planning workouts, logging sets/reps/weights, and reviewing history/progression without subscriptions or unnecessary complexity.

## Product brief summary
Tempo is focused on:
- Fast workout logging during gym sessions
- Reliable offline storage
- Workout template planning
- Durable session history
- Home dashboard metrics
- Calendar visibility for planned/completed/rest days
- Simple progression analytics

## Target platform
- Android-only for v1.0
- No account required for MVP
- Offline-first using a local database
- Device timezone is used for week/month calculations and calendar grouping

## Current technology stack
- React Native
- Expo
- Expo Router file-based navigation
- TypeScript
- Expo SQLite for local-first persistence
- React state initially
- Zustand/Redux may be considered later if state grows

## Architecture / SDD
### Goals
- Simple, reliable offline-first workout logging
- Fast UI with minimal friction
- Maintainable structure as features grow

### Non-goals for now
- Multi-device sync
- Social features
- Cloud accounts
- Nutrition tracking
- Medical/clinical metrics
- Subscription/paywall model

### High-level architecture
- **UI:** React Native with Expo + Expo Router
- **State:** React state first; store later if needed
- **Domain:** Plain TypeScript services/use-cases
- **Data:** Local-first storage using Expo SQLite

### Data flow
UI event -> handler -> service/use-case -> repository -> SQLite/local storage -> state update -> UI

## Current folder structure
```text
tempo-workout-tracker/
  docs/
  mobile/
    tempo/
      app/
        _layout.tsx
        +html.tsx
        +not-found.tsx
        modal.tsx
        planned-workout.tsx
        (tabs)/
          _layout.tsx
          index.tsx
          plans.tsx
          workout.tsx
          history.tsx
          settings.tsx
        plans/
          create.tsx
          [workoutPlanId].tsx
          [workoutPlanId]/edit.tsx
          [workoutPlanId]/exercises/
      assets/
      components/
        calendar/
      constants/
      src/
        core/
          data/
          domain/
      node_modules/
      app.json
      package.json
      package-lock.json
      tsconfig.json
```

## Current route meaning
- `app/(tabs)/index.tsx` = Dashboard / Home
- `app/(tabs)/plans.tsx` = Workout plans/templates
- `app/(tabs)/workout.tsx` = Active workout / start session area
- `app/(tabs)/history.tsx` = Completed workout history
- `app/(tabs)/settings.tsx` = App preferences/settings
- `app/(tabs)/_layout.tsx` = Main bottom tab navigation
- `app/planned-workout.tsx` = Create/edit/cancel planned workout flow
- `app/plans/` = Workout-plan creation, detail, editing, and plan-exercise routes
- `app/_layout.tsx` = Root Expo Router layout

## Core source folder structure
```text
mobile/tempo/src/
  core/
    data/
      db/
        database.ts
      repositories/
    domain/
      models/
      services/
```

## Folder responsibilities
- `app/`: Expo Router screens and navigation
- `app/(tabs)/`: Main MVP tab screens
- `components/`: Reusable React Native UI components
- `constants/`: App-wide constants
- `src/core/domain/models/`: TypeScript domain models/types
- `src/core/domain/services/`: Plain TypeScript use-cases/business logic
- `src/core/data/db/`: SQLite database setup and schema initialization
- `src/core/data/repositories/`: Data access layer between services and SQLite

## MVP must-haves from product brief
- CRUD workout plans/templates
- Workout type tagging for analytics/calendar indicators
- Schedule individual planned workouts on device-local calendar dates
- Create, edit, and cancel planned workouts
- Start planned workout
- Resume or discard in-progress session safely
- Log sets/reps/weights
- Durable offline persistence so data is not silently lost
- Finish workout and save to history
- History list
- Session detail view
- Home metrics A/B/C
- Week calendar view
- Month calendar indicators
- Basic graphs/analytics from history
- Offline storage with no account required

Recurring workout generation is deferred beyond the MVP scheduling foundation. The MVP stores one `PlannedWorkout` for one device-local `YYYY-MM-DD` date and does not store a planned time of day.

## Home metrics rules
### Metric A
- Workouts completed this month
- Count completed sessions whose session start date falls within the current month

### Metric B
- Average sets completed vs previous week
- Sets completed = set rows marked complete
- Compare current week average sets per workout to previous week average sets per workout
- If previous week has zero workouts, show `N/A`

### Metric C
- Workouts weight increased this month vs previous month
- Increased means user completed set requirements and at least 85% of rep requirements
- Exercises with no prior session do not count as increased

### No-data rule
- If there is no history, show a clear "no data yet" message instead of confusing zeros

## Calendar rules
### Week view
- Shows a 7-day week including today
- Completed workouts assigned to local day of session start time
- Show up to 3 workout indicators per day, then `+N`
- Workout type has color mapping, customizable later

### Month view
- Green = completed workout exists
- Red = planned workout existed but none completed by day end
- Grey = rest day
- Completed overrides missed/rest

## Completed work
### M1-I1-T1: Create base app shell and navigation
- Created Expo Router tab structure
- Created placeholder screens:
  - Dashboard
  - Plans
  - Workout
  - History
  - Settings
- Confirmed app launches through Expo
- Confirmed navigation between placeholder screens works
- Removed/ignored default starter tab screen such as `two.tsx`

## Current implementation status

Completed foundation, template-management, and scheduling work:

- Expo Router tab shell with five main screens:
  - Dashboard
  - Plans
  - Workout
  - History
  - Settings
- Expo SQLite dependency configured
- Shared database module created at `mobile/tempo/src/core/data/db/database.ts`
- Database initialization runs during app startup in `app/_layout.tsx`
- Core SQLite schema creation added for:
  - user
  - exercise_category
  - muscle_group
  - exercise
  - workout_plan
  - plan_exercise
  - workout_session
  - session_exercise
  - set_log
  - planned_workout
- Default lookup seed data added for:
  - exercise categories
  - muscle groups
  - workout types
  - exercises
- Domain model types added under `src/core/domain/models`
- Repository contracts and SQLite implementations support the completed template and scheduling flows
- Domain services implemented for exercise templates, workout-plan templates, and planned workouts
- Workout-plan UI supports creating and editing plans and managing their exercises
- Dashboard month calendar supports month navigation, date selection, and planned-workout indicators
- Planned-workout UI supports selecting a workout plan, choosing a date, adding notes, editing an existing scheduled workout, and cancelling it
- Dashboard data reloads when the screen regains focus so scheduling changes appear after navigation
- Offline-first persistence conventions documented
- Shared theme/style foundation added under `mobile/tempo/constants/styles.ts`
- Manual database smoke verification is documented in `docs/database-smoke-verification.md`

Current implementation boundaries:

- Expo SQLite is the MVP local source of truth.
- MVP uses one seeded local user with ID `1`; account and login functionality are not implemented.
- Planned workouts store a device-local `YYYY-MM-DD` date without time-of-day.
- New planned workouts begin with `planned` status; cancellation changes the status to `cancelled`.
- Starting, completing, and automatically marking planned workouts missed are deferred to workout-session functionality.
- Recurrence generation, recurrence exceptions, and reminders are deferred and tracked in `docs/v2-backlog.md`.
- `listPlannedWorkoutsForDate()` and `listPlannedWorkoutsForDateRange()` exist but are not used by the current MVP UI; their direct runtime verification is deferred until a feature uses those query paths.
- Workout-session execution, set logging, history, metrics, and analytics remain future implementation work.
- Cloud sync, accounts, conflict resolution, export/backup, and automated database tests are deferred.

Important correction:

- Do not use Room.
- Do not configure KAPT/KSP.
- Do not add Gradle dependencies for Room.
- This is not a native Kotlin Android project.
- Use Expo SQLite for local persistence.

## Git discipline
- Commit after each microtask
- Avoid committing IDE machine files such as `.idea/caches/deviceStreaming.xml`
- Stage relevant app files only
- Use clear commit messages

## Recent useful commands
```powershell
git status
git restore .idea/caches/deviceStreaming.xml
git add mobile/tempo/app
git commit -m "Create base app shell and navigation"
git push
```

## Current principle
Keep each task boring and small:
- First navigation shell
- Then persistence dependency
- Then database schema
- Then repositories
- Then services/use-cases
- Then UI features

Do not build everything at once. The app should grow in layers.
