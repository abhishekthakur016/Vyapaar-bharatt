import { ArrowRight } from "lucide-react"

function CategoryCard({ category }) {
  const Icon = category.icon

  return (
    <button className="group w-full rounded-2xl border border-gray-200 bg-white p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#0952d4]/20 hover:shadow-[0_15px_35px_rgba(9,82,212,0.10)]">

      {/* Icon */}
      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#0952d4]/10 transition duration-300 group-hover:bg-[#0952d4]">
          <Icon
            size={24}
            className="text-[#0952d4] transition duration-300 group-hover:text-white"
          />
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-50 transition duration-300 group-hover:bg-[#fd8836]">
          <ArrowRight
            size={16}
            className="text-gray-400 transition duration-300 group-hover:text-white"
          />
        </div>

      </div>

      {/* Content */}
      <h3 className="mt-5 text-base font-bold leading-6 text-[#0b1f3a]">
        {category.name}
      </h3>

      <p className="mt-2 line-clamp-2 text-sm leading-5 text-gray-500">
        {category.description}
      </p>

      {/* Product count */}
      <p className="mt-4 text-xs font-bold text-[#0952d4]">
        {category.products}
      </p>

    </button>
  )
}

export default CategoryCard