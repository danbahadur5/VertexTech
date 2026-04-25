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

// We're using next/dynamic for these sections to keep the initial page load snappy.
// It's a bit of a performance win, especially for users on slower connections.
const TrustedBy = dynamic(() => import("./components/TrustedBy"), { ssr: false });
const Capabilities = dynamic(() => import("./components/Capabilities"), { ssr: false });
const Services = dynamic(() => import("./components/Services"), { ssr: false });
const FeatureProject = dynamic(() => import("./components/FeaturedProject"), { ssr: false });
const FeatureBlog = dynamic(() => import("./components/FeaturedBlog"), { ssr: false });
const Testimonials = dynamic(() => import("./components/Testimonials"), { ssr: false });
const FAQSection = dynamic(() => import("./components/FAQSection"), { ssr: false });
const CTASection = dynamic(() => import("./components/CTASection"), { ssr: false });

/**
 * SectionWrapper helps us only load and render components when they're actually
 * about to scroll into view. This keeps the browser from doing unnecessary work.
 */
function SectionWrapper({ children, placeholder = <div className="h-40" /> }) {
  const [observeRef, isVisible] = useInView({ 
    rootMargin: '200px', // Start loading a bit before the user gets there
    triggerOnce: true     // Once it's loaded, keep it loaded
  });

  return (
    <div ref={observeRef}>
      {isVisible ? (
        <Suspense fallback={placeholder}>
          {children}
        </Suspense>
      ) : (
        placeholder
      )}
    </div>
  );
}

export default function HomePage() {
  // This hook adds some nice entry animations as the user scrolls.
  useScrollReveal();

  return (
    <div className="min-h-screen bg-background selection:bg-blue-100">
      {/* Navigation & Hero - these are the first things people see, so they load instantly */}
      <PublicHeader />
      <Hero_Section />
      <Hero_Trusted_Count />

      {/* The rest of the page is loaded lazily to keep things smooth */}
      <SectionWrapper>
        <TrustedBy />
      </SectionWrapper>

      <SectionWrapper>
        <Capabilities />
      </SectionWrapper>

      <SectionWrapper>
        <Services />
      </SectionWrapper>

      <SectionWrapper>
        <FeatureProject />
      </SectionWrapper>
      
      <SectionWrapper>
        <HowItWork />
      </SectionWrapper>

      <SectionWrapper>
        <Testimonials />
      </SectionWrapper>

      <SectionWrapper>
        <FeatureBlog />
      </SectionWrapper>

      <SectionWrapper>
        <FAQSection />
      </SectionWrapper>

      <SectionWrapper>
        <CTASection />
      </SectionWrapper>

      <SectionWrapper>
        <PublicFooter />
      </SectionWrapper>
    </div>
  );
}
