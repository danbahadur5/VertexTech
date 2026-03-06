import React from 'react';
import { Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { mockCaseStudy } from '../lib/mock-data';

export default function CaseStudyPage() {
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <section className="py-24 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4">Our Work</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Success Stories & Projects</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Explore our Case Study of successful projects.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCaseStudy.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="aspect-video overflow-hidden">
                  <img src={project.gallery[0]} alt={project.title} className="w-full h-full object-cover hover:scale-110 transition-transform duration-300" />
                </div>
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary">{project.client}</Badge>
                    {project.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
                  </div>
                  <CardTitle>{project.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{project.description}</p>
                  <div className="flex flex-wrap  gap-2 mb-4">
                    {project.technologies.slice(0, 4).map((tech) => (<Badge key={tech} variant="outline" className="text-xs text-gray-500 text-bold">{tech}</Badge>))}
                  </div>
                  <Link to={`/caseStudy/${project.slug}`}>      
                    <Button variant="ghost" className="w-full cursor-pointer">
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
