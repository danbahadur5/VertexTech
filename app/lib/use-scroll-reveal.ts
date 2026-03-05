import { useEffect } from 'react';
export function useScrollReveal() {
  useEffect(() => {
    const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const progressBars = document.querySelectorAll<HTMLElement>('.progress-bar');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target as HTMLElement;
          const siblings = Array.from(el.parentElement?.querySelectorAll(revealSelectors) ?? []);
          const index = siblings.indexOf(el);
          setTimeout(() => el.classList.add('revealed'), index * 120);
          revealObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    const progressObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const bar = entry.target as HTMLElement;
          bar.classList.add('animated');
          progressObserver.unobserve(bar);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll<HTMLElement>(revealSelectors).forEach((el) => revealObserver.observe(el));
    progressBars.forEach((bar) => progressObserver.observe(bar));
    return () => { revealObserver.disconnect(); progressObserver.disconnect(); };
  });
}
export function useCountUp(ref: React.RefObject<HTMLElement>, target: number, duration = 1800) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const step = (timestamp: number) => {
          if (!start) start = timestamp;
          const progress = Math.min((timestamp - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.floor(eased * target).toLocaleString() + (el.dataset.suffix || '');
          if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration, ref]);
}
