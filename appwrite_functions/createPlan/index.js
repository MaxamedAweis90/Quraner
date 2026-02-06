const sdk = require('node-appwrite');

const TOTAL_QURAN_PAGES = 604;
const MAX_PLAN_RANGE_DAYS = 31;

const SALAH_ORDER = [
  { salah: 'fajr', when: 'before' },
  { salah: 'fajr', when: 'after' },
  { salah: 'dhuhr', when: 'before' },
  { salah: 'dhuhr', when: 'after' },
  { salah: 'asr', when: 'before' },
  { salah: 'asr', when: 'after' },
  { salah: 'maghrib', when: 'before' },
  { salah: 'maghrib', when: 'after' },
  { salah: 'isha', when: 'before' },
  { salah: 'isha', when: 'after' },
];

function parsePayload(req) {
  if (req.payload) {
    try {
      return JSON.parse(req.payload);
    } catch (e) {
      return null;
    }
  }
  if (req.body) {
    try {
      return typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    } catch (e) {
      return null;
    }
  }
  return null;
}

function toDateOnlyIso(date) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString();
}

function countActiveDays(startDateIso, planRangeDays, weekdaysActive) {
  const activeSet = new Set(weekdaysActive);
  let count = 0;
  for (let i = 0; i < planRangeDays; i += 1) {
    const day = new Date(startDateIso);
    day.setUTCDate(day.getUTCDate() + i);
    const weekday = day.getUTCDay();
    if (activeSet.has(weekday)) count += 1;
  }
  return count;
}

function getEnabledSessions(salahSessionsEnabled) {
  return SALAH_ORDER.filter((s) => {
    const entry = salahSessionsEnabled?.[s.salah];
    return entry && entry[s.when] === true;
  });
}

function distributePages(totalPages, sessionCount) {
  const base = Math.floor(totalPages / sessionCount);
  const remainder = totalPages % sessionCount;
  const result = [];
  for (let i = 0; i < sessionCount; i += 1) {
    result.push(base + (i < remainder ? 1 : 0));
  }
  return result;
}

