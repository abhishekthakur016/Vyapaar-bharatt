import { products } from "../data/products"
import ProductCard from "./ProductCard"

const tabs = [
  "All",
  "Electronics",
  "Machinery",
  "Agriculture",
  "Chemicals",
  "Textiles",
]

function PopularProducts() {
  return (
    <section className="bg-white py-20 sm:py-24">

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Heading */}
        <div className="flex flex-col gap-6">

          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fd8836]">
              Discover Products
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[#0b1f3a] sm:text-4xl">
              Popular Products
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Source directly from trusted manufacturers and suppliers
              across India.
            </p>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">

            {tabs.map((tab, index) => (
              <button
                key={tab}
                className={`whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold transition ${
                  index === 0
                    ? "bg-[#0952d4] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-[#0952d4]/10 hover:text-[#0952d4]"
                }`}
              >
                {tab}
              </button>
            ))}

          </div>

        </div>

        {/* Products */}
        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}

        </div>

      </div>

    </section>
  )
}

export default PopularProducts