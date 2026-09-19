import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  FileText,
  IndianRupee,
  LoaderCircle,
  MapPin,
  Package,
  Plus,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

const API_BASE = "http://localhost:5000";

function formatDate(date) {
  if (!date) return "Not specified";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatBudget(min, max) {
  if (min != null && max != null) {
    return `₹${Number(min).toLocaleString("en-IN")} - ₹${Number(
      max
    ).toLocaleString("en-IN")}`;
  }

  if (max != null) {
    return `Up to ₹${Number(max).toLocaleString("en-IN")}`;
  }

  if (min != null) {
    return `From ₹${Number(min).toLocaleString("en-IN")}`;
  }

  return "Not specified";
}

function getStatusClasses(status) {
  switch ((status || "").toLowerCase()) {
    case "accepted":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";

    case "rejected":
      return "bg-red-50 text-red-700 border-red-200";

    case "quoted":
      return "bg-blue-50 text-blue-700 border-blue-200";

    case "negotiating":
      return "bg-amber-50 text-amber-700 border-amber-200";

    case "closed":
      return "bg-slate-100 text-slate-700 border-slate-200";

    default:
      return "bg-orange-50 text-orange-700 border-orange-200";
  }
}

function getStatusLabel(status) {
  if (!status) return "Open";

  return status.charAt(0).toUpperCase() + status.slice(1);
}

export default function MyRequirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchMyRequirements = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const token = localStorage.getItem("vyapaar_token");

      if (!token) {
        throw new Error("Please login as a buyer to view your requirements.");
      }

      const response = await fetch(
        `${API_BASE}/api/my-requirements`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch your requirements."
        );
      }

      setRequirements(data.requirements || []);
    } catch (err) {
      console.error("My requirements error:", err);
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyRequirements();
  }, []);

  const statuses = useMemo(() => {
    const uniqueStatuses = [
      ...new Set(
        requirements
          .map((item) => item.status)
          .filter(Boolean)
      ),
    ];

    return ["All", ...uniqueStatuses];
  }, [requirements]);

  const filteredRequirements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return requirements.filter((requirement) => {
      const matchesSearch =
        !query ||
        requirement.title?.toLowerCase().includes(query) ||
        requirement.category?.toLowerCase().includes(query) ||
        requirement.subcategory?.toLowerCase().includes(query) ||
        requirement.delivery_location?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        requirement.status?.toLowerCase() ===
          statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [requirements, search, statusFilter]);

  const stats = useMemo(() => {
    const total = requirements.length;

    const open = requirements.filter(
      (item) =>
        item.status === "open" ||
        item.status === "quoted" ||
        item.status === "negotiating"
    ).length;

    const accepted = requirements.filter(
      (item) => item.status === "accepted"
    ).length;

    const quotes = requirements.reduce(
      (totalQuotes, item) =>
        totalQuotes + Number(item.quote_count || 0),
      0
    );

    return {
      total,
      open,
      accepted,
      quotes,
    };
  }, [requirements]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-medium text-[#0952d4]">
                <FileText size={16} />
                Buyer Dashboard
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#0b1f3a] sm:text-4xl">
                My Requirements
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
                Manage your posted requirements and view supplier quotes
                received for each requirement.
              </p>
            </div>

            <Link
              to="/post-requirement"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#f47722]"
            >
              <Plus size={18} />
              Post New Requirement
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Total Requirements
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0b1f3a]">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Active Requirements
            </p>
            <p className="mt-2 text-3xl font-bold text-[#0952d4]">
              {stats.open}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Quotes Received
            </p>
            <p className="mt-2 text-3xl font-bold text-[#fd8836]">
              {stats.quotes}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Accepted
            </p>
            <p className="mt-2 text-3xl font-bold text-emerald-600">
              {stats.accepted}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto max-w-7xl px-4 pb-5 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search your requirements..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-[#0952d4]"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "All"
                    ? "All Statuses"
                    : getStatusLabel(status)}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => fetchMyRequirements(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              <RefreshCw
                size={17}
                className={refreshing ? "animate-spin" : ""}
              />
              Refresh
            </button>

            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={17} />
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <LoaderCircle
                size={32}
                className="mx-auto animate-spin text-[#0952d4]"
              />

              <p className="mt-3 text-sm text-slate-500">
                Loading your requirements...
              </p>
            </div>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-semibold text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() => fetchMyRequirements()}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        ) : filteredRequirements.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#0952d4]">
              <FileText size={26} />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0b1f3a]">
              {requirements.length === 0
                ? "No requirements yet"
                : "No matching requirements"}
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              {requirements.length === 0
                ? "Post your first requirement and start receiving quotes from verified suppliers."
                : "Try changing your search or status filter."}
            </p>

            {requirements.length === 0 && (
              <Link
                to="/post-requirement"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-semibold text-white"
              >
                Post Requirement
                <ArrowRight size={17} />
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">
                  {filteredRequirements.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-700">
                  {requirements.length}
                </span>{" "}
                requirements
              </p>
            </div>

            {filteredRequirements.map((requirement) => (
              <div
                key={requirement.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-md"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0952d4]">
                          Requirement #{requirement.id}
                        </span>

                        <span
                          className={`rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                            requirement.status
                          )}`}
                        >
                          {getStatusLabel(requirement.status)}
                        </span>
                      </div>

                      <h2 className="mt-3 text-xl font-bold text-[#0b1f3a]">
                        {requirement.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {requirement.category}
                        {requirement.subcategory
                          ? ` • ${requirement.subcategory}`
                          : ""}
                      </p>

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <Package size={17} />
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Quantity
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-700">
                              {Number(
                                requirement.quantity || 0
                              ).toLocaleString("en-IN")}{" "}
                              {requirement.unit}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <IndianRupee size={17} />
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Budget
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-700">
                              {formatBudget(
                                requirement.min_budget,
                                requirement.max_budget
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <MapPin size={17} />
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Delivery
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-700">
                              {requirement.delivery_location ||
                                "Not specified"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="rounded-lg bg-slate-100 p-2 text-slate-600">
                            <CalendarDays size={17} />
                          </div>

                          <div>
                            <p className="text-xs text-slate-400">
                              Required By
                            </p>

                            <p className="mt-0.5 text-sm font-semibold text-slate-700">
                              {formatDate(
                                requirement.required_by
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full shrink-0 lg:w-[220px]">
                      <div className="rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Supplier Quotes
                        </p>

                        <div className="mt-2 flex items-end gap-2">
                          <span className="text-3xl font-bold text-[#0952d4]">
                            {Number(
                              requirement.quote_count || 0
                            )}
                          </span>

                          <span className="pb-1 text-sm text-slate-500">
                            {Number(
                              requirement.quote_count || 0
                            ) === 1
                              ? "quote received"
                              : "quotes received"}
                          </span>
                        </div>

                        {Number(requirement.quote_count || 0) > 0 && (
                          <p className="mt-2 text-xs leading-5 text-slate-500">
                            Open this requirement to review supplier
                            quotes and take action.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-slate-400">
                      Posted{" "}
                      {formatDate(requirement.created_at)}
                    </p>

                    <Link
                      to={`/requirements/${requirement.id}`}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0745b4]"
                    >
                      {Number(requirement.quote_count || 0) > 0
                        ? "View Quotes"
                        : "View Requirement"}
                      <ArrowRight size={17} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}