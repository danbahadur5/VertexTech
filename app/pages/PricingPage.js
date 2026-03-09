import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { CheckCircle2, ArrowRight, Shield, Zap, Crown } from 'lucide-react';
import { useScrollReveal } from '../lib/use-scroll-reveal';

const ICONS = { Shield, Zap, Crown };

export default function PricingPage() {
  useScrollReveal();
  const [heroTitle, setHeroTitle] = useState('Protection That Scales');
  const [heroSubtitle, setHeroSubtitle] = useState('Per-endpoint pricing that grows with your organization.');
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/settings/pricing', { cache: 'no-store' });
        if (!res.ok) return;
        const js = await res.json();
        const d = js?.item?.data || {};
        setHeroTitle(d.heroTitle || heroTitle);
        setHeroSubtitle(d.heroSubtitle || heroSubtitle);
        setPlans(Array.isArray(d.plans) ? d.plans : []);
      } catch {}
    })();
  }, []);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader />
      <section className="relative overflow-hidden theme-bg-light hero-grid-bg py-24">
        <div className="blob blob-primary w-96 h-96 top-[-120px] left-[-100px]" />
        <div className="blob blob-secondary w-72 h-72 bottom-[-80px] right-[-60px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Badge className="mb-5 theme-badge text-sm px-4 py-1 font-semibold">Transparent Pricing</Badge>
          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-6 animate-fade-in-up delay-100">
            {heroTitle.split(' ').slice(0, -1).join(' ')} <span className="theme-gradient-text">{heroTitle.split(' ').slice(-1)}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
            {heroSubtitle}
          </p>
        </div>
      </section>
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 items-start">
            {plans.map((plan, idx) => {
              const Icon = ICONS[plan.icon] || Shield;
              return (
                <Card key={plan.id} className="reveal reveal-scale rounded-2xl border border-gray-200 dark:border-gray-800 p-2 hover:shadow-2xl transition-all duration-300 bg-white dark:bg-gray-900" style={{ animationDelay: `${idx * 0.12}s` }}>
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-xl theme-gradient flex items-center justify-center">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-xl dark:text-gray-100">{plan.name}</CardTitle>
                        <CardDescription className="dark:text-gray-400">{plan.tagline}</CardDescription>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-extrabold text-gray-900 dark:text-gray-100">{plan.price}</span>
                        {plan.period && <span className="text-gray-500 dark:text-gray-400 text-sm">{plan.period}</span>}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 mb-6">
                      {plan.features.map((feat) => (
                        <div key={feat} className="flex items-start gap-2">
                          <CheckCircle2 className="h-4 w-4 mt-0.5" style={{ color: 'var(--theme-primary)' }} />
                          <span className="text-sm text-gray-700 dark:text-gray-300">{feat}</span>
                        </div>
                      ))}
                    </div>
                    <Link to="/contact">
                      <Button className="theme-btn w-full rounded-xl h-11 font-semibold">
                        {plan.price === 'Custom' ? 'Contact Sales' : 'Start Free Trial'} <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-24 theme-gradient">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Not Sure Which Plan?</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Talk to a security expert to pick the best fit.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl px-8 h-12">Talk to an Expert</Button>
            </Link>
            <Link to="/services">
              <Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 font-bold rounded-xl px-8 h-12">View Solutions</Button>
            </Link>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
