# PRD — Tempo (Android Workout Tracker)

---

## 1. Document Control

### 1.1 Product / Project Name
- Product: **Tempo** — Android application workout tracker
- Platform: **Android**
- Owner / Author: **Jee Won Jung**

### 1.2 Version History
| No. | Author       | Revision Details          | Version | Date       |
|----:|--------------|---------------------------|--------:|------------|
|   1 | Jee Won Jung | Initiation of PRD details |     1.0 | 2026-01-06 |
|   2 | Jee Won Jung | Editing of PRD            |     1.0 | 2026-01-17 |
|   3 | Jee Won Jung | Editing of PRD            |     1.0 | 2026-03-02 |

### 1.3 Authors & Stakeholders
- Author: Jee Won Jung
- Stakeholders: Jee Won Jung

### 1.4 Status
- Status: **Version 1.0** (as of 2026-03-02)

### 1.5 Definitions & Acronyms
| Term | Definition |
|------|------------|
| TBD  | TBD        |

---

## 2. Executive Summary

### 2.1 One-line Summary
Tempo is a lightweight, offline-first Android workout tracker that 
helps gym goers plan workout templates, log sets/reps/weights during training, 
and view history + progression through simple home metrics and charts—without 
subscriptions or unnecessary complexity.

### 2.2 Background / Context
Many workout apps prioritize monetization (subscriptions) and ship bloated 
feature sets that slow down logging and confuse users. Tempo focuses on the 
core behaviors that matter during training: planning, fast logging, reliable 
history, calendar visibility, and clear progression signals.

### 2.3 Problem Statement
Current workout apps often:
- Lock useful features behind paywalls
- Limit customization/variety by forcing preset structures
- Add complexity that creates friction during workouts

Tempo solves this by providing a streamlined and customizable experience 
that works fully offline for v1.0.

### 2.4 Goals (v1.0)
1. Workout planning
    - Create workout templates with exercise sequencing and target sets/reps
    - Allow workout type tagging (e.g., Push/Pull/Legs or muscle group)
2. Workout logging
    - Log sets/reps/weights while working out
    - Ensure durability: saved sets and sessions are not lost if the app closes
3. Home dashboard clarity
    - At-a-glance metrics + calendar overview of planned vs completed vs rest
4. Progress & analytics
    - Simple progression indicators per workout type/muscle group 
   (weight trends, volume trends, PR markers where applicable)

### 2.5 Non-goals / Out of Scope (v1.0)
- Social feed / social media integrations
- Subscription model or pay-walling core tracking features
- Nutrition tracking
- Medical/clinical metrics requiring legal compliance
- Cloud sync / accounts (explicitly post-MVP)

### 2.6 Assumptions & Constraints
- Android-only for v1.0
- Offline-first using local database
- No account required for MVP
- Device timezone used for week/month calculations and calendar grouping

---

## 3. Users & Use Cases

### 3.1 Target Audience
- Primary: Gym-goers who want structure + consistency + progress tracking (Beginner → Advanced)

### 3.2 Personas (brief)
- Beginner (John, 35): returning to fitness; wants habit consistency and simple tracking
- Intermediate (Sarah, 28): plateaued; wants accurate volume tracking + workout variations
- Advanced (Sam, 26): programs workouts; wants a free, clean platform for structured routines

### 3.3 User Needs / Pain Points
- Useful features in other apps are often pay-walled
- Customization/variety is limited by preset structures
- Too many features → poor UX and high friction while training

### 3.4 Key Scenarios / User Journeys
1. Create a workout template (plan) with exercises and target sets/reps
2. Schedule a planned workout to a date (optional recurrence)
3. Start a workout from today’s planned workout (or select a plan)
4. Log sets/reps/weights during the workout
5. Finish workout → summary → saved in history
6. View history and progression (charts/metrics)
7. Calendar view: planned vs completed vs rest

### 3.5 User Story Overview (High-Level Epics)
- E1: Workout Templates (Plans)
- E2: Workout Session Logging
- E3: History & Progress (Analytics)
- E4: Calendar & Planning
- E5: Settings (units; colors optional) / Data export (post-MVP)

---

## 4. Success Metrics (v1.0)

### 4.1 Adoption / Usage
- 80% of users use a created/premade workout routine within 3 days of downloading the application
- 10,000 users download the application with 60% of users using the application regularly (every 2 days at minimum).

### 4.2 Efficiency
- Median time to log a set: **2-5 seconds**
- Median time to create a simple workout plan: **~2 minutes**

### 4.3 Retention
- 80% of user's usage retention for D7 and 60^ of user's usage retention in D30
- Workouts logged consistently for 6 consecutive weeks (at least 50% of total planned workouts)

