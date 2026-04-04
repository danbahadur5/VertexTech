"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";

export default function Hero_Trusted_Count({ initialData }) {
  const [items, setItems] = useState(initialData?.items || []);
  const [loading, setLoading] = useState(!initialData && items.length === 0);
  const [title, setTitle] = useState(initialData?.title || "");

  useEffect(() => {
    if (initialData) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings/hero-trusted-count", { cache: "no-store" });
        const json = await res.json();
        const d = json?.item?.data || {};
        if (Array.isArray(d.items) && d.items.length) setItems(d.items);
        if (d.title) setTitle(d.title);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [initialData]);

  return (
    <section className="py-15 theme-gradient">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {loading ? (
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-64 mx-auto bg-white/20" />
          </div>
        ) : title ? (
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-white/90">{title}</h3>
          </div>
        ) : null}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-12 w-24 mx-auto bg-white/20" />
                  <Skeleton className="h-4 w-32 mx-auto bg-white/20" />
                </div>
              ))
            : items.map((s, i) => (
                <div
                  key={`${s.label}-${i}`}
                  className="reveal"
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div className="text-5xl font-extrabold mb-2 text-white/90">
                    {s.num}
                    {s.suffix}
                  </div>
                  <div className="text-white/60 text-sm font-medium">{s.label}</div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
