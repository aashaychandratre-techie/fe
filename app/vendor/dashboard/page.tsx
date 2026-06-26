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
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <VendorSidebar open={open} setOpen={setOpen} />
      <div className="flex flex-1 flex-col min-h-0">

        <VendorNavbar setOpen={setOpen} />

        <main className="flex-1 overflow-y-auto">

          <div className="max-w-7xl mx-auto p-4 md:p-6">

            {/* HEADER */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome Back 👋
              </h1>
              <p className="text-sm text-gray-500">
                ServiceSphere Vendor Overview
              </p>
            </div>

            {/* STATS */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

  <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <ClipboardList size={22} className="text-emerald-600" />
      <span className="text-xs text-gray-400">Requests</span>
    </div>

    <h2 className="text-3xl font-bold text-gray-900 mt-3">
      {totalRequests}
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Total Requests
    </p>
  </div>

  <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <Wrench size={22} className="text-emerald-600" />
      <span className="text-xs text-gray-400">Active</span>
    </div>

    <h2 className="text-3xl font-bold text-gray-900 mt-3">
      {activeServices}
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Active Services
    </p>
  </div>

  <div className="bg-white rounded-3xl border border-gray-100 p-4 shadow-sm">
    <div className="flex items-center justify-between">
      <IndianRupee size={22} className="text-emerald-600" />
      <span className="text-xs text-gray-400">Revenue</span>
    </div>

    <h2 className="text-3xl font-bold text-gray-900 mt-3">
      ₹{totalEarnings.toLocaleString()}
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Total Earnings
    </p>
  </div>

  <div className="bg-emerald-600 rounded-3xl p-4 text-white shadow-sm">
    <div className="flex items-center justify-between">
      <TrendingUp size={22} />
      <span className="text-xs text-emerald-100">
        Growth
      </span>
    </div>

    <h2 className="text-3xl font-bold mt-3">
      +{monthlyGrowth}%
    </h2>

    <p className="text-sm text-emerald-100 mt-1">
      Monthly Growth
    </p>
  </div>

</div>
            {/* GRID */}
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* SCHEDULE */}
             <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
  <h3 className="text-lg font-semibold mb-4 text-gray-900">
    Today’s Schedule
  </h3>

  <div className="space-y-4">
    {todaySchedule.length === 0 ? (
      <p className="text-sm text-gray-500">No schedule for today</p>
    ) : (
      todaySchedule.map((item: any, index: number) => (
        <div key={item.id} className="flex gap-4 relative">

          {index !== todaySchedule.length - 1 && (
            <div className="absolute left-3 top-6 w-[2px] h-full bg-emerald-100"></div>
          )}

          <div className="relative z-10 mt-1">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center ${
                item.status === "COMPLETED"
                  ? "bg-emerald-600"
                  : "bg-emerald-400"
              }`}
            >
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
          </div>

          <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 w-full">

            <p className="font-medium text-gray-900">
              {item.serviceName}
            </p>

            <p className="text-xs text-gray-500">
              📅 {item.bookingDate}
            </p>

            <p className="text-xs text-gray-500">
              🕒 {item.bookingTime || "No time"}
            </p>

            <p className="text-xs text-gray-500">
              📍 {item.address}
            </p>

          </div>

        </div>
      ))
    )}
  </div>
</div>

              {/* REQUESTS */}
              <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5">

                <h3 className="text-lg font-semibold mb-4 text-gray-900">
                  New Booking Requests
                </h3>

                <div className="space-y-4">

                  {newRequests.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No new requests
                    </p>
                  ) : (
                    newRequests.map((req: any) => (
                      <div
                        key={req.id}
                        className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex justify-between"
                      >
                        <div>
                          <p className="font-medium text-gray-900">
                            🛠 {req.serviceName}
                          </p>
                          <p className="text-xs text-gray-500">
                            {req.customerName} • ₹{req.amount}
                          </p>
                          <p className="text-xs text-gray-400">
                            {req.address}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">

                          <span className="text-xs px-2 py-1 rounded-full bg-yellow-50 text-yellow-700">
                            {req.status}
                          </span>

                          <div className="flex gap-2">
                            <button
                              onClick={() => acceptRequest(req.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-xs rounded-lg"
                            >
                              Accept
                            </button>

                            <button
                              onClick={() => rejectRequest(req.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded-lg"
                            >
                              Reject
                            </button>
                          </div>

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