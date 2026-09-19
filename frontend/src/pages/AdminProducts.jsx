import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Package,
  Building2,
  ChevronDown,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  Menu,
  X,
  LayoutDashboard,
  Boxes,
  ClipboardList,
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
  IndianRupee,
} from "lucide-react";

const API_URL = "http://localhost:5000";

function AdminProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [availabilityFilter, setAvailabilityFilter] =
    useState("All Availability");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(null);

  // ===============================
  // FETCH PRODUCTS
  // ===============================

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/products`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch products.");
      }

      setProducts(data.products || []);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError(err.message || "Unable to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // ===============================
  // FILTER OPTIONS
  // ===============================

  const categories = useMemo(() => {
    const values = products.map((product) => product.category).filter(Boolean);

    return ["All Categories", ...new Set(values)];
  }, [products]);

  const availabilityOptions = useMemo(() => {
    const values = products
      .map((product) => product.availability)
      .filter(Boolean);

    return ["All Availability", ...new Set(values)];
  }, [products]);

  // ===============================
  // FILTER PRODUCTS
  // ===============================

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query) ||
        product.supplier_name?.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All Categories" ||
        product.category === categoryFilter;

      const matchesAvailability =
        availabilityFilter === "All Availability" ||
        product.availability === availabilityFilter;

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [products, search, categoryFilter, availabilityFilter]);

  // ===============================
  // DELETE PRODUCT
  // ===============================

  const handleDelete = async (product) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${product.name}"?`,
    );

    if (!confirmed) return;

    try {
      setDeleteLoading(product.id);

      const response = await fetch(`${API_URL}/api/products/${product.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete product.");
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
    } catch (err) {
      console.error("Delete product error:", err);

      alert(err.message || "Unable to delete product.");
    } finally {
      setDeleteLoading(null);
    }
  };

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem("vyapaar_token");
    localStorage.removeItem("vyapaar_user");

    navigate("/login");
  };

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
  ];

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
        ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      {/* Logo */}

      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
        <Link
          to="/admin/dashboard"
          className="text-xl font-bold tracking-tight"
        >
          Vyapaar Bharat
        </Link>

        <button
          onClick={() => setMobileMenuOpen(false)}
          className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Navigation */}

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = item.path === "/admin/products";

            if (item.path === "#") {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              );
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
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
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Secure status */}

      <div className="px-4 pb-3">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-400" />

            <span className="text-sm font-semibold text-white">
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
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}

      <Sidebar />

      {/* Mobile overlay */}

      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      {/* Main */}

      <div className="lg:pl-[270px]">
        {/* Topbar */}

        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-500">Admin Panel</p>

              <h2 className="text-lg font-bold text-[#0b1f3a]">
                Product Management
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-50">
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
            </button>

            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Super Admin
              </p>

              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              SA
            </div>
          </div>
        </header>

        {/* Content */}

        <main className="p-5 sm:p-6 lg:p-8">
          {/* Header */}

          <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-1 flex items-center gap-2 text-sm text-slate-500">
                <Package size={16} />
                <span>Catalog</span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#0b1f3a] sm:text-3xl">
                Products
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Manage products listed by companies on Vyapaar Bharat.
              </p>
            </div>

            <Link
              to="/admin/products/add"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>

          {/* Stats */}

          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Total Products</p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {products.length}
                  </p>
                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                  <Package size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Categories</p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {Math.max(categories.length - 1, 0)}
                  </p>
                </div>

                <div className="rounded-xl bg-orange-50 p-3 text-orange-500">
                  <Boxes size={21} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Showing</p>

                  <p className="mt-1 text-2xl font-bold text-slate-900">
                    {filteredProducts.length}
                  </p>
                </div>

                <div className="rounded-xl bg-emerald-50 p-3 text-emerald-600">
                  <BarChart3 size={21} />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}

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
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search products or companies..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Category */}

              <div className="relative">
                <select
                  value={categoryFilter}
                  onChange={(event) => setCategoryFilter(event.target.value)}
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={17}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </div>

              {/* Availability */}

              <div className="relative">
                <select
                  value={availabilityFilter}
                  onChange={(event) =>
                    setAvailabilityFilter(event.target.value)
                  }
                  className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 pr-10 text-sm text-slate-700 outline-none focus:border-blue-500 focus:bg-white"
                >
                  {availabilityOptions.map((availability) => (
                    <option key={availability} value={availability}>
                      {availability}
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
                onClick={fetchProducts}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <RefreshCw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                Refresh
              </button>
            </div>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Products */}

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-bold text-slate-900">Product Listings</h2>

                <p className="mt-0.5 text-xs text-slate-500">
                  {filteredProducts.length} product
                  {filteredProducts.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <RefreshCw size={20} className="animate-spin" />
                  Loading products...
                </div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center px-6 text-center">
                <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400">
                  <Package size={30} />
                </div>

                <h3 className="text-lg font-bold text-slate-800">
                  No products found
                </h3>

                <p className="mt-1 max-w-md text-sm text-slate-500">
                  No products match your current search or filters.
                </p>

                <Link
                  to="/admin/products/add"
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Plus size={17} />
                  Add Product
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1050px]">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Product
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Company
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Category
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Price
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        MOQ
                      </th>

                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Availability
                      </th>

                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.map((product) => {
                      const availability = product.availability || "Available";

                      const isAvailable = availability
                        .toLowerCase()
                        .includes("available");

                      return (
                        <tr
                          key={product.id}
                          className="transition hover:bg-slate-50/70"
                        >
                          {/* Product */}

                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                {product.image_url ? (
                                  <img
                                    src={product.image_url}
                                    alt={product.name}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  <div className="flex h-full w-full items-center justify-center text-slate-400">
                                    <Package size={21} />
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <p className="max-w-[250px] truncate text-sm font-semibold text-slate-900">
                                  {product.name}
                                </p>

                                {product.subcategory && (
                                  <p className="mt-0.5 max-w-[250px] truncate text-xs text-slate-500">
                                    {product.subcategory}
                                  </p>
                                )}

                                <p className="mt-1 text-[11px] text-slate-400">
                                  ID: #{product.id}
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Company */}

                          <td className="px-5 py-4">
                            <div className="flex items-start gap-2">
                              <Building2
                                size={16}
                                className="mt-0.5 shrink-0 text-slate-400"
                              />

                              <div>
                                <p className="max-w-[190px] truncate text-sm font-medium text-slate-800">
                                  {product.supplier_name || "—"}
                                </p>

                                {product.supplier_location && (
                                  <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                                    <MapPin size={12} />
                                    {product.supplier_location}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Category */}

                          <td className="px-5 py-4">
                            <div>
                              <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                {product.category || "General"}
                              </span>

                              {product.subcategory && (
                                <p className="mt-2 text-xs text-slate-500">
                                  {product.subcategory}
                                </p>
                              )}
                            </div>
                          </td>

                          {/* Price */}

                          <td className="px-5 py-4">
                            {product.price !== null &&
                            product.price !== undefined ? (
                              <div>
                                <p className="flex items-center text-sm font-bold text-slate-900">
                                  <IndianRupee size={14} />

                                  {Number(product.price).toLocaleString(
                                    "en-IN",
                                  )}
                                </p>

                                {product.price_unit && (
                                  <p className="mt-0.5 text-xs text-slate-500">
                                    {product.price_unit}
                                  </p>
                                )}
                              </div>
                            ) : (
                              <span className="text-sm font-medium text-slate-500">
                                Price on Request
                              </span>
                            )}
                          </td>

                          {/* MOQ */}

                          <td className="px-5 py-4">
                            {product.moq ? (
                              <p className="text-sm font-semibold text-slate-800">
                                {product.moq} {product.moq_unit}
                              </p>
                            ) : (
                              <span className="text-sm text-slate-400">—</span>
                            )}
                          </td>

                          {/* Availability */}

                          <td className="px-5 py-4">
                            <span
                              className={`
                                  inline-flex
                                  rounded-full
                                  px-2.5
                                  py-1
                                  text-xs
                                  font-semibold
                                  ${
                                    isAvailable
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-amber-50 text-amber-700"
                                  }
                                `}
                            >
                              {availability}
                            </span>
                          </td>

                          {/* Actions */}

                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-2">
                              <Link
                                to={`/products/${product.id}`}
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                title="View Product"
                              >
                                <Eye size={16} />
                              </Link>

                              <button
                                type="button"
                                onClick={() =>
                                  navigate(`/admin/products/${product.id}/edit`)
                                }
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                title="Edit Product"
                              >
                                <Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                disabled={deleteLoading === product.id}
                                onClick={() => handleDelete(product)}
                                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                                title="Delete Product"
                              >
                                {deleteLoading === product.id ? (
                                  <RefreshCw
                                    size={16}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2 size={16} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default AdminProducts;
