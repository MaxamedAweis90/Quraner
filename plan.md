You are my AI engineering agent. Your job: create a NEW React Native (Expo) app and implement an Islam productivity app (Duolingo/Airlearn-style) with Appwrite backend. Do NOT invent features outside this spec. Produce: (1) architecture plan, (2) database schemas, (3) API/contracts, (4) screen-by-screen implementation plan, (5) performance/caching strategy, then start implementation in small, testable increments.

========================
0) TECH STACK (fixed)
========================
Frontend:
- React Native (Expo)
- React Navigation
- TanStack Query for server-state
- Zustand (optional) for UI/local state only
- TypeScript
Backend:
- Appwrite (Auth, Database, Storage, Functions, Realtime if needed)
Other:
- Date handling: dayjs
- Animations: Reanimated + Lottie (optional)
- Push notifications (optional later)

Performance requirements (non-negotiable):
- Minimal fetch on app open (fast cold start).
- Use caching/prefetching/persistence properly.
- Lazy load heavy screens (rank/events/streak calendar).
- Avoid rerender storms; memoize lists.
- Offline-friendly: app shows last known plan & progress instantly.

========================
1) CORE PRODUCT RULES
========================
- App works ALL YEAR (not Ramadan-only). Plans do NOT reset yearly; streak continues until user breaks it.
- Quran total pages = 604.
- User sets target: finish Quran 1x, 2x, 3x, etc within N days (based on starting date + duration derived from their weekly days).
- Plan computation:
  - totalPages = 604 * targetKhatms
  - weekdaysActive chosen by user (specific weekdays 0..6)
  - startDate chosen by user
  - planRangeDays default: 30 days (unless you later add a duration selector; for now assume 30)
  - planDays = count of active weekdays in [startDate..startDate+planRangeDays-1]
  - pagesPerReadingDay = ceil(totalPages / planDays)
- Each reading day has sessions tied to salah times: BEFORE and/or AFTER each salah (Fajr, Dhuhr, Asr, Maghrib, Isha).
  - User can enable before, after, both, or neither per salah.
  - Plan distributes that day’s pages across enabled sessions (even split; handle remainder by distributing +1 starting from earliest sessions).
- If a day is missed (active reading day not completed by end of day), streak breaks; calendar marks Missed.

========================
2) SCREENS / ROUTES (updated)
========================
S1) Onboarding (intro, Duolingo-style)
S2) Login
S3) Register
S4) Post-register: User Info / Plan Setup Wizard (multi-step)
    Step A: Quran goal: finish Quran [1x|2x|3x|custom]
    Step B: Days per week user will read (choose specific weekdays)
    Step C: Times per day (Salah sessions):
        - For each salah: toggle BEFORE and AFTER
        - User can enable both or only one
    Step D: Starting date (date picker)
    Step E: “Who are you?” (Brother / Sister)
    Step F (NEW): “Where are you from?” (Select Country)
        - store countryCode (ISO-3166-1 alpha-2) + countryName
    Step G: Avatar selector (animated avatars; user stores avatarId; no user-uploaded images)
    Step H: Review (“Start your plan”) showing all chosen info
S5) Creating Plan Loading screen:
    - Shows “Creating your plan…”
    - Must prefetch/cache key queries so next screens feel instant
S6) Main Tabs (Home container)
    Tab 1: Home / Plan
    Tab 2: Spar/Rank
    Tab 3: Profile
S7) Events screen (separate route OR section in Home):
    - Upcoming Islamic events (include Ramadan with date)
    - “Coming soon!” section below
S8) Streak & Calendar Details screen (NEW, opened from Home via 🔥 button)
    - full calendar + detailed stats

Future (placeholder, not implemented now):
- Quran reading mode (kitab icon): Surah chooser; “coming soon” route stub only.

========================
3) HOME / PLAN SCREEN (updated layout + behavior)
========================
Home/Plan screen must NOT show the full calendar inline anymore.

