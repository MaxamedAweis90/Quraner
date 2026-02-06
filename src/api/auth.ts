import { loginWithIdentifier, loginWithGoogle, getAccount, logout as appwriteLogout } from '../lib/appwrite';

export async function login(identifier: string, password: string) {
  const session = await loginWithIdentifier(identifier, password);
  // Optionally fetch account info here
  return session;
}

export async function loginGoogle() {
  return loginWithGoogle();
}

export async function logout() {
  await appwriteLogout();
}

export async function getSession() {
  const acc = await getAccount();
  return acc;
}
