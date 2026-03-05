import HeroMap from "../assets/map.svg";
import HeroImage from "../assets/images.jpg"; // Renamed for clarity
import { Link } from "react-router";

// --- Subcomponents for better organization ---

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
    HeroImage,
    "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    "https://images.unsplash.com/photo-1545996124-0501ebae84d0?w=100&h=100&fit=crop",
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

// Floating labels that appear on medium+ screens
const FloatingLabels = () => (
  <>
    <div className="absolute top-1/4 mt-4 z-10 xl:-ml-8 hidden md:block">
      <div className="bg-white border border-gray-200 rounded-full px-3 py-2 inline-block font-medium shadow-lg">
        Enterprise-Grade
      </div>
    </div>
    <div className="absolute top-1/2 z-10 -ml-5 xl:-ml-8 -mt-4 hidden md:block">
      <div className="bg-white border border-gray-200 rounded-full px-3 py-2 inline-block font-medium shadow-lg">
        Cloud Native
      </div>
    </div>
    <div className="absolute top-[60%] z-10 mt-2 xl:-ml-8 hidden md:block">
      <div className="bg-white border border-gray-200 rounded-full px-3 py-2 inline-block font-medium shadow-lg">
        Global Coverage
      </div>
    </div>
  </>
);

// Decorative flag icons (hidden on mobile)
const FloatingIcons = () => (
  <>
    <div className="absolute top-0 left-1/2 -ml-8 -mt-8 hidden md:block bg-white p-3 rounded-full shadow-lg border border-gray-200">
      <svg width={36} height={35} viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_7973_3128)">
          <path d="M36.4297 72C56.3119 72 72.4297 55.8823 72.4297 36C72.4297 16.1177 56.3119 0 36.4297 0C16.5474 0 0.429688 16.1177 0.429688 36C0.429688 55.8823 16.5474 72 36.4297 72Z" fill="#F0F0F0"/>
        </g>
      </svg>
    </div>
    <div className="absolute top-0 left-1/2 ml-8 -mt-4 hidden md:block bg-white p-3 rounded-full shadow-lg border border-gray-200">
      <svg width={36} height={36} viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_7973_3131)">
          <path d="M2.94214 49.2542C8.02869 62.9629 21.2242 72.7325 36.703 72.7325C52.1817 72.7325 65.3772 62.9629 70.4638 49.2542L36.703 46.1239L2.94214 49.2542Z" fill="#FFDA44"/>
        </g>
      </svg>
    </div>
    <div className="absolute top-10 left-[60%] mt-8 ml-4 hidden md:block bg-white p-3 rounded-full shadow-lg border border-gray-200">
      <svg width={36} height={36} viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_7973_3127)">
          <path d="M72.9531 36.9873C72.9531 56.8694 56.8353 72.9873 36.9531 72.9873C17.071 72.9873 0.953125 56.8694 0.953125 36.9873C0.953125 36.9957 36.9531 0.991383 36.9531 0.987305C56.8353 0.987305 72.9531 17.1052 72.9531 36.9873Z" fill="#0052B4"/>
        </g>
      </svg>
    </div>
    <div className="absolute top-10 right-10 md:right-10 lg:right-0 md:-mr-4 hidden md:block bg-white p-3 rounded-full shadow-lg border border-gray-200">
      <svg width={36} height={36} viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_7973_3133)">
          <path d="M36.4492 72.501C56.3315 72.501 72.4492 56.3832 72.4492 36.501C72.4492 16.6187 56.3315 0.500977 36.4492 0.500977C16.567 0.500977 0.449219 16.6187 0.449219 36.501C0.449219 56.3832 16.567 72.501 36.4492 72.501Z" fill="#F0F0F0"/>
        </g>
      </svg>
    </div>
    <div className="absolute top-1/4 right-0 xl:right-20 xl:-ml-8 mt-8 hidden md:block bg-white p-3 rounded-full shadow-lg border border-gray-200">
      <svg width={36} height={35} viewBox="0 0 73 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_7973_3128)">
          <path d="M36.4297 72C56.3119 72 72.4297 55.8823 72.4297 36C72.4297 16.1177 56.3119 0 36.4297 0C16.5474 0 0.429688 16.1177 0.429688 36C0.429688 55.8823 16.5474 72 36.4297 72Z" fill="#F0F0F0"/>
        </g>
      </svg>
    </div>
    <div className="absolute top-1/2 right-0 mt-8 hidden md:block bg-white p-3 rounded-full shadow-lg border border-gray-200">
      <svg width={36} height={36} viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_7973_3132)">
          <path d="M36.9805 72.5234C56.8627 72.5234 72.9805 56.4057 72.9805 36.5234C72.9805 16.6412 56.8627 0.523438 36.9805 0.523438C17.0982 0.523438 0.980469 16.6412 0.980469 36.5234C0.980469 56.4057 17.0982 72.5234 36.9805 72.5234Z" fill="#F0F0F0"/>
        </g>
      </svg>
    </div>
    <div className="absolute top-3/4 left-[60%] -ml-8 pt-3 hidden md:block bg-white p-3 rounded-full shadow-lg border border-gray-200">
      <svg width={36} height={36} viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_7973_3129)">
          <path d="M36.8789 72.0742C56.7612 72.0742 72.8789 55.9565 72.8789 36.0742C72.8789 16.192 56.7612 0.0742188 36.8789 0.0742188C16.9967 0.0742188 0.878906 16.192 0.878906 36.0742C0.878906 55.9565 16.9967 72.0742 36.8789 72.0742Z" fill="#F0F0F0"/>
        </g>
      </svg>
    </div>
  </>
);

