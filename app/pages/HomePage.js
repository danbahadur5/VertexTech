import React, { Suspense, lazy } from "react";
import { PublicHeader } from "../components/layout/PublicHeader";
import { PublicFooter } from "../components/layout/PublicFooter";
import { Badge } from "../components/ui/badge";
import { useScrollReveal } from "../lib/use-scroll-reveal";
import Hero_Section from "./components/Hero_Section";
import Hero_Trusted_Count from "./components/Hero_Trusted_Count";
import { useInView } from "../lib/use-in-view";

// Lazy load components below the fold
const TrustedBy = lazy(() => import("./components/TrustedBy"));
const Capabilities = lazy(() => import("./components/Capabilities"));
const Services = lazy(() => import("./components/Services"));
const FeatureProject = lazy(() => import("./components/FeaturedProject"));
const FeatureBlog = lazy(() => import("./components/FeaturedBlog"));
const Testimonials = lazy(() => import("./components/Testimonials"));
const FAQSection = lazy(() => import("./components/FAQSection"));
const CTASection = lazy(() => import("./components/CTASection"));

function LazySection({ children, fallback = null }) {
  const [ref, isInView] = useInView({ rootMargin: '200px' });
  return (
    <div ref={ref}>
      {isInView ? (
        <Suspense fallback={fallback}>
          {children}
        </Suspense>
      ) : (
        fallback
      )}
    </div>
  );
}

export default function HomePage() {
  useScrollReveal();

  const howItWorks = [
    {
      step: "01",
      title: "Deploy",
      desc: "Install our lightweight agent or connect via API. No reboots, no downtime, full coverage in under 24 hours.",
    },
    {
      step: "02",
      title: "Discover",
      desc: "Automatic asset discovery maps your entire attack surface across endpoints, cloud, and identity systems.",
    },
    {
      step: "03",
      title: "Detect",
      desc: "AI behavioral models analyze billions of events in real time, identifying threats with industry-leading accuracy.",
    },
    {
      step: "04",
      title: "Defend",
      desc: "Automated response playbooks contain threats instantly while our SOC team investigates and remediates.",
    },
  ];
  return (
    <div className="min-h-screen bg-background">
      <PublicHeader />
      <Hero_Section />
      <Hero_Trusted_Count />
      
      <LazySection>
        <TrustedBy />
      </LazySection>

      <LazySection>
        <Capabilities />
      </LazySection>

      <LazySection>
        <Services />
      </LazySection>

      <LazySection>
        <FeatureProject />
      </LazySection>

      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16 reveal">
            <Badge className="mb-4 theme-badge">How It Works</Badge>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Deployed in Hours. Defending in Minutes.
            </h2>
            <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
              Our four-step framework delivers comprehensive protection from day
              one.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, idx) => (
              <div
                  key={item.step}
                  className="reveal text-center group"
                  style={{ transitionDelay: `${idx * 0.12}s` }}
                >
                <div className="relative inline-flex mb-6">
                  <div className="w-16 h-16 rounded-2xl theme-gradient flex items-center justify-center text-white font-extrabold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {item.step}
                  </div>
                  <div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background: "var(--theme-glow)",
                      filter: "blur(12px)",
                      zIndex: -1,
                    }}
                  />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                  {item.title}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <LazySection>
        <Testimonials />
      </LazySection>

      <LazySection>
        <FeatureBlog />
      </LazySection>

      <LazySection>
        <FAQSection />
      </LazySection>

      <LazySection>
        <CTASection />
      </LazySection>

      <PublicFooter />
    </div>
  );
}
