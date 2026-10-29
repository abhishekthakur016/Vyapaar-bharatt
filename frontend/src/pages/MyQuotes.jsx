import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  LoaderCircle,
  MapPin,
  RefreshCw,
  Search,
  Clock3,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Package,
  Truck,
  CalendarDays,
  SlidersHorizontal,
  ChevronDown,
  X,
  Quote,
} from "lucide-react";

const API = "";

export default function MyQuotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const user = JSON.parse(localStorage.getItem("vyapaar_user") || "null");

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
        throw new Error(data.message || "Failed to fetch your quotes.");
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
        quote.requirement_title?.toLowerCase().includes(query) ||
        quote.requirement_category?.toLowerCase().includes(query) ||
        quote.message?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || quote.status?.toLowerCase() === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [quotes, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: quotes.length,
      pending: quotes.filter((q) => q.status === "pending").length,
      negotiating: quotes.filter((q) => q.status === "negotiating").length,
      accepted: quotes.filter((q) => q.status === "accepted").length,
      rejected: quotes.filter((q) => q.status === "rejected").length,
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

  // Brand-matched status styles
  const getStatusStyle = (status) => {
    switch (status) {
      case "accepted":
        return {
          pill: "bg-emerald-50 text-emerald-700 ring-emerald-200/70",
          dot: "bg-emerald-500",
          icon: CheckCircle2,
        };

      case "rejected":
        return {
          pill: "bg-red-50 text-red-600 ring-red-200/70",
          dot: "bg-red-500",
          icon: XCircle,
        };

      case "negotiating":
        return {
          pill: "bg-[#fd8836]/10 text-[#e0661a] ring-[#fd8836]/30",
          dot: "bg-[#fd8836]",
          icon: MessageCircle,
        };

      default:
        return {
          pill: "bg-[#0952d4]/[0.07] text-[#0952d4] ring-[#0952d4]/20",
          dot: "bg-[#0952d4]",
          icon: Clock3,
        };
    }
  };

  const hasFilters = search || statusFilter !== "all";

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
  };

  /* =========================================================
     LOGIN REQUIRED
  ========================================================= */

  if (!token) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-xl items-center justify-center px-4">
          <div className="mq-fade w-full rounded-[28px] bg-white p-10 text-center shadow-[0_20px_50px_-25px_rgba(9,82,212,0.35)] ring-1 ring-slate-900/[0.05]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0952d4] to-[#1684e8] text-white shadow-[0_10px_25px_-10px_rgba(9,82,212,0.7)]">
              <FileText size={28} />
            </div>

            <h1 className="mt-6 text-2xl font-black tracking-tight text-[#0b1f3a]">
              Login Required
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-500">
              Please login as a supplier to view your submitted quotes.
            </p>

            <Link
              to="/login"
              className="mt-7 inline-flex rounded-xl bg-[#0952d4] px-7 py-3 text-sm font-bold text-white transition hover:bg-[#0744b5]"
            >
              Login
            </Link>
          </div>
        </div>
        <AnimStyles />
      </main>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HERO — same style as Supplier Requirements */}
      <section className="relative overflow-hidden bg-[#1b5fd7]">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#0952d4]/30 blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 h-80 w-80 rounded-full bg-[#fd8836]/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
            >
              <ArrowLeft size={16} />
              Back to Home
            </Link>

            <button
              type="button"
              onClick={() => fetchMyQuotes(true)}
              disabled={refreshing}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur transition hover:bg-white hover:text-[#0952d4] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <RefreshCw
                size={15}
                className={refreshing ? "animate-spin" : ""}
              />
              <span className="hidden sm:inline">
                {refreshing ? "Refreshing..." : "Refresh"}
              </span>
            </button>
          </div>

          <div className="mt-8 max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-wider text-white">
              <FileText size={15} />
              Supplier Dashboard
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              My Quotes.
              <span className="block text-[#fd8836]">Track Every Deal.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
              Track the quotations you have submitted to buyer requirements.
            </p>

            {user?.name && (
              <p className="mt-3 text-sm text-white/60">
                Logged in as{" "}
                <span className="font-bold text-white">{user.name}</span>
              </p>
            )}
          </div>

          {/* Stats */}
          <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            <StatCard
              label="Total Quotes"
              value={stats.total}
              icon={FileText}
              className="col-span-2 sm:col-span-1"
            />
            <StatCard label="Pending" value={stats.pending} icon={Clock3} />
            <StatCard
              label="Negotiating"
              value={stats.negotiating}
              icon={MessageCircle}
              accent
            />
            <StatCard
              label="Accepted"
              value={stats.accepted}
              icon={CheckCircle2}
            />
            <StatCard label="Rejected" value={stats.rejected} icon={XCircle} />
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* SEARCH / FILTER */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_auto]">
            <div className="relative">
              <Search
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search requirement, category..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-[#0952d4]/10"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-10 text-sm font-medium text-[#0b1f3a] outline-none focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="negotiating">Negotiating</option>
                <option value="accepted">Accepted</option>
                <option value="rejected">Rejected</option>
              </select>
              <ChevronDown
                size={16}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
            </div>

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
              Quotation History
            </p>

            <h2 className="mt-2 text-2xl font-black text-[#0b1f3a] sm:text-3xl">
              Submitted Quotes
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {filteredQuotes.length} quote
              {filteredQuotes.length !== 1 ? "s" : ""} matching your search
            </p>
          </div>

          <Link
            to="/supplier/requirements"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm transition hover:text-[#0952d4]"
          >
            <Package size={15} />
            Find More Requirements
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-red-200 bg-white p-4 text-sm font-medium text-red-600 shadow-sm">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50">
              <X size={16} />
            </div>
            {error}
          </div>
        )}

        {/* LOADING */}
        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="text-center">
              <LoaderCircle
                size={42}
                className="mx-auto animate-spin text-[#0952d4]"
              />
              <p className="mt-4 text-sm font-bold text-slate-600">
                Loading your quotes...
              </p>
            </div>
          </div>
        ) : filteredQuotes.length === 0 ? (
          /* EMPTY */
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-blue-50">
              <FileText size={34} className="text-[#0952d4]" />
            </div>

            <h3 className="mt-6 text-2xl font-black text-[#0b1f3a]">
              No Quotes Found
            </h3>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-slate-500">
              {quotes.length === 0
                ? "You haven't submitted any quotes yet."
                : "No quotes match your current search or status filter."}
            </p>

            {quotes.length === 0 ? (
              <Link
                to="/supplier/requirements"
                className="mt-6 inline-flex rounded-xl bg-[#0952d4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0744b5]"
              >
                Find Buyer Requirements
              </Link>
            ) : (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 rounded-xl bg-[#0952d4] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#0744b5]"
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          /* QUOTE CARDS */
          <div className="grid gap-6 md:grid-cols-2 xl:gap-7">
            {filteredQuotes.map((quote, index) => {
              const status = getStatusStyle(quote.status);
              const StatusIcon = status.icon;

              return (
                <article
                  key={quote.id}
                  className="mq-fade group relative rounded-[28px] p-px"
                  style={{ animationDelay: `${Math.min(index, 8) * 70}ms` }}
                >
                  {/* Gradient border on hover */}
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-[28px] bg-gradient-to-br from-[#0952d4]/40 via-[#1684e8]/10 to-[#fd8836]/50 opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 rounded-[28px] ring-1 ring-inset ring-slate-900/[0.06] transition-opacity duration-500 group-hover:opacity-0"
                  />

                  <div className="relative flex h-full flex-col overflow-hidden rounded-[27px] bg-white p-6 shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_30px_-15px_rgba(15,23,42,0.12)] transition-[transform,box-shadow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1.5 group-hover:shadow-[0_30px_60px_-25px_rgba(9,82,212,0.35)] sm:p-7">
                    {/* Corner glow */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -right-24 -top-24 h-56 w-56 rounded-full bg-[#1684e8]/[0.07] blur-2xl transition-all duration-700 group-hover:-right-16 group-hover:-top-16 group-hover:bg-[#fd8836]/[0.12]"
                    />

                    {/* TOP ROW */}
                    <div className="relative flex items-center justify-between gap-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-[#0952d4]/[0.07] px-3 py-1 text-xs font-bold text-[#0952d4]">
                        <span className="h-1.5 w-1.5 rounded-full bg-[#0952d4]" />
                        Requirement #{quote.requirement_id}
                      </span>

                      <span
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ring-1 ring-inset ${status.pill}`}
                      >
                        <StatusIcon size={13} />
                        {quote.status || "pending"}
                      </span>
                    </div>

                    {/* TITLE */}
                    <Link
                      to={`/requirements/${quote.requirement_id}`}
                      className="relative mt-5 block"
                    >
                      <h3 className="line-clamp-2 text-xl font-extrabold leading-snug tracking-[-0.02em] text-[#0b1f3a] transition-colors duration-300 group-hover:text-[#0952d4] sm:text-[22px]">
                        {quote.requirement_title || "Buyer Requirement"}
                      </h3>
                    </Link>

                    <p className="relative mt-1.5 text-sm font-medium text-slate-400">
                      {quote.requirement_category || "General"}
                    </p>

                    {/* YOUR QUOTE */}
                    <div className="relative mt-6 flex items-end justify-between gap-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                          Your Quote
                        </p>
                        <p className="mt-1 text-2xl font-black tracking-[-0.03em] text-[#0b1f3a] sm:text-[28px]">
                          ₹{formatPrice(quote.quoted_price)}
                          <span className="ml-1.5 text-sm font-semibold tracking-normal text-slate-400">
                            / {quote.unit || "Unit"}
                          </span>
                        </p>
                      </div>

                      <span
                        className={`mb-2 h-2.5 w-2.5 shrink-0 rounded-full ${status.dot} shadow-[0_0_0_4px_rgba(255,255,255,1)]`}
                        aria-hidden
                      />
                    </div>

                    {/* META */}
                    <dl className="relative mt-6 grid grid-cols-2 gap-y-4 rounded-2xl bg-slate-50/80 py-4 ring-1 ring-inset ring-slate-900/[0.03] sm:grid-cols-4 sm:divide-x sm:divide-slate-200/70">
                      <InfoItem
                        label="Qty"
                        icon={Package}
                        value={`${quote.quantity || "—"} ${quote.unit || ""}`}
                      />
                      <InfoItem
                        label="Delivery"
                        icon={Truck}
                        value={quote.delivery_time || "Not specified"}
                      />
                      <InfoItem
                        label="Location"
                        icon={MapPin}
                        value={
                          quote.requirement_delivery_location || "Not specified"
                        }
                      />
                      <InfoItem
                        label="Submitted"
                        icon={CalendarDays}
                        value={formatDate(quote.created_at)}
                      />
                    </dl>

                    {/* MESSAGE */}
                    {quote.message && (
                      <div className="relative mt-4 flex gap-3 rounded-2xl border border-dashed border-slate-200 p-4">
                        <Quote
                          size={16}
                          className="mt-0.5 shrink-0 text-[#fd8836]"
                        />
                        <div className="min-w-0">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                            Your Message
                          </p>
                          <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-slate-600">
                            {quote.message}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* FOOTER */}
                    <div className="relative mt-auto flex items-center justify-between gap-3 pt-6">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400">
                        <Clock3 size={12} />
                        Updated{" "}
                        {formatDate(quote.updated_at || quote.created_at)}
                      </span>

                      <Link
                        to={`/requirements/${quote.requirement_id}`}
                        className="group/btn inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-[#0b1f3a] pl-5 pr-1.5 text-sm font-semibold text-white transition-all duration-300 hover:bg-[#fd8836] hover:shadow-[0_12px_24px_-10px_rgba(253,136,54,0.9)]"
                      >
                        <span className="hidden sm:inline">
                          View Requirement
                        </span>
                        <span className="sm:hidden">View</span>
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 group-hover/btn:rotate-45">
                          <ArrowUpRight size={16} />
                        </span>
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <AnimStyles />
    </main>
  );
}

/* =========================================================
   STAT CARD — glass style like Supplier Requirements hero
========================================================= */

function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
  className = "",
}) {
  return (
    <div
      className={`group rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur transition-all duration-500 hover:-translate-y-0.5 hover:bg-white/15 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-2xl font-black text-white">{value}</p>
          <p className="mt-1 text-xs font-medium text-white/60">{label}</p>
        </div>

        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-500 group-hover:-rotate-6 ${
            accent ? "bg-[#fd8836] text-white" : "bg-white/15 text-white"
          }`}
        >
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   INFO ITEM — compact meta cell
========================================================= */

function InfoItem({ label, value, icon: Icon }) {
  return (
    <div className="min-w-0 px-4">
      <dt className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
        {Icon && <Icon size={12} />}
        {label}
      </dt>
      <dd
        className="mt-1 truncate text-sm font-bold text-[#0b1f3a]"
        title={typeof value === "string" ? value : undefined}
      >
        {value}
      </dd>
    </div>
  );
}

/* =========================================================
   ANIMATIONS
========================================================= */

function AnimStyles() {
  return (
    <style>{`
      @keyframes mqFadeUp {
        from { opacity: 0; transform: translateY(14px); }
        to   { opacity: 1; transform: translateY(0); }
      }
      .mq-fade { animation: mqFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
      @media (prefers-reduced-motion: reduce) {
        .mq-fade { animation: none; }
        .mq-fade * { transition: none !important; }
      }
    `}</style>
  );
}
