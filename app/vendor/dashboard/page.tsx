"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import {
  IndianRupee,
  ClipboardList,
  Wrench,
  TrendingUp,
} from "lucide-react";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  const [totalRequests, setTotalRequests] = useState(0);
  const [activeServices, setActiveServices] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [monthlyGrowth, setMonthlyGrowth] = useState(18);

  const [newRequests, setNewRequests] = useState<any[]>([]);
  const [todaySchedule, setTodaySchedule] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
    fetchNewRequests();
    fetchTodaySchedule();
  }, []);

  const getVendorId = () =>
    typeof window !== "undefined" ? localStorage.getItem("vendorId") : null;

  // ================= DASHBOARD =================
  const fetchDashboardData = async () => {
    try {
      const vendorId = getVendorId();
      if (!vendorId) return;

      const res = await axios.get(
        `http://localhost:8080/vendor/requests/${vendorId}`
      );

      const requests = res.data || [];

      setTotalRequests(requests.length);

      const active = requests.filter((i: any) => i.status === "ACCEPTED");
      setActiveServices(active.length);

      const completed = requests.filter(
        (i: any) => i.status === "COMPLETED"
      );

      const earnings = completed.reduce(
        (sum: number, i: any) => sum + (i.amount || 0),
        0
      );

      setTotalEarnings(earnings);

      if (earnings > 0) setMonthlyGrowth(25);
    } catch (err) {
      console.log(err);
    }
  };

  // ================= NEW REQUESTS =================
  const fetchNewRequests = async () => {
    try {
      const vendorId = getVendorId();
      if (!vendorId) return;

      const res = await axios.get(
        `http://localhost:8080/auth/vendor/requests/${vendorId}`
      );

      setNewRequests(
        (res.data || []).filter((r: any) => r.status === "ASSIGNED")
      );
    } catch (err) {
      console.log(err);
    }
  };

  // ================= SCHEDULE =================
  const fetchTodaySchedule = async () => {
  try {
    const vendorId = getVendorId();
    if (!vendorId) return;

    const res = await axios.get(
      `http://localhost:8080/vendor/requests/${vendorId}`
    );

    const today = new Date().toISOString().split("T")[0];

    setTodaySchedule(
      (res.data || []).filter(
        (i: any) =>
          (i.status === "ACCEPTED" || i.status === "COMPLETED") &&
          i.bookingDate === today
      )
    );
  } catch (err) {
    console.log(err);
  }
};

  // ================= ACTIONS =================
  const acceptRequest = async (id: number) => {
    await axios.put(`http://localhost:8080/vendor/accept/${id}`);
    fetchNewRequests();
    fetchDashboardData();
    fetchTodaySchedule();
  };

  const rejectRequest = async (id: number) => {
    await axios.put(`http://localhost:8080/vendor/reject/${id}`);
    fetchNewRequests();
    fetchDashboardData();
  };

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      <VendorSidebar open={open} setOpen={setOpen} />
      <div className="flex flex-1 flex-col min-h-0 min-w-0 relative overflow-hidden">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <VendorNavbar setOpen={setOpen} />

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">

            {/* HEADER */}
            <div>
              <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
                Dashboard Overview
              </h1>
            </div>

            {/* STATS */}
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">

  {/* Total Requests */}
  <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">
          Total Requests
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          {totalRequests}
        </h2>
      </div>

      <div className="p-2 lg:p-3 bg-emerald-100 rounded-xl lg:rounded-2xl text-emerald-600">
        <ClipboardList className="w-4 h-4 lg:w-6 lg:h-6" />
      </div>
    </div>
  </div>

  {/* Active Services */}
  <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">
          Active Services
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          {activeServices}
        </h2>
      </div>

      <div className="p-2 lg:p-3 bg-green-100 rounded-xl lg:rounded-2xl text-green-600">
        <Wrench className="w-4 h-4 lg:w-6 lg:h-6" />
      </div>
    </div>
  </div>

  {/* Pending Requests */}
  <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">
          Pending Requests
        </p>

        <h2 className="text-3xl font-bold text-gray-900">
          {newRequests.length}
        </h2>
      </div>

      <div className="p-2 lg:p-3 bg-orange-100 rounded-xl lg:rounded-2xl text-orange-600">
        <ClipboardList className="w-4 h-4 lg:w-6 lg:h-6" />
      </div>
    </div>
  </div>

  {/* Total Earnings */}
  <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>

    <div className="flex justify-between items-start">
      <div>
        <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">
          Total Earnings
        </p>

        <h2 className="text-3xl font-bold text-emerald-600">
          ₹{totalEarnings.toLocaleString()}
        </h2>
      </div>

      <div className="p-2 lg:p-3 bg-emerald-100 rounded-xl lg:rounded-2xl text-emerald-600">
        <IndianRupee className="w-4 h-4 lg:w-6 lg:h-6" />
      </div>
    </div>
  </div>

