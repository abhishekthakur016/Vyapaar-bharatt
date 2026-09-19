import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import {
  Search,
  MapPin,
  Building2,
  ShieldCheck,
  Star,
  Package,
  ArrowRight,
  SlidersHorizontal,
  X,
  LoaderCircle,
} from "lucide-react"

function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [industry, setIndustry] = useState("All Industries")
  const [location, setLocation] = useState("All Locations")
  const [verifiedOnly, setVerifiedOnly] = useState(false)

  // --------------------------------------------------
  // FETCH SUPPLIERS
  // --------------------------------------------------

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          "http://localhost:5000/api/suppliers"
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to fetch suppliers"
          )
        }

        setSuppliers(data.suppliers || [])
      } catch (error) {
        console.error("Error fetching suppliers:", error)
        setError(
          error.message || "Unable to load suppliers."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchSuppliers()
  }, [])

  // --------------------------------------------------
  // DYNAMIC INDUSTRIES
  // --------------------------------------------------

  const industries = useMemo(() => {
    const values = suppliers
      .map((supplier) => supplier.industry)
      .filter(Boolean)

    return [
      "All Industries",
      ...new Set(values),
    ]
  }, [suppliers])

  // --------------------------------------------------
  // DYNAMIC LOCATIONS
  // --------------------------------------------------

  const locations = useMemo(() => {
    const values = suppliers
      .map((supplier) => supplier.location)
      .filter(Boolean)

    return [
      "All Locations",
      ...new Set(values),
    ]
  }, [suppliers])

  // --------------------------------------------------
  // FILTER SUPPLIERS
  // --------------------------------------------------

  const filteredSuppliers = useMemo(() => {
    const searchTerm = search.trim().toLowerCase()

    return suppliers.filter((supplier) => {
      const searchableText = [
        supplier.name,
        supplier.business_type,
        supplier.industry,
        supplier.location,
        supplier.description,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()

      const matchesSearch =
        !searchTerm ||
        searchableText.includes(searchTerm)

      const matchesIndustry =
        industry === "All Industries" ||
        supplier.industry === industry

      const matchesLocation =
        location === "All Locations" ||
        supplier.location === location

      const matchesVerified =
        !verifiedOnly || supplier.verified === true

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesLocation &&
        matchesVerified
      )
    })
  }, [
    suppliers,
    search,
    industry,
    location,
    verifiedOnly,
  ])

  // --------------------------------------------------
  // CLEAR FILTERS
  // --------------------------------------------------

  const clearFilters = () => {
    setSearch("")
    setIndustry("All Industries")
    setLocation("All Locations")
    setVerifiedOnly(false)
  }

  const hasFilters =
    search ||
    industry !== "All Industries" ||
    location !== "All Locations" ||
    verifiedOnly

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <LoaderCircle
              size={42}
              className="mx-auto animate-spin text-[#0952d4]"
            />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading suppliers...
            </p>
          </div>
        </div>
      </main>
    )
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center px-4">
          <div className="w-full rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <X
                size={26}
                className="text-red-500"
              />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#0b1f3a]">
              Unable to Load Suppliers
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0744b5]"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    )
  }

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ==================================================
          HERO
      ================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="max-w-3xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-[#0952d4]">
              <Building2 size={15} />
              VERIFIED BUSINESS NETWORK
            </div>

            <h1 className="text-4xl font-bold leading-tight text-[#0b1f3a] md:text-5xl">
              Find Trusted Suppliers
              <span className="block text-[#0952d4]">
                Across India
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
              Discover manufacturers, suppliers,
              wholesalers and service providers for
              your business requirements.
            </p>
          </div>

          {/* Search */}

          <div className="mt-8 max-w-4xl">
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg shadow-slate-200/50 md:flex-row">

              <div className="relative flex-1">
                <Search
                  size={20}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search suppliers, industries, businesses..."
                  className="w-full rounded-xl bg-slate-50 py-3.5 pl-12 pr-4 text-sm outline-none transition focus:bg-white focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={() => {
                  document
                    .getElementById("supplier-filters")
                    ?.scrollIntoView({
                      behavior: "smooth",
                    })
                }}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:border-[#0952d4] hover:text-[#0952d4]"
              >
                <SlidersHorizontal size={17} />
                Filters
              </button>

            </div>
          </div>

        </div>
      </section>

      {/* ==================================================
          CONTENT
      ================================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">

          {/* ==================================================
              FILTER SIDEBAR
          ================================================== */}

          <aside
            id="supplier-filters"
            className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal
                  size={18}
                  className="text-[#0952d4]"
                />

                <h2 className="font-bold text-[#0b1f3a]">
                  Filters
                </h2>
              </div>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-bold text-[#0952d4] hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Industry */}

            <div className="mt-6">
              <label className="mb-2 block text-sm font-bold text-[#0b1f3a]">
                Industry
              </label>

              <select
                value={industry}
                onChange={(e) =>
                  setIndustry(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
              >
                {industries.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Location */}

            <div className="mt-5">
              <label className="mb-2 block text-sm font-bold text-[#0b1f3a]">
                Location
              </label>

              <select
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
              >
                {locations.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Verified */}

            <div className="mt-5">
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-blue-200 hover:bg-blue-50/50">

                <input
                  type="checkbox"
                  checked={verifiedOnly}
                  onChange={(e) =>
                    setVerifiedOnly(
                      e.target.checked
                    )
                  }
                  className="h-4 w-4 accent-[#0952d4]"
                />

                <div>
                  <p className="text-sm font-bold text-[#0b1f3a]">
                    Verified Suppliers
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Show verified businesses only
                  </p>
                </div>

              </label>
            </div>

            {/* Active filters */}

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200"
              >
                <X size={15} />
                Reset Filters
              </button>
            )}

          </aside>

          {/* ==================================================
              SUPPLIER RESULTS
          ================================================== */}

          <div>

            {/* Results Header */}

            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <h2 className="text-2xl font-bold text-[#0b1f3a]">
                  Suppliers
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-bold text-[#0b1f3a]">
                    {filteredSuppliers.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-[#0b1f3a]">
                    {suppliers.length}
                  </span>{" "}
                  suppliers
                </p>
              </div>

              <div className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-bold text-slate-500 shadow-sm">
                <Building2 size={14} />
                B2B Supplier Network
              </div>

            </div>

            {/* Empty State */}

            {filteredSuppliers.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Building2
                    size={28}
                    className="text-slate-400"
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-[#0b1f3a]">
                  No Suppliers Found
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Try changing your search or
                  removing some filters to find
                  more suppliers.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#0744b5]"
                >
                  Clear Filters
                </button>

              </div>
            ) : (

              <div className="grid gap-5 md:grid-cols-2">

                {filteredSuppliers.map(
                  (supplier) => {

                    const image =
                      supplier.image_url ||
                      "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80"

                    return (
                      <article
                        key={supplier.id}
                        className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                      >

                        {/* Image */}

                        <div className="relative h-52 overflow-hidden bg-slate-100">

                          <img
                            src={image}
                            alt={supplier.name}
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=800&q=80"
                            }}
                          />

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                          {/* Verified */}

                          {supplier.verified && (
                            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-green-700 shadow-sm">
                              <ShieldCheck size={14} />
                              Verified
                            </div>
                          )}

                          {/* Business Type */}

                          {supplier.business_type && (
                            <div className="absolute bottom-4 left-4 rounded-full bg-black/60 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-sm">
                              {supplier.business_type}
                            </div>
                          )}

                        </div>

                        {/* Body */}

                        <div className="p-5">

                          <div className="flex items-start justify-between gap-4">

                            <div className="min-w-0">

                              <h3 className="truncate text-lg font-bold text-[#0b1f3a]">
                                {supplier.name}
                              </h3>

                              {supplier.industry && (
                                <p className="mt-1 text-sm font-medium text-[#0952d4]">
                                  {supplier.industry}
                                </p>
                              )}

                            </div>

                            {supplier.rating && (
                              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-yellow-50 px-2.5 py-1.5">
                                <Star
                                  size={14}
                                  className="fill-yellow-500 text-yellow-500"
                                />

                                <span className="text-sm font-bold text-yellow-700">
                                  {supplier.rating}
                                </span>
                              </div>
                            )}

                          </div>

                          {/* Location */}

                          {supplier.location && (
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                              <MapPin
                                size={16}
                                className="shrink-0 text-[#0952d4]"
                              />

                              <span>
                                {supplier.location}
                              </span>
                            </div>
                          )}

                          {/* Description */}

                          {supplier.description && (
                            <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                              {supplier.description}
                            </p>
                          )}

                          {/* Stats */}

                          <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-100 pt-4">

                            {supplier.years_in_business && (
                              <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-xs text-slate-400">
                                  Experience
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-[#0b1f3a]">
                                  {supplier.years_in_business}+
                                  {" "}Years
                                </p>
                              </div>
                            )}

                            {supplier.reviews !== undefined && (
                              <div className="rounded-lg bg-slate-50 px-3 py-2">
                                <p className="text-xs text-slate-400">
                                  Reviews
                                </p>

                                <p className="mt-0.5 text-sm font-bold text-[#0b1f3a]">
                                  {supplier.reviews}
                                </p>
                              </div>
                            )}

                          </div>

                          {/* Action */}

                          <div className="mt-5 flex gap-3">

                            <Link
                              to={`/suppliers/${supplier.id}`}
                              className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#0744b5]"
                            >
                              View Supplier
                              <ArrowRight size={17} />
                            </Link>

                            <Link
                              to={`/suppliers/${supplier.id}`}
                              className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-3 text-[#0b1f3a] transition hover:border-[#0952d4] hover:text-[#0952d4]"
                              title="View supplier products"
                            >
                              <Package size={18} />
                            </Link>

                          </div>

                        </div>

                      </article>
                    )
                  }
                )}

              </div>

            )}

          </div>

        </div>

      </section>

    </main>
  )
}

export default Suppliers