import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeTab, setActiveTab] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH PRODUCTS + CATEGORIES
  // ==========================================

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const [productsResponse, suppliersResponse] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/suppliers"),
        ]);

        if (!productsResponse.ok) {
          throw new Error("Failed to fetch products");
        }

        if (!suppliersResponse.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        const productsData = await productsResponse.json();
        const suppliersData = await suppliersResponse.json();

        if (!productsData.success) {
          throw new Error("Product API returned an error");
        }

        if (!suppliersData.success) {
          throw new Error("Supplier API returned an error");
        }

        const realProducts = productsData.products || [];
        const realSuppliers = suppliersData.suppliers || [];

        setProducts(realProducts);

        // ==========================================
        // BUILD SAME CATEGORIES AS CATEGORIES.JSX
        // ==========================================

        const categoryMap = new Map();

        // Product categories
        realProducts.forEach((product) => {
          const categoryName = product?.category?.trim();

          if (!categoryName) return;

          const key = categoryName.toLowerCase();

          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              name: categoryName,
              products: 0,
            });
          }

          categoryMap.get(key).products += 1;
        });

        // Supplier industries
        realSuppliers.forEach((supplier) => {
          const categoryName = supplier?.industry?.trim();

          if (!categoryName) return;

          const key = categoryName.toLowerCase();

          if (!categoryMap.has(key)) {
            categoryMap.set(key, {
              name: categoryName,
              products: 0,
            });
          }
        });

        const realCategories = Array.from(categoryMap.values())
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((category) => category.name);

        setCategories(["All", ...realCategories]);
      } catch (err) {
        console.error("Popular products error:", err);
        setError("Unable to load products and categories.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ==========================================
  // FILTER PRODUCTS
  // ==========================================

  const filteredProducts = useMemo(() => {
    if (activeTab === "All") {
      return products;
    }

    return products.filter(
      (product) =>
        product.category?.trim().toLowerCase() ===
        activeTab.trim().toLowerCase(),
    );
  }, [products, activeTab]);

  // Show maximum 8 products
  const displayedProducts = filteredProducts.slice(0, 8);

  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ==========================================
            CATEGORIES
        ========================================== */}

        <div className="mb-10 flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const isActive = activeTab === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveTab(category)}
                className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-semibold transition ${
                  isActive
                    ? "bg-[#0952d4] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-[#0952d4]/10 hover:text-[#0952d4]"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* ==========================================
            HEADING
        ========================================== */}

        <div>
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fd8836]">
            Discover Products
          </p>

          <h2 className="text-3xl font-black tracking-tight text-[#0b1f3a] sm:text-4xl">
            Popular Products
          </h2>

          <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
            Source directly from trusted manufacturers and suppliers across
            India.
          </p>
        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-gray-200 bg-white"
              >
                <div className="h-48 bg-gray-200" />

                <div className="space-y-3 p-5">
                  <div className="h-4 w-1/3 rounded bg-gray-200" />
                  <div className="h-5 w-3/4 rounded bg-gray-200" />
                  <div className="h-4 w-full rounded bg-gray-200" />
                  <div className="h-10 w-full rounded bg-gray-200" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ==========================================
            ERROR
        ========================================== */}

        {!loading && error && (
          <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 px-6 py-10 text-center">
            <p className="text-sm font-semibold text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* ==========================================
            REAL PRODUCTS
        ========================================== */}

        {!loading && !error && displayedProducts.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {displayedProducts.map((product) => (
              <Link
                key={product.id}
                to={`/products/${product.id}`}
                className="block h-full"
              >
                <div className="h-full transition duration-300 hover:-translate-y-1">
                  <ProductCard product={product} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ==========================================
            NO PRODUCTS
        ========================================== */}

        {!loading && !error && displayedProducts.length === 0 && (
          <div className="mt-10 rounded-2xl border border-gray-200 bg-gray-50 px-6 py-14 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white text-2xl shadow-sm">
              📦
            </div>

            <h3 className="mt-5 text-lg font-bold text-[#0b1f3a]">
              No products found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no products in this category.
            </p>

            {activeTab !== "All" && (
              <button
                type="button"
                onClick={() => setActiveTab("All")}
                className="mt-5 rounded-xl bg-[#0952d4] px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                View All Products
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default PopularProducts;