A) Header Row (top)
- Top-left: 🔥 Streak button showing current streak number (example: “🔥 12”).
  - On press: open S8 Streak & Calendar Details screen.
- Immediately to the right of 🔥: Country indicator (flag + country name/code) from profile.
  - Display only for now (optional: on press navigate Profile later).

B) Salah Tracker (NEW) under header
- Show current/next salah highlighted.
- UI:
  - current salah in the center (pill/card highlight)
  - nearby upcoming salahs as small circles left/right in a horizontal tracker
- Timing source:
  - MVP allowed: basic time-block approximation OR local library if available.
  - Do not block release on perfect prayer-time calculations. Keep modular.

C) Reading Habit Summary (NEW) under Salah tracker
Derived locally (from cached plan/progress):
- Total pages remaining (active plan)
- Today’s pages target (total)
- Breakdown by enabled sessions for today:
  - e.g., After Fajr: 4 pages, Before Dhuhr: 3 pages, etc.

D) Daily Alerts / Session Cards (keep core logic)
- One card per planned session for today:
  - Default gray
  - On “Finished” => green (optimistic)
  - After persisted completion => fire/yellow “Done”
- Completing sessions updates:
  - session completion state
  - day completion (if all sessions done)
  - pages remaining + today summary
  - streak counters
- Allow browsing prior days (read-only MVP) if already built; otherwise implement “today only” first.

========================
4) STREAK & CALENDAR DETAILS SCREEN (NEW)
========================
Opened from Home via 🔥 button.
- Shows:
  - Calendar (month view; Done 🔥, Missed, Rest day)
  - Stats: currentStreak, longestStreak, totalDaysRead, lastCompletedDate
  - Optional: monthly completion percentage
Performance:
- Must render instantly from persisted cache, then optionally refresh in background.
- Fetch detailed plan_days only on this screen (lazy).

========================
5) SPAR / RANK SCREEN (same)
========================
- Segments: Public | Friends
- Friends: search users, add friend, invite via WhatsApp share link
- Leaderboard card: name, animated avatar, totalDaysRead (rank metric), currentStreak or lastCompletedDate
- Paginated and cached. Minimal payload.

========================
6) PROFILE SCREEN (same + country)
========================
- Update: avatar, plan preferences (regenerate plan), country, gender if needed
- Logout
- Danger zone:
  - Delete account after 30 days (scheduled deletion)
  - Allow cancel deletion

========================
7) APPWRITE DATA MODEL (updated)
========================
Design schemas and indexes. Use 1 database with multiple collections.

A) users_profile
- userId (string, same as Appwrite auth user id, unique)
- displayName
- gender: 'brother' | 'sister'
- countryCode (string, ISO alpha-2)
- countryName (string)
- avatarId (ref)
- createdAt, updatedAt

B) avatars
- avatarId
- name
- assetType (lottie|rive|other)
- assetRef (storage file id or URL)
- genderTag (optional)
- isActive

C) plans
- planId
- userId
- goalKhatms (int)
- totalPages (int)
- startDate (ISO)
- planRangeDays (int, default 30)
- weekdaysActive (array of 0..6)
- salahSessionsEnabled map:
  fajr: {before: bool, after: bool}, ... isha
- planDaysCount (int)
- pagesPerReadingDay (int)
- status: active|archived
- createdAt

D) plan_days
- planDayId
- planId
- userId
- date (ISO yyyy-mm-dd, indexed)
- totalPagesTarget
- pagesAssigned (int)
- isRestDay (bool)
- completed (bool)
- missed (bool)

E) plan_sessions
- sessionId
- planDayId
- userId
- date (ISO yyyy-mm-dd, indexed)
- salahName (fajr|dhuhr|asr|maghrib|isha)
- when (before|after)
- pagesTarget
- completed (bool)
- completedAt

F) streaks
- userId (unique)
- currentStreak (int)
- longestStreak (int)
- lastCompletedDate (ISO yyyy-mm-dd)
- totalDaysRead (int)
- updatedAt

