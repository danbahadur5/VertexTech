import HeroMap from "../assets/map.svg";
import HeroImage from "../assets/images.jpg";
import { Link } from "react-router";
import Image from "next/image";

// --- Subcomponents ---

const RatingStars = () => (
  <div className="flex items-center gap-2 text-xl leading-none mb-1">
    <div className="text-gray-900 font-semibold">4.8</div>
    {[...Array(5)].map((_, i) => (
      <svg
        key={i}
        xmlns="http://www.w3.org/2000/svg"
        width={14}
        height={14}
        fill="currentColor"
        className="bi bi-star-fill text-yellow-500"
        viewBox="0 0 16 16"
      >
        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
      </svg>
    ))}
  </div>
);

const AvatarGroup = () => {
  const avatars = [
    "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  ];

  return (
    <div className="flex -space-x-2">
      {avatars.map((src, index) => (
        <span
          key={index}
          className="w-10 h-10 rounded-full overflow-hidden border-2 border-white"
        >
          <img
            src={src}
            alt={`User avatar ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </span>
      ))}
    </div>
  );
};

// --- Service Ring ---

const ServiceRing = () => {
  const services = [
    { name: "Cyber Security", icon: "shield" },
    { name: "Web Development", icon: "globe" },
    { name: "Data Analysis", icon: "chart" },
    { name: "App Development", icon: "app" },
    { name: "AI Agent Build", icon: "ai" },
    { name: "Graphics Design", icon: "design" },
  ];

  const angles = [0, 60, 120, 180, 240, 300];
  const ringRadius = "12rem";
  const outerRingRadius = "15rem";

  const icons = {
    shield: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    globe: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    chart: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M7 10l3-3 3 3 4-4" />
      </svg>
    ),
    app: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="4" y="4" width="16" height="16" rx="2" />
      </svg>
    ),
    ai: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="10" />
      </svg>
    ),
    design: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
  };

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
            className="absolute top-1/3 left-1/4 z-20"
            style={{
              transform: `rotate(${angle}deg) translateX(var(--ring-radius)) rotate(-${angle}deg)`,
            }}
          >
            <div className="bg-orange-800 text-white px-4 py-2 rounded-full shadow-md border border-gray-200 text-sm font-medium flex items-center gap-2 whitespace-nowrap">
              <span className="w-5 h-5">{icons[service.icon]}</span>
              {service.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// --- Main Component ---

export default function HeroSection() {
  const getImageSrc = (image) => {
    return typeof image === "string" ? image : image?.src || "";
  };

  return (
    <section className="relative theme-bg-light hero-grid-bg overflow-hidden py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="bg-no-repeat bg-right-top lg:bg-right bg-contain"
          style={{ backgroundImage: `url(${getImageSrc(HeroMap)})` }}
        >
          <div className="flex flex-wrap items-center">
            {/* LEFT SIDE */}
            <div className="w-full lg:w-5/12 px-4">
              <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <span className="theme-text font-semibold inline-block mb-2">
                  Welcome to VertexTech
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold my-3 text-gray-900 leading-tight">
                  Powering Your Digital Transformation
                </h1>

                <p className="mb-6 text-lg sm:text-xl text-gray-700 leading-relaxed">
                  Cloud, cybersecurity, and software that scale with your
                  ambition.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Link
                    to="/contact"
                    className="inline-block theme-btn rounded-xl font-semibold py-3 px-10 w-[80%] text-lg whitespace-nowrap"
                  >
                    Get Started
                  </Link>

                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center gap-3">
                      <AvatarGroup />
                      <RatingStars />
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Engaged Students
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT SIDE (Hidden on small devices) */}
            <div className="w-full lg:w-7/12 xl:w-6/12 px-4 hidden lg:flex justify-end items-center">
              <div className="relative w-80 h-80">
                {/* background circle */}
                <div className="absolute inset-0 z-0">
                  <svg width="100%" height="100%" viewBox="0 0 315 315">
                    <rect width="308" height="308" rx="154" fill="#F20000" />
                  </svg>
                </div>

                {/* image */}
                <div className="absolute inset-0 z-10 overflow-hidden rounded-full">
                  <Image
                    src={HeroImage}
                    alt="VertexTech product showcase"
                    fill
                    className="object-cover object-bottom"
                  />
                </div>

                <ServiceRing />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