### 4.4 Quality
- No silent data loss in core flows (Plan → Start/Resume → Log → Finish → History)
- High crash-free reliability in core flows (target: 0.1% crashes for MVP since it is version 1.0)

---

## 5. Product Scope

### 5.1 MVP Scope (Must-haves)
- CRUD workout plans (templates)
- Workout type tagging (for analytics and calendar indicators)
- Scheduling planned workouts for calendar (date and optional recurrence)
- Start/Resume session lifecycle (safe resume/discard; no silent overwrite)
- Workout logging: sets/reps/weights (offline durable persistence)
- Finish workout → saved to history
- History list + session detail
- Home metrics + week calendar + month calendar indicators
- Basic graphs/analytics derived from history (progression per workout type/muscle group)
- Offline storage (local DB; no account required)

### 5.2 Post-MVP / Future Scope (Should/Could)
- Accounts (Google/email), cloud sync
- Rest timer + per-exercise notes
- Data export (CSV)
- Widgets & notifications
- Wearable integration (heart rate, etc.)
- Sleep/protein logging

### 5.3 Explicit Exclusions
- Social feed / social media integrations
- Nutrition tracking
- Medical/clinical metrics

### 5.4 Prioritization (MoSCoW)
| Feature                             | Priority | Notes               |
|-------------------------------------|:--------:|---------------------|
| CRUD workout plans                  |    M     | Core planning       |
| Workout logging (sets/reps/weights) |    M     | Core usage          |
| History list + session detail       |    M     | Core tracking       |
| Calendar (planned/completed/rest)   |    M     | Required by home UX |
| Home metrics (A/B/C)                |    M     | Dashboard value     |
| Basic analytics/graphs              |    M     | Progress visibility |
| Offline local storage               |    M     | v1.0 constraint     |
| Account + cloud sync                |    S     | Post-MVP            |
| Rest timer + notes                  |    S     | Post-MVP            |
| Data export (CSV)                   |    S     | Post-MVP            |
| Widgets/notifications               |    S     | Post-MVP            |
| Wearables                           |    C     | Later               |
| Sleep/protein logging               |    C     | Later               |
| Social feed                         |    W     | Out of scope        |
| Nutrition tracking                  |    W     | Out of scope        |
| Medical metrics                     |    W     | Out of scope        |

---

## 6. Requirements

### 6.1 Feature List Overview (dependencies)
| Feature                        | MVP (MoSCoW) | Dependencies                      |
|--------------------------------|:------------:|-----------------------------------|
| CRUD workout plans             |      M       | DB schema, UI screens             |
| Workout type tagging           |      M       | DB schema + UI field              |
| Plan scheduling                |      M       | DB + recurrence rules             |
| Start/Resume lifecycle         |      M       | In-progress session persistence   |
| Workout logging                |      M       | DB CRUD + validation              |
| History list/detail            |      M       | DB read + UI                      |
| Home metrics                   |      M       | DB reads + calculations + caching |
| Week/month calendar indicators |      M       | DB reads + timezone rules         |
| Analytics/graphs               |      M       | DB reads + aggregation logic      |
| Offline storage                |      M       | SQLite; no account           |
| Accounts + cloud sync          |      S       | Online DB + auth                  |
| Rest timer + notes             |      S       | Timer + DB update                 |
| Data export (CSV)              |      S       | CSV conversion                    |
| Widgets/notifications          |      S       | OS integrations + permissions     |
| Wearables                      |      C       | Wear OS APIs + permissions        |

### 6.2 Detailed Requirements (per feature / screen)

#### 6.2.1 Home (Dashboard + Week Calendar)
**A. Purpose**
- Provide primary entry point to start/resume workouts
- Show at-a-glance metrics (A/B/C)
- Show week calendar overview and navigation to month view

**B. Layout (brief)**
- Top: Start/Resume Workout CTA
- Middle: Metrics (A/B/C)
- Bottom: Week calendar view
- Navigation: Plans / Metrics-Graphs / Detailed Calendar

**C. Functional Requirements**
- FR-HOME-1: Start/Resume button behavior follows Start/Resume rules
- FR-HOME-2: Display metrics A/B/C
- FR-HOME-3: Display week calendar including today
- FR-HOME-4: Navigation routes to correct screens

**D. Rules / Edge Cases**
- Completed workout = session finished and saved
- Planned workout = scheduled plan for a date (optional recurring)
- Week defaults to Monday–Sunday; Month uses device timezone
- Assign completed workout to local day of **session start time**
- No-history state shows “no data yet”
- Multiple workouts/day show up to 3 indicators and “+N”
- Type colors use fallback if not set; persist if customizable

