"use client";

import { useState, useEffect } from "react";
import { AlertCircle, FileText, ImagePlus, X } from "lucide-react";
import CustomerSidebar from "@/components/CustomerSidebar";
import { useSearchParams, useRouter } from "next/navigation";
import API from "@/services/api";
import axios from "axios";

export default function CustomerComplaintsPage() {
  const router = useRouter(); // Added router for back navigation
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({});
  const [image, setImage] = useState<File | null>(null);

  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId") || "";
  
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
      // Fetch booking details
      const bookingRes = await API.get(`/bookings/${bookingId}`);
      const booking = bookingRes.data;

      // JSON payload
      const payload = {
        customerId: user.id,
        vendorId: booking.vendorId,
        bookingId,
        subject,
        message,
        type: "SERVICE_COMPLAINT",
      };

      console.log("Complaint Payload:", payload);

      await axios.post("http://localhost:8080/complaints", payload);

      alert("Complaint Submitted Successfully");

      setSubject("");
      setMessage("");
      setImage(null);
      
      // Optional: Go back to previous page after successful submission
      // router.back();
      
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
       
        <main className="flex-1 overflow-y-auto relative flex items-center justify-center p-4 sm:p-6">
          {/* Blurred Background Effect */}
          <div className="absolute inset-0 bg-white/40 backdrop-blur-md z-0"></div>
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: "2s" }}></div>

          {/* Form Pop (Modal style) - Shorter and Wider */}
          <div className="relative z-10 w-full max-w-2xl bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-emerald-100/50 border border-emerald-50 p-6 sm:p-8 transform transition-all">
            
            {/* Close (X) Icon - Absolutely positioned to the extreme top-right corner */}
            <button
              onClick={() => router.back()} 
              className="absolute top-5 right-5 sm:top-6 sm:right-6 p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              title="Cancel & Go Back"
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            {/* Header */}
            <div className="flex items-center gap-4 mb-6 pr-6">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <AlertCircle size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-emerald-900 tracking-tight">Raise a Complaint</h1>
                <p className="text-sm text-gray-500 mt-0.5">We're here to help resolve your issues.</p>
              </div>
            </div>

            <div className="space-y-4">
              
              {/* Row 1: Booking ID and Subject */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Booking ID</span>
                  <div className="mt-1.5 flex items-center gap-3 border border-gray-200 bg-white rounded-xl px-4 py-2.5">
                    <input
                      type="text"
                      value={bookingId}
                      readOnly
                      className="w-full bg-transparent text-sm border-none outline-none text-gray-500"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="text-sm font-medium text-gray-700">Subject</span>
                  <div className="mt-1.5 flex items-center gap-3 border border-gray-200 bg-white rounded-xl px-4 py-2.5 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
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
              </div>

              {/* Row 2: Message */}
              <label className="block">
                <span className="text-sm font-medium text-gray-700">Message</span>
                <div className="mt-1.5 border border-gray-200 bg-white rounded-xl px-4 py-2 focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                  <textarea
                    rows={2}
                    placeholder="Describe your issue in detail..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full outline-none bg-transparent text-sm resize-none overflow-hidden pt-1"
                  />
                </div>
              </label>

              {/* Row 3: Upload Image */}
              <label className="block">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-gray-700">Upload Image</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">Optional</span>
                </div>

                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-2.5 bg-emerald-50/30 hover:bg-emerald-50 transition-all">
                  {!image ? (
                    <label className="flex items-center justify-center gap-2 cursor-pointer py-2 w-full h-full">
                      <ImagePlus size={20} className="text-emerald-600" />
                      <span className="text-sm font-medium text-gray-700">Click to upload image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            setImage(e.target.files[0]);
                          }
                        }}
                      />
                    </label>
                  ) : (
                    <div className="flex items-center gap-4 px-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-lg border shadow-sm"
                      />
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-semibold text-gray-800 truncate">{image.name}</p>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            setImage(null);
                          }}
                          className="text-[11px] font-bold text-red-500 mt-1 hover:underline cursor-pointer"
                        >
                          Remove Image
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </label>

              {/* Action Buttons: Submit Button */}
              <div className="flex justify-end w-full pt-3">
                <button
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-2.5 rounded-xl text-[14px] font-bold shadow-sm transition-all flex justify-center items-center cursor-pointer"
                >
                  Submit Complaint
                </button>
              </div>
            </div>
            
          </div>
        </main>
      </div>
    </div>
  );
}
