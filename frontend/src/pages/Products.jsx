import { useEffect, useMemo, useState } from "react";

import { Link, useSearchParams } from "react-router-dom";

import {
  Search,
  MapPin,
  Package,
  CheckCircle2,
  ArrowRight,
  SlidersHorizontal,
  ChevronDown,
  X,
} from "lucide-react";

export default function Products() {
  /*
  ==================================================
  STATE
  ==================================================
  */

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState("All Categories");

  const [supplier, setSupplier] = useState("All Suppliers");

  const [availability, setAvailability] = useState("All Availability");

  const [showFilters, setShowFilters] = useState(false);

  /*
  ==================================================
  URL SEARCH PARAMS
  ==================================================
  */

  const [searchParams] = useSearchParams();

  /*
  ==================================================
  FETCH PRODUCTS
  ==================================================
  */

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);

        setError("");

        const response = await fetch("/api/products");

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Product API returned an error");
        }

        setProducts(data.products || []);
      } catch (err) {
        console.error("Product fetch error:", err);

        setError("Unable to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /*
  ==================================================
  READ CATEGORY FROM URL
  ==================================================

  Example:

  /products?category=Transportation

  */

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");

    if (categoryFromUrl) {
      setCategory(categoryFromUrl);
    } else {
      setCategory("All Categories");
    }
  }, [searchParams]);

  /*
  ==================================================
  DYNAMIC CATEGORIES
  ==================================================
  */

  const categories = useMemo(() => {
    const values = products
      .map((product) => product?.category)
      .filter(Boolean)
      .map((category) => String(category).trim());

    const uniqueCategories = [...new Set(values)].sort((a, b) =>
      a.localeCompare(b),
    );

    return ["All Categories", ...uniqueCategories];
  }, [products]);

  /*
  ==================================================
  DYNAMIC SUPPLIERS
  ==================================================
  */

  const suppliers = useMemo(() => {
    const values = products
      .map((product) => product?.supplier_name)
      .filter(Boolean)
      .map((supplierName) => String(supplierName).trim());

    const uniqueSuppliers = [...new Set(values)].sort((a, b) =>
      a.localeCompare(b),
    );

    return ["All Suppliers", ...uniqueSuppliers];
  }, [products]);

  /*
  ==================================================
  DYNAMIC AVAILABILITY
  ==================================================
  */

  const availabilityOptions = useMemo(() => {
    const values = products
      .map((product) => product?.availability)
      .filter(Boolean)
      .map((availability) => String(availability).trim());

    const uniqueAvailability = [...new Set(values)].sort((a, b) =>
      a.localeCompare(b),
    );

    return ["All Availability", ...uniqueAvailability];
  }, [products]);

  /*
  ==================================================
  FILTER PRODUCTS
  ==================================================
  */

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return products.filter((product) => {
      /*
      ----------------------------------------------
      SEARCH
      ----------------------------------------------
      */

      const matchesSearch =
        !query ||
        product.name?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.subcategory?.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.supplier_name?.toLowerCase().includes(query);

      /*
      ----------------------------------------------
      CATEGORY
      ----------------------------------------------
      */

      const matchesCategory =
        category === "All Categories" ||
        product.category?.trim() === category.trim();

      /*
      ----------------------------------------------
      SUPPLIER
      ----------------------------------------------
      */

      const matchesSupplier =
        supplier === "All Suppliers" || product.supplier_name === supplier;

      /*
      ----------------------------------------------
      AVAILABILITY
      ----------------------------------------------
      */

      const matchesAvailability =
        availability === "All Availability" ||
        product.availability === availability;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesSupplier &&
        matchesAvailability
      );
    });
  }, [products, search, category, supplier, availability]);

  /*
  ==================================================
  CLEAR FILTERS
  ==================================================
  */

  const clearFilters = () => {
    setSearch("");

    setCategory("All Categories");

    setSupplier("All Suppliers");

    setAvailability("All Availability");
  };

  /*
  ==================================================
  FORMAT PRICE
  ==================================================
  */

  const formatPrice = (price) => {
    if (
      price === null ||
      price === undefined ||
      price === "" ||
      Number(price) === 0
    ) {
      return "Price on Request";
    }

    return `₹${Number(price).toLocaleString("en-IN")}`;
  };

  /*
  ==================================================
  FORMAT MOQ
  ==================================================
  */

  const formatMOQ = (product) => {
    if (!product?.moq) {
      return "MOQ on Request";
    }

    return `${Number(product.moq).toLocaleString("en-IN")} ${
      product.moq_unit || ""
    }`.trim();
  };

  /*
  ==================================================
  RENDER
  ==================================================
  */

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ==========================================
          HERO
      ========================================== */}

      <section className="bg-[#0952d4]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-18">
          <div className="mx-auto max-w-3xl text-center">
            {/* BADGE */}

            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white">
              <Package size={15} />
              B2B Products Marketplace
            </div>

            {/* HEADING */}

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl">
              Discover Products
              <span className="block text-orange-300">
                From Trusted Suppliers
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-blue-100 sm:text-lg">
              Explore products from manufacturers, suppliers and businesses
              across India.
            </p>

            {/* SEARCH */}

            <div className="mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-2xl bg-white p-2 shadow-2xl sm:flex-row">
              <div className="flex flex-1 items-center gap-3 px-3">
                <Search size={21} className="shrink-0 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search products or suppliers..."
                  className="w-full bg-transparent py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 sm:text-base"
                />
              </div>

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-7 py-3 font-bold text-white transition hover:bg-orange-600"
              >
                Search
                <Search size={17} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          CONTENT
      ========================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* TOP BAR */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-bold text-[#0b1f3a]">Products</h2>

              <p className="mt-1 text-sm text-slate-500">
                {loading
                  ? "Loading products..."
                  : `${filteredProducts.length} products found`}
              </p>
            </div>

            {/* MOBILE FILTER BUTTON */}

            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 lg:hidden"
            >
              <SlidersHorizontal size={17} />
              Filters
            </button>
          </div>
        </div>

        {/* MAIN LAYOUT */}

        <div className="flex flex-col gap-6 lg:flex-row">
          {/* ======================================
              FILTER SIDEBAR
          ====================================== */}

          <aside
            className={`w-full shrink-0 lg:block lg:w-64 ${
              showFilters ? "block" : "hidden"
            }`}
          >
            <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
              {/* FILTER HEADER */}

              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-bold text-[#0b1f3a]">Filters</h3>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>

              {/* CATEGORY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <div className="relative">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-blue-500"
                  >
                    {categories.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* SUPPLIER */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Supplier
                </label>

                <div className="relative">
                  <select
                    value={supplier}
                    onChange={(e) => setSupplier(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-blue-500"
                  >
                    {suppliers.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* AVAILABILITY */}

              <div className="mt-5">
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Availability
                </label>

                <div className="relative">
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white px-3 py-3 pr-9 text-sm outline-none focus:border-blue-500"
                  >
                    {availabilityOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </div>

              {/* INFO */}

              <div className="mt-6 rounded-xl bg-blue-50 p-4">
                <ShieldIcon />

                <h4 className="mt-2 text-sm font-bold text-[#0b1f3a]">
                  Source with confidence
                </h4>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Compare products, review supplier information and request
                  quotes directly.
                </p>
              </div>
            </div>
          </aside>

          {/* ======================================
              PRODUCTS AREA
          ====================================== */}

          <div className="min-w-0 flex-1">
            {/* ACTIVE FILTERS */}

            {(category !== "All Categories" ||
              supplier !== "All Suppliers" ||
              availability !== "All Availability" ||
              search) && (
              <div className="mb-5 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  Active filters:
                </span>

                {/* SEARCH */}

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                  >
                    Search: {search}
                    <X size={12} />
                  </button>
                )}

                {/* CATEGORY */}

                {category !== "All Categories" && (
                  <button
                    type="button"
                    onClick={() => setCategory("All Categories")}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                  >
                    {category}

                    <X size={12} />
                  </button>
                )}

                {/* SUPPLIER */}

                {supplier !== "All Suppliers" && (
                  <button
                    type="button"
                    onClick={() => setSupplier("All Suppliers")}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                  >
                    {supplier}

                    <X size={12} />
                  </button>
                )}

                {/* AVAILABILITY */}

                {availability !== "All Availability" && (
                  <button
                    type="button"
                    onClick={() => setAvailability("All Availability")}
                    className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700"
                  >
                    {availability}

                    <X size={12} />
                  </button>
                )}
              </div>
            )}

            {/* ERROR */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5 text-center">
                <p className="text-sm font-semibold text-red-600">{error}</p>

                <button
                  type="button"
                  onClick={() => window.location.reload()}
                  className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-xs font-bold text-white"
                >
                  Retry
                </button>
              </div>
            )}

            {/* LOADING */}

            {loading ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="h-44 rounded-xl bg-slate-200" />

                    <div className="mt-5 h-4 w-3/4 rounded bg-slate-200" />

                    <div className="mt-3 h-3 w-1/2 rounded bg-slate-200" />

                    <div className="mt-5 h-10 rounded-xl bg-slate-200" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length > 0 ? (
              /* ====================================
                 PRODUCT GRID
              ==================================== */

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl"
                  >
                    {/* PRODUCT IMAGE */}

                    <div className="relative flex h-48 items-center justify-center overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name || "Product"}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <Package
                          size={55}
                          strokeWidth={1.3}
                          className="text-slate-400 transition group-hover:scale-110"
                        />
                      )}
                    </div>

                    {/* PRODUCT CONTENT */}

                    <div className="p-5">
                      {/* CATEGORY */}

                      <div className="flex items-center justify-between gap-3">
                        <span className="max-w-[80%] truncate rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                          {product.category || "General"}
                        </span>

                        {product.supplier_verified && (
                          <CheckCircle2
                            size={17}
                            className="shrink-0 text-blue-600"
                          />
                        )}
                      </div>

                      {/* NAME */}

                      <h3 className="mt-4 line-clamp-2 text-lg font-bold text-[#0b1f3a]">
                        {product.name || "Unnamed Product"}
                      </h3>

                      {/* DESCRIPTION */}

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                        {product.description ||
                          "Product information available from supplier."}
                      </p>

                      {/* SUPPLIER */}

                      <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-xs font-bold text-blue-700">
                          {product.supplier_name
                            ?.split(" ")
                            .slice(0, 2)
                            .map((word) => word[0])
                            .join("")
                            .toUpperCase() || "SU"}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-700">
                            {product.supplier_name || "Supplier"}
                          </p>

                          <div className="flex items-center gap-1 text-xs text-slate-400">
                            <MapPin size={12} />

                            {product.supplier_location || "India"}
                          </div>
                        </div>
                      </div>

                      {/* MOQ + AVAILABILITY */}

                      <div className="mt-4 grid grid-cols-2 gap-2">
                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            MOQ
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-[#0b1f3a]">
                            {formatMOQ(product)}
                          </p>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                            Availability
                          </p>

                          <p className="mt-1 truncate text-sm font-bold text-[#0b1f3a]">
                            {product.availability || "On Request"}
                          </p>
                        </div>
                      </div>

                      {/* PRICE */}

                      <div className="mt-3 rounded-xl bg-orange-50 p-3">
                        <p className="text-xs font-medium text-slate-400">
                          PRICE
                        </p>

                        <p className="mt-1 text-base font-bold text-orange-500">
                          {formatPrice(product.price)}

                          {product.price_unit && (
                            <span className="ml-1 text-xs font-medium text-slate-400">
                              / {product.price_unit}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* VIEW PRODUCT */}

                      <Link
                        to={`/products/${product.id}`}
                        className="mt-4 flex items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-4 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        View Product
                        <ArrowRight size={16} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ====================================
                 NO PRODUCTS
              ==================================== */

              <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
                  <Search size={25} className="text-slate-400" />
                </div>

                <h3 className="mt-5 text-lg font-bold text-[#0b1f3a]">
                  No products found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try another product, supplier or category.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-5 rounded-xl bg-[#0952d4] px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

/*
==================================================
SMALL ICON COMPONENT
==================================================
*/

function ShieldIcon() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-blue-600">
      <CheckCircle2 size={19} />
    </div>
  );
}
