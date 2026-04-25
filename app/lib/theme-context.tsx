'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 'blue' | 'red' | 'green' | 'teal' | 'orange' | 'purple';

export interface ThemeOption {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  gradient: string;
  borderRadius: string;
  fontFamily: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { 
    id: 'blue',   
    name: 'Blue Shield',     
    primary: '#2563eb', 
    secondary: '#7c3aed',
    accent: '#06b6d4',
    gradient: 'linear-gradient(135deg,#2563eb,#7c3aed)',
    borderRadius: '0.75rem',
    fontFamily: 'Inter'
  },
  { 
    id: 'red',    
    name: 'Cyber Red',       
    primary: '#dc2626', 
    secondary: '#9f1239',
    accent: '#fbbf24',
    gradient: 'linear-gradient(135deg,#dc2626,#9f1239)',
    borderRadius: '0.75rem',
    fontFamily: 'Inter'
  },
  { 
    id: 'green',  
    name: 'Nature Green',    
    primary: '#16a34a', 
    secondary: '#065f46',
    accent: '#84cc16',
    gradient: 'linear-gradient(135deg,#16a34a,#065f46)',
    borderRadius: '0.75rem',
    fontFamily: 'Inter'
  },
  { 
    id: 'teal',   
    name: 'Ocean Teal',      
    primary: '#0d9488', 
    secondary: '#0369a1',
    accent: '#2dd4bf',
    gradient: 'linear-gradient(135deg,#0d9488,#0369a1)',
    borderRadius: '0.75rem',
    fontFamily: 'Inter'
  },
  { 
    id: 'orange', 
    name: 'Sunset Orange',   
    primary: '#ea580c', 
    secondary: '#b45309',
    accent: '#f97316',
    gradient: 'linear-gradient(135deg,#ea580c,#b45309)',
    borderRadius: '0.75rem',
    fontFamily: 'Inter'
  },
  { 
    id: 'purple', 
    name: 'Royal Purple',    
    primary: '#7c3aed', 
    secondary: '#a21caf',
    accent: '#d946ef',
    gradient: 'linear-gradient(135deg,#7c3aed,#a21caf)',
    borderRadius: '0.75rem',
    fontFamily: 'Inter'
  },
];

interface ColorThemeContextType {
  theme: ThemeOption;
  setTheme: (t: ThemeOption) => void;
  updateTheme: (updates: Partial<ThemeOption>) => void;
  loading: boolean;
}

const DEFAULT_THEME = THEME_OPTIONS[0];
const MIN_LOADING_TIME = 1500; // Minimum duration in ms to prevent flickering

const ColorThemeContext = createContext<ColorThemeContextType>({
  theme: DEFAULT_THEME,
  setTheme: () => {},
  updateTheme: () => {},
  loading: true,
});

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeOption>(DEFAULT_THEME);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    const loadTheme = async () => {
      const startTime = Date.now();
      try {
        const res = await fetch('/api/settings/theme', { cache: 'no-store' });
        if (res.ok) {
          const js = await res.json();
          if (js?.item?.data) {
            setThemeState(js.item.data);
          }
        }
      } catch (err) {
        console.error("Failed to load theme:", err);
      } finally {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
        
        timeoutId = setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    loadTheme();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--theme-primary', theme.primary);
    root.style.setProperty('--theme-secondary', theme.secondary);
    root.style.setProperty('--theme-accent', theme.accent);
    root.style.setProperty('--theme-gradient', theme.gradient);
    root.style.setProperty('--theme-radius', theme.borderRadius);
    root.style.setProperty('--font-primary', theme.fontFamily);
    
    // For legacy data-theme attribute
    root.setAttribute('data-theme', theme.id);
  }, [theme]);

  const setTheme = (t: ThemeOption) => setThemeState(t);
  
  const updateTheme = (updates: Partial<ThemeOption>) => {
    setThemeState(prev => ({ ...prev, ...updates }));
  };

  return (
    <ColorThemeContext.Provider value={{ theme, setTheme, updateTheme, loading }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorThemeContext);
}
