import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ContentLoader } from '../components/ui/content-loader';

export default function CaseStudyPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/case-studies', { cache: 'no-store' });
        if (!res.ok) return;
        const js = await res.json();
        setItems(Array.isArray(js.items) ? js.items : []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader />
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {loading && <ContentLoader variant="card" count={6} columns={3} aspect="video" className="mb-10" />}
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Work</Badge>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">Success Stories & Projects</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">Explore our Case Study of successful projects.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(loading ? [] : items).map((project) => (
              <Card key={project.slug} className="overflow-hidden hover:shadow-2xl transition-shadow border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
                <div className="aspect-video overflow-hidden">
                  <ImageWithFallback src={project.gallery?.[0]} alt={project.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{project.client}</Badge>
                    {project.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                  </div>
                  <CardTitle className="dark:text-gray-100">{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    {project.description ? (project.description.length > 100 ? project.description.slice(0, 100) + '…' : project.description) : ''}
                  </p>
                  <div className="flex flex-wrap  gap-2 mb-4">
                    {(project.technologies || []).slice(0, 4).map((tech) => (<Badge key={tech} variant="outline" className="text-xs text-gray-500 dark:text-gray-400 text-bold">{tech}</Badge>))}
                  </div>
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full mb-2 bg-blue-600 hover:bg-blue-700 text-white">Visit Live</Button>
                    </a>
                  )}
                  <Link to={`/caseStudy/${project.slug}`}>      
                    <Button variant="ghost" className="w-full cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                      View Case Study <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
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
