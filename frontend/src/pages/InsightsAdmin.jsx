import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Image as ImageIcon,
  Plus,
  Save,
  Trash2,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

const emptyForm = {
  title: "",
  category: "Market Insights",
  category_id: "market-insights",
  excerpt: "",
  content: "",
  image_url: "",
};

const categories = [
  { name: "Market Insights", id: "market-insights" },
  { name: "Industry Trends", id: "industry-trends" },
  { name: "Sourcing Guides", id: "sourcing-guides" },
  { name: "Business Tips", id: "business-tips" },
  { name: "Trade & Export", id: "trade-export" },
  { name: "Manufacturing", id: "manufacturing" },
];

function InsightsAdmin() {
  const [insights, setInsights] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchInsights = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/insights");
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to fetch insights");
      }

      setInsights(data.insights || []);
    } catch (err) {
      setError(err.message || "Unable to load insights.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const handleCategoryChange = (value) => {
    const category = categories.find((item) => item.name === value);

    setForm((current) => ({
      ...current,
      category: value,
      category_id: category?.id || "",
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setMessage("");
    setError("");
  };

  const startEdit = (insight) => {
    setEditingId(insight.id);

    setForm({
      title: insight.title || "",
      category: insight.category || "Market Insights",
      category_id: insight.category_id || "market-insights",
      excerpt: insight.excerpt || "",
      content: insight.content || "",
      image_url: insight.image_url || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      const url = editingId ? `/api/insights/${editingId}` : "/api/insights";

      const response = await fetch(url, {
        method: editingId ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to save insight");
      }

      setMessage(
        editingId
          ? "Insight updated successfully."
          : "Insight created successfully.",
      );

      resetForm();
      await fetchInsights();
    } catch (err) {
      setError(err.message || "Unable to save insight.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this insight?",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setMessage("");

      const response = await fetch(`/api/insights/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Failed to delete insight");
      }

      setMessage("Insight deleted successfully.");
      await fetchInsights();
    } catch (err) {
      setError(err.message || "Unable to delete insight.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <Link
              to="/insights"
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-[#0952d4]"
            >
              <ArrowLeft size={16} />
              View Insights
            </Link>

            <h1 className="text-3xl font-bold text-[#0b1f3a]">
              Insights Management
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Create, edit and manage your business insights.
            </p>
          </div>
        </div>

        {(message || error) && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              error
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
            }`}
          >
            {error || message}
          </div>
        )}

        {/* FORM */}
        <section className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#0952d4]">
                {editingId ? "EDIT" : "CREATE"}
              </p>

              <h2 className="mt-1 text-xl font-bold text-[#0b1f3a]">
                {editingId ? "Edit Insight" : "Add New Insight"}
              </h2>
            </div>

            {editingId && (
              <button
                onClick={resetForm}
                type="button"
                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800"
              >
                <X size={16} />
                Cancel Edit
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Title
                </label>

                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Enter insight title"
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Category
                </label>

                <select
                  value={form.category}
                  onChange={(event) => handleCategoryChange(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Short Description
              </label>

              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                required
                rows="3"
                placeholder="Short description shown on insight cards"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Unsplash Image URL
              </label>

              <div className="relative">
                <ImageIcon
                  size={17}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 pl-11 text-sm outline-none focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>

            {form.image_url && (
              <div className="overflow-hidden rounded-lg border border-slate-200">
                <img
                  src={form.image_url}
                  alt="Insight preview"
                  className="h-48 w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              </div>
            )}

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Article Content
              </label>

              <textarea
                name="content"
                value={form.content}
                onChange={handleChange}
                required
                rows="14"
                placeholder="Write the complete insight content..."
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm leading-6 outline-none focus:border-[#0952d4] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0952d4] px-6 py-3 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editingId ? <Save size={16} /> : <Plus size={16} />}
              {saving
                ? "Saving..."
                : editingId
                  ? "Update Insight"
                  : "Create Insight"}
            </button>
          </form>
        </section>

        {/* LIST */}
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 p-6">
            <h2 className="text-xl font-bold text-[#0b1f3a]">All Insights</h2>

            <p className="mt-1 text-sm text-slate-500">
              {insights.length} insight{insights.length !== 1 ? "s" : ""}
            </p>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading insights...
            </div>
          ) : insights.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No insights available.
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {insights.map((insight) => (
                <div
                  key={insight.id}
                  className="flex flex-col gap-5 p-6 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex min-w-0 gap-4">
                    <div className="h-24 w-32 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                      {insight.image_url ? (
                        <img
                          src={insight.image_url}
                          alt={insight.title}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-slate-400">
                          No Image
                        </div>
                      )}
                    </div>

                    <div className="min-w-0">
                      <span className="text-xs font-bold text-[#0952d4]">
                        {insight.category}
                      </span>

                      <h3 className="mt-1 font-bold text-[#0b1f3a]">
                        {insight.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                        {insight.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Link
                      to={`/insights/${insight.id}`}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#0952d4] hover:text-[#0952d4]"
                    >
                      View
                    </Link>

                    <button
                      onClick={() => startEdit(insight)}
                      className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-[#0952d4] hover:text-[#0952d4]"
                    >
                      <Edit3 size={15} />
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(insight.id)}
                      disabled={deletingId === insight.id}
                      className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      <Trash2 size={15} />
                      {deletingId === insight.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default InsightsAdmin;
