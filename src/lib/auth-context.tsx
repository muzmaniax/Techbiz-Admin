'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

export type UserRole = 'admin' | 'analyst' | 'content_manager' | 'operations' | 'hr_manager';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasAccess: (module: string) => boolean;
}

const MOCK_USERS: Record<string, User> = {
  'admin@techbiz.com': {
    id: '1',
    name: 'Sarah Chen',
    email: 'admin@techbiz.com',
    role: 'admin',
  },
  'analyst@techbiz.com': {
    id: '2',
    name: 'James Miller',
    email: 'analyst@techbiz.com',
    role: 'analyst',
  },
  'content@techbiz.com': {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'content@techbiz.com',
    role: 'content_manager',
  },
  'ops@techbiz.com': {
    id: '4',
    name: 'Michael Park',
    email: 'ops@techbiz.com',
    role: 'operations',
  },
  'hr@techbiz.com': {
    id: '5',
    name: 'David Wilson',
    email: 'hr@techbiz.com',
    role: 'hr_manager',
  },
};

const ROLE_ACCESS: Record<UserRole, string[]> = {
  admin: ['analytics', 'cms', 'careers', 'submissions', 'settings'],
  analyst: ['analytics'],
  content_manager: ['cms'],
  operations: ['submissions'],
  hr_manager: ['careers'],
};

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrator',
  analyst: 'Analyst',
  content_manager: 'Content Manager',
  operations: 'Operations',
  hr_manager: 'HR Manager',
};

export function getRoleLabel(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function getRoleDefaultRoute(role: UserRole): string {
  // All roles now redirect to the central Overview dashboard as the primary entry point
  return '/dashboard/overview';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('techbiz_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('techbiz_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise((r) => setTimeout(r, 800));

    if (password !== 'password123') return false;

    const foundUser = MOCK_USERS[email.toLowerCase()];
    if (!foundUser) return false;

    setUser(foundUser);
    localStorage.setItem('techbiz_user', JSON.stringify(foundUser));
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('techbiz_user');
  }, []);

  const hasAccess = useCallback(
    (module: string): boolean => {
      if (!user) return false;
      return ROLE_ACCESS[user.role].includes(module);
    },
    [user]
  );

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, isLoading, login, logout, hasAccess }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
