import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getProfile } from '../lib/appwrite';
import { QUERY_KEYS } from './keys';

export function useProfile(userId: string | null) {
  const queryClient = useQueryClient();
  return useQuery({
    queryKey: QUERY_KEYS.PROFILE(userId),
    queryFn: async () => {
      if (!userId) throw new Error('No userId');
      const profile = await getProfile(userId);
      return profile;
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}
