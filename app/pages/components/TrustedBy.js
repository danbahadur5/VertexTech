import { useEffect, useState } from "react";
import { Skeleton } from "../../components/ui/skeleton";

const TrustedBy = () => {
  const [logos, setLogos] = useState([]);
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <section className="relative py-20 bg-white dark:bg-gray-950 overflow-hidden">
      {/* Title */}
      <div className="text-center mb-12 px-6">
        {loading ? (
          <>
            <Skeleton className="h-4 w-48 mx-auto mb-3" />
            <Skeleton className="h-10 w-96 mx-auto" />
          </>
        ) : (
          <>
            <p className="text-sm uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-3">{title}</p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100">{subtitle}</h2>
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
      <div className="overflow-hidden w-full relative max-w-6xl mx-auto select-none">
        {/* Left Fade */}
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-gray-950 to-transparent" />

        {/* Logos */}
        <div
          className="marquee-inner flex min-w-[200%] items-center"
          style={{ animationDuration: "20s" }}
        >
          {loading ? (
            [...Array(14)].map((_, i) => (
              <div key={i} className="mx-8 p-4">
                <Skeleton className="h-10 w-32" />
              </div>
            ))
          ) : (
            [...logos, ...logos].map((url, index) => (
              <div
                key={index}
                className="mx-8 flex items-center justify-center p-4 transition duration-300 hover:-translate-y-1"
              >
                <img
                  src={url}
                  alt={`logo-${index}`}
                  className="h-10 w-auto opacity-70 hover:opacity-100 transition duration-300"
                  draggable={false}
                />
              </div>
            ))
          )}
        </div>

        {/* Right Fade */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-gray-950 to-transparent" />
      </div>
    </section>
  );
};

export default TrustedBy;
