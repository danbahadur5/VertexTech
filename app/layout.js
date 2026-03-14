import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { connectDB } from "./lib/db";
import { SiteSetting } from "./models";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  await connectDB();
  const res = await SiteSetting.findOne({ key: "system" }).lean();
  const d = res?.data || {};
  
  return {
    title: d.metaTitle || d.siteName || "VertexTech | AI-Powered Cybersecurity & Solutions",
    description: d.metaDescription || "Next-generation digital defense and software development.",
    keywords: d.keywords || "cybersecurity, ai, software development",
    openGraph: {
      images: [d.ogImage || "/og-image.png"],
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
