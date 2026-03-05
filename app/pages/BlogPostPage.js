import React from 'react';
import { useParams, Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { mockBlogPosts } from '../lib/mock-data';

export default function BlogPostPage() {
  const { slug } = useParams();
  const post = mockBlogPosts.find((p) => p.slug === slug);
  if (!post) {
    return (
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold">Post Not Found</h1>
          <Link to="/blog"><Button className="mt-6">Back to Blog</Button></Link>
        </div>
        <PublicFooter />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <article className="py-12">
        <div className="mx-auto max-w-4xl px-6 lg:px-8">
          <Link to="/blog"><Button variant="ghost" className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Blog</Button></Link>
          <div className="mb-8">
            <Badge className="mb-4">{post.category}</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{post.title}</h1>
            <div className="flex items-center gap-6 text-gray-600">
              <div className="flex items-center gap-2">
                <img src={post.author.avatar} alt={post.author.name} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="font-semibold text-gray-900">{post.author.name}</div>
                  <div className="text-sm">{new Date(post.publishedAt).toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="aspect-video overflow-hidden rounded-2xl mb-12">
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
          </div>
          <div className="prose prose-lg prose-gray max-w-none">
            <p className="lead text-xl text-gray-600">{post.excerpt}</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <h2>Introduction</h2>
            <p>This is a comprehensive guide covering all aspects of {post.title.toLowerCase()}.</p>
            <h2>Conclusion</h2>
            <p>Stay informed and keep the end user in mind.</p>
          </div>
          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (<Badge key={tag} variant="outline">{tag}</Badge>))}
            </div>
          </div>
        </div>
      </article>
      <PublicFooter />
    </div>
  );
}
