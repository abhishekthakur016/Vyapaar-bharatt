import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  Package,
  MapPin,
  CalendarDays,
  IndianRupee,
  FileText,
  LoaderCircle,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock3,
} from "lucide-react";

function RequirementDetails() {
  const { id } = useParams();

  const [requirement, setRequirement] = useState(null);
  const [quotes, setQuotes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [quotesLoading, setQuotesLoading] = useState(true);

  const [error, setError] = useState("");
  const [quoteError, setQuoteError] = useState("");

  // --------------------------------------------------
  // QUOTE FORM
  // --------------------------------------------------

  const [quoteData, setQuoteData] = useState({
    supplierName: "",
    supplierEmail: "",
    quotedPrice: "",
    quantity: "",
    unit: "",
    deliveryTime: "",
    message: "",
  });

  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteLoading, setQuoteLoading] = useState(false);

  // --------------------------------------------------
  // QUOTE ACTION STATES
  // --------------------------------------------------

  const [quoteActionLoading, setQuoteActionLoading] = useState(null);

  const [quoteActionError, setQuoteActionError] = useState("");

  // --------------------------------------------------
  // FETCH REQUIREMENT
  // --------------------------------------------------

  useEffect(() => {
    const fetchRequirement = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/requirements/${id}`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Requirement not found");
        }

        setRequirement(data.requirement);
      } catch (error) {
        console.error("Error fetching requirement:", error);

        setError(error.message || "Unable to load this requirement.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequirement();
  }, [id]);

  // --------------------------------------------------
  // FETCH QUOTES
  // --------------------------------------------------

  const fetchQuotes = async () => {
    try {
      setQuotesLoading(true);
      setQuoteError("");

      const response = await fetch(`/api/requirements/${id}/quotes`);

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch quotes");
      }

      setQuotes(data.quotes || []);
    } catch (error) {
      console.error("Error fetching quotes:", error);

      setQuoteError(error.message || "Unable to load received quotes.");
    } finally {
      setQuotesLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [id]);

  // --------------------------------------------------
  // QUOTE FORM CHANGE
  // --------------------------------------------------

  const handleQuoteChange = (e) => {
    const { name, value } = e.target;

    setQuoteData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setQuoteSubmitted(false);
  };

  // --------------------------------------------------
  // SUBMIT QUOTE
  // --------------------------------------------------

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();

    if (!requirement) return;

    // Don't allow quote if requirement is accepted
    if (requirement.status === "accepted") {
      alert(
        "This requirement has already been accepted. New quotes are not allowed.",
      );
      return;
    }

    setQuoteLoading(true);
    setQuoteSubmitted(false);

    try {
      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("vyapaar_token")}`,
        },
        body: JSON.stringify({
          requirementId: requirement.id,
          supplierName: quoteData.supplierName,
          supplierEmail: quoteData.supplierEmail,
          quotedPrice: quoteData.quotedPrice,
          quantity: quoteData.quantity,
          unit: quoteData.unit,
          deliveryTime: quoteData.deliveryTime,
          message: quoteData.message,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to submit quote");
      }

      setQuoteSubmitted(true);

      setQuoteData({
        supplierName: "",
        supplierEmail: "",
        quotedPrice: "",
        quantity: "",
        unit: "",
        deliveryTime: "",
        message: "",
      });

      // Refresh received quotes
      await fetchQuotes();

      // Refresh requirement
      const requirementResponse = await fetch(`/api/requirements/${id}`);

      const requirementData = await requirementResponse.json();

      if (
        requirementResponse.ok &&
        requirementData.success &&
        requirementData.requirement
      ) {
        setRequirement(requirementData.requirement);
      }
    } catch (error) {
      console.error("Error submitting quote:", error);

      alert(error.message || "Failed to submit quote");
    } finally {
      setQuoteLoading(false);
    }
  };

  // --------------------------------------------------
  // ACCEPT / REJECT QUOTE
  // --------------------------------------------------

  const handleQuoteStatus = async (quoteId, status) => {
    if (!quoteId) return;

    const actionText = status === "accepted" ? "accept" : "reject";

    const confirmed = window.confirm(
      `Are you sure you want to ${actionText} this quote?`,
    );

    if (!confirmed) return;

    try {
      setQuoteActionLoading(`${quoteId}-${status}`);

      setQuoteActionError("");

      const response = await fetch(`/api/quotes/${quoteId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || `Failed to ${actionText} quote`);
      }

      // Refresh quotes
      await fetchQuotes();

      // Refresh requirement status
      const requirementResponse = await fetch(`/api/requirements/${id}`);

      const requirementData = await requirementResponse.json();

      if (
        requirementResponse.ok &&
        requirementData.success &&
        requirementData.requirement
      ) {
        setRequirement(requirementData.requirement);
      }
    } catch (error) {
      console.error("Error updating quote status:", error);

      setQuoteActionError(error.message || `Unable to ${actionText} quote.`);
    } finally {
      setQuoteActionLoading(null);
    }
  };

  // --------------------------------------------------
  // STATUS HELPERS
  // --------------------------------------------------

  const getStatusConfig = (status) => {
    switch (status) {
      case "accepted":
        return {
          label: "Accepted",
          className: "bg-green-50 text-green-700 border-green-200",
          icon: CheckCircle2,
        };

      case "rejected":
        return {
          label: "Rejected",
          className: "bg-red-50 text-red-700 border-red-200",
          icon: XCircle,
        };

      case "negotiating":
        return {
          label: "Negotiating",
          className: "bg-orange-50 text-orange-700 border-orange-200",
          icon: Clock3,
        };

      case "pending":
      default:
        return {
          label: "Pending",
          className: "bg-yellow-50 text-yellow-700 border-yellow-200",
          icon: Clock3,
        };
    }
  };

  const getRequirementStatusConfig = (status) => {
    switch (status) {
      case "accepted":
        return {
          label: "Accepted",
          className: "bg-green-50 text-green-700",
        };

      case "quoted":
        return {
          label: "Quotes Received",
          className: "bg-blue-50 text-blue-700",
        };

      case "negotiating":
        return {
          label: "Negotiating",
          className: "bg-orange-50 text-orange-700",
        };

      case "closed":
        return {
          label: "Closed",
          className: "bg-slate-100 text-slate-700",
        };

      case "cancelled":
        return {
          label: "Cancelled",
          className: "bg-red-50 text-red-700",
        };

      case "open":
      default:
        return {
          label: "Open",
          className: "bg-green-50 text-green-700",
        };
    }
  };

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="text-center">
            <LoaderCircle
              size={42}
              className="mx-auto animate-spin text-[#0952d4]"
            />

            <p className="mt-4 text-sm font-medium text-slate-600">
              Loading requirement...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error || !requirement) {
    return (
      <main className="min-h-screen bg-slate-50">
        <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center px-4">
          <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">
              <FileText size={26} className="text-red-500" />
            </div>

            <h1 className="mt-5 text-2xl font-bold text-[#0b1f3a]">
              Requirement Not Found
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              {error || "This requirement does not exist."}
            </p>

            <Link
              to="/requirements"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#0952d4] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0744b5]"
            >
              <ArrowLeft size={17} />
              Back to Requirements
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const requirementStatus = getRequirementStatusConfig(requirement.status);

  const isRequirementAccepted = requirement.status === "accepted";

  return (
    <main className="min-h-screen bg-slate-50">
      {/* ================================================
          HEADER
      ================================================= */}

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            to="/requirements"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#0952d4]"
          >
            <ArrowLeft size={17} />
            Back to Requirements
          </Link>

          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wide ${requirementStatus.className}`}
                >
                  {requirementStatus.label}
                </span>

                <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#0952d4]">
                  {requirement.category}
                </span>
              </div>

              <h1 className="max-w-4xl text-3xl font-bold leading-tight text-[#0b1f3a] md:text-4xl">
                {requirement.title}
              </h1>

              <p className="mt-3 text-sm text-slate-500">
                Requirement ID: #{requirement.id}
              </p>
            </div>

            <div
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-3 ${
                isRequirementAccepted
                  ? "border border-green-100 bg-green-50"
                  : "border border-green-100 bg-green-50"
              }`}
            >
              <ShieldCheck size={21} className="text-green-600" />

              <div>
                <p className="text-xs font-bold text-green-700">
                  {isRequirementAccepted
                    ? "Requirement Accepted"
                    : "Open Requirement"}
                </p>

                <p className="text-xs text-green-600">
                  {isRequirementAccepted
                    ? "Quote selection completed"
                    : "Accepting supplier quotes"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================================================
          CONTENT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* ============================================
              LEFT
          ============================================= */}

          <div className="space-y-6 lg:col-span-2">
            {/* Requirement Overview */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                  <Package size={22} className="text-[#0952d4]" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#0b1f3a]">
                    Requirement Overview
                  </h2>

                  <p className="text-sm text-slate-500">
                    Details provided by the buyer
                  </p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Category */}

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 font-semibold text-[#0b1f3a]">
                    {requirement.category || "N/A"}
                  </p>
                </div>

                {/* Subcategory */}

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Subcategory
                  </p>

                  <p className="mt-1 font-semibold text-[#0b1f3a]">
                    {requirement.subcategory || "N/A"}
                  </p>
                </div>

                {/* Quantity */}

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Quantity
                  </p>

                  <p className="mt-1 font-semibold text-[#0b1f3a]">
                    {requirement.quantity || "N/A"} {requirement.unit || ""}
                  </p>
                </div>

                {/* Location */}

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Delivery Location
                  </p>

                  <div className="mt-1 flex items-center gap-2 font-semibold text-[#0b1f3a]">
                    <MapPin size={17} className="text-[#0952d4]" />

                    {requirement.delivery_location || "N/A"}
                  </div>
                </div>

                {/* Budget */}

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Budget Range
                  </p>

                  <div className="mt-1 flex items-center gap-1 font-semibold text-[#0b1f3a]">
                    <IndianRupee size={16} className="text-[#0952d4]" />

                    {requirement.min_budget
                      ? Number(requirement.min_budget).toLocaleString("en-IN")
                      : "Not specified"}

                    {requirement.max_budget && (
                      <>
                        {" "}
                        - ₹
                        {Number(requirement.max_budget).toLocaleString("en-IN")}
                      </>
                    )}
                  </div>
                </div>

                {/* Required By */}

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Required By
                  </p>

                  <div className="mt-1 flex items-center gap-2 font-semibold text-[#0b1f3a]">
                    <CalendarDays size={17} className="text-[#0952d4]" />

                    {requirement.required_by
                      ? new Date(requirement.required_by).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "Not specified"}
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                  <FileText size={22} className="text-[#fd8836]" />
                </div>

                <div>
                  <h2 className="text-xl font-bold text-[#0b1f3a]">
                    Requirement Description
                  </h2>

                  <p className="text-sm text-slate-500">
                    What the buyer is looking for
                  </p>
                </div>
              </div>

              <div className="whitespace-pre-line text-sm leading-7 text-slate-600">
                {requirement.description}
              </div>
            </div>

            {/* ==========================================
                RECEIVED QUOTES
            ========================================== */}

            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
              {/* Header */}

              <div className="border-b border-slate-200 p-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50">
                      <FileText size={22} className="text-[#0952d4]" />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-[#0b1f3a]">
                        Received Quotes
                      </h2>

                      <p className="text-sm text-slate-500">
                        Supplier quotations for this requirement
                      </p>
                    </div>
                  </div>

                  <div className="rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-[#0952d4]">
                    {quotes.length} {quotes.length === 1 ? "Quote" : "Quotes"}
                  </div>
                </div>
              </div>

              {/* Quotes */}

              <div className="p-6">
                {/* Action Error */}

                {quoteActionError && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm font-medium text-red-600">
                      {quoteActionError}
                    </p>
                  </div>
                )}

                {quotesLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <LoaderCircle
                      size={30}
                      className="animate-spin text-[#0952d4]"
                    />

                    <span className="ml-3 text-sm text-slate-500">
                      Loading quotes...
                    </span>
                  </div>
                ) : quoteError ? (
                  <div className="rounded-xl bg-red-50 p-5 text-center">
                    <p className="text-sm font-medium text-red-600">
                      {quoteError}
                    </p>
                  </div>
                ) : quotes.length === 0 ? (
                  <div className="py-10 text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                      <FileText size={25} className="text-slate-400" />
                    </div>

                    <h3 className="mt-4 font-bold text-[#0b1f3a]">
                      No Quotes Yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                      No supplier has submitted a quotation for this requirement
                      yet.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {quotes.map((quote) => {
                      const statusConfig = getStatusConfig(quote.status);

                      const StatusIcon = statusConfig.icon;

                      const accepting =
                        quoteActionLoading === `${quote.id}-accepted`;

                      const rejecting =
                        quoteActionLoading === `${quote.id}-rejected`;

                      return (
                        <div
                          key={quote.id}
                          className={`rounded-2xl border p-5 transition ${
                            quote.status === "accepted"
                              ? "border-green-200 bg-green-50/30"
                              : quote.status === "rejected"
                                ? "border-red-100 bg-red-50/20"
                                : "border-slate-200 hover:border-blue-200 hover:shadow-sm"
                          }`}
                        >
                          {/* Quote Top */}

                          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                            <div className="flex items-start gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0952d4] text-sm font-bold text-white">
                                {quote.supplier_name
                                  ? quote.supplier_name.charAt(0).toUpperCase()
                                  : "S"}
                              </div>

                              <div>
                                <h3 className="font-bold text-[#0b1f3a]">
                                  {quote.supplier_name || "Supplier"}
                                </h3>

                                {quote.supplier_email && (
                                  <p className="mt-1 text-xs text-slate-500">
                                    {quote.supplier_email}
                                  </p>
                                )}

                                <p className="mt-1 text-xs text-slate-400">
                                  Quote #{quote.id}
                                </p>
                              </div>
                            </div>

                            {/* Status */}

                            <div
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold capitalize ${statusConfig.className}`}
                            >
                              <StatusIcon size={14} />

                              {statusConfig.label}
                            </div>
                          </div>

                          {/* Quote Details */}

                          <div className="mt-5 grid gap-3 sm:grid-cols-3">
                            {/* Price */}

                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Quoted Price
                              </p>

                              <p className="mt-1 flex items-center gap-1 text-lg font-bold text-[#0b1f3a]">
                                <IndianRupee size={17} />

                                {Number(quote.quoted_price).toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            </div>

                            {/* Quantity */}

                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Quantity
                              </p>

                              <p className="mt-1 font-bold text-[#0b1f3a]">
                                {quote.quantity} {quote.unit}
                              </p>
                            </div>

                            {/* Delivery */}

                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Delivery
                              </p>

                              <p className="mt-1 font-bold text-[#0b1f3a]">
                                {quote.delivery_time || "Not specified"}
                              </p>
                            </div>
                          </div>

                          {/* Message */}

                          {quote.message && (
                            <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4">
                              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                Supplier Message
                              </p>

                              <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">
                                {quote.message}
                              </p>
                            </div>
                          )}

                          {/* Actions */}

                          <div className="mt-5 flex flex-wrap gap-3">
                            {/* Accept */}

                            {quote.status !== "accepted" &&
                              quote.status !== "rejected" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuoteStatus(quote.id, "accepted")
                                  }
                                  disabled={quoteActionLoading !== null}
                                  className="inline-flex items-center gap-2 rounded-xl bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {accepting ? (
                                    <>
                                      <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                      />
                                      Accepting...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 size={17} />
                                      Accept Quote
                                    </>
                                  )}
                                </button>
                              )}

                            {/* Reject */}

                            {quote.status !== "rejected" &&
                              quote.status !== "accepted" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleQuoteStatus(quote.id, "rejected")
                                  }
                                  disabled={quoteActionLoading !== null}
                                  className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                  {rejecting ? (
                                    <>
                                      <LoaderCircle
                                        size={17}
                                        className="animate-spin"
                                      />
                                      Rejecting...
                                    </>
                                  ) : (
                                    <>
                                      <XCircle size={17} />
                                      Reject Quote
                                    </>
                                  )}
                                </button>
                              )}

                            {/* Accepted Message */}

                            {quote.status === "accepted" && (
                              <div className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2.5 text-sm font-bold text-green-700">
                                <CheckCircle2 size={17} />
                                Quote Accepted
                              </div>
                            )}

                            {/* Rejected Message */}

                            {quote.status === "rejected" && (
                              <div className="inline-flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-bold text-red-600">
                                <XCircle size={17} />
                                Quote Rejected
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Info */}

            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white">
                  <ShieldCheck size={22} className="text-[#0952d4]" />
                </div>

                <div>
                  <h3 className="font-bold text-[#0b1f3a]">
                    Compare supplier quotes
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Review pricing, quantity, delivery time and supplier
                    messages before accepting a quotation.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ============================================
              RIGHT - SEND QUOTE
          ============================================= */}

          <div>
            <div className="sticky top-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-6">
                <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50">
                  <ArrowRight size={22} className="text-[#fd8836]" />
                </div>

                <h2 className="text-2xl font-bold text-[#0b1f3a]">
                  Send Your Quote
                </h2>

                <p className="mt-1 text-sm leading-6 text-slate-500">
                  Interested in this requirement? Send your best quotation to
                  the buyer.
                </p>
              </div>

              {/* Accepted Requirement */}

              {isRequirementAccepted && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2
                      size={21}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <p className="font-bold text-green-700">
                        Requirement Accepted
                      </p>

                      <p className="mt-1 text-xs leading-5 text-green-600">
                        This requirement has already been accepted. New
                        quotations are no longer being accepted.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Success */}

              {quoteSubmitted && (
                <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      size={21}
                      className="mt-0.5 shrink-0 text-green-600"
                    />

                    <div>
                      <p className="font-bold text-green-700">
                        Quote Submitted Successfully!
                      </p>

                      <p className="mt-1 text-xs leading-5 text-green-600">
                        Your quotation has been added to the received quotes.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Form */}

              <form onSubmit={handleQuoteSubmit} className="space-y-4">
                {/* Supplier Name */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#0b1f3a]">
                    Supplier / Company Name
                  </label>

                  <input
                    type="text"
                    name="supplierName"
                    value={quoteData.supplierName}
                    onChange={handleQuoteChange}
                    required
                    disabled={isRequirementAccepted}
                    placeholder="Enter company name"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Email */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#0b1f3a]">
                    Email Address
                  </label>

                  <input
                    type="email"
                    name="supplierEmail"
                    value={quoteData.supplierEmail}
                    onChange={handleQuoteChange}
                    disabled={isRequirementAccepted}
                    placeholder="company@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Price + Quantity */}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#0b1f3a]">
                      Quoted Price
                    </label>

                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-400">
                        ₹
                      </span>

                      <input
                        type="number"
                        name="quotedPrice"
                        value={quoteData.quotedPrice}
                        onChange={handleQuoteChange}
                        required
                        min="0"
                        disabled={isRequirementAccepted}
                        placeholder="0"
                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-8 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-[#0b1f3a]">
                      Quantity
                    </label>

                    <input
                      type="number"
                      name="quantity"
                      value={quoteData.quantity}
                      onChange={handleQuoteChange}
                      required
                      min="1"
                      disabled={isRequirementAccepted}
                      placeholder="Qty"
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />
                  </div>
                </div>

                {/* Unit */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#0b1f3a]">
                    Unit
                  </label>

                  <input
                    type="text"
                    name="unit"
                    value={quoteData.unit}
                    onChange={handleQuoteChange}
                    required
                    disabled={isRequirementAccepted}
                    placeholder="e.g. Pieces, Kg, Meter"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Delivery */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#0b1f3a]">
                    Delivery Time
                  </label>

                  <input
                    type="text"
                    name="deliveryTime"
                    value={quoteData.deliveryTime}
                    onChange={handleQuoteChange}
                    disabled={isRequirementAccepted}
                    placeholder="e.g. 15 Days"
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Message */}

                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-[#0b1f3a]">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={quoteData.message}
                    onChange={handleQuoteChange}
                    rows="4"
                    disabled={isRequirementAccepted}
                    placeholder="Add quotation details, payment terms, product information, etc."
                    className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>

                {/* Submit */}

                <button
                  type="submit"
                  disabled={quoteLoading || isRequirementAccepted}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#ed7628] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {quoteLoading ? (
                    <>
                      <LoaderCircle size={19} className="animate-spin" />
                      Sending Quote...
                    </>
                  ) : isRequirementAccepted ? (
                    <>
                      <CheckCircle2 size={18} />
                      Requirement Accepted
                    </>
                  ) : (
                    <>
                      Send Quote
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-slate-400">
                  Your quotation will be visible to the buyer for this
                  requirement.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default RequirementDetails;
