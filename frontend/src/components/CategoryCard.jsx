import { ArrowRight, FolderOpen } from "lucide-react";
import { Link } from "react-router-dom";

function CategoryCard({ category }) {
  const categoryName = category?.name || "Unnamed Category";

  return (
    <Link
      to={`/products?category=${encodeURIComponent(categoryName)}`}
      className="group block w-full rounded-2xl border border-gray-200 bg-white p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#0952d4]/20 hover:shadow-[0_15px_35px_rgba(9,82,212,0.10)]"
    >
      {/* TOP ICONS */}
      <div className="flex items-center justify-between">
        {/* CATEGORY ICON */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0952d4]/10 transition duration-300 group-hover:bg-[#0952d4]">
          <FolderOpen
            size={24}
            className="text-[#0952d4] transition duration-300 group-hover:text-white"
          />
        </div>

        {/* ARROW */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition duration-300 group-hover:bg-[#fd8836]">
          <ArrowRight
            size={16}
            className="text-gray-400 transition duration-300 group-hover:text-white"
          />
        </div>
      </div>

      {/* CATEGORY NAME */}
      <h3 className="mt-5 text-base font-bold leading-6 text-[#0b1f3a]">
        {categoryName}
      </h3>

      {/* DESCRIPTION */}
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
        {category?.description ||
          "Explore products and suppliers in this category."}
      </p>

      {/* PRODUCT COUNT */}
      <p className="mt-4 text-xs font-bold text-[#0952d4]">
        {category?.products ?? 0}{" "}
        {category?.products === 1 ? "Product" : "Products"}
      </p>
    </Link>
  );
}

export default CategoryCard;