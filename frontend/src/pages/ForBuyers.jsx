import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import {
  Search,
  MapPin,
  SlidersHorizontal,
  ChevronDown,
  CheckCircle2,
  Heart,
  GitCompareArrows,
  ArrowRight,
  ArrowUpRight,
  Building2,
  Package,
  Truck,
  ShieldCheck,
  X,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

/* =========================================================
   BRAND TOKENS (same color codes used across the site)
   Primary blue  #0952d4   Light blue #1684e8
   Orange        #fd8836   Deep orange #fd641c
   Navy text     #0b1f3a   Deep navy  #071a40
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
   SUPPLIER CARD
========================================================= */

function SupplierCard({ supplier, liked, onLike, onCompare, compared, index }) {
  const products = Array.isArray(supplier.productsList)
    ? supplier.productsList
    : [];

  const firstProduct = products[0];

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
      className={`fb-fade group relative flex flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_30px_-15px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.05] transition-all duration-500 ${EASE} hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(9,82,212,0.35)] hover:ring-[#0952d4]/20 ${
        compared ? "ring-2 ring-[#0952d4]/50" : ""
      }`}
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
            <h3 className="truncate text-lg font-extrabold tracking-[-0.01em] text-[#0b1f3a] transition-colors duration-300 group-hover:text-[#0952d4]">
              {supplier.name || "Unnamed Supplier"}
            </h3>
            {supplier.verified && (
              <BadgeCheck
                size={18}
                className="shrink-0 fill-[#0952d4] text-white"
                aria-label="Verified Supplier"
              />
            )}
          </div>

          <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-slate-500">
            <span className="truncate">
              {supplier.industry || "Business Supplier"}
            </span>
            <span className="h-1 w-1 rounded-full bg-slate-300" />
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin size={13} className="shrink-0 text-[#fd8836]" />
              <span className="truncate">
                {supplier.location || "Location not specified"}
              </span>
            </span>
          </div>
        </div>

        {supplier.verified && (
          <span className="mt-3 inline-flex w-fit items-center gap-1 rounded-full bg-[#0952d4]/[0.07] px-2.5 py-1 text-[11px] font-bold text-[#0952d4]">
            <CheckCircle2 size={12} />
            Verified Supplier
          </span>
        )}

        {/* Description */}
        <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {supplier.description ||
            "Business information available from this supplier."}
        </p>

        {/* Product / Service */}
        <div className="mt-5 flex items-center gap-3.5 rounded-2xl bg-slate-50/80 p-3.5 ring-1 ring-inset ring-slate-900/[0.03] transition-colors duration-500 group-hover:bg-[#0952d4]/[0.04]">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-[#0952d4] shadow-sm">
            {firstProduct ? <Package size={18} /> : <Truck size={18} />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
              {firstProduct ? "Top Product" : "Services"}
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

        {/* Actions */}
        <div className="mt-auto flex items-center gap-2 pt-6">
          <Link
            to={`/suppliers/${supplier.id}`}
            className="group/btn inline-flex h-11 flex-1 items-center justify-between gap-2 rounded-full bg-[#0b1f3a] pl-5 pr-1.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#0952d4] hover:shadow-[0_12px_24px_-10px_rgba(9,82,212,0.8)]"
          >
            View Supplier
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover/btn:rotate-45">
              <ArrowUpRight size={16} />
            </span>
          </Link>

          <button
            type="button"
            onClick={() => onCompare(supplier)}
            aria-pressed={compared}
            title={compared ? "Remove from comparison" : "Compare supplier"}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 active:scale-90 ${
              compared
                ? "bg-[#fd8836] text-white shadow-[0_10px_20px_-8px_rgba(253,136,54,0.9)]"
                : "text-slate-500 ring-1 ring-inset ring-slate-200 hover:text-[#fd8836] hover:ring-[#fd8836]/50"
            }`}
          >
            <GitCompareArrows size={17} />
          </button>
        </div>
      </div>
    </article>
  );
}

/* =========================================================
   SELECT (styled native select)
========================================================= */

function FilterSelect({ label, value, onChange, options }) {
  return (
    <div>
      <label className="mb-2 block text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full appearance-none rounded-xl bg-slate-50 px-4 py-3 pr-10 text-sm font-medium text-[#0b1f3a] outline-none ring-1 ring-inset ring-slate-900/[0.06] transition-all duration-300 hover:bg-white focus:bg-white focus:ring-2 focus:ring-[#0952d4]/40"
        >
          {options.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
    </div>
  );
}

/* =========================================================
   FOR BUYERS
========================================================= */

export default function ForBuyers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");

  const [showFilters, setShowFilters] = useState(false);

  const [liked, setLiked] = useState([]);
  const [compare, setCompare] = useState([]);

  /* FILTER OPTIONS */

  const industries = useMemo(() => {
    const values = suppliers
      .map((supplier) => supplier.industry)
      .filter(Boolean);

    return ["All Categories", ...new Set(values)];
  }, [suppliers]);

  const locations = useMemo(() => {
    const values = suppliers
      .map((supplier) => supplier.location)
      .filter(Boolean);

    return ["All Locations", ...new Set(values)];
  }, [suppliers]);

  /* FETCH SUPPLIERS */

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
          throw new Error(data.message || "Supplier API returned an error");
        }

        setSuppliers(data.suppliers || []);
      } catch (err) {
        console.error("Supplier fetch error:", err);

        setError(err.message || "Unable to load suppliers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  /* FILTER SUPPLIERS */

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        !query ||
        supplier.name?.toLowerCase().includes(query) ||
        supplier.industry?.toLowerCase().includes(query) ||
        supplier.location?.toLowerCase().includes(query) ||
        supplier.description?.toLowerCase().includes(query) ||
        supplier.business_type?.toLowerCase().includes(query) ||
        supplier.services?.some((service) =>
          service?.toLowerCase().includes(query),
        ) ||
        supplier.productsList?.some((product) =>
          product?.name?.toLowerCase().includes(query),
        );

      const matchesCategory =
        category === "All Categories" || supplier.industry === category;

      const matchesLocation =
        location === "All Locations" || supplier.location === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [suppliers, search, category, location]);

  /* LIKE */

  const toggleLike = (id) => {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  /* COMPARE */

  const handleCompare = (supplier) => {
    setCompare((current) => {
      const alreadySelected = current.some((item) => item.id === supplier.id);

      if (alreadySelected) {
        return current.filter((item) => item.id !== supplier.id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, supplier];
    });
  };

  /* CLEAR FILTERS */

  const clearFilters = () => {
    setCategory("All Categories");
    setLocation("All Locations");
    setSearch("");
  };

  const hasFilters =
    search || category !== "All Categories" || location !== "All Locations";

  const scrollToResults = () => {
    document.getElementById("supplier-results")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const trustItems = [
    {
      Icon: Building2,
      title: loading ? "—" : suppliers.length,
      text: "Suppliers",
      tone: "blue",
    },
    { Icon: CheckCircle2, title: "Verified", text: "Business profiles", tone: "blue" },
    { Icon: GitCompareArrows, title: "Compare", text: "Up to 3 suppliers", tone: "blue" },
    { Icon: Package, title: "Best Quotes", text: "Request directly", tone: "orange" },
  ];

  /* RETURN */

  return (
    <main
      className={`min-h-screen bg-slate-50/70 ${
        compare.length > 0 ? "pb-40 sm:pb-28" : ""
      }`}
    >
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative isolate overflow-hidden bg-[#0952d4]">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#0952d4] via-[#0b4bc0] to-[#071a40]" />
          <div
            className="absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255,255,255,0.4) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#1684e8]/50 blur-3xl" />
          <div className="absolute -bottom-40 left-0 h-96 w-96 rounded-full bg-[#fd8836]/25 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-28 pt-14 sm:px-6 lg:px-8 lg:pb-32 lg:pt-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="fb-fade inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
              <ShieldCheck size={14} className="text-[#fd8836]" />
              Source from businesses across India
            </div>

            <h1
              className="fb-fade mt-6 text-[38px] font-black leading-[1.03] tracking-[-0.035em] text-white sm:text-6xl lg:text-[66px]"
              style={{ animationDelay: "80ms" }}
            >
              Find the right suppliers{" "}
              <span className="bg-gradient-to-r from-[#fd8836] to-[#ffb37a] bg-clip-text text-transparent">
                for your business
              </span>
            </h1>

            <p
              className="fb-fade mx-auto mt-5 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg"
              style={{ animationDelay: "160ms" }}
            >
              Discover manufacturers, suppliers, wholesalers and service
              providers. Compare options and request the best quote.
            </p>

            {/* Search */}
            <div
              className="fb-fade mx-auto mt-9 max-w-2xl"
              style={{ animationDelay: "240ms" }}
            >
              <div className="group/search flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-[0_25px_60px_-15px_rgba(7,26,64,0.6)] ring-1 ring-white/50 transition-all duration-300 focus-within:ring-4 focus-within:ring-[#fd8836]/30 sm:flex-row sm:rounded-full">
                <div className="flex flex-1 items-center gap-3 px-4">
                  <Search
                    size={20}
                    className="shrink-0 text-slate-400 transition-colors group-focus-within/search:text-[#0952d4]"
                  />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && scrollToResults()}
                    placeholder="Search suppliers, products or services..."
                    className="w-full bg-transparent py-3 text-sm text-[#0b1f3a] outline-none placeholder:text-slate-400 sm:text-base"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                <button
                  type="button"
                  onClick={scrollToResults}
                  className="group/btn flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-7 py-3.5 font-bold text-white shadow-[0_10px_25px_-10px_rgba(253,136,54,0.9)] transition-all duration-300 hover:bg-[#fd641c] sm:rounded-full"
                >
                  Search
                  <ArrowRight
                    size={17}
                    className="transition-transform duration-300 group-hover/btn:translate-x-0.5"
                  />
                </button>
              </div>
            </div>

            {/* Popular */}
            <div
              className="fb-fade mt-6 flex flex-wrap items-center justify-center gap-2"
              style={{ animationDelay: "320ms" }}
            >
              <span className="mr-1 inline-flex items-center gap-1 text-xs font-semibold text-white/60">
                <Sparkles size={13} />
                Popular:
              </span>

              {["Steel", "Machinery", "Transport", "Hardware"].map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setSearch(term)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold backdrop-blur-md transition-all duration-300 ${
                    search === term
                      ? "bg-white text-[#0952d4]"
                      : "bg-white/10 text-white ring-1 ring-inset ring-white/20 hover:bg-white hover:text-[#0952d4]"
                  }`}
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST STRIP — floats over the hero edge
      ===================================================== */}
      <section className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[24px] bg-slate-200/70 shadow-[0_25px_50px_-20px_rgba(9,82,212,0.35)] ring-1 ring-slate-900/[0.05] lg:grid-cols-4">
          {trustItems.map(({ Icon, title, text, tone }) => (
            <div
              key={text}
              className="group flex items-center gap-3.5 bg-white px-4 py-5 transition-colors duration-500 hover:bg-slate-50 sm:px-6"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-all duration-500 ${EASE} group-hover:-rotate-6 group-hover:scale-110 ${
                  tone === "orange"
                    ? "bg-[#fd8836]/10 text-[#fd8836]"
                    : "bg-[#0952d4]/[0.08] text-[#0952d4]"
                }`}
              >
                <Icon size={20} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-base font-black tracking-tight text-[#0b1f3a] sm:text-lg">
                  {title}
                </p>
                <p className="truncate text-xs text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <section
        id="supplier-results"
        className="mx-auto max-w-7xl scroll-mt-24 px-4 py-12 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-7 lg:flex-row">
          {/* FILTER SIDEBAR */}
          <aside
            className={`w-full shrink-0 lg:block lg:w-72 ${
              showFilters ? "fb-fade block" : "hidden"
            }`}
          >
            <div className="rounded-[24px] bg-white p-6 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.18)] ring-1 ring-slate-900/[0.05] lg:sticky lg:top-24">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="inline-flex items-center gap-2 font-extrabold text-[#0b1f3a]">
                  <SlidersHorizontal size={17} className="text-[#0952d4]" />
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-full px-2.5 py-1 text-xs font-semibold text-[#0952d4] transition hover:bg-[#0952d4]/[0.07]"
                >
                  Clear all
                </button>
              </div>

              <div className="space-y-5">
                <FilterSelect
                  label="Category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  options={industries}
                />
                <FilterSelect
                  label="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  options={locations}
                />
              </div>

              {/* Info */}
              <div className="relative mt-7 overflow-hidden rounded-2xl bg-gradient-to-br from-[#0952d4] to-[#1684e8] p-5 text-white">
                <div
                  aria-hidden
                  className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#fd8836]/40 blur-2xl"
                />
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="mt-4 text-sm font-extrabold">
                    Source with confidence
                  </h3>
                  <p className="mt-1.5 text-xs leading-5 text-white/75">
                    Compare suppliers, check business information and request
                    quotes before making a purchase decision.
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN SUPPLIER AREA */}
          <div className="min-w-0 flex-1">
            {/* Header */}
            <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0952d4]">
                  <span className="h-px w-6 bg-[#0952d4]/50" />
                  Directory
                </p>
                <h2 className="mt-2 text-2xl font-black tracking-[-0.02em] text-[#0b1f3a] sm:text-3xl">
                  Suppliers &amp; Businesses
                </h2>
                <p className="mt-1.5 text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-[#0b1f3a]">
                    {filteredSuppliers.length}
                  </span>{" "}
                  matching supplier{filteredSuppliers.length !== 1 ? "s" : ""}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex w-fit items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all duration-300 lg:hidden ${
                  showFilters
                    ? "bg-[#0952d4] text-white"
                    : "bg-white text-[#0b1f3a] shadow-sm ring-1 ring-inset ring-slate-200"
                }`}
              >
                <SlidersHorizontal size={16} />
                {showFilters ? "Hide Filters" : "Filters"}
              </button>
            </div>

            {/* Active filter chips */}
            {hasFilters && (
              <div className="fb-fade mb-6 flex flex-wrap items-center gap-2">
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-[#0b1f3a] shadow-sm ring-1 ring-inset ring-slate-200 transition hover:ring-[#0952d4]/40"
                  >
                    “{search}”
                    <X size={12} className="text-slate-400" />
                  </button>
                )}
                {category !== "All Categories" && (
                  <button
                    type="button"
                    onClick={() => setCategory("All Categories")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#0952d4]/[0.07] px-3 py-1.5 text-xs font-semibold text-[#0952d4] transition hover:bg-[#0952d4]/[0.12]"
                  >
                    {category}
                    <X size={12} />
                  </button>
                )}
                {location !== "All Locations" && (
                  <button
                    type="button"
                    onClick={() => setLocation("All Locations")}
                    className="inline-flex items-center gap-1.5 rounded-full bg-[#fd8836]/10 px-3 py-1.5 text-xs font-semibold text-[#e0661a] transition hover:bg-[#fd8836]/20"
                  >
                    <MapPin size={12} />
                    {location}
                    <X size={12} />
                  </button>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-[22px] bg-white p-6 text-center shadow-sm ring-1 ring-red-100">
                <p className="text-sm font-semibold text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-4 rounded-full bg-[#0952d4] px-5 py-2 text-xs font-bold text-white transition hover:bg-[#0744b5]"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Loading */}
            {loading ? (
              <div className="grid gap-6 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
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
            ) : filteredSuppliers.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredSuppliers.map((supplier, index) => (
                  <SupplierCard
                    key={supplier.id}
                    index={index}
                    supplier={supplier}
                    liked={liked.includes(supplier.id)}
                    compared={compare.some((item) => item.id === supplier.id)}
                    onLike={toggleLike}
                    onCompare={handleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[26px] bg-white px-6 py-16 text-center shadow-sm ring-1 ring-slate-900/[0.05]">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0952d4]/[0.07]">
                  <Search className="text-[#0952d4]" />
                </div>

                <h3 className="mt-5 text-lg font-extrabold text-[#0b1f3a]">
                  No suppliers found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another product, category or location.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 rounded-full bg-[#0952d4] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0744b5]"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          COMPARE DOCK
      ===================================================== */}
      {compare.length > 0 && (
        <div className="fb-slide fixed inset-x-0 bottom-4 z-50 px-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-3 rounded-[24px] bg-[#0b1f3a]/95 p-3 pl-5 shadow-[0_30px_60px_-15px_rgba(7,26,64,0.6)] ring-1 ring-white/10 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between sm:rounded-full">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#fd8836] text-white">
                <GitCompareArrows size={16} />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Compare Suppliers</p>
                <div className="mt-1 flex items-center gap-1">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className={`h-1 w-5 rounded-full transition-colors duration-500 ${
                        i < compare.length ? "bg-[#fd8836]" : "bg-white/20"
                      }`}
                    />
                  ))}
                  <span className="ml-1.5 text-[11px] text-white/60">
                    {compare.length} of 3
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {compare.map((supplier) => (
                <button
                  key={supplier.id}
                  type="button"
                  onClick={() => handleCompare(supplier)}
                  title="Remove"
                  className="group inline-flex max-w-[170px] items-center gap-2 rounded-full bg-white/10 py-1 pl-1 pr-3 text-xs font-semibold text-white transition hover:bg-white/20"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#0952d4] text-[10px] font-black">
                    {supplier.image_url ? (
                      <img
                        src={supplier.image_url}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      getInitials(supplier.name)
                    )}
                  </span>
                  <span className="truncate">{supplier.name}</span>
                  <X
                    size={12}
                    className="shrink-0 text-white/50 transition group-hover:text-white"
                  />
                </button>
              ))}

              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#fd8836] px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:bg-[#fd641c] hover:shadow-[0_10px_20px_-8px_rgba(253,136,54,0.9)]"
              >
                Compare Now
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fbFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fbSlideUp {
          from { opacity: 0; transform: translateY(40px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .fb-fade  { animation: fbFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .fb-slide { animation: fbSlideUp 500ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .fb-fade, .fb-slide { animation: none; }
          .fb-fade * { transition: none !important; }
        }
      `}</style>
    </main>
  );
}