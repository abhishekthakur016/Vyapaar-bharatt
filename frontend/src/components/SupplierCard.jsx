import { MapPin, Star, ShieldCheck, Package, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function SupplierCard({ supplier }) {
  const supplierImage =
    supplier?.image_url ||
    supplier?.logo_url ||
    supplier?.image ||
    supplier?.logo ||
    "";

  const supplierYears =
    supplier?.years ||
    supplier?.experience ||
    supplier?.years_of_experience ||
    0;

  const supplierProducts = supplier?.products || supplier?.product_count || 0;

  const supplierReviews = supplier?.reviews || 0;
  const supplierRating = supplier?.rating || 0;

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 transition duration-300 hover:-translate-y-1 hover:border-[#0952d4]/20 hover:shadow-[0_18px_45px_rgba(9,82,212,0.10)]">
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="flex min-w-0 items-start justify-between gap-3">
        {/* Supplier information */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          {/* Supplier Image */}
          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#0952d4]">
            {supplierImage ? (
              <img
                src={supplierImage}
                alt={supplier?.name || "Supplier"}
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <span className="text-lg font-black text-white">
                {supplier?.name?.charAt(0)?.toUpperCase() || "S"}
              </span>
            )}
          </div>

          {/* Name + Industry */}
          <div className="min-w-0 flex-1">
            <h3
              className="truncate text-base font-bold text-[#0b1f3a]"
              title={supplier?.name || ""}
            >
              {supplier?.name || "Supplier"}
            </h3>

            <p className="mt-1 truncate text-xs font-medium text-gray-500">
              {supplier?.industry || "B2B Supplier"}
            </p>
          </div>
        </div>

        {/* Verified icon */}
        {supplier?.verified && (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0952d4]/10">
            <ShieldCheck size={17} className="text-[#0952d4]" />
          </div>
        )}
      </div>

      {/* ==========================================
          LOCATION
      ========================================== */}

      <div className="mt-5 flex min-w-0 items-center gap-2 text-sm text-gray-500">
        <MapPin size={15} className="shrink-0 text-[#fd8836]" />

        <span className="truncate">{supplier?.location || "India"}</span>
      </div>

      {/* ==========================================
          RATING
      ========================================== */}

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <Star size={15} className="fill-[#fd8836] text-[#fd8836]" />

          <span className="text-sm font-bold text-[#0b1f3a]">
            {supplierRating}
          </span>
        </div>

        <span className="text-xs text-gray-400">{supplierReviews} reviews</span>
      </div>

      {/* ==========================================
          STATS
      ========================================== */}

      <div className="mt-5 grid grid-cols-2 gap-3">
        {/* Experience */}
        <div className="min-w-0 rounded-xl bg-gray-50 p-3">
          <p className="text-xs text-gray-500">Experience</p>

          <p className="mt-1 truncate text-sm font-bold text-[#0b1f3a]">
            {supplierYears} Years
          </p>
        </div>

        {/* Products */}
        <div className="min-w-0 rounded-xl bg-gray-50 p-3">
          <div className="flex items-center gap-1">
            <Package size={13} className="shrink-0 text-[#0952d4]" />

            <p className="text-xs text-gray-500">Products</p>
          </div>

          <p className="mt-1 text-sm font-bold text-[#0b1f3a]">
            {supplierProducts}+
          </p>
        </div>
      </div>

      {/* ==========================================
          VERIFICATION
      ========================================== */}

      {supplier?.verified && (
        <div className="mt-4 flex items-center gap-2 rounded-lg bg-[#0952d4]/5 px-3 py-2">
          <ShieldCheck size={15} className="shrink-0 text-[#0952d4]" />

          <span className="text-xs font-bold text-[#0952d4]">
            Verified Supplier
          </span>
        </div>
      )}

      {/* ==========================================
          ACTIONS
      ========================================== */}

      <div className="mt-auto pt-5">
        <div className="flex gap-2">
          {/* View Catalog */}
          <Link
            to={`/suppliers/${supplier?.id}`}
            className="group/catalog flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#0952d4] px-3 py-3 text-xs font-bold text-[#0952d4] transition hover:bg-[#0952d4] hover:text-white"
          >
            View Catalog
            <ArrowRight
              size={14}
              className="transition-transform group-hover/catalog:translate-x-1"
            />
          </Link>

          {/* Contact */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="rounded-xl bg-[#fd8836] px-4 py-3 text-xs font-bold text-white transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Contact
          </button>
        </div>
      </div>
    </article>
  );
}

export default SupplierCard;
