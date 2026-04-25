"use client";

import React, { useEffect, useState } from 'react';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, Shield, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { useScrollReveal } from '../lib/use-scroll-reveal';

export default function ContactPage({ initialData }) {
  useScrollReveal();

  const [hero, setHero] = useState({
    badge: initialData?.badge || 'Get in Touch',
    titleLeading: initialData?.titleLeading || 'Talk to a',
    titleGradient: initialData?.titleGradient || 'Security Expert',
    subtitle: initialData?.subtitle || 'Ready to strengthen your security posture? Our team of cybersecurity experts is available 24/7 to assess your needs and recommend the right protection.',
  });
  const [contactData, setContactData] = useState({
    email: initialData?.contact?.email || 'contact@darbartech.com',
    emailLink: initialData?.contact?.emailLink || 'mailto:contact@darbartech.com',
    phone: initialData?.contact?.phone || '+1 (555) 123-4567',
    phoneLink: initialData?.contact?.phoneLink || 'tel:+15551234567',
    hqAddress: initialData?.contact?.hqAddress || '123 Tech Street, San Francisco, CA 94105',
    hqLink: initialData?.contact?.hqLink || 'https://maps.google.com',
    hours: initialData?.contact?.hours || 'Mon–Fri: 9:00 AM – 6:00 PM PST',
  });
  const [offices, setOffices] = useState(initialData?.offices || [
    { city: 'San Francisco', country: 'USA', address: '123 Tech Street, CA 94105', phone: '+1 (555) 123-4567' },
    { city: 'New York', country: 'USA', address: '456 Innovation Ave, NY 10001', phone: '+1 (555) 987-6543' },
    { city: 'London', country: 'UK', address: '789 Tech Hub, London EC1A 1BB', phone: '+44 20 1234 5678' },
  ]);
  useEffect(() => {
    if (initialData) return;
    (async () => {
      try {
        const res = await fetch('/api/settings/contact-page', { cache: 'no-store' });
        if (!res.ok) return;
        const js = await res.json();
        const d = js?.item?.data || {};
        setHero((prev) => ({
          badge: d.badge || prev.badge,
          titleLeading: d.titleLeading || prev.titleLeading,
          titleGradient: d.titleGradient || prev.titleGradient,
          subtitle: d.subtitle || prev.subtitle,
        }));
        if (d.contact) setContactData((prev) => ({ ...prev, ...d.contact }));
        if (Array.isArray(d.offices) && d.offices.length) setOffices(d.offices);
      } catch {}
    })();
  }, [initialData]);

  const [formData, setFormData] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error('Failed to send');
      setSubmitted(true);
      toast.success("Message sent! We'll get back to you within 24 hours.");
      setFormData({ name: '', email: '', company: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    } catch (err) {
      toast.error(err.message || 'Failed to send');
    } finally {
      setSubmitting(false);
    }
  };

  const contactInfo = [
    { icon: Mail, title: 'Email', content: contactData.email, link: contactData.emailLink },
    { icon: Phone, title: 'Phone', content: contactData.phone, link: contactData.phoneLink },
    { icon: MapPin, title: 'Headquarters', content: contactData.hqAddress, link: contactData.hqLink },
    { icon: Clock, title: 'Business Hours', content: contactData.hours },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader />

      <section className="relative py-24 overflow-hidden theme-bg-light hero-grid-bg">
        <div className="blob blob-primary w-80 h-80 top-[-100px] left-[-80px]" />
        <div className="blob blob-secondary w-64 h-64 bottom-[-60px] right-[-60px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Badge className="mb-5 theme-badge text-sm px-4 py-1 font-semibold animate-fade-in">{hero.badge}</Badge>
          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-gray-200 mb-6 animate-fade-in-up delay-100">
            {hero.titleLeading} <span className="theme-text">{hero.titleGradient}</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-200 leading-relaxed">
            {hero.subtitle}
          </p>
        </div>
      </section>

      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="reveal-left">
              <Card className="border border-gray-100 dark:border-gray-800 shadow-xl bg-white dark:bg-gray-900">
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl theme-bg flex items-center justify-center">
                      <MessageSquare className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl dark:text-gray-100">Send Us a Message</CardTitle>
                      <CardDescription className="dark:text-gray-400">We'll get back to you within 24 hours.</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {submitted ? (
                    <div className="text-center py-12 animate-scale-in">
                      <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Message Sent!</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Our team will reach out to you shortly.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="text-sm font-semibold">Full Name *</Label>
                          <Input id="name" placeholder="John Smith" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="rounded-xl border-gray-200 dark:border-gray-700 focus:border-transparent" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email" className="text-sm font-semibold">Email *</Label>
                          <Input id="email" type="email" placeholder="john@company.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="rounded-xl border-gray-200 dark:border-gray-700" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company" className="text-sm font-semibold">Company</Label>
                        <Input id="company" placeholder="Your Company Name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} className="rounded-xl border-gray-200 dark:border-gray-700" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject" className="text-sm font-semibold">I'm interested in *</Label>
                        <Select value={formData.subject} onValueChange={(v) => setFormData({ ...formData, subject: v })} required>
                          <SelectTrigger className="rounded-xl border-gray-200 dark:border-gray-700">
                            <SelectValue placeholder="Select a topic" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="demo">Product Demo</SelectItem>
                            <SelectItem value="pricing">Pricing & Plans</SelectItem>
                            <SelectItem value="security">Security Assessment</SelectItem>
                            <SelectItem value="partnership">Partnership</SelectItem>
                            <SelectItem value="support">Technical Support</SelectItem>
                            <SelectItem value="general">General Inquiry</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="message" className="text-sm font-semibold">Message *</Label>
                        <Textarea id="message" placeholder="Tell us about your organization and security needs..." rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} required className="rounded-xl border-gray-200 dark:border-gray-700 resize-none" />
                      </div>
                      <Button type="submit" size="lg" className="theme-btn w-full cursor-pointer rounded-xl h-12 font-bold" disabled={submitting}>
                        {submitting ? (<><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-rotate mr-2" />Sending...</>) : (<><Send className="h-4 w-4 mr-2" /> Send Message</>)}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className="reveal-right space-y-6">
              <div className="grid sm:grid-cols-2 gap-4">
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.title} className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-5 border border-gray-100 dark:border-gray-800 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                      <div className="w-10 h-10 rounded-xl theme-bg flex items-center justify-center mb-3">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <p className="font-bold text-gray-900 dark:text-gray-100 text-sm mb-1">{info.title}</p>
                      {info.link ? (<a href={info.link} className="text-sm theme-text hover:underline leading-snug">{info.content}</a>) : (<p className="text-sm text-gray-600 dark:text-gray-400 leading-snug">{info.content}</p>)}
                    </div>
                  );
                })}
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-green-900 dark:text-green-300">Our Response Promise</p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1 leading-relaxed">
                      We respond to every inquiry within 24 hours on business days, and within 4 hours for security incidents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Global Offices</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Visit Us</h2>

      <div className="bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto">
            <div className="text-center">
             <div className='flex jutify-center items-center text-center'>
              
                {/* <MapPin className="h-8 w-8 dark:text-white " /> */}
             </div>
              {/* <p className="font-semibold text-gray-700 dark:text-gray-300">Interactive Map</p> */}
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Google Maps integration</p>
            </div>
          
        </div>
      </div>

          </div>
        </div>
      </section>


      <PublicFooter />
    </div>
  );
}
