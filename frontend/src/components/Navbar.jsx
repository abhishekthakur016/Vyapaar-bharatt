import {
  Search,
  Heart,
  ShoppingBag,
  User,
  Menu,
  X,
  ChevronDown,
  FileText,
} from "lucide-react";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import logo from "../assets/vyapaarbharatlogo.png";

function Navbar() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const [productsResponse, suppliersResponse] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/suppliers"),
        ]);

        const productsData = await productsResponse.json();
        const suppliersData = await suppliersResponse.json();

        const productCategories = (productsData.products || [])
          .map((product) => product.category)
          .filter(Boolean);

        const supplierCategories = (suppliersData.suppliers || [])
          .map((supplier) => supplier.industry)
          .filter(Boolean);

        const allCategories = [
          ...new Set([...productCategories, ...supplierCategories]),
        ].sort();

        setCategories(allCategories);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };

    loadCategories();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
      {/* Top announcement */}
      <div className="hidden bg-[#0952d4] px-6 py-2 text-center text-xs font-medium text-white md:block">
        India's B2B Trade Network — Discover. Connect. Trade. Grow.
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3"
            onClick={() => setMobileOpen(false)}
          >
            <img
              src={logo}
              alt="Vyapaar Bharat"
              className="h-20 w-auto object-contain"
            />

            <div className="hidden sm:block">
              <div className="text-lg font-extrabold tracking-tight text-[#0952d4]">
                Vyapaar Bharat
              </div>

              <div className="text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                B2B Trade Network
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 lg:flex">
            {/* All Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center gap-1 text-sm font-semibold text-gray-700 transition hover:text-[#0952d4]"
              >
                All Categories
                <ChevronDown
                  size={15}
                  className={`transition-transform ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoriesOpen && (
                <div className="absolute left-0 top-full z-50 w-72 pt-3">
                  <div className="rounded-2xl border border-gray-200 bg-white p-2 shadow-xl">
                    {categories.length > 0 ? (
                      categories.map((category) => (
                        <Link
                          key={category}
                          to={`/products?category=${encodeURIComponent(
                            category,
                          )}`}
                          onClick={() => setCategoriesOpen(false)}
                          className="block rounded-xl px-4 py-3 text-sm font-medium text-gray-700 transition hover:bg-blue-50 hover:text-[#0952d4]"
                        >
                          {category}
                        </Link>
                      ))
                    ) : (
                      <div className="px-4 py-3 text-sm text-gray-500">
                        Loading categories...
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* For Buyers */}
            <Link
              to="/for-buyers"
              className="text-sm font-semibold text-gray-700 transition hover:text-[#0952d4]"
            >
              For Buyers
            </Link>

            {/* For Suppliers */}
            <Link
              to="/supplier/requirements"
              className="text-sm font-semibold text-gray-700 transition hover:text-[#0952d4]"
            >
              For Suppliers
            </Link>

            {/* Pricing */}
            {/*
            <Link
              to="/pricing"
              className="text-sm font-semibold text-gray-700 transition hover:text-[#0952d4]"
            >
              Pricing
            </Link>
            */}

            {/* Insights */}
            <Link
              to="/insights"
              className="text-sm font-semibold text-gray-700 transition hover:text-[#0952d4]"
            >
              Insights
            </Link>

            {/* My Requirements */}
            <Link
              to="/my-requirements"
              className="flex items-center gap-2 text-sm font-semibold text-[#0b1f3a] hover:text-[#0952d4]"
            >
              <FileText size={18} />
              My Requirements
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              aria-label="Search"
              className="hidden rounded-lg p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-[#0952d4] sm:block"
            >
              <Search size={19} />
            </button>

            {/* Wishlist */}
            <button
              aria-label="Wishlist"
              className="hidden rounded-lg p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-[#0952d4] md:block"
            >
              <Heart size={19} />
            </button>

            {/* My Quotes */}
            <Link
              to="/my-quotes"
              aria-label="My Quotes"
              title="My Quotes"
              className="hidden rounded-lg p-2.5 text-gray-600 transition hover:bg-blue-50 hover:text-[#0952d4] md:block"
            >
              <ShoppingBag size={19} />
            </Link>

            {/* My Profile */}
            <button
              onClick={() => navigate("/my-profile")}
              aria-label="My Profile"
              title="My Profile"
              className="hidden rounded-lg p-2.5 text-gray-600 transition hover:bg-gray-100 hover:text-[#0952d4] md:block"
            >
              <User size={19} />
            </button>

            {/* Main CTA */}
            <Link
              to="/post-requirement"
              className="hidden rounded-xl bg-[#fd8836] px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:block"
            >
              Post Requirement
            </Link>

            {/* Mobile menu */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="border-t border-gray-200 py-5 lg:hidden">
            <nav className="flex flex-col gap-1">
              {/* Mobile All Categories */}
              <button
                type="button"
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <span>All Categories</span>

                <ChevronDown
                  size={16}
                  className={`transition-transform ${
                    categoriesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {categoriesOpen && (
                <div className="mb-2 ml-4 border-l border-gray-200 pl-2">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <Link
                        key={category}
                        to={`/products?category=${encodeURIComponent(
                          category,
                        )}`}
                        onClick={() => {
                          setCategoriesOpen(false);
                          setMobileOpen(false);
                        }}
                        className="block rounded-lg px-4 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#0952d4]"
                      >
                        {category}
                      </Link>
                    ))
                  ) : (
                    <div className="px-4 py-2.5 text-sm text-gray-500">
                      Loading categories...
                    </div>
                  )}
                </div>
              )}

              {/* For Buyers */}
              <Link
                to="/for-buyers"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                For Buyers
              </Link>

              {/* For Suppliers */}
              <Link
                to="/supplier/requirements"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                For Suppliers
              </Link>

              {/* My Requirements */}
              <Link
                to="/my-requirements"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <FileText size={18} />
                My Requirements
              </Link>

              {/* My Quotes */}
              <Link
                to="/my-quotes"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <ShoppingBag size={18} />
                My Quotes
              </Link>

              {/* My Profile */}
              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/my-profile");
                }}
                className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-left text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <User size={18} />
                My Profile
              </button>

              {/* Pricing */}
              <Link
                to="/pricing"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Pricing
              </Link>

              {/* Insights */}
              <Link
                to="/insights"
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                Insights
              </Link>

              <div className="my-2 border-t border-gray-200" />

              {/* Post Requirement */}
              <Link
                to="/post-requirement"
                onClick={() => setMobileOpen(false)}
                className="mx-4 rounded-xl bg-[#fd8836] px-4 py-3 text-center text-sm font-bold text-white shadow-sm transition hover:bg-[#f77925]"
              >
                Post Requirement
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
