'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronRight, Menu, Sun, Moon } from 'lucide-react';
import { useAuth, getRoleLabel } from '@/lib/auth-context';
import { useUI } from '@/lib/ui-context';
import { getInitials } from '@/lib/utils';

const pageNames: Record<string, string> = {
  '/dashboard': 'Overview',
  '/dashboard/overview': 'Overview',
  '/dashboard/analytics': 'Analytics',
  '/dashboard/cms': 'Insights CMS',
  '/dashboard/submissions': 'Submissions',
  '/dashboard/settings': 'Settings',
};

export default function Topbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { toggleMobileSidebar, theme, toggleTheme } = useUI();
  const [searchFocused, setSearchFocused] = useState(false);

  const currentPage = pageNames[pathname] || 'Dashboard';

  return (
    <header
      className="topbar-responsive"
      style={{
        height: 'var(--topbar-height)',
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 32px',
        position: 'sticky',
        top: 0,
        zIndex: 20,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Left: Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }} className="hide-mobile">
          <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Dashboard</span>
          <ChevronRight size={14} style={{ color: 'var(--text-tertiary)' }} />
          <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
            {currentPage}
          </span>
        </div>
        <div className="show-mobile">
          <span style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>
            {currentPage}
          </span>
        </div>
      </div>

      {/* Right: Search + Theme + Notifications + Profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        {/* Search */}
        <div
          className="hide-mobile"
          style={{
            position: 'relative',
            width: searchFocused ? 320 : 200,
            transition: 'width var(--transition-base)',
          }}
        >
          <Search
            size={16}
            style={{
              position: 'absolute',
              left: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-tertiary)',
            }}
          />
          <input
            type="text"
            placeholder="Search..."
            className="input"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            style={{
              paddingLeft: 38,
              paddingRight: 10,
              fontSize: 13,
              height: 38,
              background: 'var(--bg-tertiary)',
            }}
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          style={{
            width: 38,
            height: 38,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--brand-cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <button
          style={{
            position: 'relative',
            width: 38,
            height: 38,
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--brand-cyan)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-secondary)';
          }}
        >
          <Bell size={20} />
          <span
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'var(--brand-cyan)',
              border: `2px solid var(--bg-secondary)`,
            }}
          />
        </button>

        {/* User Profile */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '6px 12px 6px 6px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-tertiary)',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-color)';
            }}
          >
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-tertiary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 500,
                color: 'var(--brand-cyan)',
              }}
            >
              {getInitials(user.name)}
            </div>
            <div style={{ lineHeight: 1.3 }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
                {getRoleLabel(user.role)}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
