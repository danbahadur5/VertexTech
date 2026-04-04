"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { ArrowLeft, Calendar, User, Clock, Share2, Facebook, Twitter, Linkedin } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';


export default function BlogPostPage({ initialData }) {
  const { slug } = useParams();
  const [post, setPost] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  useEffect(() => {
    if (initialData) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setPost(data.item);
        }
      } finally {
        setLoading(false);
      }
    };
    if (slug) load();
  }, [slug, initialData]);
  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicHeader />
        <section className="py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-8">
              <Skeleton className="h-6 w-28 mb-3 rounded-full" />
              <Skeleton className="h-10 w-2/3 mb-4" />
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-1/3" />
              </div>
            </div>
            <Skeleton className="h-56 w-full rounded-2xl mb-8" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </section>
        <PublicFooter />
      </div>
    );
  }
  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicHeader />
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold">Post Not Found</h1>
          <Link href="/blog"><Button className="mt-6">Back to Blog</Button></Link>
        </div>
        <PublicFooter />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader />
      <article className="py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6 theme-text hover:bg-gray-50 dark:hover:bg-gray-800 -ml-4 font-semibold">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
            </Button>
          </Link>
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">{post.title}</h1>
            <div className="flex items-center gap-6 text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <img src={post?.author?.avatar} alt={post?.author?.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900 dark:text-gray-100">{post?.author?.name}</div>
                  <div className="text-sm">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : ''}</div>
                </div>
              </div>
            </div>
          </div>
          {post.featuredImage && (
            <div className="aspect-video overflow-hidden rounded-2xl mb-12 relative">
              <ImageWithFallback 
                src={post.featuredImage} 
                alt={post.title} 
                fill
                className="object-cover" 
              />
            </div>
          )}
          <div className="prose prose-lg prose-gray max-w-none text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</div>
          {!!(post.tags || []).length && (
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (<Badge key={tag} variant="outline">{tag}</Badge>))}
              </div>
            </div>
          )}
        </div>
      </article>
      <PublicFooter />
    </div>
  );
}
