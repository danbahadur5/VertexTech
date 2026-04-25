export const siteSettings = {
  brand: { name: 'VertexTech', tagline: 'Build. Secure. Scale.' },
  theme: { default: 'light' },
  nav: {
    primary: [
      { name: 'Home', href: '/' },
      { name: 'Solutions', href: '/services', dropdown: [
        { name: 'Website Development', href: '/services/custom-software' },
        { name: 'Cyber Security', href: '/services/cybersecurity' },
        { name: 'AI Agent Build', href: '/services/data-analytics' },
      ]},
      { name: 'Case Study', href: '/Case Study' },
      { name: 'Blog', href: '/blog' },
      { name: 'Contact', href: '/contact' },
    ],
    ctas: [{ name: 'Start Project', href: '/contact', variant: 'default' }],
  },
  hero: {
    badge: 'Trusted by 2,000+ Technology Teams',
    titleLeading: 'Build, Secure, and Scale with',
    titleGradient: 'AI‑Powered Solutions',
    subtitle: 'Enterprise web development, cybersecurity, and AI agent automation — unified under one platform for digital growth.',
    primaryCTA: { label: 'Start Project', href: '/contact' },
    secondaryCTA: { label: 'Watch Demo', href: '/Case Study' },
    features: [
      { icon: 'Shield', label: 'Cyber Defense' },
      { icon: 'Zap', label: 'Automation' },
      { icon: 'Globe', label: 'Global Delivery' },
    ],
  },
};
