import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Save,
  Upload,
  Image as ImageIcon,
  Trash2,
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
  ShieldCheck,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";

const API_URL = "";

function AdminEditCompany() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    businessType: "",
    industry: "",
    location: "",
    address: "",
    description: "",
    phone: "",
    email: "",
    yearsInBusiness: "",
    verified: false,
    services: "",
    serviceAreas: "",
    imageUrl: "",
    galleryImages: [],
  });

  // ==================================================
  // FETCH COMPANY
  // ==================================================

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/suppliers/${id}`
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.success ||
        !data.supplier
      ) {
        throw new Error(
          data.message || "Company not found."
        );
      }

      const company = data.supplier;

      const services = Array.isArray(company.services)
        ? company.services.join(", ")
        : company.services || "";

      const serviceAreas = Array.isArray(
        company.service_areas
      )
        ? company.service_areas.join(", ")
        : company.service_areas || "";

      const galleryImages = Array.isArray(
        company.gallery_images
      )
        ? company.gallery_images
        : [];

      setFormData({
        name: company.name || "",
        businessType: company.business_type || "",
        industry: company.industry || "",
        location: company.location || "",
        address: company.address || "",
        description: company.description || "",
        phone: company.phone || "",
        email: company.email || "",
        yearsInBusiness:
          company.years_in_business ?? "",
        verified: Boolean(company.verified),
        services,
        serviceAreas,
        imageUrl: company.image_url || "",
        galleryImages,
      });

      setImagePreview(company.image_url || "");
    } catch (err) {
      console.error("Error loading company:", err);

      setError(
        err.message || "Failed to load company."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // INPUT CHANGE
  // ==================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // ==================================================
  // IMAGE CHANGE
  // ==================================================

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only JPG, JPEG, PNG and WEBP images are allowed."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    setImageFile(file);

    const previewUrl = URL.createObjectURL(file);

    setImagePreview(previewUrl);
  };

  // ==================================================
  // REMOVE MAIN IMAGE
  // ==================================================

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");

    setFormData((current) => ({
      ...current,
      imageUrl: "",
    }));
  };

  // ==================================================
  // UPLOAD MAIN IMAGE
  // ==================================================

  const uploadImage = async () => {
    if (!imageFile) {
      return formData.imageUrl || null;
    }

    const uploadData = new FormData();

    uploadData.append("images", imageFile);

    const response = await fetch(
      `${API_URL}/api/suppliers/upload-images`,
      {
        method: "POST",
        body: uploadData,
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message ||
          "Failed to upload company image."
      );
    }

    return data.images?.[0] || null;
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Company name is required.");
      return;
    }

    try {
      setSubmitting(true);

      // Upload new image if selected
      const imageUrl = await uploadImage();

      const token =
        localStorage.getItem("vyapaar_token");

      const response = await fetch(
        `${API_URL}/api/admin/suppliers/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token
              ? {
                  Authorization: `Bearer ${token}`,
                }
              : {}),
          },
          body: JSON.stringify({
            name: formData.name.trim(),

            businessType:
              formData.businessType.trim(),

            industry:
              formData.industry.trim(),

            location:
              formData.location.trim(),

            address:
              formData.address.trim(),

            description:
              formData.description.trim(),

            phone:
              formData.phone.trim(),

            email:
              formData.email.trim(),

            yearsInBusiness:
              formData.yearsInBusiness,

            verified:
              formData.verified,

            services:
              formData.services,

            serviceAreas:
              formData.serviceAreas,

            imageUrl:
              imageUrl,

            galleryImages:
              formData.galleryImages,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to update company."
        );
      }

      setSuccess(
        "Company updated successfully."
      );

      setTimeout(() => {
        navigate("/admin/companies");
      }, 800);
    } catch (err) {
      console.error(
        "Update company error:",
        err
      );

      setError(
        err.message ||
          "Unable to update company."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // LOGOUT
  // ==================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "vyapaar_token"
    );

    localStorage.removeItem(
      "vyapaar_user"
    );

    navigate("/login");
  };

  // ==================================================
  // SIDEBAR MENU
  // ==================================================

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
  ];

  // ==================================================
  // SIDEBAR
  // ==================================================

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
            const Icon = item.icon;

            const active =
              item.path === "/admin/companies";

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
              );
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
            );
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
  );

  // ==================================================
  // LOADING
  // ==================================================

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

              Loading company...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================================================
  // MAIN
  // ==================================================

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
             TOP BAR
        ================================ */}

        <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="flex h-[82px] items-center justify-between px-5 sm:px-8">

            <div className="flex items-center gap-3">

              <button
                onClick={() =>
                  setMobileMenuOpen(true)
                }
                className="rounded-xl border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 lg:hidden"
              >
                <Menu size={21} />
              </button>

              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
                  Companies
                </p>

                <h1 className="text-xl font-bold text-slate-900">
                  Edit Company
                </h1>
              </div>

            </div>

            <Link
              to="/admin/companies"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-[#0952d4]"
            >
              <ArrowLeft size={17} />

              Back
            </Link>

          </div>
        </header>

        {/* ===============================
             CONTENT
        ================================ */}

        <main className="px-5 py-7 sm:px-8 lg:px-10">

          <div className="mx-auto max-w-[1200px]">

            {/* Page Heading */}

            <div className="mb-7">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                Company Information
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Update company details, contact
                information and profile settings.
              </p>
            </div>

            {/* Alerts */}

            {error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {success}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              {/* ===============================
                   BASIC INFORMATION
              ================================ */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">
                  <div className="flex items-center gap-3">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#0952d4]">
                      <Building2 size={20} />
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900">
                        Basic Information
                      </h3>

                      <p className="text-xs text-slate-500">
                        General company information
                      </p>
                    </div>

                  </div>
                </div>

                <div className="grid gap-5 p-6 md:grid-cols-2">

                  {/* Company Name */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Company Name
                    </label>

                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter company name"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Business Type */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Business Type
                    </label>

                    <input
                      type="text"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleChange}
                      placeholder="Manufacturer, Supplier, Trader..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
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
                      placeholder="Enter industry"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                      placeholder="City, State"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Address */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="3"
                      placeholder="Complete business address"
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                  {/* Description */}

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Description
                    </label>

                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows="5"
                      placeholder="Describe the company..."
                      className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                </div>

              </section>

              {/* ===============================
                   CONTACT INFORMATION
              ================================ */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                  <h3 className="font-bold text-slate-900">
                    Contact Information
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Company contact details
                  </p>

                </div>

                <div className="grid gap-5 p-6 md:grid-cols-2">

                  {/* Phone */}

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone
                    </label>

                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
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
                      className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                </div>

              </section>

              {/* ===============================
                   SERVICES
              ================================ */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                  <h3 className="font-bold text-slate-900">
                    Services & Areas
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Separate multiple values with commas.
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
                      rows="5"
                      placeholder="Web Development, SEO, Digital Marketing"
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
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
                      rows="5"
                      placeholder="Chandigarh, Mohali, Panchkula"
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                    />
                  </div>

                </div>

              </section>

              {/* ===============================
                   VERIFICATION
              ================================ */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="flex items-center justify-between gap-5 px-6 py-5">

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Company Verification
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Mark this company as verified.
                    </p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">

                    <input
                      type="checkbox"
                      name="verified"
                      checked={formData.verified}
                      onChange={(event) =>
                        setFormData((current) => ({
                          ...current,
                          verified:
                            event.target.checked,
                        }))
                      }
                      className="peer sr-only"
                    />

                    <div className="h-6 w-11 rounded-full bg-slate-300 transition peer-checked:bg-blue-600 peer-focus:ring-4 peer-focus:ring-blue-500/20 after:absolute after:left-[3px] after:top-[3px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-5" />

                  </label>

                </div>

              </section>

              {/* ===============================
                   COMPANY IMAGE
              ================================ */}

              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

                <div className="border-b border-slate-200 px-6 py-5">

                  <h3 className="font-bold text-slate-900">
                    Company Logo / Image
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    JPG, PNG or WEBP. Maximum 5MB.
                  </p>

                </div>

                <div className="p-6">

                  <div className="grid gap-6 md:grid-cols-[240px_1fr]">

                    {/* Preview */}

                    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">

                      {imagePreview ? (
                        <div className="relative aspect-square">

                          <img
                            src={imagePreview}
                            alt={formData.name}
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={
                              handleRemoveImage
                            }
                            className="absolute right-3 top-3 rounded-xl bg-red-600 p-2 text-white shadow-lg transition hover:bg-red-700"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>
                      ) : (
                        <div className="flex aspect-square flex-col items-center justify-center text-slate-400">

                          <ImageIcon
                            size={42}
                            strokeWidth={1.5}
                          />

                          <p className="mt-3 text-xs font-medium">
                            No image
                          </p>

                        </div>
                      )}

                    </div>

                    {/* Upload */}

                    <div className="flex flex-col justify-center">

                      <label
                        htmlFor="company-image"
                        className="inline-flex w-fit cursor-pointer items-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-700"
                      >
                        <Upload size={17} />

                        Choose Image
                      </label>

                      <input
                        id="company-image"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/webp"
                        onChange={
                          handleImageChange
                        }
                        className="hidden"
                      />

                      <p className="mt-3 text-xs leading-5 text-slate-500">
                        Upload a professional company
                        logo or business image. The image
                        will be used on the company profile.
                      </p>

                    </div>

                  </div>

                </div>

              </section>

              {/* ===============================
                   ACTIONS
              ================================ */}

              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

                <Link
                  to="/admin/companies"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/10 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <RefreshCw
                        size={17}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} />

                      Save Changes
                    </>
                  )}
                </button>

              </div>

            </form>

          </div>

        </main>
      </div>
    </div>
  );
}

export default AdminEditCompany;