import React from "react";
import { PublicHeader } from "./layout/PublicHeader";
import { PublicFooter } from "./layout/PublicFooter";
import Hero_Section from "../../app/pages/components/Hero_Section";
import Hero_Trusted_Count from "../../app/pages/components/Hero_Trusted_Count";
import HowItWork from "../../app/pages/components/How_IT_Work";
import TrustedBy from "../../app/pages/components/TrustedBy";
import Capabilities from "../../app/pages/components/Capabilities";
import Services from "../../app/pages/components/Services";
import FeatureProject from "../../app/pages/components/FeaturedProject";
import FeatureBlog from "../../app/pages/components/FeaturedBlog";
import Testimonials from "../../app/pages/components/Testimonials";
import FAQSection from "../../app/pages/components/FAQSection";
import CTASection from "../../app/pages/components/CTASection";
import { getHomeData } from "../lib/home-data";
import { ScrollRevealWrapper } from "./ScrollRevealWrapper";

export default async function HomePageServer() {
  const data = await getHomeData();

  return (
    <div className="min-h-screen bg-background">
      <ScrollRevealWrapper>
        <PublicHeader />
        
        <Hero_Section initialData={data.hero} />
        <Hero_Trusted_Count initialData={data.heroTrustedCount} />

        <TrustedBy initialData={data.trustedCompany} />

        <Capabilities initialData={data.capabilities} />

        <Services initialData={data.services} />

        <FeatureProject initialData={data.featuredCaseStudies} />
        
        <HowItWork />

        <Testimonials initialData={data.testimonials} />

        <FeatureBlog initialData={data.featuredBlogs} />

        <FAQSection initialData={data.faq} />

        <CTASection />

        <PublicFooter initialData={data.footer} />
      </ScrollRevealWrapper>
    </div>
  );
}
