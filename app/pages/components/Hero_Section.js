"use client"
import HeroMap from "../assets/map.svg";
import HeroImage from "../assets/images.jpg";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Spinner } from "../../components/ui/spinner";
import { motion } from "framer-motion";
import { ImageWithFallback } from "../../components/figma/ImageWithFallback";

// --- Subcomponents ---

const RatingStars = ({ score = 4.8 }) => {
  const rounded = Math.max(0, Math.min(5, Number(score) || 0));
  const full = Math.floor(rounded);
  const stars = [...Array(5)].map((_, i) => (
    <svg
      key={i}
      xmlns="http://www.w3.org/2000/svg"
      width={14}
      height={14}
      fill="currentColor"
      className={`bi bi-star-fill ${i < full ? 'text-yellow-500' : 'text-gray-300'}`}
      viewBox="0 0 16 16"
    >
      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
    </svg>
  ));
  return (
    <div className="flex items-center gap-2 text-xl leading-none mb-1">
      <div className="text-gray-900 dark:text-gray-400 font-semibold">{rounded.toFixed(1)}</div>
      {stars}
    </div>
  );
};

const AvatarGroup = ({ avatars }) => {
  const list =
    Array.isArray(avatars) && avatars.length
      ? avatars
      : [
          "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=100&h=100&fit=crop",
          "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
        ];
  return (
    <div className="flex -space-x-2">
      {list.map((src, index) => (
        <span
          key={index}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white relative"
        >
          <ImageWithFallback
            src={src}
            alt={`User avatar ${index + 1}`}
            fill
            className="object-cover"
            sizes="40px"
          />
        </span>
      ))}
    </div>
  );
};

// --- Service Ring ---

