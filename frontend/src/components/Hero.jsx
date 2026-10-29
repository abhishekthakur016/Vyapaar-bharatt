import { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import {
  Search,
  ChevronDown,
  ArrowRight,
  Plus,
  Users,
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  BadgeCheck,
  ShieldCheck,
} from "lucide-react";

import arRoadline from "../assets/ar roadline.png";
import quickTransport from "../assets/quick transport and solution.png";
import ramanTempo from "../assets/raman tempo.png";
import saiTyreHouse from "../assets/sai tyre hosue.png";
import sonuMotorGarage from "../assets/sonu motor garage.png";
import northIndiaHeavyTransport from "../assets/north india heavy transport.png";

/* =========================================================
   DATA
========================================================= */

const SLIDES = [
  { image: arRoadline, title: "AR Roadline", tag: "Transport" },
  {
    image: quickTransport,
    title: "Quick Transport and Solution",
    tag: "Logistics",
  },
  { image: ramanTempo, title: "Raman Tempo Transport", tag: "Transport" },
  { image: saiTyreHouse, title: "Sai Tyre House", tag: "Auto Parts" },
  { image: sonuMotorGarage, title: "Sonu Motor Garage", tag: "Services" },
  {
    image: northIndiaHeavyTransport,
    title: "North India Heavy Transport",
    tag: "Heavy Haulage",
  },
];

const POPULAR = ["Solar Panels", "CNC Machine", "Packaging", "Steel Sheets"];

const AUTOPLAY_MS = 5000;

/* =========================================================
   THREE.JS — 3D network globe behind the banners
========================================================= */

function NetworkGlobe() {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const reduceMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });
    } catch {
      return; // WebGL not available — the hero still works without the globe
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 9);

    const globe = new THREE.Group();
    globe.rotation.x = 0.35;
    scene.add(globe);

    const R = 3.2;
    const disposables = [];

    // Dot sphere (Fibonacci distribution)
    const COUNT = 2200;
    const dotPositions = new Float32Array(COUNT * 3);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const t = golden * i;
      dotPositions[i * 3] = Math.cos(t) * r * R;
      dotPositions[i * 3 + 1] = y * R;
      dotPositions[i * 3 + 2] = Math.sin(t) * r * R;
    }
    const dotGeo = new THREE.BufferGeometry();
    dotGeo.setAttribute("position", new THREE.BufferAttribute(dotPositions, 3));
    const dotMat = new THREE.PointsMaterial({
      color: 0x0952d4,
      size: 0.035,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    });
    globe.add(new THREE.Points(dotGeo, dotMat));
    disposables.push(dotGeo, dotMat);

    // Random point on the sphere
    const randomOnSphere = (radius) => {
      const u = Math.random() * 2 - 1;
      const t = Math.random() * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      return new THREE.Vector3(
        s * Math.cos(t),
        u,
        s * Math.sin(t),
      ).multiplyScalar(radius);
    };

    // Orange "city" hubs
    const HUBS = 28;
    const hubPoints = Array.from({ length: HUBS }, () =>
      randomOnSphere(R * 1.002),
    );
    const hubGeo = new THREE.BufferGeometry().setFromPoints(hubPoints);
    const hubMat = new THREE.PointsMaterial({
      color: 0xfd8836,
      size: 0.12,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });
    globe.add(new THREE.Points(hubGeo, hubMat));
    disposables.push(hubGeo, hubMat);

    // Trade arcs between hubs (they draw themselves in a loop)
    const arcs = [];
    const ARC_SEGMENTS = 64;
    for (let i = 0; i < 16; i++) {
      const a = hubPoints[Math.floor(Math.random() * HUBS)];
      let b = hubPoints[Math.floor(Math.random() * HUBS)];
      if (a === b) b = hubPoints[(hubPoints.indexOf(a) + 5) % HUBS];
      const mid = a
        .clone()
        .add(b)
        .normalize()
        .multiplyScalar(R * (1.25 + a.distanceTo(b) / (R * 4)));
      const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
      const geo = new THREE.BufferGeometry().setFromPoints(
        curve.getPoints(ARC_SEGMENTS),
      );
      const mat = new THREE.LineBasicMaterial({
        color: i % 3 === 0 ? 0x1684e8 : 0xfd8836,
        transparent: true,
        opacity: 0.8,
      });
      const line = new THREE.Line(geo, mat);
      geo.setDrawRange(0, 0);
      globe.add(line);
      arcs.push({
        geo,
        offset: Math.random(),
        speed: 0.12 + Math.random() * 0.12,
      });
      disposables.push(geo, mat);
    }

    // Thin orbit ring
    const ringGeo = new THREE.TorusGeometry(R * 1.32, 0.008, 8, 160);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x1684e8,
      transparent: true,
      opacity: 0.35,
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.3;
    scene.add(ring);
    disposables.push(ringGeo, ringMat);

    // Satellite on the ring
    const satGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xfd8836 });
    const sat = new THREE.Mesh(satGeo, satMat);
    ring.add(sat);
    disposables.push(satGeo, satMat);

    // Sizing
    const resize = () => {
      const { clientWidth: w, clientHeight: h } = wrap;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Mouse parallax
    const target = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 0.5;
      target.y = (e.clientY / window.innerHeight - 0.5) * 0.3;
    };
    window.addEventListener("mousemove", onMove, { passive: true });

    // Only animate while visible
    let visible = true;
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    const clock = new THREE.Clock();
    let raf;

    const render = () => {
      const t = clock.getElapsedTime();

      globe.rotation.y = t * 0.08 + target.x;
      globe.rotation.x += (0.35 + target.y - globe.rotation.x) * 0.05;

      sat.position.set(
        Math.cos(t * 0.6) * R * 1.32,
        Math.sin(t * 0.6) * R * 1.32,
        0,
      );

      arcs.forEach((arc) => {
        const p = (t * arc.speed + arc.offset) % 1.4; // draw, hold, restart
        const count = Math.floor(Math.min(p, 1) * (ARC_SEGMENTS + 1));
        arc.geo.setDrawRange(0, count);
      });

      renderer.render(scene, camera);
    };

    const loop = () => {
      raf = requestAnimationFrame(loop);
      if (visible) render();
    };

    if (reduceMotion) {
      arcs.forEach((arc) => arc.geo.setDrawRange(0, ARC_SEGMENTS + 1));
      renderer.render(scene, camera);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("mousemove", onMove);
      disposables.forEach((d) => d.dispose());
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute inset-0"
    >
      <canvas ref={canvasRef} className="h-full w-full" />
    </div>
  );
}

