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
  Send,
  Hash,
  Boxes,
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

  // Display-only helper: how many days until the required-by date
  const getDaysLeft = (date) => {
    if (!date) return null;
    const target = new Date(date);
    if (Number.isNaN(target.getTime())) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    return Math.round((target - today) / 86400000);
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

        {/* =====================================================
            REQUIREMENTS — redesigned cards
        ===================================================== */}
        {filteredRequirements.length > 0 && (
          <div className="grid gap-5 lg:grid-cols-2">
            {filteredRequirements.map((requirement) => {
              const minBudget = formatCurrency(requirement.min_budget);
              const maxBudget = formatCurrency(requirement.max_budget);
              const hasBudget = Boolean(minBudget || maxBudget);
              const budgetText = hasBudget
                ? `${minBudget || ""}${minBudget && maxBudget ? " – " : ""}${
                    maxBudget || ""
                  }`
                : "Not specified";

              const daysLeft = getDaysLeft(requirement.required_by);
              const urgent =
                daysLeft !== null && daysLeft >= 0 && daysLeft <= 7;

              const requiredByText = requirement.required_by
                ? new Date(requirement.required_by).toLocaleDateString(
                    "en-IN",
                    { day: "2-digit", month: "short", year: "numeric" },
                  )
                : "Flexible";

              return (
                <article
                  key={requirement.id}
                  className="group relative flex flex-col overflow-hidden rounded-[22px] border border-slate-200/80 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(9,82,212,0.12)] transition duration-300 hover:-translate-y-1 hover:border-[#0952d4]/25 hover:shadow-[0_20px_50px_-20px_rgba(9,82,212,0.35)]"
                >
                  {/* Top accent bar */}
                  <div className="h-1 w-full bg-gradient-to-r from-[#0952d4] via-[#1684e8] to-[#fd8836] opacity-70 transition group-hover:opacity-100" />

                  <div className="flex flex-1 flex-col p-5 sm:p-6">
                    {/* HEADER */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0952d4] to-[#1684e8] text-white shadow-[0_8px_18px_-6px_rgba(9,82,212,0.6)]">
                        <Boxes size={22} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="rounded-md bg-[#0952d4]/[0.08] px-2 py-1 text-[11px] font-extrabold text-[#0952d4]">
                            {requirement.category}
                          </span>

                          {requirement.subcategory && (
                            <span className="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-bold text-slate-600">
                              {requirement.subcategory}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-2 line-clamp-2 text-lg font-black leading-snug tracking-tight text-[#0b1f3a] transition group-hover:text-[#0952d4] sm:text-xl">
                          {requirement.title}
                        </h3>
                      </div>

                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-[11px] font-extrabold text-green-700">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-60" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                        </span>
                        Open
                      </span>
                    </div>

                    {requirement.description && (
                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                        {requirement.description}
                      </p>
                    )}

                    {/* BUDGET HIGHLIGHT */}
                    <div className="mt-5 flex items-center justify-between gap-3 rounded-2xl border border-[#fd8836]/20 bg-gradient-to-r from-[#fd8836]/[0.08] to-transparent px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white text-[#fd8836] shadow-sm">
                          <IndianRupee size={16} />
                        </div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                          Budget
                        </span>
                      </div>
                      <p
                        className={`text-right text-base font-black tracking-tight sm:text-lg ${
                          hasBudget
                            ? "text-[#0b1f3a]"
                            : "text-sm text-slate-400"
                        }`}
                      >
                        {budgetText}
                      </p>
                    </div>

                    {/* DETAILS */}
                    <dl className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 sm:flex-col sm:items-start sm:gap-1.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0952d4] shadow-sm sm:h-7 sm:w-7">
                          <Package size={15} />
                        </div>
                        <div className="min-w-0">
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Quantity
                          </dt>
                          <dd className="truncate text-sm font-extrabold text-[#0b1f3a]">
                            {requirement.quantity} {requirement.unit}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 sm:flex-col sm:items-start sm:gap-1.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#0952d4] shadow-sm sm:h-7 sm:w-7">
                          <MapPin size={15} />
                        </div>
                        <div className="min-w-0">
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Delivery
                          </dt>
                          <dd
                            className="truncate text-sm font-extrabold text-[#0b1f3a]"
                            title={requirement.delivery_location}
                          >
                            {requirement.delivery_location}
                          </dd>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 rounded-xl bg-slate-50 px-3 py-2.5 sm:flex-col sm:items-start sm:gap-1.5">
                        <div
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg shadow-sm sm:h-7 sm:w-7 ${
                            urgent
                              ? "bg-[#fd8836] text-white"
                              : "bg-white text-[#0952d4]"
                          }`}
                        >
                          <CalendarDays size={15} />
                        </div>
                        <div className="min-w-0">
                          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Required By
                          </dt>
                          <dd className="truncate text-sm font-extrabold text-[#0b1f3a]">
                            {requiredByText}
                          </dd>
                        </div>
                      </div>
                    </dl>

                    {/* FOOTER */}
                    <div className="mt-auto pt-5">
                      <div className="flex flex-col gap-3 border-t border-dashed border-slate-200 pt-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 font-mono text-[11px] font-semibold text-slate-500">
                            <Hash size={11} />
                            {String(requirement.id).padStart(5, "0")}
                          </span>

                          {daysLeft !== null && daysLeft >= 0 && (
                            <span
                              className={`rounded-md px-2 py-1 text-[11px] font-bold ${
                                urgent
                                  ? "bg-[#fd8836]/10 text-[#e0661a]"
                                  : "bg-[#0952d4]/[0.06] text-[#0952d4]"
                              }`}
                            >
                              {daysLeft === 0
                                ? "Due today"
                                : `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-2 sm:flex">
                          <Link
                            to={`/requirements/${requirement.id}`}
                            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-[#0b1f3a] transition hover:border-[#0952d4] hover:bg-[#0952d4]/[0.04] hover:text-[#0952d4]"
                          >
                            <Send size={15} />
                            Send Quote
                          </Link>

                          <Link
                            to={`/requirements/${requirement.id}`}
                            className="group/btn inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#fd8836] px-4 py-2.5 text-sm font-black text-white shadow-[0_8px_18px_-8px_rgba(253,136,54,0.8)] transition hover:bg-[#f77925]"
                          >
                            View Details
                            <ArrowRight
                              size={16}
                              className="transition group-hover/btn:translate-x-0.5"
                            />
                          </Link>
                        </div>
                      </div>
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
