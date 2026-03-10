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

export default function FeaturedProject() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/case-studies", { cache: "no-store" });
        if (!res.ok) return;
        const js = await res.json();
        const featured = Array.isArray(js.items) ? js.items.filter((x) => x.featured) : [];
        setItems(featured.slice(0, 6));
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (!loading && items.length === 0) {
    return (
      <section className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <div className="text-center mb-8">
            <Badge className="mb-4 theme-badge">Case Studies</Badge>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Explore Our Projects</h2>
            <p className="text-lg text-muted-foreground dark:text-gray-400">See how we deliver results across industries.</p>
          </div>
          <Button size="lg" variant="outline" className="theme-btn-outline rounded-xl px-8 h-12 font-bold" asChild>
            <Link href="/caseStudy">View All Projects <ArrowRight className="ml-2 h-4 w-4" /></Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {loading && <ContentLoader variant="card" count={6} columns={3} aspect="video" className="mb-10" />}
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Case Studies</Badge>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            Success stories from our portfolio of enterprise solutions
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(loading ? [] : items).map((project, idx) => (
            <Card
              key={project.slug || project.id || idx}
              className="reveal overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-md bg-white dark:bg-gray-900"
              style={{ transitionDelay: `${idx * 0.12}s` }}
            >
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={project.gallery?.[0]}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge className="theme-badge">{project.client}</Badge>
                  {project.featured && (
                    <Badge className="bg-amber-100 text-amber-800">
                      <Star className="h-3 w-3 mr-1" fill="currentColor" />{" "}
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription className="text-sm">
                  {project.description ? (project.description.length > 100 ? project.description.slice(0, 100) + '…' : project.description) : ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.technologies || []).slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs text-gray-500">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Link href={`/caseStudy/${project.slug}`}>
                  <Button
                    variant="ghost"
                    className="w-full theme-text hover:bg-gray-50 cursor-pointer"
                  >
                    View Case Study <ArrowRight className="ml-2 h-4 w-4" />
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
              View All Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
