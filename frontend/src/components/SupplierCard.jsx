import {
  MapPin,
  Star,
  ShieldCheck,
  Package,
  ArrowRight,
} from "lucide-react"

function SupplierCard({ supplier }) {
  return (
    <article className="group rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#0952d4]/20 hover:shadow-[0_18px_45px_rgba(9,82,212,0.10)]">

      {/* Header */}
      <div className="flex items-start justify-between">

        <div className="flex items-center gap-3">

          {/* Logo */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#0952d4] text-lg font-black text-white">
            {supplier.logo}
          </div>

          <div className="min-w-0">

            <h3 className="truncate text-base font-bold text-[#0b1f3a]">
              {supplier.name}
            </h3>

            <p className="mt-1 text-xs font-medium text-gray-500">
              {supplier.industry}
            </p>

          </div>

        </div>

        {supplier.verified && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0952d4]/10">
            <ShieldCheck
              size={17}
              className="text-[#0952d4]"
            />
          </div>
        )}

      </div>

      {/* Location */}
      <div className="mt-5 flex items-center gap-2 text-sm text-gray-500">
        <MapPin size={15} className="text-[#fd8836]" />
        {supplier.location}
      </div>

      {/* Rating */}
      <div className="mt-4 flex items-center gap-3">

        <div className="flex items-center gap-1">

          <Star
            size={15}
            className="fill-[#fd8836] text-[#fd8836]"
          />

          <span className="text-sm font-bold text-[#0b1f3a]">
            {supplier.rating}
          </span>

        </div>

        <span className="text-xs text-gray-400">
          {supplier.reviews} reviews
        </span>

      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3">

        <div className="rounded-xl bg-gray-50 p-3">

          <p className="text-xs text-gray-500">
            Experience
          </p>

          <p className="mt-1 text-sm font-bold text-[#0b1f3a]">
            {supplier.years} Years
          </p>

        </div>

        <div className="rounded-xl bg-gray-50 p-3">

          <div className="flex items-center gap-1">
            <Package size={13} className="text-[#0952d4]" />

            <p className="text-xs text-gray-500">
              Products
            </p>
          </div>

          <p className="mt-1 text-sm font-bold text-[#0b1f3a]">
            {supplier.products}+
          </p>

        </div>

      </div>

      {/* Verification */}
      {supplier.verified && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#0952d4]/5 px-3 py-2">

          <ShieldCheck
            size={15}
            className="text-[#0952d4]"
          />

          <span className="text-xs font-bold text-[#0952d4]">
            Verified Supplier
          </span>

        </div>
      )}

      {/* Actions */}
      <div className="mt-5 flex gap-2">

        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0952d4] px-3 py-3 text-xs font-bold text-[#0952d4] transition hover:bg-[#0952d4] hover:text-white">
          View Catalog
          <ArrowRight size={14} />
        </button>

        <button className="rounded-xl bg-[#fd8836] px-4 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:shadow-md">
          Contact
        </button>

      </div>

    </article>
  )
}

export default SupplierCard