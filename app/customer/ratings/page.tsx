"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/services/api";
import { CheckCircle2, ShieldCheck, Star } from "lucide-react";

function RatingContent() {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [hover, setHover] = useState(0);
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");

  const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : {};

  const submitRating = async () => {
    if (!rating) return alert("Please select rating");
    if (!bookingId) return alert("Booking not found");
    if (!user?.id) return alert("Login required");

    try {
      await API.post("/ratings", { bookingId, customerId: user.id, rating, review });
      alert("Rating submitted successfully");
      router.push("/customer/dashboard");
    } catch (err: unknown) {
      const message = err && typeof err === "object" && "response" in err
        ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      alert(message || "Error submitting rating");
    }
  };

  return (
    <div className="min-h-screen page-shell flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 glass-panel rounded-3xl overflow-hidden">
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-emerald-500 to-emerald-700 text-white p-10">
          <div className="bg-white/20 p-6 rounded-3xl">
            <CheckCircle2 size={72} />
          </div>
          <h2 className="text-2xl font-bold mt-6">Service Completed</h2>
          <p className="text-sm text-emerald-50 mt-2 text-center max-w-xs">Share your experience so future customers can book with more confidence.</p>
          <div className="mt-8 bg-white/15 px-4 py-2 rounded-2xl flex items-center gap-2">
            <ShieldCheck size={18} />
            <span className="text-sm">Secure verified review</span>
          </div>
        </div>

        <div className="p-6 sm:p-8 md:p-12 bg-white/90">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rate Your Experience</h1>
          <p className="text-gray-500 text-sm mt-2">Your feedback helps improve service quality.</p>

          <div className="flex gap-2 mt-8" aria-label="Rating stars">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} onClick={() => setRating(star)} className="transition hover:scale-110" aria-label={`${star} star`}>
                <Star size={38} className={(hover || rating) >= star ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
              </button>
            ))}
          </div>

          <p className="mt-3 text-sm font-medium text-gray-500 min-h-5">
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </p>

          <textarea value={review} onChange={(e) => setReview(e.target.value)} placeholder="Write your detailed feedback..." className="mt-6 w-full h-32 p-4 border border-gray-200 rounded-2xl outline-none focus:ring-2 focus:ring-emerald-100 bg-white resize-none" />

          <button onClick={submitRating} className="w-full mt-6 bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-2xl font-semibold shadow-lg shadow-emerald-100">
            Submit Review
          </button>

          <p className="text-xs text-gray-400 text-center mt-4">We value your feedback and use it to improve service quality.</p>
        </div>
      </div>
    </div>
  );
}

export default function RatingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen page-shell flex items-center justify-center text-slate-500">Loading rating form...</div>}>
      <RatingContent />
    </Suspense>
  );
}