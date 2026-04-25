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
import { Spinner } from '../components/ui/spinner';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { motion } from 'framer-motion';


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
        <section className="py-24">
          <div className="flex justify-center items-center">
            <Spinner />
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
      
      {/* Redesigned Hero Section for Project Detail */}
      <section className="relative py-24 overflow-hidden theme-bg-light hero-grid-bg">
        <div className="blob blob-primary w-80 h-80 top-[-100px] left-[-80px]" />
        <div className="blob blob-secondary w-64 h-64 bottom-[-60px] right-[-60px]" />
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
              <Badge className="theme-badge px-4 py-1">{project.client}</Badge>
              {project.featured && <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 px-4 py-1 border-0">Featured</Badge>}
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 dark:text-gray-200 mb-6 tracking-tight leading-tight animate-fade-in-up delay-100">
              {project.title}
            </h1>
            
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium animate-fade-in-up delay-200">
              {project.description}
            </p>

            {project.liveUrl && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                  <Button className="theme-btn h-12 px-8 rounded-xl font-bold text-lg shadow-lg shadow-blue-500/20">
                    Visit Live Project <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>
                </a>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <section className="py-16 bg-white dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link href="/caseStudy">
            <Button variant="ghost" className="mb-12 group text-gray-500 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Case Studies
            </Button>
          </Link>

          <div className="grid lg:grid-cols-3 gap-12">
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
                <Card className="theme-bg-light border-blue-200 dark:border-gray-700">
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
              <Card className="theme-bg text-white">
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
