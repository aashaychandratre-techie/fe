"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, FileText, Hash, X } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ComplaintModal({ isOpen, onClose }: Props) {
  const [bookingId, setBookingId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    if (isOpen) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) setUser(JSON.parse(storedUser));
      
      // Prevent body scrolling when modal is open
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSubmit = async () => {
    if (!bookingId || !subject || !message) {
      alert("Please fill all fields");
      return;
    }

    try {
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
      onClose(); // Close modal on success
    } catch (err) {
      console.log(err);
      alert("Failed to submit complaint");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 font-sans">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/30 backdrop-blur-md transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-900/20 border border-emerald-50 p-6 sm:p-8 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <X size={18} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-emerald-900 tracking-tight">Raise a Complaint</h1>
            <p className="text-sm text-gray-500 mt-1">We're here to help resolve your issues.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Booking ID</span>
            <div className="mt-1.5 flex items-center gap-3 border border-gray-200 bg-white rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <Hash size={18} className="text-gray-400" />
              <input
                type="number"
                placeholder="Enter Booking ID"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                className="w-full outline-none bg-transparent text-sm"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Subject</span>
            <div className="mt-1.5 flex items-center gap-3 border border-gray-200 bg-white rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <FileText size={18} className="text-gray-400" />
              <input
                type="text"
                placeholder="Enter complaint subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full outline-none bg-transparent text-sm"
              />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Message</span>
            <div className="mt-1.5 border border-gray-200 bg-white rounded-2xl p-4 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
              <textarea
                placeholder="Describe your issue in detail..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full h-24 outline-none bg-transparent text-sm resize-none"
              />
            </div>
          </label>

          <button
            onClick={handleSubmit}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 mt-2 flex justify-center items-center gap-2"
          >
            Submit Complaint
          </button>
        </div>
      </div>
    </div>
  );
}
