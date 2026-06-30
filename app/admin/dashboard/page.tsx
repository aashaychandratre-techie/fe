"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Users,
  UserCheck,
  CalendarCheck,
  IndianRupee,
  Briefcase,
  Flag,
  BarChart3,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";

import API from "@/services/api";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

/* ---------------- STATS CARD ---------------- */

function StatCard({ icon: Icon, label, value, colorClass = "emerald" }: any) {
  return (
    <div className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl bg-${colorClass}-50 dark:bg-${colorClass}-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon size={22} className={`text-${colorClass}-600 dark:text-${colorClass}-400`} />
        </div>
        <span className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">{label}</span>
      </div>
      <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white">
        {value ?? 0}
      </h2>
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-2">Total {label}</p>
    </div>
  );
}

/* ---------------- ACTION CARD ---------------- */

function ActionCard({ icon: Icon, title, onClick, colorClass = "emerald" }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-all duration-300 p-6 flex flex-col items-center justify-center gap-4 group"
    >
      <div className={`w-14 h-14 rounded-full bg-${colorClass}-50 dark:bg-${colorClass}-900/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
        <Icon size={24} className={`text-${colorClass}-600 dark:text-${colorClass}-400`} />
      </div>
      <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {title}
      </h3>
    </button>
  );
}

/* ---------------- MAIN ---------------- */

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [stats, setStats] = useState({
    customers: 0,
    vendors: 0,
    bookings: 0,
    revenue: 0,
  });

  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.log("Stats API error:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col min-h-0 min-w-0 relative">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
                Dashboard Overview
              </h1>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                ServiceSphere Admin Console
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Users}
                label="Customers"
                value={stats.customers}
                colorClass="indigo"
              />

              <StatCard
                icon={UserCheck}
                label="Vendors"
                value={stats.vendors}
                colorClass="emerald"
              />

              <StatCard
                icon={CalendarCheck}
                label="Bookings"
                value={stats.bookings}
                colorClass="blue"
              />

              {/* Revenue Premium Stat */}
              <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white dark:bg-[#111827] opacity-10 rounded-full blur-xl -mt-6 -mr-6 group-hover:scale-150 transition-transform duration-700"></div>
                <div className="flex items-center justify-between mb-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <IndianRupee size={22} className="text-white" />
                  </div>
                  <span className="text-xs font-bold text-emerald-100 uppercase tracking-wider">Revenue</span>
                </div>
                <h2 className="text-4xl font-extrabold relative z-10">₹{stats.revenue.toLocaleString()}</h2>
                <p className="text-sm font-medium text-emerald-50 mt-2 relative z-10">Platform Total Earnings</p>
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <ActionCard
                  icon={Briefcase}
                  title="Manage Services"
                  onClick={() => router.push("/admin/services")}
                  colorClass="blue"
                />

                <ActionCard
                  icon={Flag}
                  title="View Complaints"
                  onClick={() => router.push("/admin/complaints")}
                  colorClass="red"
                />

                <ActionCard
                  icon={BarChart3}
                  title="System Analytics"
                  onClick={() => router.push("/admin/analytics")}
                  colorClass="emerald"
                />

                <ActionCard
                  icon={ShieldCheck}
                  title="Verifications"
                  onClick={() => router.push("/admin/otp")}
                  colorClass="indigo"
                />
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}