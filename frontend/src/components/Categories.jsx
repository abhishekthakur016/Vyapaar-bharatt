import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
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

        /*
        ==================================================
        PRODUCT CATEGORIES
        ==================================================
        */

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

        /*
        ==================================================
        SUPPLIER INDUSTRIES
        ==================================================
        */

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

        /*
        ==================================================
        COMBINE CATEGORIES
        ==================================================
        */

        const combinedCategories = new Map();

        /*
        First add product categories.
        These have the real product count.
        */
        productCategoryMap.forEach((category, normalizedName) => {
          combinedCategories.set(normalizedName, {
            ...category,
          });
        });

        /*
        Then add supplier-only categories.
        If the same category already exists from products,
        we DON'T overwrite the product count.
        */
        supplierCategoryMap.forEach((category, normalizedName) => {
          if (!combinedCategories.has(normalizedName)) {
            combinedCategories.set(normalizedName, {
              ...category,
            });
          }
        });

        /*
        ==================================================
        SORT
        ==================================================
        */

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
    <section className="bg-[#f8fafc] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* =========================================
            HEADER
        ========================================= */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          {/* LEFT */}
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fd8836]">
              Explore Marketplace
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[#0b1f3a] sm:text-4xl">
              Explore {categories.length}{" "}
              {categories.length === 1 ? "Category" : "Categories"}
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Discover products and suppliers across India's largest B2B trade
              categories.
            </p>
          </div>

          {/* VIEW ALL */}
          <Link
            to="/products"
            className="group flex items-center gap-2 self-start rounded-xl border border-[#0952d4] px-5 py-3 text-sm font-bold text-[#0952d4] transition hover:bg-[#0952d4] hover:text-white sm:self-auto"
          >
            View All Categories
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* =========================================
            LOADING
        ========================================= */}

        {loading ? (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="h-48 animate-pulse rounded-2xl bg-gray-200"
              />
            ))}
          </div>
        ) : categories.length === 0 ? (
          /* =========================================
              NO CATEGORIES
          ========================================= */

          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 py-12 text-center">
            <p className="font-semibold text-gray-500">
              No categories available.
            </p>
          </div>
        ) : (
          /* =========================================
              CATEGORY GRID
          ========================================= */

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
