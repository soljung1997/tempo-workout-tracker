# Tempo — Product Brief

**Product / Project Name:** Tempo (Android workout tracker)  
**Owner / Author:** Jee Won Jung  
**Status:** Rev. 1 (2026-03-02)

---

## One-liner
Tempo is a lightweight, offline-first Android workout tracker that helps gym goers plan workout templates, log sets/reps/weights during training, and view history + progression through simple home metrics and charts—without subscriptions or unnecessary complexity.

## Background / Context
Many workout apps prioritize monetization (subscriptions) and ship bloated feature sets that slow down logging and confuse users. Tempo focuses on the core behaviors that matter during training: **planning**, **fast logging**, **reliable history**, **calendar visibility**, and **clear progression signals**.

## Problem Statement
Current workout apps often:
- Lock useful features behind paywalls,
- Limit customization/variety by forcing preset structures,
- Add complexity that creates friction during workouts.

Tempo solves this by providing a streamlined and customizable experience that works fully offline for v1.0.

## Target Audience
Gym-goers across experience levels:
- Beginner → Advanced

## Personas (summary)
- **Beginner (John, 35):** returning to fitness; wants habit consistency and simple tracking.
- **Intermediate (Sarah, 28):** plateaued; wants accurate volume tracking + workout variations.
- **Advanced (Sam, 26):** programs workouts; wants a free, clean platform for structured routines.

## Goals (v1.0)
1. **Workout planning**
    - Create workout templates with exercise sequencing and target sets/reps.
    - Allow workout “type” tagging (e.g., Push/Pull/Legs or muscle group) for organization and analytics.
2. **Workout logging**
    - Log sets/reps/weights while working out.
    - Ensure durability: saved sets and sessions are not lost if the app closes.
3. **Home dashboard clarity**
    - Provide at-a-glance metrics plus a calendar overview of planned vs completed vs rest.
4. **Progress & analytics**
    - Provide simple progression indicators per workout type/muscle group (e.g., weight trends, volume trends, PR markers where applicable).

## Home Screen Metrics (v1.0)
Home includes a summarized metrics section:

### Metric A — Workouts completed this month
- Counts completed workout sessions whose **session start date** falls within the current month.

### Metric B — Average sets completed vs previous week
- Define “sets completed” as: the number of set rows the user marked complete.
- Compute: **current week average sets per workout** compared against **previous week average sets per workout**.
- If previous week has zero workouts, display “N/A” (no errors).

### Metric C — Workouts weight increased this month vs previous month
- Definition of “weight increased”:
    - User completed set requirements and **≥ 85% of rep requirements** (to account for heavier weight reducing reps slightly).
- Compare: count of “increased” workouts this month vs count last month.
- Edge case: if an exercise has no prior session, the exercise does not count as “increased”.

### Metric display rules
- If there is no history: show a clear “no data yet” message (not confusing zeros).
- If calculations are expensive: cache and refresh on workout completion/edit/delete.

## Calendar Overview (v1.0)

### Week view (Home)
- Shows a 7-day week view that includes today.
- Completed workouts are assigned to the local day of the **session start time** (prevents midnight rollover confusion).
- Multiple workouts in one day: show up to 3 indicators and “+N” beyond that.
- Workout type color mapping:
    - Each workout type has a color (customizable later; fallback default if none is assigned).

### Month view (Detailed calendar)
- **Green** = completed workout exists on that date
- **Red** = planned workout(s) existed, but none completed by day end
- **Grey** = rest day (no planned and no completed)
- Priority rule: Completed overrides missed/rest.

## Non-goals (out of scope for v1.0)
- Social feed / social media integrations
- Subscription model or paywalling core tracking features
- Nutrition tracking
- Medical/clinical metrics requiring legal compliance
- Cloud sync / accounts (explicitly post-MVP)

## MVP Scope (must-haves)
- CRUD workout plans (templates)
- Workout type tagging (for analytics and calendar indicators)
- Scheduling planned workouts for calendar (date and optional recurrence)
- Start/Resume session lifecycle:
    - Start planned workout rules
    - Resume/discard in-progress session safely (no silent overwrite)
- Workout logging: sets/reps/weights (offline durable persistence)
- Finish workout → saved to history
- History list + session detail
- Home metrics (A/B/C) + week calendar + month calendar indicators
- Basic graphs/analytics derived from history (progression per workout type/muscle group)
- Offline storage (local DB, no account required)

## Post-MVP / Future Scope (should/could)
- Accounts (Google/email), cloud sync
- Rest timer + per-exercise notes
- Data export (CSV)
- Widgets & notifications
- Wearable integration (heart rate, etc.)
- Sleep/protein logging

## Assumptions & Constraints
- Android-only for v1.0
- Offline-first using local database
- No account required for MVP
- Device timezone used for week/month calculations and calendar grouping

## Success Metrics (v1.0 targets)
### Efficiency
- Median time to log a set: ~5 seconds
- Median time to create a simple workout plan: ~2 minutes

### Quality
- No silent data loss in core flows (Plan → Start/Resume → Log → Finish → History)
- High crash-free reliability during core flows (track via testing + internal QA)

## Differentiators
- Offline-first reliability
- Fast logging UX
- Meaningful Home metrics + calendar visibility
- No-subscription core tracking
