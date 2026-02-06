import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/auth';
import { getProfile, getActivePlan } from '../lib/appwrite';
import { useAuth } from './useAuth';
import { QUERY_KEYS } from '../queries/keys';

export function useLogin() {
  const { setUser, setIsAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<any, Error, { email: string; password: string }>({
    mutationFn: async (vars: { email: string; password: string }) => {
      return login(vars.email, vars.password);
    },
    onSuccess: async (session: any) => {
      // session is Appwrite session; fetch account -> profile
      try {
        // Attempt to extract user id from session or session.user
        const acc = (session && (session as any).user) || session || null;
        const userId = acc ? (acc.$id || acc.id || acc.userId || acc.user?.$id || null) : null;
        // Best-effort: call getProfile and set cache
        if (userId) {
          const profile = await getProfile(userId as string);
          setUser(profile);
          setIsAuthenticated(true);
          // cache profile
          queryClient.setQueryData(QUERY_KEYS.PROFILE(userId as string), profile);
          // Check active plan and prefetch key queries
          const plan = await getActivePlan(userId as string);
          queryClient.setQueryData(QUERY_KEYS.PLAN(userId as string), plan);
        } else {
          // If no userId from session, attempt to call getProfile without id (fallback)
          const profile = await getProfile('');
          setUser(profile);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.warn('Login onSuccess follow up failed', e);
      }
    },
  });
}
