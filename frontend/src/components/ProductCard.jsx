import {
  Heart,
  MapPin,
  Star,
  ShieldCheck,
  ArrowRight,
} from "lucide-react"

function ProductCard({ product }) {
  return (
    <article className="group overflow-hidden rounded-2xl border border-gray-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-[#0952d4]/20 hover:shadow-[0_18px_45px_rgba(9,82,212,0.10)]">

      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-100">

        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          onError={(e) => {
            e.currentTarget.src =
              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
          }}
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">

          {product.featured && (
            <span className="rounded-full bg-[#fd8836] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Featured
            </span>
          )}

          {product.trending && (
            <span className="rounded-full bg-[#0952d4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
              Trending
            </span>
          )}

        </div>

        {/* Wishlist */}
        <button
          aria-label="Add to wishlist"
          className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-sm transition hover:bg-[#0952d4] hover:text-white"
        >
          <Heart size={17} />
        </button>

      </div>

      {/* Content */}
      <div className="p-5">

        {/* Category */}
        <p className="text-xs font-semibold text-[#0952d4]">
          {product.category}
        </p>

        {/* Product name */}
        <h3 className="mt-2 line-clamp-2 min-h-[48px] text-base font-bold leading-6 text-[#0b1f3a]">
          {product.name}
        </h3>

        {/* Rating */}
        <div className="mt-3 flex items-center gap-2">

          <div className="flex items-center gap-1">
            <Star
              size={14}
              className="fill-[#fd8836] text-[#fd8836]"
            />

            <span className="text-sm font-bold text-[#0b1f3a]">
              {product.rating}
            </span>
          </div>

          <span className="text-xs text-gray-400">
            ({product.reviews} reviews)
          </span>

        </div>

        {/* Price */}
        <div className="mt-4">

          <p className="text-lg font-black text-[#0b1f3a]">
            {product.price}
          </p>

          <p className="mt-0.5 text-xs text-gray-500">
            per {product.unit}
          </p>

        </div>

        {/* MOQ */}
        <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2">
          <span className="text-xs text-gray-500">
            MOQ:
          </span>

          <span className="ml-1 text-xs font-bold text-[#0b1f3a]">
            {product.moq}
          </span>
        </div>

        {/* Supplier */}
        <div className="mt-4 border-t border-gray-100 pt-4">

          <div className="flex items-start gap-2">

            <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#0952d4]/10">
              <ShieldCheck
                size={16}
                className="text-[#0952d4]"
              />
            </div>

            <div className="min-w-0">

              <p className="truncate text-sm font-bold text-[#0b1f3a]">
                {product.supplier}
              </p>

              <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                <MapPin size={12} />
                {product.location}
              </div>

            </div>

          </div>

          {product.verified && (
            <div className="mt-2 flex items-center gap-1 text-xs font-semibold text-[#0952d4]">
              <ShieldCheck size={13} />
              Verified Supplier
            </div>
          )}

        </div>

        {/* CTA */}
        <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0848ba]">

          Get Best Price

          <ArrowRight size={16} />

        </button>

      </div>

    </article>
  )
}

export default ProductCard