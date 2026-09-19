import {
  Search,
  MessageSquareQuote,
  Scale,
  Handshake,
  ArrowRight,
} from "lucide-react"

const steps = [
  {
    number: "01",
    title: "Search & Discover",
    description:
      "Search products, suppliers or business requirements and discover the right opportunities.",
    icon: Search,
  },
  {
    number: "02",
    title: "Receive Best Quotes",
    description:
      "Post your requirement and receive competitive quotations from relevant suppliers.",
    icon: MessageSquareQuote,
  },
  {
    number: "03",
    title: "Compare & Negotiate",
    description:
      "Compare price, MOQ, quality, delivery and supplier details before making a decision.",
    icon: Scale,
  },
  {
    number: "04",
    title: "Trade & Grow",
    description:
      "Connect with the right supplier, complete the business transaction and grow.",
    icon: Handshake,
  },
]

function HowItWorks() {
  return (
    <section className="bg-white py-20 sm:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">

          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fd8836]">
            Simple B2B Process
          </p>

          <h2 className="text-3xl font-black tracking-tight text-[#0b1f3a] sm:text-4xl lg:text-5xl">
            How Vyapaar Bharat Works
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-500 sm:text-lg">
            From discovering the right supplier to closing the right deal,
            everything happens in one connected B2B ecosystem.
          </p>

        </div>

        {/* Flow */}
        <div className="relative mt-14">

          {/* Connecting line - desktop */}
          <div className="absolute left-[12%] right-[12%] top-16 hidden h-px bg-gray-200 lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">

            {steps.map((step, index) => {
              const Icon = step.icon

              return (
                <div
                  key={step.number}
                  className="group relative text-center"
                >

                  {/* Icon */}
                  <div className="relative z-10 mx-auto flex h-32 w-32 items-center justify-center rounded-full border-8 border-white bg-[#f8fafc] shadow-[0_8px_30px_rgba(9,82,212,0.08)] transition duration-300 group-hover:bg-[#0952d4]">

                    <Icon
                      size={32}
                      className="text-[#0952d4] transition duration-300 group-hover:text-white"
                    />

                    {/* Number */}
                    <span className="absolute -right-1 -top-1 flex h-9 w-9 items-center justify-center rounded-full bg-[#fd8836] text-[11px] font-black text-white shadow-md">
                      {step.number}
                    </span>

                  </div>

                  {/* Content */}
                  <div className="mt-7">

                    <h3 className="text-lg font-black text-[#0b1f3a]">
                      {step.title}
                    </h3>

                    <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-gray-500">
                      {step.description}
                    </p>

                  </div>

                  {/* Mobile/Tablet arrow */}
                  {index !== steps.length - 1 && (
                    <div className="mt-7 flex justify-center lg:hidden">

                      <ArrowRight
                        size={20}
                        className="text-[#fd8836]"
                      />

                    </div>
                  )}

                </div>
              )
            })}

          </div>

        </div>

        {/* Bottom flow */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3">

          <span className="rounded-full bg-[#0952d4]/10 px-5 py-2.5 text-sm font-bold text-[#0952d4]">
            Discover
          </span>

          <ArrowRight
            size={18}
            className="text-gray-300"
          />

          <span className="rounded-full bg-[#fd8836]/10 px-5 py-2.5 text-sm font-bold text-[#fd8836]">
            Request Quote
          </span>

          <ArrowRight
            size={18}
            className="text-gray-300"
          />

          <span className="rounded-full bg-[#0952d4]/10 px-5 py-2.5 text-sm font-bold text-[#0952d4]">
            Negotiate
          </span>

          <ArrowRight
            size={18}
            className="text-gray-300"
          />

          <span className="rounded-full bg-[#fd8836]/10 px-5 py-2.5 text-sm font-bold text-[#fd8836]">
            Trade
          </span>

        </div>

      </div>

    </section>
  )
}

export default HowItWorks