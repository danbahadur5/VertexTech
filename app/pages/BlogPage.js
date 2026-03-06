import React from 'react';
import { Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, Star, Search } from 'lucide-react';
import { mockBlogPosts } from '../lib/mock-data';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useScrollReveal } from '../lib/use-scroll-reveal';

const categories = ['All', 'Cloud Technology', 'Security', 'Development', 'AI & ML', 'Best Practices'];

export default function BlogPage() {
  useScrollReveal();
  const featuredPost = mockBlogPosts[0];
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <section className="relative py-24 overflow-hidden theme-bg-light hero-grid-bg">
        <div className="blob blob-primary w-80 h-80 top-[-100px] right-[-80px]" />
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <Badge className="mb-5 theme-badge text-sm px-4 py-1 font-semibold animate-fade-in">Insights & Updates</Badge>
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 animate-fade-in-up delay-100">
            Security <span className="theme-gradient-text">Intelligence</span>
          </h1>
          <div className="mt-8 max-w-md mx-auto animate-fade-in delay-300">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input type="text" placeholder="Search articles..." className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 text-gray-600 bg-white shadow-sm text-sm focus:outline-none focus:ring-1 transition-shadow" />
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Card className="overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group">
            <div className="grid lg:grid-cols-2">
              <div className="aspect-video lg:aspect-auto overflow-hidden">
                <ImageWithFallback src={featuredPost.featuredImage} alt={featuredPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="flex flex-col justify-center p-10">
                <div className="flex items-center gap-3 mb-4">
                  <Badge className="theme-badge">{featuredPost.category}</Badge>
                  <span className="text-sm text-gray-400">{new Date(featuredPost.publishedAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4 leading-tight">{featuredPost.title}</h2>
                <p className="text-gray-600 mb-6 leading-relaxed">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={featuredPost.author.avatar} alt={featuredPost.author.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100" />
                    <div>
                      <div className="text-sm font-semibold text-gray-900">{featuredPost.author.name}</div>
                      <div className="text-xs text-gray-400">Author</div>
                    </div>
                  </div>
                  <Link to={`/blog/${featuredPost.slug}`}>
                    <Button className="theme-btn rounded-xl font-semibold">Read Article <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockBlogPosts.map((post, idx) => (
              <Card key={post.id} className="reveal overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group border-0 shadow-md bg-white" style={{ transitionDelay: `${idx * 0.12}s` }}>
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="theme-badge text-xs">{post.category}</Badge>
                    <span className="text-xs text-gray-400">{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                  <CardTitle className="line-clamp-2 text-base leading-snug">{post.title}</CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={post.author.avatar} alt={post.author.name} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs text-gray-500">{post.author.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (<Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />))}
                    </div>
                  </div>
                  <Link to={`/blog/${post.slug}`}>
                    <Button variant="ghost" className="w-full mt-4 theme-text hover:bg-gray-50 text-sm font-semibold">Read More <ArrowRight className="ml-2 h-4 w-4" /></Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
