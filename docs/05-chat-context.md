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
UI event → handler → service/use-case → repository → SQLite/local storage → state update → UI

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
        (tabs)/
          _layout.tsx
          index.tsx
          plans.tsx
          workout.tsx
          history.tsx
          settings.tsx
      assets/
      components/
      constants/
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
- `app/_layout.tsx` = Root Expo Router layout

## Planned source folder structure
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
- Schedule planned workouts for calendar
- Optional recurrence for planned workouts
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
- If there is no history, show a clear “no data yet” message instead of confusing zeros

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

## Current task
### M1-I1-T2: Configure Expo SQLite persistence dependency
Original issue title may say `Room/SQLite`, but because this project uses React Native + Expo, the correct interpretation is:

> Configure Expo SQLite persistence dependency

## Important correction
- Do **not** use Room
- Do **not** configure KAPT/KSP
- Do **not** add Gradle dependencies for Room
- This is not a native Kotlin Android project
- Use Expo SQLite for local persistence

## Current task scope
- Install Expo SQLite dependency
- Confirm app still launches after dependency setup
- Create initial data-layer folder structure
- Add initial `database.ts`
- Do not create full schema yet unless the issue is expanded

## Suggested commands for current task
```powershell
cd mobile/tempo
npx.cmd expo install expo-sqlite
npx.cmd expo start
```

## Suggested first database file
Path:
```text
mobile/tempo/src/core/data/db/database.ts
```

Initial content:
```ts
import * as SQLite from "expo-sqlite";

export const db = SQLite.openDatabaseSync("tempo.db");
```

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

For subissue 2:
```powershell
git add mobile/tempo/package.json mobile/tempo/package-lock.json mobile/tempo/src
git commit -m "Configure Expo SQLite persistence dependency"
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
