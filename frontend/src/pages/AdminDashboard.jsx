import {
  LayoutDashboard,
  Building2,
  Package,
  FileText,
  Users,
  ShoppingCart,
  MessageSquareQuote,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  ArrowUpRight,
  Clock3,
  ShieldCheck,
  BookOpen,
} from "lucide-react"

import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"


function AdminDashboard() {
  const navigate = useNavigate()

  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [stats, setStats] = useState({
    companies: 0,
    products: 0,
    requirements: 0,
    quotes: 0,
    users: 0,
    insights: 0,
  })

  const [loading, setLoading] = useState(true)

  const [recentRequirements, setRecentRequirements] = useState([])

  const user = JSON.parse(
    localStorage.getItem("vyapaar_user") || "{}"
  )


  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true)

        const [
          suppliersResponse,
          productsResponse,
          requirementsResponse,
          insightsResponse,
        ] = await Promise.all([
          fetch("http://localhost:5000/api/suppliers"),
          fetch("http://localhost:5000/api/products"),
          fetch("http://localhost:5000/api/requirements"),
          fetch("http://localhost:5000/api/insights"),
        ])

        const suppliersData =
          await suppliersResponse.json()

        const productsData =
          await productsResponse.json()

        const requirementsData =
          await requirementsResponse.json()

        const insightsData =
          await insightsResponse.json()


        const suppliers =
          suppliersData.suppliers || []

        const products =
          productsData.products || []

        const requirements =
          requirementsData.requirements || []

        const insights =
          insightsData.insights || []


        setStats({
          companies: suppliers.length,
          products: products.length,
          requirements: requirements.length,
          quotes: 0,
          users: 0,
          insights: insights.length,
        })


        setRecentRequirements(
          requirements.slice(0, 5)
        )

      } catch (error) {
        console.error(
          "Error loading admin dashboard:",
          error
        )
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [])


  // =========================================
  // LOGOUT
  // =========================================

  const handleLogout = () => {
    localStorage.removeItem("vyapaar_token")
    localStorage.removeItem("vyapaar_user")

    navigate("/login")
  }


  // =========================================
  // SIDEBAR MENU
  // =========================================

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
      active: true,
    },
    {
      label: "Companies",
      icon: Building2,
      path: "/admin/companies",
    },
    {
      label: "Products",
      icon: Package,
      path: "/admin/products",
    },
    {
      label: "Requirements",
      icon: FileText,
      path: "/admin/requirements",
    },
    {
      label: "Quotes",
      icon: MessageSquareQuote,
      path: "/admin/quotes",
    },
    {
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      label: "Insights",
      icon: BookOpen,
      path: "/admin/insights",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ]


  // =========================================
  // STAT CARDS
  // =========================================

  const statCards = [
    {
      title: "Total Companies",
      value: stats.companies,
      icon: Building2,
      description: "Registered businesses",
    },
    {
      title: "Total Products",
      value: stats.products,
      icon: Package,
      description: "Listed products",
    },
    {
      title: "Requirements",
      value: stats.requirements,
      icon: FileText,
      description: "Buyer requirements",
    },
    {
      title: "Quotes",
      value: stats.quotes,
      icon: MessageSquareQuote,
      description: "Supplier quotations",
    },
  ]


  return (
    <div className="min-h-screen bg-[#f5f7fb]">


      {/* =========================================
          MOBILE OVERLAY
      ========================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* =========================================
          SIDEBAR
      ========================================= */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[270px]
          flex-col
          bg-[#081d38]
          text-white
          shadow-2xl
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}

        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Vyapaar Bharat
            </h1>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-blue-300">
              Super Admin
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>

        </div>


        {/* Navigation */}

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Main Menu
          </p>


          <nav className="space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon

              if (item.active) {
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() =>
                      setSidebarOpen(false)
                    }
                    className="group flex items-center gap-3 rounded-xl bg-[#0952d4] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20"
                  >
                    <Icon size={19} />

                    <span>{item.label}</span>
                  </Link>
                )
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() =>
                    setSidebarOpen(false)
                  }
                  className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                >

                  <span className="flex items-center gap-3">
                    <Icon
                      size={19}
                      className="text-slate-400 transition group-hover:text-blue-300"
                    />

                    {item.label}
                  </span>

                </Link>
              )
            })}

          </nav>


          {/* Admin Status */}

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  System Secure
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Admin access active
                </p>
              </div>

            </div>

          </div>

        </div>


        {/* Logout */}

        <div className="border-t border-white/10 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={19} />

            Logout
          </button>

        </div>

      </aside>


      {/* =========================================
          MAIN AREA
      ========================================= */}

      <div className="lg:pl-[270px]">


        {/* =========================================
            TOPBAR
        ========================================= */}

        <header className="sticky top-0 z-30 flex h-[82px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

          {/* Mobile Menu */}

          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>


          {/* Search */}

          <div className="hidden max-w-md flex-1 md:block">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search anything..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>


          {/* Right Side */}

          <div className="ml-auto flex items-center gap-3">

            {/* Notification */}

            <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0952d4]">

              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#fd8836] ring-2 ring-white" />

            </button>


            {/* Profile */}

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-bold text-[#0b1f3a]">
                  {user.name || "Super Admin"}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Super Administrator
                </p>

              </div>


              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#0952d4] to-[#1b5fd7] text-sm font-bold text-white shadow-md shadow-blue-100">
                SA
              </div>


              <ChevronDown
                size={16}
                className="hidden text-slate-400 sm:block"
              />

            </div>

          </div>

        </header>


        {/* =========================================
            DASHBOARD CONTENT
        ========================================= */}

        <main className="p-5 sm:p-6 lg:p-8">


          {/* Page Heading */}

          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#fd8836]" />

                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#0952d4]">
                  Overview
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#0b1f3a]">
                Welcome back, Super Admin
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Monitor and manage your entire Vyapaar Bharat platform.
              </p>

            </div>


            {/* Quick Action */}

            <Link
              to="/admin/companies"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 hover:bg-orange-500"
            >
              <Building2 size={18} />

              Add Company

              <ArrowUpRight size={17} />

            </Link>

          </div>


          {/* =========================================
              STAT CARDS
          ========================================= */}

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">

            {statCards.map((stat) => {
              const Icon = stat.icon

              return (
                <div
                  key={stat.title}
                  className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >

                  {/* Decorative */}

                  <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-blue-50 transition group-hover:scale-150" />


                  <div className="relative">

                    <div className="flex items-start justify-between">

                      <div>

                        <p className="text-sm font-medium text-slate-500">
                          {stat.title}
                        </p>

                        <p className="mt-2 text-3xl font-bold tracking-tight text-[#0b1f3a]">

                          {loading ? (
                            <span className="inline-block h-8 w-12 animate-pulse rounded-lg bg-slate-100" />
                          ) : (
                            stat.value.toLocaleString()
                          )}

                        </p>

                      </div>


                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#0952d4] transition group-hover:bg-[#0952d4] group-hover:text-white">

                        <Icon size={22} />

                      </div>

                    </div>


                    <div className="mt-5 flex items-center gap-1.5 text-xs text-slate-400">

                      <span>
                        {stat.description}
                      </span>

                    </div>

                  </div>

                </div>
              )
            })}

          </div>


          {/* =========================================
              SECONDARY STATS
          ========================================= */}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#fd8836]">
                  <Users size={21} />
                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Platform Users
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#0b1f3a]">
                    {loading ? "..." : stats.users}
                  </p>

                </div>

              </div>

            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0952d4]">
                  <BookOpen size={21} />
                </div>

                <div>

                  <p className="text-sm text-slate-500">
                    Published Insights
                  </p>

                  <p className="mt-1 text-2xl font-bold text-[#0b1f3a]">
                    {loading ? "..." : stats.insights}
                  </p>

                </div>

              </div>

            </div>

          </div>


          {/* =========================================
              LOWER SECTION
          ========================================= */}

          <div className="mt-8 grid gap-6 xl:grid-cols-3">


            {/* Recent Requirements */}

            <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">

                <div>

                  <h2 className="text-lg font-bold text-[#0b1f3a]">
                    Recent Requirements
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Latest buyer requirements submitted.
                  </p>

                </div>


                <Link
                  to="/requirements"
                  className="text-xs font-bold text-[#0952d4] hover:underline"
                >
                  View All
                </Link>

              </div>


              <div className="divide-y divide-slate-100">

                {loading ? (
                  <div className="p-10 text-center text-sm text-slate-400">
                    Loading requirements...
                  </div>
                ) : recentRequirements.length === 0 ? (
                  <div className="p-10 text-center">

                    <FileText
                      size={30}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm text-slate-500">
                      No requirements found.
                    </p>

                  </div>
                ) : (
                  recentRequirements.map((requirement) => (
                    <Link
                      key={requirement.id}
                      to={`/requirements/${requirement.id}`}
                      className="flex items-center justify-between gap-4 px-6 py-4 transition hover:bg-slate-50"
                    >

                      <div className="min-w-0">

                        <p className="truncate text-sm font-semibold text-[#0b1f3a]">
                          {requirement.title}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {requirement.category}
                          {requirement.delivery_location
                            ? ` • ${requirement.delivery_location}`
                            : ""}
                        </p>

                      </div>


                      <div className="flex shrink-0 items-center gap-2">

                        <span className="hidden rounded-full bg-blue-50 px-3 py-1 text-[11px] font-semibold text-[#0952d4] sm:inline-flex">
                          {requirement.status || "open"}
                        </span>

                        <ArrowUpRight
                          size={16}
                          className="text-slate-400"
                        />

                      </div>

                    </Link>
                  ))
                )}

              </div>

            </div>


            {/* Quick Actions */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              <div className="border-b border-slate-100 px-6 py-5">

                <h2 className="text-lg font-bold text-[#0b1f3a]">
                  Quick Actions
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Frequently used admin actions.
                </p>

              </div>


              <div className="space-y-3 p-5">

                <Link
                  to="/admin/companies"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#0952d4]">
                    <Building2 size={19} />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-[#0b1f3a]">
                      Add Company
                    </p>

                    <p className="text-xs text-slate-500">
                      Create a new business
                    </p>

                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-slate-400"
                  />

                </Link>


                <Link
                  to="/admin/products"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-50 text-[#fd8836]">
                    <Package size={19} />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-[#0b1f3a]">
                      Add Product
                    </p>

                    <p className="text-xs text-slate-500">
                      List a company product
                    </p>

                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-slate-400"
                  />

                </Link>


                <Link
                  to="/admin/insights"
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3.5 transition hover:border-blue-200 hover:bg-blue-50"
                >

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <BookOpen size={19} />
                  </div>

                  <div className="flex-1">

                    <p className="text-sm font-semibold text-[#0b1f3a]">
                      Manage Insights
                    </p>

                    <p className="text-xs text-slate-500">
                      Publish business content
                    </p>

                  </div>

                  <ArrowUpRight
                    size={16}
                    className="text-slate-400"
                  />

                </Link>

              </div>

            </div>

          </div>


          {/* =========================================
              SYSTEM STATUS
          ========================================= */}

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                  <ShieldCheck size={20} />
                </div>

                <div>

                  <p className="text-sm font-bold text-[#0b1f3a]">
                    Platform Status
                  </p>

                  <p className="text-xs text-slate-500">
                    All core services are being monitored.
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600">

                <span className="h-2 w-2 rounded-full bg-emerald-500" />

                System Operational

              </div>

            </div>

          </div>


        </main>

      </div>

    </div>
  )
}


export default AdminDashboard