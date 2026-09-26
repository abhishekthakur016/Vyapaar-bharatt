import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import CategoryCard from "./CategoryCard";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [productsResponse, suppliersResponse] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/suppliers"),
        ]);

        if (!productsResponse.ok || !suppliersResponse.ok) {
          throw new Error("Failed to fetch categories");
        }

        const productsData = await productsResponse.json();
        const suppliersData = await suppliersResponse.json();

        // Categories from products
        const productCategories = (productsData.products || [])
          .map((product) => product.category)
          .filter(Boolean);

        // Categories from suppliers
        const supplierCategories = (suppliersData.suppliers || [])
          .map((supplier) => supplier.industry)
          .filter(Boolean);

        // Combine both and remove duplicates
        const allCategories = [
          ...new Set([...productCategories, ...supplierCategories]),
        ].sort((a, b) => a.localeCompare(b));

        setCategories(allCategories);
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
        {/* Section heading */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fd8836]">
              Explore Marketplace
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[#0b1f3a] sm:text-4xl">
              Explore {categories.length} Categories
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Discover products and suppliers across India's largest B2B trade
              categories.
            </p>
          </div>

          <button
            type="button"
            className="group flex items-center gap-2 self-start rounded-xl border border-[#0952d4] px-5 py-3 text-sm font-bold text-[#0952d4] transition hover:bg-[#0952d4] hover:text-white sm:self-auto"
          >
            View All Categories
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>

        {/* Category grid */}
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
          <div className="mt-10 rounded-2xl border border-dashed border-gray-300 py-12 text-center">
            <p className="font-semibold text-gray-500">
              No categories available.
            </p>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard
                key={category}
                category={{
                  id: category,
                  name: category,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;
