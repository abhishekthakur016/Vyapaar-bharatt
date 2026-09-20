import { useEffect, useState } from "react";
import {
  FileText,
  MapPin,
  Package,
  CalendarDays,
  ArrowRight,
  Plus,
  LoaderCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function Requirements() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await fetch("/api/requirements");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch requirements");
        }

        setRequirements(data.requirements || []);
      } catch (error) {
        console.error("Error:", error);
        setError("Unable to load requirements.");
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <section className="bg-[#0952d4] py-12 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                Buyer Dashboard
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">
                My Requirements
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                View and manage the requirements you have posted to suppliers.
              </p>
            </div>

            <Link
              to="/post-requirement"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3.5 text-sm font-black text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#f77925] hover:shadow-md"
            >
              <Plus size={18} />
              Post Requirement
            </Link>
          </div>
        </div>
      </section>

      {/* Content */}
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 lg:px-8">
        {/* Loading */}
        {loading && (
          <div className="flex min-h-[300px] items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
              <LoaderCircle size={22} className="animate-spin text-[#0952d4]" />
              Loading requirements...
            </div>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-bold text-red-700">{error}</p>

            <p className="mt-2 text-sm text-red-600">
              Please make sure the backend server is running.
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && requirements.length === 0 && (
          <div className="rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#0952d4]/10">
              <FileText size={28} className="text-[#0952d4]" />
            </div>

            <h2 className="mt-5 text-xl font-black text-[#0b1f3a]">
              No requirements yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
              Post your first requirement and start receiving quotes from
              relevant suppliers.
            </p>

            <Link
              to="/post-requirement"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#fd8836] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#f77925]"
            >
              Post Your Requirement
              <ArrowRight size={17} />
            </Link>
          </div>
        )}

        {/* Requirements */}
        {!loading && !error && requirements.length > 0 && (
          <div>
            {/* Summary */}
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-[#0b1f3a]">
                  Your Posted Requirements
                </p>

                <p className="mt-1 text-xs text-gray-500">
                  {requirements.length} requirement
                  {requirements.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {/* Cards */}
            <div className="grid gap-5">
              {requirements.map((requirement) => (
                <div
                  key={requirement.id}
                  className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-7"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                    {/* Main Info */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="rounded-full bg-[#0952d4]/10 px-3 py-1 text-xs font-bold text-[#0952d4]">
                          {requirement.category}
                        </span>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold capitalize text-green-600">
                          {requirement.status}
                        </span>
                      </div>

                      <h2 className="mt-4 text-xl font-black text-[#0b1f3a]">
                        {requirement.title}
                      </h2>

                      {requirement.subcategory && (
                        <p className="mt-1 text-sm text-gray-500">
                          {requirement.subcategory}
                        </p>
                      )}

                      <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                        {/* Quantity */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Package
                            size={17}
                            className="shrink-0 text-[#0952d4]"
                          />

                          <span>
                            <span className="font-bold text-[#0b1f3a]">
                              {requirement.quantity}
                            </span>{" "}
                            {requirement.unit}
                          </span>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin
                            size={17}
                            className="shrink-0 text-[#fd8836]"
                          />

                          <span>{requirement.delivery_location}</span>
                        </div>

                        {/* Required Date */}
                        {requirement.required_by && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <CalendarDays
                              size={17}
                              className="shrink-0 text-[#0952d4]"
                            />

                            <span>
                              Required by{" "}
                              {new Date(
                                requirement.required_by,
                              ).toLocaleDateString("en-IN")}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Budget */}
                      {(requirement.min_budget || requirement.max_budget) && (
                        <div className="mt-5">
                          <span className="text-xs font-bold uppercase tracking-wide text-gray-400">
                            Budget
                          </span>

                          <p className="mt-1 text-sm font-black text-[#0b1f3a]">
                            {requirement.min_budget &&
                              `₹${Number(requirement.min_budget).toLocaleString(
                                "en-IN",
                              )}`}

                            {requirement.min_budget &&
                              requirement.max_budget &&
                              " – "}

                            {requirement.max_budget &&
                              `₹${Number(requirement.max_budget).toLocaleString(
                                "en-IN",
                              )}`}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div className="shrink-0 border-t border-gray-100 pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                      <Link
                        to={`/requirements/${requirement.id}`}
                        className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-5 py-3 text-sm font-bold text-[#0b1f3a] transition hover:border-[#0952d4] hover:text-[#0952d4] lg:w-auto"
                      >
                        View Details
                        <ArrowRight size={17} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default Requirements;
