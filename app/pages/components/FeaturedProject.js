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

import { mockCaseStudy } from "../../lib/mock-data";

export default function FeaturedProject() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Case Studies</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Featured Projects
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Success stories from our portfolio of enterprise solutions
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockCaseStudy.map((project, idx) => (
            <Card
              key={project.id}
              className="reveal overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group border-0 shadow-md"
              style={{ transitionDelay: `${idx * 0.12}s` }}
            >
              <div className="aspect-video overflow-hidden">
                <ImageWithFallback
                  src={project.gallery[0]}
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
                  {project.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech) => (
                    <Badge key={tech} variant="outline" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
                <Link href={`/caseStudy/${project.slug}`}>
                  <Button
                    variant="ghost"
                    className="w-full theme-text hover:bg-gray-50"
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
