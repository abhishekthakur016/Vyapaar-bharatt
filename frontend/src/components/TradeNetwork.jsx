import { useEffect, useRef, useState } from "react";
import {
  Globe2,
  Factory,
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  Truck,
  ArrowUpRight,
} from "lucide-react";

/* =========================================================
   DATA
========================================================= */

const networkStats = [
  { value: "5.2L+", label: "Verified Suppliers", icon: Factory },
  { value: "2.4M+", label: "Product Listings", icon: Package },
  { value: "180+", label: "Countries", icon: Globe2 },
  { value: "500K+", label: "Business Enquiries", icon: MessageSquare },
  { value: "₹840Cr+", label: "Annual Trade Value", icon: TrendingUp },
  { value: "98%", label: "Business Satisfaction", icon: Users },
];

// Nodes that travel on the orbits (angle = starting position in degrees)
const outerNodes = [
  { label: "Suppliers", icon: Factory, angle: 0, tone: "orange" },
  { label: "Products", icon: Package, angle: 90, tone: "glass" },
  { label: "Buyers", icon: Users, angle: 180, tone: "orange" },
  { label: "Growth", icon: TrendingUp, angle: 270, tone: "glass" },
];

const innerNodes = [
  { label: "Enquiries", icon: MessageSquare, angle: 45, tone: "glass" },
  { label: "Logistics", icon: Truck, angle: 225, tone: "orange" },
];

const TILT = 62; // how far the orbit plane leans back (degrees)

/* =========================================================
   HELPERS
========================================================= */

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

// Counts "5.2L+" → 0.0L+ … 5.2L+, keeping prefix (₹) and suffix (L+, Cr+, %)
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

    const reduce = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduce) {
      setDisplay(value);
      return;
    }

    let raf;
    const t0 = performance.now();
    const duration = 1600;

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

/* =========================================================
   ORBIT PIECES
========================================================= */

function OrbitNode({ node, radius, anim }) {
  const Icon = node.icon;
  const orange = node.tone === "orange";

  return (
    // Places the node on the ring
    <div
      className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
      style={{
        transform: `rotate(${node.angle}deg) translateX(${radius}px) rotate(${-node.angle}deg)`,
      }}
    >
      {/* Counter-rotates so the node always stands upright facing you */}
      <div className="tn-counter [transform-style:preserve-3d]" style={anim}>
        <div className="absolute left-0 top-0 flex w-max -translate-x-1/2 -translate-y-1/2 flex-col items-center">
          <div
            className={`flex h-14 w-14 items-center justify-center rounded-2xl border shadow-[0_18px_35px_-12px_rgba(7,26,64,0.9)] ${
              orange
                ? "border-white/30 bg-gradient-to-br from-[#fd8836] to-[#fd641c] text-white"
                : "border-white/25 bg-gradient-to-br from-[#1684e8]/90 to-[#0b3fa8]/90 text-white"
            }`}
          >
            <Icon size={24} />
          </div>

          <span className="mt-2 rounded-full bg-[#071a40]/70 px-2.5 py-1 text-[11px] font-bold text-white ring-1 ring-white/15">
            {node.label}
          </span>
        </div>
      </div>
    </div>
  );
}

