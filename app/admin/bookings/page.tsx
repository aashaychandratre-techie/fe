"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, CalendarCheck, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminBookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedVendor, setSelectedVendor] = useState<{ [key: number]: string }>({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBookings();
    fetchVendors();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/admin/bookings");
      setBookings(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async () => {
    try {
      const res = await axios.get("http://localhost:8080/auth/vendor/all");
      setVendors(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const assignVendor = async (bookingId: number) => {
    const vendorId = selectedVendor[bookingId];

    if (!vendorId) {
      alert("Please select a vendor first.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8080/api/admin/assign-vendor/${bookingId}/${vendorId}`
      );
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Failed to assign vendor.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Accepted</span>;
      case "REJECTED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">Rejected</span>;
      case "ASSIGNED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30">Assigned</span>;
      case "COMPLETED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30">Completed</span>;
      case "PENDING":
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">Pending</span>;
    }
  };

  const filteredBookings = bookings.filter((b) =>
    statusFilter === "ALL" ? true : b.status === statusFilter
  );

  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

  const currentBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
                  Bookings Overview
                </h1>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                  Manage service requests and vendor assignments
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none" size={16} />
                  
                  {/* Custom Dropdown Trigger */}
                  <button
                    onClick={() => {
                      const el = document.getElementById("booking-filter-dropdown-menu");
                      if (el) el.classList.toggle("hidden");
                    }}
                    onBlur={(e) => {
                      setTimeout(() => {
                        const el = document.getElementById("booking-filter-dropdown-menu");
                        if (el) el.classList.add("hidden");
                      }, 150);
                    }}
                    className="flex items-center justify-between w-[180px] pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-gray-700 dark:text-gray-200 transition-all shadow-sm cursor-pointer"
                  >
                    <span className="font-medium text-left truncate">
                      {statusFilter === "ALL" && "All Bookings"}
                      {statusFilter === "PENDING" && "Pending"}
                      {statusFilter === "ASSIGNED" && "Assigned"}
                      {statusFilter === "ACCEPTED" && "Accepted"}
                      {statusFilter === "REJECTED" && "Rejected"}
                      {statusFilter === "COMPLETED" && "Completed"}
                    </span>
                    <svg className="w-4 h-4 ml-2 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>

                  {/* Custom Dropdown Menu */}
                  <div id="booking-filter-dropdown-menu" className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                      {[
                        { val: "ALL", label: "All Bookings" },
                        { val: "PENDING", label: "Pending" },
                        { val: "ASSIGNED", label: "Assigned" },
                        { val: "ACCEPTED", label: "Accepted" },
                        { val: "REJECTED", label: "Rejected" },
                        { val: "COMPLETED", label: "Completed" }
                      ].map(opt => (
                        <div
                          key={opt.val}
                          onClick={() => {
                            setStatusFilter(opt.val);
                            setCurrentPage(1);
                            const el = document.getElementById("booking-filter-dropdown-menu");
                            if (el) el.classList.add("hidden");
                          }}
                          className={`px-3 py-2 text-sm rounded-xl cursor-pointer transition-colors ${
                            statusFilter === opt.val 
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
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-4 font-semibold rounded-tl-2xl">Order Details</th>
                      <th className="px-6 py-4 font-semibold">Service Info</th>
                      <th className="px-6 py-4 font-semibold">Location</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold rounded-tr-2xl">Vendor Assignment</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {loading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading bookings...
                          </div>
                        </td>
                      </tr>
                    ) : currentBookings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                            <CalendarCheck size={48} className="mb-4 opacity-20" />
                            <p className="text-base font-medium text-gray-900 dark:text-white">No bookings found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                          
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white">Order #{b.id}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Cust ID: {b.customerId}</p>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white">Svc ID: {b.serviceId}</p>
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{b.amount}</p>
                          </td>

                          <td className="px-6 py-4">
                            <p className="text-sm text-gray-700 dark:text-gray-300 max-w-[200px] truncate" title={b.address}>
                              {b.address || "No address provided"}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            {getStatusBadge(b.status)}
                          </td>

                          <td className="px-6 py-4">
                            {b.status === "PENDING" ? (
                              <div className="flex items-center gap-2">
                                <select
                                  className="w-32 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white text-xs rounded-lg px-2 py-1.5 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                  value={selectedVendor[b.id] || ""}
                                  onChange={(e) =>
                                    setSelectedVendor({
                                      ...selectedVendor,
                                      [b.id]: e.target.value,
                                    })
                                  }
                                >
                                  <option value="">Select Vendor</option>
                                  {vendors.map((v) => (
                                    <option key={v.id} value={v.id}>
                                      {v.name} (ID: {v.id})
                                    </option>
                                  ))}
                                </select>
                                <button
                                  onClick={() => assignVendor(b.id)}
                                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm hover:shadow-md"
                                >
                                  <UserPlus size={12} /> Assign
                                </button>
                              </div>
                           ) : b.vendorId ? (
  <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
    {vendors.find((v) => v.id === b.vendorId)?.name || "Vendor Assigned"}
  </span>
) : (
                              <span className="text-sm text-gray-400 italic">Not Assigned</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white dark:bg-[#111827] px-6 py-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Showing <span className="text-gray-900 dark:text-white font-bold">{currentPage}</span> of <span className="text-gray-900 dark:text-white font-bold">{totalPages}</span> pages
                </span>
                
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className="w-9 h-9 rounded-full flex items-center justify-center border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors text-gray-700 dark:text-gray-300"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
}