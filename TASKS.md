# TASKS — Step-by-step Implementation Tracker

This file tracks the implementation tasks derived from the project plan and marks progress as we go. Update statuses as tasks complete.

## Legend
- [ ] Not started
- [~] In progress
- [x] Done

---

## M1 — Project bootstrap + navigation skeleton
- [x] Initialize Expo TypeScript project and configure EAS (created inside project then moved to repo root)
- [x] Add TypeScript, ESLint, Prettier (basic setup)
- [x] Install core dependencies: React Navigation, Reanimated, Lottie (stubs), Appwrite (JS SDK added)
- [x] Configure Babel (`nativewind` plugin will be added) and `react-native-reanimated` plugin
- [x] Query setup: `src/lib/queryClient.ts` and `src/lib/queryClientPersister.ts` (fallback AsyncStorage persister)
- [x] Migrate package manager to pnpm and create `pnpm-lock.yaml`
- [x] Add Appwrite client wrapper and stubs: `src/lib/appwrite.ts`
- [x] Navigation skeleton & basic screens: Onboarding, Login, Home, Profile
- [x] Add Register & CreatePlanWizard stubs

## M1.1 — Authentication & Session Restore
- [~] Implement `useAuth` hook with `getAccount` & `getProfile` (stubs present)
- [ ] Implement Login screen flow to call `login` and update auth state
- [ ] Implement Register flow (currently stubbed)
- [ ] Persist session & tokens securely (use SecureStore when integrating Appwrite tokens)

## M1.2 — Create Plan Wizard & Server Integration
- [~] Wizard UI with steps A..H (goal, weekdays, times, start date, gender, country, avatar, review) — Step A/B implemented
- [ ] Call `createPlan` Appwrite Function on submit and show `Creating Plan` loading
- [ ] Prefetch plan + today's sessions + streak and navigate to Home

## M1.3 — Today's Sessions & Completion Flow
- [ ] Implement `TodaysSessionScreen` with session cards and Salah tracker
- [ ] Implement optimistic `completeSession` mutation and rollback
- [ ] Update `streaks` collection & UI accordingly

## M2 — Calendar, Streak & Calendar Details
- [ ] Implement monthly calendar view and `getCalendarSummary` function
- [ ] Lazy load calendar details and ensure instant render from cache

## M3 — Leaderboard & Social
- [ ] Implement `leaderboardPublic` & `leaderboardFriends` functions
- [ ] Add friends flow: search, add, accept

## M4 — Profile & Account Management
- [ ] Edit profile (avatar, country, regenerate plan)
- [ ] Request account deletion (30-day delay) and cancel deletion

## Dev tasks / infra
- [x] Add documentation: `ARCHITECTURE.md`, `SCHEMA.md`, `API_CONTRACTS.md`, `SCREENS.md`, `PERFORMANCE.md`, `MILESTONES.md`
- [ ] Add unit tests for navigation and hooks
- [ ] Add E2E smoke test for cold start + QueryClient hydration

---

## Next actionable tasks (priority order)
1. Implement Login flow + session persistence (M1.1) — small testable increment
2. Implement Wizard Step A (goal) UI and validation (M1.2)
3. Add `TodaysSessionScreen` UI skeleton and local session list (M1.3)
4. Implement `completeSession` optimistic mutation (M1.3)

---

Notes:
- NativeWind will be used for styling; see `tailwind.config.js` and `babel.config.js` for config.
- Use `SecureStore` or other secure mechanism for tokens when integrating Appwrite auth in production.
