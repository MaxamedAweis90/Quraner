import { useEffect, useState } from 'react';
import { getAccount, getProfile, getActivePlan } from '../lib/appwrite';

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [hasActivePlan, setHasActivePlan] = useState<boolean | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const acc = await getAccount();
        if (!acc) {
          if (mounted) setIsAuthenticated(false);
          return;
        }
        const userId = ((acc as any)['$id'] ?? (acc as any).id ?? '') as string;
        const profile = await getProfile(userId);
        if (mounted) {
          setUser(profile);
          setIsAuthenticated(true);
        }
        // Check active plan
        const plan = await getActivePlan(userId);
        if (mounted) setHasActivePlan(!!plan);
      } catch (e) {
        if (mounted) setIsAuthenticated(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return { isAuthenticated, user, setUser, setIsAuthenticated, hasActivePlan };
}

export function useAuthActions() {
  // helper for non-component code if needed (not strictly required now)
  const { setIsAuthenticated, setUser } = useAuth();
  return { setIsAuthenticated, setUser };
}
