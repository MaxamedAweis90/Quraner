# Milestones

M1 — Project Setup & Foundation
- [x] Initialize Expo + TypeScript project (created under `./app`)
- [x] Configure Reanimated Babel plugin (`babel.config.js`)
- [ ] Configure EAS (manual step pending: run `npx eas build:configure` and set env vars)
- [x] Add TanStack Query with simple AsyncStorage-based persistence utility (`src/lib/queryClient.ts`, `src/lib/queryClientPersister.ts`)
- [x] Add Appwrite client wrapper (stubs) and local mocks (`src/lib/appwrite.ts`)
- [x] Implement Navigation skeleton and basic screens (Onboarding, Login, Home, Profile)

Notes: App moved to repo root (moved from `./app`). Next: Auth session restore, Appwrite integration, EAS build validation for Lottie/Reanimated, and add the Create Plan wizard UI for milestone 1 completion.

M2 — Core Features
- CreatePlan wizard and Appwrite Function integration
- Plan generation (plan_days + plan_sessions) and prefetching
- Today's Session UI and optimistic completion

M3 — Offline & Sync
- Implement offline queue and background sync
- Ensure idempotent functions and reconcile conflicts

M4 — Social & Leaderboard
- Friend requests, friends leaderboard, invites

M5 — Polish & Release
- EAS release builds, tests, performance tuning, store submission
