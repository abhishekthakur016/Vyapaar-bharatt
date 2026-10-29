import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Factory,
  Globe2,
  LayoutGrid,
  Lightbulb,
  Search,
  Settings2,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";

import { insightCategories } from "../data/insights";

const categoryIcons = {
  chart: BarChart3,
  trend: TrendingUp,
  book: BookOpen,
  bulb: Lightbulb,
  globe: Globe2,
  factory: Factory,
};

/* =========================================================
   SMALL PRESENTATIONAL PIECES
========================================================= */

// Image with a smooth zoom on hover and a branded fallback when no image exists
function InsightImage({ src, alt, className = "" }) {
  return (
    <div className={`relative overflow-hidden bg-[#0b1f3a] ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0952d4] via-[#1684e8] to-[#0b1f3a]">
          <Lightbulb size={34} className="text-white/40" />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071a40]/70 via-[#071a40]/10 to-transparent" />
    </div>
  );
}

function CategoryChip({ children }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
      {children}
    </span>
  );
}

function SectionLabel({ eyebrow, title, children }) {
  return (
    <div>
      <p className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#0952d4]">
        <span className="h-px w-6 bg-[#0952d4]/50" />
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-[-0.02em] text-[#0b1f3a] sm:text-3xl">
        {title}
      </h2>
      {children}
    </div>
  );
}

/* =========================================================
   PAGE
========================================================= */

function Insights() {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = searchParams.get("category") || "all";

  const [search, setSearch] = useState("");
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/insights");
        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch insights");
        }

        setInsights(data.insights || []);
      } catch (err) {
        console.error("Error fetching insights:", err);
        setError(err.message || "Unable to load insights.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const filteredInsights = useMemo(() => {
    return insights.filter((insight) => {
      const matchesCategory =
        selectedCategory === "all" || insight.categoryId === selectedCategory;

      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        insight.title.toLowerCase().includes(searchText) ||
        insight.excerpt.toLowerCase().includes(searchText) ||
        insight.category.toLowerCase().includes(searchText);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, search, insights]);

  const featuredInsights = insights.slice(0, 3);

  const selectCategory = (categoryId) => {
    if (categoryId === "all") {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: categoryId });
  };

  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
  };

  const activeCategoryName =
    selectedCategory === "all"
      ? "All Insights"
      : insightCategories.find((item) => item.id === selectedCategory)?.name;

  const showFeatured =
    !loading &&
    !error &&
    selectedCategory === "all" &&
    !search &&
    insights.length > 0;

  return (
    <main className="overflow-hidden bg-white">
      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="relative isolate">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-[#f8fcff] via-[#eef7ff] to-[#e3f1ff]" />
          <div
            className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_25%,transparent_70%)]"
            style={{
              backgroundImage:
                "radial-gradient(rgba(9,82,212,0.16) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />
          <div className="absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-[#1684e8]/10 blur-3xl" />
          <div className="absolute -right-32 top-20 h-[420px] w-[420px] rounded-full bg-[#fd8836]/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pb-20">
          <div className="flex items-center justify-between gap-4">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#0952d4]/15 bg-white/80 px-3.5 py-1.5 shadow-sm backdrop-blur-md">
              <Sparkles size={14} className="text-[#fd8836]" />
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-[#0b1f3a]">
                Vyapaar Bharat Insights
              </span>
            </div>

            <Link
              to="/admin/insights"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-xs font-semibold text-slate-600 ring-1 ring-inset ring-slate-200 backdrop-blur-md transition-all duration-300 hover:text-[#0952d4] hover:ring-[#0952d4]/40"
            >
              <Settings2 size={14} />
              <span className="hidden sm:inline">Manage Insights</span>
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-3xl text-center sm:mt-12">
            <h1 className="text-[40px] font-black leading-[1.02] tracking-[-0.035em] text-[#071a40] sm:text-6xl lg:text-[68px]">
              Insights to help your{" "}
              <span className="bg-gradient-to-r from-[#0952d4] to-[#1684e8] bg-clip-text text-transparent">
                business grow
              </span>
            </h1>

            <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Market insights, industry trends, sourcing guides and trade
              opportunities, so you can make better business decisions.
            </p>

            {/* SEARCH */}
            <div className="mx-auto mt-8 max-w-xl">
              <div className="group/search relative rounded-2xl bg-white p-1.5 shadow-[0_15px_45px_-15px_rgba(9,82,212,0.3)] ring-1 ring-slate-900/[0.06] transition-all duration-300 focus-within:shadow-[0_20px_50px_-15px_rgba(9,82,212,0.45)] focus-within:ring-[#0952d4]/30">
                <Search
                  size={19}
                  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within/search:text-[#0952d4]"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search articles, trends, guides..."
                  className="w-full rounded-xl bg-transparent py-3.5 pl-11 pr-12 text-sm text-[#0b1f3a] outline-none placeholder:text-slate-400"
                />

                {search && (
                  <button
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          CATEGORIES
      ===================================================== */}
      <section className="relative bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <SectionLabel eyebrow="Explore" title="Browse by topic">
            <p className="mt-2 text-sm text-slate-500">
              Pick a topic to filter insights designed to help you make smarter
              decisions.
            </p>
          </SectionLabel>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                id: "all",
                name: "All Insights",
                description: "Everything we publish, newest first.",
                Icon: LayoutGrid,
              },
              ...insightCategories.map((c) => ({
                ...c,
                Icon: categoryIcons[c.icon] || Lightbulb,
              })),
            ].map(({ id, name, description, Icon }, i) => {
              const active = selectedCategory === id;

              return (
                <button
                  key={id}
                  onClick={() => selectCategory(id)}
                  aria-pressed={active}
                  style={{ animationDelay: `${Math.min(i, 8) * 50}ms` }}
                  className={`ins-fade group relative overflow-hidden rounded-[22px] p-5 text-left transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 ${
                    active
                      ? "bg-gradient-to-br from-[#0952d4] to-[#1684e8] text-white shadow-[0_20px_40px_-18px_rgba(9,82,212,0.7)]"
                      : "bg-slate-50 ring-1 ring-inset ring-slate-900/[0.05] hover:bg-white hover:shadow-[0_20px_40px_-20px_rgba(9,82,212,0.35)] hover:ring-[#0952d4]/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-2xl transition-all duration-500 ${
                        active
                          ? "bg-white/20 text-white"
                          : "bg-white text-[#0952d4] shadow-sm group-hover:bg-[#0952d4] group-hover:text-white"
                      }`}
                    >
                      <Icon size={20} />
                    </div>

                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-all duration-500 ${
                        active
                          ? "bg-white/20 text-white"
                          : "text-slate-300 group-hover:rotate-45 group-hover:text-[#0952d4]"
                      }`}
                    >
                      <ArrowUpRight size={17} />
                    </span>
                  </div>

                  <h3
                    className={`mt-5 font-extrabold tracking-tight ${
                      active ? "text-white" : "text-[#0b1f3a]"
                    }`}
                  >
                    {name}
                  </h3>

                  <p
                    className={`mt-1.5 line-clamp-2 text-xs leading-5 ${
                      active ? "text-white/75" : "text-slate-500"
                    }`}
                  >
                    {description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* =====================================================
          RESULTS
      ===================================================== */}
      <section className="bg-slate-50/70">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <SectionLabel eyebrow="Latest" title={activeCategoryName}>
              <p className="mt-2 text-sm text-slate-500">
                {filteredInsights.length} insight
                {filteredInsights.length !== 1 ? "s" : ""} found
              </p>
            </SectionLabel>

            {(search || selectedCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[#0952d4] shadow-sm ring-1 ring-inset ring-[#0952d4]/15 transition-all duration-300 hover:bg-[#0952d4] hover:text-white"
              >
                <X size={14} />
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            /* Skeletons */
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-[24px] bg-white ring-1 ring-slate-900/[0.05]"
                >
                  <div className="aspect-[16/10] animate-pulse bg-slate-200/70" />
                  <div className="space-y-3 p-6">
                    <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200/80" />
                    <div className="h-3 w-full animate-pulse rounded-full bg-slate-100" />
                    <div className="h-3 w-2/3 animate-pulse rounded-full bg-slate-100" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="mx-auto max-w-lg rounded-[24px] bg-white p-10 text-center shadow-sm ring-1 ring-red-100">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
                <X size={24} className="text-red-500" />
              </div>
              <h3 className="mt-5 text-lg font-extrabold text-[#0b1f3a]">
                Unable to load insights
              </h3>

              <p className="mt-2 text-sm text-slate-500">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-full bg-[#0952d4] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0744b5]"
              >
                Try Again
              </button>
            </div>
          ) : filteredInsights.length === 0 ? (
            <div className="mx-auto max-w-lg rounded-[24px] bg-white p-12 text-center shadow-sm ring-1 ring-slate-900/[0.05]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0952d4]/[0.07]">
                <Search size={26} className="text-[#0952d4]" />
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-[#0b1f3a]">
                No insights found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search term or topic.
              </p>

              <button
                onClick={clearFilters}
                className="mt-6 rounded-full bg-[#0952d4] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0744b5]"
              >
                View All Insights
              </button>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredInsights.map((insight, i) => (
                <article
                  key={insight.id}
                  style={{ animationDelay: `${Math.min(i, 8) * 70}ms` }}
                  className="ins-fade group relative flex flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_30px_-15px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.05] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(9,82,212,0.35)] hover:ring-[#0952d4]/20"
                >
                  <div className="relative">
                    <InsightImage
                      src={insight.image_url}
                      alt={insight.title}
                      className="aspect-[16/10]"
                    />
                    <div className="absolute left-4 top-4">
                      <CategoryChip>{insight.category}</CategoryChip>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="line-clamp-2 text-lg font-extrabold leading-snug tracking-[-0.01em] text-[#0b1f3a] transition-colors duration-300 group-hover:text-[#0952d4]">
                      {insight.title}
                    </h3>

                    <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-slate-500">
                      {insight.excerpt}
                    </p>

                    <div className="mt-auto flex items-center justify-between pt-6">
                      {/* Whole card is clickable via this link's overlay */}
                      <Link
                        to={`/insights/${insight.id}`}
                        className="text-sm font-semibold text-[#0b1f3a] after:absolute after:inset-0 after:content-[''] group-hover:text-[#0952d4]"
                      >
                        Read article
                      </Link>

                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-[#0b1f3a] transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#fd8836] group-hover:text-white">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          FEATURED — bento layout
      ===================================================== */}
      {showFeatured && (
        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
            <div className="mb-8 flex items-end justify-between gap-4">
              <SectionLabel eyebrow="Featured" title="Editor's picks" />

              <button
                onClick={() => selectCategory("all")}
                className="group hidden items-center gap-1.5 text-sm font-semibold text-[#0952d4] sm:inline-flex"
              >
                View all insights
                <ArrowRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
            </div>

            <div className="grid gap-6 lg:grid-cols-2 lg:grid-rows-2">
              {featuredInsights.map((insight, i) => {
                const big = i === 0;

                return (
                  <Link
                    key={insight.id}
                    to={`/insights/${insight.id}`}
                    style={{ animationDelay: `${i * 90}ms` }}
                    className={`ins-fade group relative block overflow-hidden rounded-[28px] ring-1 ring-slate-900/[0.05] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_-25px_rgba(9,82,212,0.45)] ${
                      big ? "lg:row-span-2" : ""
                    }`}
                  >
                    <InsightImage
                      src={insight.image_url}
                      alt={insight.title}
                      className={
                        big
                          ? "aspect-[4/3] lg:aspect-auto lg:h-full lg:min-h-[460px]"
                          : "aspect-[16/9] lg:aspect-auto lg:h-full lg:min-h-[218px]"
                      }
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#071a40]/90 via-[#071a40]/30 to-transparent" />

                    <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-7">
                      <div className="min-w-0">
                        <CategoryChip>{insight.category}</CategoryChip>
                        <h3
                          className={`mt-3 line-clamp-2 font-extrabold leading-snug tracking-[-0.02em] text-white ${
                            big ? "text-xl sm:text-3xl" : "text-lg sm:text-xl"
                          }`}
                        >
                          {insight.title}
                        </h3>
                        {big && insight.excerpt && (
                          <p className="mt-2 hidden max-w-lg line-clamp-2 text-sm leading-relaxed text-white/75 sm:block">
                            {insight.excerpt}
                          </p>
                        )}
                      </div>

                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-500 group-hover:rotate-45 group-hover:bg-[#fd8836]">
                        <ArrowUpRight size={19} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          CTA
      ===================================================== */}
      <section className="bg-white px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <div className="relative mx-auto max-w-6xl overflow-hidden rounded-[32px] bg-[#0b1f3a] px-6 py-14 text-center sm:px-12">
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#0952d4]/40 blur-3xl" />
            <div className="absolute -bottom-28 -right-16 h-72 w-72 rounded-full bg-[#fd8836]/30 blur-3xl" />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(255,255,255,0.25) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />
          </div>

          <div className="relative">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-inset ring-white/15 backdrop-blur-md">
              <Globe2 size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-black tracking-[-0.02em] text-white sm:text-4xl">
              Looking for the right supplier?
            </h2>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-slate-300">
              Find verified businesses, explore products, and connect with
              suppliers that match your sourcing requirements.
            </p>

            <Link
              to="/post-requirement"
              className="group mt-7 inline-flex h-12 items-center gap-2 rounded-full bg-[#fd8836] pl-6 pr-1.5 text-sm font-bold text-white shadow-[0_15px_30px_-12px_rgba(253,136,54,0.8)] transition-all duration-300 hover:bg-[#f77925]"
            >
              Post a Requirement
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 group-hover:translate-x-0.5">
                <ArrowRight size={16} />
              </span>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes insFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .ins-fade { animation: insFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .ins-fade { animation: none; }
          .ins-fade, .ins-fade * { transition: none !important; }
        }
      `}</style>
    </main>
  );
}

export default Insights;
