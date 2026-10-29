import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Heart,
  MapPin,
  Package,
  ShieldCheck,
  Sparkles,
  Star,
  Truck,
  Briefcase,
} from "lucide-react";

/* =========================================================
   BRAND TOKENS (same as For Buyers page)
   Primary blue #0952d4  Light blue #1684e8
   Orange #fd8836        Deep orange #fd641c
   Navy #0b1f3a          Deep navy #071a40
========================================================= */

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";

const getInitials = (name) =>
  name
    ?.split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "S";

/* =========================================================
   SUPPLIER CARD — same design as the For Buyers page
========================================================= */

function FeaturedSupplierCard({ supplier, liked, onLike, index }) {
  const products = Array.isArray(supplier.productsList)
    ? supplier.productsList
    : [];

  const firstProduct = products[0];
  const productCount = Number(supplier.products) || products.length || 0;
  const experience = Number(supplier.experience) || 0;
  const rating = Number(supplier.rating) || 0;

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
      className={`fs-fade group relative flex h-full flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_30px_-15px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.05] transition-all duration-500 ${EASE} hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(9,82,212,0.35)] hover:ring-[#0952d4]/20`}
    >
      {/* Cover band */}
      <div className="relative h-20 overflow-hidden bg-gradient-to-br from-[#0952d4] via-[#1684e8] to-[#0952d4]">
        <div
          aria-hidden
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div
          aria-hidden
          className={`absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[#fd8836]/40 blur-2xl transition-all duration-700 ${EASE} group-hover:-right-4 group-hover:-top-10`}
        />

        {/* Like */}
        <button
          type="button"
          onClick={() => onLike(supplier.id)}
          aria-pressed={liked}
          title={liked ? "Remove from favourites" : "Add to favourites"}
          className={`absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-md transition-all duration-300 active:scale-90 ${
            liked
              ? "bg-white text-[#fd641c] shadow-md"
              : "bg-white/20 text-white hover:bg-white hover:text-[#fd641c]"
          }`}
        >
          <Heart size={16} fill={liked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col px-6 pb-6">
        {/* Avatar overlapping cover */}
        <div className="-mt-9 flex items-end justify-between gap-3">
          <div className="relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0b1f3a] to-[#0952d4] shadow-[0_10px_25px_-10px_rgba(9,82,212,0.7)] ring-4 ring-white">
            {supplier.image_url ? (
              <img
                src={supplier.image_url}
                alt={supplier.name || "Supplier"}
                loading="lazy"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xl font-black tracking-tight text-white">
                {getInitials(supplier.name)}
              </div>
            )}
          </div>

          <span className="mb-1 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold text-slate-600">
            {supplier.business_type || "Business"}
          </span>
        </div>

        {/* Name */}
        <div className="mt-4 min-w-0">
          <div className="flex items-center gap-1.5">
            <Link
              to={`/suppliers/${supplier.id}`}
              className="min-w-0 truncate text-lg font-extrabold tracking-[-0.01em] text-[#0b1f3a] transition-colors duration-300 group-hover:text-[#0952d4]"
            >
              {supplier.name || "Unnamed Supplier"}
            </Link>
            {supplier.verified && (
              <BadgeCheck
                size={18}
                className="shrink-0 fill-[#0952d4] text-white"
                aria-label="Verified Supplier"
              />
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
            <span className="truncate">{supplier.industry}</span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin size={13} className="shrink-0 text-[#fd8836]" />
              <span className="truncate">{supplier.location}</span>
            </span>
          </div>
        </div>

        {/* Badges row */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {supplier.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#0952d4]/[0.07] px-2.5 py-1 text-[11px] font-bold text-[#0952d4]">
              <CheckCircle2 size={12} />
              Verified Supplier
            </span>
          )}
          {rating > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#fd8836]/10 px-2.5 py-1 text-[11px] font-bold text-[#e0661a]">
              <Star size={12} className="fill-[#fd8836] text-[#fd8836]" />
              {rating}
              {Number(supplier.reviews) > 0 && (
                <span className="font-medium text-[#e0661a]/70">
                  ({supplier.reviews})
                </span>
              )}
            </span>
          )}
          {experience > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
              <Briefcase size={12} />
              {experience}+ yrs
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {supplier.description ||
            "Business information available from this supplier."}
        </p>

        {/* Product / Service */}
        <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-slate-50/80 p-3.5 ring-1 ring-inset ring-slate-900/[0.03] transition-colors duration-500 group-hover:bg-[#0952d4]/[0.04]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0952d4] shadow-sm">
            {firstProduct || productCount > 0 ? (
              <Package size={18} />
            ) : (
              <Truck size={18} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {firstProduct
                ? "Top Product"
                : productCount > 0
                  ? "Products"
                  : "Services"}
            </p>

            {firstProduct ? (
              <>
                <p className="mt-0.5 truncate text-sm font-bold text-[#0b1f3a]">
                  {firstProduct.name || "Product"}
                </p>
                <p className="mt-0.5 text-xs font-bold text-[#fd641c]">
                  {firstProduct.priceType || "Price on Request"}
                </p>
              </>
            ) : productCount > 0 ? (
              <p className="mt-0.5 text-sm font-bold text-[#0b1f3a]">
                {productCount} product{productCount !== 1 ? "s" : ""} listed
              </p>
            ) : (
              <p className="mt-0.5 line-clamp-2 text-sm font-semibold text-[#0b1f3a]">
                {supplier.services?.join(" • ") ||
                  "Business services available"}
              </p>
            )}
          </div>

          {products.length > 1 && (
            <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-[#0952d4] shadow-sm">
              +{products.length - 1}
            </span>
          )}
        </div>

        {/* Action */}
        <div className="mt-auto pt-6">
          <Link
            to={`/suppliers/${supplier.id}`}
            className="group/btn inline-flex h-11 w-full items-center justify-between gap-2 rounded-full bg-[#0b1f3a] pl-5 pr-1.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#0952d4] hover:shadow-[0_12px_24px_-10px_rgba(9,82,212,0.8)]"
          >
            View Supplier
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover/btn:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   FEATURED SUPPLIERS
========================================================= */

function FeaturedSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState([]);

  // ==========================================
  // FETCH REAL SUPPLIERS
  // ==========================================

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/suppliers");

        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Supplier API returned an error");
        }

        const realSuppliers = data.suppliers || [];

        // NORMALIZE DATABASE DATA
        const formattedSuppliers = realSuppliers.map((supplier) => {
          const image =
            supplier.image_url ||
            supplier.logo_url ||
            supplier.logo ||
            supplier.image ||
            "";

          return {
            ...supplier,

            image_url: image,
            image: image,
            logo: image,
            logo_url: image,

            reviews: supplier.reviews || 0,
            rating: supplier.rating || 0,
            products: supplier.products || supplier.product_count || 0,

            experience:
              supplier.experience || supplier.years_of_experience || 0,

            location: supplier.location || "India",
            industry: supplier.industry || "B2B Supplier",
            verified: Boolean(supplier.verified),
          };
        });

        setSuppliers(formattedSuppliers);
      } catch (err) {
        console.error("Featured suppliers error:", err);
        setError("Unable to load suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // LIKE (same behaviour as For Buyers page)
  const toggleLike = (id) => {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  // SHOW ONLY FIRST 6 SUPPLIERS
  const featuredSuppliers = suppliers.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-20 sm:py-24">
      {/* Soft background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(9,82,212,0.14) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute -right-40 top-10 h-80 w-80 rounded-full bg-[#1684e8]/[0.08] blur-3xl" />
        <div className="absolute -left-40 bottom-0 h-80 w-80 rounded-full bg-[#fd8836]/[0.08] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADING */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#fd8836]/20 bg-[#fd8836]/[0.06] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#fd8836]">
              <ShieldCheck size={13} />
              Trusted Businesses
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#0b1f3a] sm:text-[44px] sm:leading-[1.1]">
              Featured{" "}
              <span className="bg-gradient-to-r from-[#0952d4] to-[#1684e8] bg-clip-text text-transparent">
                Verified Suppliers
              </span>
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Connect directly with verified manufacturers, wholesalers and
              suppliers across India.
            </p>
          </div>

          {/* Supplier Directory → For Buyers page */}
          <Link
            to="/for-buyers"
            className="group inline-flex h-12 items-center gap-2 self-start rounded-full bg-white pl-5 pr-1.5 text-sm font-bold text-[#0b1f3a] shadow-[0_10px_25px_-12px_rgba(9,82,212,0.35)] ring-1 ring-inset ring-slate-900/[0.06] transition-all duration-300 hover:bg-[#0952d4] hover:text-white hover:ring-[#0952d4] sm:self-auto"
          >
            Supplier Directory
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0952d4] text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white/20">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[26px] bg-white ring-1 ring-slate-900/[0.05]"
              >
                <div className="h-20 animate-pulse bg-slate-200/70" />
                <div className="px-6 pb-6">
                  <div className="-mt-9 h-[68px] w-[68px] animate-pulse rounded-2xl bg-slate-200 ring-4 ring-white" />
                  <div className="mt-4 h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
                  <div className="mt-2.5 h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
                  <div className="mt-6 h-16 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="mt-6 h-11 animate-pulse rounded-full bg-slate-200/80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mx-auto mt-12 max-w-lg rounded-[24px] bg-white px-6 py-10 text-center shadow-sm ring-1 ring-red-100">
            <p className="text-sm font-semibold text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-[#0952d4] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0744b5]"
            >
              Retry
            </button>
          </div>
        )}

        {/* REAL SUPPLIERS */}
        {!loading && !error && featuredSuppliers.length > 0 && (
          <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {featuredSuppliers.map((supplier, index) => (
              <FeaturedSupplierCard
                key={supplier.id}
                index={index}
                supplier={supplier}
                liked={liked.includes(supplier.id)}
                onLike={toggleLike}
              />
            ))}
          </div>
        )}

        {/* NO SUPPLIERS */}
        {!loading && !error && featuredSuppliers.length === 0 && (
          <div className="mx-auto mt-12 max-w-lg rounded-[24px] bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-900/[0.05]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0952d4]/[0.07] text-[#0952d4]">
              <Sparkles size={26} />
            </div>
            <h3 className="mt-5 text-lg font-extrabold text-[#0b1f3a]">
              No suppliers found
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              There are currently no suppliers available.
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fsFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fs-fade { animation: fsFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .fs-fade { animation: none; }
          .fs-fade, .fs-fade * { transition: none !important; }
        }
      `}</style>
    </section>
  );
}

export default FeaturedSuppliers;
