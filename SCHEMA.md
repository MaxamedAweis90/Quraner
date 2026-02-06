# Data Schema (concise)

All timestamps: ISO8601 strings (UTC). IDs: UUID strings.

Interfaces (TypeScript examples):

interface Plan {
  id: string;
  title: string;
  startDate: string; // ISO8601
  endDate?: string;
  targetPages: number;
  createdAt: string;
  updatedAt: string;
}

interface Session {
  id: string;
  planId: string;
  date: string; // ISO8601
  pagesRead: number;
  durationMinutes?: number;
  notes?: string;
  createdAt: string;
}

interface Bookmark {
  id: string;
  surah: number;
  ayah: number;
  note?: string;
  createdAt: string;
}

interface Settings {
  locale: string;
  theme: 'light'|'dark'|'system';
  notificationsEnabled: boolean;
}

Storage choices:
- Local-first: SQLite (expo-sqlite) or MMKV/AsyncStorage for simple needs.
- Sync strategy: Last-write-wins with server timestamps or per-field versioning.

Appwrite collections (short):
- `users_profile` — userId, displayName, gender, countryCode, avatarId, totalDaysRead, streak info
- `avatars` — avatarId, name, assetType, assetRef, genderTag, isActive
- `plans` — planId, userId, goalKhatms, totalPages, startDate, planRangeDays, weekdaysActive, salahSessionsEnabled, pagesPerReadingDay
- `plan_days` — planDayId, planId, userId, date, totalPagesTarget, pagesAssigned, isRestDay, completed, missed
- `plan_sessions` — sessionId, planDayId, userId, date, salahName, when, pagesTarget, completed, completedAt
- `streaks` — userId, currentStreak, longestStreak, lastCompletedDate, totalDaysRead
- `friendships`, `deletion_requests`, `events` follow earlier spec
