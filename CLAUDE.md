# Tempo

Offline-first Android workout tracker: plan workouts, log sets/reps/weight at the gym, review history and progress. No account, no cloud, no subscription in v1.

## Stack

React Native 0.81 + Expo 54, Expo Router (file-based routes), TypeScript (strict), Expo SQLite. React state only. No global store yet.

The app lives in `mobile/tempo/`. Run all npm/npx commands from there.

## Commands

```bash
npm install          # install deps
npx expo start       # dev server (press "a" for Android)
npx tsc --noEmit     # typecheck; this is the only CI check
```

There is no lint or test script yet. Before calling work done, `npx tsc --noEmit` must pass.

## Layout

- `app/`: Expo Router screens. `(tabs)/` holds Dashboard (`index`), Plans, Workout, History, Settings
- `components/`: reusable UI (`calendar/`, `workoutPlan/`)
- `constants/`: shared styles and colors (`styles.ts`, `formStyles.ts`, `screenStyles.ts`, `Colors.ts`). Use these and avoid inline style values
- `src/core/domain/models/`: domain types
- `src/core/domain/services/`: business logic as plain TS
- `src/core/data/repositories/<entity>/`: `<entity>Repository.ts` (contract) + `sqlite<Entity>Repository.ts` (implementation)
- `src/core/data/db/database.ts`: schema, indexes, seeding. `sqliteTransactionRunner.ts`: multi-repo transactions
- `src/core/data/seeds/`: default lookup data

## Architecture rules

- Data flow: screen → service → repository → SQLite. Screens never write SQL or call `db` directly.
- Services and repositories are factory functions (`createXService(...)`, `createSqliteXRepository()`) that take dependencies as arguments. Screens construct them at module level.
- Writes that touch more than one table go through `TransactionRunner.run(...)`.
- Domain models use camelCase. SQLite columns use snake_case. Repositories map between them.
- Persist set logs immediately on save. Never hold unsaved workout data only in memory (see `docs/adr/0001-offline-first.md`).
- This is a managed Expo project, not native Kotlin Android: no Room, KAPT/KSP or Gradle dependencies. Persistence is Expo SQLite only.
- The MVP has one seeded local user with ID `1`. There's no login or account system.
- `initializeDatabase()` runs at startup in `app/_layout.tsx`.
- Screens that show data reload it with `useFocusEffect`, so changes made on other screens show up after navigating back.
- Build features in layers, one small task at a time: model/schema → repository → service → UI.

## Data modeling (full rules in `docs/modeling-guidelines.md`)

- User-editable lookup data (categories, muscle groups, workout types) are DB tables, not enums. Soft delete them with `is_active` (1 = visible, 0 = deleted) plus `deleted_at`.
- Use `normalized_name` (trimmed, lowercase) for duplicate checks and reactivation.
- Timestamps are ISO-8601 strings in `TEXT` columns: `created_at` (never changes), `updated_at`, `deleted_at`.
- Hard delete only for account deletion, or for a planned workout with no linked in-progress or completed session.
- Dates for calendar/week/month logic use the device-local `YYYY-MM-DD` (`src/core/utils/calendarDates.ts`).
- A user can have at most one `in_progress` workout session (enforced by a unique index).
- **Schema changes:** `initializeDatabase()` uses `CREATE TABLE IF NOT EXISTS` with `DATABASE_VERSION = 1` and has no migration step yet. Changing an existing table won't apply to installed apps. Flag this to the user before changing the schema. Don't edit columns without being asked.

## Docs (read the relevant one before working in that area)

- `docs/00-brief.md`: product scope, plus the home metric (A/B/C) and calendar indicator rules
- `docs/01-prd.md`: requirements and acceptance criteria
- `docs/03-architecture.md`, `docs/adr/`: architecture decisions
- `docs/04-data-model.md`: entities, relationships, session lifecycle rules
- `docs/release-notes.md`: what each milestone delivered
- `docs/test-plan.md`, `docs/database-smoke-verification.md`: verification approach
- `docs/v2-backlog.md`: deferred ideas. Don't build these unless asked

When a task changes behavior, update the matching doc in the same change.

## How we work

This is a learning project. The user writes the app code, and Claude teaches, scaffolds, and reviews. Decide who writes what based on how familiar the pattern is to the user:

| Situation | Claude's role |
|---|---|
| **New concept** (first time doing it) | Explain what it's for and why first, then outline the structure. Leave the core logic as a `TODO(human)` for the user, then review it. |
| **Familiar pattern** (done before, any number of times) | The user writes it. Give hints only when asked, and give a hint before an answer. Review afterwards and explain why each issue matters. |
| **Mastered** (only when the user says so) | Claude may write it. Only for tasks listed under "Handed over" below. |

- Doing a task many times doesn't mean it's mastered. A task is handed over only when the user says they can do it consistently without help.
- Claude may do non-code chores (git operations, doc syncing, CI config) unless asked not to.
- Prefer explaining over fixing: when debugging, show how to investigate, not just the answer.
- For a new issue, start with a plan. Ideally the user drafts it and Claude critiques it.

**Handed over:** none yet.

## Workflow

- Work is tracked on the GitHub project "Tempo MVP Board" (`gh project item-list 2 --owner soljung1997`). Columns: Backlog → Ready → In Progress → Done → Archived.
- Issue naming: `M<milestone>-I<initiative>-T<task>: <title>`, e.g. `M1-I4-T3`. Each initiative ends with a "verify + document" task.
- Branches: `feat/<short-name>-<issue#>`, e.g. `feat/session-persistence-49`. Don't commit directly to `main`.
- Commits use Conventional Commits with a scope and issue number: `feat(workout-session): implement session lookup and discard (#49)`. Types: `feat`, `fix`, `docs`, `refactor`, `chore`, `ci`.
- Commit after each task. Stage files by name, never `git add .`. Don't commit `.idea/` changes such as `.idea/caches/deviceStreaming.xml`.
- Keep each change scoped to its issue. Note unrelated problems you find and leave them for their own issue.
