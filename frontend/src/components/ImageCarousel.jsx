import { useState } from "react";
import {
  Truck,
  Scissors,
  LifeBuoy,
  Bus,
  Shirt,
  Wrench,
  Zap,
  Bolt,
  Sofa,
} from "lucide-react";

import truckImg from "../assets/truck.avif";
import hosieryImg from "../assets/Hoisery.avif";
import tyreImg from "../assets/tyre.avif";
import transportImg from "../assets/transport.avif";
import clothesImg from "../assets/clothes.avif";
import garageImg from "../assets/garage.avif";
import electricalImg from "../assets/electrical.avif";
import fittingsImg from "../assets/fittings.avif";
import interiorImg from "../assets/interior.avif";

/* =========================================================
   CATEGORIES
   Icon is only a fallback if an image ever fails to load.
========================================================= */

const categories = [
  { name: "Trucks", image: truckImg, icon: Truck },
  { name: "Hosiery", image: hosieryImg, icon: Scissors },
  { name: "Tyres", image: tyreImg, icon: LifeBuoy },
  { name: "Transport", image: transportImg, icon: Bus },
  { name: "Clothes", image: clothesImg, icon: Shirt },
  { name: "Garage", image: garageImg, icon: Wrench },
  { name: "Electricals", image: electricalImg, icon: Zap },
  { name: "Fittings", image: fittingsImg, icon: Bolt },
  { name: "Interior", image: interiorImg, icon: Sofa },
];

function CategoryCircle({ name, image, icon: Icon, index, hidden }) {
  const [failed, setFailed] = useState(false);
  const orange = index % 2 === 1;

  return (
    <div className="shrink-0 pr-6 sm:pr-8" aria-hidden={hidden}>
      <div className="group flex w-24 flex-col items-center sm:w-28">
        {/* Gradient ring */}
        <div
          className={`rounded-full p-[3px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:scale-105 ${
            orange
              ? "bg-gradient-to-br from-[#fd8836] to-[#fd641c]"
              : "bg-gradient-to-br from-[#0952d4] to-[#1684e8]"
          }`}
        >
          <div className="rounded-full bg-[#f8fafc] p-[3px]">
            <div className="relative h-[84px] w-[84px] overflow-hidden rounded-full bg-white shadow-[0_10px_25px_-12px_rgba(9,82,212,0.55)] sm:h-[100px] sm:w-[100px]">
              {!failed ? (
                <img
                  src={image}
                  alt={hidden ? "" : name}
                  loading="lazy"
                  draggable={false}
                  onError={() => setFailed(true)}
                  className="h-full w-full select-none object-cover transition-transform duration-700 group-hover:scale-110"
                />
              ) : (
                <div
                  className={`flex h-full w-full items-center justify-center ${
                    orange
                      ? "bg-[#fd8836]/10 text-[#fd8836]"
                      : "bg-[#0952d4]/[0.08] text-[#0952d4]"
                  }`}
                >
                  <Icon
                    size={34}
                    strokeWidth={1.8}
                    className="transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="mt-3 text-center text-xs font-bold text-[#0b1f3a] transition-colors duration-300 group-hover:text-[#0952d4] sm:text-sm">
          {name}
        </p>
      </div>
    </div>
  );
}

function ImageCarousel() {
  // Repeat once so one set is wider than large screens, then duplicate for a seamless loop
  const oneSet = [...categories, ...categories];
  const items = [...oneSet, ...oneSet];

  return (
    <section className="w-full overflow-hidden bg-[#f8fafc] py-6 sm:py-8">
      <div className="relative w-full overflow-hidden">
        {/* LEFT FADE */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#f8fafc] to-transparent sm:w-24" />

        {/* RIGHT FADE */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#f8fafc] to-transparent sm:w-24" />

        {/* CONTINUOUS CAROUSEL */}
        <div className="carousel-track flex w-max items-start py-2">
          {items.map((cat, index) => (
            <CategoryCircle
              key={index}
              {...cat}
              index={index % categories.length}
              hidden={index >= categories.length}
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes carouselMoveRight {
          from { transform: translateX(-50%); }
          to   { transform: translateX(0); }
        }

        .carousel-track {
          animation: carouselMoveRight 45s linear infinite;
          will-change: transform;
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .carousel-track {
            animation-duration: 35s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .carousel-track {
            animation: none;
            transform: translateX(0);
          }
        }
      `}</style>
    </section>
  );
}

export default ImageCarousel;
  