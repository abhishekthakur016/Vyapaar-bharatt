import {
  Search,
  ChevronDown,
  ArrowRight,
  Factory,
  Globe2,
  Truck,
  Package,
} from "lucide-react"

import heroTrade from "../assets/hero-trade.jpg"

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">

      {/* Background decoration */}
      <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-[#0952d4]/5 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-[#fd8836]/10 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">

        <div className="grid items-center gap-14 lg:grid-cols-2">

          {/* LEFT */}
          <div>

            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#0952d4]/10 bg-[#0952d4]/5 px-4 py-2">
              <span className="h-2 w-2 rounded-full bg-[#fd8836]" />

              <span className="text-xs font-bold uppercase tracking-wider text-[#0952d4]">
                India's B2B Trade Network
              </span>
            </div>

            {/* Hindi headline */}
            <h1 className="max-w-2xl text-5xl font-black leading-[1.05] tracking-tight text-[#0b1f3a] sm:text-6xl lg:text-7xl">
              व्यापार करो.
              <br />
              <span className="text-[#0952d4]">
                व्यापार बढ़ाओ.
              </span>
            </h1>

            {/* English headline */}
            <p className="mt-5 text-2xl font-bold text-[#fd8836] sm:text-3xl">
              Source Smarter. Grow Bigger.
            </p>

            {/* Description */}
            <p className="mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
              Connect with verified manufacturers, suppliers and businesses
              across India and global markets. Discover products, compare
              suppliers, request quotations and grow your business.
            </p>

            {/* Search Box */}
            <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-2 shadow-[0_15px_50px_rgba(9,82,212,0.10)]">

              <div className="flex flex-col gap-2 sm:flex-row">

                {/* Search Input */}
                <div className="flex flex-1 items-center gap-3 px-3">
                  <Search
                    size={21}
                    className="shrink-0 text-gray-400"
                  />

                  <input
                    type="text"
                    placeholder="Search products, suppliers, categories..."
                    className="w-full bg-transparent py-3 text-sm text-[#0b1f3a] outline-none placeholder:text-gray-400"
                  />
                </div>

                {/* Category */}
                <button className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 sm:min-w-[150px]">
                  All Categories
                  <ChevronDown size={16} />
                </button>

                {/* Search Button */}
                <button className="flex items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0848ba]">
                  Search
                  <ArrowRight size={17} />
                </button>

              </div>
            </div>

            {/* Suggested searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">

              <span className="font-semibold text-gray-500">
                Popular:
              </span>

              {[
                "Solar Panels",
                "CNC Machine",
                "Packaging",
                "Steel Sheets",
              ].map((item) => (
                <button
                  key={item}
                  className="rounded-full bg-gray-100 px-3 py-1.5 font-medium text-gray-600 transition hover:bg-[#0952d4]/10 hover:text-[#0952d4]"
                >
                  {item}
                </button>
              ))}

            </div>

            {/* CTA Buttons */}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">

              <button className="flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
                Post Your Requirement
                <ArrowRight size={17} />
              </button>

              <button className="flex items-center justify-center gap-2 rounded-xl border border-[#0952d4] px-6 py-3.5 text-sm font-bold text-[#0952d4] transition hover:bg-[#0952d4] hover:text-white">
                Explore Suppliers
                <Globe2 size={17} />
              </button>

            </div>

          </div>

          {/* RIGHT — TRADE VISUAL */}
          <div className="relative hidden min-h-[520px] lg:block">

            {/* Main visual circle */}
            <div className="absolute right-4 top-1/2 h-[440px] w-[440px] -translate-y-1/2 rounded-full bg-[#0952d4]/5" />

            <div className="absolute right-14 top-1/2 h-[350px] w-[350px] -translate-y-1/2 rounded-full border border-[#0952d4]/10" />

            {/* Center */}
            <div className="absolute right-[150px] top-1/2 flex h-36 w-36 -translate-y-1/2 items-center justify-center rounded-full bg-[#0952d4] shadow-2xl">

              <div className="text-center text-white">
                <Globe2 size={42} className="mx-auto mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">
                  Trade
                </p>
              </div>

            </div>

            {/* Factory */}
            <div className="absolute right-[330px] top-20 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
              <Factory size={30} className="text-[#0952d4]" />

              <p className="mt-2 text-sm font-bold text-[#0b1f3a]">
                Manufacturers
              </p>

              <p className="text-xs text-gray-500">
                Source Direct
              </p>
            </div>

            {/* Package */}
            <div className="absolute right-0 top-36 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
              <Package size={30} className="text-[#fd8836]" />

              <p className="mt-2 text-sm font-bold text-[#0b1f3a]">
                Products
              </p>

              <p className="text-xs text-gray-500">
                Millions Listed
              </p>
            </div>

            {/* Truck */}
            <div className="absolute bottom-28 right-[320px] rounded-2xl border border-gray-200 bg-white p-5 shadow-xl">
              <Truck size={30} className="text-[#0952d4]" />

              <p className="mt-2 text-sm font-bold text-[#0b1f3a]">
                Logistics
              </p>

              <p className="text-xs text-gray-500">
                Move Business
              </p>
            </div>

            {/* Global connection */}
            <div className="absolute bottom-12 right-8 rounded-2xl bg-[#fd8836] px-6 py-4 shadow-xl">

              <p className="text-xs font-semibold text-white/80">
                CONNECTING
              </p>

              <p className="text-lg font-black text-white">
                India → Global
              </p>

            </div>

            {/* Connection dots */}
            <div className="absolute right-[135px] top-[105px] h-3 w-3 animate-pulse rounded-full bg-[#fd8836]" />

            <div className="absolute right-[390px] top-[260px] h-3 w-3 animate-pulse rounded-full bg-[#0952d4]" />

            <div className="absolute right-[270px] bottom-[110px] h-3 w-3 animate-pulse rounded-full bg-[#fd8836]" />

          </div>

        </div>

      </div>
    </section>
  )
}

export default Hero