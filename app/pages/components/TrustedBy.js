"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";

const TrustedBy = ({ initialData }) => {
  const [logos, setLogos] = useState(initialData?.logos || []);
  const [title, setTitle] = useState(initialData?.title || "");
  const [subtitle, setSubtitle] = useState(initialData?.subtitle || "");
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    if (initialData) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings/trusted-company", { cache: "no-store" });
        const json = await res.json();
        const d = json?.item?.data || {};
        const items = Array.isArray(d?.logos) ? d.logos : [];
        if (items.length) setLogos(items);
        if (d?.title) setTitle(d.title || "Trusted by Leading Companies");
        if (d?.subtitle) setSubtitle(d.subtitle || "Powering Businesses Around the World");
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, [initialData]);

  return (
    <section className="relative py-12 md:py-20 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-8 md:mb-12 px-6">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-4 w-32 md:w-48 mx-auto" />
            <Skeleton className="h-8 md:h-10 w-64 md:w-96 mx-auto" />
          </div>
        ) : (
          <>
            <p className="text-xs md:text-sm uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 mb-2 md:mb-3 font-medium">{title || "TRUSTED BY"}</p>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 leading-tight max-w-3xl mx-auto">{subtitle}</h2>
          </>
        )}
      </div>

      {/* Animation */}
      <style>{`
        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }

        @keyframes marqueeScroll {
          0% {
            transform: translateX(0%);
          }

          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      {/* Logo Marquee */}
      <div className="overflow-hidden w-full relative select-none">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 h-full w-12 md:w-32 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-gray-950 to-transparent" />

        {/* Logos */}
        <div
          className="marquee-inner flex min-w-[200%] items-center"
          style={{ animationDuration: "25s" }}
        >
          {loading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="mx-6 md:mx-10 p-2 md:p-4">
                <Skeleton className="h-6 md:h-8 w-24 md:w-32" />
              </div>
            ))
          ) : (
            [...logos, ...logos].map((url, index) => (
              <div
                key={index}
                className="mx-6 md:mx-10 flex items-center justify-center p-2 md:p-4 transition duration-500 hover:scale-110"
              >
                <img
                  src={url}
                  alt={`logo-${index}`}
                  className="h-7 md:h-10 w-auto opacity-60 dark:opacity-40 hover:opacity-100 dark:hover:opacity-100 transition duration-300 grayscale hover:grayscale-0"
                  draggable={false}
                />
              </div>
            ))
          )}
        </div>

        {/* Right Fade */}
        <div className="absolute right-0 top-0 h-full w-12 md:w-32 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-gray-950 to-transparent" />
      </div>
    </section>
  );
};

export default TrustedBy;
