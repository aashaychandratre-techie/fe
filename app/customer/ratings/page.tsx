"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/services/api";
import { CheckCircle2, ShieldCheck } from "lucide-react";

export default function RatingPage() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hover, setHover] = useState(0);

  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const submitRating = async () => {
    if (!rating) return alert("Please select rating");
    if (!bookingId) return alert("Booking not found");
    if (!user?.id) return alert("Login required");

    try {
      await API.post("/ratings", {
        bookingId,
        customerId: user.id,
        rating,
        review,
      });

      alert("Rating submitted successfully");
      router.push("/customer/dashboard");
    } catch (err: any) {
      alert(err?.response?.data?.message || "Error submitting rating");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-6">

      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white/70 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden">

        {/* LEFT SIDE */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-green-500 to-emerald-600 text-white p-10">
          <div className="bg-white/20 p-6 rounded-full">
            <CheckCircle2 size={80} />
          </div>

          <h2 className="text-2xl font-bold mt-6">Service Completed</h2>
          <p className="text-sm opacity-80 mt-2 text-center">
            Your booking has been successfully completed. Share your experience.
          </p>

          <div className="mt-8 bg-white/20 px-4 py-2 rounded-xl flex items-center gap-2">
            <ShieldCheck size={18} />
            <span className="text-sm">Secure & Verified Review</span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="p-8 md:p-12">

          <h1 className="text-2xl font-bold text-gray-800">
            Rate Your Experience ⭐
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Your feedback helps improve service quality
          </p>

          {/* STARS */}
          <div className="flex gap-2 mt-8">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
                className="text-4xl transition transform hover:scale-110"
              >
                <span
                  className={
                    (hover || rating) >= star
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }
                >
                  ★
                </span>
              </button>
            ))}
          </div>

          <p className="mt-2 text-sm text-gray-500">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>

          {/* REVIEW BOX */}
          <div className="mt-6">
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Write your detailed feedback..."
              className="w-full h-32 p-4 border rounded-2xl outline-none focus:ring-2 focus:ring-blue-400 bg-white"
            />
          </div>
<button
  onClick={submitRating}
  className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-semibold shadow-lg transition"
>
  Submit Review
</button>

          {/* FOOTER NOTE */}
          <p className="text-xs text-gray-400 text-center mt-4">
            We value your feedback and use it to improve service quality
          </p>

        </div>
      </div>
    </div>
  );
}