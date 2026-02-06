// Appwrite client stub
// Replace placeholder env values with real Appwrite endpoint and project id in production.
import { Client, Account, Databases, Functions, Storage } from 'appwrite';

const client = new Client()
  .setEndpoint(process.env.APPWRITE_ENDPOINT || 'https://[YOUR_APPWRITE_ENDPOINT]')
  .setProject(process.env.APPWRITE_PROJECT || 'your-project-id');

export const account = new Account(client);
export const databases = new Databases(client);
export const functions = new Functions(client);
export const storage = new Storage(client);

// High-level wrappers (stubs)
export async function createPlan(payload: any) {
  // call the Appwrite Function or database write
  return { planId: 'stub-plan-id', sessions: [] };
}

export async function completeSession(sessionId: string) {
  return { ok: true };
}

export async function getProfile(userId: string) {
  // In production: use `databases.getDocument` to fetch `users_profile` by userId
  return { userId, displayName: 'You', avatarId: null };
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

export async function getAccount() {
  try {
    // @ts-ignore
    const acc = await account.get();
    return acc;
  } catch (e) {
    return null;
  }
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
  // In production: query the `plans` collection for userId and status `active`
  // Stub: return null to indicate no active plan
  return null;
}