function Orbit({
  radius,
  duration,
  reverse = false,
  nodes = [],
  dots = [],
  dashed = false,
}) {
  const anim = {
    animationDuration: `${duration}s`,
    animationDirection: reverse ? "reverse" : "normal",
  };

  return (
    <div
      className="tn-spin absolute left-1/2 top-1/2 rounded-full [transform-style:preserve-3d]"
      style={{
        width: radius * 2,
        height: radius * 2,
        marginLeft: -radius,
        marginTop: -radius,
        ...anim,
      }}
    >
      {/* Ring */}
      <div
        className={`absolute inset-0 rounded-full border-2 ${
          dashed ? "border-dashed border-white/25" : "border-white/15"
        } shadow-[inset_0_0_40px_rgba(22,132,232,0.35),0_0_30px_rgba(22,132,232,0.25)]`}
      />

      {/* Data beams from the centre to each node */}
      {nodes.map((n) => (
        <div
          key={`beam-${n.label}`}
          className="absolute left-1/2 top-1/2 h-[2px] origin-left overflow-hidden bg-white/10"
          style={{ width: radius, transform: `rotate(${n.angle}deg)` }}
        >
          <div className="tn-beam h-full w-full" />
        </div>
      ))}

      {/* Glowing dots riding on the ring */}
      {dots.map((a) => (
        <span
          key={a}
          className="absolute left-1/2 top-1/2 -ml-1.5 -mt-1.5 h-3 w-3 rounded-full bg-[#fd8836] shadow-[0_0_14px_3px_rgba(253,136,54,0.8)]"
          style={{ transform: `rotate(${a}deg) translateX(${radius}px)` }}
        />
      ))}

      {nodes.map((n) => (
        <OrbitNode key={n.label} node={n} radius={radius} anim={anim} />
      ))}
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function TradeNetwork() {
  const groupRef = useRef(null);
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef);

  // Mouse parallax: tilt the whole 3D scene towards the cursor
  const handleMove = (e) => {
    const el = groupRef.current;
    if (!el) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${-y * 12}deg`);
    el.style.setProperty("--ry", `${x * 16}deg`);
  };

  const resetTilt = () => {
    const el = groupRef.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <section className="relative isolate overflow-hidden py-20 sm:py-24">
      {/* =====================================================
          BACKGROUND
      ===================================================== */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0952d4] via-[#0846b8] to-[#071a40]" />

        <div
          className="absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="tn-drift absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#1684e8]/40 blur-3xl" />
        <div
          className="tn-drift absolute -bottom-40 -right-40 h-[520px] w-[520px] rounded-full bg-[#fd8836]/20 blur-3xl"
          style={{ animationDelay: "-6s" }}
        />

        {/* Slow rotating outline rings (from the original design) */}
        <div className="tn-slow absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full border border-dashed border-white/10" />
        <div
          className="tn-slow absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full border border-dashed border-white/10"
          style={{ animationDirection: "reverse" }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =====================================================
            HEADING
        ===================================================== */}
        <div className="tn-fade mx-auto max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#fd8836] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#fd8836]" />
            </span>

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              One Network. Endless Opportunities.
            </span>
          </div>

          <h2 className="text-4xl font-black tracking-[-0.03em] text-white sm:text-5xl lg:text-6xl">
            India's Largest
            <br />
            <span className="bg-gradient-to-r from-[#fd8836] via-[#ffb37a] to-[#fd8836] bg-[length:200%_auto] bg-clip-text text-transparent tn-text-shine">
              B2B &amp; B2C Trade Network
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Connecting businesses, products and opportunities across India and
            global markets.
          </p>
        </div>

        {/* =====================================================
            3D NETWORK VISUAL
        ===================================================== */}
        <div
          onMouseMove={handleMove}
          onMouseLeave={resetTilt}
          className="relative mx-auto mt-6 h-[300px] max-w-5xl [perspective:1400px] sm:mt-8 sm:h-[400px] lg:h-[450px]"
        >
          {/* Moving 3D grid floor */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-x-[30%] bottom-[-8%] h-[55%] [perspective:600px]"
          >
            <div
              className="tn-grid absolute inset-0 origin-bottom [mask-image:linear-gradient(to_top,black_10%,transparent_85%)] [transform:rotateX(68deg)]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.12) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          {/* Scaler keeps the scene the same shape on every screen */}
          <div className="absolute left-1/2 top-1/2 -ml-[280px] -mt-[280px] h-[560px] w-[560px] scale-[0.55] [transform-style:preserve-3d] sm:scale-[0.8] lg:scale-[0.9]">
            {/* Parallax group (follows the mouse) */}
            <div
              ref={groupRef}
              className="relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d]"
              style={{
                transform: "rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg))",
              }}
            >
              {/* Tilted orbit plane */}
              <div
                className="absolute inset-0 [transform-style:preserve-3d]"
                style={{ transform: `rotateX(${TILT}deg)` }}
              >
                <Orbit
                  radius={95}
                  duration={18}
                  dashed
                  dots={[30, 210]}
                  reverse
                />
                <Orbit
                  radius={170}
                  duration={34}
                  nodes={innerNodes}
                  dots={[135, 315]}
                  reverse
                />
                <Orbit
                  radius={260}
                  duration={48}
                  nodes={outerNodes}
                  dots={[45, 160, 300]}
                />
              </div>

              {/* Centre globe */}
              <div className="absolute left-1/2 top-1/2 -ml-[72px] -mt-[72px] h-36 w-36">
                <div className="tn-float relative h-full w-full">
                  {/* Rotating colour halo */}
                  <div className="tn-halo absolute -inset-6 rounded-full bg-[conic-gradient(from_0deg,transparent,#fd8836,transparent_40%,#1684e8,transparent_75%)] opacity-70 blur-md" />

                  {/* Pulse waves */}
                  <span className="tn-pulse absolute inset-0 rounded-full border-2 border-white/50" />
                  <span
                    className="tn-pulse absolute inset-0 rounded-full border-2 border-[#fd8836]/60"
                    style={{ animationDelay: "1.2s" }}
                  />

                  {/* Sphere */}
                  <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_30%_25%,#ffffff,#e3eeff_40%,#a9cbff_75%,#5b8fe8)] shadow-[0_30px_60px_-10px_rgba(7,26,64,0.85),inset_-14px_-18px_30px_rgba(9,82,212,0.35)]">
                    <Globe2 size={42} className="tn-globe text-[#0952d4]" />
                    <span className="mt-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#0b1f3a]">
                      Vyapaar
                    </span>
                    {/* Glossy highlight */}
                    <span className="pointer-events-none absolute left-5 top-4 h-8 w-14 -rotate-[25deg] rounded-full bg-white/70 blur-md" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================
            STATS — 3D tilt cards with count-up
        ===================================================== */}
        <div
          ref={statsRef}
          className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6"
        >
          {networkStats.map((stat, index) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.label}
                className="tn-fade group [perspective:800px]"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="relative h-full overflow-hidden rounded-2xl border border-white/15 bg-white/[0.08] px-4 py-6 text-center backdrop-blur-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:border-white/30 group-hover:bg-white/[0.14] group-hover:shadow-[0_25px_50px_-20px_rgba(7,26,64,0.9)] group-hover:[transform:translateY(-6px)_rotateX(10deg)]">
                  {/* Top highlight */}
                  <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/60 to-transparent" />

                  <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#fd8836] to-[#fd641c] text-white shadow-[0_10px_20px_-8px_rgba(253,136,54,0.9)] transition-transform duration-500 group-hover:-translate-y-1 group-hover:rotate-[-8deg] group-hover:scale-110">
                    <Icon size={20} />
                  </div>

                  <p className="mt-4 text-2xl font-black tracking-tight text-white">
                    <CountUp value={stat.value} start={statsInView} />
                  </p>

                  <p className="mt-1 text-[11px] font-medium text-white/60">
                    {stat.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* =====================================================
            CTA
        ===================================================== */}
        <div className="tn-fade relative mt-10 overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-r from-white/[0.14] to-white/[0.04] px-6 py-6 backdrop-blur-md sm:px-8">
          {/* Light sweep */}
          <span
            aria-hidden
            className="tn-shine pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/15 to-transparent"
          />

          <div className="relative flex flex-col items-center justify-between gap-5 text-center sm:flex-row sm:text-left">
            <div>
              <p className="text-xl font-extrabold tracking-tight text-white">
                Ready to grow your business?
              </p>

              <p className="mt-1 text-sm text-white/65">
                Join thousands of businesses already trading on Vyapaar Bharat.
              </p>
            </div>

            <button className="group/btn inline-flex h-12 shrink-0 items-center gap-2 rounded-full bg-[#fd8836] pl-6 pr-1.5 text-sm font-bold text-white shadow-[0_15px_30px_-12px_rgba(253,136,54,0.9)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#fd641c]">
              Join the Network
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover/btn:rotate-45">
                <ArrowUpRight size={17} />
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          ANIMATIONS
      ===================================================== */}
      <style>{`
        @keyframes tnSpin    { to { transform: rotateZ(360deg); } }
        @keyframes tnCounter {
          from { transform: rotateZ(0deg)    rotateX(-${TILT}deg); }
          to   { transform: rotateZ(-360deg) rotateX(-${TILT}deg); }
        }
        @keyframes tnBeam    { from { background-position: -40% 0; } to { background-position: 140% 0; } }
        @keyframes tnFloat   { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes tnHalo    { to { transform: rotate(360deg); } }
        @keyframes tnPulse   { 0% { transform: scale(1); opacity: .7; } 100% { transform: scale(1.9); opacity: 0; } }
        @keyframes tnGlobe   { 0%,100% { transform: rotateY(0deg); } 50% { transform: rotateY(180deg); } }
        @keyframes tnGrid    { from { background-position: 0 0; } to { background-position: 0 48px; } }
        @keyframes tnShine   { 0% { left: -35%; } 60%,100% { left: 120%; } }
        @keyframes tnDrift   { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,30px) scale(1.08); } }
        @keyframes tnTextShine { to { background-position: 200% center; } }
        @keyframes tnFadeUp  { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        .tn-spin    { animation: tnSpin 40s linear infinite; }
        .tn-counter { animation: tnCounter 40s linear infinite; }
        .tn-beam    {
          background: linear-gradient(90deg, transparent, rgba(253,136,54,0.95), transparent);
          background-size: 40% 100%;
          background-repeat: no-repeat;
          animation: tnBeam 2.6s linear infinite;
        }
        .tn-float   { animation: tnFloat 5s ease-in-out infinite; }
        .tn-halo    { animation: tnHalo 8s linear infinite; }
        .tn-pulse   { animation: tnPulse 2.4s ease-out infinite; }
        .tn-globe   { animation: tnGlobe 8s ease-in-out infinite; }
        .tn-grid    { animation: tnGrid 2.5s linear infinite; }
        .tn-shine   { animation: tnShine 5s ease-in-out infinite; }
        .tn-drift   { animation: tnDrift 14s ease-in-out infinite; }
        .tn-slow    { animation: tnHalo 90s linear infinite; }
        .tn-text-shine { animation: tnTextShine 4s linear infinite; }
        .tn-fade    { animation: tnFadeUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both; }

        @media (prefers-reduced-motion: reduce) {
          .tn-spin, .tn-beam, .tn-float, .tn-halo, .tn-pulse, .tn-globe,
          .tn-grid, .tn-shine, .tn-drift, .tn-slow, .tn-text-shine, .tn-fade {
            animation: none !important;
          }
          .tn-counter { animation: none !important; transform: rotateX(-${TILT}deg); }
        }
      `}</style>
    </section>
  );
}

export default TradeNetwork;