</div>

            {/* GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* SCHEDULE */}
              <div className="bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Today’s Schedule</h3>

                <div className="space-y-6">
                  {todaySchedule.length === 0 ? (
                    <div className="text-center py-10 bg-gray-50 dark:bg-[#1f2937] rounded-2xl">
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">No scheduled services today.</p>
                    </div>
                  ) : (
                    todaySchedule.map((item: any, index: number) => (
                      <div key={item.id} className="flex gap-4 relative group">
                        {index !== todaySchedule.length - 1 && (
                          <div className="absolute left-3.5 top-8 w-[2px] h-full bg-emerald-100 group-hover:bg-emerald-300 transition-colors"></div>
                        )}

                        <div className="relative z-10 mt-1">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${item.status === "COMPLETED" ? "bg-emerald-500" : "bg-emerald-400"}`}>
                            <div className="w-2 h-2 bg-white dark:bg-[#111827] rounded-full"></div>
                          </div>
                        </div>

                        <div className="bg-gray-50/80 dark:bg-gray-800/50 hover:bg-emerald-50/30 border border-gray-100 dark:border-gray-800 hover:border-emerald-100 dark:border-emerald-900/30 transition-all rounded-2xl p-4 w-full shadow-sm">
                          <p className="font-bold text-gray-900 dark:text-white text-base">{item.serviceName}</p>
                          <div className="mt-3 space-y-1.5">
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2">
                              <span className="text-lg">📅</span> {item.bookingDate}
                            </p>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2">
                              <span className="text-lg">🕒</span> {item.bookingTime || "No time specified"}
                            </p>
                            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center gap-2">
                              <span className="text-lg">📍</span> {item.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* REQUESTS */}
              <div className="lg:col-span-2 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">New Booking Requests</h3>
                  <span className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-100 dark:border-emerald-900/30">
                    {newRequests.length} Pending
                  </span>
                </div>

                <div className="space-y-4">
                  {newRequests.length === 0 ? (
                    <div className="text-center py-16 bg-gray-50 dark:bg-[#1f2937] rounded-2xl border border-dashed border-gray-200 dark:border-gray-700">
                      <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium text-sm">You're all caught up! No new requests.</p>
                    </div>
                  ) : (
                    newRequests.map((req: any) => (
                      <div key={req.id} className="p-5 rounded-3xl bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 hover:border-emerald-200 hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 uppercase tracking-wider border border-amber-100/50">
                              {req.status}
                            </span>
                            <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-lg">
                              ₹{req.amount}
                            </span>
                          </div>
                          <p className="font-extrabold text-gray-900 dark:text-white text-lg mt-2 mb-1">{req.serviceName}</p>
                          <div className="space-y-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">👤 {req.customerName}</p>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500">📍 {req.address}</p>
                          </div>
                        </div>

                        <div className="flex sm:flex-col gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                          <button
                            onClick={() => acceptRequest(req.id)}
                            className="flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 text-sm rounded-2xl shadow-sm hover:shadow-md transition-all"
                          >
                            Accept Job
                          </button>
                          <button
                            onClick={() => rejectRequest(req.id)}
                            className="flex-1 sm:flex-none bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 dark:text-red-400 font-bold px-6 py-2.5 text-sm rounded-2xl transition-all"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}