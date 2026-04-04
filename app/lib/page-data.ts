import { connectDB } from "./db";
import { Service, BlogPost, CaseStudy, SiteSetting } from "../models";
import { cache } from "react";

export const getServicesData = cache(async () => {
  await connectDB();
  const services = await Service.find({}).lean();
  return JSON.parse(JSON.stringify(services));
});

export const getServiceBySlug = cache(async (slug: string) => {
  await connectDB();
  const service = await Service.findOne({ slug }).lean();
  return service ? JSON.parse(JSON.stringify(service)) : null;
});

export const getBlogsData = cache(async () => {
  await connectDB();
  const blogs = await BlogPost.find({ status: "published" }).sort({ publishedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(blogs));
});

export const getBlogBySlug = cache(async (slug: string) => {
  await connectDB();
  const blog = await BlogPost.findOne({ slug, status: "published" }).lean();
  return blog ? JSON.parse(JSON.stringify(blog)) : null;
});

export const getCaseStudiesData = cache(async () => {
  await connectDB();
  const studies = await CaseStudy.find({}).sort({ completedAt: -1 }).lean();
  return JSON.parse(JSON.stringify(studies));
});

export const getCaseStudyBySlug = cache(async (slug: string) => {
  await connectDB();
  const study = await CaseStudy.findOne({ slug }).lean();
  return study ? JSON.parse(JSON.stringify(study)) : null;
});

export const getAboutPageData = cache(async () => {
  await connectDB();
  const [hero, principles, milestones, team] = await Promise.all([
    SiteSetting.findOne({ key: "about-hero" }).lean(),
    SiteSetting.findOne({ key: "about-principles" }).lean(),
    SiteSetting.findOne({ key: "about-milestones" }).lean(),
    SiteSetting.findOne({ key: "about-team" }).lean(),
  ]);

  return {
    hero: hero?.data || null,
    principles: principles?.data?.items || [],
    milestones: milestones?.data?.items || [],
    team: team?.data?.items || [],
  };
});

export const getContactPageData = cache(async () => {
  await connectDB();
  const data = await SiteSetting.findOne({ key: "contact-page" }).lean();
  return data?.data || null;
});

export const getPricingPageData = cache(async () => {
  await connectDB();
  const [hero, plans, faq] = await Promise.all([
    SiteSetting.findOne({ key: "pricing-hero" }).lean(),
    SiteSetting.findOne({ key: "pricing-plans" }).lean(),
    SiteSetting.findOne({ key: "pricing-faq" }).lean(),
  ]);

  return {
    hero: hero?.data || null,
    plans: plans?.data?.items || [],
    faq: faq?.data?.items || [],
  };
});