const ServiceRing = ({ items }) => {
  const services =
    Array.isArray(items) && items.length
      ? items
      : [
          { name: "Cyber Security", icon: "shield" },
          { name: "Web Development", icon: "globe" },
          { name: "Data Analysis", icon: "chart" },
          { name: "App Development", icon: "app" },
          { name: "AI Agent Build", icon: "ai" },
          { name: "Graphics Design", icon: "design" },
        ];
  const iconNode = (icon) => {
    if (typeof icon === "string" && /^https?:\/\//i.test(icon)) {
      return (
        <div className="relative w-5 h-5">
          <ImageWithFallback src={icon} alt="" fill className="object-contain" sizes="20px" />
        </div>
      );
    }
    const key = String(icon || "").toLowerCase();
    const icons = {
      shield: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
      globe: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      chart: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M7 10l3-3 3 3 4-4" />
        </svg>
      ),
      app: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="4" y="4" width="16" height="16" rx="2" />
        </svg>
      ),
      ai: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
        </svg>
      ),
      design: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="2.5" />
        </svg>
      ),
    };
    return icons[key] || icons.design;
  };

  const angles = [0, 60, 120, 180, 240, 300];
  const ringRadius = "12rem";
  const outerRingRadius = "15rem";

  return (
    <div
      className="absolute inset-0 hidden md:block"
      style={{ "--ring-radius": ringRadius }}
    >
      {/* dotted circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-dashed border-gray-300"
        style={{
          width: "calc(2 * var(--ring-radius))",
          height: "calc(2 * var(--ring-radius))",
        }}
      />

      {/* outer circle */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gray-200"
        style={{
          width: `calc(2 * ${outerRingRadius})`,
          height: `calc(2 * ${outerRingRadius})`,
        }}
      />

      {services.map((service, index) => {
        const angle = angles[index];
        return (
          <div
            key={service.name}
            className="absolute top-1/2 left-1/2 z-20"
            style={{
              transform: `translate(-50%, -50%) rotate(${angle}deg) translateX(var(--ring-radius)) rotate(-${angle}deg)`,
            }}
          >
            <div className="theme-bg text-white px-4 py-2 rounded-full shadow-md border border-gray-200 text-sm font-medium flex items-center gap-2 whitespace-nowrap transition-transform duration-300 hover:scale-105">
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: [0, -4, 0], // Smooth floating specifically for the icon
                  rotate: [0, 5, -5, 0], // Subtle rotation for blending/movement feel
                }}
                transition={{
                  opacity: { duration: 0.5, delay: index * 0.1 },
                  scale: { duration: 0.5, delay: index * 0.1 },
                  y: {
                    duration: 4 + index,
                    repeat: Infinity,
                    ease: "easeInOut"
                  },
                  rotate: {
                    duration: 5 + index,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }
                }}
                className="w-5 h-5 flex items-center justify-center drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]"
              >
                {iconNode(service.icon)}
              </motion.span>
              {service.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Component ---

export default function HeroSection({ initialData }) {
  const [data, setData] = useState(initialData || null);
  const [loading, setLoading] = useState(!initialData);
  const [isDark, setIsDark] = useState(false);
  const cleanUrl = (u) => {
    if (typeof u !== "string") return u;
    let s = u.trim();
    const m = s.match(/^\s*url\((.*)\)\s*$/i);
    if (m) s = m[1];
    s = s.replace(/^['"]|['"]$/g, "").replace(/\)+$/, "");
    return s;
  };
  useEffect(() => {
    if (!initialData) {
      (async () => {
        setLoading(true);
        try {
          const resGroups = await fetch("/api/settings/hero-groups", { cache: "no-store" });
          if (resGroups.ok) {
            const jg = await resGroups.json();
            const items = Array.isArray(jg?.item?.data?.items) ? jg.item.data.items : [];
            const active = items.find((g) => g.active) || items[0];
            if (active) {
              setData(active);
              setLoading(false);
              return;
            }
          }
          const resSingle = await fetch("/api/settings/hero", { cache: "no-store" });
          const js = await resSingle.json();
          setData(js?.item?.data || null);
        } catch {
          setData(null);
        } finally {
          setLoading(false);
        }
      })();
    }
    if (typeof window !== "undefined") {
      const mq = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)");
      const get = () => {
        const hasClass = document?.documentElement?.classList?.contains("dark");
        setIsDark(hasClass || (mq ? mq.matches : false));
      };
      get();
      if (mq && mq.addEventListener) {
        mq.addEventListener("change", get);
        return () => mq.removeEventListener("change", get);
      }
    }
  }, [initialData]);
  const getImageSrc = (image) => {
    return typeof image === "string" ? image : image?.src || "";
  };
  const heroImg = cleanUrl(data?.heroImage) || HeroImage;

  return (
    <section className="relative theme-bg-light  hero-grid-bg overflow-hidden py-16 md:py-20 lg:py-12 min-h-[600px] flex items-center">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex justify-center items-center w-full py-24">
            <Spinner />
          </div>
        ) : (
          <div
            className="bg-no-repeat bg-right-top lg:bg-right bg-contain"
            style={{ backgroundImage: `url(${getImageSrc(HeroMap)})` }}
          >
            <div className="flex flex-wrap items-center justify-between">
              {/* LEFT SIDE */}
              <div className="w-full lg:w-7/12 px-4">
                <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
                  <span className="theme-text font-semibold inline-block mb-2">
                    {data?.badge || "Welcome to DarbarTech"}
                  </span>

                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold my-3 text-gray-900 dark:text-gray-100 leading-tight">
                    {(data?.titleLeading || "Powering Your") + " "}
                    <span className="theme-text">
                      {data?.titleGradient || "Digital Transformation"}
                    </span>
                  </h1>

                  <p className="mb-6 text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed">
                    {data?.subtitle ||
                      "Cloud, cybersecurity, and software that scale with your ambition."}
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                    <Link
                      href={data?.primaryCTA?.href || "/contact"}
                      className="inline-block theme-btn rounded-xl font-semibold py-3 px-10  text-lg whitespace-nowrap"
                    >
                      {data?.primaryCTA?.label || "Get Started"}
                    </Link>
                    {data?.secondaryCTA?.label && (
                      <Link
                        href={data.secondaryCTA.href || "#"}
                        className="inline-block px-8 py-3 text-lg font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 transition-colors"
                      >
                        {data.secondaryCTA.label}
                      </Link>
                    )}
                  </div>

                  <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                    <div className="flex flex-col items-center sm:items-start">
                      <div className="flex items-center gap-3">
                        <AvatarGroup avatars={data?.avatars} />
                        <RatingStars score={data?.rating?.score} />
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {data?.rating?.caption
                          ? data.rating.caption
                          : Array.isArray(data?.features) && data.features.length
                          ? data.features.map((f) => f.label).join(" • ")
                          : "Trusted by teams worldwide"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE (Visual) */}
              <div className="w-full lg:w-5/12 px-4 mt-16 lg:mt-0 hidden lg:flex justify-center lg:justify-end">
                <div className="relative max-w-lg lg:max-w-none w-full flex justify-center pr-18 lg:justify-end">
                  <div className="relative w-64 h-64 sm:w-80 sm:h-80">
                    {/* background circle */}
                    <div className="absolute inset-0 z-0">
                      <svg width="100%" height="100%" viewBox="0 0 315 315">
                        <rect width="308" height="308" rx="154" fill="var(--theme-primary)" />
                      </svg>
                    </div>

                    {/* image */}
                    <div className="absolute inset-0 z-10 overflow-hidden rounded-full">
                      <Image
                        src={heroImg}
                        alt="DarbarTech product showcase"
                        fill
                        className="object-cover object-bottom"
                        priority
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>

                    <ServiceRing items={data?.services} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}




