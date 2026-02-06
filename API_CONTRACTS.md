# API Contracts (Appwrite Functions)

Conventions:
- All Appwrite Functions accept JSON input and return JSON.
- Dates in requests/responses: ISO8601 (yyyy-mm-dd or full timestamp as needed).

Functions:

`createPlan`
- Input: { userId, startDate, planRangeDays = 30, targetKhatms, weekdaysActive[], salahSessionsEnabled }
- Output: { plan, sessions[] }
- Side effects: creates `plans`, `plan_days`, and `plan_sessions` documents; initializes streaks if missing.
- Pseudocode: validate `planRangeDays<=31`; compute totalPages = 604*targetKhatms; compute planDays = count active weekdays in range; pagesPerReadingDay = ceil(totalPages / planDays); for each day distribute pages across enabled sessions evenly, handle remainder by adding +1 from earliest sessions.

`completeSession`
- Input: { sessionId, userId, completedAt }
- Output: updated session and updated streak summary
- Side effects: mark session completed, update `plan_day` completion, update `streaks` atomically. If day missed logic: if active day not fully completed by end of day, mark missed and reset streak.

`getCalendarSummary`
- Input: { userId, month }
- Output: list of day states (done/missed/rest) and stats

`leaderboardPublic` / `leaderboardFriends`
- Input: { limit, cursor? } / { userId, limit }
- Output: top users sorted by `totalDaysRead` (not exposing private plan details)

`requestAccountDeletion` / `cancelDeletion`
- Input: { userId }
- Output: request id / status

`getProfile` / `updateProfile`
- Standard get/update profile endpoints

Notes:
- Use Functions for atomic multi-document operations and heavy computations.
- Ensure idempotency for `createPlan` and `completeSession`.
