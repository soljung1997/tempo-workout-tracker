# Tempo — Architecture / SDD

## 1. Goals
- Simple, reliable offline-first workout logging
- Fast UI (minimal friction)
- Maintainable structure as features grow

## 2. Non-goals (for now)
- Multi-device sync
- Social features

## 3. High-level architecture
- **UI:** Jetpack Compose + Navigation
- **State:** MVVM + unidirectional data flow (state down, events up)
- **Domain:** use-cases for core actions (start session, log set, compute analytics)
- **Data:** Room (SQLite) as the source of truth; repositories abstract storage

## 4. Data flow (example)
UI event → ViewModel intent → UseCase → Repository → Room DAO → Flow/LiveData → UI state

## 5. Modules (optional for later)
- app (UI + DI)
- core/domain (use cases, models)
- core/data (Room, repos)
- core/ui (design system components)

## 6. Key decisions (ADRs)
- [ADR 0001 Offline-first storage](adr/0001-offline-first.md)

## 7. Risks / mitigations
- **Room migrations:** plan for schema versioning early
- **Large history:** pagination / lazy loading later
- **Analytics correctness:** unit tests for calculations
