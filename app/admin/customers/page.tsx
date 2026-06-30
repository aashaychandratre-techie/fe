"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { Search, Filter, X, User } from "lucide-react";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Popup State
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8080/api/admin/customers"
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.customers || [];

      setCustomers(data);
    } catch (err) {
      console.log(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    let data = [...customers];

    if (search.trim() !== "") {
      data = data.filter(
        (c) =>
          (c.name || c.fullName || c.customerName || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (c.email || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "ACTIVE") {
      data = data.filter((c) => (c.bookingCount || 0) >= 3);
    } else if (filter === "NEW") {
      data = data.filter((c) => {
        if (!c.createdAt) return false;

        const diff =
          (new Date().getTime() - new Date(c.createdAt).getTime()) /
          (1000 * 60 * 60 * 24);

        return diff <= 7;
      });
    } else if (filter === "INACTIVE") {
      data = data.filter((c) => (c.bookingCount || 0) === 0);
    }

    return data;
  }, [customers, search, filter]);

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col min-h-0 min-w-0 relative">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">

            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
                  Customers Overview
                </h1>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                  Manage platform users and activity
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 dark:text-white transition-all shadow-sm w-full sm:w-64"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none" size={16} />
                  
                  {/* Custom Dropdown Trigger */}
                  <button
                    onClick={() => {
                      const el = document.getElementById("filter-dropdown-menu");
                      if (el) el.classList.toggle("hidden");
                    }}
                    onBlur={(e) => {
                      // Small delay to allow click on option
                      setTimeout(() => {
                        const el = document.getElementById("filter-dropdown-menu");
                        if (el) el.classList.add("hidden");
                      }, 150);
                    }}
                    className="flex items-center justify-between w-full sm:w-[180px] pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-gray-700 dark:text-gray-200 transition-all shadow-sm cursor-pointer"
                  >
                    <span className="font-medium text-left truncate">
                      {filter === "ALL" && "All Customers"}
                      {filter === "ACTIVE" && "Active Elite"}
                      {filter === "NEW" && "New (7 days)"}
                      {filter === "INACTIVE" && "Inactive"}
                      {filter === "NORMAL" && "Normal"}
                    </span>
                    <svg className="w-4 h-4 ml-2 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>

                  {/* Custom Dropdown Menu */}
                  <div id="filter-dropdown-menu" className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                      {[
                        { val: "ALL", label: "All Customers" },
                        { val: "ACTIVE", label: "Active Elite (3+)" },
                        { val: "NEW", label: "New (Last 7 days)" },
                        { val: "INACTIVE", label: "Inactive (0)" },
                        { val: "NORMAL", label: "Normal (1-2)" }
                      ].map(opt => (
                        <div
                          key={opt.val}
                          onClick={() => {
                            setFilter(opt.val);
                            const el = document.getElementById("filter-dropdown-menu");
                            if (el) el.classList.add("hidden");
                          }}
                          className={`px-3 py-2 text-sm rounded-xl cursor-pointer transition-colors ${
                            filter === opt.val 
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 font-semibold" 
                              : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                          }`}
                        >
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto p-1">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-4 font-semibold rounded-tl-2xl">Customer Details</th>
                      <th className="px-6 py-4 font-semibold">Contact Info</th>
                      <th className="px-6 py-4 font-semibold">Activity Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {loading ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading customers...
                          </div>
                        </td>
                      </tr>
                    ) : filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                            <User size={48} className="mb-4 opacity-20" />
                            <p className="text-base font-medium text-gray-900 dark:text-white">No customers found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((c: any, i: number) => (
                        <tr
                          key={c.id || i}
                          className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group cursor-pointer"
                          onClick={() => setSelectedCustomer(c)}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:scale-110 transition-transform">
                                {(c.name || c.fullName || c.customerName || "U")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {c.name || c.fullName || c.customerName || "Unknown User"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                  ID: {c.id ?? "N/A"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-700 dark:text-gray-300">
                                {c.email || "No email"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {c.mobileNumber || c.phone || "No phone"}
                              </p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {(c.bookingCount || 0) >= 3 ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
                                  Active Elite
                                </span>
                              ) : (c.bookingCount || 0) === 0 ? (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
                                  Inactive
                                </span>
                              ) : (
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
                                  Normal
                                </span>
                              )}
                              <span className="text-xs font-medium text-gray-400 dark:text-gray-500">
                                ({c.bookingCount || 0} bookings)
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* CUSTOMER DETAILS POPUP */}
            {selectedCustomer && (
              <div
                className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                onClick={() => setSelectedCustomer(null)}
              >
                <div
                  className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Decorative Banner */}
                  <div className="h-24 bg-gradient-to-r from-emerald-500 to-emerald-700 relative">
                    <button
                      onClick={() => setSelectedCustomer(null)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  {/* Avatar Overflow */}
                  <div className="px-6 pb-6 relative">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#111827] p-1.5 absolute -top-10 shadow-sm border border-gray-100 dark:border-gray-800">
                      <div className="w-full h-full rounded-xl bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center text-3xl text-emerald-600 dark:text-emerald-400 font-bold">
                        {(selectedCustomer.name || selectedCustomer.fullName || selectedCustomer.customerName || "U")[0].toUpperCase()}
                      </div>
                    </div>

                    <div className="pt-12 mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {selectedCustomer.name || selectedCustomer.fullName || selectedCustomer.customerName || "Unknown User"}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Customer Profile</p>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                        <p className="text-xs text-gray-400 dark:text-gray-500">ID: {selectedCustomer.id ?? "-"}</p>
                      </div>
                    </div>

                    {/* Details Grid */}
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
                        <div className="grid grid-cols-2 gap-y-4 text-sm">
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Email Address</p>
                            <p className="font-medium text-gray-900 dark:text-white truncate" title={selectedCustomer.email}>{selectedCustomer.email || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Phone Number</p>
                            <p className="font-medium text-gray-900 dark:text-white">{selectedCustomer.mobileNumber || selectedCustomer.phone || "N/A"}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Total Bookings</p>
                            <p className="font-medium text-gray-900 dark:text-white text-lg">{selectedCustomer.bookingCount || 0}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Joined On</p>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {selectedCustomer.createdAt ? new Date(selectedCustomer.createdAt).toLocaleDateString() : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-6 flex gap-3">
                      <div className="flex-1 flex items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800/50 text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Status: &nbsp;
                        {(selectedCustomer.bookingCount || 0) >= 3 ? (
                          <span className="text-emerald-600 dark:text-emerald-400">Active</span>
                        ) : (selectedCustomer.bookingCount || 0) === 0 ? (
                          <span className="text-red-600 dark:text-red-400">Inactive</span>
                        ) : (
                          <span className="text-amber-600 dark:text-amber-400">Normal</span>
                        )}
                      </div>
                      <button
                        onClick={() => setSelectedCustomer(null)}
                        className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 hover:shadow-lg transition-all"
                      >
                        Done
                      </button>
                    </div>
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