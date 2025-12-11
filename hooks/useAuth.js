"use client";

import { useState, useEffect, useCallback } from 'react';
import { supabaseClient } from '@/lib/supabaseClient';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession();

        if (sessionError) {
          console.error('Session error:', sessionError);
          setError(sessionError.message);
        } else if (session?.user) {
          setUser(session.user);
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
        if (session?.user) {
          setUser(session.user);
          setError(null);
        } else {
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
      console.log('Attempting login with credentials:', { email: credentials.email, password: '[REDACTED]' });
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      console.log('Login fetch response status:', response.status);
      console.log('Login fetch response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Login response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      setUser(data.user);
      return data;
    } catch (err) {
      console.error('Login error:', err);
      console.error('Error type:', err.constructor.name);
      console.error('Error message:', err.message);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
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