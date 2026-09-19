import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CheckCircle2,
  Clock3,
  MapPin,
  Package,
  Phone,
  Mail,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showQuoteForm, setShowQuoteForm] = useState(false);

  const [quoteData, setQuoteData] = useState({
    quantity: "",
    targetPrice: "",
    deliveryLocation: "",
    requiredBy: "",
    message: "",
  });

  const [quoteSubmitting, setQuoteSubmitting] = useState(false);
  const [quoteSuccess, setQuoteSuccess] = useState("");
  const [quoteError, setQuoteError] = useState("");

  // ==========================================
  // FETCH PRODUCT
  // ==========================================

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `http://localhost:5000/api/products/${id}`,
        );

        if (!response.ok) {
          throw new Error("Product not found");
        }

        const data = await response.json();

        if (!data.success) {
          throw new Error("Failed to load product");
        }

        setProduct(data.product);
      } catch (err) {
        console.error("Product details error:", err);

        setError("Unable to load product details.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // ==========================================
  // QUOTE FORM CHANGE
  // ==========================================

  const handleQuoteChange = (e) => {
    const { name, value } = e.target;

    setQuoteData((current) => ({
      ...current,
      [name]: value,
    }));

    setQuoteError("");
    setQuoteSuccess("");
  };

  // ==========================================
  // SUBMIT QUOTE REQUEST
  // ==========================================

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();

    if (!product) {
      return;
    }

    try {
      setQuoteSubmitting(true);
      setQuoteError("");
      setQuoteSuccess("");

      const response = await fetch("http://localhost:5000/api/requirements", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: product.name,

          category: product.category || "General",

          subcategory: product.subcategory || null,

          quantity: Number(quoteData.quantity),

          unit: product.moq_unit || "Piece",

          description:
            quoteData.message ||
            `I am interested in ${product.name}. Please share your best quotation.`,

          minBudget: null,

          maxBudget: quoteData.targetPrice
            ? Number(quoteData.targetPrice)
            : null,

          deliveryLocation: quoteData.deliveryLocation,

          requiredBy: quoteData.requiredBy || null,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit quote request");
      }

      setQuoteSuccess("Your quote request has been sent successfully.");

      setQuoteData({
        quantity: "",
        targetPrice: "",
        deliveryLocation: "",
        requiredBy: "",
        message: "",
      });
    } catch (error) {
      console.error("Quote request error:", error);

      setQuoteError(
        error.message || "Unable to send quote request. Please try again.",
      );
    } finally {
      setQuoteSubmitting(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-5 w-32 rounded bg-slate-200" />

            <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
              <div className="h-[420px] rounded-3xl bg-slate-200" />

              <div className="space-y-5">
                <div className="h-8 w-3/4 rounded bg-slate-200" />

                <div className="h-5 w-1/2 rounded bg-slate-200" />

                <div className="h-32 rounded-2xl bg-slate-200" />

                <div className="h-12 rounded-xl bg-slate-200" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error || !product) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
        <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
            <Package size={28} className="text-red-500" />
          </div>

          <h1 className="mt-5 text-xl font-bold text-[#0b1f3a]">
            Product Not Found
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            {error || "The requested product could not be found."}
          </p>

          <button
            onClick={() => navigate("/products")}
            className="mt-6 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-bold text-white"
          >
            Back to Products
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ==========================================
          TOP BAR
      ========================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#0952d4]"
          >
            <ArrowLeft size={17} />
            Back
          </button>
        </div>
      </section>

      {/* ==========================================
          PRODUCT SECTION
      ========================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* ========================================
              LEFT SIDE
          ======================================== */}

          <div>
            {/* PRODUCT IMAGE */}

            <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm sm:min-h-[460px]">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full max-h-[460px] w-full object-contain"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-blue-50">
                    <Package
                      size={58}
                      strokeWidth={1.2}
                      className="text-[#0952d4]"
                    />
                  </div>

                  <p className="mt-5 text-sm font-medium text-slate-400">
                    Product image coming soon
                  </p>
                </div>
              )}
            </div>

            {/* PRODUCT DESCRIPTION */}

            <div className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 sm:p-8">
              <h2 className="text-xl font-bold text-[#0b1f3a]">
                Product Description
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-600">
                {product.description ||
                  "Product details are available from the supplier."}
              </p>

              {/* PRODUCT DETAILS */}

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Category
                  </p>

                  <p className="mt-2 font-semibold text-[#0b1f3a]">
                    {product.category || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Subcategory
                  </p>

                  <p className="mt-2 font-semibold text-[#0b1f3a]">
                    {product.subcategory || "—"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Minimum Order
                  </p>

                  <p className="mt-2 font-semibold text-[#0b1f3a]">
                    {product.moq
                      ? `${product.moq} ${product.moq_unit || ""}`
                      : "On Request"}
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Availability
                  </p>

                  <p className="mt-2 font-semibold text-green-600">
                    {product.availability || "Available"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================
              RIGHT SIDE
          ======================================== */}

          <div>
            <div className="sticky top-24">
              {/* PRODUCT SUMMARY */}

              <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
                {/* CATEGORY + VERIFIED */}

                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                    {product.category}
                  </span>

                  {product.supplier_verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700">
                      <CheckCircle2 size={13} />
                      Verified Supplier
                    </span>
                  )}
                </div>

                {/* PRODUCT NAME */}

                <h1 className="mt-5 text-3xl font-black leading-tight text-[#0b1f3a] sm:text-4xl">
                  {product.name}
                </h1>

                {/* PRICE */}

                <div className="mt-6 rounded-2xl bg-orange-50 p-5">
                  <p className="text-xs font-bold uppercase tracking-wide text-orange-600">
                    Price
                  </p>

                  <p className="mt-1 text-2xl font-black text-orange-500">
                    {product.price
                      ? `₹${Number(product.price).toLocaleString("en-IN")}`
                      : "Price on Request"}
                  </p>

                  {product.price_unit && (
                    <p className="mt-1 text-xs text-slate-500">
                      {product.price_unit}
                    </p>
                  )}
                </div>

                {/* QUICK DETAILS */}

                <div className="mt-6 space-y-4">
                  {/* MOQ */}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Package size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Minimum Order</p>

                      <p className="text-sm font-bold text-slate-700">
                        {product.moq
                          ? `${product.moq} ${product.moq_unit || ""}`
                          : "On Request"}
                      </p>
                    </div>
                  </div>

                  {/* LOCATION */}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <MapPin size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">
                        Supplier Location
                      </p>

                      <p className="text-sm font-bold text-slate-700">
                        {product.supplier_location || "India"}
                      </p>
                    </div>
                  </div>

                  {/* AVAILABILITY */}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                      <Clock3 size={18} />
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Availability</p>

                      <p className="text-sm font-bold text-green-600">
                        {product.availability || "Available"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* REQUEST QUOTE */}

                <button
                  onClick={() => {
                    setShowQuoteForm(true);
                    setQuoteSuccess("");
                    setQuoteError("");
                  }}
                  className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
                >
                  Request a Quote
                  <ArrowRight size={17} />
                </button>

                {/* VIEW SUPPLIER */}

                <Link
                  to={`/suppliers/${product.supplier_id}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-[#0952d4] transition hover:border-blue-200 hover:bg-blue-50"
                >
                  <Building2 size={17} />
                  View Supplier
                </Link>

                {/* TRUST MESSAGE */}

                <div className="mt-5 flex items-start gap-3 rounded-2xl bg-slate-50 p-4">
                  <ShieldCheck
                    size={20}
                    className="mt-0.5 shrink-0 text-blue-600"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    Request a quote directly from the supplier and discuss your
                    exact quantity, delivery and commercial requirements.
                  </p>
                </div>
              </div>

              {/* ====================================
                  SUPPLIER CARD
              ==================================== */}

              <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Building2 size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Supplied By
                    </p>

                    <h3 className="mt-1 font-bold text-[#0b1f3a]">
                      {product.supplier_name}
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      {product.supplier_business_type ||
                        product.supplier_industry}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <MapPin size={15} className="text-blue-600" />

                    {product.supplier_location || "India"}
                  </div>

                  {product.supplier_phone && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Phone size={15} className="text-blue-600" />

                      {product.supplier_phone}
                    </div>
                  )}

                  {product.supplier_email && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Mail size={15} className="text-blue-600" />

                      {product.supplier_email}
                    </div>
                  )}
                </div>

                <Link
                  to={`/suppliers/${product.supplier_id}`}
                  className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-200"
                >
                  Supplier Profile
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==========================================
          QUOTE MODAL
      ========================================== */}

      {showQuoteForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
              <div>
                <h2 className="text-xl font-bold text-[#0b1f3a]">
                  Request a Quote
                </h2>

                <p className="mt-1 text-xs text-slate-500">{product.name}</p>
              </div>

              <button
                type="button"
                onClick={() => setShowQuoteForm(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* FORM */}

            <form onSubmit={handleQuoteSubmit} className="space-y-5 p-5 sm:p-6">
              {/* QUANTITY + TARGET PRICE */}

              <div className="grid gap-4 sm:grid-cols-2">
                {/* QUANTITY */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Required Quantity
                  </label>

                  <input
                    type="number"
                    name="quantity"
                    min={product.moq || 1}
                    value={quoteData.quantity}
                    onChange={handleQuoteChange}
                    placeholder={`e.g. ${product.moq || 10}`}
                    required
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  {product.moq && (
                    <p className="mt-1.5 text-xs text-slate-400">
                      Minimum order: {product.moq} {product.moq_unit || ""}
                    </p>
                  )}
                </div>

                {/* TARGET PRICE */}

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Target Price
                  </label>

                  <input
                    type="number"
                    name="targetPrice"
                    min="0"
                    value={quoteData.targetPrice}
                    onChange={handleQuoteChange}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />

                  <p className="mt-1.5 text-xs text-slate-400">
                    Your expected budget
                  </p>
                </div>
              </div>

              {/* DELIVERY LOCATION */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Delivery Location
                </label>

                <input
                  type="text"
                  name="deliveryLocation"
                  value={quoteData.deliveryLocation}
                  onChange={handleQuoteChange}
                  placeholder="e.g. Ludhiana, Punjab"
                  required
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* REQUIRED BY */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Required By
                </label>

                <input
                  type="date"
                  name="requiredBy"
                  value={quoteData.requiredBy}
                  onChange={handleQuoteChange}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* MESSAGE */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Message / Requirements
                </label>

                <textarea
                  name="message"
                  rows="5"
                  value={quoteData.message}
                  onChange={handleQuoteChange}
                  placeholder="Tell the supplier about your requirements..."
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* INFO */}

              <div className="rounded-xl bg-blue-50 p-4">
                <div className="flex gap-3">
                  <Truck size={19} className="mt-0.5 shrink-0 text-blue-600" />

                  <p className="text-xs leading-5 text-slate-600">
                    The supplier can respond with pricing, delivery time and
                    other commercial terms.
                  </p>
                </div>
              </div>

              {/* SUCCESS */}

              {quoteSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={20}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <p className="text-sm font-semibold text-green-700">
                        Request Submitted
                      </p>

                      <p className="mt-1 text-xs leading-5 text-green-600">
                        {quoteSuccess}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* ERROR */}

              {quoteError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm font-semibold text-red-700">
                    {quoteError}
                  </p>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={quoteSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {quoteSubmitting ? (
                  <>Sending Request...</>
                ) : (
                  <>
                    Send Quote Request
                    <ArrowRight size={17} />
                  </>
                )}
              </button>

              {/* CLOSE AFTER SUCCESS */}

              {quoteSuccess && (
                <button
                  type="button"
                  onClick={() => {
                    setShowQuoteForm(false);
                    setQuoteSuccess("");
                  }}
                  className="w-full rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  Done
                </button>
              )}
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
