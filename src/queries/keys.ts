export const QUERY_KEYS = {
  PROFILE: (userId: string | null) => ['profile', userId] as const,
  PLAN: (userId: string | null) => ['plan', userId] as const,
  TODAY_SESSIONS: (userId: string | null) => ['today_sessions', userId] as const,
  STREAK: (userId: string | null) => ['streak', userId] as const,
};