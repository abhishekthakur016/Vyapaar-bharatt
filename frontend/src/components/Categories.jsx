import { ArrowRight } from "lucide-react"
import { categories } from "../data/categories"
import CategoryCard from "./CategoryCard"

function Categories() {
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
              Explore 48 Categories
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Discover products and suppliers across India's largest
              B2B trade categories.
            </p>

          </div>

          <button className="group flex items-center gap-2 self-start rounded-xl border border-[#0952d4] px-5 py-3 text-sm font-bold text-[#0952d4] transition hover:bg-[#0952d4] hover:text-white sm:self-auto">

            View All Categories

            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />

          </button>

        </div>

        {/* Category grid */}
        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
            />
          ))}

        </div>

      </div>

    </section>
  )
}

export default Categories