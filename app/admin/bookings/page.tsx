"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Filter, CalendarCheck, Star, User, CheckCircle2, 
  MapPin, Calendar, Briefcase, Phone, Clock, Users, X, IndianRupee 
} from "lucide-react";
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
        // इथे आपण booking.serviceName पाठवत आहोत जेणेकरून त्याच सर्व्हिसचे वेंडर्स येतील
        if (booking.status === "PENDING") {
          fetchVendors(booking.id, booking.serviceName);
        }
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVendors = async (bookingId: string, serviceName: string) => {
    try {
      let res = await axios.get(
        `http://localhost:8080/auth/vendor/service/${encodeURIComponent(serviceName || "")}`
      );

      // Fallback: If no vendors are found for this specific service name, 
      // fetch all vendors so the admin can still assign someone.
      if (!res.data || res.data.length === 0) {
        const allRes = await axios.get(`http://localhost:8080/api/admin/vendors`);
        res.data = allRes.data.filter((v: any) => v.status === "APPROVED");
      }

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
      
      const assignedVendor = vendors[bookingId]?.find((v: any) => v.id === vendorId);
      
      setSelectedBooking((prev: any) => ({
        ...prev,
        status: "ASSIGNED",
        providerName: assignedVendor ? assignedVendor.name : prev.providerName
      }));
      
      fetchBookings();
    } catch (error) {
      console.error(error);
      alert("Failed to assign vendor.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">
            ACCEPTED
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">
            REJECTED
          </span>
        );
      case "ASSIGNED":
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/30">
            ASSIGNED
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-800/30">
            COMPLETED
          </span>
        );
      case "PENDING":
      default:
        return (
          <span className="px-2.5 py-1 rounded-md text-[11px] uppercase tracking-wider font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
            PENDING
          </span>
        );
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>
        <div className="md:hidden">
          <AdminNavbar setSidebarOpen={setSidebarOpen} />
        </div>

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-6">
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 mb-1.5">
                  Bookings Overview
                </h1>
                <p className="text-sm font-medium text-gray-500">
                  Manage service requests and partner assignments
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Filter
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none"
                    size={16}
                  />
                  <button
                    onClick={() => {
                      const el = document.getElementById(
                        "booking-filter-dropdown-menu"
                      );
                      if (el) el.classList.toggle("hidden");
                    }}
                    onBlur={(e) => {
                      setTimeout(() => {
                        const el = document.getElementById(
                          "booking-filter-dropdown-menu"
                        );
                        if (el) el.classList.add("hidden");
                      }, 150);
                    }}
                    className="flex items-center justify-between w-[180px] pl-10 pr-4 py-2.5 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#111827] shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 dark:text-gray-200 transition-all cursor-pointer font-medium"
                  >
                    <span className="text-left truncate">
                      {statusFilter === "ALL" && "All Bookings"}
                      {statusFilter === "PENDING" && "Pending"}
                      {statusFilter === "ASSIGNED" && "Assigned"}
                      {statusFilter === "ACCEPTED" && "Accepted"}
                      {statusFilter === "REJECTED" && "Rejected"}
                      {statusFilter === "COMPLETED" && "Completed"}
                    </span>
                    <svg
                      className="w-4 h-4 ml-2 text-gray-400 shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  <div
                    id="booking-filter-dropdown-menu"
                    className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                  >
                    <div className="p-1">
                      {[
                        { val: "ALL", label: "All Bookings" },
                        { val: "PENDING", label: "Pending" },
                        { val: "ASSIGNED", label: "Assigned" },
                        { val: "ACCEPTED", label: "Accepted" },
                        { val: "REJECTED", label: "Rejected" },
                        { val: "COMPLETED", label: "Completed" },
                      ].map((opt) => (
                        <div
                          key={opt.val}
                          onClick={() => {
                            setStatusFilter(opt.val);
                            setCurrentPage(1);
                            const el = document.getElementById(
                              "booking-filter-dropdown-menu"
                            );
                            if (el) el.classList.add("hidden");
                          }}
                          className={`px-3 py-2 text-sm rounded-lg cursor-pointer transition-colors ${
                            statusFilter === opt.val
                              ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white font-semibold"
                              : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white"
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

            {/* PREMIUM TABLE CONTAINER */}
            <div className="flex flex-col">
              <div className="bg-white dark:bg-[#0B1120] rounded-t-2xl shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="w-full overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[900px]">
                    <thead>
                      <tr className="bg-gray-50/80 dark:bg-[#111827] text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800 text-xs uppercase tracking-wider font-semibold">
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Service Info</th>
                        <th className="px-6 py-4">Schedule</th>
                        <th className="px-6 py-4">Location</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800/60 text-sm">
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                            <div className="flex justify-center items-center gap-3">
                              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                              <span className="font-medium">Loading bookings...</span>
                            </div>
                          </td>
                        </tr>
                      ) : currentBookings.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-6 py-16 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                              <CalendarCheck size={40} className="mb-4 opacity-20" />
                              <p className="text-base font-semibold text-gray-900 dark:text-white">
                                No bookings found
                              </p>
                              <p className="text-sm mt-1">Try adjusting your filters</p>
                            </div>
                          </td>
                        </tr>
                      ) : (
                        currentBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50/80 dark:hover:bg-gray-800/40 transition-colors group">
                            
                            {/* Customer (Fixed Layout) */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col justify-center">
                                <p className="font-semibold text-gray-900 dark:text-white leading-tight">{b.customerName || "Customer Name"}</p>
                              
                              </div>
                            </td>

                            {/* Service Info */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <p className="font-semibold text-gray-900 dark:text-white">{b.serviceName}</p>
                              <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 text-xs font-bold border border-emerald-100 dark:border-emerald-800/30">
                                <IndianRupee size={10} /> {b.amount}
                              </div>
                            </td>

                            {/* Schedule */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex flex-col gap-1.5">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 text-sm">
                                  <Calendar size={14} className="text-gray-400" />
                                  <span className="font-medium">{b.bookingDate}</span>
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-xs">
                                  <Clock size={14} className="text-gray-400" />
                                  <span>{b.bookingTime}</span>
                                </div>
                              </div>
                            </td>

                            {/* Location */}
                            <td className="px-6 py-4">
                              <div className="flex items-start gap-2 max-w-[220px]">
                                <MapPin size={16} className="text-gray-400 shrink-0 mt-0.5" />
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-snug" title={b.address}>
                                  {b.address || "Address not provided"}
                                </p>
                              </div>
                            </td>

                            {/* Status */}
                            <td className="px-6 py-4 whitespace-nowrap">
                              {getStatusBadge(b.status)}
                            </td>

                            {/* Action - SMALL CLEAN MANAGE BUTTON */}
                            <td className="px-6 py-4 whitespace-nowrap text-right">
                              <button
                                onClick={() => {
                                  setSelectedBooking(b);
                                  setShowModal(true);
                                }}
                                className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all focus:outline-none"
                              >
                                Manage
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* PREMIUM PAGINATION */}
              <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#0B1120] border border-t-0 border-gray-200 dark:border-gray-800 rounded-b-2xl shadow-sm">
                <p className="text-sm text-gray-500 font-medium">
                  Showing page <span className="font-bold text-gray-900 dark:text-white">{currentPage}</span> of{" "}
                  <span className="font-bold text-gray-900 dark:text-white">{totalPages || 1}</span>
                </p>
                <div className="flex items-center gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                      currentPage === 1 
                      ? "border-gray-100 dark:border-gray-800 text-gray-400 bg-gray-50 dark:bg-[#111827]/50 cursor-not-allowed" 
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages || totalPages === 0}
                    onClick={() => setCurrentPage((p) => p + 1)}
                    className={`px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${
                      currentPage === totalPages || totalPages === 0
                      ? "border-gray-100 dark:border-gray-800 text-gray-400 bg-gray-50 dark:bg-[#111827]/50 cursor-not-allowed" 
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* INDUSTRY LEVEL 2-COLUMN MODAL */}
      {showModal && selectedBooking && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-6 transition-all duration-300 ease-in-out">
          <div className="bg-white dark:bg-[#0B1120] rounded-2xl shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col relative overflow-hidden border border-gray-200 dark:border-gray-800">
            
            {/* Modal Header */}
            <div className="px-6 py-4 flex justify-between items-start border-b border-gray-100 dark:border-gray-800/60 bg-white dark:bg-[#0B1120] sticky top-0 z-20">
              <div className="flex flex-col gap-1.5 mr-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white shrink-0">
                    Booking Details
                  </h2>
                  {getStatusBadge(selectedBooking.status)}
                </div>
                {/* FULL BOOKING ID SHOWING HERE CLEARLY */}
                <p className="text-sm font-mono text-gray-500 dark:text-gray-400 break-all">
                  Booking ID: {selectedBooking.id}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 shrink-0 mt-1 sm:mt-0"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content - Split Layout */}
            <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
              
              {/* LEFT COLUMN - All Booking Details */}
              <div className="w-full lg:w-1/2 p-6 overflow-y-auto border-r border-gray-100 dark:border-gray-800/60 bg-gray-50/50 dark:bg-transparent">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Customer Information</h3>
                
                <div className="bg-white dark:bg-[#111827] rounded-xl p-5 border border-gray-100 dark:border-gray-800 mb-6 shadow-sm">
                   <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                         <User size={24} />
                      </div>
                      <div>
                         <h4 className="font-bold text-lg text-gray-900 dark:text-white">{selectedBooking.customerName || "Customer Name"}</h4>
                         
                      </div>
                   </div>
                   
                   <div className="pt-4 border-t border-gray-100 dark:border-gray-800">
                      <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><MapPin size={14}/> Service Location</p>
                      <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed">
                        {selectedBooking.address || "Address not provided by customer"}
                      </p>
                   </div>
                </div>

                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Service Details</h3>
                
                <div className="bg-white dark:bg-[#111827] rounded-xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden mb-6">
                   <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                         <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                            <Briefcase size={20} />
                         </div>
                         <div>
                            <h4 className="font-bold text-gray-900 dark:text-white">{selectedBooking.serviceName}</h4>
                            <p className="text-xs text-gray-500 mt-0.5">Standard Service Package</p>
                         </div>
                      </div>
                      <div className="text-right">
                         <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                         <p className="font-bold text-xl text-gray-900 dark:text-white">₹{selectedBooking.amount}</p>
                      </div>
                   </div>
                   
                   <div className="p-5 bg-gray-50/50 dark:bg-gray-800/20 grid grid-cols-2 gap-4">
                      <div>
                         <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Calendar size={14} /> Scheduled Date</p>
                         <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.bookingDate}</p>
                      </div>
                      <div>
                         <p className="text-xs text-gray-500 font-medium mb-1 flex items-center gap-1"><Clock size={14} /> Scheduled Time</p>
                         <p className="font-semibold text-gray-900 dark:text-white">{selectedBooking.bookingTime}</p>
                      </div>
                   </div><div className="border-t border-gray-200 dark:border-gray-700 p-5">
  <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
    Additional Services
  </h4>

  {selectedBooking.additionalServices?.length > 0 ? (
    <div className="space-y-2">
      {selectedBooking.additionalServices.map((item: any) => (
        <div
          key={item.id}
          className="flex justify-between items-center rounded-lg border border-gray-200 dark:border-gray-700 p-3"
        >
          <span>{item.name}</span>
          <span className="font-semibold text-emerald-600">
            ₹{item.price}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <p className="text-sm text-gray-500">
      No additional services selected.
    </p>
  )}
</div>
                </div>
                
              </div>

              {/* RIGHT COLUMN - Vendor Assignment */}
              <div className="w-full lg:w-1/2 p-0 flex flex-col bg-white dark:bg-[#0B1120] relative">
                {selectedBooking.status === "PENDING" ? (
                   <>
                     <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0B1120] z-10">
                       <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                         <Users size={20} className="text-blue-500" />
                         Assign Professional
                       </h3>
                       <p className="text-sm text-gray-500 mt-1">Select an available partner from the list below.</p>
                     </div>
                     
                     <div className="p-6 overflow-y-auto flex-1 bg-gray-50/30 dark:bg-transparent">
                       <div className="flex flex-col gap-3">
                          {(vendors[selectedBooking.id] || []).length === 0 ? (
                            <div className="text-center py-12 px-4 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-white dark:bg-transparent">
                              <MapPin size={32} className="mx-auto text-gray-400 mb-3" />
                              <h4 className="font-semibold text-gray-900 dark:text-white">No professionals nearby</h4>
                              <p className="text-sm text-gray-500 mt-1">There are currently no available partners near this location.</p>
                            </div>
                          ) : (
                            (vendors[selectedBooking.id] || []).map((v: any) => {
                              const isSelected = selectedVendor[selectedBooking.id] === v.id;
                              return (
                                <div
                                  key={v.id}
                                  onClick={() => setSelectedVendor({ ...selectedVendor, [selectedBooking.id]: v.id })}
                                  className={`group relative flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 border-2 ${
                                    isSelected 
                                    ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-500/10 shadow-sm' 
                                    : 'border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-[#111827]'
                                  }`}
                                >
                                  <div className="relative shrink-0">
                                     <img 
                                       src={`https://api.dicebear.com/7.x/notionists/svg?seed=${v.name}&backgroundColor=e2e8f0`} 
                                       alt="avatar" 
                                       className="w-12 h-12 rounded-full border border-gray-200 dark:border-gray-700 bg-white"
                                     />
                                     {isSelected && (
                                       <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white p-0.5 rounded-full border-2 border-white dark:border-[#111827]">
                                          <CheckCircle2 size={12} />
                                       </div>
                                     )}
                                  </div>
                                  
                                  <div className="flex-1">
                                     <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-gray-900 dark:text-white">{v.name}</h4>
                                        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.5 rounded text-xs font-bold">
                                           <Star size={12} className="fill-amber-500 text-amber-500" />
                                           <span>{v.rating || (Math.random() * (5.0 - 4.0) + 4.0).toFixed(1)}</span>
                                        </div>
                                     </div>
                                     
                                     <div className="flex items-center gap-4 mt-2 text-xs font-medium text-gray-500">
                                        <span className="flex items-center gap-1">
                                           <MapPin size={12} className="text-gray-400" />
                                           {v.location || `${(Math.random() * 5 + 1).toFixed(1)} km away`}
                                        </span>
                                        <span className="flex items-center gap-1">
                                           <CheckCircle2 size={12} className="text-emerald-500" />
                                           {v.completedJobs || Math.floor(Math.random() * 300 + 20)} jobs done
                                        </span>
                                     </div>
                                  </div>
                                </div>
                              );
                            })
                          )}
                       </div>
                     </div>

                     <div className="p-6 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-[#0B1120] sticky bottom-0 z-10">
                        <button
                          disabled={!selectedVendor[selectedBooking.id]}
                          onClick={() => {
                            assignVendor(selectedBooking.id);
                            setShowModal(false);
                          }}
                          className={`w-full py-3.5 rounded-xl font-bold transition-all duration-200 flex justify-center items-center gap-2 ${
                            selectedVendor[selectedBooking.id]
                              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed"
                          }`}
                        >
                          Confirm & Dispatch Partner
                        </button>
                     </div>
                   </>
                ) : (
                   <div className="flex flex-col items-center justify-center h-full p-8 text-center bg-gray-50/50 dark:bg-transparent">
                      {selectedBooking.providerName ? (
                         <>
                           <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-500 mb-6 ring-8 ring-emerald-50 dark:ring-emerald-900/10">
                              <CheckCircle2 size={40} />
                           </div>
                           <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Partner Assigned</h3>
                           <p className="text-gray-500 mb-8 max-w-sm">This booking has been successfully assigned and the professional has been notified.</p>
                           
                           <div className="bg-white dark:bg-[#111827] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 w-full max-w-sm shadow-sm text-left">
                              <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-3">Assigned To</p>
                              <div className="flex items-center gap-4">
                                 <img 
                                   src={`https://api.dicebear.com/7.x/notionists/svg?seed=${selectedBooking.providerName}&backgroundColor=e2e8f0`} 
                                   alt="avatar" 
                                   className="w-14 h-14 rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50"
                                 />
                                 <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white text-lg">{selectedBooking.providerName}</h4>
                                    <p className="text-emerald-600 text-sm font-medium flex items-center gap-1 mt-0.5">
                                       <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                                       Active & Confirmed
                                    </p>
                                 </div>
                              </div>
                           </div>
                         </>
                      ) : (
                         <>
                           <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-500 mb-6">
                              <Clock size={40} />
                           </div>
                           <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Booking Status</h3>
                           <p className="text-gray-500">Current status is <span className="font-bold text-gray-700 dark:text-gray-300">{selectedBooking.status}</span>. No vendor assigned yet.</p>
                         </>
                      )}
                   </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}