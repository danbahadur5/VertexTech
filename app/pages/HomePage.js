import React, { Suspense, lazy } from "react";
import { PublicHeader } from "../components/layout/PublicHeader";
import { PublicFooter } from "../components/layout/PublicFooter";
import { useScrollReveal } from "../lib/use-scroll-reveal";
import Hero_Section from "./components/Hero_Section";
import Hero_Trusted_Count from "./components/Hero_Trusted_Count";
import HowItWork from "./components/How_IT_Work";
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
  return (
    <div className="min-h-screen bg-background">
      {/* Public Header */}
      <PublicHeader />
      <Hero_Section />
      <Hero_Trusted_Count />

{/* Truested sections */}
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


{/* Featurs Sections */}
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
