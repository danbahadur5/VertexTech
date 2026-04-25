"use client";

import { useEffect, useState, useRef } from "react";
import { Spinner } from "../../components/ui/spinner";
import { motion, useInView, useSpring, useTransform } from "framer-motion";

/**
 * Animated Counter Component
 * Uses framer-motion to animate numbers from 0 to target
 */
function Counter({ value, duration = 2 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const springValue = useSpring(0, {
    duration: duration * 1000,
    bounce: 0,
  });
  const displayValue = useTransform(springValue, (latest) => Math.floor(latest));

  useEffect(() => {
    if (inView) {
      springValue.set(value);
    }
  }, [inView, value, springValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
}

export default function Hero_Trusted_Count({ initialData }) {
  const [items, setItems] = useState(initialData?.items || []);
  const [loading, setLoading] = useState(!initialData && items.length === 0);
  const [title, setTitle] = useState(initialData?.title || "");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        // Fallback or error handling
      } finally {
        setLoading(false);
      }
    })();
  }, [initialData]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  if (!mounted) return null;

  return (
    <section 
      className="py-12 md:py-16 theme-bg-light relative overflow-hidden border-y border-gray-100 dark:border-gray-800"
      aria-labelledby="trusted-metrics-title"
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
        <div className="absolute top-0 left-0 w-full h-full hero-grid-bg"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {loading ? (
          <div className="flex justify-center py-12">
            <Spinner />
          </div>
        ) : title ? (
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <motion.h3 
              id="trusted-metrics-title"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-3"
            >
              {title}
            </motion.h3>
            <motion.div 
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              className="h-1 w-20 theme-gradient mx-auto rounded-full origin-center"
            />
          </div>
        ) : null}

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {items.map((s, i) => (
                <motion.div
                  key={`${s.label}-${i}`}
                  variants={itemVariants}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="group relative p-5 md:p-6 rounded-2xl bg-white dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center min-h-[140px]"
                >
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="relative text-center w-full">
                    <div className="text-4xl md:text-5xl font-black mb-2 tracking-tighter text-gray-900 dark:text-white flex items-center justify-center">
                      <Counter value={parseFloat(s.num) || 0} />
                      <span className="theme-gradient-text bg-clip-text text-transparent ml-1">
                        {s.suffix}
                      </span>
                    </div>
                    <div className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm md:text-sm font-bold uppercase tracking-widest">
                      {s.label}
                    </div>
                  </div>
                </motion.div>
              ))}
        </motion.div>
      </div>
    </section>
  );
}

