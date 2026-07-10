"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, FileText, } from "lucide-react";
import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerNavbar from "@/components/CustomerNavbar";

export default function CustomerComplaintsPage() {
  const [bookingId, setBookingId] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const userName = user.fullName || "Customer";
  const firstLetter = userName.charAt(0).toUpperCase();

 const handleSubmit = async () => {
  if (!bookingId || !subject || !message) {
    alert("Please fill all fields");
    return;
  }

  try {
    // Get booking details first
    const bookingRes = await axios.get(
      `http://localhost:8080/bookings/${bookingId}`
    );

    const booking = bookingRes.data;

    await axios.post("http://localhost:8080/complaints", {
      customerId: user.id,
      vendorId: booking.vendorId,
      bookingId:  bookingId,
      subject,
      message,
      type: "SERVICE_COMPLAINT",
    });

    alert("Complaint Submitted Successfully");

    setBookingId("");
    setSubject("");
    setMessage("");

  } catch (err) {
    console.error(err);
    alert("Failed to submit complaint");
  }
};
  return (
    <div
      className={`min-h-screen flex font-sans ${
        darkMode ? "bg-[#071A12] text-white" : "bg-[#F3FBF6] text-gray-900"
      }`}
    >
      <CustomerSidebar
        darkMode={darkMode}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <CustomerNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          firstLetter={firstLetter}
        />

        <main className="flex-1 overflow-y-auto relative flex items-center justify-center p-4 sm:p-6">
          {/* Blurred Background Effect */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "2s" }}></div>

          {/* Form Pop (Modal style) */}
          <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-100/50 border border-emerald-50 p-8 sm:p-10 transform transition-all">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <AlertCircle size={24} />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">Raise a Complaint</h1>
                <p className="text-sm text-gray-500 mt-1">We're here to help resolve your issues.</p>
              </div>
            </div>

            <div className="space-y-5">
             <label className="block">
  <span className="text-sm font-medium text-gray-700">
    Booking ID
  </span>

  <div className="mt-2 flex items-center gap-3 border border-gray-200 bg-white rounded-2xl px-4 py-3 transition-all">
    <input
      type="text"
      inputMode="numeric"
      placeholder="Enter Booking ID"
      value={bookingId}
      onChange={(e) => setBookingId(e.target.value)}
      className="w-full bg-transparent text-sm border-none outline-none focus:outline-none"
    />
  </div>
</label>

              <label className="block">
                <span className="text-sm font-medium text-gray-700">Subject</span>
                <div className="mt-2 flex items-center gap-3 border border-gray-200 bg-white rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
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
                <div className="mt-2 border border-gray-200 bg-white rounded-2xl p-4 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                  <textarea
                    placeholder="Describe your issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full h-28 outline-none bg-transparent text-sm resize-none"
                  />
                </div>
              </label>

              <button
                onClick={handleSubmit}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all duration-300 mt-4 flex justify-center items-center gap-2"
              >
                Submit Complaint
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}