"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/services/api";
import { User, MapPin, CalendarDays, Clock, ArrowLeft, CheckCircle } from "lucide-react";
import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerNavbar from "@/components/CustomerNavbar";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get("serviceId");
  const amount = searchParams.get("amount");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", address: "", date: "", time: "" });

  const handleConfirm = async () => {
    if (!form.name || !form.address || !form.date || !form.time) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const payload = {
        customerId: String(user.id),
        serviceId: String(serviceId),
        vendorId: null,
        bookingDate: form.date,
        bookingTime: form.time,
        address: form.address,
        amount: amount ? parseFloat(amount) : 0,
        status: "PENDING",
        user: user,
      };

      await API.post("/bookings", payload);
      alert("Booking Completed Successfully");
      router.push("/customer/bookings");
    } catch (error: unknown) {
      console.log(error);
      const message = error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
        : undefined;
      alert(message || "Booking Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 py-12">
      <div className="w-full max-w-xl bg-white shadow-md border border-emerald-50 rounded-3xl p-6 sm:p-7 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -z-0 opacity-60"></div>
        <div className="relative z-10">
          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-emerald-900 tracking-tight">Complete Booking</h1>
            <p className="text-sm text-gray-500 mt-1">Fill details to confirm your service</p>
          </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-600">Your Name</span>
            <div className="mt-2 flex items-center gap-3 border border-gray-200 bg-white rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
              <User size={18} className="text-emerald-600" />
              <input type="text" placeholder="Enter your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full outline-none bg-transparent text-sm" />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-600">Address</span>
            <div className="mt-2 flex items-center gap-3 border border-gray-200 bg-white rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
              <MapPin size={18} className="text-emerald-600" />
              <input type="text" placeholder="Enter service address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full outline-none bg-transparent text-sm" />
            </div>
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm font-medium text-gray-600">Date</span>
              <div className="mt-2 flex items-center gap-2 border border-gray-200 bg-white rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
                <CalendarDays size={17} className="text-emerald-600" />
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="w-full outline-none bg-transparent text-sm" />
              </div>
            </label>

            <label className="block">
              <span className="text-sm font-medium text-gray-600">Time</span>
              <div className="mt-2 flex items-center gap-2 border border-gray-200 bg-white rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
                <Clock size={17} className="text-emerald-600" />
                <input type="time" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full outline-none bg-transparent text-sm" />
              </div>
            </label>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-7">
          <button onClick={() => router.back()} className="sm:w-1/2 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold">Cancel</button>
          <button onClick={handleConfirm} disabled={loading} className="sm:w-1/2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold flex items-center justify-center gap-2 shadow-lg shadow-emerald-100 disabled:opacity-60">
            <CheckCircle size={18} /> {loading ? "Booking..." : "Confirm"}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const userName = user.fullName || "Customer";
  const firstLetter = userName.charAt(0).toUpperCase();

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

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <CustomerNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          firstLetter={firstLetter}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Suspense fallback={<div className="h-full flex items-center justify-center text-slate-500">Loading booking form...</div>}>
            <BookingContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}