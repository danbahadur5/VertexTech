"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, ExternalLink, CheckCircle2, Target, TrendingUp, Shield, Quote } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';


export default function CaseStudyDetailPage({ initialData }) {
  const { slug } = useParams();
  const [project, setProject] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  useEffect(() => {
    if (initialData) return;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/case-studies/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setProject(data.item);
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
              <Skeleton className="h-4 w-1/2 mb-2" />
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <Skeleton className="h-56 w-full rounded-xl" />
                <Skeleton className="h-56 w-full rounded-xl" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-36 w-full rounded-xl" />
                <Skeleton className="h-20 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </section>
        <PublicFooter />
      </div>
    );
  }
  if (!project) {
    return (      
      <div className="min-h-screen bg-white dark:bg-gray-950">
        <PublicHeader />
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold">Project Not Found</h1>
          <Link href="/caseStudy"><Button className="mt-6">Back to Case Study</Button></Link>
        </div>
        <PublicFooter />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <PublicHeader />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/caseStudy"><Button variant="ghost" className="mb-6 text-gray-400 dark:text-gray-500"><ArrowLeft className="h-4 w-4 mr-2" />Back to Case Study</Button></Link>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{project.client}</Badge>
              {project.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">{project.title}</h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl">{project.description}</p>
            {project.liveUrl && (
              <div className="mt-6">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white">Visit Live</Button>
                </a>
              </div>
            )}
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {(project.gallery || []).map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-2xl relative">
                  <ImageWithFallback 
                    src={image} 
                    alt={`${project.title} - ${index + 1}`} 
                    fill
                    className="object-cover" 
                  />
                </div>
              ))}
              {project.testimonial && (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 border-blue-200 dark:border-gray-700">
                  <CardContent className="pt-6">
                    <Quote className="h-8 w-8 text-blue-200 mb-4" />
                    <p className="text-lg text-gray-700 dark:text-gray-300 italic mb-6">"{project.testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">{project.testimonial.author}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{project.testimonial.position}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">{(project.technologies || []).map((tech) => (<Badge key={tech} variant="secondary">{tech}</Badge>))}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Client</h3>
                  <p className="text-gray-600 dark:text-gray-400">{project.client}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Completed</h3>
                  <p className="text-gray-600 dark:text-gray-400">{project.completedAt ? new Date(project.completedAt).toLocaleDateString() : ''}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-4">Interested in Similar Work?</h3>
                  <Button variant="secondary" className="w-full" asChild><Link href="/contact">Start Your Project</Link></Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
