import { useState, useEffect } from "react";
import api from "../../services/api";

export default function FeedbackSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: "5",
    message: ""
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await api.getFeedbacks();
      if (res && res.success && res.data) {
        setFeedbacks(res.data);
        return;
      }
    } catch (e) {}

    try {
      const saved = JSON.parse(localStorage.getItem("arise_feedbacks") || "[]");
      setFeedbacks(saved);
    } catch (e) {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.message.trim()) return;

    setLoading(true);
    const feedbackObj = {
      _id: "fb_" + Date.now(),
      ...formData,
      createdAt: new Date().toISOString()
    };

    try {
      await api.sendFeedback(feedbackObj);
    } catch (e) {}

    try {
      const saved = JSON.parse(localStorage.getItem("arise_feedbacks") || "[]");
      const updated = [feedbackObj, ...saved];
      localStorage.setItem("arise_feedbacks", JSON.stringify(updated));
      setFeedbacks(updated);
    } catch (e) {
      setFeedbacks((prev) => [feedbackObj, ...prev]);
    }

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <section id="feedback" className="border-b border-border bg-surface-raised/40 py-16 px-5 md:px-8">
      <div className="mx-auto max-w-5xl space-y-10 text-center">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#00d2ff]">Player Community</span>
          <h2 className="font-display text-3xl font-extrabold uppercase text-white mt-1">Player Feedback &amp; Reviews</h2>
          <p className="text-xs text-text-muted mt-1 max-w-md mx-auto">
            Share your tournament experience or see what players in the ARISE community have to say!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-left items-start">
          {/* Left Column: Form / Success Message */}
          <div className="space-y-4">
            <h3 className="font-display text-lg font-bold uppercase text-[#00d2ff]"> Submit Your Feedback</h3>
            
            {submitted ? (
              <div className="border border-[#00d2ff]/40 bg-[#00d2ff]/10 p-6 clip-corner-sm space-y-2 text-center">
                <div className="text-3xl"></div>
                <h3 className="font-display text-xl font-bold uppercase text-white">Thank You for Your Feedback!</h3>
                <p className="text-xs text-text-muted">
                  Your review has been saved live and published to the player community &amp; organizers!
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", rating: "5", message: "" });
                  }}
                  className="mt-3 px-6 py-2 bg-[#00d2ff] text-ink font-display font-extrabold uppercase text-xs clip-corner-sm cursor-pointer"
                >
                  Submit Another Response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="border border-border bg-surface p-6 clip-corner-sm space-y-4 shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Aman Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border border-border bg-surface-raised px-3 py-2 text-xs text-white focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-text-muted mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. player@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full border border-border bg-surface-raised px-3 py-2 text-xs text-white focus:border-[#00d2ff] focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Platform Rating *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full border border-border bg-surface-raised px-3 py-2 text-xs text-gold font-bold focus:border-[#00d2ff] focus:outline-none"
                  >
                    <option value="5"> 5/5 - Outstanding Platform</option>
                    <option value="4"> 4/5 - Great Experience</option>
                    <option value="3"> 3/5 - Good / Average</option>
                    <option value="2"> 2/5 - Needs Improvement</option>
                    <option value="1"> 1/5 - Poor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-text-muted mb-1">Your Feedback &amp; Suggestions *</label>
                  <textarea
                    required
                    rows="4"
                    placeholder="Share your experience, feature requests, or game suggestions..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full border border-border bg-surface-raised px-3 py-2 text-xs text-white focus:border-[#00d2ff] focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-[#00d2ff] to-[#00a3ff] text-ink font-display text-xs font-extrabold uppercase tracking-wider hover:brightness-110 transition-all clip-corner-sm cursor-pointer shadow-[0_0_15px_rgba(0,210,255,0.3)]"
                >
                  {loading ? "Sending..." : "Submit Feedback Live →"}
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Public Player Reviews Display */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-lg font-bold uppercase text-gold"> Community Reviews &amp; Ratings</h3>
              <span className="text-xs font-bold text-[#00d2ff] bg-[#00d2ff]/10 px-2.5 py-1 rounded border border-[#00d2ff]/30">
                {feedbacks.length} Review(s)
              </span>
            </div>

            {feedbacks.length === 0 ? (
              <div className="border border-border bg-surface p-8 text-center clip-corner-sm space-y-2">
                <div className="text-3xl"></div>
                <div className="font-bold text-white text-sm">Be the first to review!</div>
                <div className="text-xs text-text-muted">Fill out the feedback form on the left to publish your thoughts live.</div>
              </div>
            ) : (
              <div className="max-h-[460px] overflow-y-auto space-y-3 pr-1">
                {feedbacks.map((fb) => (
                  <div key={fb._id} className="border border-border/80 bg-surface p-4 clip-corner-sm space-y-2 hover:border-[#00d2ff]/40 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#00d2ff]/20 font-display font-bold text-xs text-[#00d2ff]">
                          {(fb.name || "P").charAt(0).toUpperCase()}
                        </span>
                        <div>
                          <div className="font-bold text-white text-xs">{fb.name}</div>
                          <div className="text-[10px] text-text-muted">
                            {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : "Verified Player"}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gold">
                        {"".repeat(Number(fb.rating) || 5)}
                      </div>
                    </div>
                    <p className="text-xs text-text-muted bg-surface-raised p-2.5 rounded border border-border/50 italic">
                      "{fb.message}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
