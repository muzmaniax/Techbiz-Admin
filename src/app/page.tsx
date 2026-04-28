'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getRoleDefaultRoute } from '@/lib/auth-context';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        router.push(getRoleDefaultRoute(user.role));
      } else {
        router.push('/login');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        background: 'var(--bg-primary)',
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--brand-cyan)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
