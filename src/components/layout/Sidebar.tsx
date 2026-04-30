'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  FileText,
  Inbox,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Zap,
  Briefcase,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useUI } from '@/lib/ui-context';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  module: string;
}

const navItems: NavItem[] = [
  { label: 'Analytics', href: '/dashboard/analytics', icon: <BarChart3 size={20} />, module: 'analytics' },
  { label: 'Insights CMS', href: '/dashboard/cms', icon: <FileText size={20} />, module: 'cms' },
  { label: 'Careers & Opportunities', href: '/dashboard/careers', icon: <Briefcase size={20} />, module: 'careers' },
  { label: 'Submissions', href: '/dashboard/submissions', icon: <Inbox size={20} />, module: 'submissions' },
  { label: 'Settings', href: '/dashboard/settings', icon: <Settings size={20} />, module: 'settings' },
];

export default function Sidebar() {
  const { sidebarCollapsed: collapsed, toggleSidebar, mobileSidebarOpen, theme } = useUI();
  const pathname = usePathname();
  const { hasAccess, logout, user } = useAuth();

  const filteredNav = navItems.filter((item) => hasAccess(item.module));

  return (
    <>
      <aside
        className="sidebar-responsive hide-mobile"
        style={{
          width: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          minHeight: '100vh',
          background: 'var(--bg-secondary)',
          borderRight: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          transition: 'width var(--transition-slow)',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 50,
          overflow: 'hidden',
        }}
      >
      {/* Logo */}
      <div
        style={{
          padding: '12px 20px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'flex-start',
          height: '64px', // Standard compact topbar height
          flexShrink: 0,
        }}
      >
        {!collapsed ? (
          <img 
            src={theme === 'light' ? "/logo-light.png" : "/logo-dark.png"} 
            alt="TechBiz" 
            style={{ 
              height: 36, 
              width: 'auto',
              objectFit: 'contain',
              animation: 'fadeIn 0.3s ease',
              maxWidth: '100%',
            }} 
          />
        ) : (
          <img 
            src="/favicon.png" 
            alt="TechBiz" 
            style={{ 
              height: 48,
              width: 'auto',
              objectFit: 'contain',
              maxWidth: '100%',
            }} 
          />
        )}
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 8px', display: 'flex', flexDirection: 'column', gap: 2, overflowY: 'auto' }}>
        {/* Dashboard Home */}
        <Link
          href="/dashboard/overview"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            color: pathname === '/dashboard/overview' ? 'var(--brand-cyan)' : 'var(--text-secondary)',
            background: pathname === '/dashboard/overview' ? 'var(--brand-cyan-muted)' : 'transparent',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            transition: 'all var(--transition-fast)',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            if (pathname !== '/dashboard') {
              e.currentTarget.style.background = 'var(--bg-tertiary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }
          }}
          onMouseLeave={(e) => {
            if (pathname !== '/dashboard') {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }
          }}
        >
          <Zap size={20} />
          {!collapsed && <span style={{ animation: 'fadeIn 0.3s ease' }}>Overview</span>}
        </Link>

        <div style={{ height: 1, background: 'var(--border-color)', margin: '8px 8px' }} />

        {filteredNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '8px 16px',
                borderRadius: 'var(--radius-md)',
                color: isActive ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                background: isActive ? 'var(--brand-cyan-muted)' : 'transparent',
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: '-0.04em',
                transition: 'all var(--transition-fast)',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-tertiary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              {item.icon}
              {!collapsed && <span style={{ animation: 'fadeIn 0.3s ease' }}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div style={{ padding: '8px', borderTop: '1px solid var(--border-color)', flexShrink: 0 }}>
        {/* User info */}
        {!collapsed && user && (
          <div
            style={{
              padding: '8px 12px',
              marginBottom: 4,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-tertiary)',
              animation: 'fadeIn 0.3s ease',
            }}
          >
            <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.name}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {user.email}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          onClick={logout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-secondary)',
            background: 'transparent',
            textDecoration: 'none',
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            border: 'none',
            width: '100%',
            transition: 'all var(--transition-fast)',
            fontFamily: 'inherit',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--danger-muted)';
            e.currentTarget.style.color = 'var(--danger)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <LogOut size={20} />
          {!collapsed && <span style={{ animation: 'fadeIn 0.3s ease' }}>Logout</span>}
        </button>

        {/* Collapse toggle */}
        <button
          onClick={toggleSidebar}
          className="hide-mobile"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            padding: '8px 16px',
            borderRadius: 'var(--radius-md)',
            color: 'var(--text-tertiary)',
            background: 'transparent',
            cursor: 'pointer',
            border: 'none',
            width: '100%',
            transition: 'all var(--transition-fast)',
            marginTop: 4,
            fontFamily: 'inherit',
            fontSize: 13,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--bg-tertiary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          {!collapsed && <span style={{ animation: 'fadeIn 0.3s ease' }}>Collapse</span>}
        </button>
      </div>
    </aside>
      
      {/* Mobile Bottom Navigation */}
      <nav className="bottom-nav show-mobile">
        <Link
          href="/dashboard/overview"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 4,
            padding: '8px 12px',
            color: pathname === '/dashboard/overview' ? 'var(--brand-cyan)' : 'var(--text-secondary)',
            textDecoration: 'none',
            fontSize: 10,
            fontWeight: 500,
          }}
        >
          <Zap size={20} />
          <span>Home</span>
        </Link>
        {filteredNav.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
                padding: '8px 12px',
                color: isActive ? 'var(--brand-cyan)' : 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: 10,
                fontWeight: 500,
              }}
            >
              {React.cloneElement(item.icon as React.ReactElement<any>, { size: 20 })}
              <span>{item.label.split(' ')[0]}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
