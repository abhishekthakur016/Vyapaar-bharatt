import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  CheckCircle2,
  Image as ImageIcon,
  Package,
  Save,
  Trash2,
  Upload,
} from "lucide-react"

export default function AdminAddProduct() {
  const navigate = useNavigate()

  const [suppliers, setSuppliers] = useState([])
  const [loadingSuppliers, setLoadingSuppliers] = useState(true)

  const [formData, setFormData] = useState({
    supplierId: "",
    name: "",
    category: "",
    subcategory: "",
    description: "",
    price: "",
    priceUnit: "Price on Request",
    moq: "",
    moqUnit: "Piece",
    availability: "Available",
  })

  const [productImage, setProductImage] = useState(null)
  const [imagePreview, setImagePreview] = useState("")
  const [imageUrl, setImageUrl] = useState("")

  const [submitting, setSubmitting] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  // ==========================================
  // FETCH SUPPLIERS
  // ==========================================

  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        setLoadingSuppliers(true)

        const response = await fetch(
          "http://localhost:5000/api/suppliers"
        )

        const data = await response.json()

        if (!response.ok || !data.success) {
          throw new Error(
            data.message || "Failed to load companies"
          )
        }

        setSuppliers(data.suppliers || [])
      } catch (error) {
        console.error("Error fetching suppliers:", error)

        setError(
          error.message || "Unable to load companies."
        )
      } finally {
        setLoadingSuppliers(false)
      }
    }

    fetchSuppliers()
  }, [])

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))

    setError("")
    setSuccess("")
  }

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  const handleImageChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )

      e.target.value = ""
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be 5 MB or less.")

      e.target.value = ""
      return
    }

    setProductImage(file)
    setImagePreview(URL.createObjectURL(file))
    setImageUrl("")
    setError("")
    setSuccess("")
  }

  // ==========================================
  // REMOVE IMAGE
  // ==========================================

  const handleRemoveImage = () => {
    setProductImage(null)
    setImagePreview("")
    setImageUrl("")
  }

  // ==========================================
  // UPLOAD IMAGE
  // ==========================================

  const uploadProductImage = async () => {
    if (!productImage) {
      return ""
    }

    const uploadData = new FormData()

    uploadData.append("image", productImage)

    const response = await fetch(
      "http://localhost:5000/api/products/upload-image",
      {
        method: "POST",
        body: uploadData,
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to upload product image."
      )
    }

    return data.image_url || ""
  }

  // ==========================================
  // SUBMIT PRODUCT
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError("")
    setSuccess("")

    if (!formData.supplierId) {
      setError("Please select a company.")
      return
    }

    if (!formData.name.trim()) {
      setError("Product name is required.")
      return
    }

    if (!formData.category.trim()) {
      setError("Category is required.")
      return
    }

    try {
      setSubmitting(true)

      let uploadedImageUrl = imageUrl

      // Upload image first
      if (productImage) {
        setUploadingImage(true)

        uploadedImageUrl = await uploadProductImage()

        setImageUrl(uploadedImageUrl)

        setUploadingImage(false)
      }

      // Create product
      const response = await fetch(
        "http://localhost:5000/api/products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            supplierId: Number(formData.supplierId),

            name: formData.name.trim(),

            category:
              formData.category.trim() || null,

            subcategory:
              formData.subcategory.trim() || null,

            description:
              formData.description.trim() || null,

            price: formData.price
              ? Number(formData.price)
              : null,

            priceUnit:
              formData.priceUnit || null,

            moq: formData.moq
              ? Number(formData.moq)
              : null,

            moqUnit:
              formData.moqUnit || null,

            availability:
              formData.availability || "Available",

            imageUrl:
              uploadedImageUrl || null,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create product."
        )
      }

      setSuccess("Product created successfully.")

      setTimeout(() => {
        navigate("/admin/products")
      }, 800)
    } catch (error) {
      console.error("Create product error:", error)

      setUploadingImage(false)

      setError(
        error.message || "Failed to create product."
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==========================================
          SIDEBAR
      ========================================== */}

      <aside className="fixed left-0 top-0 hidden h-screen w-[270px] bg-[#0b1f3a] text-white lg:block">
        <div className="flex h-[82px] items-center border-b border-white/10 px-7">
          <Link
            to="/admin/dashboard"
            className="text-xl font-bold tracking-tight"
          >
            Vyapaar Bharat
          </Link>
        </div>

        <nav className="p-4">
          <Link
            to="/admin/dashboard"
            className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Dashboard
          </Link>

          <Link
            to="/admin/companies"
            className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Companies
          </Link>

          <Link
            to="/admin/products"
            className="mb-1 flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm font-semibold text-white"
          >
            Products
          </Link>

          <Link
            to="/admin/dashboard"
            className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Requirements
          </Link>

          <Link
            to="/admin/dashboard"
            className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Quotes
          </Link>

          <Link
            to="/admin/dashboard"
            className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Users
          </Link>

          <Link
            to="/admin/dashboard"
            className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Orders
          </Link>

          <Link
            to="/admin/dashboard"
            className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Reports
          </Link>

          <Link
            to="/admin/insights"
            className="mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Insights
          </Link>

          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Settings
          </Link>
        </nav>

        <div className="absolute bottom-5 left-5 right-5 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <CheckCircle2 size={15} />
            System Secure
          </div>

          <p className="mt-2 text-xs leading-5 text-slate-400">
            Vyapaar Bharat Admin Panel
          </p>
        </div>
      </aside>

      {/* ==========================================
          MAIN
      ========================================== */}

      <div className="lg:pl-[270px]">
        {/* TOPBAR */}

        <header className="flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-6 lg:px-8">
          <div>
            <p className="text-sm font-medium text-slate-400">
              Admin Panel
            </p>

            <h1 className="text-xl font-bold text-[#0b1f3a]">
              Add Product
            </h1>
          </div>

          <Link
            to="/admin/products"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-[#0952d4] hover:text-[#0952d4]"
          >
            <ArrowLeft size={17} />
            Back to Products
          </Link>
        </header>

        {/* CONTENT */}

        <main className="p-5 sm:p-6 lg:p-8">
          <div className="mx-auto max-w-5xl">
            {/* PAGE HEADER */}

            <div className="mb-7">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0952d4]">
                  <Package size={24} />
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-[#0b1f3a]">
                    Create New Product
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Add a product to a registered company.
                  </p>
                </div>
              </div>
            </div>

            {/* ALERTS */}

            {error && (
              <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {/* ==========================================
                    BASIC INFORMATION
                ========================================== */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#0b1f3a]">
                      Basic Information
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Enter the main product details.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {/* COMPANY */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Company *
                      </label>

                      <select
                        name="supplierId"
                        value={formData.supplierId}
                        onChange={handleChange}
                        disabled={loadingSuppliers}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      >
                        <option value="">
                          {loadingSuppliers
                            ? "Loading companies..."
                            : "Select company"}
                        </option>

                        {suppliers.map((supplier) => (
                          <option
                            key={supplier.id}
                            value={supplier.id}
                          >
                            {supplier.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* PRODUCT NAME */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Product Name *
                      </label>

                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter product name"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    {/* CATEGORY */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Category *
                      </label>

                      <input
                        type="text"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        placeholder="e.g. Industrial Machinery"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    {/* SUBCATEGORY */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Subcategory
                      </label>

                      <input
                        type="text"
                        name="subcategory"
                        value={formData.subcategory}
                        onChange={handleChange}
                        placeholder="Enter subcategory"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    {/* DESCRIPTION */}

                    <div className="md:col-span-2">
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Description
                      </label>

                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Describe the product..."
                        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>
                  </div>
                </section>

                {/* ==========================================
                    PRODUCT IMAGE
                ========================================== */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#0b1f3a]">
                      Product Image
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Upload the main image for this product.
                    </p>
                  </div>

                  {imagePreview ? (
                    <div className="relative max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="h-72 w-full object-contain"
                      />

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-red-500 shadow-md transition hover:bg-red-50"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  ) : (
                    <label className="flex min-h-[280px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 text-center transition hover:border-[#0952d4] hover:bg-blue-50/40">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-[#0952d4]">
                        <ImageIcon size={30} />
                      </div>

                      <p className="mt-5 text-sm font-bold text-slate-700">
                        Upload product image
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        JPG, JPEG, PNG or WEBP · Maximum 5 MB
                      </p>

                      <span className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-semibold text-white">
                        <Upload size={17} />
                        Choose Image
                      </span>

                      <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </section>

                {/* ==========================================
                    PRICING & MOQ
                ========================================== */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#0b1f3a]">
                      Pricing & MOQ
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Add pricing and minimum order information.
                    </p>
                  </div>

                  <div className="grid gap-5 md:grid-cols-2">
                    {/* PRICE */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    {/* PRICE UNIT */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Price Unit
                      </label>

                      <input
                        type="text"
                        name="priceUnit"
                        value={formData.priceUnit}
                        onChange={handleChange}
                        placeholder="e.g. Per Piece"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    {/* MOQ */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Minimum Order Quantity
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="moq"
                        value={formData.moq}
                        onChange={handleChange}
                        placeholder="Enter MOQ"
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      />
                    </div>

                    {/* MOQ UNIT */}

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        MOQ Unit
                      </label>

                      <select
                        name="moqUnit"
                        value={formData.moqUnit}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                      >
                        <option value="Piece">Piece</option>
                        <option value="Kg">Kg</option>
                        <option value="Ton">Ton</option>
                        <option value="Box">Box</option>
                        <option value="Set">Set</option>
                        <option value="Unit">Unit</option>
                        <option value="Meter">Meter</option>
                        <option value="Litre">Litre</option>
                      </select>
                    </div>
                  </div>
                </section>

                {/* ==========================================
                    AVAILABILITY
                ========================================== */}

                <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-[#0b1f3a]">
                      Availability
                    </h3>
                  </div>

                  <div className="max-w-md">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Product Availability
                    </label>

                    <select
                      name="availability"
                      value={formData.availability}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-blue-50"
                    >
                      <option value="Available">
                        Available
                      </option>

                      <option value="Limited Stock">
                        Limited Stock
                      </option>

                      <option value="Made to Order">
                        Made to Order
                      </option>

                      <option value="Out of Stock">
                        Out of Stock
                      </option>
                    </select>
                  </div>
                </section>

                {/* ==========================================
                    ACTIONS
                ========================================== */}

                <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <Link
                    to="/admin/products"
                    className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                  >
                    Cancel
                  </Link>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-7 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                        {uploadingImage
                          ? "Uploading Image..."
                          : "Saving Product..."}
                      </>
                    ) : (
                      <>
                        <Save size={17} />
                        Create Product
                      </>
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  )
}