import { useEffect, useState } from "react";
import { Search, ChevronDown, ArrowRight, Globe2 } from "lucide-react";

import arRoadline from "../assets/ar roadline.png";
import quickTransport from "../assets/quick transport and solution.png";
import ramanTempo from "../assets/raman tempo.png";
import saiTyreHouse from "../assets/sai tyre hosue.png";
import sonuMotorGarage from "../assets/sonu motor garage.png";
import northIndiaHeavyTransport from "../assets/north india heavy transport.png";

function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: arRoadline,
      title: "AR Roadline",
    },
    {
      image: quickTransport,
      title: "Quick Transport and Solution",
    },
    {
      image: ramanTempo,
      title: "Raman Tempo Transport",
    },
    {
      image: saiTyreHouse,
      title: "Sai Tyre House",
    },
    {
      image: sonuMotorGarage,
      title: "Sonu Motor Garage",
    },
    {
      image: northIndiaHeavyTransport,
      title: "North India Heavy Transport",
    },
  ];

  /* =========================
     AUTO SLIDESHOW
  ========================= */

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative min-h-[700px] overflow-hidden sm:min-h-[750px] lg:min-h-[800px]">
      {/* BACKGROUND SLIDES */}

      {slides.map((slide, index) => (
        <div
          key={slide.image}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            currentSlide === index ? "z-0 opacity-100" : "z-0 opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="h-full w-full object-cover"
          />
        </div>
      ))}

      {/* DARK OVERLAY */}

      <div className="absolute inset-0 z-10 bg-black/5" />

      {/* GRADIENT OVERLAY */}

      <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

      {/* HERO CONTENT */}

      <div className="relative z-20 mx-auto flex min-h-[700px] max-w-7xl items-center px-4 py-16 sm:min-h-[750px] sm:px-6 lg:min-h-[800px] lg:px-8">
        <div className="w-full max-w-3xl">
          {/* BADGE */}

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <span className="h-2 w-2 rounded-full bg-[#fd8836]" />

            <span className="text-xs font-bold uppercase tracking-wider text-white">
              India's B2B Trade Network
            </span>
          </div>

          {/* HINDI HEADLINE */}

          <h1 className="text-5xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
            प्रचार करो
            <br />
            <span className="text-[#fd8836]">व्यापार करो.</span>
          </h1>

          {/* ENGLISH HEADLINE */}

          <p className="mt-5 text-2xl font-bold text-white sm:text-3xl">
            Source Smarter. Grow Bigger.
          </p>

          {/* DESCRIPTION */}

          {/* <p className="mt-5 max-w-2xl text-base leading-7 text-white/85 sm:text-lg">
            Connect with verified manufacturers, suppliers and businesses across
            India and global markets. Discover products, compare suppliers,
            request quotations and grow your business.
          </p> */}

          {/* SEARCH BOX */}

          <div className="mt-8 max-w-3xl rounded-2xl border border-white/20 bg-white/95 p-2 shadow-2xl backdrop-blur-md">
            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search size={21} className="shrink-0 text-gray-400" />

                <input
                  type="text"
                  placeholder="Search products, suppliers, categories..."
                  className="w-full bg-transparent py-3 text-sm text-[#0b1f3a] outline-none placeholder:text-gray-400"
                />
              </div>

              <button className="flex items-center justify-between gap-3 rounded-xl bg-gray-100 px-4 py-3 text-sm font-semibold text-gray-700 sm:min-w-[150px]">
                All Categories
                <ChevronDown size={16} />
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0848ba]">
                Search
                <ArrowRight size={17} />
              </button>
            </div>
          </div>

          {/* POPULAR SEARCHES */}

          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-semibold text-white/80">Popular:</span>

            {["Solar Panels", "CNC Machine", "Packaging", "Steel Sheets"].map(
              (item) => (
                <button
                  key={item}
                  className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 font-medium text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0952d4]"
                >
                  {item}
                </button>
              ),
            )}
          </div>

          {/* CTA BUTTONS */}

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <button className="flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-6 py-3.5 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#f47720] hover:shadow-xl">
              Post Your Requirement
              <ArrowRight size={17} />
            </button>

            <button className="flex items-center justify-center gap-2 rounded-xl border border-white/60 bg-white/10 px-6 py-3.5 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white hover:text-[#0952d4]">
              Explore Suppliers
              <Globe2 size={17} />
            </button>
          </div>
        </div>
      </div>

      {/* SLIDE INDICATORS */}

      <div className="absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-2 rounded-full transition-all duration-500 ${
              currentSlide === index
                ? "w-8 bg-[#fd8836]"
                : "w-2 bg-white/60 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </section>
  );
}

export default Hero;
