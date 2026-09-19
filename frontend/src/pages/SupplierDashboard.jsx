import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  Settings,
  LogOut,
  Plus,
  Bell,
  Search,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";

function SupplierDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // ==========================================
  // CHECK LOGIN
  // ==========================================

  useEffect(() => {
    const token = localStorage.getItem("vyapaar_token");
    const userData = localStorage.getItem("vyapaar_user");

    if (!token || !userData) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);

      // Supplier only
      if (parsedUser.role !== "supplier") {
        navigate("/login", { replace: true });
        return;
      }

      setUser(parsedUser);
    } catch (error) {
      console.error("User data error:", error);

      localStorage.removeItem("vyapaar_token");
      localStorage.removeItem("vyapaar_user");

      navigate("/login", { replace: true });
    }
  }, [navigate]);

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem("vyapaar_token");
    localStorage.removeItem("vyapaar_user");

    navigate("/login", {
      replace: true,
    });
  };

  // ==========================================
  // SIDEBAR ITEMS
  // ==========================================

  const menuItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    {
      name: "My Products",
      icon: Package,
    },
    {
      name: "Buyer Requirements",
      icon: Users,
    },
    {
      name: "My Quotes",
      icon: FileText,
    },
    {
      name: "Settings",
      icon: Settings,
    },
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-[#0952d4]" />

          <p className="text-sm text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================
          MOBILE OVERLAY
      ======================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ======================================
          SIDEBAR
      ======================================= */}

      <aside
        className={`
          fixed
          left-0
          top-0
          z-40
          flex
          h-screen
          w-72
          flex-col
          border-r
          border-slate-200
          bg-white
          transition-transform
          duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        {/* Logo */}

        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">

          <div>
            <h1 className="text-xl font-bold text-[#0b1f3a]">
              Vyapaar Bharat
            </h1>

            <p className="text-xs text-gray-400">
              Supplier Panel
            </p>
          </div>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-lg p-2 text-gray-500 hover:bg-slate-100 lg:hidden"
          >
            <X size={20} />
          </button>

        </div>


        {/* Navigation */}

        <nav className="flex-1 space-y-2 p-4">

          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                type="button"
                className={`
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-sm
                  font-medium
                  transition
                  ${
                    item.active
                      ? "bg-blue-50 text-[#0952d4]"
                      : "text-gray-600 hover:bg-slate-50 hover:text-[#0952d4]"
                  }
                `}
              >
                <Icon size={20} />

                <span>
                  {item.name}
                </span>

                {item.active && (
                  <ChevronRight
                    size={17}
                    className="ml-auto"
                  />
                )}
              </button>
            );
          })}

        </nav>


        {/* Logout */}

        <div className="border-t border-slate-100 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition hover:bg-red-50"
          >
            <LogOut size={20} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* ======================================
          MAIN AREA
      ======================================= */}

      <div className="lg:pl-72">

        {/* ====================================
            TOP HEADER
        ===================================== */}

        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8">

          <div className="flex items-center gap-4">

            <button
              onClick={() =>
                setSidebarOpen(true)
              }
              className="rounded-lg p-2 text-gray-600 hover:bg-slate-100 lg:hidden"
            >
              <Menu size={22} />
            </button>


            <div>
              <h2 className="text-lg font-bold text-[#0b1f3a] sm:text-xl">
                Supplier Dashboard
              </h2>

              <p className="hidden text-xs text-gray-400 sm:block">
                Manage your business from one place
              </p>
            </div>

          </div>


          <div className="flex items-center gap-3">

            {/* Search */}

            <button
              type="button"
              className="hidden rounded-xl p-2.5 text-gray-500 hover:bg-slate-100 sm:block"
            >
              <Search size={20} />
            </button>


            {/* Notification */}

            <button
              type="button"
              className="relative rounded-xl p-2.5 text-gray-500 hover:bg-slate-100"
            >
              <Bell size={20} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
            </button>


            {/* User */}

            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-3">

              <div className="hidden text-right md:block">

                <p className="text-sm font-semibold text-[#0b1f3a]">
                  {user.name}
                </p>

                <p className="text-xs capitalize text-gray-400">
                  {user.role}
                </p>

              </div>


              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 font-bold text-[#fd8836]">
                {user.name
                  ?.charAt(0)
                  ?.toUpperCase() || "S"}
              </div>

            </div>

          </div>

        </header>


        {/* ====================================
            CONTENT
        ===================================== */}

        <main className="p-4 sm:p-6 lg:p-8">

          {/* Welcome */}

          <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#0952d4] to-blue-700 p-6 text-white shadow-sm sm:p-8">

            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">

              <div>

                <p className="mb-2 text-sm font-medium text-blue-100">
                  Welcome back
                </p>

                <h1 className="text-2xl font-bold sm:text-3xl">
                  {user.name}
                </h1>

                <p className="mt-2 max-w-xl text-sm text-blue-100">
                  Manage your products, discover buyer
                  requirements and send quotations.
                </p>

              </div>


              <button
                type="button"
                className="flex w-fit items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#0952d4] shadow-sm transition hover:bg-blue-50"
              >
                <Plus size={18} />

                Add Product
              </button>

            </div>

          </div>


          {/* ==================================
              STAT CARDS
          =================================== */}

          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            {/* Products */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Total Products
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#0b1f3a]">
                    0
                  </h3>

                </div>

                <div className="rounded-xl bg-blue-50 p-3 text-[#0952d4]">
                  <Package size={22} />
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                Products listed on marketplace
              </p>

            </div>


            {/* Requirements */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Buyer Requirements
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#0b1f3a]">
                    0
                  </h3>

                </div>

                <div className="rounded-xl bg-orange-50 p-3 text-[#fd8836]">
                  <Users size={22} />
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                Requirements available for you
              </p>

            </div>


            {/* Quotes */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Quotes Sent
                  </p>

                  <h3 className="mt-2 text-3xl font-bold text-[#0b1f3a]">
                    0
                  </h3>

                </div>

                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <FileText size={22} />
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                Quotations sent to buyers
              </p>

            </div>


            {/* Profile */}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    Account Status
                  </p>

                  <h3 className="mt-2 text-xl font-bold text-green-600">
                    Active
                  </h3>

                </div>

                <div className="rounded-xl bg-green-50 p-3 text-green-600">
                  <Users size={22} />
                </div>

              </div>

              <p className="mt-4 text-xs text-gray-400">
                Your supplier account is active
              </p>

            </div>

          </div>


          {/* ==================================
              QUICK ACTIONS
          =================================== */}

          <div className="mb-8">

            <div className="mb-4">

              <h2 className="text-lg font-bold text-[#0b1f3a]">
                Quick Actions
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Common supplier actions
              </p>

            </div>


            <div className="grid gap-4 md:grid-cols-3">

              {/* Add Product */}

              <button
                type="button"
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#0952d4]">
                  <Plus size={21} />
                </div>

                <h3 className="font-semibold text-[#0b1f3a]">
                  Add New Product
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  List a new product on the marketplace.
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#0952d4]">
                  Get started
                  <ArrowRightIcon />
                </div>

              </button>


              {/* Requirements */}

              <button
                type="button"
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-[#fd8836]">
                  <Users size={21} />
                </div>

                <h3 className="font-semibold text-[#0b1f3a]">
                  Find Buyer Requirements
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Explore requirements posted by buyers.
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-[#fd8836]">
                  View requirements
                  <ArrowRightIcon />
                </div>

              </button>


              {/* Quotes */}

              <button
                type="button"
                className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-md"
              >

                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                  <FileText size={21} />
                </div>

                <h3 className="font-semibold text-[#0b1f3a]">
                  Manage Quotes
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  Track quotations sent to buyers.
                </p>

                <div className="mt-4 flex items-center gap-1 text-sm font-medium text-green-600">
                  View quotes
                  <ArrowRightIcon />
                </div>

              </button>

            </div>

          </div>


          {/* ==================================
              RECENT ACTIVITY
          =================================== */}

          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-5">

              <div>

                <h2 className="font-bold text-[#0b1f3a]">
                  Recent Activity
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                  Your latest supplier activity
                </p>

              </div>

              <button
                type="button"
                className="text-sm font-medium text-[#0952d4] hover:underline"
              >
                View all
              </button>

            </div>


            {/* Empty state */}

            <div className="px-5 py-12 text-center">

              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-gray-400">
                <FileText size={25} />
              </div>

              <h3 className="font-semibold text-[#0b1f3a]">
                No activity yet
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-500">
                Once you add products, send quotes or
                interact with buyers, your activity will
                appear here.
              </p>

            </div>

          </div>

        </main>

      </div>

    </div>
  );
}


// ==========================================
// SMALL ARROW COMPONENT
// ==========================================

function ArrowRightIcon() {
  return (
    <ChevronRight
      size={16}
      className="transition-transform group-hover:translate-x-1"
    />
  );
}


export default SupplierDashboard;