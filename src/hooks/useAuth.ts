import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const auth = useAuthStore();

  useEffect(() => {
    if (auth.isAuthenticated === null) {
      auth.refreshAuth();
    }
  }, [auth.isAuthenticated, auth.refreshAuth]);

  return auth;
}
