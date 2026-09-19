import {
  Check,
  Crown,
  Building2,
  Zap,
  ArrowRight,
} from "lucide-react"
import { Link } from "react-router-dom"

function Pricing() {
  const plans = [
    {
      name: "Free",
      description:
        "Get started with essential B2B marketplace features.",
      price: "₹0",
      period: "forever",
      icon: Zap,
      popular: false,
      button: "Get Started",
      features: [
        "Browse products and suppliers",
        "Post up to 3 requirements",
        "Receive supplier quotes",
        "Basic supplier discovery",
        "Access to B2B marketplace",
      ],
    },
    {
      name: "Business",
      description:
        "Powerful tools for growing businesses and active buyers.",
      price: "₹999",
      period: "per month",
      icon: Crown,
      popular: true,
      button: "Choose Business",
      features: [
        "Everything in Free",
        "Unlimited requirements",
        "Priority quote visibility",
        "Advanced supplier discovery",
        "Supplier comparison",
        "Priority support",
        "Business profile",
      ],
    },
    {
      name: "Enterprise",
      description:
        "Advanced sourcing solutions for large organizations.",
      price: "Custom",
      period: "tailored for your business",
      icon: Building2,
      popular: false,
      button: "Contact Sales",
      features: [
        "Everything in Business",
        "Dedicated account support",
        "Custom sourcing assistance",
        "Advanced business insights",
        "Multi-user access",
        "Custom requirements",
        "Enterprise support",
      ],
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 lg:px-8">

          <div className="mx-auto inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-[#0952d4]">
            <Crown size={15} />
            SIMPLE & TRANSPARENT PRICING
          </div>

          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-bold leading-tight text-[#0b1f3a] md:text-5xl">
            Plans Built for
            <span className="text-[#0952d4]">
              {" "}Every Business
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Start sourcing smarter today. Choose a plan
            that fits your business and scale as you grow.
          </p>

        </div>
      </section>

      {/* ==================================================
          PRICING CARDS
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

        <div className="grid gap-6 lg:grid-cols-3">

          {plans.map((plan) => {
            const Icon = plan.icon

            return (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  plan.popular
                    ? "border-[#0952d4] shadow-lg shadow-blue-100"
                    : "border-slate-200"
                }`}
              >

                {/* Popular Badge */}

                {plan.popular && (
                  <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#0952d4] px-4 py-1.5 text-xs font-bold text-white shadow-md">
                    MOST POPULAR
                  </div>
                )}

                {/* Icon */}

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                    plan.popular
                      ? "bg-blue-50 text-[#0952d4]"
                      : "bg-slate-100 text-[#0b1f3a]"
                  }`}
                >
                  <Icon size={23} />
                </div>

                {/* Plan */}

                <h2 className="mt-6 text-2xl font-bold text-[#0b1f3a]">
                  {plan.name}
                </h2>

                <p className="mt-2 min-h-[48px] text-sm leading-6 text-slate-500">
                  {plan.description}
                </p>

                {/* Price */}

                <div className="mt-7 border-b border-slate-100 pb-7">

                  <div className="flex items-end gap-2">

                    <span className="text-4xl font-bold text-[#0b1f3a]">
                      {plan.price}
                    </span>

                    {plan.period && (
                      <span className="pb-1 text-xs text-slate-400">
                        {plan.period}
                      </span>
                    )}

                  </div>

                </div>

                {/* Button */}

                <Link
                  to="/post-requirement"
                  className={`mt-6 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition ${
                    plan.popular
                      ? "bg-[#0952d4] text-white hover:bg-[#0744b5]"
                      : "border border-slate-200 bg-white text-[#0b1f3a] hover:border-[#0952d4] hover:text-[#0952d4]"
                  }`}
                >
                  {plan.button}
                  <ArrowRight size={17} />
                </Link>

                {/* Features */}

                <div className="mt-7">

                  <p className="text-sm font-bold text-[#0b1f3a]">
                    What's included
                  </p>

                  <ul className="mt-4 space-y-3">

                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-3 text-sm text-slate-600"
                      >
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-50">
                          <Check
                            size={13}
                            className="text-green-600"
                          />
                        </span>

                        <span>{feature}</span>
                      </li>
                    ))}

                  </ul>

                </div>

              </div>
            )
          })}

        </div>

      </section>

      {/* ==================================================
          CTA
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 pb-14 sm:px-6 lg:px-8">

        <div className="overflow-hidden rounded-3xl bg-[#0b1f3a] px-6 py-10 text-center sm:px-10">

          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
            <Building2
              size={23}
              className="text-white"
            />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white md:text-3xl">
            Need a custom solution?
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Talk to our team about enterprise sourcing,
            supplier discovery and customized B2B solutions.
          </p>

          <Link
            to="/post-requirement"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#fd8836] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#ed7628]"
          >
            Talk to Our Team
            <ArrowRight size={18} />
          </Link>

        </div>

      </section>

    </main>
  )
}

export default Pricing