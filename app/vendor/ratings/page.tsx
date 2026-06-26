"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";

interface Rating {
  id: string;
  bookingId: string;
  rating: number;
  review: string;
  reported?: boolean;
}

export default function VendorRatingsPage() {
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);

  const [open, setOpen] = useState(false);

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

  const handleReport = async (id: string) => {
    const ok = confirm("Report this review?");
    if (!ok) return;

    try {
      await API.post(`/ratings/report/${id}`);

      setRatings((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, reported: true } : r
        )
      );
    } catch (err) {
      alert("Failed to report");
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
    <div className="flex h-screen bg-[#F9FAFB]">

      {/* SIDEBAR */}
      <VendorSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* NAVBAR */}
        <VendorNavbar setOpen={setOpen} />

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
               Ratings
            </h1>
            <p className="text-gray-500">
              Monitor customer feedback and improve service quality
            </p>
          </div>

          {/* KPI CARDS (SMALL) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

            <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition">
              <p className="text-xs text-gray-500">Average Rating</p>
              <h2 className="text-2xl font-bold mt-1 text-gray-900">
                {avg}
              </h2>
              <p className="text-emerald-500 mt-1 text-xs font-medium">
                ⭐ Rating Score
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition">
              <p className="text-xs text-gray-500">Total Reviews</p>
              <h2 className="text-2xl font-bold mt-1 text-gray-900">
                {ratings.length}
              </h2>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition">
              <p className="text-xs text-gray-500">Satisfaction Rate</p>
              <h2 className="text-2xl font-bold mt-1 text-emerald-600">
                {satisfaction}%
              </h2>
            </div>

          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">

            {/* HEADER */}
            <div className="p-5 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                Customer Reviews
              </h2>
            </div>

            {/* LOADING */}
            {loading ? (
              <div className="p-6 text-gray-500">Loading...</div>
            ) : ratings.length === 0 ? (
              <div className="p-6 text-gray-500 text-center">
                No ratings yet
              </div>
            ) : (
              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="p-4">Booking</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4">Review</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ratings.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-gray-50 transition">

                        <td className="p-4 font-medium text-gray-700">
                          #{r.bookingId}
                        </td>

                        <td className="p-4 text-gray-700">
                          ⭐ {r.rating}/5
                        </td>

                        <td className="p-4 text-gray-600 max-w-[300px] truncate">
                          {r.review || "No review"}
                        </td>

                        <td className="p-4">
                          {r.reported ? (
                            <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-600">
                              Reported
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs rounded-full bg-emerald-100 text-emerald-600">
                              Active
                            </span>
                          )}
                        </td>

                        <td className="p-4">
                          {r.reported ? (
                            <span className="text-red-600 text-sm font-medium">
                              Flagged
                            </span>
                          ) : (
                            <button
                              onClick={() => handleReport(r.id)}
                              className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition"
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
      </div>
    </div>
  );
}