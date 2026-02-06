import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../api/auth';
import { getProfile, getActivePlan, getAccount } from '../lib/appwrite';
import { useAuth } from './useAuth';
import { QUERY_KEYS } from '../queries/keys';

export function useLogin() {
  const { setUser, setIsAuthenticated, setHasActivePlan } = useAuth();
  const queryClient = useQueryClient();

  return useMutation<any, Error, { identifier: string; password: string }>({
    mutationFn: async (vars: { identifier: string; password: string }) => {
      return login(vars.identifier, vars.password);
    },
    onSuccess: async (session: any) => {
      // session is Appwrite session; fetch account -> profile
      try {
        const account = await getAccount();
        const userId = account ? ((account as any).$id ?? (account as any).id ?? null) : null;
        if (!userId) {
          setIsAuthenticated(true);
          return;
        }
        const profile = await getProfile(userId as string);
        setUser(profile);
        setIsAuthenticated(true);
        // cache profile
        queryClient.setQueryData(QUERY_KEYS.PROFILE(userId as string), profile);
        // Check active plan and prefetch key queries
        const plan = await getActivePlan(userId as string);
        queryClient.setQueryData(QUERY_KEYS.PLAN(userId as string), plan);
        setHasActivePlan(!!plan);
      } catch (e) {
        console.warn('Login onSuccess follow up failed', e);
      }
    },
  });
}
