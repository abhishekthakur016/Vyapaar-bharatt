import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  IndianRupee,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  MessageCircle,
} from "lucide-react";

const API = "http://localhost:5000";

export default function MyQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const user = JSON.parse(
    localStorage.getItem("vyapaar_user") || "null"
  );

  const token = localStorage.getItem("vyapaar_token");

  const fetchMyQuotes = async (isRefresh = false) => {
    try {
      setError("");

      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      if (!token) {
        setError("Please login to view your quotes.");
        return;
      }

      const response = await fetch(`${API}/api/my-quotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to fetch your quotes."
        );
      }

      setQuotes(data.quotes || []);
    } catch (err) {
      console.error("My quotes error:", err);
      setError(err.message || "Failed to load your quotes.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchMyQuotes();
  }, []);

  const filteredQuotes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quotes.filter((quote) => {
      const matchesSearch =
        !query ||
        quote.requirement_title
          ?.toLowerCase()
          .includes(query) ||
        quote.requirement_category
          ?.toLowerCase()
          .includes(query) ||
        quote.message
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        quote.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: quotes.length,
      pending: quotes.filter(
        (q) => q.status === "pending"
      ).length,
      negotiating: quotes.filter(
        (q) => q.status === "negotiating"
      ).length,
      accepted: quotes.filter(
        (q) => q.status === "accepted"
      ).length,
      rejected: quotes.filter(
        (q) => q.status === "rejected"
      ).length,
    };
  }, [quotes]);

  const formatDate = (date) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatPrice = (price) => {
    if (price === null || price === undefined) {
      return "—";
    }

    return Number(price).toLocaleString("en-IN");
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
          icon: CheckCircle2,
        };

      case "rejected":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
          icon: XCircle,
        };

      case "negotiating":
        return {
          bg: "bg-orange-50",
          text: "text-orange-700",
          border: "border-orange-200",
          icon: MessageCircle,
        };

      default:
        return {
          bg: "bg-blue-50",
          text: "text-blue-700",
          border: "border-blue-200",
          icon: Clock3,
        };
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
            <FileText className="h-8 w-8 text-blue-600" />
          </div>

          <h1 className="text-2xl font-bold text-[#0b1f3a]">
            Login Required
          </h1>

          <p className="mt-3 text-slate-500">
            Please login as a supplier to view your submitted quotes.
          </p>

          <Link
            to="/login"
            className="mt-7 inline-flex rounded-xl bg-[#0952d4] px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-[#0952d4]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>

          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#0952d4]">
                Supplier Dashboard
              </p>

              <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0b1f3a] sm:text-4xl">
                My Quotes
              </h1>

              <p className="mt-2 max-w-2xl text-slate-500">
                Track the quotations you have submitted to buyer requirements.
              </p>

              {user?.name && (
                <p className="mt-2 text-sm text-slate-400">
                  Logged in as{" "}
                  <span className="font-semibold text-slate-600">
                    {user.name}
                  </span>
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => fetchMyQuotes(true)}
              disabled={refreshing}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-blue-200 hover:text-[#0952d4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Refresh
            </button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <StatCard
            label="Total Quotes"
            value={stats.total}
            icon={FileText}
          />

          <StatCard
            label="Pending"
            value={stats.pending}
            icon={Clock3}
          />

          <StatCard
            label="Negotiating"
            value={stats.negotiating}
            icon={MessageCircle}
          />

          <StatCard
            label="Accepted"
            value={stats.accepted}
            icon={CheckCircle2}
          />

          <StatCard
            label="Rejected"
            value={stats.rejected}
            icon={XCircle}
          />
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requirement, category..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:bg-white"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-400"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="negotiating">Negotiating</option>
              <option value="accepted">Accepted</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="flex flex-col items-center gap-3 text-slate-500">
              <LoaderCircle className="h-8 w-8 animate-spin text-[#0952d4]" />
              <p>Loading your quotes...</p>
            </div>
          </div>
        ) : filteredQuotes.length === 0 ? (
          /* Empty */
          <div className="mt-8 rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100">
              <FileText className="h-8 w-8 text-slate-400" />
            </div>

            <h2 className="text-xl font-bold text-[#0b1f3a]">
              No quotes found
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {quotes.length === 0
                ? "You haven't submitted any quotes yet."
                : "No quotes match your current search or status filter."}
            </p>

            {quotes.length === 0 && (
              <Link
                to="/supplier/requirements"
                className="mt-6 inline-flex rounded-xl bg-[#0952d4] px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Find Buyer Requirements
              </Link>
            )}
          </div>
        ) : (
          /* Quotes */
          <div className="mt-8 space-y-5">
            {filteredQuotes.map((quote) => {
              const status = getStatusStyle(
                quote.status
              );

              const StatusIcon = status.icon;

              return (
                <div
                  key={quote.id}
                  className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      {/* Requirement */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0952d4]">
                            Requirement #{quote.requirement_id}
                          </span>

                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize ${status.bg} ${status.text} ${status.border}`}
                          >
                            <StatusIcon className="h-3.5 w-3.5" />
                            {quote.status || "pending"}
                          </span>
                        </div>

                        <h2 className="mt-3 text-xl font-bold text-[#0b1f3a]">
                          {quote.requirement_title ||
                            "Buyer Requirement"}
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                          {quote.requirement_category ||
                            "General"}
                        </p>
                      </div>

                      {/* Price */}
                      <div className="rounded-2xl bg-slate-50 px-5 py-4 lg:min-w-[190px]">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Your Quote
                        </p>

                        <div className="mt-1 flex items-center gap-1 text-xl font-bold text-[#0b1f3a]">
                          <IndianRupee className="h-5 w-5" />
                          {formatPrice(quote.quoted_price)}
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          {quote.unit || "Unit"}
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
                      <InfoItem
                        label="Quantity"
                        value={`${quote.quantity || "—"} ${
                          quote.unit || ""
                        }`}
                      />

                      <InfoItem
                        label="Delivery Time"
                        value={quote.delivery_time || "Not specified"}
                      />

                      <InfoItem
                        label="Delivery Location"
                        value={
                          quote.requirement_delivery_location ||
                          "Not specified"
                        }
                        icon={MapPin}
                      />

                      <InfoItem
                        label="Submitted"
                        value={formatDate(quote.created_at)}
                      />
                    </div>

                    {/* Message */}
                    {quote.message && (
                      <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Your Message
                        </p>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {quote.message}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-5 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-slate-400">
                        Last updated:{" "}
                        {formatDate(
                          quote.updated_at || quote.created_at
                        )}
                      </p>

                      <Link
                        to={`/requirements/${quote.requirement_id}`}
                        className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-[#0952d4]"
                      >
                        View Requirement
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-1 text-2xl font-bold text-[#0b1f3a]">
            {value}
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50">
          <Icon className="h-5 w-5 text-[#0952d4]" />
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <div className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-slate-700">
        {Icon && (
          <Icon className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
        )}

        <span>{value}</span>
      </div>
    </div>
  );
}