import { useEffect, useMemo, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Factory,
  Globe2,
  Lightbulb,
  Search,
  TrendingUp,
  X,
} from "lucide-react"

import { insightCategories } from "../data/insights"

const categoryIcons = {
  chart: BarChart3,
  trend: TrendingUp,
  book: BookOpen,
  bulb: Lightbulb,
  globe: Globe2,
  factory: Factory,
}

function Insights() {
  const [searchParams, setSearchParams] = useSearchParams()

  const selectedCategory = searchParams.get("category") || "all"

  const [search, setSearch] = useState("")
  const [insights, setInsights] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch("http://localhost:5000/api/insights")
        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to fetch insights")
        }

        setInsights(data.insights || [])
      } catch (err) {
        console.error("Error fetching insights:", err)
        setError(err.message || "Unable to load insights.")
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  const filteredInsights = useMemo(() => {
    return insights.filter((insight) => {
      const matchesCategory =
        selectedCategory === "all" ||
        insight.categoryId === selectedCategory

      const searchText = search.toLowerCase().trim()

      const matchesSearch =
        !searchText ||
        insight.title.toLowerCase().includes(searchText) ||
        insight.excerpt.toLowerCase().includes(searchText) ||
        insight.category.toLowerCase().includes(searchText)

      return matchesCategory && matchesSearch
    })
  }, [selectedCategory, search, insights])

  const featuredInsights = insights.slice(0, 3)

  const selectCategory = (categoryId) => {
    if (categoryId === "all") {
      setSearchParams({})
      return
    }

    setSearchParams({ category: categoryId })
  }

  const clearFilters = () => {
    setSearch("")
    setSearchParams({})
  }

  return (
    <main className="bg-white">

      {/* HERO */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

          <div className="mb-4 inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            VYAPAAR BHARAT INSIGHTS
          </div>

          <Link
  to="/admin/insights"
  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0952d4] hover:text-[#0952d4]"
>
  Manage Insights
</Link>

          <h1 className="max-w-2xl text-4xl font-bold leading-tight text-[#0b1f3a] sm:text-5xl">
            Insights to Help Your
            <span className="block text-[#0952d4]">
              Business Grow
            </span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
            Explore market insights, industry trends, sourcing guides,
            business tips, and trade opportunities to make better
            business decisions.
          </p>

          {/* SEARCH */}
          <div className="mt-8 max-w-2xl">
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search insights..."
                className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-12 text-sm outline-none transition focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
              />

              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="mb-7">
            <p className="text-xs font-bold uppercase tracking-wider text-[#0952d4]">
              EXPLORE
            </p>

            <h2 className="mt-1 text-2xl font-bold text-[#0b1f3a]">
              Business Insights
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Explore insights designed to help businesses make smarter decisions.
            </p>
          </div>

          {/* ALL */}
          <button
            onClick={() => selectCategory("all")}
            className={`mb-6 rounded-lg border px-4 py-2 text-sm font-semibold transition ${
              selectedCategory === "all"
                ? "border-[#0952d4] bg-[#0952d4] text-white"
                : "border-slate-300 bg-white text-slate-700 hover:border-[#0952d4]"
            }`}
          >
            All Insights
          </button>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {insightCategories.map((category) => {
              const Icon = categoryIcons[category.icon]

              const active = selectedCategory === category.id

              return (
                <button
                  key={category.id}
                  onClick={() => selectCategory(category.id)}
                  className={`group rounded-xl border bg-white p-5 text-left transition hover:-translate-y-1 hover:border-[#0952d4] hover:shadow-md ${
                    active
                      ? "border-[#0952d4] ring-2 ring-blue-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0952d4]">
                    <Icon size={19} />
                  </div>

                  <h3 className="font-bold text-[#0b1f3a]">
                    {category.name}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    {category.description}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#0952d4]">
                    Explore Insights
                    <ArrowRight
                      size={13}
                      className="transition group-hover:translate-x-1"
                    />
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* INSIGHT RESULTS */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0952d4]">
                LATEST
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#0b1f3a]">
                {selectedCategory === "all"
                  ? "All Insights"
                  : insightCategories.find(
                      (item) => item.id === selectedCategory
                    )?.name}
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                {filteredInsights.length} insight
                {filteredInsights.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {(search || selectedCategory !== "all") && (
              <button
                onClick={clearFilters}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#0952d4]"
              >
                <X size={15} />
                Clear Filters
              </button>
            )}
          </div>

          {loading ? (
            <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#0952d4]" />
              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading insights...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-xl border border-red-200 bg-red-50 py-12 text-center">
              <h3 className="font-bold text-red-700">
                Unable to load insights
              </h3>

              <p className="mt-2 text-sm text-red-600">
                {error}
              </p>

              <button
                onClick={() => window.location.reload()}
                className="mt-5 rounded-lg bg-[#0952d4] px-5 py-2.5 text-sm font-semibold text-white"
              >
                Try Again
              </button>
            </div>
          ) : filteredInsights.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-300 py-16 text-center">
              <Search
                size={35}
                className="mx-auto text-slate-300"
              />

              <h3 className="mt-4 font-bold text-[#0b1f3a]">
                No insights found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search term or category.
              </p>

              <button
                onClick={clearFilters}
                className="mt-5 rounded-lg bg-[#0952d4] px-5 py-2.5 text-sm font-semibold text-white"
              >
                View All Insights
              </button>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filteredInsights.map((insight) => (
                <article
                  key={insight.id}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                 <div
  className="relative flex h-36 items-end bg-slate-200 bg-cover bg-center p-5"
  style={{
    backgroundImage: insight.image_url
      ? `url(${insight.image_url})`
      : undefined,
  }}
>
  <div className="absolute inset-0 bg-black/30" />

  <span className="relative z-10 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
    {insight.category}
  </span>
</div>

                  <div className="p-5">
                    <h3 className="text-base font-bold leading-6 text-[#0b1f3a]">
                      {insight.title}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-slate-500">
                      {insight.excerpt}
                    </p>

                    <Link
                      to={`/insights/${insight.id}`}
                      className="mt-5 inline-flex items-center gap-1 text-xs font-bold text-[#0952d4]"
                    >
                      Read More
                      <ArrowRight
                        size={14}
                        className="transition group-hover:translate-x-1"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FEATURED */}
      {!loading && !error && selectedCategory === "all" && !search && insights.length > 0 && (
        <section className="border-b border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

            <div className="mb-7 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#0952d4]">
                  FEATURED
                </p>

                <h2 className="mt-1 text-2xl font-bold text-[#0b1f3a]">
                  Featured Insights
                </h2>
              </div>

              <button
                onClick={() => selectCategory("all")}
                className="hidden text-xs font-semibold text-[#0952d4] sm:block"
              >
                View all insights →
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {featuredInsights.map((insight) => (
                <Link
                  key={insight.id}
                  to={`/insights/${insight.id}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className="relative flex h-36 items-end bg-slate-200 bg-cover bg-center p-5"
                    style={{
                      backgroundImage: insight.image_url
                        ? `url(${insight.image_url})`
                        : undefined,
                    }}
                  >
                    <div className="absolute inset-0 bg-black/30" />

                    <span className="relative z-10 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      {insight.category}
                    </span>
                  </div>

                  <div className="p-5">
                    <h3 className="text-sm font-bold leading-6 text-[#0b1f3a]">
                      {insight.title}
                    </h3>

                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#0952d4]">
                      Read More
                      <ArrowRight
                        size={14}
                        className="transition group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-xl bg-[#0b1f3a] px-6 py-10 text-center sm:px-10">

          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
            <Globe2 size={19} />
          </div>

          <h2 className="mt-4 text-xl font-bold text-white">
            Looking for the right supplier?
          </h2>

          <p className="mx-auto mt-2 max-w-lg text-xs leading-5 text-slate-300">
            Find verified businesses, explore products, and connect with
            suppliers that match your sourcing requirements.
          </p>

          <Link
            to="/post-requirement"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#fd8836] px-5 py-2.5 text-xs font-bold text-white transition hover:bg-orange-600"
          >
            Post a Requirement
            <ArrowRight size={14} />
          </Link>
        </div>
      </section>

    </main>
  )
}

export default Insights