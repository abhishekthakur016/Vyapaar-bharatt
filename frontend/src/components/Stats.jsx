import { useEffect, useRef, useState } from "react";
import { Users, Package, Globe2, IndianRupee, Building2 } from "lucide-react";

const stats = [
  { value: "5.2L+", label: "Verified Suppliers", icon: Users },
  { value: "2.4M+", label: "Product Listings", icon: Package },
  { value: "180+", label: "Countries Connected", icon: Globe2 },
  { value: "₹840Cr+", label: "Annual Trade Value", icon: IndianRupee },
  { value: "500K+", label: "Businesses", icon: Building2 },
];

/* Starts the count-up once the strip is on screen */
function useInView(ref) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (!("IntersectionObserver" in window)) {
      setInView(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [ref]);

  return inView;
}

/* Counts "5.2L+" up from 0 while keeping ₹ / L+ / Cr+ / % */
function CountUp({ value, start }) {
  const match = String(value).match(/^([^\d]*)([\d.]+)(.*)$/);
  const [display, setDisplay] = useState(
    match ? `${match[1]}0${match[3]}` : value,
  );

  useEffect(() => {
    if (!match || !start) return;

    const [, prefix, num, suffix] = match;
    const target = parseFloat(num);
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;

    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    let raf;
    const t0 = performance.now();
    const duration = 1500;

    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(`${prefix}${(target * eased).toFixed(decimals)}${suffix}`);
      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, value]);

  return <span className="tabular-nums">{display}</span>;
}

function Stats() {
  const ref = useRef(null);
  const inView = useInView(ref);

  return (
    <section className="bg-[#f8fafc] px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
      <div
        ref={ref}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[28px] bg-gradient-to-br from-[#0952d4] via-[#0846b8] to-[#071a40] shadow-[0_30px_60px_-30px_rgba(9,82,212,0.75)]"
      >
        {/* Background details */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.45) 1px, transparent 1px)",
              backgroundSize: "20px 20px",
            }}
          />
          <div className="absolute -left-20 -top-24 h-64 w-64 rounded-full bg-[#1684e8]/50 blur-3xl" />
          <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-[#fd8836]/35 blur-3xl" />
          <span className="st-shine absolute inset-y-0 -left-1/3 w-1/4 -skew-x-12 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </div>

        <div className="relative grid grid-cols-2 lg:grid-cols-5">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const isLast = index === stats.length - 1;

            return (
              <div
                key={stat.label}
                style={{ animationDelay: `${index * 90}ms` }}
                className={`st-fade group relative flex items-center gap-3.5 px-5 py-6 transition-colors duration-500 hover:bg-white/[0.06] sm:px-7 sm:py-7
                  ${isLast ? "col-span-2 justify-center lg:col-span-1 lg:justify-start" : ""}
                  ${index % 2 === 0 && !isLast ? "border-r border-white/10" : ""}
                  ${index < 3 ? "border-b border-white/10 lg:border-b-0" : ""}
                  ${index > 0 ? "lg:border-l lg:border-white/10" : ""}
                  lg:border-r-0`}
              >
                {/* Icon */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-[#fd8836] ring-1 ring-inset ring-white/15 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#fd8836] group-hover:to-[#fd641c] group-hover:text-white group-hover:shadow-[0_10px_22px_-8px_rgba(253,136,54,0.9)]">
                  <Icon size={21} />
                </div>

                <div className="min-w-0">
                  <p className="text-xl font-black tracking-tight text-white sm:text-2xl">
                    <CountUp value={stat.value} start={inView} />
                  </p>
                  <p className="mt-0.5 truncate text-xs font-medium text-white/65 sm:text-sm">
                    {stat.label}
                  </p>
                </div>

                {/* Orange underline on hover */}
                <span className="absolute inset-x-6 bottom-0 h-[3px] origin-left scale-x-0 rounded-full bg-gradient-to-r from-[#fd8836] to-[#ffb37a] transition-transform duration-500 group-hover:scale-x-100" />
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes stFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes stShine  { 0% { left: -35%; } 55%,100% { left: 125%; } }
        .st-fade  { animation: stFadeUp 650ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .st-shine { animation: stShine 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .st-fade, .st-shine { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default Stats;
