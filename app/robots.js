export default function robots() {
  const siteUrl = process.env.NEXTAUTH_URL || 'https://darbartech.vercel.app';
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/dashboard/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
