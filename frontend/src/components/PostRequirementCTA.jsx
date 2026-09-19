import {
  FileText,
  Send,
  Users,
  MessageSquareQuote,
  ArrowRight,
  Quote,
  Star,
  BadgeCheck,
} from "lucide-react"

const benefits = [
  {
    icon: Send,
    title: "Post Your Requirement",
    description:
      "Tell us exactly what you need in a few simple steps.",
  },
  {
    icon: Users,
    title: "Get Supplier Responses",
    description:
      "Relevant verified suppliers can respond to your requirement.",
  },
  {
    icon: MessageSquareQuote,
    title: "Compare Quotes",
    description:
      "Compare pricing, MOQ, delivery and supplier details.",
  },
]

const testimonials = [
  {
    name: "Rajiv Mehta",
    role: "Procurement Manager",
    company: "Mehta Engineering",
    initials: "RM",
    quote:
      "We found verified machinery suppliers much faster than traditional sourcing. The quote comparison made our decision simple.",
  },
  {
    name: "Ananya Sharma",
    role: "Business Owner",
    company: "Sharma Packaging",
    initials: "AS",
    quote:
      "Vyapaar Bharat helped us connect with reliable manufacturers across India. We received multiple competitive quotes.",
  },
  {
    name: "Amit Verma",
    role: "Export Manager",
    company: "Verma Industries",
    initials: "AV",
    quote:
      "The platform makes B2B sourcing feel much more organized. Finding suppliers and starting conversations is extremely easy.",
  },
]

function PostRequirementCTA() {
  return (
    <section className="relative overflow-hidden bg-[#0952d4] py-20 sm:py-24">

      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full border border-white/10" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full border border-white/10" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* =========================================
            MAIN CTA
        ========================================== */}

        <div className="mx-auto max-w-4xl text-center">

          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-xl">
            <FileText
              size={30}
              strokeWidth={2.2}
              className="text-[#0952d4]"
            />
          </div>

          <p className="mt-6 text-xs font-black uppercase tracking-[0.22em] text-white/60 sm:text-sm">
            Buy Smarter
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
            Tell Us What You Need.
            <span className="mt-1 block text-[#fd8836]">
              Suppliers Will Respond.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-white/75 sm:text-base lg:text-lg">
            Post your business requirement once and connect with relevant
            suppliers who can help you source the right products at the right
            price.
          </p>

          {/* CTA Buttons */}

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">

            <button
              type="button"
              className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-7 py-4 text-sm font-black text-white shadow-lg shadow-black/10 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f77925] hover:shadow-xl sm:w-auto"
            >
              Post Your Requirement

              <ArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>

            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-7 py-4 text-sm font-bold text-white backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/15 sm:w-auto"
            >
              Browse Suppliers
            </button>

          </div>
        </div>

        {/* =========================================
            TESTIMONIALS
        ========================================== */}

        <div className="mt-20">

          {/* Testimonial Header */}

          <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50">
                Trusted by Businesses
              </p>

              <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                What businesses say about us
              </h3>
            </div>

            {/* Rating */}

            <div className="flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 backdrop-blur">

              <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={14}
                    fill="currentColor"
                    className="text-[#fd8836]"
                  />
                ))}
              </div>

              <span className="text-xs font-bold text-white">
                4.8/5 Business Rating
              </span>

            </div>
          </div>

          {/* Testimonial Cards */}

          <div className="grid gap-5 md:grid-cols-3">

            {testimonials.map((testimonial) => (
              <div
                key={testimonial.name}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white p-6 shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >

                {/* Orange Top Line */}

                <div className="absolute left-0 right-0 top-0 h-1 bg-[#fd8836]" />

                {/* Quote Icon */}

                <div className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#0952d4]/5">
                  <Quote
                    size={18}
                    strokeWidth={2.5}
                    className="text-[#0952d4]"
                  />
                </div>

                {/* Stars */}

                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill="currentColor"
                      className="text-[#fd8836]"
                    />
                  ))}
                </div>

                {/* Testimonial */}

                <p className="mt-5 pr-8 text-sm leading-7 text-gray-600">
                  “{testimonial.quote}”
                </p>

                {/* Customer */}

                <div className="mt-6 flex items-center gap-3 border-t border-gray-100 pt-5">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0952d4] text-sm font-black text-white">
                    {testimonial.initials}
                  </div>

                  <div className="min-w-0">

                    <div className="flex items-center gap-1.5">

                      <p className="truncate text-sm font-black text-[#0b1f3a]">
                        {testimonial.name}
                      </p>

                      <BadgeCheck
                        size={15}
                        strokeWidth={2.5}
                        className="shrink-0 text-[#0952d4]"
                      />

                    </div>

                    <p className="mt-0.5 truncate text-xs text-gray-500">
                      {testimonial.role} • {testimonial.company}
                    </p>

                  </div>

                </div>

              </div>
            ))}

          </div>
        </div>

        {/* =========================================
            PROCESS
        ========================================== */}

        <div className="mt-20">

          <div className="mb-8 text-center">

            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/50 sm:text-sm">
              Simple Process
            </p>

            <h3 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
              From Requirement to Deal
            </h3>

          </div>

          <div className="grid gap-4 md:grid-cols-3">

            {benefits.map((item, index) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:bg-white/15"
                >

                  <div className="flex items-start gap-4">

                    {/* Icon */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                      <Icon
                        size={22}
                        strokeWidth={2.2}
                        className="text-[#0952d4]"
                      />
                    </div>

                    {/* Content */}

                    <div>

                      <div className="mb-1 text-xs font-black text-[#fd8836]">
                        0{index + 1}
                      </div>

                      <h3 className="text-base font-black text-white">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/60">
                        {item.description}
                      </p>

                    </div>

                  </div>

                </div>
              )
            })}

          </div>
        </div>

        {/* =========================================
            TRUST LINE
        ========================================== */}

        <div className="mt-12 border-t border-white/10 pt-8 text-center">

          <p className="text-xs font-medium text-white/50 sm:text-sm">
            Trusted by businesses looking to source, compare and grow

            <span className="mx-2 text-[#fd8836]">
              •
            </span>

            Verified supplier network

            <span className="mx-2 text-[#fd8836]">
              •
            </span>

            Business-focused marketplace
          </p>

        </div>

      </div>
    </section>
  )
}

export default PostRequirementCTA
