"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle2, Target, Users, Award, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useScrollReveal } from '../lib/use-scroll-reveal';

/**
 * AboutPage - The story behind DarbarTech
 */
export default function AboutPage({ initialData }) {
  useScrollReveal();

  // We're keeping the state names descriptive. 
  // 'teamMembers' is much better than just 'team'.
  const [teamMembers, setTeamMembers] = useState(initialData?.team || []);
  
  const [heroContent, setHeroContent] = useState({
    badge: initialData?.hero?.badge || 'About DarbarTech',
    titleLeading: initialData?.hero?.titleLeading || 'Defending the',
    titleGradient: initialData?.hero?.titleGradient || 'Digital Frontier',
    // Subtitles should be more than just marketing fluff.
    // I've kept the defaults grounded in our actual history.
    historyBrief: initialData?.hero?.subtitle1 ||
      "Founded by technology experts, DarbarTech builds the next generation of threat protection for modern enterprises. For over 15 years, we've helped organizations transform through innovative technology solutions.",
    missionStatement: initialData?.hero?.subtitle2 ||
      "Today, we're proud to have delivered over 500 successful projects, helping businesses across industries leverage cloud computing, cybersecurity, custom software, and data analytics to achieve their goals.",
    heroImage: initialData?.hero?.heroImage ||
      'https://images.unsplash.com/photo-1758518731468-98e90ffd7430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080',
    performanceStats: (initialData?.hero?.stats && Array.isArray(initialData.hero.stats) && initialData.hero.stats.length) ? initialData.hero.stats : [
      { num: '500+', label: 'Projects Completed' },
      { num: '300+', label: 'Happy Clients' },
      { num: '50+', label: 'Team Members' },
      { num: '15+', label: 'Years Experience' },
    ],
  });

  const [coreValues, setCoreValues] = useState([
    { icon: Target, title: 'Innovation First', description: 'We stay ahead with cutting-edge technology solutions.' },
    { icon: Users, title: 'Client-Centric', description: 'Your success is our priority.' },
    { icon: CheckCircle2, title: 'Quality Assured', description: 'Enterprise-grade solutions and support.' },
    { icon: Award, title: 'Excellence', description: 'Award-winning team delivering results.' },
  ]);

  const [companyMilestones, setCompanyMilestones] = useState(initialData?.milestones || []);
  
  const [guidingPrinciples, setGuidingPrinciples] = useState(initialData?.principles?.map((principle) => {
    const iconMap = { Shield, Zap, Globe };
    return { icon: iconMap[principle.icon] || Shield, title: principle.title, desc: principle.desc };
  }) || []);

  useEffect(() => {
    // If we have initialData (e.g. from SSR), we don't need to fetch again.
    if (initialData) return;

    const fetchAboutData = async () => {
      try {
        // Fetching all the content pieces in parallel to keep things snappy.
        const [heroRes, principlesRes, milestonesRes, teamRes] = await Promise.all([
          fetch('/api/settings/about-hero', { cache: 'no-store' }),
          fetch('/api/settings/about-principles', { cache: 'no-store' }),
          fetch('/api/settings/about-milestones', { cache: 'no-store' }),
          fetch('/api/settings/about-team', { cache: 'no-store' }),
        ]);

        if (heroRes.ok) {
          const { item } = await heroRes.json();
          const d = item?.data || {};
          setHeroContent((prev) => ({
            badge: d.badge || prev.badge,
            titleLeading: d.titleLeading || prev.titleLeading,
            titleGradient: d.titleGradient || prev.titleGradient,
            historyBrief: d.subtitle1 || prev.historyBrief,
            missionStatement: d.subtitle2 || prev.missionStatement,
            heroImage: d.heroImage || prev.heroImage,
            performanceStats: Array.isArray(d.stats) && d.stats.length ? d.stats : prev.performanceStats,
          }));
        }

        if (principlesRes.ok) {
          const { item } = await principlesRes.json();
          const items = Array.isArray(item?.data?.items) ? item.data.items : [];
          setGuidingPrinciples(items.map((i) => {
            const iconMap = { Shield, Zap, Globe };
            return { icon: iconMap[i.icon] || Shield, title: i.title, desc: i.desc };
          }));
        }

        if (milestonesRes.ok) {
          const { item } = await milestonesRes.json();
          const items = Array.isArray(item?.data?.items) ? item.data.items : [];
          setCompanyMilestones(items);
        }

        if (teamRes.ok) {
          const { item } = await teamRes.json();
          const items = Array.isArray(item?.data?.items) ? item.data.items : [];
          setTeamMembers(items.map((m) => ({ 
            name: m.name, 
            position: m.position, 
            avatar: m.avatarUrl, 
            bio: m.bio 
          })));
        }
      } catch (err) {
        // We're failing silently here to prevent the page from crashing,
        // but we'll log it for our own sanity during development.
        console.error("Failed to load about page data:", err);
      }
    };

    fetchAboutData();
  }, [initialData]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 selection:bg-blue-100">
      <PublicHeader />
      
      {/* Hero Section - The big "Who we are" introduction */}
      <section className="relative py-28 overflow-hidden theme-bg-light hero-grid-bg">
        <div className="blob blob-primary w-96 h-96 top-[-120px] right-[-100px]" />
        <div className="blob blob-secondary w-72 h-72 bottom-[-80px] left-[-60px]" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-5 theme-badge text-sm px-4 py-1 font-semibold animate-fade-in">
              {heroContent.badge}
            </Badge>
            <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-100 mb-6 animate-fade-in-up delay-100">
              {heroContent.titleLeading} <span className="theme-text">{heroContent.titleGradient}</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto animate-fade-in-up delay-200 leading-relaxed font-medium">
              {heroContent.historyBrief}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left delay-300">
              <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl theme-glow-effect group">
                <ImageWithFallback 
                  src={heroContent.heroImage} 
                  alt="Our team working together" 
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105" 
                />
              </div>
            </div>
            
            <div className="animate-fade-in-right delay-300">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-5">Our Story</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                {heroContent.historyBrief}
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                {heroContent.missionStatement}
              </p>
              
              <div className="grid grid-cols-2 gap-6">
                {heroContent.performanceStats.map(({ num, label }) => (
                  <div key={label} className="text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                    <div className="text-3xl font-extrabold theme-text mb-1">{num}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 font-medium">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principles Section - The "How we think" part */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Our Principles</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">How We Think</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The guiding principles that shape every solution we build.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {guidingPrinciples.map((principle, idx) => {
              const PrincipleIcon = principle.icon;
              return (
                <div 
                  key={principle.title} 
                  className="reveal-scale text-center p-8 rounded-3xl border border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-500 group" 
                  style={{ transitionDelay: `${idx * 0.15}s` }}
                >
                  <div className="w-16 h-16 theme-bg rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:rotate-6 transition-transform shadow-lg shadow-blue-500/20">
                    <PrincipleIcon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">{principle.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{principle.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Section - Milestones that matter */}
      <section className="py-24 bg-gray-50/50 dark:bg-gray-900/50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Our Journey</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Milestones That Matter</h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5 opacity-20" style={{ background: 'var(--theme-primary)' }} />
            <div className="space-y-12">
              {companyMilestones.map((milestone, i) => (
                <div key={milestone.year} className="reveal flex gap-8 items-start pl-4" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="relative z-10 w-10 h-10 rounded-full theme-bg flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg ring-4 ring-white dark:ring-gray-900">
                    {i + 1}
                  </div>
                  <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-6 flex-1 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="theme-badge text-xs">{milestone.year}</Badge>
                      <span className="font-bold text-gray-900 dark:text-gray-100">{milestone.event}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{milestone.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section - What we stand for */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Our Values</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">The Principles That Guide Us</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">What we stand for, every single day.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, idx) => {
              const ValueIcon = value.icon;
              return (
                <Card 
                  key={value.title} 
                  className="reveal text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden" 
                  style={{ transitionDelay: `${idx * 0.12}s` }}
                >
                  <CardContent className="pt-10 pb-8">
                    <div className="w-16 h-16 rounded-full theme-bg flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg shadow-blue-500/10">
                      <ValueIcon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2 text-lg">{value.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Leadership Team</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">The talented people behind DarbarTech's success.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <Card key={member.name} className="reveal text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" style={{ transitionDelay: `${idx * 0.12}s` }}>
                <CardContent className="pt-8 pb-6">
                  <div className="relative inline-block mb-5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg group-hover:ring-4 transition-all"
                      style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full theme-bg flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold theme-text mb-2">{member.position}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 theme-bg">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center reveal">
          <h2 className="text-4xl font-bold text-white mb-5">Join the Mission</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            We're always looking for talented people who are passionate about cybersecurity and making a real difference.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/careers">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl px-8 h-12">
                View Open Roles <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 font-bold rounded-xl px-8 h-12">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
