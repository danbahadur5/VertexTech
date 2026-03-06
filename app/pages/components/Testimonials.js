import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Star, Quote } from "lucide-react";
import { useScrollReveal } from "../../lib/use-scroll-reveal";
export default function Testimonials() {
  useScrollReveal();
  const testimonials = [
    {
      quote:
        "VertexTech transformed our entire infrastructure. Their expertise and dedication were outstanding.",
      author: "John Smith",
      position: "CTO, Global Financial Corp",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      rating: 5,
    },
    {
      quote:
        "The best technology partner we've ever worked with. They delivered beyond our expectations.",
      author: "Emily Roberts",
      position: "CEO, MediCare Solutions",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      rating: 5,
    },
    {
      quote:
        "Professional, innovative, and results-driven. VertexTech is our go-to for all tech solutions.",
      author: "Michael Chen",
      position: "Director of IT, RetailPro",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      rating: 5,
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Testimonials</Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Security Leaders
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            See why CISOs and security teams across industries choose us.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <Card
              key={idx}
              className="reveal hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
              style={{ transitionDelay: `${idx * 0.15}s` }}
            >
              <div
                className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-5"
                style={{
                  background: "var(--theme-primary)",
                  transform: "translate(30%,-30%)",
                }}
              />
              <CardContent className="pt-8">
                <Quote
                  className="h-8 w-8 mb-4 opacity-30"
                  style={{ color: "var(--theme-primary)" }}
                />
                <p className="text-gray-700 mb-6 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.author}
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                  />
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {t.author}
                    </div>
                    <div className="text-xs text-gray-500">{t.position}</div>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-4 w-4 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
