import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { connectDB } from "./lib/db";
import { SiteSetting } from "./models";

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

import { cache } from "react";

const getSystemSettings = cache(async () => {
  await connectDB();
  const res = await SiteSetting.findOne({ key: "system" }).lean();
  return res?.data || {};
});

export async function generateMetadata() {
  const d = await getSystemSettings();
  
  return {
    title: d.metaTitle || d.siteName || "DarbarTech | AI-Powered Cybersecurity & Solutions",
    description: d.metaDescription || "Next-generation digital defense and software development.",
    keywords: d.keywords || "cybersecurity, ai, software development",
    openGraph: {
      images: [d.ogImage || "/og-image.png"],
    },
    alternates: {
      canonical: './',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
