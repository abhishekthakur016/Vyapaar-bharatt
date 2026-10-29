import { useState } from "react";
import {
  Star,
  Quote,
  X,
  Search,
  Heart,
  Eye,
  ChevronDown,
  MoreHorizontal,
  BadgeCheck,
  MessageSquareQuote,
} from "lucide-react";

import transportImg from "../assets/transport.avif";
import tyreImg from "../assets/tyre.avif";

/* =========================================================
   STYLE TOKENS — website colours (blue #0952d4 / #1684e8,
   orange #fd8836 / #fd641c, navy #071a40 / #0b1f3a)
========================================================= */

const GLASS =
  "relative overflow-hidden rounded-[22px] border border-white/[0.12] bg-white/[0.06] shadow-[0_20px_50px_-25px_rgba(0,0,0,0.85)] backdrop-blur-xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.09]";

const CHIP =
  "rounded-full bg-[#fd8836]/15 px-2.5 py-0.5 text-[10px] font-semibold text-[#ffb37a] ring-1 ring-inset ring-[#fd8836]/30";

function Stars({ size = 13, className = "" }) {
  return (
    <div className={`flex gap-0.5 ${className}`}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          fill="currentColor"
          className="text-[#fd8836]"
        />
      ))}
    </div>
  );
}

function Avatar({ initials, size = "h-9 w-9 text-xs", tone = "blue" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full font-black text-white ring-2 ring-white/20 ${size} ${
        tone === "orange"
          ? "bg-gradient-to-br from-[#fd8836] to-[#fd641c]"
          : "bg-gradient-to-br from-[#1684e8] to-[#0952d4]"
      }`}
    >
      {initials}
    </div>
  );
}

// Wrapper: staggered entrance + optional gentle float
function Tile({ children, index, float = false, className = "" }) {
  return (
    <div
      className={`t-fade mb-4 break-inside-avoid ${className}`}
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        className={float ? "t-float" : ""}
        style={float ? { animationDelay: `${-index * 0.9}s` } : undefined}
      >
        {children}
      </div>
    </div>
  );
}

/* =========================================================
   SECTION
========================================================= */

function PostRequirementCTA() {
  const [feedback, setFeedback] = useState(100);

  return (
    <section className="relative isolate overflow-hidden py-16 sm:py-20">
      {/* Background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#071a40]" />
        <div className="t-drift absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-[#0952d4]/60 blur-3xl" />
        <div
          className="t-drift absolute -bottom-48 -right-40 h-[560px] w-[560px] rounded-full bg-[#fd8836]/30 blur-3xl"
          style={{ animationDelay: "-7s" }}
        />
        <div className="absolute left-1/2 top-1/3 h-72 w-72 -translate-x-1/2 rounded-full bg-[#1684e8]/20 blur-3xl" />
        <div
          className="absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="t-fade mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-white backdrop-blur-md">
            <MessageSquareQuote size={14} className="text-[#fd8836]" />
            Testimonials
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl">
            Loved by{" "}
            <span className="bg-gradient-to-r from-[#fd8836] to-[#ffb37a] bg-clip-text text-transparent">
              buyers &amp; suppliers
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-white/65 sm:text-base">
            Real businesses sourcing, selling and growing on Vyapaar Bharat.
          </p>
        </div>

        {/* Collage */}
        <div className="mt-10 columns-1 gap-4 sm:columns-2 lg:columns-4">
          {/* 1 — Tall card with photo */}
          <Tile index={0} float>
            <div className={GLASS}>
              <button
                type="button"
                aria-label="Close"
                className="absolute right-3 top-3 z-10 text-white/50 transition hover:text-white"
              >
                <X size={16} />
              </button>
              <div className="px-5 pb-5 pt-6 text-center">
                <Stars className="justify-center" />
                <p className="mt-3 text-lg font-extrabold leading-snug text-white">
                  Highly satisfied with our bulk order, thank you!
                </p>
                <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                  <span className={CHIP}>Fast delivery</span>
                  <span className={CHIP}>Verified seller</span>
                  <span className={CHIP}>Best price</span>
                </div>
                <p className="mt-3 text-xs text-white/50">
                  - @SharmaPackaging -
                </p>
              </div>
              <div className="relative aspect-[4/3]">
                <img
                  src={transportImg}
                  alt="Bulk order dispatched by truck"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071a40]/60 to-transparent" />
              </div>
            </div>
          </Tile>

          {/* 2 — Wide review with avatars */}
          <Tile index={1}>
            <div className={`${GLASS} p-5`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <Avatar initials="RM" size="h-7 w-7 text-[10px]" />
                    <Avatar
                      initials="NK"
                      size="h-7 w-7 text-[10px]"
                      tone="orange"
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">
                      Rajiv &amp; Neha
                    </p>
                    <p className="text-[10px] text-white/45">2 days ago</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-white">
                  <Star
                    size={12}
                    fill="currentColor"
                    className="text-[#fd8836]"
                  />
                  5.0/5.0
                </span>
              </div>
              <p className="mt-3 text-sm leading-6 text-white/80">
                Posted one requirement and received 6 quotes from verified steel
                suppliers within a day. Sourcing has never been this simple.
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#ffb37a] transition hover:text-[#fd8836]"
              >
                <ChevronDown size={13} />
                Read more
              </button>
            </div>
          </Tile>

          {/* 3 — Featured big review (blue tint) */}
          <Tile index={2} float>
            <div
              className={`${GLASS} bg-gradient-to-br from-[#0952d4]/45 via-white/[0.05] to-white/[0.03] p-6`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Avatar initials="AV" size="h-12 w-12 text-sm" />
                  <div>
                    <p className="font-extrabold text-white">Amit Verma</p>
                    <p className="text-xs text-white/55">
                      Export Manager, Verma Industries
                    </p>
                  </div>
                </div>
                <MoreHorizontal size={18} className="text-white/50" />
              </div>
              <div className="mt-4 inline-flex rounded-full bg-[#fd8836]/15 px-2.5 py-1 ring-1 ring-inset ring-[#fd8836]/30">
                <Stars size={12} />
              </div>
              <p className="mt-4 text-2xl font-black leading-tight tracking-tight text-white">
                Quotes compared in minutes, not weeks!
              </p>
              <p className="mt-2 text-sm text-white/65">
                Superb supplier quality, impressed.
              </p>
            </div>
          </Tile>

          {/* 4 — Small quote card */}
          <Tile index={3}>
            <div className={`${GLASS} p-5`}>
              <Quote size={18} className="text-[#fd8836]" fill="currentColor" />
              <p className="mt-2 text-xs leading-5 text-white/75">
                The order arrived quickly and well packed. Tracking every step
                with the supplier made it completely stress-free.
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Stars size={10} />
                  <span className="text-[10px] text-white/45">(5.0)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-[11px] font-bold text-white">
                      Pooja Nair
                    </p>
                    <p className="text-[9px] text-white/45">Retail Buyer</p>
                  </div>
                  <Avatar
                    initials="PN"
                    size="h-7 w-7 text-[10px]"
                    tone="orange"
                  />
                </div>
              </div>
            </div>
          </Tile>

          {/* 5 — Rating widget */}
          <Tile index={4} className="hidden sm:block">
            <div className={`${GLASS} px-5 py-4 text-center`}>
              <span className="absolute right-3 top-3 rounded-full bg-[#fd8836] px-2 py-0.5 text-[10px] font-black text-white shadow-[0_6px_14px_-6px_rgba(253,136,54,0.9)]">
                99+
              </span>
              <p className="text-lg font-extrabold text-white">
                Supplier Rating
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-white/65">
                <Star
                  size={12}
                  fill="currentColor"
                  className="text-[#fd8836]"
                />
                (4.8/5) from 12,000+ businesses
              </p>
            </div>
          </Tile>

          {/* 6 — Card with photo on the side */}
          <Tile index={5} float>
            <div className={`${GLASS} flex`}>
              <div className="flex-1 p-5">
                <p className="text-[11px] text-white/50">12 Oct 2026</p>
                <p className="mt-2 text-2xl font-black leading-tight tracking-tight text-white">
                  Reliable suppliers
                </p>
                <p className="mt-2 text-xs leading-5 text-white/65">
                  Found a trusted tyre supplier for our whole fleet.
                </p>
                <Stars className="mt-3" size={12} />
              </div>
              <div className="relative w-[42%] shrink-0">
                <img
                  src={tyreImg}
                  alt="Tyres from a verified supplier"
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </Tile>

          {/* 7 — Search pill + review */}
          <Tile index={6}>
            <div className="mb-3 hidden items-center gap-2 rounded-full border border-white/15 bg-white/[0.08] py-1.5 pl-4 pr-1.5 backdrop-blur-xl sm:flex">
              <span className="flex-1 text-sm text-white/80">
                Buyer Reviews
              </span>
              <X size={15} className="text-white/45" />
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fd8836] text-white">
                <Search size={15} />
              </span>
            </div>

            <div
              className={`${GLASS} bg-gradient-to-br from-[#1684e8]/25 to-white/[0.04] p-5`}
            >
              <p className="text-right text-[11px] text-white/50">
                @MehtaEngineering · 12h
              </p>
              <p className="mt-2 text-2xl font-black tracking-tight text-white">
                Great prices
              </p>
              <p className="mt-2 text-xs leading-5 text-white/70">
                We now source CNC parts directly from manufacturers. Better
                pricing, clear MOQ and faster responses than any middleman.
              </p>
              <div className="mt-4 flex items-center justify-end gap-1.5">
                <Stars size={12} />
                <span className="text-[10px] text-white/50">(5.0)</span>
              </div>
              <p className="mt-0.5 text-right text-[10px] text-white/40">
                All Buyer Score
              </p>
            </div>
          </Tile>

          {/* 8 — Profile highlight */}
          <Tile index={7} float>
            <div
              className={`${GLASS} bg-gradient-to-br from-[#1684e8]/35 via-[#0952d4]/20 to-white/[0.03] px-6 pb-6 pt-8 text-center`}
            >
              <span className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#fd8836]/20 text-[#ffb37a] ring-1 ring-[#fd8836]/40">
                <BadgeCheck size={14} />
              </span>
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-[#fd8836] to-[#fd641c] text-2xl font-black text-white ring-4 ring-white/15">
                AS
              </div>
              <p className="mt-4 text-xl font-extrabold text-white">
                Amazing Platform!
              </p>
              <p className="mx-auto mt-1 max-w-[220px] text-xs leading-5 text-white/70">
                For B2B sourcing and selling, Vyapaar Bharat is top-notch.
              </p>
              <p className="mt-1 text-[11px] font-semibold text-white/50">
                Ananya Sharma · Sharma Packaging
              </p>
              <div className="mt-3 flex items-center justify-center gap-4 text-sm font-bold text-white">
                <span className="inline-flex items-center gap-1">
                  <Heart
                    size={14}
                    fill="currentColor"
                    className="text-[#fd8836]"
                  />
                  1,914
                </span>
                <span className="inline-flex items-center gap-1">
                  <Eye size={14} />
                  21.7K
                </span>
              </div>
            </div>
          </Tile>

          {/* 9 — Wide review with tag */}
          <Tile index={8}>
            <div className={`${GLASS} p-5`}>
              <Stars size={15} />
              <p className="mt-3 text-sm leading-6 text-white/85">
                As a supplier, we get genuine buyer requirements every week. Our
                enquiries doubled in just three months on the platform.
              </p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <span className={CHIP}>Great leads</span>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-xs font-bold text-white">Kavita Rao</p>
                    <p className="text-[10px] text-white/45">Sales Director</p>
                  </div>
                  <Avatar initials="KR" size="h-9 w-9 text-xs" />
                </div>
              </div>
            </div>
          </Tile>

          {/* 10 — Feedback slider widget */}
          <Tile index={9} className="hidden sm:block">
            <div className={`${GLASS} px-5 py-4`}>
              <div className="flex items-center justify-between">
                <p className="text-base font-extrabold text-white">
                  Your Feedback
                </p>
                <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-black tabular-nums text-[#0b1f3a]">
                  {feedback}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={feedback}
                onChange={(e) => setFeedback(Number(e.target.value))}
                aria-label="Your feedback score"
                className="t-range mt-3 w-full"
                style={{ "--val": `${feedback}%` }}
              />
            </div>
          </Tile>
        </div>
      </div>

      <style>{`
        @keyframes tFadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes tFloat  { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes tDrift  { 0%,100% { transform: translate(0,0) scale(1); } 50% { transform: translate(40px,30px) scale(1.08); } }
        .t-fade  { animation: tFadeUp 700ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .t-float { animation: tFloat 6s ease-in-out infinite; }
        .t-drift { animation: tDrift 16s ease-in-out infinite; }

        .t-range {
          -webkit-appearance: none; appearance: none; height: 6px; border-radius: 9999px;
          background: linear-gradient(90deg, #fd8836 var(--val), rgba(255,255,255,0.15) var(--val));
          outline: none; cursor: pointer;
        }
        .t-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none; width: 16px; height: 16px; border-radius: 9999px;
          background: #fd8836; border: 3px solid #fff; box-shadow: 0 0 0 4px rgba(253,136,54,0.25);
        }
        .t-range::-moz-range-thumb {
          width: 12px; height: 12px; border-radius: 9999px; background: #fd8836; border: 3px solid #fff;
        }

        @media (prefers-reduced-motion: reduce) {
          .t-fade, .t-float, .t-drift { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default PostRequirementCTA;
