import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  ShieldCheck,
  BookOpen,
  MapPin,
  CheckCircle2,
  XCircle,
  Plus,
  Trash2,
} from "lucide-react";

function AdminCompanies() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("vyapaar_user") || "{}");

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/suppliers");

      const data = await response.json();

      if (!response.ok || !data.suppliers) {
        throw new Error(data.message || "Failed to load companies");
      }

      setCompanies(data.suppliers);
    } catch (error) {
      console.error("Error loading companies:", error);

      setError(error.message || "Unable to load companies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const filteredCompanies = companies.filter((company) => {
    const searchText = search.toLowerCase();

    return (
      company.name?.toLowerCase().includes(searchText) ||
      company.industry?.toLowerCase().includes(searchText) ||
      company.location?.toLowerCase().includes(searchText) ||
      company.business_type?.toLowerCase().includes(searchText)
    );
  });

  const handleDeleteCompany = async (company) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${company.name}"?`,
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("vyapaar_token");

      const response = await fetch(
        `/api/admin/suppliers/${company.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete company");
      }

      setCompanies((prev) => prev.filter((item) => item.id !== company.id));

      alert("Company deleted successfully.");
    } catch (error) {
      console.error("Delete company error:", error);
      alert(error.message || "Unable to delete company");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("vyapaar_token");
    localStorage.removeItem("vyapaar_user");

    navigate("/login");
  };

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
      active: true,
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
  ];

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
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}

        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">Vyapaar Bharat</h1>

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
              const Icon = item.icon;

              if (item.active) {
                return (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className="group flex items-center gap-3 rounded-xl bg-[#0952d4] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20"
                  >
                    <Icon size={19} />

                    <span>{item.label}</span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
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
              );
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
            COMPANIES CONTENT
        ========================================= */}

        <main className="p-5 sm:p-6 lg:p-8">
          {/* Page Heading */}

          <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#fd8836]" />

                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#0952d4]">
                  Companies
                </span>
              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#0b1f3a]">
                Manage Companies
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                View and manage companies registered on Vyapaar Bharat.
              </p>
            </div>

            {/* Add Company */}

            <Link
              to="/admin/companies/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 hover:bg-orange-500"
            >
              <Plus size={18} />
              Add Company
            </Link>
          </div>

          {/* Search */}

          <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search company, industry, location..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />
            </div>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Loading */}

          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-400 shadow-sm">
              Loading companies...
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
              <Building2 size={32} className="mx-auto text-slate-300" />

              <h3 className="mt-3 text-sm font-semibold text-slate-700">
                No companies found
              </h3>

              <p className="mt-1 text-xs text-slate-500">
                Try another search or add a new company.
              </p>
            </div>
          ) : (
            /* Companies Table */

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-left">
                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Company
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Business Type
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Industry
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Location
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Verification
                      </th>

                      <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.08em] text-slate-500">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredCompanies.map((company) => (
                      <tr
                        key={company.id}
                        className="border-b border-slate-100 last:border-0 transition hover:bg-slate-50"
                      >
                        {/* Company */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#0952d4]">
                              <Building2 size={19} />
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[230px] truncate text-sm font-semibold text-[#0b1f3a]">
                                {company.name}
                              </p>

                              <p className="mt-0.5 text-[11px] text-slate-400">
                                Company ID: #{company.id}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Business Type */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {company.business_type || "—"}
                        </td>

                        {/* Industry */}

                        <td className="px-6 py-4 text-sm text-slate-600">
                          {company.industry || "—"}
                        </td>

                        {/* Location */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <MapPin
                              size={15}
                              className="shrink-0 text-slate-400"
                            />

                            <span>{company.location || "—"}</span>
                          </div>
                        </td>

                        {/* Verification */}

                        <td className="px-6 py-4">
                          {company.verified ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-600">
                              <CheckCircle2 size={13} />
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-500">
                              <XCircle size={13} />
                              Not Verified
                            </span>
                          )}
                        </td>

                        {/* Action */}

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link
                              to={`/admin/companies/${company.id}`}
                              className="text-sm font-bold text-[#0952d4] transition hover:text-blue-700 hover:underline"
                            >
                              View
                            </Link>

                            <button
                              type="button"
                              onClick={() => handleDeleteCompany(company)}
                              className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-100"
                              title="Delete company"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default AdminCompanies;
