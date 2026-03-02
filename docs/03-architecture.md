# Tempo — Architecture / SDD

## 1. Goals
- Simple, reliable offline-first workout logging
- Fast UI (minimal friction)
- Maintainable structure as features grow

## 2. Non-goals (for now)
- Multi-device sync
- Social features

## 3. High-level architecture
- **UI:** React Native (Expo) + Expo Router (File based navigation)
- **State:** React state + store later (Zustand/Redux)
- **Domain:** "services/use-cases" as plain TS functions
- **Data:** local first storage (SQLite via Expo, or MMKV, etc)

## 4. Data flow (example)
UI event → handler → (use case/service) → repository → localDB/storage → state update → UI 

## 5. Modules (optional for later)
- app (UI + DI)
- core/domain (use cases, models)
- core/data (repos)
- core/ui (design system components)

## 6. Key decisions (ADRs)
- [ADR 0001 Offline-first storage](adr/0001-offline-first.md)

## 7. Risks / mitigations
- **Large history:** pagination / lazy loading later
- **Analytics correctness:** unit tests for calculations
