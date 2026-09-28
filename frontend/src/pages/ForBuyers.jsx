import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  Package,
  IndianRupee,
} from "lucide-react";

function AdminRequirements() {
  const navigate = useNavigate();

  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [categoryFilter, setCategoryFilter] =
    useState("All Categories");

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // =====================================================
  // FETCH REQUIREMENTS
  // =====================================================

  const fetchRequirements = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/requirements"
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to fetch requirements."
        );
      }

      setRequirements(
        data.requirements || []
      );
    } catch (err) {
      console.error(
        "Error fetching requirements:",
        err
      );

      setError(
        err.message ||
          "Unable to load requirements."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequirements();
  }, []);

  // =====================================================
  // CATEGORY OPTIONS
  // =====================================================

  const categories = useMemo(() => {
    const values = requirements
      .map((item) => item.category)
      .filter(Boolean);

    return [
      "All Categories",
      ...new Set(values),
    ];
  }, [requirements]);

  // =====================================================
  // STATUS OPTIONS
  // =====================================================

  const statuses = useMemo(() => {
    const values = requirements
      .map((item) => item.status)
      .filter(Boolean);

    return [
      "All Status",
      ...new Set(values),
    ];
  }, [requirements]);

  // =====================================================
  // FILTER REQUIREMENTS
  // =====================================================

  const filteredRequirements = useMemo(() => {
    const query =
      search.trim().toLowerCase();

    return requirements.filter(
      (requirement) => {
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
            .includes(query);

        const matchesStatus =
          statusFilter === "All Status" ||
          requirement.status ===
            statusFilter;

        const matchesCategory =
          categoryFilter ===
            "All Categories" ||
          requirement.category ===
            categoryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesCategory
        );
      }
    );
  }, [
    requirements,
    search,
    statusFilter,
    categoryFilter,
  ]);

  // =====================================================
  // DATE FORMAT
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =====================================================
  // BUDGET
  // =====================================================

  const formatBudget = (requirement) => {
    const min = requirement.min_budget;
    const max = requirement.max_budget;

    if (min && max) {
      return `₹${Number(
        min
      ).toLocaleString(
        "en-IN"
      )} – ₹${Number(
        max
      ).toLocaleString(
        "en-IN"
      )}`;
    }

    if (min) {
      return `₹${Number(
        min
      ).toLocaleString(
        "en-IN"
      )}`;
    }

    if (max) {
      return `Up to ₹${Number(
        max
      ).toLocaleString(
        "en-IN"
      )}`;
    }

    return "Not specified";
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (
      status?.toLowerCase()
    ) {
      case "open":
        return "bg-green-50 text-green-600";

      case "quoted":
        return "bg-blue-50 text-[#0952d4]";

      case "negotiating":
        return "bg-orange-50 text-orange-600";

      case "accepted":
        return "bg-green-50 text-green-700";

      case "closed":
        return "bg-slate-100 text-slate-600";

      case "cancelled":
        return "bg-red-50 text-red-600";

      case "rejected":
        return "bg-red-50 text-red-600";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "vyapaar_token"
    );

    localStorage.removeItem(
      "vyapaar_user"
    );

    navigate("/login");
  };

  // =====================================================
  // SIDEBAR
  // =====================================================

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
  ];

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
        bg-[#081d38]
        text-white
        shadow-2xl
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
      {/* Logo */}

      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">

        <Link
          to="/admin/dashboard"
          className="text-xl font-bold tracking-tight"
        >
          Vyapaar Bharat

          <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-300">
            Super Admin
          </span>
        </Link>

        <button
          onClick={() =>
            setMobileMenuOpen(false)
          }
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
            const Icon = item.icon;

            const active =
              item.path ===
              "/admin/requirements";

            if (item.path === "#") {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                >
                  <Icon size={19} />
                  {item.label}
                </button>
              );
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
                  px-4
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-[#0952d4] text-white shadow-lg shadow-blue-950/20"
                      : "text-slate-300 hover:bg-white/[0.07] hover:text-white"
                  }
                `}
              >
                <Icon size={19} />
                {item.label}
              </Link>
            );
          })}

        </nav>

        {/* System status */}

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
  );

  // =====================================================
  // MAIN
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      <Sidebar />

      {/* Mobile overlay */}

      {mobileMenuOpen && (
        <div
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
        />
      )}

      <div className="lg:pl-[270px]">

        {/* =================================================
            TOPBAR
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-[82px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

          <button
            onClick={() =>
              setMobileMenuOpen(true)
            }
            className="mr-4 rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

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

          <div className="ml-auto flex items-center gap-3">

            <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0952d4]">

              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#fd8836] ring-2 ring-white" />

            </button>

            <div className="hidden border-l border-slate-200 pl-4 sm:flex sm:items-center sm:gap-3">

              <div className="text-right">

                <p className="text-sm font-bold text-[#0b1f3a]">
                  Super Admin
                </p>

                <p className="text-xs text-slate-500">
                  Administrator
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#0952d4] to-[#1b5fd7] text-sm font-bold text-white shadow-md shadow-blue-100">
                SA
              </div>

            </div>

          </div>

        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="p-5 sm:p-6 lg:p-8">

          {/* Page Header */}

          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#fd8836]" />

                <span className="text-xs font-black uppercase tracking-[0.18em] text-[#0952d4]">
                  RFQ Management
                </span>

              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#0b1f3a]">
                Buyer Requirements
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                View and manage all requirements
                posted by buyers.
              </p>

            </div>

            <Link
              to="/post-requirement"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f77925] hover:shadow-md"
            >
              <Plus size={18} />
              Post Requirement
            </Link>

          </div>

          {/* =================================================
              STATS
          ================================================= */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Total */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Total Requirements
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#0b1f3a]">
                    {requirements.length}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0952d4]/10 text-[#0952d4]">
                  <ClipboardList size={21} />
                </div>

              </div>

            </div>

            {/* Open */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Open Requirements
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#0b1f3a]">
                    {
                      requirements.filter(
                        (item) =>
                          item.status?.toLowerCase() ===
                          "open"
                      ).length
                    }
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <Package size={21} />
                </div>

              </div>

            </div>

            {/* Quoted */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Quotes Received
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#0b1f3a]">
                    {
                      requirements.filter(
                        (item) =>
                          Number(
                            item.quote_count || 0
                          ) > 0
                      ).length
                    }
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#fd8836]">
                  <FileText size={21} />
                </div>

              </div>

            </div>

            {/* Showing */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    Showing
                  </p>

                  <p className="mt-1 text-2xl font-black text-[#0b1f3a]">
                    {filteredRequirements.length}
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0952d4]">
                  <BarChart3 size={21} />
                </div>

              </div>

            </div>

          </div>

          {/* =================================================
              FILTERS
          ================================================= */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1fr_210px_210px_auto]">

              {/* Search */}

              <div className="relative">

                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                  placeholder="Search requirements..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

              </div>

              {/* Status */}

              <div className="relative">

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none focus:border-[#0952d4] focus:bg-white"
                >
                  {statuses.map(
                    (status) => (
                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>
                    )
                  )}
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
                  onChange={(e) =>
                    setCategoryFilter(
                      e.target.value
                    )
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none focus:border-[#0952d4] focus:bg-white"
                >
                  {categories.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

              </div>

              {/* Refresh */}

              <button
                onClick={fetchRequirements}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
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

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* =================================================
              REQUIREMENT LIST
          ================================================= */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            {/* Header */}

            <div className="border-b border-slate-200 px-5 py-5 sm:px-6">

              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h2 className="text-lg font-black text-[#0b1f3a]">
                    Requirement Listings
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    {filteredRequirements.length}{" "}
                    requirement
                    {filteredRequirements.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    found
                  </p>

                </div>

              </div>

            </div>

            {/* Loading */}

            {loading && (
              <div className="flex min-h-[320px] items-center justify-center">

                <div className="flex items-center gap-3 text-sm font-bold text-slate-500">

                  <RefreshCw
                    size={22}
                    className="animate-spin text-[#0952d4]"
                  />

                  Loading requirements...

                </div>

              </div>
            )}

            {/* Empty */}

            {!loading &&
              !error &&
              filteredRequirements.length ===
                0 && (
                <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0952d4]/10">
                    <ClipboardList
                      size={28}
                      className="text-[#0952d4]"
                    />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[#0b1f3a]">
                    No requirements found
                  </h3>

                  <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                    No buyer requirements match
                    your current filters.
                  </p>

                </div>
              )}

            {/* Requirements */}

            {!loading &&
              !error &&
              filteredRequirements.length >
                0 && (
                <div className="divide-y divide-slate-100">

                  {filteredRequirements.map(
                    (requirement) => (
                      <div
                        key={
                          requirement.id
                        }
                        className="p-5 transition hover:bg-slate-50 sm:p-6"
                      >

                        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">

                          {/* Main Info */}

                          <div className="min-w-0 flex-1">

                            <div className="flex flex-wrap items-center gap-2">

                              <span className="rounded-full bg-[#0952d4]/10 px-3 py-1 text-xs font-bold text-[#0952d4]">
                                {requirement.category ||
                                  "General"}
                              </span>

                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${getStatusStyle(
                                  requirement.status
                                )}`}
                              >
                                {requirement.status ||
                                  "Unknown"}
                              </span>

                              {requirement.subcategory && (
                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                                  {
                                    requirement.subcategory
                                  }
                                </span>
                              )}

                            </div>

                            <h3 className="mt-4 text-xl font-black text-[#0b1f3a]">
                              {
                                requirement.title
                              }
                            </h3>

                            <p className="mt-1 text-xs font-medium text-slate-400">
                              Requirement #
                              {
                                requirement.id
                              }
                            </p>

                            {/* Details */}

                            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                              {/* Quantity */}

                              <div className="flex items-center gap-2 text-sm text-slate-600">

                                <Package
                                  size={17}
                                  className="shrink-0 text-[#0952d4]"
                                />

                                <span>
                                  <span className="font-bold text-[#0b1f3a]">
                                    {requirement.quantity ??
                                      "—"}
                                  </span>{" "}
                                  {
                                    requirement.unit ||
                                    ""
                                  }
                                </span>

                              </div>

                              {/* Location */}

                              <div className="flex items-center gap-2 text-sm text-slate-600">

                                <MapPin
                                  size={17}
                                  className="shrink-0 text-[#fd8836]"
                                />

                                <span className="truncate">
                                  {
                                    requirement.delivery_location ||
                                    "Not specified"
                                  }
                                </span>

                              </div>

                              {/* Date */}

                              <div className="flex items-center gap-2 text-sm text-slate-600">

                                <CalendarDays
                                  size={17}
                                  className="shrink-0 text-[#0952d4]"
                                />

                                <span>
                                  {requirement.required_by
                                    ? formatDate(
                                        requirement.required_by
                                      )
                                    : "Not specified"}
                                </span>

                              </div>

                              {/* Quotes */}

                              <div className="flex items-center gap-2 text-sm text-slate-600">

                                <FileText
                                  size={17}
                                  className="shrink-0 text-[#fd8836]"
                                />

                                <span>
                                  <span className="font-bold text-[#0b1f3a]">
                                    {
                                      requirement.quote_count ||
                                      0
                                    }
                                  </span>{" "}
                                  {Number(
                                    requirement.quote_count ||
                                      0
                                  ) === 1
                                    ? "Quote"
                                    : "Quotes"}
                                </span>

                              </div>

                            </div>

                            {/* Budget */}

                            <div className="mt-5">

                              <span className="text-xs font-bold uppercase tracking-wide text-slate-400">
                                Budget
                              </span>

                              <p className="mt-1 flex items-center gap-1 text-sm font-black text-[#0b1f3a]">

                                <IndianRupee
                                  size={15}
                                  className="text-[#0952d4]"
                                />

                                {formatBudget(
                                  requirement
                                ).replace(
                                  "₹",
                                  ""
                                )}

                              </p>

                            </div>

                          </div>

                          {/* Action */}

                          <div className="shrink-0 border-t border-slate-100 pt-5 xl:border-l xl:border-t-0 xl:pl-7 xl:pt-0">

                            <Link
                              to={`/requirements/${requirement.id}`}
                              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:border-[#0952d4] hover:bg-[#0952d4]/5 hover:text-[#0952d4] xl:w-auto"
                            >
                              <Eye size={17} />

                              View Details
                            </Link>

                          </div>

                        </div>

                      </div>
                    )
                  )}

                </div>
              )}

          </div>

        </main>

      </div>
    </div>
  );
}

export default AdminRequirements;