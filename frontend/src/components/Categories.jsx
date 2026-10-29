import { useEffect, useState } from "react";
import { ArrowRight, LayoutGrid, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);

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

        const products = productsData.products || [];
        const suppliers = suppliersData.suppliers || [];

        /* PRODUCT CATEGORIES */

        const productCategoryMap = new Map();

        products.forEach((product) => {
          const rawCategory = product?.category;

          if (!rawCategory) {
            return;
          }

          const categoryName = String(rawCategory).trim();

          if (!categoryName) {
            return;
          }

          const normalizedName = categoryName.toLowerCase();

          if (!productCategoryMap.has(normalizedName)) {
            productCategoryMap.set(normalizedName, {
              name: categoryName,
              products: 0,
              description: "Explore products and suppliers in this category.",
            });
          }

          const currentCategory = productCategoryMap.get(normalizedName);

          currentCategory.products += 1;
        });

        /* SUPPLIER INDUSTRIES */

        const supplierCategoryMap = new Map();

        suppliers.forEach((supplier) => {
          const rawIndustry = supplier?.industry;

          if (!rawIndustry) {
            return;
          }

          const industryName = String(rawIndustry).trim();

          if (!industryName) {
            return;
          }

          const normalizedName = industryName.toLowerCase();

          if (!supplierCategoryMap.has(normalizedName)) {
            supplierCategoryMap.set(normalizedName, {
              name: industryName,
              products: 0,
              description: "Explore products and suppliers in this category.",
            });
          }
        });

        /* COMBINE CATEGORIES
           Product categories first (they have the real count),
           then supplier-only categories without overwriting counts. */

        const combinedCategories = new Map();

        productCategoryMap.forEach((category, normalizedName) => {
          combinedCategories.set(normalizedName, {
            ...category,
          });
        });

        supplierCategoryMap.forEach((category, normalizedName) => {
          if (!combinedCategories.has(normalizedName)) {
            combinedCategories.set(normalizedName, {
              ...category,
            });
          }
        });

        /* SORT */

        const finalCategories = Array.from(combinedCategories.values()).sort(
          (a, b) => a.name.localeCompare(b.name),
        );

        setCategories(finalCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);

        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="relative overflow-hidden bg-[#f8fafc] py-20 sm:py-24">
      {/* Soft background */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(9,82,212,0.14) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="absolute -left-40 top-10 h-80 w-80 rounded-full bg-[#1684e8]/[0.08] blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-80 w-80 rounded-full bg-[#fd8836]/[0.08] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================
            HEADER
        ========================================= */}
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          {/* LEFT */}
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-[#fd8836]/20 bg-[#fd8836]/[0.06] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-[#fd8836]">
              <Sparkles size={13} />
              Explore Marketplace
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] text-[#0b1f3a] sm:text-[44px] sm:leading-[1.1]">
              Explore{" "}
              <span className="bg-gradient-to-r from-[#0952d4] to-[#1684e8] bg-clip-text text-transparent">
                {loading ? "…" : categories.length}{" "}
                {categories.length === 1 ? "Category" : "Categories"}
              </span>
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
              Discover products and suppliers across India's largest B2B &amp;
              B2C trade categories.
            </p>
          </div>

          {/* VIEW ALL */}
          <Link
            to="/products"
            className="group inline-flex h-12 items-center gap-2 self-start rounded-full bg-white pl-5 pr-1.5 text-sm font-bold text-[#0b1f3a] shadow-[0_10px_25px_-12px_rgba(9,82,212,0.35)] ring-1 ring-inset ring-slate-900/[0.06] transition-all duration-300 hover:bg-[#0952d4] hover:text-white hover:ring-[#0952d4] sm:self-auto"
          >
            View All Categories
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#0952d4] text-white transition-all duration-300 group-hover:translate-x-0.5 group-hover:bg-white/20">
              <ArrowRight size={16} />
            </span>
          </Link>
        </div>

        {/* =========================================
            LOADING
        ========================================= */}
        {loading ? (
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="rounded-[24px] bg-white p-6 ring-1 ring-slate-900/[0.05]"
              >
                <div className="h-12 w-12 animate-pulse rounded-2xl bg-slate-200" />
                <div className="mt-6 h-4 w-2/3 animate-pulse rounded-full bg-slate-200" />
                <div className="mt-3 h-3 w-full animate-pulse rounded-full bg-slate-100" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-slate-100" />
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* =========================================
              NO CATEGORIES
          ========================================= */
          <div className="mx-auto mt-12 max-w-lg rounded-[24px] bg-white px-6 py-14 text-center shadow-sm ring-1 ring-slate-900/[0.05]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0952d4]/[0.07] text-[#0952d4]">
              <LayoutGrid size={28} />
            </div>
            <p className="mt-5 text-lg font-extrabold text-[#0b1f3a]">
              No categories available
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Categories appear here as soon as products or suppliers are added.
            </p>
          </div>
        ) : (
          /* =========================================
              CATEGORY GRID
          ========================================= */
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className="cat-fade h-full"
                style={{ animationDelay: `${Math.min(index, 10) * 50}ms` }}
              >
                <CategoryCard category={category} />
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @keyframes catFadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .cat-fade { animation: catFadeUp 600ms cubic-bezier(0.22, 1, 0.36, 1) both; }
        @media (prefers-reduced-motion: reduce) {
          .cat-fade { animation: none; }
        }
      `}</style>
    </section>
  );
}

export default Categories;
