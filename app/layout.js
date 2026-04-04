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
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

import { cache } from "react";

const getSystemSettings = cache(async () => {
  await connectDB();
  const res = await SiteSetting.findOne({ key: "system" }).lean();
  return res?.data || {};
});

export async function generateMetadata() {
  const d = await getSystemSettings();
  const siteUrl = process.env.NEXTAUTH_URL || 'https://darbartech.vercel.app';
  
  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: d.metaTitle || d.siteName || "DarbarTech | AI-Powered Cybersecurity & Solutions",
      template: `%s | ${d.siteName || 'DarbarTech'}`
    },
    description: d.metaDescription || "Next-generation digital defense and software development.",
    keywords: d.keywords || "cybersecurity, ai, software development",
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: siteUrl,
      siteName: d.siteName || 'DarbarTech',
      title: d.metaTitle || d.siteName || "DarbarTech | AI-Powered Cybersecurity & Solutions",
      description: d.metaDescription || "Next-generation digital defense and software development.",
      images: [
        {
          url: d.ogImage || "/og-image.png",
          width: 1200,
          height: 630,
          alt: d.siteName || 'DarbarTech',
        }
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: d.metaTitle || d.siteName || "DarbarTech | AI-Powered Cybersecurity & Solutions",
      description: d.metaDescription || "Next-generation digital defense and software development.",
      images: [d.ogImage || "/og-image.png"],
    },
    alternates: {
      canonical: '/',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${geistSans.variable} ${geistMono.variable} ${inter.variable}`}>
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
