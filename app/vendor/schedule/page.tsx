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
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#0b1220] dark:to-[#0a0f1a] text-[14px]">

      <VendorSidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col overflow-hidden">

        <VendorNavbar setOpen={setOpen} />

        <div className="flex-1 overflow-y-auto p-6 md:p-8">

          {/* HEADER */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">

            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Schedule
              </h1>
              <p className="text-gray-500 mt-1">
                Manage bookings & daily workflow
              </p>
            </div>

            {/* Availability Toggle */}
            <button
              onClick={() => setAvailable(!available)}
              className={`relative w-44 h-11 rounded-full transition-all duration-300 font-medium shadow-md
              ${available ? "bg-emerald-500" : "bg-red-500"}`}
            >
              <div
                className={`absolute top-1 left-1 w-9 h-9 bg-white rounded-full shadow transition-all duration-300
                ${available ? "translate-x-0" : "translate-x-32"}`}
              />

              <span className="text-white text-sm">
                {available ? "Available" : "Unavailable"}
              </span>
            </button>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">

            <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] shadow-md border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Appointments</p>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {schedules.length}
                  </h2>
                </div>
                <CalendarDays className="text-emerald-500" />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#111827] shadow-md border border-gray-100 dark:border-gray-800">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-gray-500">Completed</p>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {completedCount}
                  </h2>
                </div>
                <CheckCircle2 className="text-emerald-500" />
              </div>
            </div>

          </div>

          {/* SCHEDULE SECTION */}
          <div className="bg-white dark:bg-[#111827] rounded-2xl shadow-md border border-gray-100 dark:border-gray-800 p-6">

            <div className="mb-5">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Today’s Bookings
              </h2>
              <p className="text-gray-500 text-sm">
                Customer details & schedule timeline
              </p>
            </div>

            <div className="space-y-4">

              {schedules.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No schedules available
                </p>
              ) : (
                schedules.map((item: any) => (
                  <div
                    key={item.id}
                    className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#0f172a] hover:shadow-md transition"
                  >

                    {/* TOP ROW */}
                    <div className="flex items-center justify-between mb-4">

                      <div className="flex items-center gap-3">
                        {item.status === "COMPLETED" ? (
                          <CheckCircle2 className="text-emerald-500" />
                        ) : (
                          <Activity className="text-amber-500" />
                        )}

                        {/* ❌ Booking ID removed from UI */}
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Service Booking
                        </h3>
                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium
                        ${
                          item.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <User size={16} />
                        <span>{item.customerName || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Phone size={16} />
                        <span>{item.customerMobile || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Calendar size={16} />
                        <span>{item.bookingDate || "N/A"}</span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <Clock size={16} />
                        <span>{item.bookingTime || "N/A"}</span>
                      </div>

                    </div>

                  </div>
                ))
              )}

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}