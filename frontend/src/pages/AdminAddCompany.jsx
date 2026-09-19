import { useState } from "react"
import { Link } from "react-router-dom"
import {
  LayoutDashboard,
  Building2,
  Package,
  FileText,
  Users,
  ShoppingCart,
  MessageSquareQuote,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  ChevronDown,
  ShieldCheck,
  BookOpen,
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Trash2,
} from "lucide-react"

function AdminAddCompany() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
    industry: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    yearsInBusiness: "",
    verified: false,
    services: "",
    serviceAreas: "",
  })

  const [logoFile, setLogoFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])

  const [logoPreview, setLogoPreview] = useState("")
  const [galleryPreviews, setGalleryPreviews] = useState([])

  const [submitting, setSubmitting] = useState(false)

  const user = JSON.parse(
    localStorage.getItem("vyapaar_user") || "{}"
  )

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // ===============================
  // Logo Upload
  // ===============================

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert("Logo image must be smaller than 5MB.")
      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      alert("Only JPG, JPEG, PNG and WEBP images are allowed.")
      return
    }

    setLogoFile(file)

    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
  }

  // ===============================
  // Gallery Upload
  // ===============================

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files || [])

    if (files.length === 0) return

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ]

    const invalidFile = files.find(
      (file) =>
        !allowedTypes.includes(file.type) ||
        file.size > 5 * 1024 * 1024
    )

    if (invalidFile) {
      alert(
        "Gallery images must be JPG, JPEG, PNG or WEBP and smaller than 5MB each."
      )
      return
    }

    if (files.length > 10) {
      alert("You can upload a maximum of 10 gallery images.")
      return
    }

    setGalleryFiles(files)

    const previews = files.map((file) =>
      URL.createObjectURL(file)
    )

    setGalleryPreviews(previews)
  }

  // ===============================
  // Remove Gallery Image
  // ===============================

  const removeGalleryImage = (index) => {
    setGalleryFiles((prev) =>
      prev.filter((_, fileIndex) => fileIndex !== index)
    )

    setGalleryPreviews((prev) =>
      prev.filter((_, previewIndex) => previewIndex !== index)
    )
  }

  // ===============================
  // Remove Logo
  // ===============================

  const removeLogo = () => {
    setLogoFile(null)
    setLogoPreview("")
  }

  // ===============================
  // Upload Company Images
  // ===============================

  const uploadCompanyImages = async () => {
    const filesToUpload = []

    if (logoFile) {
      filesToUpload.push(logoFile)
    }

    galleryFiles.forEach((file) => {
      filesToUpload.push(file)
    })

    if (filesToUpload.length === 0) {
      return {
        logoUrl: null,
        galleryImages: [],
      }
    }

    const uploadData = new FormData()

    filesToUpload.forEach((file) => {
      uploadData.append("images", file)
    })

    const response = await fetch(
      "http://localhost:5000/api/suppliers/upload-images",
      {
        method: "POST",
        body: uploadData,
      }
    )

    const data = await response.json()

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Failed to upload company images"
      )
    }

    const uploadedImages = data.images || []

    let logoUrl = null
    let galleryImages = []

    if (logoFile) {
      logoUrl = uploadedImages[0] || null
      galleryImages = uploadedImages.slice(1)
    } else {
      galleryImages = uploadedImages
    }

    return {
      logoUrl,
      galleryImages,
    }
  }

  // ===============================
  // Submit Company
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      alert("Company name is required.")
      return
    }

    try {
      setSubmitting(true)

      // Upload images first
      const {
        logoUrl,
        galleryImages,
      } = await uploadCompanyImages()

      // Create company
      const response = await fetch(
        "http://localhost:5000/api/suppliers",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            imageUrl: logoUrl,
            galleryImages,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Failed to create company"
        )
      }

      alert("Company created successfully!")

      window.location.href = "/admin/companies"
    } catch (error) {
      console.error(
        "Error creating company:",
        error
      )

      alert(
        error.message ||
          "Unable to create company"
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ===============================
  // Sidebar Menu
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
      active: true,
    },
    {
      label: "Products",
      icon: Package,
      path: "/admin/products",
    },
    {
      label: "Requirements",
      icon: FileText,
      path: "/admin/requirements",
    },
    {
      label: "Quotes",
      icon: MessageSquareQuote,
      path: "/admin/quotes",
    },
    {
      label: "Users",
      icon: Users,
      path: "/admin/users",
    },
    {
      label: "Orders",
      icon: ShoppingCart,
      path: "/admin/orders",
    },
    {
      label: "Reports",
      icon: BarChart3,
      path: "/admin/reports",
    },
    {
      label: "Insights",
      icon: BookOpen,
      path: "/admin/insights",
    },
    {
      label: "Settings",
      icon: Settings,
      path: "/admin/settings",
    },
  ]

  const handleLogout = () => {
    localStorage.removeItem("vyapaar_token")
    localStorage.removeItem("vyapaar_user")

    window.location.href = "/login"
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb]">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-screen w-[270px]
          flex-col
          bg-[#081d38]
          text-white
          shadow-2xl
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="flex h-[82px] items-center justify-between border-b border-white/10 px-6">

          <div>
            <h1 className="text-xl font-bold tracking-tight">
              Vyapaar Bharat
            </h1>

            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.15em] text-blue-300">
              Super Admin
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-6">

          <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            Main Menu
          </p>

          <nav className="space-y-1">

            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={
                    item.active
                      ? "group flex items-center gap-3 rounded-xl bg-[#0952d4] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/20"
                      : "group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.07] hover:text-white"
                  }
                >
                  <Icon
                    size={19}
                    className={
                      item.active
                        ? ""
                        : "text-slate-400 transition group-hover:text-blue-300"
                    }
                  />

                  <span>{item.label}</span>
                </Link>
              )
            })}

          </nav>

          <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.04] p-4">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={19} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white">
                  System Secure
                </p>

                <p className="mt-0.5 text-[10px] text-slate-400">
                  Admin access active
                </p>
              </div>

            </div>

          </div>

        </div>

        <div className="border-t border-white/10 p-4">

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={19} />
            Logout
          </button>

        </div>
      </aside>

      {/* Main Area */}
      <div className="lg:pl-[270px]">

        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[82px] items-center border-b border-slate-200 bg-white/95 px-4 backdrop-blur-md sm:px-6 lg:px-8">

          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div className="hidden max-w-md flex-1 md:block">

            <div className="relative">

              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search anything..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
              />

            </div>

          </div>

          <div className="ml-auto flex items-center gap-3">

            <button className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0952d4]">

              <Bell size={19} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#fd8836] ring-2 ring-white" />

            </button>

            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">

              <div className="hidden text-right sm:block">

                <p className="text-sm font-bold text-[#0b1f3a]">
                  {user.name || "Super Admin"}
                </p>

                <p className="mt-0.5 text-xs text-slate-500">
                  Super Administrator
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-[#0952d4] to-[#1b5fd7] text-sm font-bold text-white shadow-md shadow-blue-100">
                SA
              </div>

              <ChevronDown
                size={16}
                className="hidden text-slate-400 sm:block"
              />

            </div>

          </div>

        </header>

        {/* Content */}
        <main className="p-5 sm:p-6 lg:p-8">

          {/* Heading */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>

              <div className="mb-2 flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-[#fd8836]" />

                <span className="text-xs font-bold uppercase tracking-[0.15em] text-[#0952d4]">
                  Companies
                </span>

              </div>

              <h1 className="text-3xl font-bold tracking-tight text-[#0b1f3a]">
                Add Company
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                Create a new company profile for Vyapaar Bharat.
              </p>

            </div>

            <Link
              to="/admin/companies"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0952d4]"
            >
              <ArrowLeft size={17} />
              Back to Companies
            </Link>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

              {/* Basic Information */}
              <div className="border-b border-slate-100 px-6 py-5">

                <h2 className="text-lg font-bold text-[#0b1f3a]">
                  Basic Information
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Enter the primary details of the company.
                </p>

              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">

                {/* Company Name */}
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter company name"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                {/* Business Type */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Business Type
                  </label>

                  <select
                    name="businessType"
                    value={formData.businessType}
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  >
                    <option value="">
                      Select business type
                    </option>

                    <option value="Manufacturer">
                      Manufacturer
                    </option>

                    <option value="Supplier">
                      Supplier
                    </option>

                    <option value="Wholesaler">
                      Wholesaler
                    </option>

                    <option value="Distributor">
                      Distributor
                    </option>

                    <option value="Exporter">
                      Exporter
                    </option>

                    <option value="Service Provider">
                      Service Provider
                    </option>

                    <option value="Manufacturer / Service Provider">
                      Manufacturer / Service Provider
                    </option>
                  </select>

                </div>

                {/* Industry */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Industry
                  </label>

                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Automotive & Parts"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                {/* Location */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Ludhiana, Punjab"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                {/* Address */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Address
                  </label>

                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Complete business address"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                {/* Phone */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 XXXXX XXXXX"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                {/* Email */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="company@example.com"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                {/* Years */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Years in Business
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="yearsInBusiness"
                    value={formData.yearsInBusiness}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

                {/* Description */}
                <div className="md:col-span-2">

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company Description
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Describe the company, capabilities and business..."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                </div>

              </div>

              {/* ===============================
                  Company Images
              =============================== */}

              <div className="border-t border-slate-100 px-6 py-5">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0952d4]">
                    <ImageIcon size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#0b1f3a]">
                      Company Images
                    </h2>

                    <p className="mt-1 text-xs text-slate-500">
                      Add a main company image and gallery photos.
                    </p>
                  </div>

                </div>

              </div>

              <div className="grid gap-6 p-6 md:grid-cols-2">

                {/* Main Company Image */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Company Logo / Main Image
                  </label>

                  <div className="relative">

                    <label className="flex min-h-[210px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center transition hover:border-[#0952d4] hover:bg-blue-50">

                      {logoPreview ? (
                        <img
                          src={logoPreview}
                          alt="Company preview"
                          className="h-[180px] w-full rounded-xl object-contain"
                        />
                      ) : (
                        <>
                          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                            <Building2 size={28} />
                          </div>

                          <p className="mt-4 text-sm font-semibold text-slate-600">
                            Upload company image
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            JPG, PNG or WEBP · Max 5MB
                          </p>

                          <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0952d4] px-4 py-2 text-xs font-bold text-white">
                            <Upload size={14} />
                            Choose Image
                          </span>
                        </>
                      )}

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleLogoChange}
                        className="hidden"
                      />

                    </label>

                    {logoPreview && (
                      <button
                        type="button"
                        onClick={removeLogo}
                        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-lg bg-white text-red-500 shadow-md transition hover:bg-red-50"
                        title="Remove image"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}

                  </div>

                </div>

                {/* Gallery Images */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Gallery Images
                  </label>

                  <label className="flex min-h-[210px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-center transition hover:border-[#0952d4] hover:bg-blue-50">

                    {galleryPreviews.length > 0 ? (
                      <div className="grid w-full grid-cols-3 gap-2">

                        {galleryPreviews.map(
                          (preview, index) => (
                            <div
                              key={index}
                              className="group relative overflow-hidden rounded-xl"
                            >

                              <img
                                src={preview}
                                alt={`Gallery ${index + 1}`}
                                className="h-24 w-full object-cover"
                              />

                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  removeGalleryImage(index)
                                }}
                                className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-lg bg-white/95 text-red-500 opacity-0 shadow-md transition group-hover:opacity-100"
                              >
                                <Trash2 size={13} />
                              </button>

                            </div>
                          )
                        )}

                      </div>
                    ) : (
                      <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-300 shadow-sm">
                          <ImageIcon size={28} />
                        </div>

                        <p className="mt-4 text-sm font-semibold text-slate-600">
                          Upload gallery images
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          Up to 10 images · Max 5MB each
                        </p>

                        <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#0952d4] px-4 py-2 text-xs font-bold text-white">
                          <Upload size={14} />
                          Choose Images
                        </span>
                      </>
                    )}

                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleGalleryChange}
                      className="hidden"
                    />

                  </label>

                  {galleryPreviews.length > 0 && (
                    <p className="mt-2 text-[11px] text-slate-400">
                      {galleryPreviews.length} image
                      {galleryPreviews.length !== 1
                        ? "s"
                        : ""} selected
                    </p>
                  )}

                </div>

              </div>

              {/* Services */}
              <div className="border-t border-slate-100 px-6 py-5">

                <h2 className="text-lg font-bold text-[#0b1f3a]">
                  Services & Coverage
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add services and areas where the company operates.
                </p>

              </div>

              <div className="grid gap-5 p-6 md:grid-cols-2">

                {/* Services */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Services
                  </label>

                  <textarea
                    name="services"
                    value={formData.services}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Example: Transportation, Logistics, ODC Transport"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Separate multiple services with commas.
                  </p>

                </div>

                {/* Service Areas */}
                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Service Areas
                  </label>

                  <textarea
                    name="serviceAreas"
                    value={formData.serviceAreas}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Example: Punjab, Haryana, Delhi NCR"
                    className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-[#0952d4] focus:bg-white focus:ring-4 focus:ring-blue-50"
                  />

                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Separate multiple areas with commas.
                  </p>

                </div>

                {/* Verification */}
                <div className="md:col-span-2">

                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                    <input
                      type="checkbox"
                      name="verified"
                      checked={formData.verified}
                      onChange={handleChange}
                      className="h-4 w-4 accent-[#0952d4]"
                    />

                    <div>

                      <p className="text-sm font-semibold text-[#0b1f3a]">
                        Mark company as verified
                      </p>

                      <p className="mt-0.5 text-xs text-slate-500">
                        Only enable this after verification by the admin team.
                      </p>

                    </div>

                  </label>

                </div>

              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:justify-end">

                <Link
                  to="/admin/companies"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-orange-100 transition hover:-translate-y-0.5 hover:bg-orange-500 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {submitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Company
                    </>
                  )}

                </button>

              </div>

            </div>

          </form>

        </main>

      </div>

    </div>
  )
}

export default AdminAddCompany