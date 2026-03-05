import React from 'react';
import { Link } from 'react-router';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Shield } from 'lucide-react';
export function PublicFooter() {
  const footerLinks = {
    solutions: [
      { name: 'Endpoint Detection', href: '/services/endpoint-detection' },
      { name: 'Cloud Security',     href: '/services/cloud-security' },
      { name: 'Identity Protection',href: '/services/identity-protection' },
      { name: 'Threat Intelligence',href: '/services/threat-intelligence' },
    ],
    resources: [
      { name: 'Pricing',       href: '/pricing' },
      { name: 'Portfolio',     href: '/portfolio' },
      { name: 'Blog',          href: '/blog' },
      { name: 'Documentation', href: '#' },
    ],
    company: [
      { name: 'About Us',  href: '/about' },
      { name: 'Careers',   href: '/careers' },
      { name: 'Contact',   href: '/contact' },
      { name: 'Support',   href: '/contact' },
    ],
    legal: [
      { name: 'Privacy Policy',    href: '#' },
      { name: 'Terms of Service',  href: '#' },
      { name: 'Cookie Policy',     href: '#' },
      { name: 'GDPR Compliance',   href: '#' },
    ],
  };
  const socials = [
    { Icon: Facebook,  href: '#', label: 'Facebook' },
    { Icon: Twitter,   href: '#', label: 'Twitter' },
    { Icon: Linkedin,  href: '#', label: 'LinkedIn' },
    { Icon: Instagram, href: '#', label: 'Instagram' },
  ];
  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center theme-gradient shadow">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-extrabold text-white">
                Vertex<span className="theme-gradient-text">Tech</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">
              AI-powered cybersecurity platform protecting 10M+ endpoints worldwide.
              Your trusted partner for complete digital defense.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                <span>contact@vertextech.com</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="h-4 w-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                <span>123 Tech Street, San Francisco, CA 94105</span>
              </div>
            </div>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {[
            { title: 'Solutions',  links: footerLinks.solutions },
            { title: 'Resources',  links: footerLinks.resources },
            { title: 'Company',    links: footerLinks.company },
            { title: 'Legal',      links: footerLinks.legal },
          ].map(({ title, links }) => (
            <div key={title}>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{title}</h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link to={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} VertexTech. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