G) friendships
- id
- requesterId
- addresseeId
- status: pending|accepted|blocked
- createdAt

H) deletion_requests
- userId
- requestedAt
- scheduledDeletionAt (requestedAt + 30 days)
- status: pending|cancelled|done

I) events
- eventId
- title (e.g., Ramadan)
- startDate (ISO)
- endDate (ISO)
- hijriInfo (optional)
- isActive

Permissions:
- Users can read/write their own profile/plan/progress.
- Leaderboard must NOT expose private plan details:
  - Either create a derived public_stats collection
  - OR expose leaderboard via Appwrite Function returning minimal safe fields only.

========================
8) API / CONTRACTS (same + calendar support)
========================
Use Appwrite SDK in RN; use Functions for:
- createPlan(userId, inputs) -> creates plan + plan_days + plan_sessions + initializes streak if missing
- completeSession(sessionId) -> marks done, updates day completion, updates streak counters, updates remaining pages
- leaderboardPublic(page) / leaderboardFriends(userId)
- requestAccountDeletion(userId)
- cancelDeletion(userId)
- getCalendarSummary(userId, month) (optional) -> returns day states (done/missed/rest) for the streak details screen

Client:
- TanStack Query for fetch/mutation, optimistic updates for session completion.
- Persist query cache (AsyncStorage) for fast startup.
- Prefetch after login and during “Creating plan…” screen.

========================
9) NAVIGATION LOGIC (updated)
========================
- App launch:
  - If no auth session => Onboarding -> Login/Register
  - If logged in:
    - If user has active plan => Main Tabs (Home)
    - Else => Wizard
- After register:
  - Always Wizard (includes country)
- After plan creation:
  - Creating Plan Loading screen (prefetch essential queries)
  - Then Home/Plan screen
- From Home:
  - 🔥 button -> Streak & Calendar Details screen

========================
10) PERFORMANCE & CACHING PLAN (updated)
========================
TanStack Query:
- Persist cache to AsyncStorage
- StaleTime:
  - profile/plan: hours
  - today sessions + streak: minutes
  - leaderboard: 10–30 minutes
  - calendar details: fetch only on open; cache per month
Prefetching (Creating plan screen):
- active plan
- today plan_day + sessions
- streak summary
- minimal profile (avatar + country)
- events summary
Lazy loading:
- Rank tab loads on focus
- Events loads summary first
- Streak calendar details loads only when opened
Optimistic updates:
- Completing a session updates UI immediately (cards + summaries)
- Rollback on failure
Minimal payload for lists.

========================
11) DELIVERABLES
========================
A) List all screens + routes and how they connect.
B) Full Appwrite schema definitions + indexes + permissions.
C) Function specs + pseudo-code for plan generation, session distribution, and streak update.
D) React Native folder structure proposal.
E) Step-by-step implementation plan (milestones) with smallest testable increments.
F) Performance checklist and caching configuration.
G) Then start implementing milestones in order:
   1) Project bootstrap + navigation skeleton
   2) Auth + session restore + gating
   3) Onboarding + Login/Register
   4) Wizard (including country) + profile write
   5) createPlan function + Creating Plan prefetch
   6) Home/Plan updated UI + complete session
   7) Streak & Calendar Details screen (lazy loaded)
   8) Profile update + logout + deletion request
   9) Rank (public/friends) + search/invite
   10) Events + Coming soon
   11) Quran “coming soon” stub route

========================
12) IMPORTANT CONSTRAINTS
========================
- Do not add speech-to-text.
- Do not add user-uploaded images.
- Don’t build Quran reader now; only stub for “coming soon”.
- Keep data private; leaderboard must not leak private plan details.
- Build for smooth UX: low network calls, caching, and fast load times.

Now: create the new Expo RN project, write the architecture + schema plan, then begin with milestone (1) project bootstrap + navigation skeleton.