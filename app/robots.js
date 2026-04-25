export default function robots() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://darbartech.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/', '/admin/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
