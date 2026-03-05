import React, { createContext, useContext, useState, useEffect } from 'react';

export type ColorTheme = 'blue' | 'red' | 'green' | 'teal' | 'orange' | 'purple';

export interface ThemeOption {
  id: ColorTheme;
  name: string;
  color: string;
  gradient: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'blue',   name: 'Blue Shield',     color: '#2563eb', gradient: 'linear-gradient(135deg,#2563eb,#7c3aed)' },
  { id: 'red',    name: 'Cyber Red',       color: '#dc2626', gradient: 'linear-gradient(135deg,#dc2626,#9f1239)' },
  { id: 'green',  name: 'Nature Green',    color: '#16a34a', gradient: 'linear-gradient(135deg,#16a34a,#065f46)' },
  { id: 'teal',   name: 'Ocean Teal',      color: '#0d9488', gradient: 'linear-gradient(135deg,#0d9488,#0369a1)' },
  { id: 'orange', name: 'Sunset Orange',   color: '#ea580c', gradient: 'linear-gradient(135deg,#ea580c,#b45309)' },
  { id: 'purple', name: 'Royal Purple',    color: '#7c3aed', gradient: 'linear-gradient(135deg,#7c3aed,#a21caf)' },
];

interface ColorThemeContextType {
  colorTheme: ColorTheme;
  setColorTheme: (t: ColorTheme) => void;
  currentTheme: ThemeOption;
}

const ColorThemeContext = createContext<ColorThemeContextType>({
  colorTheme: 'blue',
  setColorTheme: () => {},
  currentTheme: THEME_OPTIONS[0],
});

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorThemeState] = useState<ColorTheme>(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('sn-color-theme') : null;
    return (saved as ColorTheme) || 'blue';
  });

  const currentTheme = THEME_OPTIONS.find(t => t.id === colorTheme)!;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', colorTheme);
    localStorage.setItem('sn-color-theme', colorTheme);
  }, [colorTheme]);

  const setColorTheme = (t: ColorTheme) => setColorThemeState(t);

  return (
    <ColorThemeContext.Provider value={{ colorTheme, setColorTheme, currentTheme }}>
      {children}
    </ColorThemeContext.Provider>
  );
}

export function useColorTheme() {
  return useContext(ColorThemeContext);
}
