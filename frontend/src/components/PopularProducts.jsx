import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  MapPin,
  Package,
  Sparkles,
  Store,
} from "lucide-react";

/* =========================================================
   FIELD HELPERS — read product data safely whatever the API names
========================================================= */

const pick = (...values) =>
  values.find((v) => v !== undefined && v !== null && String(v).trim() !== "");

const formatPrice = (value) => {
  if (value === undefined || value === null || value === "") return null;
  const n = Number(value);
  return Number.isNaN(n) ? String(value) : `₹${n.toLocaleString("en-IN")}`;
};

/* =========================================================
   PRODUCT CARD
========================================================= */

function ProductTile({ product, index }) {
  const [imgFailed, setImgFailed] = useState(false);

  const name =
    pick(product.name, product.title, product.product_name) || "Product";
  const supplier = pick(
    product.supplier_name,
    product.supplierName,
    product.supplier?.name,
    product.company_name,
    product.business_name,
  );
  const location = pick(
    product.location,
    product.city,
    product.supplier_location,
    product.supplier?.location,
  );
  const unit = pick(product.unit, product.price_unit);
  const moq = pick(product.moq, product.min_order, product.minimum_order);
  const price = formatPrice(pick(product.price, product.min_price));
  const priceLabel =
    price || pick(product.priceType, product.price_type) || "Price on Request";
  const verified = Boolean(product.verified || product.supplier?.verified);
  const image = product.image_url;

  return (
    <Link
      to={`/products/${product.id}`}
      style={{ animationDelay: `${Math.min(index, 8) * 60}ms` }}
      className="pp-fade group relative flex h-full flex-col overflow-hidden rounded-[24px] bg-white shadow-[0_1px_3px_rgba(15,23,42,0.04),0_10px_30px_-15px_rgba(15,23,42,0.12)] ring-1 ring-slate-900/[0.05] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-25px_rgba(9,82,212,0.35)] hover:ring-[#0952d4]/20"
    >
      {/* IMAGE */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {image && !imgFailed ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0952d4]/[0.06] to-[#fd8836]/[0.08]">
            <Package
              size={40}
              strokeWidth={1.5}
              className="text-[#0952d4]/40"
            />
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#071a40]/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {product.category && (
          <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#0952d4] shadow-sm backdrop-blur-md">
            {product.category}
          </span>
        )}

        <span className="absolute bottom-3 right-3 flex h-10 w-10 translate-y-3 items-center justify-center rounded-full bg-[#fd8836] text-white opacity-0 shadow-lg transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100">
          <ArrowUpRight size={18} />
        </span>
      </div>

      {/* BODY */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 text-base font-extrabold leading-snug tracking-[-0.01em] text-[#0b1f3a] transition-colors duration-300 group-hover:text-[#0952d4]">
          {name}
        </h3>

        {(supplier || location) && (
          <div className="mt-2 space-y-1">
            {supplier && (
              <p className="flex items-center gap-1.5 truncate text-xs font-medium text-slate-500">
                <Store size={13} className="shrink-0 text-slate-400" />
                <span className="truncate">{supplier}</span>
                {verified && (
                  <BadgeCheck
                    size={14}
                    className="shrink-0 fill-[#0952d4] text-white"
                  />
                )}
              </p>
            )}
            {location && (
              <p className="flex items-center gap-1.5 truncate text-xs text-slate-400">
                <MapPin size={13} className="shrink-0 text-[#fd8836]" />
                <span className="truncate">{location}</span>
              </p>
            )}
          </div>
        )}

        {/* PRICE */}
        <div className="mt-auto pt-5">
          <div className="flex items-end justify-between gap-3 border-t border-dashed border-slate-200 pt-4">
            <div className="min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Price
              </p>
              <p
                className={`mt-0.5 truncate font-black tracking-tight ${
                  price ? "text-lg text-[#0b1f3a]" : "text-sm text-[#fd641c]"
                }`}
              >
                {priceLabel}
                {price && unit && (
                  <span className="ml-1 text-xs font-semibold text-slate-400">
                    / {unit}
                  </span>
                )}
              </p>
            </div>

            {moq && (
              <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-500">
                MOQ {moq}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* =========================================================
   POPULAR PRODUCTS
========================================================= */

function PopularProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [activeTab, setActiveTab] = useState("All");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const scrollerRef = useRef(null);
  const [canScroll, setCanScroll] = useState({ left: false, right: false });

  // ==========================================
  // FETCH REAL PRODUCTS + CATEGORIES
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

        // NORMALIZE PRODUCT DATA
        const formattedProducts = realProducts.map((product) => {
          const imageUrl =
            product.image_url ||
            product.imageUrl ||
            product.image ||
            product.product_image ||
            "";

          return {
            ...product,
            image_url: imageUrl,
            image: imageUrl,
            imageUrl: imageUrl,
            product_image: imageUrl,
          };
        });

        setProducts(formattedProducts);

        // BUILD REAL CATEGORIES
        const categoryMap = new Map();

        formattedProducts.forEach((product) => {
          const categoryName = product?.category?.trim();
          if (!categoryName) return;
          const key = categoryName.toLowerCase();
          if (!categoryMap.has(key)) {
            categoryMap.set(key, { name: categoryName, products: 0 });
          }
          categoryMap.get(key).products += 1;
        });

        realSuppliers.forEach((supplier) => {
          const categoryName = supplier?.industry?.trim();
          if (!categoryName) return;
          const key = categoryName.toLowerCase();
          if (!categoryMap.has(key)) {
            categoryMap.set(key, { name: categoryName, products: 0 });
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

  // Display-only: product count per category for the filter badges
  const counts = useMemo(() => {
    const map = { all: products.length };
    products.forEach((p) => {
      const k = p.category?.trim().toLowerCase();
      if (k) map[k] = (map[k] || 0) + 1;
    });
    return map;
  }, [products]);

  // SHOW MAXIMUM 8 PRODUCTS
  const displayedProducts = filteredProducts.slice(0, 8);

  // ==========================================
  // FILTER SCROLL ARROWS (display only)
  // ==========================================

  const updateScrollState = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScroll({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [categories]);

  const scrollFilters = (dir) => {
    scrollerRef.current?.scrollBy({ left: dir * 240, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-24">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#1684e8]/[0.07] blur-3xl" />
        <div className="absolute -right-40 bottom-10 h-80 w-80 rounded-full bg-[#fd8836]/[0.08] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* HEADING */}
        <div className="text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[#fd8836]/20 bg-[#fd8836]/[0.06] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#fd8836]">
            <Sparkles size={13} />
            Discover Products
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#0b1f3a] sm:text-[44px]">
            Popular{" "}
            <span className="bg-gradient-to-r from-[#0952d4] to-[#1684e8] bg-clip-text text-transparent">
              Products
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-slate-500">
            Source directly from trusted manufacturers and suppliers across
            India.
          </p>
        </div>

        {/* FILTER */}
        <div className="relative mx-auto mt-10 max-w-5xl">
          <div className="relative rounded-full bg-slate-100/80 p-1.5 ring-1 ring-inset ring-slate-900/[0.04]">
            {/* Arrows (desktop) */}
            <button
              type="button"
              onClick={() => scrollFilters(-1)}
              aria-label="Scroll categories left"
              className={`absolute left-1.5 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0b1f3a] shadow-md transition-all duration-300 hover:text-[#0952d4] sm:flex ${
                canScroll.left ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => scrollFilters(1)}
              aria-label="Scroll categories right"
              className={`absolute right-1.5 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0b1f3a] shadow-md transition-all duration-300 hover:text-[#0952d4] sm:flex ${
                canScroll.right
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }`}
            >
              <ChevronRight size={18} />
            </button>

            <div
              ref={scrollerRef}
              onScroll={updateScrollState}
              className={`pp-scroller flex gap-1 overflow-x-auto scroll-smooth ${
                canScroll.left && canScroll.right
                  ? "[mask-image:linear-gradient(to_right,transparent,black_48px,black_calc(100%-48px),transparent)]"
                  : canScroll.right
                    ? "[mask-image:linear-gradient(to_right,black_calc(100%-48px),transparent)]"
                    : canScroll.left
                      ? "[mask-image:linear-gradient(to_right,transparent,black_48px)]"
                      : ""
              }`}
            >
              {categories.map((category) => {
                const isActive = activeTab === category;
                const count = counts[category.trim().toLowerCase()] || 0;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveTab(category)}
                    aria-pressed={isActive}
                    className={`group inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] sm:px-5 ${
                      isActive
                        ? "bg-gradient-to-r from-[#0952d4] to-[#1684e8] text-white shadow-[0_8px_20px_-8px_rgba(9,82,212,0.8)]"
                        : "text-slate-600 hover:bg-white hover:text-[#0952d4] hover:shadow-sm"
                    }`}
                  >
                    {category === "All" && <LayoutGrid size={15} />}
                    {category}
                    {!loading && (
                      <span
                        className={`min-w-[22px] rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold transition-colors ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-white text-slate-400 group-hover:text-[#0952d4]"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Result line */}
        {!loading && !error && (
          <p className="mt-6 text-center text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-[#0b1f3a]">
              {displayedProducts.length}
            </span>{" "}
            of {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
            {activeTab !== "All" && (
              <>
                {" "}
                in <span className="font-bold text-[#0952d4]">{activeTab}</span>
              </>
            )}
          </p>
        )}

        {/* LOADING */}
        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="overflow-hidden rounded-[24px] bg-white ring-1 ring-slate-900/[0.05]"
              >
                <div className="aspect-[4/3] animate-pulse bg-slate-200/70" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-3/4 animate-pulse rounded-full bg-slate-200" />
                  <div className="h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
                  <div className="mt-6 h-6 w-1/3 animate-pulse rounded-full bg-slate-200/80" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className="mx-auto mt-10 max-w-lg rounded-[24px] bg-white px-6 py-10 text-center shadow-sm ring-1 ring-red-100">
            <p className="text-sm font-semibold text-red-600">{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-[#0952d4] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#0744b5]"
            >
              Retry
            </button>
          </div>
        )}

        {/* REAL PRODUCTS */}
        {!loading && !error && displayedProducts.length > 0 && (
          <div
            key={activeTab}
            className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          >
            {displayedProducts.map((product, index) => (
              <ProductTile key={product.id} product={product} index={index} />
            ))}
          </div>
        )}

        {/* NO PRODUCTS */}
        {!loading && !error && displayedProducts.length === 0 && (
          <div className="mx-auto mt-10 max-w-lg rounded-[24px] bg-slate-50/80 px-6 py-14 text-center ring-1 ring-slate-900/[0.05]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-[#0952d4] shadow-sm">
              <Package size={28} />
            </div>

            <h3 className="mt-5 text-lg font-extrabold text-[#0b1f3a]">
              No products found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              There are currently no products in this category.
            </p>

            {activeTab !== "All" && (
              <button
                type="button"
                onClick={() => setActiveTab("All")}
                className="mt-6 rounded-full bg-[#0952d4] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0744b5]"
              >
                View All Products
              </button>
            )}
          </div>
        )}
      </div>

      <style>{`
        @keyframes ppFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pp-fade { animation: ppFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        .pp-scroller { scrollbar-width: none; -ms-overflow-style: none; }
        .pp-scroller::-webkit-scrollbar { display: none; }
        @media (prefers-reduced-motion: reduce) {
          .pp-fade { animation: none; }
          .pp-fade, .pp-fade * { transition: none !important; }
        }
      `}</style>
    </section>
  );
}

export default PopularProducts;
