'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, getRoleDefaultRoute } from '@/lib/auth-context';
import { useUI } from '@/lib/ui-context';

export default function Home() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { theme } = useUI();
  const router = useRouter();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isLoading) {
      if (isAuthenticated && user) {
        router.push(getRoleDefaultRoute(user.role));
      } else {
        router.push('/login');
      }
    }
  }, [isMounted, isAuthenticated, isLoading, user, router]);

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
            width: 80,
            height: 80,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <img 
            src={theme === 'light' ? "/logo-light.png" : "/logo-dark.png"} 
            alt="TechBiz" 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
