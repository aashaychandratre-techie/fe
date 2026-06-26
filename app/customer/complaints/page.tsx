"use client";

import { useState } from "react";
import axios from "axios";

export default function CustomerComplaintsPage() {
  const [bookingId, setBookingId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {
    if (!bookingId || !subject || !message) {
      alert("Please fill all fields");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      await axios.post("http://localhost:8080/complaints", {
        customerId: user.id,
        bookingId: Number(bookingId),
        subject,
        message,
      });

      alert("Complaint Submitted Successfully");

      setBookingId("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.log(err);
      alert("Failed to submit complaint");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-3">
      
      {/* 🔥 SMALLER CARD (ZOOM OUT EFFECT) */}
      <div className="w-[420px] bg-white rounded-2xl shadow-lg p-5 scale-95">

        {/* TITLE */}
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Raise Complaint
        </h1>

        <p className="text-sm text-gray-500 mb-5">
          Submit your complaint regarding any booking
        </p>

        {/* BOOKING ID */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Booking ID
          </label>

          <input
            type="number"
            placeholder="Enter Booking ID"
            value={bookingId}
            onChange={(e) => setBookingId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* SUBJECT */}
        <div className="mb-4">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Subject
          </label>

          <input
            type="text"
            placeholder="Enter complaint subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* MESSAGE */}
        <div className="mb-5">
          <label className="block mb-1 text-sm font-semibold text-gray-700">
            Complaint Message
          </label>

          <textarea
            placeholder="Describe your issue..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-xl outline-none h-32 resize-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
         className="w-full bg-emerald-600 hover:bg-emerald-500 transition text-white py-3 rounded-xl font-semibold text-base"
        >
          Submit Complaint
        </button>
      </div>
    </div>
  );
}