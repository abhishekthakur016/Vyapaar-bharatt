import {
  Search,
  MessageSquareQuote,
  Scale,
  Handshake,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Search & Discover",
    description: "Find products, suppliers or buyer requirements in seconds.",
    icon: Search,
  },
  {
    number: "02",
    title: "Receive Best Quotes",
    description: "Post your requirement and get competitive quotations.",
    icon: MessageSquareQuote,
  },
  {
    number: "03",
    title: "Compare & Negotiate",
    description: "Check price, MOQ, quality and delivery side by side.",
    icon: Scale,
  },
  {
    number: "04",
    title: "Trade & Grow",
    description: "Close the deal with the right supplier and scale up.",
    icon: Handshake,
  },
];

function HowItWorks() {
  return (
    <section className="relative overflow-hidden bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#fd8836]">
              Simple B2B &amp; B2C Process
            </p>

            <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#0b1f3a] sm:text-4xl">
              How{" "}
              <span className="bg-gradient-to-r from-[#0952d4] to-[#1684e8] bg-clip-text text-transparent">
                Vyapaar Bharat
              </span>{" "}
              Works
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-6 text-slate-500">
            From discovering the right supplier to closing the deal — all in one
            connected ecosystem.
          </p>
        </div>

        {/* Steps */}
        <div className="relative mt-10">
          {/* Animated connector line (desktop) */}
          <div
            aria-hidden
            className="absolute left-[12%] right-[12%] top-[46px] hidden h-[2px] overflow-hidden rounded-full bg-slate-100 lg:block"
          >
            <div className="hiw-flow h-full w-1/4 rounded-full bg-gradient-to-r from-transparent via-[#fd8836] to-transparent" />
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="hiw-fade group relative"
                  style={{ animationDelay: `${index * 90}ms` }}
                >
                  <div className="relative h-full overflow-hidden rounded-[22px] bg-slate-50/80 p-4 ring-1 ring-inset ring-slate-900/[0.05] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_50px_-24px_rgba(9,82,212,0.4)] hover:ring-[#0952d4]/20 sm:p-5">
                    {/* Big faded number */}
                    <span className="pointer-events-none absolute -right-1 -top-3 text-6xl font-black tracking-tighter text-[#0952d4]/[0.06] transition-colors duration-500 group-hover:text-[#fd8836]/[0.12] sm:text-7xl">
                      {step.number}
                    </span>

                    {/* Icon */}
                    <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-[#0952d4] shadow-[0_8px_20px_-10px_rgba(9,82,212,0.5)] ring-1 ring-slate-900/[0.04] transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#0952d4] group-hover:to-[#1684e8] group-hover:text-white">
                      <Icon size={22} />
                    </div>

                    <p className="relative mt-4 text-[11px] font-bold uppercase tracking-[0.14em] text-[#fd8836]">
                      Step {step.number}
                    </p>

                    <h3 className="relative mt-1 text-[15px] font-extrabold leading-snug text-[#0b1f3a] sm:text-base">
                      {step.title}
                    </h3>

                    <p className="relative mt-1.5 text-xs leading-5 text-slate-500 sm:text-sm sm:leading-6">
                      {step.description}
                    </p>
                  </div>

                  {/* Arrow between cards (desktop) */}
                  {index !== steps.length - 1 && (
                    <span className="absolute -right-[19px] top-[34px] z-20 hidden h-7 w-7 items-center justify-center rounded-full bg-white text-[#fd8836] shadow-md ring-1 ring-slate-900/[0.05] lg:flex">
                      <ArrowRight size={14} />
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes hiwFlow   { from { transform: translateX(-100%); } to { transform: translateX(400%); } }
        @keyframes hiwFadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .hiw-flow { animation: hiwFlow 3.2s ease-in-out infinite; }
        .hiw-fade { animation: hiwFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .hiw-flow, .hiw-fade { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default HowItWorks;
