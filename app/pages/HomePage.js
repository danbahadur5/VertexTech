"use client";
import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { PublicHeader } from "../components/layout/PublicHeader";
import { PublicFooter } from "../components/layout/PublicFooter";
import { useScrollReveal } from "../lib/use-scroll-reveal";
import Hero_Section from "./components/Hero_Section";
import Hero_Trusted_Count from "./components/Hero_Trusted_Count";
import HowItWork from "./components/How_IT_Work";
import { useInView } from "../lib/use-in-view";

// Use next/dynamic for better performance and smaller initial bundles
const TrustedBy = dynamic(() => import("./components/TrustedBy"), { ssr: false });
const Capabilities = dynamic(() => import("./components/Capabilities"), { ssr: false });
const Services = dynamic(() => import("./components/Services"), { ssr: false });
const FeatureProject = dynamic(() => import("./components/FeaturedProject"), { ssr: false });
const FeatureBlog = dynamic(() => import("./components/FeaturedBlog"), { ssr: false });
const Testimonials = dynamic(() => import("./components/Testimonials"), { ssr: false });
const FAQSection = dynamic(() => import("./components/FAQSection"), { ssr: false });
const CTASection = dynamic(() => import("./components/CTASection"), { ssr: false });

function LazySection({ children, fallback = <div className="h-40" /> }) {
  const [ref, isInView] = useInView({ rootMargin: '200px', triggerOnce: true });
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
  return (
    <div className="min-h-screen bg-background">
      {/* Public Header */}
      <PublicHeader />
      <Hero_Section />
      <Hero_Trusted_Count />

      {/* Trusted sections */}
      <LazySection>
        <TrustedBy />
      </LazySection>

      <LazySection>
        <Capabilities />
      </LazySection>

      {/* Services Sections */}
      <LazySection>
        <Services />
      </LazySection>

      {/* Features Sections */}
      <LazySection>
        <FeatureProject />
      </LazySection>
      
      <LazySection>
        <HowItWork />
      </LazySection>

      {/* Testimonials Sections */}
      <LazySection>
        <Testimonials />
      </LazySection>

      {/* Features Blog Section */}
      <LazySection>
        <FeatureBlog />
      </LazySection>

      {/* FAQ section */}
      <LazySection>
        <FAQSection />
      </LazySection>

      <LazySection>
        <CTASection />
      </LazySection>

      {/* Public Footer Section */}
      <LazySection>
        <PublicFooter />
      </LazySection>
    </div>
  );
}
