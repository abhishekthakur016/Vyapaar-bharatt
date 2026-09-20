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
  Building2,
  Package,
  Truck,
  ShieldCheck,
  X,
  LoaderCircle,
} from "lucide-react";

function SupplierCard({ supplier, liked, onLike, onCompare }) {
  const firstProduct = supplier.productsList?.[0];

  return (
    <div className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      {/* Supplier Header */}
      <div className="border-b border-slate-100 p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {/* Supplier Image */}
            <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-blue-600 to-blue-800 shadow-sm">
              {supplier.image_url ? (
                <img
                  src={supplier.image_url}
                  alt={supplier.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
                  {supplier.name
                    ?.split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")
                    .toUpperCase()}
                </div>
              )}
            </div>

            <div className="min-w-0">
              <h3 className="truncate text-base font-bold text-[#0b1f3a]">
                {supplier.name}
              </h3>

              <p className="mt-1 text-sm text-slate-500">{supplier.industry}</p>
            </div>
          </div>

          {/* Like */}
          <button
            onClick={() => onLike(supplier.id)}
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border transition ${
              liked
                ? "border-red-200 bg-red-50 text-red-500"
                : "border-slate-200 text-slate-400 hover:border-red-200 hover:text-red-500"
            }`}
          >
            <Heart size={17} fill={liked ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Badges */}
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {supplier.verified && (
            <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              <CheckCircle2 size={13} />
              Verified Supplier
            </span>
          )}

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {supplier.business_type || "Business"}
          </span>
        </div>
      </div>

      {/* Supplier Information */}
      <div className="border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <MapPin size={15} className="text-blue-600" />

          {supplier.location}
        </div>
      </div>

      {/* Description */}
      <div className="p-5">
        <p className="line-clamp-3 text-sm leading-6 text-slate-500">
          {supplier.description ||
            "Business information available from this supplier."}
        </p>

        {/* Product / Service */}
        <div className="mt-4 rounded-xl bg-slate-50 p-4">
          {firstProduct ? (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <Package size={15} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Product
                </span>
              </div>

              <h4 className="mt-3 font-semibold text-[#0b1f3a]">
                {firstProduct.name}
              </h4>

              <p className="mt-2 text-sm font-bold text-orange-500">
                {firstProduct.priceType || "Price on Request"}
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <Truck size={15} />
                </div>

                <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Services
                </span>
              </div>

              <p className="mt-3 line-clamp-2 text-sm font-semibold text-[#0b1f3a]">
                {supplier.services?.join(" • ") ||
                  "Business services available"}
              </p>
            </>
          )}
        </div>

        {/* Actions */}
        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
          <Link
            to={`/suppliers/${supplier.id}`}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            View Supplier
            <ArrowRight size={15} />
          </Link>

          <button
            onClick={() => onCompare(supplier)}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
              false
                ? "border-blue-500 bg-blue-50 text-blue-600"
                : "border-slate-200 text-slate-500 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            }`}
            title="Compare"
          >
            <GitCompareArrows size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

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

  // =========================
  // DYNAMIC FILTER OPTIONS
  // =========================

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

  // =========================
  // FETCH SUPPLIERS
  // =========================

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

        setSuppliers(data.suppliers || []);
      } catch (err) {
        console.error("Supplier fetch error:", err);

        setError("Unable to load suppliers. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // =========================
  // FILTER SUPPLIERS
  // =========================

  const filteredSuppliers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return suppliers.filter((supplier) => {
      const matchesSearch =
        !query ||
        supplier.name?.toLowerCase().includes(query) ||
        supplier.industry?.toLowerCase().includes(query) ||
        supplier.location?.toLowerCase().includes(query) ||
        supplier.description?.toLowerCase().includes(query);

      const matchesCategory =
        category === "All Categories" || supplier.industry === category;

      const matchesLocation =
        location === "All Locations" || supplier.location === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [suppliers, search, category, location]);

  // =========================
  // LIKE
  // =========================

  const toggleLike = (id) => {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  };

  // =========================
  // COMPARE
  // =========================

  const handleCompare = (supplier) => {
    setCompare((current) => {
      if (current.some((item) => item.id === supplier.id)) {
        return current.filter((item) => item.id !== supplier.id);
      }

      if (current.length >= 3) {
        return current;
      }

      return [...current, supplier];
    });
  };

  // =========================
  // CLEAR FILTERS
  // =========================

  const clearFilters = () => {
    setCategory("All Categories");

    setLocation("All Locations");

    setSearch("");
  };

  return (
    <main className="min-h-screen bg-slate-50">
      {/* =========================
          HERO
      ========================= */}

      <section className="relative overflow-hidden bg-[#0952d4]">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-white/10 blur-3xl" />

        <div className="absolute -bottom-40 left-10 h-80 w-80 rounded-full bg-orange-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur">
              <ShieldCheck size={15} />
              Source from businesses across India
            </div>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find the Right
              <span className="block text-[#fd8836]">
                Suppliers for Your Business
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Discover manufacturers, suppliers, wholesalers and service
              providers. Compare options and request the best quote.
            </p>

            {/* Search */}

            <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search size={21} className="shrink-0 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search suppliers, products or services..."
                  className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                />
              </div>

              <button
                onClick={() => {}}
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Search
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Popular Searches */}

            <div className="mt-5 flex flex-wrap justify-center gap-3 text-xs text-blue-100">
              <span>Popular:</span>

              <button
                onClick={() => setSearch("Steel")}
                className="hover:text-white"
              >
                Steel
              </button>

              <button
                onClick={() => setSearch("Machinery")}
                className="hover:text-white"
              >
                Machinery
              </button>

              <button
                onClick={() => setSearch("Transport")}
                className="hover:text-white"
              >
                Transport
              </button>

              <button
                onClick={() => setSearch("Hardware")}
                className="hover:text-white"
              >
                Hardware
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          TRUST STRIP
      ========================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-slate-200 px-4 py-5 sm:grid-cols-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center gap-3 px-3">
            <Building2 className="text-blue-600" size={22} />

            <div>
              <p className="font-bold text-[#0b1f3a]">
                {loading ? "—" : suppliers.length}
              </p>

              <p className="text-xs text-slate-500">Suppliers</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-3">
            <CheckCircle2 className="text-blue-600" size={22} />

            <div>
              <p className="font-bold text-[#0b1f3a]">Verified</p>

              <p className="text-xs text-slate-500">Business profiles</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-3">
            <GitCompareArrows className="text-blue-600" size={22} />

            <div>
              <p className="font-bold text-[#0b1f3a]">Compare</p>

              <p className="text-xs text-slate-500">Multiple suppliers</p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-3">
            <Package className="text-orange-500" size={22} />

            <div>
              <p className="font-bold text-[#0b1f3a]">Best Quotes</p>

              <p className="text-xs text-slate-500">Request directly</p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================
          CONTENT
      ========================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* FILTER SIDEBAR */}

          <aside
            className={`w-full shrink-0 lg:block lg:w-64 ${
              showFilters ? "block" : "hidden"
            }`}
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
              <div className="mb-5 flex items-center justify-between">
                <h2 className="font-bold text-[#0b1f3a]">Filters</h2>

                <button
                  onClick={clearFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>

              {/* Category */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-blue-500"
                  >
                    {industries.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Location */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Location
                </label>

                <div className="relative">
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-blue-500"
                  >
                    {locations.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* Info */}

              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <ShieldCheck className="mb-2 text-blue-600" size={22} />

                <h3 className="text-sm font-bold text-[#0b1f3a]">
                  Source with confidence
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Compare suppliers, check business information and request
                  quotes before making a purchase decision.
                </p>
              </div>
            </div>
          </aside>

          {/* MAIN */}

          <div className="min-w-0 flex-1">
            <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#0b1f3a]">
                    Suppliers & Businesses
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-700">
                      {filteredSuppliers.length}
                    </span>{" "}
                    matching suppliers
                  </p>
                </div>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 lg:hidden"
                >
                  <SlidersHorizontal size={17} />
                  Filters
                </button>
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="text-sm font-semibold text-red-600">{error}</p>

                <button
                  onClick={() => window.location.reload()}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Retry
                </button>
              </div>
            )}

            {/* LOADING */}

            {loading ? (
              <div className="grid gap-5 md:grid-cols-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex gap-3">
                      <div className="h-14 w-14 rounded-xl bg-slate-200" />

                      <div className="flex-1">
                        <div className="h-4 w-2/3 rounded bg-slate-200" />

                        <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
                      </div>
                    </div>

                    <div className="mt-6 h-16 rounded-xl bg-slate-100" />

                    <div className="mt-5 h-10 rounded-xl bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : filteredSuppliers.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {filteredSuppliers.map((supplier) => (
                  <SupplierCard
                    key={supplier.id}
                    supplier={supplier}
                    liked={liked.includes(supplier.id)}
                    onLike={toggleLike}
                    onCompare={handleCompare}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Search className="text-slate-400" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#0b1f3a]">
                  No suppliers found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another product, category or location.
                </p>

                <button
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-[#0952d4] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =========================
          COMPARE BAR
      ========================= */}

      {compare.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 shadow-2xl backdrop-blur">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
            <div>
              <p className="font-bold text-[#0b1f3a]">Compare Suppliers</p>

              <p className="text-xs text-slate-500">
                {compare.length} of 3 suppliers selected
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {compare.map((supplier) => (
                <button
                  key={supplier.id}
                  onClick={() => handleCompare(supplier)}
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700"
                >
                  {supplier.name}

                  <X size={13} />
                </button>
              ))}

              <button className="rounded-xl bg-[#0952d4] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
                Compare Now
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
