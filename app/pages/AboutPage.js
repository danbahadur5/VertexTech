import React from 'react';
import { Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { CheckCircle2, Target, Users, Award, ArrowRight, Zap, Shield, Globe } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useScrollReveal } from '../lib/use-scroll-reveal';

export default function AboutPage() {
  useScrollReveal();
  const team = [
    { name: 'Sarah Johnson',  position: 'CEO & Founder',    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&h=300&fit=crop', bio: '15+ years in enterprise technology' },
    { name: 'Michael Chen',   position: 'CTO',              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop', bio: 'Expert in cloud architecture & AI' },
    { name: 'Emily Roberts',  position: 'Head of Design',   avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop', bio: 'Award-winning UX designer' },
    { name: 'David Kim',      position: 'Lead Developer',   avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop', bio: 'Full-stack engineering specialist' },
  ];
  const values = [
    { icon: Target,       title: 'Innovation First',  description: 'We stay ahead of the curve with cutting-edge technology solutions.' },
    { icon: Users,        title: 'Client-Centric',    description: 'Your success is our priority. We build lasting partnerships.' },
    { icon: CheckCircle2, title: 'Quality Assured',   description: 'Enterprise-grade solutions with rigorous testing and support.' },
    { icon: Award,        title: 'Excellence',        description: 'Award-winning team delivering exceptional results consistently.' },
  ];
  const milestones = [
    { year: '2010', event: 'VertexTech Founded', desc: 'Started with a small team of passionate developers in San Francisco.' },
    { year: '2014', event: 'First Enterprise Client', desc: 'Landed our first Fortune 500 client — Global Financial Corp.' },
    { year: '2018', event: 'Global Expansion', desc: 'Opened offices in New York and London, serving clients worldwide.' },
    { year: '2022', event: 'AI Security Launch', desc: 'Launched our AI-powered cybersecurity platform, protecting 10M+ endpoints.' },
    { year: '2026', event: 'Now', desc: '2,000+ security teams trust us to protect their critical infrastructure every day.' },
  ];
  const principles = [
    { icon: Shield, title: 'Zero Trust Mindset',       desc: 'We assume breach by default, building systems that verify every access request.' },
    { icon: Zap,    title: 'Radical Transparency',     desc: 'No black boxes. We explain every decision, every alert, every action taken.' },
    { icon: Globe,  title: 'Relentless Innovation',    desc: 'The threat landscape never stops evolving — neither do we.' },
  ];
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <section className="relative py-28 overflow-hidden theme-bg-light hero-grid-bg">
        <div className="blob blob-primary w-96 h-96 top-[-120px] right-[-100px]" />
        <div className="blob blob-secondary w-72 h-72 bottom-[-80px] left-[-60px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-5 theme-badge text-sm px-4 py-1 font-semibold animate-fade-in">About VertexTech</Badge>
            <h1 className="text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in-up delay-100">
              Defending the <span className="theme-gradient-text">Digital Frontier</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
              Founded by ex-NSA and military cyber operators, VertexTech builds the next
              generation of threat protection for modern enterprises. For over 15 years,
              we've helped organizations transform through innovative technology solutions.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="animate-fade-in-left delay-300">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl theme-glow-effect">
                <ImageWithFallback src="https://images.unsplash.com/photo-1758518731468-98e90ffd7430?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080" alt="Our team working together" className="w-full h-auto" />
              </div>
            </div>
            <div className="animate-fade-in-right delay-300">
              <h2 className="text-3xl font-bold text-gray-900 mb-5">Our Story</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Founded in 2010, VertexTech started with a simple vision: to make enterprise
                technology accessible, reliable, and transformative. What began as a small team
                of passionate developers has grown into a global leader serving Fortune 500 companies.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Today, we're proud to have delivered over 500 successful projects, helping businesses
                across industries leverage cloud computing, cybersecurity, custom software, and data
                analytics to achieve their goals.
              </p>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { num: '500+', label: 'Projects Completed' },
                  { num: '300+', label: 'Happy Clients' },
                  { num: '50+',  label: 'Team Members' },
                  { num: '15+',  label: 'Years Experience' },
                ].map(({ num, label }) => (
                  <div key={label} className="text-center bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
                    <div className="text-3xl font-extrabold theme-gradient-text mb-1">{num}</div>
                    <div className="text-sm text-gray-500">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Our Principles</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How We Think</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">The guiding principles that shape every solution we build.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {principles.map((p, idx) => {
              const Icon = p.icon;
              return (
                <div key={p.title} className="reveal-scale text-center p-8 rounded-2xl border border-gray-100 bg-gray-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" style={{ transitionDelay: `${idx * 0.15}s` }}>
                  <div className="w-16 h-16 theme-gradient rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{p.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{p.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Our Journey</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Milestones That Matter</h2>
          </div>
          <div className="relative">
            <div className="absolute left-8 top-0 bottom-0 w-0.5" style={{ background: 'linear-gradient(to bottom, var(--theme-gradient-from), var(--theme-gradient-to))' }} />
            <div className="space-y-10">
              {milestones.map((m, i) => (
                <div key={m.year} className="reveal flex gap-8 items-start pl-4" style={{ transitionDelay: `${i * 0.1}s` }}>
                  <div className="relative z-10 w-10 h-10 rounded-full theme-gradient flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-lg">{i + 1}</div>
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 flex-1 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <Badge className="theme-badge text-xs">{m.year}</Badge>
                      <span className="font-bold text-gray-900">{m.event}</span>
                    </div>
                    <p className="text-sm text-gray-600">{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Our Values</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">The Principles That Guide Us</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">What we stand for, every single day.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, idx) => {
              const Icon = v.icon;
              return (
                <Card key={v.title} className="reveal text-center hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group" style={{ transitionDelay: `${idx * 0.12}s` }}>
                  <CardContent className="pt-8 pb-6">
                    <div className="w-16 h-16 rounded-full theme-gradient flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{v.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{v.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Leadership Team</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">The talented people behind VertexTech's success.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, idx) => (
              <Card key={member.name} className="reveal text-center hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group overflow-hidden" style={{ transitionDelay: `${idx * 0.12}s` }}>
                <CardContent className="pt-8 pb-6">
                  <div className="relative inline-block mb-5">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-24 h-24 rounded-full mx-auto object-cover ring-4 ring-white shadow-lg group-hover:ring-4 transition-all"
                      style={{ '--tw-ring-color': 'var(--theme-primary)' }}
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full theme-gradient flex items-center justify-center shadow-sm">
                      <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                    </div>
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{member.name}</h3>
                  <p className="text-sm font-semibold theme-text mb-2">{member.position}</p>
                  <p className="text-xs text-gray-500">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 theme-gradient">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center reveal">
          <h2 className="text-4xl font-bold text-white mb-5">Join the Mission</h2>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            We're always looking for talented people who are passionate about cybersecurity and making a real difference.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/careers">
              <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl px-8 h-12">
                View Open Roles <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/contact">
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
