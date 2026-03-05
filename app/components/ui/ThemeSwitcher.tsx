import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { THEME_OPTIONS, useColorTheme, type ColorTheme } from '../../lib/theme-context';

export function ThemeSwitcher() {
  const { colorTheme, setColorTheme } = useColorTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        title="Switch Color Theme"
        className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-medium transition-all duration-200 hover:shadow-md"
        aria-label="Color theme switcher"
        id="theme-switcher-btn"
      >
        <Palette className="h-4 w-4" style={{ color: 'var(--theme-primary)' }} />
        <span className="hidden sm:inline">Theme</span>
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          {/* Popover */}
          <div
            className="absolute right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 p-4 min-w-[260px] animate-slide-down"
            role="dialog"
            aria-label="Theme color options"
          >
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Choose Color Theme
            </p>
            <div className="grid grid-cols-3 gap-2">
              {THEME_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  id={`theme-option-${opt.id}`}
                  onClick={() => { setColorTheme(opt.id as ColorTheme); setOpen(false); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer ${
                    colorTheme === opt.id
                      ? 'border-gray-400 bg-gray-50 shadow-md scale-105'
                      : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                  }`}
                  title={opt.name}
                  aria-pressed={colorTheme === opt.id}
                >
                  <div
                    className="w-8 h-8 rounded-full shadow-md"
                    style={{ background: opt.gradient }}
                  />
                  <span className="text-[11px] text-gray-600 font-medium text-center leading-tight">
                    {opt.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
