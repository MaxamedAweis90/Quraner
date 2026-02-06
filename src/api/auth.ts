import { loginWithEmail, getAccount, logout as appwriteLogout } from '../lib/appwrite';

export async function login(email: string, password: string) {
  const session = await loginWithEmail(email, password);
  // Optionally fetch account info here
  return session;
}

export async function logout() {
  await appwriteLogout();
}

export async function getSession() {
  const acc = await getAccount();
  return acc;
}
