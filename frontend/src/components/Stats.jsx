import {
  Users,
  Package,
  Globe2,
  IndianRupee,
  Building2,
} from "lucide-react"

const stats = [
  {
    value: "5.2L+",
    label: "Verified Suppliers",
    icon: Users,
  },
  {
    value: "2.4M+",
    label: "Product Listings",
    icon: Package,
  },
  {
    value: "180+",
    label: "Countries Connected",
    icon: Globe2,
  },
  {
    value: "₹840Cr+",
    label: "Annual Trade Value",
    icon: IndianRupee,
  },
  {
    value: "500K+",
    label: "Businesses",
    icon: Building2,
  },
]

function Stats() {
  return (
    <section className="border-y border-gray-100 bg-[#f8fafc]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid grid-cols-2 divide-x divide-gray-200 lg:grid-cols-5">

          {stats.map((stat, index) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className={`
                  group flex items-center gap-3 px-4 py-4
                  sm:px-6
                  ${index === 4 ? "col-span-2 justify-center lg:col-span-1" : ""}
                `}
              >

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#0952d4]/10 transition duration-300 group-hover:bg-[#0952d4]">
                  <Icon
                    size={21}
                    className="text-[#0952d4] transition duration-300 group-hover:text-white"
                  />
                </div>

                <div>
                  <p className="text-xl font-black tracking-tight text-[#0b1f3a] sm:text-2xl">
                    {stat.value}
                  </p>

                  <p className="mt-0.5 text-xs font-medium text-gray-500 sm:text-sm">
                    {stat.label}
                  </p>
                </div>

              </div>
            )
          })}

        </div>

      </div>
    </section>
  )
}

export default Stats