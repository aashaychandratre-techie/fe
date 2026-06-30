"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";

import {
  CalendarDays,
  CheckCircle2,
  Activity,
  Phone,
  User,
  Calendar,
  Clock,
} from "lucide-react";

export default function SchedulePage() {
  const [open, setOpen] = useState(false);
  const [available, setAvailable] = useState(true);
  const [schedules, setSchedules] = useState<any[]>([]);

  useEffect(() => {
    fetchSchedules();
  }, []);

  const fetchSchedules = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) return;

      const res = await axios.get(
        `http://localhost:8080/vendor/requests/${vendorId}`
      );

      const filtered = res.data.filter(
        (item: any) =>
          item.status === "ACCEPTED" || item.status === "COMPLETED"
      );

      setSchedules(filtered);
    } catch (err) {
      console.log(err);
    }
  };

  const completedCount = schedules.filter(
    (item: any) => item.status === "COMPLETED"
  ).length;

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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
                  Schedule
                </h1>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                  Manage your daily workflow and bookings.
                </p>
              </div>

              {/* Availability Toggle */}
              <button
                onClick={() => setAvailable(!available)}
                className={`relative w-44 h-12 rounded-full transition-all duration-300 font-bold shadow-sm border
                ${available ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200" : "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200"}`}
              >
                <div
                  className={`absolute top-1 left-1 w-10 h-10 rounded-full shadow-sm transition-all duration-300 flex items-center justify-center
                  ${available ? "bg-emerald-500 translate-x-0" : "bg-red-500 translate-x-[128px]"}`}
                >
                  <div className="w-3 h-3 bg-white dark:bg-[#111827] rounded-full shadow-sm"></div>
                </div>

                <span className={`text-sm absolute top-1/2 -translate-y-1/2 transition-all duration-300 ${available ? "right-5" : "left-5"}`}>
                  {available ? "Available" : "Offline"}
                </span>
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CalendarDays size={22} className="text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Appointments</span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{schedules.length}</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Total Bookings</p>
              </div>

              <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <CheckCircle2 size={22} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Completed</span>
                </div>
                <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">{completedCount}</h2>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-2">Finished Services</p>
              </div>
            </div>

            {/* SCHEDULE SECTION */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 p-6 md:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">Today’s Bookings</h2>
                  <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm font-medium mt-1">Customer details & timeline</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center border border-emerald-100 dark:border-emerald-900/30">
                  <Clock className="text-emerald-500" size={18} />
                </div>
              </div>

              <div className="space-y-4">
                {schedules.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 dark:bg-[#1f2937] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium text-lg">No schedules available today.</p>
                  </div>
                ) : (
                  schedules.map((item: any) => (
                    <div
                      key={item.id}
                      className="p-5 md:p-6 rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#111827] hover:border-emerald-200 hover:shadow-md transition-all duration-300 group flex flex-col md:flex-row md:items-center gap-6"
                    >
                      {/* STATUS MARKER */}
                      <div className="flex items-center gap-4 min-w-[200px]">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${item.status === "COMPLETED" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-900/20 text-amber-500"}`}>
                          {item.status === "COMPLETED" ? <CheckCircle2 size={24} /> : <Activity size={24} />}
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg break-words group-hover:text-emerald-700 dark:text-emerald-400 transition-colors">
                            Service Booking
                          </h3>
                          <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wide border ${item.status === "COMPLETED" ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-900/30" : "bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 border-amber-100"}`}>
                            {item.status}
                          </span>
                        </div>
                      </div>

                      {/* DETAILS GRID */}
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50/80 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800/50">
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                            <User size={14} className="text-gray-400 dark:text-gray-500" />
                          </div>
                          <span>{item.customerName || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                            <Phone size={14} className="text-gray-400 dark:text-gray-500" />
                          </div>
                          <span>{item.customerMobile || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                            <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                          </div>
                          <span>{item.bookingDate || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-medium text-gray-600 dark:text-gray-300">
                          <div className="w-8 h-8 rounded-full bg-white dark:bg-[#111827] flex items-center justify-center shadow-sm border border-gray-100 dark:border-gray-800">
                            <Clock size={14} className="text-gray-400 dark:text-gray-500" />
                          </div>
                          <span>{item.bookingTime || "N/A"}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}