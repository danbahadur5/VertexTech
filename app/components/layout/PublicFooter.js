'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin, Shield } from 'lucide-react';
import Image from 'next/image';
import logo from "./assets/logo.png";
export function PublicFooter({ initialData }) {
  const [blurb, setBlurb] = useState(initialData?.blurb || 'AI-powered cybersecurity platform protecting 10M+ endpoints worldwide. Your trusted partner for complete digital defense.');
  const [contact, setContact] = useState({ 
    email: initialData?.contact?.email || 'contact@vertextech.com', 
    phone: initialData?.contact?.phone || '+1 (555) 123-4567', 
    address: initialData?.contact?.address || '123 Tech Street, San Francisco, CA 94105' 
  });
  const [columns, setColumns] = useState(initialData?.columns || [
    { title: 'Solutions', links: [{ name: 'Endpoint Detection', href: '/services/endpoint-detection' }, { name: 'Cloud Security', href: '/services/cloud-security' }, { name: 'Identity Protection', href: '/services/identity-protection' }, { name: 'Threat Intelligence', href: '/services/threat-intelligence' }] },
    { title: 'Resources', links: [{ name: 'Pricing', href: '/pricing' }, { name: 'Case Study', href: '/case-study' }, { name: 'Blog', href: '/blog' }, { name: 'Documentation', href: '#' }] },
    { title: 'Company', links: [{ name: 'About Us', href: '/about' }, { name: 'Careers', href: '/careers' }, { name: 'Contact', href: '/contact' }, { name: 'Support', href: '/contact' }] },
    { title: 'Legal', links: [{ name: 'Privacy Policy', href: '#' }, { name: 'Terms of Service', href: '#' }, { name: 'Cookie Policy', href: '#' }, { name: 'GDPR Compliance', href: '#' }] },
  ]);
  const [socials, setSocials] = useState({ 
    facebook: initialData?.socials?.facebook || '#', 
    twitter: initialData?.socials?.twitter || '#', 
    linkedin: initialData?.socials?.linkedin || '#', 
    instagram: initialData?.socials?.instagram || '#' 
  });

  useEffect(() => {
    if (initialData) return;
    (async () => {
      try {
        const res = await fetch('/api/settings/footer', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const d = json?.item?.data || {};
        if (d.blurb) setBlurb(d.blurb);
        if (d.contact) setContact({ email: d.contact.email || '', phone: d.contact.phone || '', address: d.contact.address || '' });
        if (Array.isArray(d.columns) && d.columns.length) setColumns(d.columns);
        if (d.socials) setSocials({ facebook: d.socials.facebook || '#', twitter: d.socials.twitter || '#', linkedin: d.socials.linkedin || '#', instagram: d.socials.instagram || '#' });
      } catch {}
    })();
  }, [initialData]);

  const socialList = [
    { Icon: Facebook, href: socials.facebook || '#', label: 'Facebook' },
    { Icon: Twitter, href: socials.twitter || '#', label: 'Twitter' },
    { Icon: Linkedin, href: socials.linkedin || '#', label: 'LinkedIn' },
    { Icon: Instagram, href: socials.instagram || '#', label: 'Instagram' },
  ];
  return (
    <footer className="bg-gray-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-5">
                <Image src={logo} alt='site logo' className="object-contain" height={160} width={160} />
            </Link>
            <p className="text-gray-400 mb-6 max-w-sm text-sm leading-relaxed">{blurb}</p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="h-4 w-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                <span>{contact.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="h-4 w-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                <span>{contact.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400 text-sm">
                <MapPin className="h-4 w-4 shrink-0" style={{ color: 'var(--theme-primary)' }} />
                <span>{contact.address}</span>
              </div>
            </div>
            <div className="flex gap-3">
              {socialList.map(({ Icon, href, label }) => (
                <a key={label} href={href} aria-label={label} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-gray-700 hover:text-white transition-all duration-200">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {columns.map((col, idx) => (
            <div key={`${col.title}-${idx}`}>
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">{col.title}</h3>
              <ul className="space-y-3">
                {(col.links || []).map((link, i) => (
                  <li key={`${link.name}-${i}`}>
                    <Link href={link.href || '#'} className="text-gray-400 hover:text-white transition-colors text-sm">{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">© {new Date().getFullYear()} DarbarTech. All rights reserved.</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-gray-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
