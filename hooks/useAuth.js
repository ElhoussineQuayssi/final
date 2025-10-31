"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFullUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error('Fetch full user error:', err);
      setUser(null);
      return null;
    }
  }, []);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
        } else if (session?.user) {
          await fetchFullUser();
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        console.log('useAuth: onAuthStateChange triggered:', event, !!session?.user);
        if (session?.user) {
          console.log('useAuth: onAuthStateChange fetching full user');
          await fetchFullUser();
          setError(null);
        } else {
          console.log('useAuth: onAuthStateChange setting user to null');
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('useAuth: Starting login API call');
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      console.log('useAuth: API response received:', response.ok, data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      console.log('useAuth: Setting session and user state');
      // Set the session in the client to synchronize auth state
      await supabaseClient.auth.setSession(data.session);
      setUser(data.user);
      console.log('useAuth: User state set immediately after setUser, user:', !!data.user);
      console.log('useAuth: Session set, checking auth state...');
      const { data: { session }, error: sessionCheck } = await supabaseClient.auth.getSession();
      console.log('useAuth: Post-setSession check - session exists:', !!session, 'error:', sessionCheck);
      return data;
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
      console.log('useAuth: Loading set to false');
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });

      setUser(null);
      // Redirect to login page
      window.location.href = '/admin/login';
    } catch (err) {
      console.error('Logout error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return data.user;
      } else {
        setUser(null);
        return null;
      }
    } catch (err) {
      console.error('Check auth error:', err);
      setUser(null);
      return null;
    }
  }, []);

  return {
    user,
    isLoading,
    error,
    login,
    logout,
    checkAuth,
    isAuthenticated: !!user,
  };
}