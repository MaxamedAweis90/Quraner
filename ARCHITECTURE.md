# Architecture Overview — Quraner

**You are my AI engineering agent. Your job: create a NEW React Native (Expo) app and implement an Islam productivity app (Duolingo/Airlearn-style) with Appwrite backend. Do NOT invent features outside this spec. Produce: (1) architecture plan, (2) database schemas, (3) API/contracts, (4) screen-by-screen implementation plan, (5) performance/caching strategy, then start implementation in small, testable increments.**

- Platform: Expo (managed) + React Native + TypeScript.
- Build: EAS required for production builds (configure `eas.json`).
- JS engine: Enable Hermes for Android in production for better performance.
- Reanimated: Use `react-native-reanimated` + add plugin to `babel.config.js`: `plugins: ['react-native-reanimated/plugin']` and add prebuild plugin if using config plugins.

Recommended layout (root):
- src/
  - components/  (reusable UI)
  - screens/     (screen-level components)
  - navigation/  (React Navigation stacks)
  - services/    (network, sync, storage)
  - api/         (API contracts & adapters)
  - models/      (TypeScript models/interfaces)
  - hooks/       (custom hooks)
  - store/       (zustand or other)

Notes:
- Keep business logic out of UI; use services and hooks.
- Prefer local-first storage (SQLite / MMKV) and sync via server Functions when backend available.
- Enforce code quality with ESLint, Prettier and run tests in CI before EAS builds.
