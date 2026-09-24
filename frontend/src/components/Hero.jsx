import { useEffect, useState } from "react";
import {
  Search,
  ChevronDown,
  ArrowRight,
  Globe2,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  Building2,
  Factory,
  Truck,
} from "lucide-react";

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

  // =========================
  // AUTO SLIDESHOW
  // =========================

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // =========================
  // SLIDER CONTROLS
  // =========================

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section className="relative overflow-hidden bg-[#eef7ff]">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="absolute inset-0 overflow-hidden">
        {/* Main background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f8fcff] via-[#e8f5ff] to-[#d9edff]" />

        {/* Blue glow */}
        <div className="absolute -left-40 -top-40 h-[600px] w-[600px] rounded-full bg-[#1684e8]/10 blur-3xl" />

        <div className="absolute -right-40 top-20 h-[550px] w-[550px] rounded-full bg-[#0952d4]/10 blur-3xl" />

        <div className="absolute bottom-[-250px] left-[35%] h-[600px] w-[600px] rounded-full bg-[#fd8836]/10 blur-3xl" />

        {/* =====================================================
            FAKE BACKGROUND BUSINESS PLACEHOLDER
        ===================================================== */}

        <div className="absolute right-[-80px] top-[70px] hidden h-[520px] w-[620px] rotate-[-7deg] rounded-[60px] border border-white/70 bg-white/25 opacity-60 shadow-[0_30px_100px_rgba(9,82,212,0.10)] backdrop-blur-sm lg:block">
          {/* Fake skyline */}
          <div className="absolute bottom-0 left-0 right-0 flex h-[230px] items-end gap-3 px-10 opacity-30">
            <div className="h-24 w-14 rounded-t bg-[#0952d4]/20" />

            <div className="h-40 w-20 rounded-t bg-[#122299]/20" />

            <div className="h-28 w-12 rounded-t bg-[#1684e8]/20" />

            <div className="h-52 w-24 rounded-t bg-[#0952d4]/15" />

            <div className="h-32 w-16 rounded-t bg-[#0952d4]/20" />

            <div className="h-44 w-20 rounded-t bg-[#0952d4]/20" />

            <div className="h-28 w-14 rounded-t bg-[#1684e8]/20" />

            <div className="h-56 w-28 rounded-t bg-[#0952d4]/15" />
          </div>

          {/* Fake road */}
          <div className="absolute bottom-0 left-[-100px] h-20 w-[850px] rotate-[5deg] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

          {/* Fake Factory Card */}
          <div className="absolute left-16 top-24 flex h-20 w-44 items-center gap-3 rounded-2xl border border-white/70 bg-white/45 px-4 shadow-xl backdrop-blur-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0952d4]/10">
              <Factory className="text-[#0952d4]" size={23} />
            </div>

            <div>
              <div className="h-2 w-20 rounded bg-[#0b1f3a]/20" />
              <div className="mt-2 h-2 w-12 rounded bg-[#0b1f3a]/10" />
            </div>
          </div>

          {/* Fake Transport Card */}
          <div className="absolute right-12 top-40 flex h-20 w-44 items-center gap-3 rounded-2xl border border-white/70 bg-white/45 px-4 shadow-xl backdrop-blur-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fd8836]/10">
              <Truck className="text-[#fd8836]" size={23} />
            </div>

            <div>
              <div className="h-2 w-20 rounded bg-[#0b1f3a]/20" />
              <div className="mt-2 h-2 w-12 rounded bg-[#0b1f3a]/10" />
            </div>
          </div>

          {/* Fake Business Card */}
          <div className="absolute bottom-28 left-32 flex h-20 w-44 items-center gap-3 rounded-2xl border border-white/70 bg-white/45 px-4 shadow-xl backdrop-blur-md">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0952d4]/10">
              <Building2 className="text-[#0952d4]" size={23} />
            </div>

            <div>
              <div className="h-2 w-20 rounded bg-[#0b1f3a]/20" />
              <div className="mt-2 h-2 w-12 rounded bg-[#0b1f3a]/10" />
            </div>
          </div>
        </div>

        {/* Decorative diagonal lines */}
        <div className="absolute -left-20 top-0 h-[900px] w-[300px] -skew-x-[25deg] border-r border-[#1684e8]/10" />

        <div className="absolute left-20 top-0 h-[900px] w-[220px] -skew-x-[25deg] border-r border-[#1684e8]/10" />
      </div>

      {/* =========================================================
          MAIN HERO
      ========================================================= */}

      <div className="relative z-10 mx-auto max-w-[1500px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
        <div className="grid items-center gap-8 lg:grid-cols-[0.78fr_1.22fr] xl:gap-12">
          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <div className="relative z-20">
            {/* Badge */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#fd8836]/20 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-md">
              <span className="h-2.5 w-2.5 rounded-full bg-[#fd8836] shadow-[0_0_0_5px_rgba(253,136,54,0.10)]" />

              <span className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0b1f3a]">
                India's B2B Trade Network
              </span>
            </div>

            {/* Hindi Heading */}
            <h1 className="max-w-[600px] text-[48px] font-black leading-[0.98] tracking-[-0.035em] text-[#071a40] sm:text-[58px] lg:text-[62px] xl:text-[70px]">
              प्रचार करो
              <br />
              <span className="text-[#fd641c]">व्यापार करो.</span>
            </h1>

            {/* English Heading */}
            <p className="mt-5 text-xl font-extrabold tracking-tight text-[#0b1f3a] sm:text-2xl lg:text-[27px]">
              Source Smarter. Grow Bigger.
            </p>

            {/* Description */}
            <p className="mt-3 max-w-[590px] text-sm leading-6 text-[#53647d] sm:text-base">
              Connect with trusted suppliers, manufacturers and service
              providers across India.
            </p>

            {/* =================================================
                SEARCH BOX
            ================================================= */}

            <div className="mt-6 max-w-[620px] rounded-2xl border border-[#d5e3f2] bg-white p-1.5 shadow-[0_15px_45px_rgba(9,82,212,0.12)]">
              <div className="flex items-center">
                {/* Search Input */}
                <div className="flex min-w-0 flex-1 items-center gap-2 px-3">
                  <Search
                    size={20}
                    strokeWidth={2.2}
                    className="shrink-0 text-[#0b1f3a]"
                  />

                  <input
                    type="text"
                    placeholder="Search products, suppliers, categories..."
                    className="w-full min-w-0 bg-transparent py-3 text-sm text-[#0b1f3a] outline-none placeholder:text-[#71809a]"
                  />
                </div>

                {/* Category */}
                <button className="hidden items-center gap-1.5 border-l border-[#e5eaf0] px-4 text-xs font-semibold text-[#53647d] md:flex">
                  All Categories
                  <ChevronDown size={15} />
                </button>

                {/* Search Button */}
                <button className="flex h-11 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fd8836] text-white shadow-md transition hover:bg-[#f47720] hover:shadow-lg sm:w-auto sm:gap-2 sm:px-5">
                  <span className="hidden text-sm font-bold sm:block">
                    Search
                  </span>

                  <ArrowRight size={18} />
                </button>
              </div>
            </div>

            {/* =================================================
                POPULAR SEARCHES
            ================================================= */}

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold text-[#53647d]">
                Popular:
              </span>

              {["Solar Panels", "CNC Machine", "Packaging", "Steel Sheets"].map(
                (item) => (
                  <button
                    key={item}
                    className="rounded-full border border-[#d5e3f2] bg-white/75 px-3 py-1.5 text-[11px] font-semibold text-[#354866] shadow-sm backdrop-blur-sm transition hover:border-[#0952d4] hover:bg-[#0952d4] hover:text-white"
                  >
                    {item}
                  </button>
                ),
              )}
            </div>

            {/* =================================================
                CTA BUTTONS
            ================================================= */}

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#fd641c] px-5 py-3.5 text-sm font-bold text-white shadow-[0_10px_25px_rgba(253,100,28,0.25)] transition hover:-translate-y-0.5 hover:bg-[#ed5815]">
                <Plus size={18} />
                Post Your Requirement
                <ArrowRight size={16} />
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-[#0b1f3a]/20 bg-white/70 px-5 py-3.5 text-sm font-bold text-[#0b1f3a] shadow-sm backdrop-blur-md transition hover:border-[#0952d4] hover:bg-[#0952d4] hover:text-white">
                <Users size={18} />
                Explore Suppliers
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

          {/* =====================================================
              RIGHT SLIDESHOW
          ===================================================== */}

          <div className="relative">
            {/* Slider Glow */}
            <div className="absolute -inset-5 rounded-[34px] bg-[#0952d4]/10 blur-2xl" />

            {/* Main Slider */}
            <div className="relative overflow-hidden rounded-[24px] border border-white/90 bg-white/80 p-2 shadow-[0_25px_70px_rgba(8,53,110,0.25)] backdrop-blur-md">
              {/* =================================================
                  SLIDESHOW IMAGE

                  MOBILE  = 16/10
                  TABLET  = 16/9
                  DESKTOP = 16/8.2
              ================================================= */}

              <div className="relative aspect-[16/10] overflow-hidden rounded-[18px] bg-[#eaf3fb] sm:aspect-[16/9] lg:aspect-[16/8.2]">
                {/* Slides */}
                {slides.map((slide, index) => (
                  <div
                    key={slide.image}
                    className={`absolute inset-0 transition-all duration-700 ${
                      currentSlide === index
                        ? "scale-100 opacity-100"
                        : "scale-[1.02] opacity-0"
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}

                {/* =================================================
                    PREVIOUS BUTTON
                ================================================= */}

                <button
                  onClick={prevSlide}
                  aria-label="Previous slide"
                  className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0b1f3a] shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white"
                >
                  <ChevronLeft size={22} />
                </button>

                {/* =================================================
                    NEXT BUTTON
                ================================================= */}

                <button
                  onClick={nextSlide}
                  aria-label="Next slide"
                  className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0b1f3a] shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              {/* =================================================
                  SLIDER FOOTER
              ================================================= */}

              <div className="flex items-center justify-between px-3 py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#7b899c]">
                    Featured Business
                  </span>

                  <span className="hidden h-1 w-1 rounded-full bg-[#fd8836] sm:block" />

                  <span className="hidden text-[10px] font-semibold text-[#53647d] sm:block">
                    {slides[currentSlide].title}
                  </span>
                </div>

                {/* Slide Indicators */}
                <div className="flex items-center gap-1.5">
                  {slides.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        currentSlide === index
                          ? "w-6 bg-[#fd8836]"
                          : "w-1.5 bg-[#c7d3df] hover:bg-[#0952d4]"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* =================================================
                FLOATING NETWORK CARD
            ================================================= */}

            <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0952d4]/10">
                <Globe2 size={20} className="text-[#0952d4]" />
              </div>

              <div>
                <p className="text-xs font-extrabold text-[#0b1f3a]">
                  Pan India Network
                </p>

                <p className="mt-0.5 text-[10px] text-[#7b899c]">
                  Suppliers • Manufacturers • Services
                </p>
              </div>
            </div>

            {/* =================================================
                FLOATING ACTIVE CARD
            ================================================= */}

            <div className="absolute -right-4 -top-5 hidden rounded-2xl border border-white bg-white/90 px-4 py-3 shadow-xl backdrop-blur-md md:block">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500 shadow-[0_0_0_4px_rgba(34,197,94,0.12)]" />

                <span className="text-[11px] font-bold text-[#0b1f3a]">
                  Business Network Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================
          BOTTOM DECORATIVE LINE
      ========================================================= */}

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#0952d4]/20 to-transparent" />
    </section>
  );
}

export default Hero;
