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
                  <div key={i} className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-3 py-4">
                    <Card className="p-6 h-auto space-y-4 rounded-2xl">
                      <div className="flex justify-between items-center">
                        <Skeleton className="h-6 w-6 rounded-md" />
                        <Skeleton className="h-4 w-16 rounded-md" />
                      </div>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-[90%]" />
                        <Skeleton className="h-4 w-[80%]" />
                      </div>
                      <div className="flex items-center gap-3 pt-2 border-t border-gray-50 dark:border-gray-800/50">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-1.5">
                          <Skeleton className="h-3 w-20" />
                          <Skeleton className="h-2 w-24" />
                        </div>
                      </div>
                    </Card>
                  </div>
                ))
              : items.map((t, idx) => (
                  <div key={idx} className="embla__slide flex-[0_0_100%] min-w-0 md:flex-[0_0_50%] lg:flex-[0_0_33.33%] px-3 py-4">
                    <Card
                      className="h-auto hover:shadow-xl transition-all duration-500 hover:-translate-y-1 relative overflow-hidden group border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 backdrop-blur-md rounded-2xl"
                    >
                      <div
                        className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                        style={{
                          background: "var(--theme-primary)",
                          transform: "translate(30%,-30%)",
                        }}
                      />
                      <CardContent className="p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                          <Quote
                            className="h-6 w-6 opacity-20 group-hover:opacity-60 transition-all duration-500 transform group-hover:rotate-12"
                            style={{ color: "var(--theme-primary)" }}
                          />
                          <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                        </div>
                        
                        <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed text-base">
                          "{t.quote}"
                        </p>
                        
                        <div className="flex items-center gap-3 pt-2 border-t border-gray-50 dark:border-gray-800/50">
                          <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-gray-50 dark:ring-gray-800 group-hover:ring-[var(--theme-primary)]/30 transition-all duration-500">
                            <ImageWithFallback
                              src={t.avatarUrl}
                              alt={t.name || 'Leader'}
                              fill
                              className="object-cover"
                              sizes="40px"
                            />
                          </div>
                          <div className="flex flex-col">
                            <h4 className="font-bold text-gray-900 dark:text-gray-100 text-sm leading-tight">
                              {t.name}
                            </h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">
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
