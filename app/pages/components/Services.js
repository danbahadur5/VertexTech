import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import {
  ArrowRight,
  Cloud,
  Shield,
  Code,
  BarChart3,
  Star,
  Quote,
  MapPin,
  Phone,
  Mail,
  Clock,
  Zap,
  Lock,
  Globe,
  Activity,
} from "lucide-react";

import Link from "next/link";
import { ContentLoader } from "../../components/ui/content-loader";

import { useEffect, useState } from "react";
export default function Services() {
  const serviceIcons = { Cloud, Shield, Code, BarChart3 };
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/services", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        setItems(data.items || []);
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, []);
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {loading && <ContentLoader variant="card" count={8} columns={4} aspect="auto" className="mb-10" />}
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Our Solutions</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Enterprise Solutions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From endpoint to cloud, protect and scale every layer of your
            digital infrastructure.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((service, idx) => {
            const Icon = serviceIcons[service.icon] || Code;
            return (
              <Card
                key={service._id || service.id || service.slug}
                className="reveal group hover:shadow-2xl transition-all duration-300 border hover:-translate-y-2 cursor-pointer"
                style={{ transitionDelay: `${idx * 0.12}s` }}
              >
                <CardHeader>
                  <div className="w-14 h-14 rounded-xl theme-gradient flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <CardTitle className="text-lg">{service.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/services/${service.slug}`}>
                    <Button
                      variant="ghost"
                      className="w-full theme-text hover:bg-gray-50 font-semibold"
                    >
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
