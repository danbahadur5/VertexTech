"use client";

/**
 * FeaturedBlog Component
 * 
 * We use this to surface the latest insights. I've tweaked the layout to be 
 * a bit more 'editorial' than the project grid. 
 * 
 * Future improvement: Maybe add a 'featured' large card on the left and 
 * two smaller ones on the right? For now, the 3-column grid is clean.
 */

import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowRight, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";

import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ContentLoader } from "../../components/ui/content-loader";

export default function FeaturedBlog({ initialData }) {
  const [blogPosts, setBlogPosts] = useState(initialData || []);
  const [isRefreshing, setIsRefreshing] = useState(!initialData);

  useEffect(() => {
    // Only fetch if we didn't get data from the server-side props.
    if (initialData) return;

    const fetchLatestArticles = async () => {
      try {
        const res = await fetch("/api/blog", { 
          cache: "force-cache", 
          next: { revalidate: 3600 } 
        });
        
        if (!res.ok) return;
        
        const data = await res.json();
        
        // We only want published stuff that's marked as featured.
        const activeFeatured = Array.isArray(data.items) 
          ? data.items.filter((post) => post.featured && post.status === "published") 
          : [];
          
        setBlogPosts(activeFeatured.slice(0, 3)); // 3 is the magic number for this layout.
      } catch (error) {
        console.warn("Could not load blog posts for the home section:", error);
      } finally {
        setIsRefreshing(false);
      }
    };

    fetchLatestArticles();
  }, [initialData]);

  // If we're out of posts, we hide the section or show a placeholder.
  if (!isRefreshing && blogPosts.length === 0) {
    return (
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Badge className="mb-4 theme-badge">Insights</Badge>
          <h2 className="text-3xl font-bold mb-4">The Darbar Journal</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-8">We're currently writing some fresh perspectives. Stay tuned!</p>
          <Button variant="outline" className="theme-btn-outline" asChild>
            <Link href="/blog">Visit the Blog Archive</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Skeleton state for a smoother loading experience */}
        {isRefreshing && <ContentLoader variant="card" count={3} columns={3} aspect="video" className="mb-10" />}
        
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Latest Insights</Badge>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            The Tech Pulse
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Thoughts on enterprise architecture, digital transformation, and the future of engineering.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {(isRefreshing ? [] : blogPosts).map((article, idx) => (
            <Card
              key={article.slug || article.id || idx}
              className="reveal overflow-hidden group border-0 bg-transparent"
              style={{ transitionDelay: `${idx * 0.1}s` }}
            >
              <div className="aspect-[16/10] overflow-hidden relative rounded-2xl mb-6 shadow-sm group-hover:shadow-md transition-shadow">
                <ImageWithFallback
                  src={article.featuredImage}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-white/90 dark:bg-gray-900/90 backdrop-blur text-xs font-bold uppercase tracking-tight">
                    {article.category}
                  </Badge>
                </div>
              </div>

              <div className="px-1">
                <div className="flex items-center gap-4 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    5 min read
                  </span>
                </div>

                <CardTitle className="text-xl font-bold mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
                  <Link href={`/blog/${article.slug}`}>
                    {article.title}
                  </Link>
                </CardTitle>
                
                <CardDescription className="text-gray-600 dark:text-gray-400 line-clamp-2 mb-6 text-sm">
                  {article.excerpt}
                </CardDescription>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <User className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Darbar Editorial</span>
                  </div>
                  
                  <Link href={`/blog/${article.slug}`} className="text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center group/link">
                    Read More 
                    <ArrowRight className="ml-1 h-3 w-3 group-hover/link:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="ghost" className="text-blue-600 font-bold hover:bg-blue-50" asChild>
            <Link href="/blog">
              Explore the full archive <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
