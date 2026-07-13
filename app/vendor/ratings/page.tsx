"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";
import ReportReviewModal from "@/components/vendor/ReportReviewModal";

interface Rating {
  id: string;
  bookingId: string;
  rating: number;
  review: string;

  reported: boolean;
  reportStatus?: "PENDING" | "APPROVED" | "REJECTED";
}

export default function VendorRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [selectedRatingId, setSelectedRatingId] = useState<string | null>(null);
 const [reportReason, setReportReason] = useState("");
 const [selectedReview, setSelectedReview] = useState<Rating | null>(null);

  useEffect(() => {
    fetchRatings();
  }, []);

  const fetchRatings = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) return;

      const res = await API.get(`/ratings/vendor/${vendorId}`);
      setRatings(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

 const handleReport = (id: string) => {
  setSelectedRatingId(id);
  setReportReason("");
  setReportModalOpen(true);
};

const submitReport = async () => {
  if (!selectedRatingId) return;

  if (!reportReason.trim()) {
    alert("Please enter the reason for reporting.");
    return;
  }

  try {
    await API.post(`/ratings/report/${selectedRatingId}`, {
      reason: reportReason,
    });

    setRatings((prev) =>
      prev.map((r) =>
        r.id === selectedRatingId
          ? { ...r, reported: true }
          : r
      )
    );

    setReportModalOpen(false);
    setSelectedRatingId(null);
    setReportReason("");

    alert("Report submitted successfully.");
  } catch (error) {
    console.error(error);
    alert("Failed to submit report.");
  }
};
  const avg =
    ratings.length > 0
      ? (ratings.reduce((a, b) => a + b.rating, 0) / ratings.length).toFixed(1)
      : "0.0";

  const positive = ratings.filter((r) => r.rating >= 4).length;

  const satisfaction = ratings.length
    ? Math.round((positive / ratings.length) * 100)
    : 0;

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <VendorSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col relative min-h-0 min-w-0 overflow-hidden">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        {/* NAVBAR */}
        <VendorNavbar setOpen={setOpen} />

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
                Customer Ratings
              </h1>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                Monitor feedback and improve your service quality.
              </p>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-2xl">
                    ⭐
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Average Rating</span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{avg}</h2>
                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-2">Overall Score</p>
              </div>

              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-xl">
                    📝
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Reviews</span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{ratings.length}</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Feedback Received</p>
              </div>

              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 opacity-20 rounded-full blur-xl -mt-6 -mr-6 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-xl">
                    💚
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Satisfaction Rate</span>
                </div>
                <h2 className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 relative z-10">{satisfaction}%</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2 relative z-10">4+ Star Reviews</p>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-6 md:p-8 border-b border-gray-50/50 dark:border-gray-800/50">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Customer Reviews</h2>
              </div>

              {loading ? (
                <div className="p-16 text-center text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">Loading ratings...</div>
              ) : ratings.length === 0 ? (
                <div className="p-16 text-center bg-gray-50/50">
                  <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium text-lg">No ratings yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold text-xs border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="px-6 py-4">Booking ID</th>
                        <th className="px-6 py-4">Rating</th>
                        <th className="px-6 py-4">Review</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-center">Report</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {ratings.map((r) => (
                        <tr key={r.id} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                            {r.bookingId}
                          </td>
                          <td className="px-6 py-4 font-extrabold text-amber-500 text-lg">
                            ⭐ {r.rating}
                          </td>
                         <td className="px-6 py-4 max-w-xs">
  <button
    onClick={() => setSelectedReview(r)}
    className="text-left w-full"
  >
    <p className="line-clamp-2 text-gray-700 dark:text-gray-300">
      {r.review || "No review"}
    </p>

    {r.review && r.review.length > 60 && (
      <span className="text-emerald-600 text-xs font-semibold hover:underline">
        View Review
      </span>
    )}
  </button>
</td>
                          <td className="px-6 py-4">
                            {r.reported ? (
                              <span className="px-3 py-1 text-xs rounded-full font-extrabold tracking-wide uppercase bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100">
                                Reported
                              </span>
                            ) : (
                              <span className="px-3 py-1 text-xs rounded-full font-extrabold tracking-wide uppercase bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30">
                                Active
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {r.reported ? (
                              <span className="text-amber-600 text-sm font-semibold">Submitted</span>
                            ) : (
                              <button
                                onClick={() => handleReport(r.id)}
                                className="px-4 py-2 text-xs font-bold bg-gray-50 dark:bg-[#1f2937] hover:bg-red-50 dark:bg-red-900/20 text-gray-600 dark:text-gray-300 hover:text-red-600 dark:text-red-400 rounded-2xl transition-all shadow-sm border border-gray-100 dark:border-gray-800 hover:border-red-100"
                              >
                                Report
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
        <ReportReviewModal
  open={reportModalOpen}
  reportReason={reportReason}
  setReportReason={setReportReason}
  onClose={() => {
    setReportModalOpen(false);
    setSelectedRatingId(null);
    setReportReason("");
  }}
  onSubmit={submitReport}
/>



{selectedReview && (
  <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-sm">
    <div
      className="absolute inset-0"
      onClick={() => setSelectedReview(null)}
    />

    <div
      onClick={(e) => e.stopPropagation()}
      className="relative z-[100000] w-full max-w-xl rounded-3xl bg-white dark:bg-[#111827] shadow-2xl"
    >
      <button
        onClick={() => setSelectedReview(null)}
        className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
      >
        ✕
      </button>

      <div className="p-8">

        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Customer Review
        </h2>

        <div className="space-y-4">

          <div>
            <p className="text-xs uppercase font-semibold text-gray-500">
              Booking ID
            </p>

            <p className="font-semibold">
              {selectedReview.bookingId}
            </p>
          </div>

          <div>
            <p className="text-xs uppercase font-semibold text-gray-500">
              Rating
            </p>

            <p className="text-2xl font-bold text-amber-500">
              ⭐ {selectedReview.rating}/5
            </p>
          </div>

          <div>
            <p className="text-xs uppercase font-semibold text-gray-500 mb-2">
              Review
            </p>

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2937] p-5 whitespace-pre-wrap break-words text-gray-700 dark:text-gray-300">
              {selectedReview.review || "No review"}
            </div>
          </div>

        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={() => setSelectedReview(null)}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}