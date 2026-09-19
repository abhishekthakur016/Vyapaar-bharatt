import { ArrowRight } from "lucide-react"
import { suppliers } from "../data/suppliers"
import SupplierCard from "./SupplierCard"

function FeaturedSuppliers() {
  return (
    <section className="bg-[#f8fafc] py-20 sm:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

          <div>

            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fd8836]">
              Trusted Businesses
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[#0b1f3a] sm:text-4xl">
              Featured Verified Suppliers
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Connect directly with verified manufacturers, wholesalers
              and suppliers across India.
            </p>

          </div>

          <button className="group flex items-center gap-2 self-start rounded-xl border border-[#0952d4] px-5 py-3 text-sm font-bold text-[#0952d4] transition hover:bg-[#0952d4] hover:text-white sm:self-auto">

            Supplier Directory

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />

          </button>

        </div>

        {/* Supplier Grid */}
        <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {suppliers.map((supplier) => (
            <SupplierCard
              key={supplier.id}
              supplier={supplier}
            />
          ))}

        </div>

      </div>

    </section>
  )
}

export default FeaturedSuppliers