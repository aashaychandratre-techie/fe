"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";

import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/admin/analytics");
        setData(res.data);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        No data found
      </div>
    );
  }

  const Card = ({ title, value, color }: any) => (
    <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm hover:shadow-md transition">
      <p className="text-xs text-gray-500">{title}</p>
      <h2 className={`text-2xl font-bold mt-1 ${color || "text-gray-800"}`}>
        {value}
      </h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">

      {/* SIDEBAR (fixed) */}
      <div className="fixed top-0 left-0 h-full w-64 z-50">
        <AdminSidebar />
      </div>

      {/* MAIN AREA (shifted right) */}
      <div className="ml-64 flex flex-col min-h-screen">

        {/* NAVBAR */}
        <AdminNavbar />

        {/* CONTENT */}
        <div className="max-w-6xl mx-auto px-6 py-8 w-full">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-emerald-600">
              Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Overview of platform performance & growth
            </p>
          </div>

          {/* MAIN STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

            <Card title="Total Users" value={data.totalUsers} />
            <Card title="Total Vendors" value={data.totalVendors} />
            <Card title="Total Bookings" value={data.totalBookings} />
            <Card
              title="Revenue"
              value={`₹${data.revenue}`}
              color="text-emerald-600"
            />

          </div>

          {/* SECONDARY STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-5 mt-6">

            <Card title="Completed" value={data.completedBookings} color="text-emerald-600" />
            <Card title="Pending" value={data.pendingBookings} color="text-amber-500" />
            <Card title="Accepted" value={data.acceptedBookings} />
            <Card title="In Progress" value={data.inProgressBookings} />
            <Card title="Cancelled" value={data.cancelledBookings} color="text-red-500" />

          </div>

        </div>
      </div>
    </div>
  );
}