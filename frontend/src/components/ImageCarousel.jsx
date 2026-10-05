import image74 from "../assets/caraousel/1.jpg";
import image77 from "../assets/caraousel/2.jpg";
import image78 from "../assets/caraousel/3.jpg";
import image79 from "../assets/caraousel/4.jpg";
import image80 from "../assets/caraousel/5.jpg";
import image81 from "../assets/caraousel/6.jpg";
import image82 from "../assets/caraousel/7.jpg";
import image83 from "../assets/caraousel/8.jpg";
import image84 from "../assets/caraousel/9.png";

function ImageCarousel() {
  const images = [
    image74,
    image77,
    image78,
    image79,
    image80,
    image81,
    image82,
    image83,
    image84,
  ];

  // Duplicate images for seamless continuous movement
  const carouselImages = [...images, ...images];

  return (
    <section className="w-full overflow-hidden bg-[#f8fafc] py-5 sm:py-7">
      <div className="relative w-full overflow-hidden">
        {/* LEFT FADE */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-white to-transparent sm:w-20" />

        {/* RIGHT FADE */}
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-white to-transparent sm:w-20" />

        {/* CONTINUOUS CAROUSEL */}
        <div className="carousel-track flex w-max items-center gap-4 sm:gap-5">
          {carouselImages.map((image, index) => (
            <div
              key={`${image}-${index}`}
              className="
                flex
                h-24
                w-40
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-xl
                border
                border-slate-100
                bg-white
                p-2
                shadow-sm
                sm:h-28
                sm:w-48
              "
            >
              <img
                src={image}
                alt={`Business ${index + 1}`}
                className="h-full w-full object-contain"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes carouselMoveRight {
          from {
            transform: translateX(-50%);
          }

          to {
            transform: translateX(0);
          }
        }

        .carousel-track {
          animation: carouselMoveRight 32s linear infinite;
          will-change: transform;
        }

        .carousel-track:hover {
          animation-play-state: paused;
        }

        @media (max-width: 640px) {
          .carousel-track {
            animation-duration: 26s;
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
