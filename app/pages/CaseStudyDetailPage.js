import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, Quote } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

export default function CaseStudyDetailPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
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
  }, [slug]);
  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold">Loading…</h1>
        </div>
        <PublicFooter />
      </div>
    );
  }
  if (!project) {
    return (      
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold">Project Not Found</h1>
          <Link to="/caseStudy"><Button className="mt-6">Back to Case Study</Button></Link>
        </div>
        <PublicFooter />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Link to="/caseStudy"><Button variant="ghost" className="mb-6 text-gray-400"><ArrowLeft className="h-4 w-4 mr-2" />Back to Case Study</Button></Link>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="secondary">{project.client}</Badge>
              {project.featured && <Badge className="bg-yellow-100 text-yellow-800">Featured</Badge>}
            </div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{project.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl">{project.description}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {(project.gallery || []).map((image, index) => (
                <div key={index} className="aspect-video overflow-hidden rounded-2xl">
                  <ImageWithFallback src={image} alt={`${project.title} - ${index + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
              {project.testimonial && (
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
                  <CardContent className="pt-6">
                    <Quote className="h-8 w-8 text-blue-200 mb-4" />
                    <p className="text-lg text-gray-700 italic mb-6">"{project.testimonial.quote}"</p>
                    <div>
                      <p className="font-semibold text-gray-900">{project.testimonial.author}</p>
                      <p className="text-sm text-gray-600">{project.testimonial.position}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-gray-900 mb-4">Technologies Used</h3>
                  <div className="flex flex-wrap gap-2">{(project.technologies || []).map((tech) => (<Badge key={tech} variant="secondary">{tech}</Badge>))}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-gray-900 mb-2">Client</h3>
                  <p className="text-gray-600">{project.client}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-bold text-gray-900 mb-2">Completed</h3>
                  <p className="text-gray-600">{project.completedAt ? new Date(project.completedAt).toLocaleDateString() : ''}</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                <CardContent className="pt-6">
                  <h3 className="font-bold mb-4">Interested in Similar Work?</h3>
                  <Button variant="secondary" className="w-full" asChild><Link to="/contact">Start Your Project</Link></Button>
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
