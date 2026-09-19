import { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Trash2,
  Package,
  Building2,
  LayoutDashboard,
  Boxes,
  ClipboardList,
  FileText,
  Users,
  ShoppingCart,
  BarChart3,
  Lightbulb,
  Settings,
  LogOut,
  Bell,
  ShieldCheck,
  RefreshCw,
  Menu,
  X,
} from "lucide-react"

const API_URL = "http://localhost:5000"

function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false)

  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] =
    useState("")

  const [formData, setFormData] = useState({
    supplierId: "",
    name: "",
    category: "",
    subcategory: "",
    description: "",
    price: "",
    priceUnit: "",
    moq: "",
    moqUnit: "",
    availability: "Available",
    imageUrl: "",
  })

  // ===============================
  // FETCH PRODUCT + SUPPLIERS
  // ===============================

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")

      const [productResponse, suppliersResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/products/${id}`),
          fetch(`${API_URL}/api/suppliers`),
        ])

      const productData =
        await productResponse.json()

      const suppliersData =
        await suppliersResponse.json()

      if (
        !productResponse.ok ||
        !productData.success ||
        !productData.product
      ) {
        throw new Error(
          productData.message ||
            "Product not found."
        )
      }

      setSuppliers(
        suppliersData.suppliers || []
      )

      const product = productData.product

      setFormData({
        supplierId:
          product.supplier_id || "",
        name: product.name || "",
        category:
          product.category || "",
        subcategory:
          product.subcategory || "",
        description:
          product.description || "",
        price:
          product.price ?? "",
        priceUnit:
          product.price_unit || "",
        moq:
          product.moq ?? "",
        moqUnit:
          product.moq_unit || "",
        availability:
          product.availability || "Available",
        imageUrl:
          product.image_url || "",
      })

      setImagePreview(
        product.image_url || ""
      )
    } catch (err) {
      console.error(
        "Error loading product:",
        err
      )

      setError(
        err.message ||
          "Failed to load product."
      )
    } finally {
      setLoading(false)
    }
  }

  // ===============================
  // INPUT CHANGE
  // ===============================

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // ===============================
  // IMAGE CHANGE
  // ===============================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Image size must be less than 5MB."
      )
      return
    }

    setImageFile(file)

    const previewUrl =
      URL.createObjectURL(file)

    setImagePreview(previewUrl)
  }

  // ===============================
  // REMOVE IMAGE
  // ===============================

  const handleRemoveImage = () => {
    setImageFile(null)
    setImagePreview("")
    setFormData((current) => ({
      ...current,
      imageUrl: "",
    }))
  }

  // ===============================
  // UPLOAD IMAGE
  // ===============================

  const uploadImage = async () => {
    if (!imageFile) {
      return formData.imageUrl || null
    }

    const uploadData = new FormData()

    uploadData.append(
      "image",
      imageFile
    )

    const response = await fetch(
      `${API_URL}/api/products/upload-image`,
      {
        method: "POST",
        body: uploadData,
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to upload product image."
      )
    }

    return data.image_url
  }

  // ===============================
  // SUBMIT
  // ===============================

  const handleSubmit = async (event) => {
    event.preventDefault()

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

    try {
      setSubmitting(true)

      // Upload new image if selected
      const imageUrl =
        await uploadImage()

      const response = await fetch(
        `${API_URL}/api/products/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            supplierId:
              formData.supplierId,

            name:
              formData.name.trim(),

            category:
              formData.category,

            subcategory:
              formData.subcategory,

            description:
              formData.description,

            price:
              formData.price,

            priceUnit:
              formData.priceUnit,

            moq:
              formData.moq,

            moqUnit:
              formData.moqUnit,

            availability:
              formData.availability,

            imageUrl:
              imageUrl,
          }),
        }
      )

      const data =
        await response.json()

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Failed to update product."
        )
      }

      setSuccess(
        "Product updated successfully."
      )

      setTimeout(() => {
        navigate("/admin/products")
      }, 800)
    } catch (err) {
      console.error(
        "Update product error:",
        err
      )

      setError(
        err.message ||
          "Unable to update product."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ===============================
  // LOGOUT
  // ===============================

  const handleLogout = () => {
    localStorage.removeItem(
      "vyapaar_token"
    )

    localStorage.removeItem(
      "vyapaar_user"
    )

    navigate("/login")
  }

  // ===============================
  // SIDEBAR MENU
  // ===============================

  const menuItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    {
      label: "Companies",
      icon: Building2,
      path: "/admin/companies",
    },
    {
      label: "Products",
      icon: Boxes,
      path: "/admin/products",
    },
    {
      label: "Requirements",
      icon: ClipboardList,
      path: "/requirements",
    },
    {
      label: "Quotes",
      icon: FileText,
      path: "/supplier-rfqs",
    },
    {
      label: "Users",
      icon: Users,
      path: "#",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      path: "#",
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "#",
    },
    {
      label: "Insights",
      icon: Lightbulb,
      path: "/admin/insights",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "#",
    },
  ]

  // ===============================
  // SIDEBAR
  // ===============================

  const Sidebar = () => (
    <aside
      className={`
        fixed
        inset-y-0
        left-0
        z-50
        flex
        w-[270px]
        flex-col
        bg-[#071a33]
        text-white
        transition-transform
        duration-300
        lg:translate-x-0
        ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }
      `}
    >
      {/* Logo */}

      <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">
        <Link
          to="/admin/dashboard"
          className="text-xl font-bold tracking-tight"
        >
          Vyapaar Bharat
        </Link>

        <button
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="rounded-lg p-2 hover:bg-white/10 lg:hidden"
        >
          <X size={20} />
        </button>
      </div>

      {/* Menu */}

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
          Main Menu
        </p>

        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon

            const active =
              item.path ===
              "/admin/products"

            if (item.path === "#") {
              return (
                <button
                  key={item.label}
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              )
            }

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() =>
                  setMobileMenuOpen(false)
                }
                className={`
                  flex
                  items-center
                  gap-3
                  rounded-xl
                  px-3
                  py-3
                  text-sm
                  font-medium
                  transition
                  ${
                    active
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Secure */}

      <div className="px-4 pb-3">
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={18}
              className="text-emerald-400"
            />

            <span className="text-sm font-semibold">
              System Secure
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            All systems are operational
          </p>
        </div>
      </div>

      {/* Logout */}

      <div className="border-t border-white/10 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  )

  // ===============================
  // LOADING
  // ===============================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Sidebar />

        <div className="lg:pl-[270px]">
          <div className="flex min-h-screen items-center justify-center">
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <RefreshCw
                size={20}
                className="animate-spin"
              />

              Loading product...
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />

      {/* Mobile overlay */}

      {mobileMenuOpen && (
        <div
          onClick={() =>
            setMobileMenuOpen(false)
          }
          className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"
        />
      )}

      <div className="lg:pl-[270px]">
        {/* ===============================
            TOPBAR
        =============================== */}

        <header className="sticky top-0 z-30 flex h-[82px] items-center justify-between border-b border-slate-200 bg-white px-5 shadow-sm sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                setMobileMenuOpen(true)
              }
              className="rounded-xl border border-slate-200 p-2 text-slate-700 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="hidden text-sm font-medium text-slate-500 sm:block">
                Admin Panel
              </p>

              <h2 className="text-lg font-bold text-[#0b1f3a]">
                Edit Product
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600">
              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-orange-500" />
            </button>

            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                Super Admin
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
              SA
            </div>
          </div>
        </header>

        {/* ===============================
            CONTENT
        =============================== */}

        <main className="p-5 sm:p-6 lg:p-8">
          {/* Header */}

          <div className="mb-7">
            <Link
              to="/admin/products"
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              <ArrowLeft size={17} />
              Back to Products
            </Link>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#0b1f3a] sm:text-3xl">
                Edit Product
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Update product information and
                listing details.
              </p>
            </div>
          </div>

          {/* Error */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Success */}

          {success && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {success}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]"
          >
            {/* LEFT */}

            <div className="space-y-6">
              {/* Basic information */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-2">
                    <Package
                      size={19}
                      className="text-blue-600"
                    />

                    <h2 className="font-bold text-slate-900">
                      Product Information
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    Basic information about the
                    product.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Company */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Company
                      <span className="text-red-500">
                        {" "}
                        *
                      </span>
                    </label>

                    <select
                      name="supplierId"
                      value={
                        formData.supplierId
                      }
                      onChange={
                        handleChange
                      }
                      required
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    >
                      <option value="">
                        Select company
                      </option>

                      {suppliers.map(
                        (supplier) => (
                          <option
                            key={
                              supplier.id
                            }
                            value={
                              supplier.id
                            }
                          >
                            {supplier.name}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* Product Name */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Product Name
                      <span className="text-red-500">
                        {" "}
                        *
                      </span>
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={
                        handleChange
                      }
                      required
                      placeholder="Enter product name"
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Category */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Category
                    </label>

                    <input
                      type="text"
                      name="category"
                      value={
                        formData.category
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Industrial Supplies"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Subcategory */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Subcategory
                    </label>

                    <input
                      type="text"
                      name="subcategory"
                      value={
                        formData.subcategory
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="Enter subcategory"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Description */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={
                        formData.description
                      }
                      onChange={
                        handleChange
                      }
                      rows={5}
                      placeholder="Describe the product..."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>
                </div>
              </section>

              {/* Pricing */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <h2 className="font-bold text-slate-900">
                    Pricing & Quantity
                  </h2>

                  <p className="mt-1 text-xs text-slate-500">
                    Set pricing and minimum order
                    information.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Price */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Price
                    </label>

                    <input
                      type="number"
                      min="0"
                      name="price"
                      value={formData.price}
                      onChange={
                        handleChange
                      }
                      placeholder="Enter price"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Price Unit */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Price Unit
                    </label>

                    <input
                      type="text"
                      name="priceUnit"
                      value={
                        formData.priceUnit
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Per Piece"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                      onChange={
                        handleChange
                      }
                      placeholder="Enter MOQ"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* MOQ Unit */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      MOQ Unit
                    </label>

                    <input
                      type="text"
                      name="moqUnit"
                      value={
                        formData.moqUnit
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="e.g. Piece"
                      className="h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Availability */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Availability
                    </label>

                    <select
                      name="availability"
                      value={
                        formData.availability
                      }
                      onChange={
                        handleChange
                      }
                      className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                </div>
              </section>
            </div>

            {/* RIGHT */}

            <div className="space-y-6">
              {/* Image */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <div className="flex items-center gap-2">
                    <ImageIcon
                      size={19}
                      className="text-blue-600"
                    />

                    <h2 className="font-bold text-slate-900">
                      Product Image
                    </h2>
                  </div>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG, WEBP up to 5MB.
                  </p>
                </div>

                {imagePreview ? (
                  <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                    <img
                      src={imagePreview}
                      alt={formData.name}
                      className="h-64 w-full object-cover"
                    />

                    <button
                      type="button"
                      onClick={
                        handleRemoveImage
                      }
                      className="absolute right-3 top-3 rounded-lg bg-white p-2 text-red-500 shadow-md transition hover:bg-red-50"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>
                ) : (
                  <div className="flex h-64 flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 text-center">
                    <div className="mb-3 rounded-xl bg-white p-3 text-slate-400 shadow-sm">
                      <ImageIcon
                        size={25}
                      />
                    </div>

                    <p className="text-sm font-semibold text-slate-700">
                      No product image
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Upload an image below
                    </p>
                  </div>
                )}

                <label className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                  <Upload size={17} />

                  {imageFile
                    ? "Change Image"
                    : "Upload Image"}

                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={
                      handleImageChange
                    }
                    className="hidden"
                  />
                </label>
              </section>

              {/* Company Info */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-4 flex items-center gap-2">
                  <Building2
                    size={19}
                    className="text-blue-600"
                  />

                  <h2 className="font-bold text-slate-900">
                    Listing Information
                  </h2>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-medium text-slate-500">
                    Product ID
                  </p>

                  <p className="mt-1 text-sm font-bold text-slate-800">
                    #{id}
                  </p>
                </div>
              </section>

              {/* Actions */}

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw
                        size={18}
                        className="animate-spin"
                      />

                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <Save size={18} />

                      Save Changes
                    </>
                  )}
                </button>

                <Link
                  to="/admin/products"
                  className="mt-3 flex w-full items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>
              </section>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default AdminEditProduct