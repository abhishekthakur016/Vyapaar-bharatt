import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  Search,
  Plus,
  ClipboardList,
  Building2,
  ChevronDown,
  Eye,
  RefreshCw,
  Menu,
  X,
  LayoutDashboard,
  Boxes,
  FileText,
  Users,
  ShoppingCart,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  Bell,
  ShieldCheck,
  MapPin,
  CalendarDays,
  IndianRupee,
  MessageSquare,
} from "lucide-react"

const API_URL = "http://localhost:5000"

function AdminRequirements() {
  const navigate = useNavigate()

  // ===============================
  // STATE
  // ===============================

  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories")

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  // ===============================
  // FETCH REQUIREMENTS
  // ===============================

  const fetchRequirements = async () => {
    try {
      setLoading(true)
      setError("")

      const response = await fetch(
        `${API_URL}/api/requirements`
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch requirements."
        )
      }

      setRequirements(data.requirements || [])
    } catch (err) {
      console.error(
        "Error fetching requirements:",
        err
      )

      setError(
        err.message ||
          "Unable to load requirements."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequirements()
  }, [])

  // ===============================
  // FILTER OPTIONS
  // ===============================

  const categories = useMemo(() => {
    const values = requirements
      .map((item) => item.category)
      .filter(Boolean)

    return [
      "All Categories",
      ...new Set(values),
    ]
  }, [requirements])

  const statuses = useMemo(() => {
    const values = requirements
      .map((item) => item.status)
      .filter(Boolean)

    return [
      "All Status",
      ...new Set(values),
    ]
  }, [requirements])

  // ===============================
  // FILTER REQUIREMENTS
  // ===============================

  const filteredRequirements = useMemo(() => {
    const query = search.trim().toLowerCase()

    return requirements.filter((requirement) => {
      const matchesSearch =
        !query ||
        requirement.title
          ?.toLowerCase()
          .includes(query) ||
        requirement.category
          ?.toLowerCase()
          .includes(query) ||
        requirement.subcategory
          ?.toLowerCase()
          .includes(query) ||
        requirement.delivery_location
          ?.toLowerCase()
          .includes(query)

      const matchesStatus =
        statusFilter === "All Status" ||
        requirement.status === statusFilter

      const matchesCategory =
        categoryFilter === "All Categories" ||
        requirement.category === categoryFilter

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      )
    })
  }, [
    requirements,
    search,
    statusFilter,
    categoryFilter,
  ])

  // ===============================
  // TOTAL QUOTES
  // ===============================

  const totalQuotes = useMemo(() => {
    return requirements.reduce(
      (total, requirement) =>
        total + Number(requirement.quote_count || 0),
      0
    )
  }, [requirements])

  // ===============================
  // OPEN REQUIREMENTS
  // ===============================

  const openRequirements = useMemo(() => {
    return requirements.filter(
      (item) =>
        item.status?.toLowerCase() === "open"
    ).length
  }, [requirements])

  // ===============================
  // FORMAT DATE
  // ===============================

  const formatDate = (date) => {
    if (!date) return "—"

    const parsedDate = new Date(date)

    if (Number.isNaN(parsedDate.getTime())) {
      return "—"
    }

    return parsedDate.toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    )
  }

  // ===============================
  // FORMAT BUDGET
  // ===============================

  const formatBudget = (requirement) => {
    const min = requirement.min_budget
    const max = requirement.max_budget

    if (min && max) {
      return `₹${Number(min).toLocaleString(
        "en-IN"
      )} - ₹${Number(max).toLocaleString(
        "en-IN"
      )}`
    }

    if (max) {
      return `Up to ₹${Number(max).toLocaleString(
        "en-IN"
      )}`
    }

    if (min) {
      return `From ₹${Number(min).toLocaleString(
        "en-IN"
      )}`
    }

    return "Not specified"
  }

  // ===============================
  // STATUS STYLE
  // ===============================

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "open":
        return "bg-emerald-50 text-emerald-700"

      case "closed":
        return "bg-slate-100 text-slate-600"

      case "pending":
        return "bg-amber-50 text-amber-700"

      case "cancelled":
        return "bg-red-50 text-red-700"

      case "quoted":
        return "bg-blue-50 text-blue-700"

      case "negotiating":
        return "bg-purple-50 text-purple-700"

      case "accepted":
        return "bg-emerald-50 text-emerald-700"

      default:
        return "bg-blue-50 text-blue-700"
    }
  }

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem(
      "vyapaar_token"
    )

    localStorage.removeItem(
      "vyapaar_user"
    )

    navigate("/login")
  }

  // ===============================
  // ADMIN MENU
  // ===============================

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Companies",
      icon: Building2,
      path: "/admin/companies",
    },
    {
      label: "Products",
      icon: Boxes,
      path: "/admin/products",
    },
    {
      label: "Requirements",
      icon: ClipboardList,
      path: "/admin/requirements",
    },
    {
      label: "Quotes",
      icon: FileText,
      path: "/supplier-rfqs",
    },
    {
      label: "Users",
      icon: Users,
      path: "#",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      path: "#",
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "#",
    },
    {
      label: "Insights",
      icon: Lightbulb,
      path: "/admin/insights",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "#",
    },
  ]

  // ===============================
  // SIDEBAR
  // ===============================

  const Sidebar = () => (
    <aside
      className={`
        fixed
        inset-y-0
        left-0
        z-50
        flex
        w-[270px]
        flex-col
        bg-[#071a33]
        text-white
        transition-transform
        duration-300
        lg:translate-x-0
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
      `}
    >
      {/* Sidebar Header */}

      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
        <Link
          to="/admin/dashboard"
          className="text-xl font-bold tracking-tight"
        >
          Vyapaar Bharat
        </Link>

        <button
          type="button"
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon

            const active =
              item.path ===
              "/admin/requirements"

            // Disabled items

            if (item.path === "#") {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={18} />

                  {item.label}
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon size={18} />

                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Secure Status */}

      <div className="px-4 pb-3">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={18}
              className="text-emerald-400"
            />

            <span className="text-sm font-semibold">
              System Secure
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            All systems are operational
          </p>
        </div>
      </div>

      {/* Logout */}

      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />

          Logout
        </button>
      </div>
    </aside>
  )

  // ===============================
  // PAGE
  // ===============================

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Mobile Overlay */}

      {mobileMenuOpen && (
        <div
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <div className="lg:pl-[270px]">

        {/* ===============================
            TOPBAR
        =============================== */}

        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">

            {/* Mobile Menu */}

            <button
              type="button"
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="hidden text-sm font-medium text-slate-500 sm:block">
                Admin Panel
              </p>

              <h2 className="text-lg font-bold text-[#0b1f3a]">
                Requirements
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">

            {/* Notification */}

            <button
              type="button"
              className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600"
            >
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
            </button>

            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Super Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              SA
            </div>
          </div>
        </header>

        {/* ===============================
            CONTENT
        =============================== */}

        <main className="p-5 sm:p-6 lg:p-8">

          {/* ===============================
              PAGE HEADER
          =============================== */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                <ClipboardList size={16} />

                <span>
                  RFQ Management
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#0b1f3a] sm:text-3xl">
                Buyer Requirements
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage requirements posted by buyers.
              </p>
            </div>

            <Link
              to="/post-requirement"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Plus size={18} />

              Create Requirement
            </Link>
          </div>

          {/* ===============================
              STATS
          =============================== */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {/* Total */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Requirements
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {requirements.length}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <ClipboardList size={21} />
                </div>

              </div>
            </div>

            {/* Open */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Open Requirements
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {openRequirements}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <FileText size={21} />
                </div>

              </div>
            </div>

            {/* Total Quotes */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Total Quotes
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {totalQuotes}
                  </p>
                </div>

                <div className="rounded-xl bg-purple-50 p-3 text-purple-600">
                  <MessageSquare size={21} />
                </div>

              </div>
            </div>

            {/* Showing */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    Showing
                  </p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {filteredRequirements.length}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
                  <BarChart3 size={21} />
                </div>

              </div>
            </div>

          </div>

          {/* ===============================
              FILTERS
          =============================== */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_220px_220px_auto]">

              {/* Search */}

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search requirements..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Status */}

              <div className="relative">

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                >
                  {statuses.map((status) => (
                    <option
                      key={status}
                      value={status}
                    >
                      {status}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Category */}

              <div className="relative">

                <select
                  value={categoryFilter}
                  onChange={(event) =>
                    setCategoryFilter(
                      event.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Refresh */}

              <button
                type="button"
                onClick={fetchRequirements}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw
                  size={17}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                Refresh
              </button>

            </div>
          </div>

          {/* ===============================
              ERROR
          =============================== */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* ===============================
              TABLE
          =============================== */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Table Header */}

            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">

              <div>
                <h2 className="font-bold text-slate-900">
                  Requirement Listings
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {filteredRequirements.length}{" "}
                  requirement
                  {filteredRequirements.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <div className="hidden items-center gap-2 text-xs text-slate-500 sm:flex">
                <MessageSquare size={14} />

                {totalQuotes} total quotes
              </div>

            </div>

            {/* Loading */}

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">

                <div className="flex items-center gap-3 text-sm text-slate-500">

                  <RefreshCw
                    size={20}
                    className="animate-spin"
                  />

                  Loading requirements...

                </div>

              </div>
            ) : filteredRequirements.length === 0 ? (

              /* Empty */

              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

                <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400">
                  <ClipboardList size={30} />
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No requirements found
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                  No buyer requirements match
                  your current filters.
                </p>

              </div>

            ) : (

              /* Table */

              <div className="overflow-x-auto">

                <table className="w-full min-w-[1250px]">

                  <thead>

                    <tr className="border-b border-slate-200 bg-slate-50">

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Requirement
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Quantity
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Budget
                      </th>

                      {/* NEW QUOTES COLUMN */}

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Quotes
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Delivery
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Required By
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Status
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Action
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y divide-slate-100">

                    {filteredRequirements.map(
                      (requirement) => {

                        const quoteCount = Number(
                          requirement.quote_count || 0
                        )

                        return (
                          <tr
                            key={requirement.id}
                            className="transition hover:bg-slate-50/70"
                          >

                            {/* ===============================
                                REQUIREMENT
                            =============================== */}

                            <td className="px-5 py-4">

                              <div className="max-w-[260px]">

                                <p className="truncate text-sm font-semibold text-slate-900">
                                  {requirement.title}
                                </p>

                                <p className="mt-1 text-[11px] text-slate-400">
                                  ID: #
                                  {requirement.id}
                                </p>

                              </div>

                            </td>

                            {/* ===============================
                                CATEGORY
                            =============================== */}

                            <td className="px-5 py-4">

                              <div>

                                <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                  {requirement.category ||
                                    "General"}
                                </span>

                                {requirement.subcategory && (
                                  <p className="mt-2 text-xs text-slate-500">
                                    {
                                      requirement.subcategory
                                    }
                                  </p>
                                )}

                              </div>

                            </td>

                            {/* ===============================
                                QUANTITY
                            =============================== */}

                            <td className="px-5 py-4">

                              <p className="text-sm font-semibold text-slate-800">
                                {requirement.quantity !=
                                null
                                  ? Number(
                                      requirement.quantity
                                    ).toLocaleString(
                                      "en-IN"
                                    )
                                  : "—"}
                              </p>

                              <p className="text-xs text-slate-500">
                                {requirement.unit ||
                                  "—"}
                              </p>

                            </td>

                            {/* ===============================
                                BUDGET
                            =============================== */}

                            <td className="px-5 py-4">

                              <div className="flex items-start gap-1">

                                <IndianRupee
                                  size={14}
                                  className="mt-0.5 shrink-0 text-slate-400"
                                />

                                <span className="max-w-[150px] text-xs font-medium leading-5 text-slate-700">
                                  {formatBudget(
                                    requirement
                                  ).replace(
                                    "₹",
                                    ""
                                  )}
                                </span>

                              </div>

                            </td>

                            {/* ===============================
                                QUOTES
                            =============================== */}

                            <td className="px-5 py-4">

                              <Link
                                to={`/requirements/${requirement.id}`}
                                className={`
                                  inline-flex
                                  items-center
                                  gap-2
                                  rounded-xl
                                  border
                                  px-3
                                  py-2
                                  transition
                                  ${
                                    quoteCount > 0
                                      ? "border-blue-200 bg-blue-50 text-blue-700 hover:border-blue-300 hover:bg-blue-100"
                                      : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
                                  }
                                `}
                              >

                                <MessageSquare
                                  size={15}
                                />

                                <span className="text-xs font-semibold">
                                  {quoteCount}{" "}
                                  {quoteCount === 1
                                    ? "Quote"
                                    : "Quotes"}
                                </span>

                              </Link>

                            </td>

                            {/* ===============================
                                DELIVERY
                            =============================== */}

                            <td className="px-5 py-4">

                              <div className="flex max-w-[160px] items-start gap-2">

                                <MapPin
                                  size={15}
                                  className="mt-0.5 shrink-0 text-slate-400"
                                />

                                <span className="text-xs text-slate-600">
                                  {requirement.delivery_location ||
                                    "—"}
                                </span>

                              </div>

                            </td>

                            {/* ===============================
                                REQUIRED BY
                            =============================== */}

                            <td className="px-5 py-4">

                              <div className="flex items-center gap-2">

                                <CalendarDays
                                  size={15}
                                  className="text-slate-400"
                                />

                                <span className="text-xs text-slate-600">
                                  {formatDate(
                                    requirement.required_by
                                  )}
                                </span>

                              </div>

                            </td>

                            {/* ===============================
                                STATUS
                            =============================== */}

                            <td className="px-5 py-4">

                              <span
                                className={`
                                  inline-flex
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-semibold
                                  capitalize
                                  ${getStatusStyle(
                                    requirement.status
                                  )}
                                `}
                              >
                                {requirement.status ||
                                  "Unknown"}
                              </span>

                            </td>

                            {/* ===============================
                                ACTION
                            =============================== */}

                            <td className="px-5 py-4">

                              <div className="flex justify-end">

                                <Link
                                  to={`/requirements/${requirement.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                >
                                  <Eye
                                    size={15}
                                  />

                                  View
                                </Link>

                              </div>

                            </td>

                          </tr>
                        )
                      }
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>

        </main>
      </div>
    </div>
  )
}

export default AdminRequirements