/* =========================================================
   HERO
========================================================= */

function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchStartX = useRef(null);
  const total = SLIDES.length;

  const goTo = useCallback(
    (i) => setCurrent(((i % total) + total) % total),
    [total],
  );
  const next = useCallback(() => goTo(current + 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1), [current, goTo]);

  // Autoplay (resets after every manual change)
  useEffect(() => {
    if (paused) return;
    const t = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(t);
  }, [current, paused, next]);

  // Preload banners
  useEffect(() => {
    SLIDES.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    touchStartX.current = null;
  };
  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") next();
    if (e.key === "ArrowLeft") prev();
  };

  // Position of each slide relative to the active one (-2 … 2 visible)
  const offsetOf = (i) => {
    let d = i - current;
    if (d > total / 2) d -= total;
    if (d < -total / 2) d += total;
    return d;
  };

  return (
    <section className="relative isolate overflow-hidden bg-[#f5f8fd]">
      {/* Minimal background: one soft light + faint grid */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-20%] h-[700px] w-[1100px] -translate-x-1/2 rounded-full bg-white blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.5] [mask-image:linear-gradient(to_bottom,black,transparent_70%)]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(9,82,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(9,82,212,0.05) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1440px] px-4 pb-12 pt-10 sm:px-8 sm:pt-14 lg:px-10 lg:pb-16">
        {/* =====================================================
            CONTENT ROW
        ===================================================== */}
        <div className="grid items-end gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
          {/* Left — headline */}
          <div className="h-fade">
            <div className="inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 shadow-[0_6px_20px_-10px_rgba(9,82,212,0.4)] ring-1 ring-slate-900/[0.05]">
              <span className="rounded-full bg-[#fd8836] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Live
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0b1f3a]">
                India's B2B &amp; B2C Trade Network
              </span>
            </div>

            <h1 className="mt-5 text-[44px] font-black leading-[0.95] tracking-[-0.045em] text-[#0952d4] sm:text-[64px] lg:text-[76px] xl:text-[88px]">
              Trade Across <span className="text-[#fd641c]">India.</span>
            </h1>

            <p className="mt-4 text-lg font-extrabold tracking-tight text-[#0b1f3a] sm:text-2xl">
              Source Smarter.{" "}
              <span className="text-[#0952d4]">Grow Bigger.</span>
            </p>
          </div>

          {/* Right — search & actions */}
          <div className="h-fade" style={{ animationDelay: "120ms" }}>
            <p className="max-w-md text-sm leading-relaxed text-[#53647d] sm:text-base">
              Connect with trusted suppliers, manufacturers and service
              providers across India — all in one place.
            </p>

            {/* Search */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="mt-5 rounded-2xl bg-white p-1.5 shadow-[0_18px_40px_-20px_rgba(9,82,212,0.45)] ring-1 ring-slate-900/[0.06] transition focus-within:ring-2 focus-within:ring-[#0952d4]/30 sm:rounded-full"
            >
              <div className="flex items-center">
                <label className="flex min-w-0 flex-1 items-center gap-2.5 pl-3">
                  <Search
                    size={19}
                    strokeWidth={2.2}
                    className="shrink-0 text-[#0952d4]"
                  />
                  <span className="sr-only">Search</span>
                  <input
                    type="text"
                    placeholder="Search products, suppliers..."
                    className="w-full min-w-0 bg-transparent py-3 text-sm text-[#0b1f3a] outline-none placeholder:text-[#8090a8]"
                  />
                </label>

                <button
                  type="button"
                  className="hidden items-center gap-1.5 whitespace-nowrap border-l border-slate-200 px-4 text-xs font-semibold text-[#53647d] transition hover:text-[#0952d4] md:flex"
                >
                  All Categories
                  <ChevronDown size={15} />
                </button>

                <button
                  type="submit"
                  aria-label="Search"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fd8836] text-white transition hover:bg-[#fd641c] sm:w-auto sm:gap-2 sm:rounded-full sm:px-6"
                >
                  <span className="hidden text-sm font-bold sm:block">
                    Search
                  </span>
                  <ArrowRight size={18} />
                </button>
              </div>
            </form>

            {/* Popular */}
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-xs font-bold text-[#53647d]">
                Popular:
              </span>
              {POPULAR.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold text-[#354866] ring-1 ring-inset ring-slate-200 transition hover:bg-[#0952d4] hover:text-white hover:ring-[#0952d4]"
                >
                  {item}
                </button>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-5 flex flex-col gap-2.5 sm:flex-row">
              <button
                type="button"
                className="group/btn inline-flex h-12 items-center justify-between gap-2 rounded-full bg-[#fd641c] pl-5 pr-1.5 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgba(253,100,28,0.9)] transition hover:-translate-y-0.5 hover:bg-[#ed5815] sm:justify-start"
              >
                <span className="inline-flex items-center gap-2">
                  <Plus size={17} />
                  Post Your Requirement
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover/btn:translate-x-0.5">
                  <ArrowRight size={16} />
                </span>
              </button>

              <button
                type="button"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-white px-5 text-sm font-bold text-[#0b1f3a] ring-1 ring-inset ring-slate-200 transition hover:bg-[#0952d4] hover:text-white hover:ring-[#0952d4]"
              >
                <Users size={17} />
                Explore Suppliers
              </button>
            </div>
          </div>
        </div>

        {/* =====================================================
            3D BANNER STAGE
        ===================================================== */}
        <div
          className="h-fade relative mt-10 sm:mt-12"
          style={{ animationDelay: "220ms" }}
        >
          {/* Three.js globe behind the banners */}
          <div className="absolute inset-x-[-10%] -bottom-[18%] -top-[12%] -z-10 sm:inset-x-0">
            <NetworkGlobe />
          </div>

          {/* Floating chips */}
          <div className="h-float absolute left-0 top-[6%] z-30 hidden items-center gap-2 rounded-2xl bg-white px-3.5 py-2.5 shadow-[0_18px_40px_-18px_rgba(9,82,212,0.5)] ring-1 ring-slate-900/[0.05] lg:flex">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0952d4] text-white">
              <ShieldCheck size={16} />
            </span>
            <div>
              <p className="text-xs font-extrabold text-[#0b1f3a]">
                Verified Businesses
              </p>
              <p className="text-[10px] text-[#7b899c]">Pan India network</p>
            </div>
          </div>

          <div
            className="h-float absolute right-0 top-[60%] z-30 hidden items-center gap-2 rounded-full bg-white px-3.5 py-2 shadow-[0_18px_40px_-18px_rgba(9,82,212,0.5)] ring-1 ring-slate-900/[0.05] lg:flex"
            style={{ animationDelay: "-2s" }}
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green-500" />
            </span>
            <span className="text-[11px] font-bold text-[#0b1f3a]">
              Business Network Active
            </span>
          </div>

          {/* Coverflow */}
          <div
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured businesses"
            tabIndex={0}
            onKeyDown={onKeyDown}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="relative mx-auto aspect-[16/9] w-[88%] max-w-[900px] touch-pan-y outline-none [perspective:1600px] sm:w-[72%] lg:w-[62%]"
          >
            <div className="absolute inset-0 [transform-style:preserve-3d]">
              {SLIDES.map((slide, i) => {
                const d = offsetOf(i);
                const abs = Math.abs(d);
                const hidden = abs > 2;
                const active = d === 0;

                return (
                  <button
                    key={slide.title}
                    type="button"
                    tabIndex={active ? -1 : 0}
                    aria-hidden={!active}
                    aria-label={active ? slide.title : `Show ${slide.title}`}
                    onClick={() => !active && goTo(i)}
                    className={`absolute inset-0 overflow-hidden rounded-[22px] bg-[#0b1f3a] text-left transition-[transform,opacity,box-shadow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] sm:rounded-[28px] ${
                      active
                        ? "cursor-default shadow-[0_40px_80px_-30px_rgba(7,26,64,0.75)] ring-4 ring-white"
                        : "cursor-pointer shadow-[0_25px_50px_-25px_rgba(7,26,64,0.6)]"
                    }`}
                    style={{
                      transform: `translateX(${d * 62}%) translateZ(${-abs * 240}px) rotateY(${-d * 34}deg)`,
                      opacity: hidden ? 0 : abs === 2 ? 0.55 : 1,
                      zIndex: 10 - abs,
                      pointerEvents: hidden ? "none" : "auto",
                    }}
                  >
                    {/* Blurred fill so banners of any ratio look clean */}
                    <img
                      src={slide.image}
                      alt=""
                      aria-hidden
                      className="absolute inset-0 h-full w-full scale-125 object-cover opacity-60 blur-2xl"
                    />
                    {/* Full banner — never cropped */}
                    <img
                      src={slide.image}
                      alt={slide.title}
                      draggable={false}
                      loading={i === 0 ? "eager" : "lazy"}
                      className="relative h-full w-full select-none object-contain"
                    />
                    {/* Dim side banners */}
                    <span
                      className={`absolute inset-0 bg-[#0952d4] transition-opacity duration-700 ${
                        active ? "opacity-0" : "opacity-40"
                      }`}
                    />
                  </button>
                );
              })}
            </div>

            {/* Floor shadow for depth */}
            <div className="pointer-events-none absolute -bottom-8 left-[8%] right-[8%] h-10 rounded-[100%] bg-[#0952d4]/25 blur-2xl" />

            {/* Arrows */}
            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="absolute -left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0b1f3a] shadow-lg ring-1 ring-slate-900/[0.06] transition hover:scale-105 hover:text-[#0952d4] sm:-left-6 sm:h-12 sm:w-12"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="absolute -right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0b1f3a] shadow-lg ring-1 ring-slate-900/[0.06] transition hover:scale-105 hover:text-[#0952d4] sm:-right-6 sm:h-12 sm:w-12"
            >
              <ChevronRight size={22} />
            </button>
          </div>

          {/* Caption + controls */}
          <div className="mx-auto mt-8 flex w-[88%] max-w-[900px] flex-col items-center justify-between gap-3 sm:w-[72%] sm:flex-row lg:w-[62%]">
            <div className="flex min-w-0 items-center gap-2">
              <BadgeCheck
                size={16}
                className="shrink-0 fill-[#0952d4] text-white"
              />
              <span className="rounded-md bg-[#fd8836] px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                {SLIDES[current].tag}
              </span>
              <span className="truncate text-sm font-bold text-[#0b1f3a]">
                {SLIDES[current].title}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-bold tabular-nums text-[#7b899c]">
                {String(current + 1).padStart(2, "0")} /{" "}
                {String(total).padStart(2, "0")}
              </span>

              <div className="flex items-center gap-1.5">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.title}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    aria-current={i === current}
                    className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${
                      i === current
                        ? "w-8 bg-[#fd8836]/25"
                        : "w-1.5 bg-[#c7d3df] hover:bg-[#0952d4]"
                    }`}
                  >
                    {i === current && (
                      <span
                        key={`${current}-${paused}`}
                        className="absolute inset-y-0 left-0 rounded-full bg-[#fd8836]"
                        style={{
                          width: paused ? "100%" : undefined,
                          animation: paused
                            ? "none"
                            : `heroProgress ${AUTOPLAY_MS}ms linear forwards`,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Play slideshow" : "Pause slideshow"}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#53647d] ring-1 ring-slate-200 transition hover:text-[#0952d4]"
              >
                {paused ? <Play size={12} /> : <Pause size={12} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes heroProgress { from { width: 0% } to { width: 100% } }
        @keyframes hFadeUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes hFloat  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        .h-fade  { animation: hFadeUp 800ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .h-float { animation: hFloat 6s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) {
          .h-fade, .h-float { animation: none; }
          [style*="heroProgress"] { animation: none !important; width: 100% !important; }
        }
      `}</style>
    </section>
  );
}

export default Hero;
