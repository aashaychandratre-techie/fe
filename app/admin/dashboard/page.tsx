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
} from "lucide-react";

import API from "@/services/api";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

/* ---------------- STATS CARD ---------------- */

function StatCard({ icon: Icon, label, value }: any) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 px-5 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>

          <h2 className="text-2xl font-bold text-slate-900 mt-1">
            {value ?? 0}
          </h2>
        </div>

        <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center">
          <Icon size={20} className="text-emerald-600" />
        </div>
      </div>
    </div>
  );
}

/* ---------------- ACTION CARD ---------------- */

function ActionCard({ icon: Icon, title, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200 px-5 py-6 flex flex-col items-center justify-center gap-3"
    >
      <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
        <Icon size={22} className="text-emerald-600" />
      </div>

      <h3 className="text-sm font-semibold text-slate-700">
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
    <div className="min-h-screen bg-slate-100 flex">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col lg:ml-64">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="p-5 lg:p-8">

          {/* Stats */}
          <section className="max-w-6xl">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

              <StatCard
                icon={Users}
                label="Customers"
                value={stats.customers}
              />

              <StatCard
                icon={UserCheck}
                label="Vendors"
                value={stats.vendors}
              />

              <StatCard
                icon={CalendarCheck}
                label="Bookings"
                value={stats.bookings}
              />

              <StatCard
                icon={IndianRupee}
                label="Revenue"
                value={`₹${stats.revenue}`}
              />

            </div>
          </section>

          {/* Quick Actions */}
          <section className="max-w-6xl mt-10">

            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-slate-900">
                Quick Actions
              </h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

              <ActionCard
                icon={Briefcase}
                title="Services"
                onClick={() => router.push("/admin/services")}
              />

              <ActionCard
                icon={Flag}
                title="Complaints"
                onClick={() => router.push("/admin/complaints")}
              />

              <ActionCard
                icon={BarChart3}
                title="Analytics"
                onClick={() => router.push("/admin/analytics")}
              />

              <ActionCard
                icon={ShieldCheck}
                title="Verifications"
                onClick={() => router.push("/admin/otp")}
              />

            </div>

          </section>

        </main>
      </div>
    </div>
  );
}