 'use client'
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { ArrowRight, Star } from "lucide-react";

import Link from "next/link";

import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ContentLoader } from "../../components/ui/content-loader";

export default function FeaturedBlog() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/blog", { cache: "no-store" });
        if (!res.ok) return;
        const js = await res.json();
        const featured = Array.isArray(js.items) ? js.items.filter((x) => x.featured && x.status === "published") : [];
        setItems(featured.slice(0, 6));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!loading && items.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="text-center mb-8">
            <Badge className="mb-4 theme-badge">Insights</Badge>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Explore Our Blog</h2>
            <p className="text-lg text-gray-600">Insights, trends, and best practices.</p>
          </div>
          <Button size="lg" variant="outline" className="theme-btn-outline rounded-xl px-8 h-12 font-bold" asChild>
            <Link href="/blog">View All Articles <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {loading && <ContentLoader variant="card" count={6} columns={3} aspect="video" className="mb-10" />}
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Insights</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trends, best practices, and expert insights in enterprise
            technology.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {(loading ? [] : items).map((post, idx) => (
            <Card
              key={post.slug || post.id || idx}
              className="reveal overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-md"
              style={{ transitionDelay: `${idx * 0.12}s` }}
            >
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className="theme-badge">{post.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}
                  </span>
                </div>
                <CardTitle className="line-clamp-2 text-base">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {post.excerpt ? (post.excerpt.length > 100 ? post.excerpt.slice(0, 100) + '…' : post.excerpt) : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <img
                      src={post.author?.avatar}
                      alt={post.author?.name}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                    <span className="text-xs text-muted-foreground">
                      {post.author?.name}
                    </span>
                  </div>
                  <Link href={`/blog/${post.slug}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="theme-text text-xs"
                    >
                      Read More <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="text-center mt-12 reveal">
          <Button
            size="lg"
            variant="outline"
            className="theme-btn-outline rounded-xl px-8 h-12 font-bold"
            asChild
          >
            <Link href="/blog">
              View All Articles <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
