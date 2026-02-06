import { create } from 'zustand';
import { getAccount, getActivePlan, getProfile } from '../lib/appwrite';

type AuthState = {
  isAuthenticated: boolean | null;
  user: any | null;
  hasActivePlan: boolean | null;
  setUser: (user: any | null) => void;
  setIsAuthenticated: (value: boolean) => void;
  setHasActivePlan: (value: boolean | null) => void;
  refreshAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: null,
  user: null,
  hasActivePlan: null,
  setUser: (user) => set({ user }),
  setIsAuthenticated: (value) => set({ isAuthenticated: value }),
  setHasActivePlan: (value) => set({ hasActivePlan: value }),
  refreshAuth: async () => {
    try {
      const acc = await getAccount();
      if (!acc) {
        set({ isAuthenticated: false, user: null, hasActivePlan: false });
        return;
      }
      const userId = ((acc as any).$id ?? (acc as any).id ?? '') as string;
      const profile = userId ? await getProfile(userId) : null;
      const plan = userId ? await getActivePlan(userId) : null;
      set({
        isAuthenticated: true,
        user: profile,
        hasActivePlan: !!plan,
      });
    } catch (e) {
      set({ isAuthenticated: false, user: null, hasActivePlan: false });
    }
  },
}));
