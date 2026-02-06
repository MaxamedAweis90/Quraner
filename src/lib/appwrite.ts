// Appwrite client stub
// Replace placeholder env values with real Appwrite endpoint and project id in production.
import { Client, Account, Databases, Functions, Storage, ID, Query, Permission, Role } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT || 'https://[YOUR_APPWRITE_ENDPOINT]')
  .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID || 'your-project-id');

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);

export const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID || 'quraner_db';
export const COLLECTIONS = {
  users: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_USERS || 'users',
  avatars: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_AVATARS || 'avatars',
  plans: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_PLANS || 'plans',
  planDays: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_PLAN_DAYS || 'plan_days',
  planSessions: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_PLAN_SESSIONS || 'plan_sessions',
  streaks: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_STREAKS || 'streaks',
  friendships: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_FRIENDSHIPS || 'friendships',
  deletion: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_DELETION || 'deletion',
  events: process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_EVENTS || 'events',
} as const;

export const BUCKETS = {
  avatarBrother: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_AVATAR_BROTHER || 'avatar_brother',
  avatarSister: process.env.EXPO_PUBLIC_APPWRITE_BUCKET_AVATAR_SISTER || 'avatar_sister',
} as const;

export const FUNCTIONS = {
  createPlan: process.env.EXPO_PUBLIC_APPWRITE_FUNCTION_CREATE_PLAN || 'createPlan',
} as const;

// High-level wrappers (stubs)
export async function createPlan(payload: any) {
  try {
    const execution = await functions.createExecution(FUNCTIONS.createPlan, JSON.stringify(payload), false);
    const response = (execution as any).response || '';
    if (response) {
      try {
        return JSON.parse(response);
      } catch (e) {
        return execution;
      }
    }
    return execution;
  } catch (e) {
    console.warn('createPlan failed', e);
    throw e;
  }
}

export async function completeSession(sessionId: string) {
  return { ok: true };
}

export async function getProfile(userId: string) {
  try {
    const profile = await databases.getDocument(DATABASE_ID, COLLECTIONS.users, userId);
    return profile;
  } catch (e) {
    return null;
  }
}

export async function updateProfile(userId: string, updates: Record<string, any>) {
  const payload = { ...updates };
  const profile = await databases.updateDocument(DATABASE_ID, COLLECTIONS.users, userId, payload);
  return profile;
}

export async function getProfileByUsername(username: string) {
  const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.users, [
    Query.equal('username', username),
    Query.limit(1),
  ]);
  return result.documents[0] ?? null;
}

// Auth helpers
export async function loginWithEmail(email: string, password: string) {
  try {
    // Appwrite SDK: account.createEmailSession
    // @ts-ignore
    const session = await account.createEmailSession(email, password);
    return session;
  } catch (e) {
    console.warn('loginWithEmail failed (stub)', e);
    throw e;
  }
}

export async function loginWithIdentifier(identifier: string, password: string) {
  const trimmed = identifier.trim();
  let email = trimmed;
  if (!trimmed.includes('@')) {
    const profile = await getProfileByUsername(trimmed.toLowerCase());
    if (!profile || !(profile as any).email) {
      throw new Error('Username not found');
    }
    email = (profile as any).email as string;
  }
  return loginWithEmail(email, password);
}

export async function loginWithGoogle() {
  const redirect = 'quraner://auth';
  // @ts-ignore
  await account.createOAuth2Session('google', redirect, redirect);
  // If session is created, this will return account data
  // @ts-ignore
  return account.get();
}

export async function getAccount() {
  try {
    // @ts-ignore
    const acc = await account.get();
    return acc;
  } catch (e) {
    return null;
  }
}

export async function registerWithEmail(params: {
  name: string;
  username: string;
  email: string;
  password: string;
  gender: 'Brother' | 'Sister';
  avatarId?: string | null;
  countryCode?: string | null;
  countryName?: string | null;
}) {
  const accountRecord = await account.create(ID.unique(), params.email, params.password, params.name);
  const userPermissions = [
    Permission.read(Role.user(accountRecord.$id)),
    Permission.update(Role.user(accountRecord.$id)),
    Permission.delete(Role.user(accountRecord.$id)),
  ];
  const profile = await databases.createDocument(DATABASE_ID, COLLECTIONS.users, accountRecord.$id, {
    userId: accountRecord.$id,
    name: params.name,
    username: params.username,
    email: params.email,
    avatarId: params.avatarId ?? null,
    gender: params.gender,
    countryCode: params.countryCode ?? null,
    countryName: params.countryName ?? null,
  }, userPermissions);
  // Start a session so wizard can load immediately
  await account.createEmailSession(params.email, params.password);
  return { account: accountRecord, profile };
}

export async function listAvatarFiles(bucketId: string) {
  const files = await storage.listFiles(bucketId, [Query.limit(100)]);
  return files.files.map((file) => ({
    id: file.$id,
    name: file.name,
    url: storage.getFileView(bucketId, file.$id).toString(),
  }));
}

export async function logout() {
  try {
    // @ts-ignore
    await account.deleteSession('current');
  } catch (e) {
    console.warn('logout failed', e);
  }
}

// Plan helpers
export async function getActivePlan(userId: string) {
  try {
    const result = await databases.listDocuments(DATABASE_ID, COLLECTIONS.plans, [
      Query.equal('userId', userId),
      Query.equal('status', 'active'),
      Query.limit(1),
    ]);
    return result.documents[0] ?? null;
  } catch (e) {
    return null;
  }
}