module.exports = async ({ req, res, log, error }) => {
  try {
    const payload = parsePayload(req);
    if (!payload) {
      return res.json({ error: 'Invalid payload' }, 400);
    }

    const {
      userId,
      startDate,
      planRangeDays = 30,
      targetKhatms,
      weekdaysActive,
      salahSessionsEnabled,
    } = payload;

    if (!userId) return res.json({ error: 'Missing userId' }, 400);
    if (!Array.isArray(weekdaysActive) || weekdaysActive.length === 0) {
      return res.json({ error: 'weekdaysActive must have at least one day' }, 400);
    }

    const rangeDays = Math.min(Math.max(parseInt(planRangeDays, 10) || 30, 1), MAX_PLAN_RANGE_DAYS);
    const khatms = Math.max(parseInt(targetKhatms, 10) || 1, 1);
    const startDateIso = toDateOnlyIso(startDate);
    if (!startDateIso) return res.json({ error: 'Invalid startDate' }, 400);

    const planDaysCount = countActiveDays(startDateIso, rangeDays, weekdaysActive);
    if (planDaysCount === 0) return res.json({ error: 'No active days in range' }, 400);

    const totalPages = TOTAL_QURAN_PAGES * khatms;
    const pagesPerReadingDay = Math.ceil(totalPages / planDaysCount);

    const client = new sdk.Client();
    client
      .setEndpoint(process.env.APPWRITE_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    const databases = new sdk.Databases(client);

    const databaseId = process.env.APPWRITE_DATABASE_ID;
    const collectionPlans = process.env.APPWRITE_COLLECTION_PLANS;
    const collectionPlanDays = process.env.APPWRITE_COLLECTION_PLAN_DAYS;
    const collectionPlanSessions = process.env.APPWRITE_COLLECTION_PLAN_SESSIONS;
    const collectionStreaks = process.env.APPWRITE_COLLECTION_STREAKS;

    const userPermissions = [
      sdk.Permission.read(sdk.Role.user(userId)),
      sdk.Permission.update(sdk.Role.user(userId)),
      sdk.Permission.delete(sdk.Role.user(userId)),
    ];

    // Archive any existing active plan
    try {
      const activePlans = await databases.listDocuments(databaseId, collectionPlans, [
        sdk.Query.equal('userId', userId),
        sdk.Query.equal('status', 'active'),
      ]);
      for (const doc of activePlans.documents) {
        await databases.updateDocument(databaseId, collectionPlans, doc.$id, { status: 'archived' }, userPermissions);
      }
    } catch (e) {
      log('Failed to archive active plans (safe to ignore if none exist)');
    }

    const planId = sdk.ID.unique();
    const plan = await databases.createDocument(
      databaseId,
      collectionPlans,
      planId,
      {
        planId,
        userId,
        goalKhatms: khatms,
        totalPages,
        startDate: startDateIso,
        planRangeDays: rangeDays,
        weekdaysActive,
        salahSessionsEnabled: JSON.stringify(salahSessionsEnabled || {}),
        planDaysCount,
        pagesPerReadingDay,
        status: 'active',
      },
      userPermissions
    );

    const enabledSessions = getEnabledSessions(salahSessionsEnabled);
    const sessionsPerDay = enabledSessions.length;

    let createdDays = 0;
    let createdSessions = 0;

    for (let i = 0; i < rangeDays; i += 1) {
      const day = new Date(startDateIso);
      day.setUTCDate(day.getUTCDate() + i);
      const dayIso = day.toISOString();
      const weekday = day.getUTCDay();
      const isActiveDay = weekdaysActive.includes(weekday);

      const planDayId = sdk.ID.unique();
      const pagesAssigned = isActiveDay ? pagesPerReadingDay : 0;
      const totalPagesTarget = isActiveDay ? pagesPerReadingDay : 0;

      await databases.createDocument(
        databaseId,
        collectionPlanDays,
        planDayId,
        {
          planDayId,
          planId,
          userId,
          date: dayIso,
          totalPagesTarget,
          pagesAssigned,
          isRestDay: !isActiveDay,
          completed: false,
          missed: false,
        },
        userPermissions
      );

      createdDays += 1;

      if (!isActiveDay || sessionsPerDay === 0) continue;

      const distribution = distributePages(pagesPerReadingDay, sessionsPerDay);
      for (let s = 0; s < enabledSessions.length; s += 1) {
        const sessionId = sdk.ID.unique();
        const session = enabledSessions[s];
        await databases.createDocument(
          databaseId,
          collectionPlanSessions,
          sessionId,
          {
            sessionId,
            planDayId,
            userId,
            date: dayIso,
            salahName: session.salah,
            when: session.when,
            pagesTarget: distribution[s],
            completed: false,
            completedAt: null,
          },
          userPermissions
        );
        createdSessions += 1;
      }
    }

    // Ensure streak exists
    try {
      const existing = await databases.listDocuments(databaseId, collectionStreaks, [
        sdk.Query.equal('userId', userId),
        sdk.Query.limit(1),
      ]);
      if (existing.documents.length === 0) {
        await databases.createDocument(
          databaseId,
          collectionStreaks,
          sdk.ID.unique(),
          {
            userId,
            currentStreak: 0,
            longestStreak: 0,
            lastCompletedDate: null,
            totalDaysRead: 0,
          },
          userPermissions
        );
      }
    } catch (e) {
      log('Failed to create streak (safe to ignore if exists)');
    }

    return res.json({
      plan,
      stats: {
        createdDays,
        createdSessions,
        planDaysCount,
        pagesPerReadingDay,
      },
    });
  } catch (e) {
    error(e.message || 'Unknown error');
    return res.json({ error: 'Create plan failed' }, 500);
  }
};
