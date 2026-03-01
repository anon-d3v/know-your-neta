import { useEffect, useCallback } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';
import {
  getProfile,
  login,
  register,
  logout,
  type LoginParams,
  type RegisterParams,
} from '@/api/auth';

export function useAuth() {
  const store = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      store.setSession(session);
      if (session?.user) {
        getProfile(session.user.id)
          .then(store.setProfile)
          .catch(() => {});
      }
      store.setInitialized(true);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      store.setSession(session);
      if (session?.user) {
        try {
          const profile = await getProfile(session.user.id);
          store.setProfile(profile);
        } catch {
          // Profile fetch failed — continue with null profile
        }
      } else {
        store.setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = useCallback(async (params: LoginParams) => {
    store.setLoading(true);
    try {
      await login(params);
    } finally {
      store.setLoading(false);
    }
  }, []);

  const handleRegister = useCallback(async (params: RegisterParams) => {
    store.setLoading(true);
    try {
      await register(params);
    } finally {
      store.setLoading(false);
    }
  }, []);

  const handleLogout = useCallback(async () => {
    store.setLoading(true);
    try {
      await logout();
      store.reset();
    } finally {
      store.setLoading(false);
    }
  }, []);

  return {
    session: store.session,
    user: store.user,
    profile: store.profile,
    isLoading: store.isLoading,
    isAuthenticated: !!store.session,
    isInitialized: store.isInitialized,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
