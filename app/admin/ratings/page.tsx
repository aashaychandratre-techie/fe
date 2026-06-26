"use client";

import { useState } from "react";
import API from "@/services/api";

interface Rating {
  id: string;
  customerName?: string;
  rating: number;
  review: string;
  createdAt: string;
}

export default function VendorRatingsPage() {
  const [vendorId, setVendorId] = useState("");
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false); // ⭐ IMPORTANT FIX

  const searchRatings = async () => {
    if (!vendorId.trim()) {
      alert("Please enter Vendor ID");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const response = await API.get(
        `/ratings/vendor/${vendorId.trim()}`
      );

      console.log("Ratings => ", response.data);

      setRatings(response.data);
    } catch (error) {
      console.error(error);
      setRatings([]);
    } finally {
      setLoading(false);
    }
  };

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce((sum, item) => sum + item.rating, 0) /
          ratings.length
        ).toFixed(1)
      : "0.0";

  const fiveStarCount = ratings.filter(
    (r) => r.rating === 5
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* HEADER */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">
        <h1 className="text-3xl font-bold text-slate-900">
          Vendor Ratings 
        </h1>

        <p className="text-slate-500 mt-2">
          Search ratings by Vendor ID
        </p>
      </div>

      {/* SEARCH BOX */}
      <div className="bg-white rounded-2xl shadow-sm border p-6 mb-6">

        <div className="flex gap-3">

          <input
            type="text"
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
            placeholder="Enter Vendor ID"
            className="flex-1 border border-slate-300 rounded-xl px-4 py-3"
          />

          <button
            onClick={searchRatings}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl"
          >
            {loading ? "Searching..." : "Search"}
          </button>

        </div>

      </div>

      {/* STATS */}
      {searched && ratings.length > 0 && (
        <div className="grid md:grid-cols-3 gap-6 mb-6">

          <div className="bg-white p-6 rounded-2xl border">
            <p>Average Rating</p>
            <h2 className="text-4xl font-bold text-yellow-500">
              ⭐ {averageRating}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p>Total Reviews</p>
            <h2 className="text-4xl font-bold text-blue-600">
              {ratings.length}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-2xl border">
            <p>5 Star Reviews</p>
            <h2 className="text-4xl font-bold text-green-600">
              {fiveStarCount}
            </h2>
          </div>

        </div>
      )}
<div className="bg-white rounded-2xl border overflow-hidden">

  <div className="p-5 border-b font-semibold">
    Ratings & Reviews
  </div>

  {loading ? (
    <div className="p-8 text-center">Loading...</div>
  ) : !searched ? (
    <div className="p-8 text-center text-slate-500">
      Enter Vendor ID and click Search
    </div>
  ) : ratings.length === 0 ? (
    <div className="p-8 text-center text-red-500">
      No ratings found for this vendor
    </div>
  ) : (
    <table className="w-full">

      <thead className="bg-slate-100">
        <tr>
          <th className="p-4 text-left">Customer</th>
          <th className="p-4 text-left">Rating</th>
          <th className="p-4 text-left">Review</th>
          <th className="p-4 text-left">Date</th>
        </tr>
      </thead>

      <tbody>
        {ratings.map((rating) => (
        
          <tr
            key={rating.id}
            className="border-t hover:bg-slate-50"
          >
            <td className="p-4 font-medium">
              {rating.customerName || "Unknown Customer"}
            </td>

            <td className="p-4">
              ⭐ {rating.rating}/5
            </td>

            <td className="p-4">
              {rating.review || "-"}
            </td>

            <td className="p-4">
              {rating.createdAt
                ? new Date(rating.createdAt).toLocaleDateString(
                    "en-IN"
                  )
                : "-"}
            </td>
          </tr>
        ))}
      </tbody>

    </table>
  )}

</div>

    </div>
  );
}