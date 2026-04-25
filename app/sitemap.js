import { connectDB } from "./lib/db";
import { Service, BlogPost, CaseStudy, Page } from "./models";

export default async function sitemap() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://darbartech.vercel.app';
  
  await connectDB();

  // Static routes
  const staticRoutes = [
    '',
    '/about',
    '/services',
    '/caseStudy',
    '/blog',
    '/contact',
    '/careers',
    '/pricing',
    '/login',
    '/register',
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic routes
  const [services, blogPosts, caseStudies, pages] = await Promise.all([
    Service.find({}).select('slug updatedAt').lean(),
    BlogPost.find({ status: 'published' }).select('slug updatedAt').lean(),
    CaseStudy.find({}).select('slug updatedAt').lean(),
    Page.find({ status: 'published' }).select('slug updatedAt').lean(),
  ]);

  const serviceRoutes = services.map((s) => ({
    url: `${siteUrl}/services/${s.slug}`,
    lastModified: s.updatedAt?.toISOString() || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogRoutes = blogPosts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: p.updatedAt?.toISOString() || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const caseStudyRoutes = caseStudies.map((c) => ({
    url: `${siteUrl}/caseStudy/${c.slug}`,
    lastModified: c.updatedAt?.toISOString() || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const customPageRoutes = pages.map((p) => ({
    url: `${siteUrl}/pages/${p.slug}`,
    lastModified: p.updatedAt?.toISOString() || new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...serviceRoutes, ...blogRoutes, ...caseStudyRoutes, ...customPageRoutes];
}
