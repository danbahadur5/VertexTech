import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Quote } from "lucide-react";
import { useScrollReveal } from "../../lib/use-scroll-reveal";
export default function Testimonials() {
  useScrollReveal();
  const [title, setTitle] = useState("Trusted by Security Leaders");
  const [subtitle, setSubtitle] = useState("See why CISOs and security teams across industries choose us.");
  const [items, setItems] = useState([
    {
      quote: "VertexTech transformed our entire infrastructure. Their expertise and dedication were outstanding.",
      name: "John Smith",
      role: "CTO",
      company: "Global Financial Corp",
      avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
      logoUrl: "",
      featured: true,
    },
    {
      quote: "The best technology partner we've ever worked with. They delivered beyond our expectations.",
      name: "Emily Roberts",
      role: "CEO",
      company: "MediCare Solutions",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
      logoUrl: "",
      featured: false,
    },
    {
      quote: "Professional, innovative, and results-driven. VertexTech is our go-to for all tech solutions.",
      name: "Michael Chen",
      role: "Director of IT",
      company: "RetailPro",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
      logoUrl: "",
      featured: false,
    },
  ]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/settings/trusted-security-leader", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const d = json?.item?.data || {};
        if (typeof d.title === "string" && d.title) setTitle(d.title);
        if (typeof d.subtitle === "string" && d.subtitle) setSubtitle(d.subtitle);
        if (Array.isArray(d.items) && d.items.length) setItems(d.items);
      } catch {
        // ignore fetch errors, use defaults
      }
    })();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Testimonials</Badge>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((t, idx) => (
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
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic leading-relaxed">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  {t.avatarUrl ? (
                    <img
                      src={t.avatarUrl}
                      alt={t.name || 'Leader'}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 ring-2 ring-gray-100 dark:ring-gray-700" />
                  )}
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-gray-100 text-sm">
                      {t.name || "Security Leader"}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {[t.role, t.company].filter(Boolean).join(" • ")}
                    </div>
                  </div>
                  {t.logoUrl && (
                    <div className="ml-auto">
                      <img src={t.logoUrl} alt="Company" className="h-6 w-auto object-contain opacity-70" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