**E. Acceptance Criteria**
- TBD (you can paste your existing 6.2 acceptance list here)

---

#### 6.2.2 Workout Plans (Template Creator + Plan List)
**A. Purpose**
- Create/edit/delete workout templates
- Assign workout type/category
- Optionally schedule planned occurrences (date/recurrence)

**B. Layout**
- TBD

**C. Functional Requirements**
- TBD

**D. Rules / Edge Cases**
- TBD

**E. Acceptance Criteria**
- TBD

---

#### 6.2.3 Start/Resume Workout Session
**A. Purpose**
- Start a new session from a plan or resume an in-progress session safely

**B. Layout**
- TBD

**C. Functional Requirements**
- Start planned workout rules (single planned → auto start; multiple → select; none → select/disable per chosen rule)
- Resume/discard confirmation to prevent accidental loss

**D. Rules / Edge Cases**
- No silent overwrite of an in-progress session
- App kill/restart → can resume with saved sets intact

**E. Acceptance Criteria**
- TBD

---

#### 6.2.4 Workout Logging (During Session)
**A. Purpose**
- Log sets/reps/weights quickly during training

**B. Layout**
- TBD

**C. Functional Requirements**
- Add set entry (weight/reps)
- Save set immediately (durable)
- Edit last set (optional)
- Finish workout → session marked completed

**D. Rules / Edge Cases**
- Logging must persist even if app closes
- Validation (e.g., no negative reps/weight) — TBD

**E. Acceptance Criteria**
- TBD

---

#### 6.2.5 History (Session List + Details)
**A. Purpose**
- View completed sessions and drill into details

**B. Layout**
- TBD

**C. Functional Requirements**
- List sessions (date, plan/type)
- View session details (exercises + set logs)
- (Optional) Edit/delete session — TBD (decide)

**D. Rules / Edge Cases**
- History must remain readable even if plans are edited/deleted later (snapshot behavior)

**E. Acceptance Criteria**
- TBD

---

#### 6.2.6 Analytics / Graphs
**A. Purpose**
- Show progression per workout type/muscle group (weight/volume/PR markers)

**B. Layout**
- TBD

**C. Functional Requirements**
- Show trends over time range (TBD)
- Derive from history data

**D. Rules / Edge Cases**
- Empty state if insufficient history
- Caching if expensive; refresh on workout completion/edit/delete

**E. Acceptance Criteria**
- TBD

---

#### 6.2.7 Detailed Calendar (Month View)
**A. Purpose**
- Show planned vs completed vs rest at month scale

**B. Layout**
- TBD

**C. Functional Requirements**
- Month indicators (green/red/grey)
- Day tap shows summary (optional) — TBD

**D. Rules / Edge Cases**
- Completed overrides missed/rest
- Timezone change behavior — TBD

**E. Acceptance Criteria**
- TBD

---

## 7. Non-Functional Requirements (NFR)
- NFR1 Offline-first: app works with no network
- NFR2 Durability: no silent data loss for logged sets/sessions
- NFR3 Efficiency: log a set in ~5 seconds (median target)
- NFR4 Time correctness: device timezone used for calendar grouping; session start time determines day assignment
- NFR5 UX clarity: meaningful empty states for new users

---

## 8. Data & Analytics
### 8.1 Data Model (high level)
- Link: `docs/04-data-model.md`

### 8.2 Event Tracking / Telemetry
- TBD (if none for v1.0, explicitly state “none”)

---

## 9. Dependencies & Integrations
- Local database: SQLite (offline-first)
- Android permissions: TBD (only those truly needed)
- Integrations: TBD (calendar is app-internal unless you integrate with device calendar)

---

## 10. Risks & Mitigations
| Risk                              | Impact | Likelihood | Mitigation                                      |
|-----------------------------------|--------|------------|-------------------------------------------------|
| Data loss during workout          | High   | Medium     | Immediate persistence + resume flow + testing   |
| Scope creep (too many features)   | High   | Medium     | Strict MVP list + MoSCoW                        |
| Complex calendar/recurrence rules | Medium | Medium     | Keep recurrence simple for v1.0; document rules |

---

## 11. Release Plan
- MVP release criteria (Definition of Done): TBD
- QA plan: `docs/test-plan.md`
- Release notes: `docs/release-notes.md`

---

## 12. Open Questions
- Q1: Should the app route to plan selection or disable Start workout when no plan exists today?
- Q2: Will workout type colors be customizable in MVP or post-MVP?
- Q3: Will session editing/deletion be allowed in MVP?
