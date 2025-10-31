"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginForm from '@/components/AdminLoginForm/AdminLoginForm';
import { useAuth } from '@/hooks/useAuth';

export default function AdminLoginPage() {
  const { user, login, isLoading, error, isAuthenticated } = useAuth();
  const router = useRouter();

  // Redirect if already authenticated
  useEffect(() => {
    console.log('Login page useEffect: isAuthenticated =', isAuthenticated, 'user =', !!user);
    if (isAuthenticated) {
      console.log('Login page: Redirecting to dashboard due to authentication');
      router.push('/admin/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (formData) => {
    try {
      console.log('Starting login process');
      await login({
        email: formData.email,
        password: formData.password,
      });
      console.log('Login API call completed, waiting for auth state sync...');
      // Wait a brief moment for auth state to synchronize
      await new Promise(resolve => setTimeout(resolve, 100));
      console.log('After delay, isAuthenticated:', isAuthenticated);
      console.log('Current user state:', !!user);
      console.log('About to redirect to dashboard');
      // Redirect to dashboard on successful login
      router.push('/admin/dashboard');
      console.log('Redirect initiated');
    } catch (err) {
      // Error is handled by the useAuth hook and passed to AdminLoginForm
      console.error('Login failed:', err.message);
    }
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #B0E0E6 0%, #87CEEB 50%, #6495ED 100%)",
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AdminLoginForm
        error={error}
        isLoading={isLoading}
        onSubmit={handleLogin}
      />
    </div>
  );
}