import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, CheckCircle2, Shield, Cloud, Zap, Lock, Globe, Activity, Code, BarChart3 } from 'lucide-react';
import { useScrollReveal } from '../lib/use-scroll-reveal';

const ICONS = { Shield, Cloud, Lock, Globe, Activity, Zap, Code, BarChart3 };

export default function ServicesPage() {
  useScrollReveal();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/services', { cache: 'no-store' });
        if (!res.ok) return;
        const js = await res.json();
        setServices(Array.isArray(js.items) ? js.items : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <section className="relative py-28 overflow-hidden theme-bg-light hero-grid-bg">
        <div className="blob blob-primary w-96 h-96 top-[-120px] left-[-100px]" />
        <div className="blob blob-secondary w-72 h-72 bottom-[-80px] right-[-60px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="animate-fade-in"><Badge className="mb-5 theme-badge text-sm px-4 py-1 font-semibold">Security Solutions</Badge></div>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in-up delay-100">Our Security <span className="theme-gradient-text">Platform</span></h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-200 leading-relaxed">Comprehensive cybersecurity solutions to protect your endpoints, cloud infrastructure, identities, and data from advanced threats.</p>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">End-to-End Protection</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Six integrated layers of defense, working together as one unified platform.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(loading ? [] : services).map((svc, idx) => {
              const Icon = ICONS[svc.icon] || Code;
              return (
                <div key={svc.slug} className="reveal-scale bg-white rounded-2xl border border-gray-100 shadow-md p-7 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group" style={{ transitionDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-start gap-4 mb-5">
                    <div className="w-12 h-12 rounded-xl theme-gradient flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"><Icon className="h-6 w-6 text-white" /></div>
                    <div><h3 className="font-bold text-gray-900 leading-tight">{svc.title}</h3><p className="text-xs text-gray-500 mt-1 leading-relaxed">{svc.tagline || svc.description}</p></div>
                  </div>
                  {!!(svc.capabilities || []).length && (
                    <div className="space-y-4 mb-6">
                      {svc.capabilities.map((cap) => (
                        <div key={cap.label}>
                          <div className="flex justify-between mb-1.5"><span className="text-xs text-gray-600">{cap.label}</span><span className="text-xs font-bold theme-text">{cap.value}%</span></div>
                          <div className="progress-wrapper thin">
                            <div className="progress-bar" style={{ '--progress-target': `${cap.value}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  <ul className="space-y-2 mb-6">
                    {(svc.features || []).map((f) => (<li key={f} className="flex items-center gap-2 text-xs text-gray-600"><CheckCircle2 className="h-3.5 w-3.5 shrink-0" style={{ color: 'var(--theme-primary)' }} />{f}</li>))}
                  </ul>
                  <Link to={`/services/${svc.slug}`}><Button variant="ghost" className="w-full theme-text hover:bg-gray-50 text-sm font-semibold">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Enterprise Packages</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Full-Service Solutions</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Comprehensive technology services designed to transform your business and drive growth.</p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {(loading ? [] : services).map((service, idx) => (
              <Card key={service.slug} className="reveal hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" style={{ transitionDelay: `${idx * 0.12}s` }}>
                <CardHeader>
                  <div className="flex items-start justify-between mb-3"><CardTitle className="text-2xl">{service.title}</CardTitle><Badge className="theme-badge">Enterprise</Badge></div>
                  <CardDescription className="text-base leading-relaxed">{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3 text-sm">Key Features:</h4>
                    <ul className="space-y-2.5">
                      {(service.features || []).map((feature) => (<li key={feature} className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" style={{ color: 'var(--theme-primary)' }} /><span className="text-sm text-gray-600">{feature}</span></li>))}
                    </ul>
                  </div>
                  {service.pricing && typeof service.pricing.basic === 'number' && (
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-1">Starting from:</p>
                      <div className="flex items-baseline gap-1"><span className="text-3xl font-extrabold text-gray-900">${service.pricing.basic.toLocaleString()}</span><span className="text-gray-400 text-sm">/month</span></div>
                    </div>
                  )}
                  <Link to={`/services/${service.slug}`}><Button className="theme-btn w-full rounded-xl h-11 font-semibold" size="lg">Learn More <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 theme-gradient">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center reveal">
          <h2 className="text-4xl font-bold text-white mb-5">Secure Your Organization Today</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Let's discuss how our security platform can protect your entire digital infrastructure.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact"><Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl px-8 h-12">Contact Our Team <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
            <Link to="/pricing"><Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 font-bold rounded-xl px-8 h-12">View Pricing</Button></Link>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
