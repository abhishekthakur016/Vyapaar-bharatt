import { FileText, ShieldCheck, Users, ArrowLeft } from "lucide-react";

import { useState } from "react";

function PostRequirement() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    subcategory: "",
    quantity: "",
    unit: "",
    description: "",
    minBudget: "",
    maxBudget: "",
    deliveryLocation: "",
    requiredBy: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitted(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/requirements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("vyapaar_token")}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit requirement");
      }

      console.log("Requirement created:", data.requirement);

      setSubmitted(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      // Clear form after successful submission
      setFormData({
        title: "",
        category: "",
        subcategory: "",
        quantity: "",
        unit: "",
        description: "",
        minBudget: "",
        maxBudget: "",
        deliveryLocation: "",
        requiredBy: "",
      });
    } catch (error) {
      console.error("Submission error:", error);

      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Page Header */}
      <section className="bg-[#0952d4] py-14 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-white/70 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back
          </button>

          <div className="max-w-3xl">
            <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
              <FileText size={27} className="text-[#0952d4]" />
            </div>

            <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
              Buyer Request
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl lg:text-5xl">
              Post Your Requirement
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
              Tell verified suppliers what you need and receive competitive
              quotes from businesses that match your requirement.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Success Message */}
        {submitted && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-100">
                <ShieldCheck size={20} className="text-green-600" />
              </div>

              <div>
                <p className="font-bold text-green-800">
                  Requirement submitted successfully!
                </p>

                <p className="mt-1 text-sm text-green-700">
                  We’ll match your requirement with relevant suppliers.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Form Area */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-8">
              <h2 className="text-xl font-black text-[#0b1f3a]">
                Tell us what you need
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Add a few details so we can connect you with the right
                suppliers.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* REQUIREMENT DETAILS */}

                <div className="border-b border-gray-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0952d4]/10">
                      <FileText size={20} className="text-[#0952d4]" />
                    </div>

                    <div>
                      <h3 className="text-lg font-black text-[#0b1f3a]">
                        Requirement Details
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        Start by telling suppliers what product or service you
                        need.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Requirement Title */}
                <div>
                  <label
                    htmlFor="requirement-title"
                    className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                  >
                    What are you looking for?
                    <span className="ml-1 text-[#fd8836]">*</span>
                  </label>

                  <input
                    id="requirement-title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. 550W Solar Panels"
                    required
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0b1f3a] outline-none transition placeholder:text-gray-400 focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Keep it short and specific so the right suppliers can find
                    your request.
                  </p>
                </div>

                {/* Category + Subcategory */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                    >
                      Category
                      <span className="ml-1 text-[#fd8836]">*</span>
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-500 outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
                    >
                      <option value="" disabled>
                        Select category
                      </option>

                      <option>Electronics & Components</option>
                      <option>Machinery & Tools</option>
                      <option>Chemicals & Raw Materials</option>
                      <option>Construction & Building</option>
                      <option>Agriculture & Food</option>
                      <option>Health & Medical</option>
                      <option>Textiles & Fashion</option>
                      <option>Automotive & Parts</option>
                      <option>Packaging & Printing</option>
                      <option>Renewable Energy</option>
                      <option>Industrial Supplies</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="subcategory"
                      className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                    >
                      Subcategory
                    </label>

                    <input
                      id="subcategory"
                      name="subcategory"
                      type="text"
                      value={formData.subcategory}
                      onChange={handleChange}
                      placeholder="e.g. Solar Panels"
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0b1f3a] outline-none transition placeholder:text-gray-400 focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
                    />
                  </div>
                </div>

                {/* Quantity + Unit */}
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="quantity"
                      className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                    >
                      Quantity
                      <span className="ml-1 text-[#fd8836]">*</span>
                    </label>

                    <input
                      id="quantity"
                      name="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0b1f3a] outline-none transition placeholder:text-gray-400 focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="unit"
                      className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                    >
                      Unit
                      <span className="ml-1 text-[#fd8836]">*</span>
                    </label>

                    <select
                      id="unit"
                      name="unit"
                      value={formData.unit}
                      onChange={handleChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-gray-500 outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
                    >
                      <option value="" disabled>
                        Select unit
                      </option>

                      <option>Pieces</option>
                      <option>Kg</option>
                      <option>Ton</option>
                      <option>Meter</option>
                      <option>Box</option>
                      <option>Set</option>
                      <option>Machine</option>
                      <option>Liter</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                {/* Requirement Description */}
                <div>
                  <label
                    htmlFor="description"
                    className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                  >
                    Requirement Description
                    <span className="ml-1 text-[#fd8836]">*</span>
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your requirement, specifications, quality requirements, preferred brand, delivery expectations, etc."
                    required
                    className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm leading-6 text-[#0b1f3a] outline-none transition placeholder:text-gray-400 focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    The more details you provide, the better suppliers can
                    respond.
                  </p>
                </div>

                {/* BUDGET & DELIVERY */}

                <div className="border-t border-gray-100 pt-8">
                  <div className="mb-6">
                    <h3 className="text-lg font-black text-[#0b1f3a]">
                      Budget & Delivery
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      Help suppliers understand your budget and delivery
                      expectations.
                    </p>
                  </div>

                  {/* Budget */}
                  <div className="grid gap-5 sm:grid-cols-2">
                    {/* Minimum Budget */}
                    <div>
                      <label
                        htmlFor="min-budget"
                        className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                      >
                        Minimum Budget
                      </label>

                      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:border-[#0952d4] focus-within:ring-4 focus-within:ring-[#0952d4]/10">
                        <span className="flex items-center border-r border-gray-200 bg-[#f8fafc] px-4 text-sm font-bold text-gray-500">
                          ₹
                        </span>

                        <input
                          id="min-budget"
                          name="minBudget"
                          type="number"
                          min="0"
                          value={formData.minBudget}
                          onChange={handleChange}
                          placeholder="e.g. 50000"
                          className="min-w-0 flex-1 px-4 py-3.5 text-sm text-[#0b1f3a] outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Maximum Budget */}
                    <div>
                      <label
                        htmlFor="max-budget"
                        className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                      >
                        Maximum Budget
                      </label>

                      <div className="flex overflow-hidden rounded-xl border border-gray-200 bg-white transition focus-within:border-[#0952d4] focus-within:ring-4 focus-within:ring-[#0952d4]/10">
                        <span className="flex items-center border-r border-gray-200 bg-[#f8fafc] px-4 text-sm font-bold text-gray-500">
                          ₹
                        </span>

                        <input
                          id="max-budget"
                          name="maxBudget"
                          type="number"
                          min="0"
                          value={formData.maxBudget}
                          onChange={handleChange}
                          placeholder="e.g. 100000"
                          className="min-w-0 flex-1 px-4 py-3.5 text-sm text-[#0b1f3a] outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delivery Location */}
                  <div className="mt-5">
                    <label
                      htmlFor="delivery-location"
                      className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                    >
                      Delivery Location
                      <span className="ml-1 text-[#fd8836]">*</span>
                    </label>

                    <input
                      id="delivery-location"
                      name="deliveryLocation"
                      type="text"
                      value={formData.deliveryLocation}
                      onChange={handleChange}
                      placeholder="e.g. Ahmedabad, Gujarat"
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0b1f3a] outline-none transition placeholder:text-gray-400 focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10"
                    />
                  </div>

                  {/* Required By */}
                  <div className="mt-5">
                    <label
                      htmlFor="required-by"
                      className="mb-2 block text-sm font-bold text-[#0b1f3a]"
                    >
                      Required By
                    </label>

                    <input
                      id="required-by"
                      name="requiredBy"
                      type="date"
                      value={formData.requiredBy}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm text-[#0b1f3a] outline-none transition focus:border-[#0952d4] focus:ring-4 focus:ring-[#0952d4]/10 sm:w-1/2"
                    />
                  </div>
                </div>

                {/* Submit Requirement */}
                <div className="border-t border-gray-100 pt-8">
                  <div className="rounded-xl bg-[#f8fafc] p-5">
                    <div className="flex items-start gap-3">
                      <ShieldCheck
                        size={20}
                        className="mt-0.5 shrink-0 text-[#0952d4]"
                      />

                      <div>
                        <p className="text-sm font-bold text-[#0b1f3a]">
                          Your information is secure
                        </p>

                        <p className="mt-1 text-xs leading-5 text-gray-500">
                          Your requirement will only be shared with relevant
                          suppliers to help you receive suitable quotes.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-6 py-4 text-sm font-black text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#f77925] hover:shadow-md"
                  >
                    Submit Requirement
                    <ArrowLeft size={18} className="rotate-180" />
                  </button>

                  <p className="mt-3 text-center text-xs text-gray-400">
                    By submitting, you agree to our Terms & Conditions and
                    Privacy Policy.
                  </p>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            {/* Why Post Requirement */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="font-black text-[#0b1f3a]">
                Why post a requirement?
              </h3>

              <div className="mt-5 space-y-5">
                {/* Verified Suppliers */}
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0952d4]/10">
                    <ShieldCheck size={20} className="text-[#0952d4]" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0b1f3a]">
                      Verified Suppliers
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Connect with relevant verified businesses.
                    </p>
                  </div>
                </div>

                {/* Multiple Responses */}
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#fd8836]/10">
                    <Users size={20} className="text-[#fd8836]" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0b1f3a]">
                      Multiple Responses
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Receive quotes from suppliers matching your needs.
                    </p>
                  </div>
                </div>

                {/* Compare Quotes */}
                <div className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0952d4]/10">
                    <FileText size={20} className="text-[#0952d4]" />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#0b1f3a]">
                      Compare Quotes
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Compare pricing, MOQ and delivery terms.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Card */}
            <div className="rounded-2xl bg-[#0b1f3a] p-6">
              <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                Need Help?
              </p>

              <h3 className="mt-2 text-lg font-black text-white">
                Not sure what to include?
              </h3>

              <p className="mt-2 text-sm leading-6 text-white/60">
                Don't worry. We'll guide you through each step of your
                requirement.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default PostRequirement;
