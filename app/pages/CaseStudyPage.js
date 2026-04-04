"use client";

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight, ExternalLink, Filter, Star, CheckCircle2 } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ContentLoader } from '../components/ui/content-loader';
import { useScrollReveal } from '../lib/use-scroll-reveal';
import { motion, AnimatePresence } from 'framer-motion';

export default function CaseStudyPage({ initialData }) {
  useScrollReveal();
  const [items, setItems] = useState(initialData || []);
  const [loading, setLoading] = useState(!initialData);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    if (initialData) return;
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
  }, [initialData]);

  const categories = useMemo(() => {
    const tech = new Set(['All']);
    items.forEach(item => {
      item.technologies?.forEach(t => tech.add(t));
    });
    return Array.from(tech).slice(0, 10);
  }, [items]);

  const filteredItems = useMemo(() => {
    if (activeFilter === 'All') return items;
    return items.filter(item => item.technologies?.includes(activeFilter));
  }, [items, activeFilter]);

  const featuredProject = useMemo(() => items.find(i => i.featured), [items]);

  return (
    <div className="min-h-screen bg-white dark:bg-[#020617] transition-colors duration-500">
      <PublicHeader />
      
      {/* Hero Section - Professional & Trust-focused */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.08),transparent_50%)]" />
          <div className="absolute inset-0 bg-[url('/assets/grid.svg')] bg-[size:32px_32px] opacity-[0.03] dark:opacity-[0.05]" />
        </div>
        
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 mb-6">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-400">Success Stories</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
              Engineering Excellence, <br />
              <span className="theme-gradient-text italic">Delivering Impact.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed font-medium">
              Discover how we've partnered with forward-thinking organizations to build scalable digital ecosystems and drive measurable growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter & Main Grid Section */}
      <section className="py-24 bg-gray-50/50 dark:bg-[#020617] relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-16 gap-8">
            <div className="reveal">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">Recent Implementations</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">Explore our latest work across different technologies.</p>
            </div>
            
            {/* Premium Filter System */}
            <div className="flex flex-wrap items-center gap-2 p-1.5 bg-gray-100/50 dark:bg-gray-800/30 backdrop-blur-sm rounded-[2rem] border border-gray-200/50 dark:border-gray-700/50">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-500 relative ${
                    activeFilter === cat 
                      ? 'text-white shadow-lg' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {activeFilter === cat && (
                    <motion.div
                      layoutId="activeFilter"
                      className="absolute inset-0 theme-gradient rounded-full"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{cat}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <ContentLoader variant="card" count={6} columns={3} aspect="video" className="mb-10" />
          ) : filteredItems.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="text-center py-32 bg-white dark:bg-gray-900/50 rounded-[3rem] border border-dashed border-gray-200 dark:border-gray-800"
            >
              <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
                <Filter className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">No projects found</h3>
              <p className="text-gray-500 mt-2">Try selecting a different category or clear the filter.</p>
              <Button 
                variant="link" 
                onClick={() => setActiveFilter('All')}
                className="mt-4 theme-text font-bold"
              >
                Clear all filters
              </Button>
            </motion.div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              <AnimatePresence mode="popLayout">
                {filteredItems.map((project, idx) => (
                  <motion.div
                    layout
                    key={project._id || project.id || project.slug}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                  >
                    <Card className="group h-full flex flex-col overflow-hidden border-0 bg-white dark:bg-[#0f172a] rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] dark:shadow-[0_15px_40px_rgba(0,0,0,0.2)] hover:shadow-[0_30px_60px_-15px_rgba(59,130,246,0.15)] transition-all duration-700 hover:-translate-y-2 ring-1 ring-gray-100 dark:ring-gray-800/50">
                      <div className="aspect-video overflow-hidden relative">
                        <ImageWithFallback 
                          src={project.gallery?.[0]} 
                          alt={project.title} 
                          fill 
                          className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                        {/* Elegant Hover Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-6">
                           <motion.div 
                             className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
                           >
                             {project.liveUrl && (
                               <a 
                                 href={project.liveUrl} 
                                 target="_blank" 
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl text-white text-[10px] font-black uppercase tracking-widest hover:bg-white/20 transition-colors mb-2"
                                 onClick={(e) => e.stopPropagation()}
                               >
                                 Live Preview <ExternalLink className="w-3.5 h-3.5" />
                               </a>
                             )}
                           </motion.div>
                        </div>
                        
                        {/* Top Floating Client Badge */}
                        <div className="absolute top-5 left-5">
                          <div className="px-3 py-1.5 bg-white/90 dark:bg-black/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 dark:border-gray-800">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">
                              {project.client}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <CardHeader className="pt-6 px-6 pb-2">
                        <CardTitle className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:theme-text transition-colors duration-500 line-clamp-1 leading-tight">
                          {project.title}
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="px-6 flex-grow">
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed font-medium">
                          {project.description}
                        </p>
                        <div className="flex flex-wrap gap-1.5 mt-auto">
                          {(project.technologies || []).slice(0, 3).map((tech) => (
                            <span key={tech} className="text-[9px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-gray-800/50 px-2 py-1 rounded-lg border border-gray-100 dark:border-gray-700/50">
                              {tech}
                            </span>
                          ))}
                          {project.technologies?.length > 3 && (
                            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-600 px-1">+ {project.technologies.length - 3}</span>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="p-6 pt-0 mt-2">
                        <Link href={`/caseStudy/${project.slug}`} className="w-full">      
                          <Button variant="ghost" className="w-full h-11 bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-600 dark:hover:bg-blue-600 rounded-2xl flex justify-between items-center px-6 transition-all duration-500 group/btn border-0">
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300 group-hover/btn:text-white transition-colors">Case Insight</span>
                            <ArrowRight className="w-4 h-4 text-blue-600 dark:text-blue-400 group-hover/btn:text-white group-hover/btn:translate-x-1.5 transition-all" />
                          </Button>
                        </Link>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
