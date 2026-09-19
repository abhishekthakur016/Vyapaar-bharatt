import {
  Globe2,
  Factory,
  Users,
  Package,
  MessageSquare,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react"

const networkStats = [
  {
    value: "5.2L+",
    label: "Verified Suppliers",
    icon: Factory,
  },
  {
    value: "2.4M+",
    label: "Product Listings",
    icon: Package,
  },
  {
    value: "180+",
    label: "Countries",
    icon: Globe2,
  },
  {
    value: "500K+",
    label: "Business Enquiries",
    icon: MessageSquare,
  },
  {
    value: "₹840Cr+",
    label: "Annual Trade Value",
    icon: TrendingUp,
  },
  {
    value: "98%",
    label: "Business Satisfaction",
    icon: Users,
  },
]

function TradeNetwork() {
  return (
    <section className="relative overflow-hidden bg-[#0952d4] py-20 sm:py-24">

      {/* Background decoration */}
      <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full border border-white/10" />

      <div className="absolute -right-40 -bottom-40 h-[500px] w-[500px] rounded-full border border-white/10" />

      <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2">

            <span className="h-2 w-2 animate-pulse rounded-full bg-[#fd8836]" />

            <span className="text-xs font-bold uppercase tracking-[0.18em] text-white">
              One Network. Endless Opportunities.
            </span>

          </div>

          <h2 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
            India's Largest
            <br />
            <span className="text-[#fd8836]">
              B2B Trade Network
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            Connecting businesses, products and opportunities across
            India and global markets.
          </p>

        </div>

        {/* Network Visual */}
        <div className="relative mx-auto mt-14 max-w-5xl">

          <div className="relative flex min-h-[320px] items-center justify-center">

            {/* Outer ring */}
            <div className="absolute h-[280px] w-[280px] rounded-full border border-white/10 sm:h-[350px] sm:w-[350px]" />

            {/* Inner ring */}
            <div className="absolute h-[190px] w-[190px] rounded-full border border-dashed border-white/20 sm:h-[240px] sm:w-[240px]" />

            {/* Center */}
            <div className="relative z-10 flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white shadow-2xl sm:h-36 sm:w-36">

              <Globe2
                size={38}
                className="text-[#0952d4]"
              />

              <span className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#0b1f3a]">
                Vyapaar
              </span>

            </div>

            {/* Top node */}
            <div className="absolute left-1/2 top-0 -translate-x-1/2">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
                <Factory
                  size={24}
                  className="text-[#fd8836]"
                />
              </div>

              <p className="mt-2 text-center text-xs font-bold text-white/80">
                Suppliers
              </p>

            </div>

            {/* Left node */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
                <Users
                  size={24}
                  className="text-white"
                />
              </div>

              <p className="mt-2 text-center text-xs font-bold text-white/80">
                Buyers
              </p>

            </div>

            {/* Right node */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
                <Package
                  size={24}
                  className="text-[#fd8836]"
                />
              </div>

              <p className="mt-2 text-center text-xs font-bold text-white/80">
                Products
              </p>

            </div>

            {/* Bottom node */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/20 bg-white/10 backdrop-blur">
                <TrendingUp
                  size={24}
                  className="text-white"
                />
              </div>

              <p className="mt-2 text-center text-xs font-bold text-white/80">
                Growth
              </p>

            </div>

            {/* Connection points */}
            <span className="absolute left-[28%] top-[22%] h-2.5 w-2.5 animate-pulse rounded-full bg-[#fd8836]" />

            <span className="absolute right-[27%] top-[24%] h-2.5 w-2.5 animate-pulse rounded-full bg-white" />

            <span className="absolute bottom-[23%] left-[31%] h-2.5 w-2.5 animate-pulse rounded-full bg-white" />

            <span className="absolute bottom-[25%] right-[30%] h-2.5 w-2.5 animate-pulse rounded-full bg-[#fd8836]" />

          </div>

        </div>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 overflow-hidden rounded-3xl border border-white/10 bg-white/10 backdrop-blur sm:grid-cols-3 lg:grid-cols-6">

          {networkStats.map((stat, index) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className={`group px-5 py-6 text-center transition hover:bg-white/10 ${
                  index !== networkStats.length - 1
                    ? "border-b border-white/10 sm:border-r"
                    : ""
                }`}
              >

                <Icon
                  size={20}
                  className="mx-auto text-[#fd8836]"
                />

                <p className="mt-3 text-xl font-black text-white">
                  {stat.value}
                </p>

                <p className="mt-1 text-[11px] font-medium text-white/60">
                  {stat.label}
                </p>

              </div>
            )
          })}

        </div>

        {/* Bottom CTA */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/10 px-6 py-5 sm:flex-row">

          <div>
            <p className="text-lg font-bold text-white">
              Ready to grow your business?
            </p>

            <p className="mt-1 text-sm text-white/60">
              Join thousands of businesses already trading on Vyapaar Bharat.
            </p>
          </div>

          <button className="flex shrink-0 items-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-lg">

            Join the Network

            <ArrowUpRight size={17} />

          </button>

        </div>

      </div>

    </section>
  )
}

export default TradeNetwork