'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

interface UIContextType {
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  mobileSidebarOpen: boolean;
  toggleMobileSidebar: () => void;
  isPageLoading: boolean;
  setPageLoading: (loading: boolean) => void;
  theme: Theme;
  toggleTheme: () => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function UIProvider({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isPageLoading, setPageLoading] = useState(false);
  const [theme, setTheme] = useState<Theme>('dark');

  // Sync state with localStorage
  useEffect(() => {
    const storedCollapsed = localStorage.getItem('techbiz_sidebar_collapsed');
    if (storedCollapsed === 'true') setSidebarCollapsed(true);

    const storedTheme = localStorage.getItem('techbiz_theme') as Theme;
    if (storedTheme) {
      setTheme(storedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
      // Default to user preference if no storage
      // Actually user requested Dark as "graphite/black base" so it's likely the default
    }
  }, []);

  // Update data-theme attribute on <html> and <body>
  useEffect(() => {
    // Apply to both for maximum compatibility with generic CSS and Tailwind selectors
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('suppressHydrationWarning', 'true');
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('techbiz_theme', theme);
    
    // Debug log to confirm context is working
    console.log('Theme changed to:', theme);
  }, [theme]);

  const toggleSidebar = () => {
    setSidebarCollapsed(prev => {
      const newState = !prev;
      localStorage.setItem('techbiz_sidebar_collapsed', String(newState));
      return newState;
    });
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev);
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <UIContext.Provider value={{ 
      sidebarCollapsed, 
      toggleSidebar, 
      mobileSidebarOpen, 
      toggleMobileSidebar, 
      isPageLoading, 
      setPageLoading,
      theme,
      toggleTheme
    }}>
      {children}
    </UIContext.Provider>
  );
}

export function useUI() {
  const context = useContext(UIContext);
  if (!context) throw new Error('useUI must be used within UIProvider');
  return context;
}
