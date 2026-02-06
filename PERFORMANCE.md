# Performance Guidelines

TanStack Query
- Persist cache to AsyncStorage via `@tanstack/query-persist-client`.
- Hydrate QueryClient before launching navigation to avoid flash of unauthenticated or empty UI.
- Stale time recommendations:
  - profile/plan: 15 minutes
  - today sessions + streak: 1 minute
  - leaderboard: 10-30 minutes
  - calendar details: cache per month and only fetch on open

Optimistic updates
- `completeSession` should update session state and day progress optimistically; rollback on failure.

Prefetching
- After `createPlan`, prefetch: `plan`, `today session`, `streak`.
- On login, prefetch minimal `profile` and `today session` only.

Native animations
- Reanimated and Lottie require EAS builds for full validation. Add EAS validation as part of CI.

General
- Lazy load heavy screens (Leaderboards, Events, Calendar) and Lottie assets only when needed.
- Use FlatList with memoized item renderers for lists.
