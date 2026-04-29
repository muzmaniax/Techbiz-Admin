'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useUI } from '@/lib/ui-context';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading, hasAccess, user } = useAuth();
  const { sidebarCollapsed, mobileSidebarOpen, toggleMobileSidebar } = useUI();
  const router = useRouter();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  // Handle route protection and auto-close mobile sidebar on navigation
  useEffect(() => {
    if (mobileSidebarOpen) toggleMobileSidebar();
    
    if (!isLoading && isAuthenticated && user) {
      const module = pathname.split('/')[2]; // /dashboard/[module]
      if (module && module !== 'settings' && module !== 'overview' && !hasAccess(module as any)) {
        router.push('/dashboard/overview');
      }
    }
  }, [pathname, isLoading, isAuthenticated, user, hasAccess, router]);

  if (isLoading || !isMounted) {
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
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="overlay show-mobile" 
          onClick={toggleMobileSidebar}
          style={{ zIndex: 40 }}
        />
      )}
      
      <Sidebar />
      <div
        className="main-responsive"
        style={{
          flex: 1,
          marginLeft: sidebarCollapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          transition: 'margin-left var(--transition-slow)',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
        }}
      >
        <Topbar />
        <main
          key={pathname}
          className="animate-fade-in"
          style={{
            flex: 1,
            padding: '28px 32px',
            maxWidth: 1600,
            margin: '0 auto',
            width: '100%',
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
