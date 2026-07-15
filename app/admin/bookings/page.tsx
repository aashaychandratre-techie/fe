"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Search, Filter, CalendarCheck, UserPlus } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminBookingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookings, setBookings] = useState<any[]>([]);
  const [vendors, setVendors] = useState<{ [key: string]: any[] }>({});
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<{ [key: string]: string }>({});
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/api/admin/bookings");
      setBookings(res.data);

      res.data.forEach((booking: any) => {
  fetchVendors(booking.id);
});
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 const fetchVendors = async (bookingId: string) => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/admin/eligible-vendors/${bookingId}`
    );

    setVendors((prev) => ({
  ...prev,
  [bookingId]: res.data,
}));
  } catch (error) {
    console.error(error);
  }
};

  const assignVendor = async (bookingId: string) => {
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
        <div className="md:hidden">
        <AdminNavbar setSidebarOpen={setSidebarOpen} />
        </div>

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
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
              <div className="w-full">
                <table className="w-full table-fixed text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                   <th className="w-[22%] px-6 py-4">Order Details</th>
                      <th className="w-[10%] px-6 py-4">Service</th>

                  <th className="w-[16%] px-6 py-4">Schedule</th>

                  <th className="w-[26%] px-6 py-4">Location</th>

                   <th className="w-[10%] px-6 py-4">Status</th>

                       <th className="w-[18%] px-6 py-4">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {loading ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading bookings...
                          </div>
                        </td>
                      </tr>
                    ) : currentBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-16 text-center">
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
  <p
    className="font-bold text-gray-900 dark:text-white truncate"
    title={b.id}
  >
    {b.id}
  </p>

  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
    Customer: {b.customerName || "N/A"}
  </p>
</td>

                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 dark:text-white">{b.serviceName}</p>
                            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">₹{b.amount}</p>
                          </td>
                           <td className="px-6 py-4 min-w-[190px]">
                           <div className="flex flex-col"><span className="font-semibold text-gray-900 dark:text-white"> 📅 {b.bookingDate} </span>

                         <span className="text-sm text-gray-500 dark:text-gray-400 mt-1  whitespace-nowrap"> 🕒 {b.bookingTime}</span> </div></td>

                          <td className="px-6 py-4">
                           <p className="text-sm text-gray-700 dark:text-gray-300 break-words" title={b.address}>
                              {b.address || "No address provided"}
                            </p>
                          </td>

                          <td className="px-6 py-4">
                            {getStatusBadge(b.status)}
                          </td>

                          <td className="px-6 py-4">
  <button
    onClick={() => {
      setSelectedBooking(b);
      setShowModal(true);
    }}
    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-sm font-semibold transition"
  >
    View Details
  </button>
</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
           <div className="flex items-center justify-between px-6 py-5 border-t border-gray-200 dark:border-gray-700">
           <p className="text-sm text-gray-500">
          Showing <span className="font-semibold">{currentPage}</span> of{" "}
         <span className="font-semibold">{totalPages || 1}</span> pages
         </p>
         <div className="flex items-center gap-2">
         <button
         disabled={currentPage === 1}
         onClick={() => setCurrentPage((p) => p - 1)}
         className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
         currentPage === 1
          ? "opacity-40 cursor-not-allowed"
          : "hover:bg-emerald-50"
        }`}
        >
           ←
        </button>

        <button
        disabled={currentPage === totalPages || totalPages === 0}
        onClick={() => setCurrentPage((p) => p + 1)}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition ${
                currentPage === totalPages || totalPages === 0
                ? "opacity-40 cursor-not-allowed"
                : "hover:bg-emerald-50"
                }`}
                >
                →
        </button>
        </div>
        </div>
        </div>
        {showModal && selectedBooking && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">

    <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-3xl mx-4 overflow-hidden">

      {/* Header */}

      <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">

        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Booking Details
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Booking ID : {selectedBooking.id}
          </p>
        </div>

        <button
          onClick={() => setShowModal(false)}
          className="text-gray-500 hover:text-red-500 text-3xl"
        >
          ×
        </button>

      </div>

      {/* Body */}

      <div className="p-8 space-y-8">

        <div className="grid grid-cols-2 gap-6">

          <div>

            <h3 className="font-semibold text-gray-500 mb-2">
              Customer
            </h3>

            <p className="font-bold text-lg">
              {selectedBooking.customerName}
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-gray-500 mb-2">
              Service
            </h3>

            <p className="font-bold text-lg">
              {selectedBooking.serviceName}
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-gray-500 mb-2">
              Booking Date
            </h3>

            <p className="font-semibold">
              📅 {selectedBooking.bookingDate}
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-gray-500 mb-2">
              Booking Time
            </h3>

            <p className="font-semibold">
              🕒 {selectedBooking.bookingTime}
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-gray-500 mb-2">
              Amount
            </h3>

            <p className="font-bold text-emerald-600 text-lg">
              ₹{selectedBooking.amount}
            </p>

          </div>

          <div>

            <h3 className="font-semibold text-gray-500 mb-2">
              Status
            </h3>

            {getStatusBadge(selectedBooking.status)}

          </div>

        </div>

        {/* Address */}

        <div>

          <h3 className="font-semibold text-gray-500 mb-2">
            Address
          </h3>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-xl p-4">
            {selectedBooking.address}
          </div>

        </div>

        {/* Vendor Assign */}

        {selectedBooking.status === "PENDING" && (

          <div className="border-t pt-6">

            <h3 className="font-bold text-lg mb-4">
              Assign Vendor
            </h3>

            <div className="flex gap-4">

              <select
                className="flex-1 border rounded-xl p-3 bg-white dark:bg-gray-900"
                value={selectedVendor[selectedBooking.id] || ""}
                onChange={(e) =>
                  setSelectedVendor({
                    ...selectedVendor,
                    [selectedBooking.id]: e.target.value,
                  })
                }
              >

                <option value="">Select Vendor</option>

                {(vendors[selectedBooking.id] || []).map((v: any) => (

                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>

                ))}

              </select>

              <button
                onClick={() => {
                  assignVendor(selectedBooking.id);
                  setShowModal(false);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 rounded-xl font-semibold"
              >
                Assign Vendor
              </button>

            </div>

          </div>

        )}

        {selectedBooking.providerName && (

          <div className="border-t pt-6">

            <h3 className="font-semibold text-gray-500 mb-2">
              Assigned Vendor
            </h3>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 rounded-xl p-4">

              <p className="font-bold text-emerald-700">
                {selectedBooking.providerName}
              </p>

            </div>

          </div>

        )}

      </div>

    </div>

  </div>
)}</main>
      </div>
    </div>
  );
}