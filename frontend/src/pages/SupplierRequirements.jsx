import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Package,
  MapPin,
  CalendarDays,
  ArrowRight,
  LoaderCircle,
  FileText,
  SlidersHorizontal,
  X,
  IndianRupee,
} from "lucide-react";
import { Link } from "react-router-dom";

function SupplierRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [location, setLocation] = useState("All Locations");

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/requirements");

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch buyer requirements");
        }

        const openRequirements = (data.requirements || []).filter(
          (requirement) => requirement.status === "open",
        );

        setRequirements(openRequirements);
      } catch (err) {
        console.error("Error fetching requirements:", err);
        setError(err.message || "Unable to load buyer requirements.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const categories = useMemo(() => {
    return [
      "All Categories",
      ...new Set(requirements.map((item) => item.category).filter(Boolean)),
    ];
  }, [requirements]);

  const locations = useMemo(() => {
    return [
      "All Locations",
      ...new Set(
        requirements.map((item) => item.delivery_location).filter(Boolean),
      ),
    ];
  }, [requirements]);

  const filteredRequirements = useMemo(() => {
    const searchTerm = search.trim().toLowerCase();

    return requirements.filter((requirement) => {
      const searchableText = [
        requirement.title,
        requirement.category,
        requirement.subcategory,
        requirement.description,
        requirement.delivery_location,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !searchTerm || searchableText.includes(searchTerm);

      const matchesCategory =
        category === "All Categories" || requirement.category === category;

      const matchesLocation =
        location === "All Locations" ||
        requirement.delivery_location === location;

      return matchesSearch && matchesCategory && matchesLocation;
    });
  }, [requirements, search, category, location]);

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setLocation("All Locations");
  };

  const hasFilters =
    search || category !== "All Categories" || location !== "All Locations";

  const formatCurrency = (value) => {
    if (value === null || value === undefined || value === "") {
      return null;
    }

    return `₹${Number(value).toLocaleString("en-IN")}`;
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <LoaderCircle
              size={42}
              className="mx-auto animate-spin text-[#0952d4]"
            />

            <p className="mt-4 text-sm font-bold text-slate-600">
              Loading buyer requirements...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-3xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
              <X size={28} className="text-red-500" />
            </div>

            <h1 className="mt-5 text-2xl font-black text-[#0b1f3a]">
              Unable to Load Requirements
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#0952d4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0744b5]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO */}
      <section className="relative overflow-hidden bg-[#1b5fd7]">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#0952d4]/30 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#fd8836]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
              <FileText size={15} />
              For Suppliers
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find Buyer Requirements.
              <span className="block text-[#fd8836]">Win More Business.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Discover active buyer requirements from businesses across India
              and send competitive quotations for products you can supply.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">
                  {requirements.length}
                </p>
                <p className="mt-1 text-xs font-medium text-white/60">
                  Open Requirements
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">
                  {categories.length - 1}
                </p>
                <p className="mt-1 text-xs font-medium text-white/60">
                  Categories
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <p className="text-2xl font-black text-white">
                  {locations.length - 1}
                </p>
                <p className="mt-1 text-xs font-medium text-white/60">
                  Locations
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* SEARCH / FILTER */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search buyer requirements..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-[#0952d4]/10"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#0b1f3a] outline-none focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-[#0b1f3a] outline-none focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
            >
              {locations.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>

            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
              >
                <X size={17} />
                Clear
              </button>
            ) : (
              <div className="hidden items-center justify-center gap-2 rounded-xl bg-blue-50 px-5 py-3 text-sm font-bold text-[#0952d4] lg:flex">
                <SlidersHorizontal size={17} />
                Filters
              </div>
            )}
          </div>
        </div>

        {/* RESULTS HEADER */}
        <div className="mb-6 mt-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-[#0952d4]">
              Buyer Marketplace
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0b1f3a] sm:text-3xl">
              Open Buyer Requirements
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {filteredRequirements.length} active requirement
              {filteredRequirements.length !== 1 ? "s" : ""} matching your
              search
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
            <Package size={15} />
            Ready for Quotations
          </div>
        </div>

        {/* EMPTY */}
        {filteredRequirements.length === 0 && (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">
              <FileText size={34} className="text-[#0952d4]" />
            </div>

            <h3 className="mt-6 text-2xl font-black text-[#0b1f3a]">
              No Buyer Requirements Found
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              No open requirements match your current search or filters. Try
              another category, location or keyword.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#0952d4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0744b5]"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

        {/* REQUIREMENTS */}
        {filteredRequirements.length > 0 && (
          <div className="grid gap-5">
            {filteredRequirements.map((requirement) => {
              const minBudget = formatCurrency(requirement.min_budget);

              const maxBudget = formatCurrency(requirement.max_budget);

              return (
                <article
                  key={requirement.id}
                  className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl sm:p-7"
                >
                  <div className="flex flex-col gap-7 lg:flex-row lg:justify-between">
                    {/* CONTENT */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-[#0952d4]">
                          {requirement.category}
                        </span>

                        {requirement.subcategory && (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
                            {requirement.subcategory}
                          </span>
                        )}

                        <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-black capitalize text-green-600">
                          ● Open
                        </span>
                      </div>

                      <h3 className="mt-4 text-xl font-black text-[#0b1f3a] sm:text-2xl">
                        {requirement.title}
                      </h3>

                      {requirement.description && (
                        <p className="mt-3 max-w-3xl line-clamp-2 text-sm leading-6 text-slate-500">
                          {requirement.description}
                        </p>
                      )}

                      {/* DETAILS */}
                      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <Package size={15} />
                            Quantity
                          </div>

                          <p className="mt-2 text-sm font-black text-[#0b1f3a]">
                            {requirement.quantity} {requirement.unit}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <MapPin size={15} />
                            Delivery
                          </div>

                          <p className="mt-2 text-sm font-black text-[#0b1f3a]">
                            {requirement.delivery_location}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <IndianRupee size={15} />
                            Budget
                          </div>

                          <p className="mt-2 text-sm font-black text-[#0b1f3a]">
                            {minBudget || maxBudget
                              ? `${minBudget || ""}${
                                  minBudget && maxBudget ? " – " : ""
                                }${maxBudget || ""}`
                              : "Not specified"}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-4">
                          <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                            <CalendarDays size={15} />
                            Required By
                          </div>

                          <p className="mt-2 text-sm font-black text-[#0b1f3a]">
                            {requirement.required_by
                              ? new Date(
                                  requirement.required_by,
                                ).toLocaleDateString("en-IN", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })
                              : "Flexible"}
                          </p>
                        </div>
                      </div>

                      {/* REQUIREMENT ID */}
                      <p className="mt-5 text-xs font-medium text-slate-400">
                        Requirement ID: #
                        {String(requirement.id).padStart(5, "0")}
                      </p>
                    </div>

                    {/* ACTION */}
                    <div className="flex shrink-0 flex-col justify-center gap-3 border-t border-slate-100 pt-5 lg:w-52 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                      <Link
                        to={`/requirements/${requirement.id}`}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#f77925]"
                      >
                        View Requirement
                        <ArrowRight size={17} />
                      </Link>

                      <Link
                        to={`/requirements/${requirement.id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-[#0b1f3a] transition hover:border-[#0952d4] hover:text-[#0952d4]"
                      >
                        Send Quote
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

export default SupplierRequirements;
