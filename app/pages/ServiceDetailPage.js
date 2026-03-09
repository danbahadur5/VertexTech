import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router';
import { PublicHeader } from '../components/layout/PublicHeader';
import { PublicFooter } from '../components/layout/PublicFooter';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '../components/ui/skeleton';


export default function ServiceDetailPage() {
  const { slug } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/services/${slug}`, { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setService(data.item);
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
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-40 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </section>
        <PublicFooter />
      </div>
    );
  }
  if (!service) {
    return (
      <div className="min-h-screen bg-white">
        <PublicHeader />
        <div className="mx-auto max-w-7xl px-6 py-24 text-center">
          <h1 className="text-4xl font-bold">Service Not Found</h1>
          <Link to="/services"><Button className="mt-6">Back to Services</Button></Link>
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
          <Link to="/services">
            <Button variant="ghost" className="mb-6"><ArrowLeft className="h-4 w-4 mr-2" />Back to Services</Button>
          </Link>
          <div className="mb-12">
            <Badge className="mb-4">Service Details</Badge>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">{service.title}</h1>
            <p className="text-xl text-gray-600 max-w-3xl">{service.description}</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                  <ul className="space-y-4">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div className="bg-green-100 p-1 rounded-full mt-0.5">
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
            <div className="space-y-6">
              {service.pricing && (
                <Card className="sticky top-24">
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Pricing Plans</h3>
                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="font-semibold">Basic</span>
                          <div><span className="text-2xl font-bold">${service.pricing.basic.toLocaleString()}</span><span className="text-gray-600 text-sm">/mo</span></div>
                        </div>
                        <p className="text-sm text-gray-600">For small teams</p>
                      </div>
                      <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
                        <Badge className="mb-2">Most Popular</Badge>
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="font-semibold">Professional</span>
                          <div><span className="text-2xl font-bold">${service.pricing.professional.toLocaleString()}</span><span className="text-gray-600 text-sm">/mo</span></div>
                        </div>
                        <p className="text-sm text-gray-600">For growing businesses</p>
                      </div>
                      <div className="border rounded-lg p-4">
                        <div className="flex items-baseline justify-between mb-2">
                          <span className="font-semibold">Enterprise</span>
                          <div><span className="text-2xl font-bold">${service.pricing.enterprise.toLocaleString()}</span><span className="text-gray-600 text-sm">/mo</span></div>
                        </div>
                        <p className="text-sm text-gray-600">For large orgs</p>
                      </div>
                    </div>
                    <Button className="w-full mt-6" size="lg" asChild><Link to="/contact">Get Started</Link></Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>
      <PublicFooter />
    </div>
  );
}
