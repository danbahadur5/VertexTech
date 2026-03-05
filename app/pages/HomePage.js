import React, { useRef, useEffect } from "react";
import { Link } from "react-router";
import { PublicHeader } from "../components/layout/PublicHeader";
import { PublicFooter } from "../components/layout/PublicFooter";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { ArrowRight, Cloud, Shield, Code, BarChart3, Star, Quote, MapPin, Phone, Mail, Clock, Zap, Lock, Globe, Activity } from "lucide-react";
import { mockServices, mockBlogPosts, mockPortfolio } from "../lib/mock-data";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordion";
import { useScrollReveal } from "../lib/use-scroll-reveal";
import Hero_Section from "./components/Hero_Section";


export default function HomePage() {
  useScrollReveal();
  const testimonials = [
    { quote: "VertexTech transformed our entire infrastructure. Their expertise and dedication were outstanding.", author: "John Smith", position: "CTO, Global Financial Corp", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop", rating: 5 },
    { quote: "The best technology partner we've ever worked with. They delivered beyond our expectations.", author: "Emily Roberts", position: "CEO, MediCare Solutions", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop", rating: 5 },
    { quote: "Professional, innovative, and results-driven. VertexTech is our go-to for all tech solutions.", author: "Michael Chen", position: "Director of IT, RetailPro", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop", rating: 5 },
  ];
  const serviceIcons = { Cloud, Shield, Code, BarChart3 };
  const capabilities = [
    { label: "Threat Detection Accuracy", value: 99, icon: Shield },
    { label: "Cloud Workload Coverage", value: 95, icon: Cloud },
    { label: "Incident Response Automation", value: 88, icon: Zap },
    { label: "Compliance Framework Support", value: 92, icon: Lock },
    { label: "Global Threat Intelligence", value: 97, icon: Globe },
    { label: "SOC Analyst Efficiency Gain", value: 74, icon: Activity },
  ];
  const howItWorks = [
    { step: "01", title: "Deploy", desc: "Install our lightweight agent or connect via API. No reboots, no downtime, full coverage in under 24 hours." },
    { step: "02", title: "Discover", desc: "Automatic asset discovery maps your entire attack surface across endpoints, cloud, and identity systems." },
    { step: "03", title: "Detect", desc: "AI behavioral models analyze billions of events in real time, identifying threats with industry-leading accuracy." },
    { step: "04", title: "Defend", desc: "Automated response playbooks contain threats instantly while our SOC team investigates and remediates." },
  ];
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      {/* <section className="relative py-24 overflow-hidden theme-bg-light hero-grid-bg">
        <div className="blob blob-primary w-96 h-96 top-[-120px] left-[-100px]" />
        <div className="blob blob-secondary w-72 h-72 bottom-[-80px] right-[-60px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Badge className="mb-5 theme-badge text-sm px-4 py-1 font-semibold">Welcome</Badge>
          <h1 className="text-5xl sm:text-6xl font-extrabold my-3 text-gray-900 animate-fade-in-up">
            Build Secure, Scalable Systems with <span className="theme-gradient-text">VertexTech</span>
          </h1>
          <p className="mb-6 text-xl text-gray-700 leading-relaxed animate-fade-in-up delay-100">
            Cloud, cybersecurity, and software that scale with your ambition.
          </p>
          <div className="flex gap-3 items-center justify-center animate-fade-in delay-200">
            <Link to="/contact"><Button className="theme-btn rounded-xl font-semibold px-6 h-11">Get Started</Button></Link>
            <Link to="/services"><Button variant="outline" className="theme-btn-outline rounded-xl font-semibold px-6 h-11">Our Solutions</Button></Link>
          </div>
        </div>
      </section> */}
      <Hero_Section />
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">How It Works</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Deployed in Hours. Defending in Minutes.</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Our four-step framework delivers comprehensive protection from day one.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => (
              <div key={item.step} className="reveal text-center group" style={{ transitionDelay: `${idx * 0.12}s` }}>
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl theme-gradient flex items-center justify-center text-white font-extrabold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">{item.step}</div>
                  <div className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: "var(--theme-glow)", filter: "blur(12px)", zIndex: -1 }} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="reveal">
                <Badge className="mb-4 theme-badge">Platform Capabilities</Badge>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Industry-Leading <span className="theme-gradient-text">Security Metrics</span></h2>
                <p className="text-lg text-gray-600 mb-10 leading-relaxed">Our AI-driven platform consistently outperforms the competition across every key security measurement — because your protection depends on it.</p>
              </div>
              <div className="space-y-7">
                {capabilities.map((cap, i) => {
                  const Icon = cap.icon;
                  return (
                    <div key={cap.label} className="reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" style={{ color: "var(--theme-primary)" }} />
                          <span className="text-sm font-semibold text-gray-700">{cap.label}</span>
                        </div>
                        <span className="text-sm font-bold theme-gradient-text">{cap.value}%</span>
                      </div>
                      <div className="progress-wrapper"><div className="progress-bar" style={{ "--progress-target": `${cap.value}%` }} /></div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {[{ icon: Shield, title: "Zero-Day Protection", desc: "Behavioral AI stops novel threats before signatures exist." }, { icon: Cloud, title: "Cloud Native", desc: "Seamless coverage across AWS, Azure, and GCP environments." }, { icon: Zap, title: "Auto Response", desc: "Sub-second automated containment with full audit trails." }, { icon: Lock, title: "Zero Trust", desc: "Never trust, always verify — enforced across every identity." }].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={feat.title} className="reveal-scale bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group" style={{ transitionDelay: `${idx * 0.12}s` }}>
                    <div className="w-12 h-12 rounded-xl theme-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Icon className="h-6 w-6 text-white" /></div>
                    <h4 className="font-bold text-gray-900 mb-2">{feat.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Our Solutions</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Complete Enterprise Solutions</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">From endpoint to cloud, protect and scale every layer of your digital infrastructure.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mockServices.map((service, idx) => {
              const Icon = (serviceIcons[service.icon] || Code);
              return (
                <Card key={service.id} className="reveal group hover:shadow-2xl transition-all duration-300 border hover:-translate-y-2 cursor-pointer" style={{ transitionDelay: `${idx * 0.12}s` }}>
                  <CardHeader>
                    <div className="w-14 h-14 rounded-xl theme-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Icon className="h-7 w-7 text-white" /></div>
                    <CardTitle className="text-lg">{service.title}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{service.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link to={`/services/${service.slug}`}>
                      <Button variant="ghost" className="w-full theme-text hover:bg-gray-50 font-semibold">
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-20 theme-gradient">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            {[{ num: "10M", suffix: "+", label: "Endpoints Protected" }, { num: "500", suffix: "B+", label: "Events Analyzed Daily" }, { num: "99.9", suffix: "%", label: "Platform Uptime" }, { num: "24", suffix: "/7", label: "SOC Coverage" }].map((s, i) => (
              <div key={s.label} className="reveal" style={{ transitionDelay: `${i * 0.12}s` }}>
                <div className="text-5xl font-extrabold mb-2 text-white/90">{s.num}{s.suffix}</div>
                <div className="text-white/60 text-sm font-medium">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Case Studies</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Success stories from our portfolio of enterprise solutions</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockPortfolio.map((project, idx) => (
              <Card key={project.id} className="reveal overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-md" style={{ transitionDelay: `${idx * 0.12}s` }}>
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback src={project.gallery[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="theme-badge">{project.client}</Badge>
                    {project.featured && (<Badge className="bg-amber-100 text-amber-800"><Star className="h-3 w-3 mr-1" fill="currentColor" /> Featured</Badge>)}
                  </div>
                  <CardTitle className="text-lg">{project.title}</CardTitle>
                  <CardDescription className="text-sm">{project.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.technologies.slice(0, 3).map((tech) => (<Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>))}
                  </div>
                  <Link to={`/portfolio/${project.slug}`}>
                    <Button variant="ghost" className="w-full theme-text hover:bg-gray-50">View Case Study <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Button size="lg" variant="outline" className="theme-btn-outline rounded-xl px-8 h-12 font-bold" asChild>
              <Link to="/portfolio">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Testimonials</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Security Leaders</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">See why CISOs and security teams across industries choose us.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <Card key={idx} className="reveal hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden" style={{ transitionDelay: `${idx * 0.15}s` }}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5" style={{ background: "var(--theme-primary)", transform: "translate(30%,-30%)" }} />
                <CardContent className="pt-8">
                  <Quote className="h-8 w-8 mb-4 opacity-30" style={{ color: "var(--theme-primary)" }} />
                  <p className="text-gray-700 mb-6 italic leading-relaxed">"{t.quote}"</p>
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100" />
                    <div>
                      <div className="font-semibold text-gray-900 text-sm">{t.author}</div>
                      <div className="text-xs text-gray-500">{t.position}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-4">{[...Array(t.rating)].map((_, i) => (<Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />))}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-24 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div className="reveal-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Talk to a Security Expert</h2>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">Ready to strengthen your security posture? Our team of cybersecurity experts is available 24/7 to assess your needs and recommend the right protection.</p>
              <div className="space-y-4">
                {[{ Icon: MapPin, label: "VertexTech HQ", sub: "123 Tech Street, San Francisco, CA 94105" }, { Icon: Phone, label: "+1 (555) 123-4567", sub: "" }, { Icon: Mail, label: "contact@vertextech.com", sub: "" }].map(({ Icon, label, sub }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg theme-gradient flex items-center justify-center shrink-0"><Icon className="h-5 w-5 text-white" /></div>
                    <div><div className="font-semibold text-gray-900 text-sm">{label}</div>{sub && (<div className="text-sm text-gray-500 mt-0.5">{sub}</div>)}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="reveal-right rounded-2xl border border-gray-200 p-8 bg-white shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Office Hours</h3>
              <div className="space-y-4">
                {[{ day: "Monday – Friday", hours: "7:00 AM – 6:00 PM PST" }, { day: "Saturday", hours: "8:00 AM – 2:00 PM PST" }, { day: "Sunday", hours: "Closed" }].map(({ day, hours }) => (
                  <div key={day} className="flex items-center gap-3">
                    <Clock className="h-5 w-5 shrink-0" style={{ color: "var(--theme-primary)" }} />
                    <span className="text-sm text-gray-700"><strong>{day}:</strong> {hours}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link to="/contact">
                  <Button size="lg" className="theme-btn rounded-xl w-full h-12 font-bold">
                    Get In Touch <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">Insights</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Trends, best practices, and expert insights in enterprise technology.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {mockBlogPosts.map((post, idx) => (
              <Card key={post.id} className="reveal overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-md" style={{ transitionDelay: `${idx * 0.12}s` }}>
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="theme-badge">{post.category}</Badge>
                    <span className="text-xs text-muted-foreground">{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-base">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs text-muted-foreground">{post.author.name}</span>
                    </div>
                    <Link to={`/blog/${post.slug}`}><Button variant="ghost" size="sm" className="theme-text text-xs">Read More <ArrowRight className="ml-1 h-3 w-3" /></Button></Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12 reveal">
            <Button size="lg" variant="outline" className="theme-btn-outline rounded-xl px-8 h-12 font-bold" asChild>
              <Link to="/blog">View All Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
        </div>
      </section>

        <section className="py-24 bg-white">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="text-center mb-14 reveal">
            <Badge className="mb-4 theme-badge">FAQ</Badge>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Common questions about our platform and services.</p>
          </div>
          <div className="reveal">
            <Accordion type="single" collapsible className="space-y-3">
              {[{ q: "How quickly can we deploy across our organization?", a: "Most customers are fully operational within one week. Our lightweight agent installs silently with no reboots required, and cloud integrations connect via API in minutes." }, { q: "Does VertexTech replace our existing SIEM?", a: "We complement your SIEM by integrating seamlessly with major platforms and enriching data with detection context and insights." }, { q: "Do you provide 24/7 coverage?", a: "Yes, our team offers around-the-clock monitoring, triage, and response with defined SLAs on advanced plans." }, { q: "How do you detect zero‑day threats?", a: "We use behavioral analysis to identify anomalous activity across processes, memory, and network patterns, blocking novel exploits in real time." }, { q: "Can we start with a pilot?", a: "Absolutely. We can begin with a scoped pilot and expand progressively to full coverage once success criteria are met." }].map((item, i) => (
                <AccordionItem key={i} value={`item-${i}`} className="bg-gray-50 rounded-xl border border-gray-200 px-6">
                  <AccordionTrigger className="font-semibold text-gray-900 hover:no-underline py-5">{item.q}</AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-5 leading-relaxed">{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
      <section className="py-24 theme-gradient">
        <div className="mx-auto max-w-4xl px-6 lg:px-8 text-center">
          <div className="reveal">
            <h2 className="text-4xl font-extrabold text-white mb-6">Ready to Secure Your Organization?</h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">Join 2,000+ security teams that trust VertexTech to protect their endpoints, cloud, and identities.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/pricing"><Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100 font-bold rounded-xl px-8 h-12 shadow-lg">View Pricing <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/contact"><Button size="lg" variant="outline" className="border-2 border-white/50 text-white hover:bg-white/10 font-bold rounded-xl px-8 h-12">Contact Us</Button></Link>
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
