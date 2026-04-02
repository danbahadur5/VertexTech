import { useEffect, useState, useCallback } from "react";
import { Badge } from "../../components/ui/badge";
import { Card, CardContent } from "../../components/ui/card";
import { Quote, ChevronLeft, ChevronRight } from "lucide-react";
import { useScrollReveal } from "../../lib/use-scroll-reveal";
import { Skeleton } from "../../components/ui/skeleton";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function Testimonials() {
  useScrollReveal();
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', skipSnaps: false },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/settings/trusted-security-leader", { 
          next: { revalidate: 3600 } 
        });
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
    <section className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 reveal">
          <div className="max-w-2xl">
            <Badge className="mb-4 theme-badge">Testimonials</Badge>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-10 w-96 mb-4" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                  {title}
                </h2>
                <p className="text-lg text-muted-foreground dark:text-gray-400">
                  {subtitle}
                </p>
              </>
            )}
          </div>
          
          <div className="hidden md:flex items-center gap-3 mt-8 md:mt-0">
            <button
              onClick={scrollPrev}
              className="p-3 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:theme-text" />
            </button>
            <button
              onClick={scrollNext}
              className="p-3 rounded-full border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors group"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:theme-text" />
            </button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container flex">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <div key={i} className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4">
                    <Card className="p-8 h-full space-y-4">
                      <Skeleton className="h-8 w-8 rounded-full mb-4" />
                      <Skeleton className="h-20 w-full" />
                      <div className="flex items-center gap-3 mt-auto">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-32" />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              : items.map((t, idx) => (
                  <div key={idx} className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-4">
                    <Card
                      className="h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden group border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/50 backdrop-blur-sm"
                    >
                      <div
                        className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-500"
                        style={{
                          background: "var(--theme-primary)",
                          transform: "translate(30%,-30%)",
                        }}
                      />
                      <CardContent className="pt-10 flex flex-col h-full">
                        <Quote
                          className="h-10 w-10 mb-6 opacity-20 group-hover:opacity-40 transition-opacity duration-500"
                          style={{ color: "var(--theme-primary)" }}
                        />
                        <p className="text-gray-700 dark:text-gray-300 mb-8 italic leading-relaxed text-lg flex-grow">
                          "{t.quote}"
                        </p>
                        <div className="flex items-center gap-4 mt-auto">
                          <div className="relative w-14 h-14 rounded-full overflow-hidden ring-4 ring-gray-50 dark:ring-gray-800 group-hover:ring-[var(--theme-primary)]/20 transition-all duration-500">
                            <ImageWithFallback
                              src={t.avatarUrl}
                              alt={t.name || 'Leader'}
                              fill
                              className="object-cover"
                              sizes="56px"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-base">
                              {t.name}
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                              {t.role}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={`h-2 transition-all duration-500 rounded-full ${
                index === selectedIndex 
                  ? "w-8 theme-gradient" 
                  : "w-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
              }`}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
