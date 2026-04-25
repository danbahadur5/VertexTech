"use client";

/**
 * FeaturedProject Component
 * 
 * This is the main showcase section on the homepage. I've designed it to pull
 * our most impactful case studies dynamically. 
 * 
 * Design Note: I went with a 3-column grid on desktop but dropped it to 1 on mobile
 * because the project cards need space to breathe. The 'reveal' classes handle
 * the scroll-trigger animations we set up in the global styles.
 */

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

// Using our custom Image wrapper to handle broken links gracefully.
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import { ContentLoader } from "../../components/ui/content-loader";

export default function FeaturedProject({ initialData }) {
  // We prioritize server-side data (initialData) to avoid layout shift,
  // but we'll fetch client-side if it's missing.
  const [projects, setProjects] = useState(initialData || []);
  const [isFetching, setIsFetching] = useState(!initialData);

  useEffect(() => {
    // If we already have data from the server, don't bother the API.
    if (initialData) return;

    async function loadFeaturedProjects() {
      try {
        const response = await fetch("/api/case-studies", { 
          cache: "force-cache", 
          next: { revalidate: 3600 } // Cache for an hour, seems reasonable for projects.
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.status}`);
        }

        const data = await response.json();
        
        // We only want the 'featured' ones for this section.
        // Limit to 6 so the page doesn't get too long.
        const featuredList = Array.isArray(data.items) 
          ? data.items.filter((item) => item.featured) 
          : [];
          
        setProjects(featuredList.slice(0, 6));
      } catch (err) {
        console.error("Project fetch error:", err);
      } finally {
        setIsFetching(false);
      }
    }

    loadFeaturedProjects();
  }, [initialData]);

  // Fallback UI for when we literally have nothing to show.
  // Better than an empty section.
  if (!isFetching && projects.length === 0) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="text-center mb-8">
            <Badge className="mb-4 theme-badge">Case Studies</Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Explore Our Work</h2>
            <p className="text-lg text-muted-foreground dark:text-gray-400">Our portfolio is currently being updated. Check back soon!</p>
          </div>
          <Button size="lg" variant="outline" className="theme-btn-outline rounded-xl px-8 h-12 font-bold" asChild>
            <Link href="/caseStudy">View Archive <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Loading state - using a skeleton loader for better UX */}
        {isFetching && <ContentLoader variant="card" count={6} columns={3} aspect="video" className="mb-10" />}
        
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Case Studies</Badge>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Engineering Success
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            A look at how we've helped enterprise partners solve complex technical hurdles.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(isFetching ? [] : projects).map((project, index) => (
            <Card
              key={project.slug || project.id || index}
              className="reveal overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-md bg-white dark:bg-gray-900"
              style={{ transitionDelay: `${index * 0.12}s` }}
            >
              <div className="aspect-video overflow-hidden relative">
                <ImageWithFallback
                  src={project.gallery?.[0]}
                  alt={`Cover image for ${project.title}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700" // Slower scale for a more 'premium' feel
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="theme-badge">{project.client}</Badge>
                  {project.featured && (
                    <Badge className="bg-amber-100 text-amber-800 border-none">
                      <Star className="h-3 w-3 mr-1" fill="currentColor" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-sm line-clamp-2">
                  {project.description}
                </CardDescription>
              </CardHeader>

              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {(project.technologies || []).slice(0, 3).map((tech) => (
                    <span key={tech} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <Link href={`/caseStudy/${project.slug}`}>
                  <Button
                    variant="ghost"
                    className="w-full theme-text hover:bg-blue-50 dark:hover:bg-blue-900/20 cursor-pointer justify-between group/btn"
                  >
                    Read the full story 
                    <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </Link>
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
            <Link href="/caseStudy">
              Browse all Case Studies <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
