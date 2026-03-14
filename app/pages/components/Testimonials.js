import { useEffect, useState } from "react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Quote } from "lucide-react";
import { useScrollReveal } from "../../lib/use-scroll-reveal";
import { Skeleton } from "../../components/ui/skeleton";

export default function Testimonials() {
  useScrollReveal();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings/trusted-security-leader", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const d = json?.item?.data || {};
        setTitle(d.title || "Trusted by Security Leaders");
        setSubtitle(d.subtitle || "See why CISOs and security teams across industries choose us.");
        if (Array.isArray(d.items) && d.items.length) setItems(d.items);
      } catch {
        setTitle("Trusted by Security Leaders");
        setSubtitle("See why CISOs and security teams across industries choose us.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="text-center mb-16 reveal">
          <Badge className="mb-4 theme-badge">Testimonials</Badge>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-10 w-96 mx-auto mb-4" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
            </div>
          ) : (
            <>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {title}
              </h2>
              <p className="text-lg text-muted-foreground dark:text-gray-400 max-w-2xl mx-auto">
                {subtitle}
              </p>
            </>
          )}
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {loading
            ? [...Array(3)].map((_, i) => (
                <Card key={i} className="p-8 space-y-4">
                  <Skeleton className="h-8 w-8 rounded-full mb-4" />
                  <Skeleton className="h-20 w-full" />
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-32" />
                    </div>
                  </div>
                </Card>
              ))
            : items.map((t, idx) => (
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
                        <div className="font-bold text-gray-900 dark:text-gray-100">{t.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{t.role} @ {t.company}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}
