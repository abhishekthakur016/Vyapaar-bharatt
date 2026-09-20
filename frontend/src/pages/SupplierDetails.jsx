import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Package,
  Phone,
  Mail,
  ShieldCheck,
  Star,
  Truck,
  Building2,
  Send,
  Image as ImageIcon,
} from "lucide-react";

export default function SupplierDetails() {
  const { id } = useParams();

  const [supplier, setSupplier] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/suppliers/${id}`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Supplier not found");
        }

        const supplierData = {
          ...data.supplier,
          businessType: data.supplier.business_type,
          serviceAreas: data.supplier.service_areas || [],
          services: data.supplier.services || [],
        };

        setSupplier(supplierData);
        // Fetch products belonging to this supplier
        const productsResponse = await fetch("/api/products");

        const productsData = await productsResponse.json();

        if (productsResponse.ok && productsData.success) {
          const supplierProducts = productsData.products.filter(
            (product) => String(product.supplier_id) === String(id),
          );

          setProducts(supplierProducts);
        }
      } catch (err) {
        console.error("Error loading supplier:", err);
        setError(err.message || "Failed to load supplier");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [id]);

  const galleryImages = useMemo(() => {
    if (!supplier) return [];

    const images = [];

    if (supplier.image_url) {
      images.push(supplier.image_url);
    }

    if (Array.isArray(supplier.gallery_images)) {
      supplier.gallery_images.forEach((image) => {
        if (image && !images.includes(image)) {
          images.push(image);
        }
      });
    }

    return images;
  }, [supplier]);

  const nextImage = () => {
    if (!galleryImages.length) return;

    setActiveImage((current) =>
      current === galleryImages.length - 1 ? 0 : current + 1,
    );
  };

  const previousImage = () => {
    if (!galleryImages.length) return;

    setActiveImage((current) =>
      current === 0 ? galleryImages.length - 1 : current - 1,
    );
  };

  const getSupplierInitials = () => {
    if (!supplier?.name) return "VB";

    return supplier.name
      .split(" ")
      .slice(0, 2)
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <section className="bg-[#0952d4]">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <div className="h-5 w-36 animate-pulse rounded bg-white/20" />

            <div className="mt-7 flex items-center gap-4">
              <div className="h-20 w-20 animate-pulse rounded-2xl bg-white/20" />

              <div className="space-y-3">
                <div className="h-8 w-72 animate-pulse rounded bg-white/20" />
                <div className="h-4 w-48 animate-pulse rounded bg-white/20" />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
            <div className="space-y-6">
              <div className="h-[430px] animate-pulse rounded-3xl bg-slate-200" />
              <div className="h-64 animate-pulse rounded-2xl bg-slate-200" />
            </div>

            <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />
          </div>
        </section>
      </main>
    );
  }

  if (error || !supplier) {
    return (
      <main className="min-h-screen bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <Building2 className="mx-auto text-slate-400" size={48} />

          <h1 className="mt-5 text-2xl font-bold text-[#0b1f3a]">
            Supplier not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error || "We could not find this supplier."}
          </p>

          <Link
            to="/for-buyers"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            <ArrowLeft size={17} />
            Back to Suppliers
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================= HEADER ================= */}
      <section className="bg-[#0952d4]">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/for-buyers"
            className="mb-7 inline-flex items-center gap-2 text-sm font-medium text-blue-100 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Suppliers
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {/* Supplier logo */}
              <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-white text-2xl font-black text-[#0952d4] shadow-lg">
                {supplier.image_url ? (
                  <img
                    src={supplier.image_url}
                    alt={supplier.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  getSupplierInitials()
                )}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-black text-white sm:text-3xl">
                    {supplier.name}
                  </h1>

                  {supplier.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                      <CheckCircle2 size={14} />
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-2 text-blue-100">
                  {supplier.industry || "B2B Supplier"}
                </p>

                <div className="mt-2 flex items-center gap-1.5 text-sm text-blue-100">
                  <MapPin size={15} />
                  {supplier.location || "India"}
                </div>
              </div>
            </div>

            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-orange-600">
              <Send size={17} />
              Request Best Quote
            </button>
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[1fr_330px]">
          {/* ================= LEFT ================= */}
          <div className="space-y-6">
            {/* ================= MODERN GALLERY ================= */}
            <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
              {galleryImages.length > 0 ? (
                <>
                  {/* Main image */}
                  <div className="group relative aspect-[16/9] overflow-hidden bg-slate-100">
                    <img
                      src={galleryImages[activeImage]}
                      alt={`${supplier.name} ${activeImage + 1}`}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
                    />

                    {/* Gradient */}
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Image counter */}
                    <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                      <ImageIcon size={14} />
                      {activeImage + 1} / {galleryImages.length}
                    </div>

                    {/* Previous */}
                    {galleryImages.length > 1 && (
                      <button
                        onClick={previousImage}
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/60"
                      >
                        <ChevronLeft size={22} />
                      </button>
                    )}

                    {/* Next */}
                    {galleryImages.length > 1 && (
                      <button
                        onClick={nextImage}
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/35 text-white backdrop-blur-md transition hover:bg-black/60"
                      >
                        <ChevronRight size={22} />
                      </button>
                    )}

                    {/* Supplier name overlay */}
                    <div className="absolute bottom-5 right-5 hidden max-w-[60%] text-right sm:block">
                      <p className="text-lg font-bold text-white">
                        {supplier.name}
                      </p>

                      <p className="text-sm text-white/80">
                        {supplier.business_type || "Business"}
                      </p>
                    </div>
                  </div>

                  {/* Thumbnails */}
                  <div className="border-t border-slate-100 p-4">
                    <div className="flex gap-3 overflow-x-auto pb-1">
                      {galleryImages.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          onClick={() => setActiveImage(index)}
                          className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                            activeImage === index
                              ? "border-[#0952d4] shadow-md"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image}
                            alt={`Gallery thumbnail ${index + 1}`}
                            className="h-full w-full object-cover"
                          />

                          {activeImage === index && (
                            <div className="absolute inset-0 bg-[#0952d4]/10" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Gallery fallback */
                <div className="flex aspect-[16/9] flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-slate-100">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-2xl font-black text-[#0952d4] shadow-sm">
                    {getSupplierInitials()}
                  </div>

                  <p className="mt-4 font-semibold text-[#0b1f3a]">
                    {supplier.name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500">
                    Supplier gallery coming soon
                  </p>
                </div>
              )}
            </section>

            {/* ================= ABOUT ================= */}
            <section className="rounded-2xl border border-slate-200 bg-white p-6">
              <h2 className="text-xl font-bold text-[#0b1f3a]">
                About {supplier.name}
              </h2>

              <p className="mt-4 leading-7 text-slate-600">
                {supplier.description ||
                  "Business information available from this supplier profile."}
              </p>

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4">
                  <Building2 size={20} className="text-blue-600" />

                  <p className="mt-3 text-xs text-slate-400">Business Type</p>

                  <p className="mt-1 font-semibold text-[#0b1f3a]">
                    {supplier.business_type || "Business"}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <Package size={20} className="text-blue-600" />

                  <p className="mt-3 text-xs text-slate-400">Products</p>

                  <p className="mt-1 font-semibold text-[#0b1f3a]">
                    {products.length}+
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <MapPin size={20} className="text-blue-600" />

                  <p className="mt-3 text-xs text-slate-400">Location</p>

                  <p className="mt-1 font-semibold text-[#0b1f3a]">
                    {supplier.location || "India"}
                  </p>
                </div>
              </div>
            </section>

            {/* ================= PRODUCTS ================= */}
            {products.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div>
                  <h2 className="text-xl font-bold text-[#0b1f3a]">
                    Products & Pricing
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Explore products and request the latest quote.
                  </p>
                </div>

                <div className="mt-6 grid gap-4 md:grid-cols-2">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group rounded-xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                          <Package size={20} />
                        </div>

                        <span className="rounded-full bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-600">
                          {product.price_unit || "Price on Request"}
                        </span>
                      </div>

                      <h3 className="mt-4 font-bold text-[#0b1f3a]">
                        {product.name}
                      </h3>

                      <p className="mt-2 text-lg font-black text-orange-500">
                        {product.price
                          ? `₹${Number(product.price).toLocaleString("en-IN")}`
                          : "Price on Request"}
                      </p>

                      {product.moq && (
                        <p className="mt-1 text-xs text-slate-500">
                          Minimum Order:{" "}
                          <span className="font-semibold">
                            {product.moq} {product.moq_unit || ""}
                          </span>
                        </p>
                      )}

                      <Link
                        to={`/products/${product.id}`}
                        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                      >
                        View Product
                        <ArrowRight size={15} />
                      </Link>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-xs leading-5 text-slate-400">
                  Prices shown as indicative or supplier-provided listing
                  information. Final pricing may vary based on quantity,
                  specifications, location, freight, taxes and delivery terms.
                </p>
              </section>
            )}

            {/* ================= SERVICES ================= */}
            {supplier.services?.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-[#0b1f3a]">Services</h2>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {supplier.services.map((service, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                        <CheckCircle2 size={17} />
                      </div>

                      <span className="text-sm font-semibold text-slate-700">
                        {service}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ================= SERVICE AREAS ================= */}
            {supplier.serviceAreas?.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-6">
                <div className="flex items-center gap-3">
                  <Truck className="text-blue-600" size={21} />

                  <h2 className="text-xl font-bold text-[#0b1f3a]">
                    Service Areas
                  </h2>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  {supplier.serviceAreas.map((area, index) => (
                    <span
                      key={index}
                      className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-600"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* ================= RIGHT SIDEBAR ================= */}
          <aside className="space-y-5">
            {/* Contact */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 lg:sticky lg:top-24">
              <h2 className="font-bold text-[#0b1f3a]">Contact Supplier</h2>

              <button className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-orange-600">
                <Send size={17} />
                Send Enquiry
              </button>

              <div className="mt-5 space-y-3">
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                  <MapPin size={18} className="shrink-0 text-blue-600" />

                  <div>
                    <p className="text-xs text-slate-400">Location</p>

                    <p className="text-sm font-semibold text-slate-700">
                      {supplier.address || supplier.location || "India"}
                    </p>
                  </div>
                </div>

                {supplier.phone && (
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <Phone size={18} className="text-blue-600" />

                    <p className="text-sm font-semibold text-slate-700">
                      {supplier.phone}
                    </p>
                  </div>
                )}

                {supplier.email && (
                  <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <Mail size={18} className="text-blue-600" />

                    <p className="break-all text-sm font-semibold text-slate-700">
                      {supplier.email}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Trust */}
            <div className="rounded-2xl bg-blue-50 p-5">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-blue-600" size={25} />

                <h3 className="font-bold text-[#0b1f3a]">Buyer Protection</h3>
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                Compare supplier information, request quotations and discuss
                your requirements before placing an order.
              </p>
            </div>

            {/* Rating */}
            {supplier.rating && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold text-[#0b1f3a]">Supplier Rating</h3>

                <div className="mt-4 flex items-center gap-3">
                  <div className="text-3xl font-black text-[#0b1f3a]">
                    {supplier.rating}
                  </div>

                  <div>
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          size={15}
                          className="fill-orange-400 text-orange-400"
                        />
                      ))}
                    </div>

                    <p className="mt-1 text-xs text-slate-500">
                      Based on {supplier.reviews || 0} reviews
                    </p>
                  </div>
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  );
}
