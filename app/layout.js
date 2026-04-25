import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { connectDB } from "./lib/db";
import { SiteSetting } from "./models";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
  preload: true,
});

import { cache } from "react";

const getSystemSettings = cache(async () => {
  await connectDB();
  const res = await SiteSetting.findOne({ key: "system" }).lean();
  return res?.data || {};
});

export async function generateMetadata() {
  const d = await getSystemSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://darbartech.vercel.app';
  
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: d.metaTitle || d.siteName || "DarbarTech | AI-Powered Cybersecurity & Software Solutions",
      template: `%s | ${d.siteName || 'DarbarTech'}`
    },
    description: d.metaDescription || "DarbarTech provides next-generation AI-powered cybersecurity, bespoke software development, and digital defense solutions for modern enterprises.",
    keywords: d.keywords || "cybersecurity, artificial intelligence, software development, digital defense, IT solutions, cloud security",
    authors: [{ name: "DarbarTech Team" }],
    creator: "DarbarTech",
    publisher: "DarbarTech",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: d.siteName || 'DarbarTech',
      title: d.metaTitle || d.siteName || "DarbarTech | AI-Powered Cybersecurity & Software Solutions",
      description: d.metaDescription || "Empowering businesses with cutting-edge AI security and custom software development.",
      images: [
        {
          url: d.ogImage || "/og-image.png",
          width: 1200,
          height: 630,
          alt: d.siteName || 'DarbarTech Logo',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: d.metaTitle || d.siteName || "DarbarTech | AI-Powered Cybersecurity & Solutions",
      description: d.metaDescription || "Next-generation digital defense and software development.",
      images: [d.ogImage || "/og-image.png"],
      creator: "@darbartech",
    },
    alternates: {
      canonical: '/',
      languages: {
        'en-US': '/en-US',
      },
    },
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: 'google-site-verification-id', // User should update this
      yandex: 'yandex-verification-id',
    },
    category: 'technology',
  };
}

export default async function RootLayout({ children }) {
  const d = await getSystemSettings();
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: d.siteName || 'DarbarTech',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://darbartech.vercel.app',
    logo: d.ogImage || 'https://darbartech.vercel.app/logo.png',
    description: d.metaDescription || "Next-generation digital defense and software development.",
    sameAs: [
      'https://twitter.com/darbartech',
      'https://linkedin.com/company/darbartech',
      'https://github.com/darbartech'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: d.phone || '',
      contactType: 'customer service',
      email: d.email || ''
    }
  };

  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
      <head suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <Providers>
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  );
}
