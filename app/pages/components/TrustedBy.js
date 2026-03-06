const TrustedBy = () => {
  const companyLogos = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];

  return (
    <section className="relative py-20 bg-white overflow-hidden">
      {/* Title */}
      <div className="text-center mb-12 px-6">
        <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
          Trusted by Leading Companies
        </p>

        <h2 className="text-3xl md:text-4xl font-bold text-gray-500">
          Powering Businesses Around the World
        </h2>
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
        <div className="absolute left-0 top-0 h-full w-24 z-10 pointer-events-noneto-transparent" />

        {/* Logos */}
        <div
          className="marquee-inner flex min-w-[200%] items-center"
          style={{ animationDuration: "20s" }}
        >
          {[...companyLogos, ...companyLogos].map((company, index) => (
            <div
              key={index}
              className="mx-8 flex items-center justify-center p-4 transition duration-300 hover:-translate-y-1"
            >
              <img
                src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
                alt={company}
                className="h-10 w-auto opacity-70 hover:opacity-100 transition duration-300"
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Right Fade */}
        <div className="absolute right-0 top-0 h-full w-24 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>
    </section>
  );
};

export default TrustedBy;
