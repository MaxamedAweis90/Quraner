# Screens (high level)

- S1 Onboarding — intro, Duolingo-style; collect gender and initial avatar selection.
- S2 Login
- S3 Register
- S4 Wizard (post-register): Quran goal, weekdays, salah before/after toggles, startDate, gender, country, avatar, review
- S5 Creating Plan Loading — shows progress while plan is generated; prefetch essential queries
- S6 Main Tabs: Home (Plan), Rank, Profile
- S7 Events — upcoming Islamic events
- S8 Streak & Calendar Details — month calendar and stats; lazy loaded

Per-screen notes:
- `CreatePlan` should call `createPlan` function and prefetch plan + today's sessions.
- `Home` reads cached plan + today sessions; optimistic updates for completing sessions.
- `Streak & Calendar` loads detailed data lazily and uses cached month-level data for instant render.
