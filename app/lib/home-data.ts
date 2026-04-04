import { connectDB } from "./db";
import { SiteSetting, Service, BlogPost, CaseStudy } from "../models";
import { cache } from "react";

export const getHomeData = cache(async () => {
  await connectDB();

  const [
    trustedCompany,
    capabilities,
    services,
    featuredBlogs,
    featuredCaseStudies,
    faq,
    heroTrustedCount,
    testimonials,
    footer,
    heroGroups,
  ] = await Promise.all([
    SiteSetting.findOne({ key: "trusted-company" }).lean(),
    SiteSetting.findOne({ key: "capabilities" }).lean(),
    Service.find({}).limit(6).lean(),
    BlogPost.find({ status: "published", featured: true }).sort({ publishedAt: -1 }).limit(3).lean(),
    CaseStudy.find({ featured: true }).limit(3).lean(),
    SiteSetting.findOne({ key: "faq" }).lean(),
    SiteSetting.findOne({ key: "hero-trusted-count" }).lean(),
    SiteSetting.findOne({ key: "trusted-security-leader" }).lean(),
    SiteSetting.findOne({ key: "footer" }).lean(),
    SiteSetting.findOne({ key: "hero-groups" }).lean(),
  ]);

  const heroGroupsData = (heroGroups as any)?.data?.items || [];
  const activeHero = heroGroupsData.find((g: any) => g.active) || heroGroupsData[0] || null;

  return {
    trustedCompany: trustedCompany?.data || null,
    capabilities: capabilities?.data || null,
    services: JSON.parse(JSON.stringify(services)),
    featuredBlogs: JSON.parse(JSON.stringify(featuredBlogs)),
    featuredCaseStudies: JSON.parse(JSON.stringify(featuredCaseStudies)),
    faq: faq?.data || null,
    heroTrustedCount: heroTrustedCount?.data || null,
    testimonials: testimonials?.data || null,
    footer: footer?.data || null,
    hero: activeHero,
  };
});
