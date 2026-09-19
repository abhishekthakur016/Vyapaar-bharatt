import { useEffect, useState } from "react"
import {
  Search,
  Package,
  MapPin,
  CalendarDays,
  Clock3,
  IndianRupee,
  Send,
  X,
  CheckCircle2,
  LoaderCircle,
} from "lucide-react"

export default function SupplierRFQs() {
  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [search, setSearch] = useState("")

  const [selectedRFQ, setSelectedRFQ] = useState(null)
  const [showQuoteForm, setShowQuoteForm] = useState(false)

  const [quoteData, setQuoteData] = useState({
    supplierName: "",
    supplierEmail: "",
    quotedPrice: "",
    quantity: "",
    unit: "",
    deliveryTime: "",
    message: "",
  })

  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState("")
  const [submitError, setSubmitError] = useState("")

  // ==========================================
  // FETCH RFQs
  // ==========================================

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        setLoading(true)
        setError("")

        const response = await fetch(
          "http://localhost:5000/api/requirements"
        )

        if (!response.ok) {
          throw new Error("Failed to load requirements")
        }

        const data = await response.json()

        if (!data.success) {
          throw new Error("Unable to load RFQs")
        }

        setRequirements(data.requirements || [])
      } catch (err) {
        console.error("RFQ fetch error:", err)
        setError(
          err.message ||
            "Unable to load RFQ requests."
        )
      } finally {
        setLoading(false)
      }
    }

    fetchRequirements()
  }, [])

  // ==========================================
  // SEARCH
  // ==========================================

  const filteredRequirements = requirements.filter(
    (requirement) => {
      const query = search.trim().toLowerCase()

      if (!query) {
        return true
      }

      return (
        requirement.title
          ?.toLowerCase()
          .includes(query) ||
        requirement.category
          ?.toLowerCase()
          .includes(query) ||
        requirement.subcategory
          ?.toLowerCase()
          .includes(query) ||
        requirement.delivery_location
          ?.toLowerCase()
          .includes(query) ||
        requirement.description
          ?.toLowerCase()
          .includes(query)
      )
    }
  )

  // ==========================================
  // OPEN RFQ
  // ==========================================

  const openRFQ = (requirement) => {
    setSelectedRFQ(requirement)

    setQuoteData({
      supplierName: "",
      supplierEmail: "",
      quotedPrice: "",
      quantity: requirement.quantity || "",
      unit: requirement.unit || "",
      deliveryTime: "",
      message: "",
    })

    setSuccess("")
    setSubmitError("")
    setShowQuoteForm(false)
  }

  // ==========================================
  // FORM CHANGE
  // ==========================================

  const handleQuoteChange = (e) => {
    const { name, value } = e.target

    setQuoteData((current) => ({
      ...current,
      [name]: value,
    }))

    setSuccess("")
    setSubmitError("")
  }

  // ==========================================
  // SUBMIT QUOTE
  // ==========================================

  const handleQuoteSubmit = async (e) => {
    e.preventDefault()

    if (!selectedRFQ) {
      return
    }

    try {
      setSubmitting(true)
      setSubmitError("")
      setSuccess("")

      const response = await fetch(
        "http://localhost:5000/api/quotes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requirementId: selectedRFQ.id,
            supplierName:
              quoteData.supplierName,
            supplierEmail:
              quoteData.supplierEmail,
            quotedPrice:
              Number(quoteData.quotedPrice),
            quantity:
              Number(quoteData.quantity),
            unit:
              quoteData.unit ||
              selectedRFQ.unit ||
              "Piece",
            deliveryTime:
              quoteData.deliveryTime,
            message:
              quoteData.message,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Failed to submit quote"
        )
      }

      setSuccess(
        "Your quote has been submitted successfully."
      )

      setQuoteData((current) => ({
        ...current,
        quotedPrice: "",
        deliveryTime: "",
        message: "",
      }))
    } catch (err) {
      console.error("Quote submission error:", err)

      setSubmitError(
        err.message ||
          "Unable to submit quote. Please try again."
      )
    } finally {
      setSubmitting(false)
    }
  }

  // ==========================================
  // DATE FORMAT
  // ==========================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified"
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
  }

  return (
    <main className="min-h-screen bg-slate-50">

      {/* ==========================================
          HEADER
      ========================================== */}

      <section className="bg-[#0952d4]">

        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-bold text-white">
              <Package size={15} />
              Supplier Dashboard
            </span>

            <h1 className="mt-5 text-3xl font-black text-white sm:text-4xl">
              RFQ Requests
            </h1>

            <p className="mt-3 text-sm leading-6 text-blue-100 sm:text-base">
              Discover buyer requirements and send
              competitive quotations directly.
            </p>

          </div>

        </div>

      </section>


      {/* ==========================================
          CONTENT
      ========================================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* SEARCH */}

        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4">

          <div className="flex items-center gap-3">

            <Search
              size={20}
              className="text-slate-400"
            />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search RFQs by product, category or location..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />

          </div>

        </div>


        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-5">
            <p className="text-sm font-semibold text-red-700">
              {error}
            </p>
          </div>
        )}


        {/* LOADING */}

        {loading ? (

          <div className="grid gap-5 lg:grid-cols-2">

            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
              >
                <div className="h-5 w-2/3 rounded bg-slate-200" />

                <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />

                <div className="mt-6 h-20 rounded-xl bg-slate-200" />

                <div className="mt-5 h-11 rounded-xl bg-slate-200" />
              </div>
            ))}

          </div>

        ) : filteredRequirements.length === 0 ? (

          /* EMPTY */

          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Package
                size={27}
                className="text-blue-600"
              />
            </div>

            <h2 className="mt-5 text-xl font-bold text-[#0b1f3a]">
              No RFQ requests found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              New buyer requirements will appear here.
            </p>

          </div>

        ) : (

          /* RFQ GRID */

          <div className="grid gap-5 lg:grid-cols-2">

            {filteredRequirements.map(
              (requirement) => (

                <div
                  key={requirement.id}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-blue-200 hover:shadow-lg"
                >

                  {/* TOP */}

                  <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                          {requirement.category ||
                            "General"}
                        </span>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold capitalize text-green-700">
                          {requirement.status ||
                            "open"}
                        </span>

                      </div>

                      <h2 className="mt-3 text-xl font-bold text-[#0b1f3a]">
                        {requirement.title}
                      </h2>

                    </div>

                    <span className="shrink-0 text-xs font-semibold text-slate-400">
                      RFQ #{requirement.id}
                    </span>

                  </div>


                  {/* DESCRIPTION */}

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {requirement.description ||
                      "Buyer has not provided additional details."}
                  </p>


                  {/* DETAILS */}

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">

                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <Package size={14} />
                        Quantity
                      </div>

                      <p className="mt-1 text-sm font-bold text-[#0b1f3a]">
                        {requirement.quantity}{" "}
                        {requirement.unit}
                      </p>

                    </div>


                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <MapPin size={14} />
                        Delivery
                      </div>

                      <p className="mt-1 truncate text-sm font-bold text-[#0b1f3a]">
                        {requirement.delivery_location ||
                          "Not specified"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <IndianRupee size={14} />
                        Buyer Budget
                      </div>

                      <p className="mt-1 text-sm font-bold text-[#0b1f3a]">
                        {requirement.max_budget
                          ? `Up to ₹${Number(
                              requirement.max_budget
                            ).toLocaleString(
                              "en-IN"
                            )}`
                          : "Not specified"}
                      </p>

                    </div>


                    <div className="rounded-xl bg-slate-50 p-3">

                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                        <CalendarDays size={14} />
                        Required By
                      </div>

                      <p className="mt-1 text-sm font-bold text-[#0b1f3a]">
                        {formatDate(
                          requirement.required_by
                        )}
                      </p>

                    </div>

                  </div>


                  {/* ACTION */}

                  <button
                    onClick={() =>
                      openRFQ(requirement)
                    }
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-blue-700"
                  >
                    View RFQ & Submit Quote
                    <Send size={16} />
                  </button>

                </div>

              )
            )}

          </div>

        )}

      </section>


      {/* ==========================================
          RFQ DETAIL MODAL
      ========================================== */}

      {selectedRFQ && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/60 px-4 py-6 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">

              <div>

                <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                  RFQ #{selectedRFQ.id}
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#0b1f3a]">
                  {selectedRFQ.title}
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedRFQ(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={18} />
              </button>

            </div>


            <div className="p-5 sm:p-6">

              {/* REQUIREMENT */}

              <div className="rounded-2xl bg-slate-50 p-5">

                <h3 className="font-bold text-[#0b1f3a]">
                  Buyer Requirement
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {selectedRFQ.description ||
                    "No additional description provided."}
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-400">
                      Quantity
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {selectedRFQ.quantity}{" "}
                      {selectedRFQ.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Delivery Location
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {selectedRFQ.delivery_location}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Required By
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {formatDate(
                        selectedRFQ.required_by
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Target Budget
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-700">
                      {selectedRFQ.max_budget
                        ? `₹${Number(
                            selectedRFQ.max_budget
                          ).toLocaleString(
                            "en-IN"
                          )}`
                        : "Not specified"}
                    </p>
                  </div>

                </div>

              </div>


              {/* OPEN QUOTE FORM */}

              {!showQuoteForm ? (

                <button
                  onClick={() => {
                    setShowQuoteForm(true)
                    setSuccess("")
                    setSubmitError("")
                  }}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-orange-600"
                >
                  <Send size={17} />
                  Submit Your Quote
                </button>

              ) : (

                <form
                  onSubmit={handleQuoteSubmit}
                  className="mt-5 space-y-5"
                >

                  <div className="border-t border-slate-100 pt-5">

                    <h3 className="text-lg font-bold text-[#0b1f3a]">
                      Your Quotation
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      Enter your commercial offer for this buyer.
                    </p>

                  </div>


                  {/* SUPPLIER INFO */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Supplier / Company Name
                      </label>

                      <input
                        name="supplierName"
                        value={
                          quoteData.supplierName
                        }
                        onChange={handleQuoteChange}
                        placeholder="Your company name"
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Email
                      </label>

                      <input
                        type="email"
                        name="supplierEmail"
                        value={
                          quoteData.supplierEmail
                        }
                        onChange={handleQuoteChange}
                        placeholder="you@company.com"
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  </div>


                  {/* PRICE + QUANTITY */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Quoted Price
                      </label>

                      <input
                        type="number"
                        min="0"
                        name="quotedPrice"
                        value={
                          quoteData.quotedPrice
                        }
                        onChange={handleQuoteChange}
                        placeholder="e.g. 125000"
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Quantity
                      </label>

                      <input
                        type="number"
                        min="1"
                        name="quantity"
                        value={
                          quoteData.quantity
                        }
                        onChange={handleQuoteChange}
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  </div>


                  {/* UNIT + DELIVERY */}

                  <div className="grid gap-4 sm:grid-cols-2">

                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Unit
                      </label>

                      <input
                        name="unit"
                        value={quoteData.unit}
                        onChange={handleQuoteChange}
                        placeholder="Piece / Kg / Ton"
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>


                    <div>

                      <label className="mb-2 block text-sm font-semibold text-slate-700">
                        Delivery Time
                      </label>

                      <input
                        name="deliveryTime"
                        value={
                          quoteData.deliveryTime
                        }
                        onChange={handleQuoteChange}
                        placeholder="e.g. 7-10 days"
                        required
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                      />

                    </div>

                  </div>


                  {/* MESSAGE */}

                  <div>

                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Message / Commercial Terms
                    </label>

                    <textarea
                      name="message"
                      rows="5"
                      value={quoteData.message}
                      onChange={handleQuoteChange}
                      placeholder="Add payment terms, shipping details, product specifications, validity, etc."
                      className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    />

                  </div>


                  {/* SUCCESS */}

                  {success && (

                    <div className="rounded-xl border border-green-200 bg-green-50 p-4">

                      <div className="flex items-start gap-3">

                        <CheckCircle2
                          size={20}
                          className="mt-0.5 shrink-0 text-green-600"
                        />

                        <div>

                          <p className="text-sm font-bold text-green-700">
                            Quote Submitted
                          </p>

                          <p className="mt-1 text-xs text-green-600">
                            {success}
                          </p>

                        </div>

                      </div>

                    </div>

                  )}


                  {/* ERROR */}

                  {submitError && (

                    <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                      <p className="text-sm font-semibold text-red-700">
                        {submitError}
                      </p>

                    </div>

                  )}


                  {/* BUTTONS */}

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={() =>
                        setShowQuoteForm(false)
                      }
                      className="flex-1 rounded-xl border border-slate-200 px-5 py-3.5 text-sm font-bold text-slate-600 hover:bg-slate-50"
                    >
                      Back
                    </button>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3.5 text-sm font-bold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {submitting ? (
                        <>
                          <LoaderCircle
                            size={17}
                            className="animate-spin"
                          />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Quote
                          <Send size={17} />
                        </>
                      )}

                    </button>

                  </div>

                </form>

              )}

            </div>

          </div>

        </div>

      )}

    </main>
  )
}