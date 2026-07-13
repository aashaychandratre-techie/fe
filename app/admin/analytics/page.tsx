"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import { 
  Users, 
  Briefcase, 
  CalendarCheck, 
  IndianRupee, 
  CheckCircle2, 
  AlertCircle, 
  ThumbsUp, 
  Clock, 
  XCircle,
  BarChart3
} from "lucide-react";

import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AnalyticsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/admin/analytics");
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, iconColorClass }: any) => (
    <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 relative overflow-hidden group">
      <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl transition-colors ${bgClass}`}></div>
      <div className="flex items-center gap-4 relative z-10">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconColorClass}`}>
          <Icon size={26} strokeWidth={2.5} />
        </div>
        <div>
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
          <h3 className={`text-3xl font-black mt-1 ${colorClass || "text-gray-900 dark:text-white"}`}>
            {value}
          </h3>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col min-h-0 min-w-0 relative">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

       <div className="md:hidden">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />
       </div>
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5 flex items-center gap-3">
                  <BarChart3 className="text-emerald-600" size={32} />
                  Analytics Overview
                </h1>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                  Comprehensive platform performance and growth metrics
                </p>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 dark:text-gray-400 font-medium">Loading metrics...</p>
                </div>
              </div>
            ) : !data ? (
              <div className="flex items-center justify-center h-64 bg-white/50 dark:bg-[#111827]/50 rounded-3xl border border-gray-100 dark:border-gray-800">
                <p className="text-gray-500 dark:text-gray-400 font-medium">No analytics data found.</p>
              </div>
            ) : (
              <div className="space-y-10">
                
                {/* PRIMARY METRICS */}
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 px-1">Primary Metrics</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard 
                      title="Total Users" 
                      value={data.totalUsers} 
                      icon={Users}
                      bgClass="bg-blue-100/50 dark:bg-blue-900/20 group-hover:bg-blue-200/50"
                      iconColorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    />
                    <StatCard 
                      title="Total Vendors" 
                      value={data.totalVendors} 
                      icon={Briefcase}
                      bgClass="bg-purple-100/50 dark:bg-purple-900/20 group-hover:bg-purple-200/50"
                      iconColorClass="bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
                    />
                    <StatCard 
                      title="Total Bookings" 
                      value={data.totalBookings} 
                      icon={CalendarCheck}
                      bgClass="bg-indigo-100/50 dark:bg-indigo-900/20 group-hover:bg-indigo-200/50"
                      iconColorClass="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    />
                    <StatCard 
                      title="Total Revenue" 
                      value={`₹${data.revenue}`} 
                      icon={IndianRupee}
                      colorClass="text-emerald-600 dark:text-emerald-400"
                      bgClass="bg-emerald-100/50 dark:bg-emerald-900/20 group-hover:bg-emerald-200/50"
                      iconColorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                </div>

                {/* BOOKING LIFECYCLE METRICS */}
                <div>
                  <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-4 px-1">Booking Lifecycle</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    <StatCard 
                      title="Completed" 
                      value={data.completedBookings} 
                      icon={CheckCircle2}
                      colorClass="text-emerald-600 dark:text-emerald-400"
                      bgClass="bg-emerald-100/50 dark:bg-emerald-900/20 group-hover:bg-emerald-200/50"
                      iconColorClass="bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400"
                    />
                    <StatCard 
                      title="Pending" 
                      value={data.pendingBookings} 
                      icon={AlertCircle}
                      colorClass="text-amber-500 dark:text-amber-400"
                      bgClass="bg-amber-100/50 dark:bg-amber-900/20 group-hover:bg-amber-200/50"
                      iconColorClass="bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400"
                    />
                    <StatCard 
                      title="Accepted" 
                      value={data.acceptedBookings} 
                      icon={ThumbsUp}
                      colorClass="text-blue-600 dark:text-blue-400"
                      bgClass="bg-blue-100/50 dark:bg-blue-900/20 group-hover:bg-blue-200/50"
                      iconColorClass="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    />
                    <StatCard 
                      title="In Progress" 
                      value={data.inProgressBookings} 
                      icon={Clock}
                      colorClass="text-indigo-600 dark:text-indigo-400"
                      bgClass="bg-indigo-100/50 dark:bg-indigo-900/20 group-hover:bg-indigo-200/50"
                      iconColorClass="bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                    />
                    <StatCard 
                      title="Cancelled" 
                      value={data.cancelledBookings} 
                      icon={XCircle}
                      colorClass="text-red-500 dark:text-red-400"
                      bgClass="bg-red-100/50 dark:bg-red-900/20 group-hover:bg-red-200/50"
                      iconColorClass="bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400"
                    />
                  </div>
                </div>

              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}