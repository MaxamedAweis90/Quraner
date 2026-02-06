# Data Schema (Appwrite)

Database: `quraner_db`

Notes:
- Appwrite built-in timestamps: `$createdAt`, `$updatedAt` are used instead of custom fields.
- Date fields below use Appwrite `datetime` type.
- IDs: use Appwrite document IDs (userId matches auth `$id`).

Collections:

## users
- userId (string, unique)
- name (string)
- username (string, unique)
- email (string, unique)
- gender (enum: Brother | Sister, required)
- countryCode (string, optional)
- countryName (string, optional)
- avatarId (string, optional)

## avatars
- avatarId (string)
- name (string)
- username (string, optional)
- assetType (string)
- assetRef (string)
- genderTag (string, optional)
- isActive (boolean)

## plans
- planId (string)
- userId (string)
- goalKhatms (integer)
- totalPages (integer)
- startDate (datetime)
- planRangeDays (integer)
- weekdaysActive (integer[])
- salahSessionsEnabled (string, JSON)
- planDaysCount (integer)
- pagesPerReadingDay (integer)
- status (string: active | archived)

## plan_days
- planDayId (string)
- planId (string)
- userId (string)
- date (datetime)
- totalPagesTarget (integer)
- pagesAssigned (integer)
- isRestDay (boolean)
- completed (boolean)
- missed (boolean)

## plan_sessions
- sessionId (string)
- planDayId (string)
- userId (string)
- date (datetime)
- salahName (string)
- when (string: before | after)
- pagesTarget (integer)
- completed (boolean)
- completedAt (datetime, optional)

## streaks
- userId (string, unique)
- currentStreak (integer)
- longestStreak (integer)
- lastCompletedDate (datetime, optional)
- totalDaysRead (integer)

## friendships
- requesterId (string)
- addresseeId (string)
- status (string: pending | accepted | blocked)
- createdAt (datetime)

## deletion
- userId (string, unique)
- requestedAt (datetime)
- scheduledDeletionAt (datetime)
- status (string: pending | cancelled | done)

## events
- eventId (string)
- title (string)
- startDate (datetime)
- endDate (datetime, optional)
- hijriInfo (string, optional)
- isActive (boolean)
