import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import SupplierCard from "./SupplierCard";

function FeaturedSuppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH REAL SUPPLIERS
  // ==========================================

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/suppliers");

        if (!response.ok) {
          throw new Error("Failed to fetch suppliers");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Supplier API returned an error");
        }

        const realSuppliers = data.suppliers || [];

        // ==========================================
        // NORMALIZE DATABASE DATA
        // ==========================================

        const formattedSuppliers = realSuppliers.map((supplier) => {
          const image =
            supplier.image_url ||
            supplier.logo_url ||
            supplier.logo ||
            supplier.image ||
            "";

          return {
            ...supplier,

            // Main database image
            image_url: image,

            // Compatibility with SupplierCard
            image: image,
            logo: image,
            logo_url: image,

            // Real supplier fields
            reviews: supplier.reviews || 0,
            rating: supplier.rating || 0,
            products: supplier.products || supplier.product_count || 0,

            // Experience
            experience:
              supplier.experience || supplier.years_of_experience || 0,

            // Location
            location: supplier.location || "India",

            // Industry
            industry: supplier.industry || "B2B Supplier",

            // Verification
            verified: Boolean(supplier.verified),
          };
        });

        setSuppliers(formattedSuppliers);
      } catch (err) {
        console.error("Featured suppliers error:", err);
        setError("Unable to load suppliers.");
      } finally {
        setLoading(false);
      }
    };

    fetchSuppliers();
  }, []);

  // ==========================================
  // SHOW ONLY FIRST 6 SUPPLIERS
  // ==========================================

  const featuredSuppliers = suppliers.slice(0, 6);

  return (
    <section className="bg-[#f8fafc] py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ==========================================
            HEADING
        ========================================== */}

        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-[#fd8836]">
              Trusted Businesses
            </p>

            <h2 className="text-3xl font-black tracking-tight text-[#0b1f3a] sm:text-4xl">
              Featured Verified Suppliers
            </h2>

            <p className="mt-3 max-w-2xl text-base leading-7 text-gray-500">
              Connect directly with verified manufacturers, wholesalers and
              suppliers across India.
            </p>
          </div>

          {/* Supplier Directory */}

          <Link
            to="/suppliers"
            className="group flex items-center gap-2 self-start rounded-xl border border-[#0952d4] px-5 py-3 text-sm font-bold text-[#0952d4] transition hover:bg-[#0952d4] hover:text-white sm:self-auto"
          >
            Supplier Directory
            <ArrowRight
              size={17}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        {/* ==========================================
            LOADING
        ========================================== */}

        {loading && (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-slate-200" />

                  <div className="flex-1">
                    <div className="h-5 w-3/4 rounded bg-slate-200" />

                    <div className="mt-3 h-4 w-1/2 rounded bg-slate-200" />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-2/3 rounded bg-slate-200" />
                  <div className="h-10 w-full rounded bg-slate-200" />
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
              className="mt-4 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        )}

        {/* ==========================================
            REAL SUPPLIERS
        ========================================== */}

        {!loading && !error && featuredSuppliers.length > 0 && (
          <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredSuppliers.map((supplier) => (
              <Link
                key={supplier.id}
                to={`/suppliers/${supplier.id}`}
                className="block h-full"
              >
                <div className="h-full transition duration-300 hover:-translate-y-1">
                  <SupplierCard supplier={supplier} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* ==========================================
            NO SUPPLIERS
        ========================================== */}

        {!loading && !error && featuredSuppliers.length === 0 && (
          <div className="mt-10 rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <h3 className="text-lg font-bold text-[#0b1f3a]">
              No suppliers found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              There are currently no suppliers available.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedSuppliers;
