'use client'

import HeroSection from '../../pages/components/Hero_Section';

export function HeroPreview({ data, isDark }) {
  // We can wrap HeroSection in a div that simulates the theme
  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="bg-white dark:bg-slate-950 rounded-lg overflow-hidden border shadow-sm scale-[0.6] origin-top transform-gpu">
        <HeroSection initialData={data} />
      </div>
    </div>
  );
}