// --- Main Component ---

export default function HeroSection() {
  // Helper to resolve imported image/src
  const getImageSrc = (image) => {
    return typeof image === "string" ? image : image?.src || "";
  };

  return (
    <section className="relative theme-bg-light hero-grid-bg overflow-hidden py-16 md:py-20 lg:py-24">
      {/* Background blobs */}
      <div className="blob blob-primary w-96 h-96 top-[-120px] left-[-100px]" />
      <div className="blob blob-secondary w-72 h-72 bottom-[-80px] right-[-60px]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Map background image */}
        <div
          className="bg-no-repeat bg-right-top lg:bg-right bg-contain"
          style={{
            backgroundImage: `url(${getImageSrc(HeroMap)})`,
          }}
        >
          <div className="flex flex-wrap items-center -mx-4">
            {/* Left content */}
            <div className="w-full lg:w-5/12 px-4">
              <div className="animate-fade-in-up max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
                <span className="theme-text font-semibold inline-block mb-2">
                  Welcome to VertexTech
                </span>
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold my-3 text-gray-900 leading-tight">
                  Powering Your Digital Transformation
                </h1>
                <p className="mb-6 text-lg sm:text-xl text-gray-700 leading-relaxed">
                  Cloud, cybersecurity, and software that scale with your ambition.
                </p>

                {/* CTA and social proof */}
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <Link
                    to="/contact"
                    className="inline-block theme-btn rounded-xl font-semibold py-3 px-6 text-lg whitespace-nowrap"
                  >
                    Get Started
                  </Link>

                  <div className="flex flex-col items-center sm:items-start">
                    <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-start">
                      <AvatarGroup />
                      <div className="flex items-center gap-1">
                        <RatingStars />
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Engaged Students
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="w-full lg:w-7/12 xl:w-6/12 xl:ml-[8.333333%] px-4 flex justify-center py-6 lg:py-0">
              <div className="text-center relative">
                <div className="relative animate-fade-in-scale">
                  {/* Central circle and image */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                    <svg width={280} height={280} viewBox="0 0 315 315" className="w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80">
                      <rect x="3.06323" y="2.99145" width="308.4" height="308.4" rx="154.2" fill="white" />
                      <rect x="3.06323" y="2.99145" width="308.4" height="308.4" rx="154.2" fill="#F20000" />
                      <rect x="3.06323" y="2.99145" width="308.4" height="308.4" rx="154.2" stroke="var(--gk-gray-200)" strokeWidth="5.81886" />
                    </svg>
                    <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3/4">
                      <img
                        src={getImageSrc(HeroImage)}
                        alt="VertexTech product showcase"
                        className="w-full h-auto object-contain"
                      />
                    </div>
                  </div>

                  {/* Floating labels and icons (hidden on mobile) */}
                  <FloatingLabels />
                  <FloatingIcons />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}