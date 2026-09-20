import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, BookOpen, Share2 } from "lucide-react";

function InsightDetails() {
  const { id } = useParams();

  const [insight, setInsight] = useState(null);
  const [relatedInsights, setRelatedInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/insights/${id}`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Insight not found");
        }

        setInsight(data.insight);

        // Fetch all insights to find related articles.
        const relatedResponse = await fetch("/api/insights");

        const relatedData = await relatedResponse.json();

        if (relatedResponse.ok && relatedData.success) {
          const related = (relatedData.insights || [])
            .filter(
              (item) =>
                item.id !== data.insight.id &&
                item.category_id === data.insight.category_id,
            )
            .slice(0, 2);

          setRelatedInsights(related);
        }
      } catch (err) {
        console.error("Error fetching insight:", err);
        setError(err.message || "Unable to load insight.");
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [id]);

  const handleShare = async () => {
    if (!insight) return;

    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: insight.title,
          text: insight.excerpt,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        alert("Insight link copied!");
      }
    } catch (error) {
      console.log("Share cancelled");
    }
  };

  if (loading) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white py-16 text-center">
          <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#0952d4]" />
          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading insight...
          </p>
        </div>
      </main>
    );
  }

  if (error || !insight) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-20">
        <div className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white p-10 text-center">
          <h1 className="text-2xl font-bold text-[#0b1f3a]">
            Insight Not Found
          </h1>

          <p className="mt-3 text-sm text-slate-500">
            {error || "The insight you are looking for does not exist."}
          </p>

          <Link
            to="/insights"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0952d4] px-5 py-2.5 text-sm font-semibold text-white"
          >
            <ArrowLeft size={16} />
            Back to Insights
          </Link>
        </div>
      </main>
    );
  }

  const contentLines = (insight.content || "").trim().split("\n");

  return (
    <main className="bg-white">
      {/* HEADER */}
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#0952d4]"
          >
            <ArrowLeft size={16} />
            Back to Insights
          </Link>

          <div className="mt-8">
            <span className="inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0952d4]">
              {insight.category}
            </span>

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-[#0b1f3a] sm:text-5xl">
              {insight.title}
            </h1>

            <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600">
              {insight.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <BookOpen size={17} />
                Vyapaar Bharat Insights
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-[#0952d4] hover:text-[#0952d4]"
              >
                <Share2 size={16} />
                Share
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ARTICLE */}
      <section>
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {insight.image_url ? (
            <div
              className="mb-10 h-64 rounded-2xl bg-cover bg-center sm:h-80"
              style={{
                backgroundImage: `url(${insight.image_url})`,
              }}
            />
          ) : (
            <div className="mb-10 h-64 rounded-2xl bg-gradient-to-br from-[#0952d4] to-blue-700 sm:h-80" />
          )}

          <article className="max-w-none">
            {contentLines.map((line, index) => {
              const text = line.trim();

              if (!text) {
                return <div key={index} className="h-3" />;
              }

              if (text.startsWith("### ")) {
                return (
                  <h2
                    key={index}
                    className="mt-8 text-xl font-bold text-[#0b1f3a]"
                  >
                    {text.replace("### ", "")}
                  </h2>
                );
              }

              return (
                <p key={index} className="text-base leading-8 text-slate-600">
                  {text}
                </p>
              );
            })}
          </article>
        </div>
      </section>

      {/* RELATED */}
      {relatedInsights.length > 0 && (
        <section className="border-t border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
            <div className="mb-7">
              <p className="text-xs font-bold uppercase tracking-wider text-[#0952d4]">
                KEEP READING
              </p>

              <h2 className="mt-1 text-2xl font-bold text-[#0b1f3a]">
                Related Insights
              </h2>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {relatedInsights.map((item) => (
                <Link
                  key={item.id}
                  to={`/insights/${item.id}`}
                  className="group overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:-translate-y-1 hover:shadow-md"
                >
                  {item.image_url ? (
                    <div
                      className="h-36 bg-cover bg-center"
                      style={{
                        backgroundImage: `url(${item.image_url})`,
                      }}
                    />
                  ) : (
                    <div className="h-36 bg-gradient-to-br from-[#0952d4] to-blue-700" />
                  )}

                  <div className="p-5">
                    <span className="text-xs font-semibold text-[#0952d4]">
                      {item.category}
                    </span>

                    <h3 className="mt-3 font-bold leading-6 text-[#0b1f3a]">
                      {item.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {item.excerpt}
                    </p>

                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-[#0952d4]">
                      Read More
                      <ArrowRight
                        size={14}
                        className="transition group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl rounded-xl bg-[#0b1f3a] px-6 py-10 text-center">
          <h2 className="text-xl font-bold text-white">
            Ready to find the right business partner?
          </h2>

          <p className="mt-2 text-sm text-slate-300">
            Post your requirement and connect with relevant suppliers.
          </p>

          <Link
            to="/post-requirement"
            className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#fd8836] px-5 py-2.5 text-sm font-bold text-white hover:bg-orange-600"
          >
            Post a Requirement
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  );
}

export default InsightDetails;
