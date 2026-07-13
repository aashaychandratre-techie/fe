"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";
import { Search, Filter, X, Store, Star } from "lucide-react";

export default function AdminVendorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  // popup
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [modalType, setModalType] = useState<"DETAIL" | "RATINGS" | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [selectedVendorRatings, setSelectedVendorRatings] = useState<any[]>(
    []
  );

  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/auth/vendor/all");
      setVendors(res.data || []);
    } catch (err) {
      console.log(err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };
  const approveVendor = async (vendorId: string) => {
  try {
    await axios.put(
      `http://localhost:8080/api/admin/approve-vendor/${vendorId}`
    );

    // Status update hone ke baad list dubara load hogi
    fetchVendors();
  } catch (err) {
    console.log(err);
    alert("Failed to approve vendor");
  }
};
const rejectVendor = async (vendorId: string) => {
  try {
    await axios.put(
      `http://localhost:8080/api/admin/reject-vendor/${vendorId}`
    );

    fetchVendors();
  } catch (err) {
    console.log(err);
    alert("Failed to reject vendor");
  }
};
const blockVendor = async (vendorId: string) => {
  try {
    await axios.put(
      `http://localhost:8080/api/admin/block-vendor/${vendorId}`
    );

    fetchVendors();
  } catch (err) {
    console.log(err);
    alert("Failed to block vendor");
  }
};

  const filteredVendors = useMemo(() => {
    let data = [...vendors];

    if (search.trim()) {
      data = data.filter(
        (v) =>
          v.name?.toLowerCase().includes(search.toLowerCase()) ||
          v.email?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (statusFilter !== "ALL") {
      data = data.filter((v) => (v.status || "PENDING") === statusFilter);
    }

    return data;
  }, [vendors, search, statusFilter]);

  const totalPages = Math.ceil(filteredVendors.length / rowsPerPage);

  const currentData = filteredVendors.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // 👉 NAME CLICK (DETAILS)
  const openVendorDetails = (vendor: any) => {
    setSelectedVendor(vendor);
    setModalType("DETAIL");
    setShowVendorModal(true);
  };

  // 👉 RATING CLICK (ONLY RATINGS)
  const openVendorRatings = async (vendor: any) => {
    setSelectedVendor(vendor);
    setModalType("RATINGS");
    setShowVendorModal(true);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/ratings/vendor/${vendor.id}`
      );
      setSelectedVendorRatings(res.data || []);
    } catch (err) {
      console.log(err);
      setSelectedVendorRatings([]);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Approved</span>;
      case "REJECTED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">Rejected</span>;
      case "BLOCKED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-200 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700">Blocked</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">Pending</span>;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 flex-col min-h-0 min-w-0 relative">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
                  Vendors Overview
                </h1>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                  Manage service providers and approvals
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search vendors..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-gray-900 dark:text-white transition-all shadow-sm w-full sm:w-64"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none" size={16} />
                  
                  {/* Custom Dropdown Trigger */}
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center justify-between w-full sm:w-[160px] pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-gray-700 dark:text-gray-200 transition-all shadow-sm cursor-pointer"
                  >
                    <span className="font-medium text-left truncate">
                      {statusFilter === "ALL" && "All Status"}
                      {statusFilter === "PENDING" && "Pending"}
                      {statusFilter === "APPROVED" && "Approved"}
                      {statusFilter === "REJECTED" && "Rejected"}
                      {statusFilter === "BLOCKED" && "Blocked"}
                    </span>
                    <svg className="w-4 h-4 ml-2 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>

                  {/* Custom Dropdown Menu */}
                 {filterOpen && (
                 <div
                 className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                 >
                    <div className="p-1">
                      {[
                        { val: "ALL", label: "All Status" },
                        { val: "PENDING", label: "Pending" },
                        { val: "APPROVED", label: "Approved" },
                        { val: "REJECTED", label: "Rejected" },
                        { val: "BLOCKED", label: "Blocked" }
                      ].map(opt => (
                        <div
                          key={opt.val}
                          onClick={() => {
                          setStatusFilter(opt.val);
                          setCurrentPage(1);
                          setFilterOpen(false);
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
                  )}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto p-1">
                <table className="w-full text-sm text-left whitespace-nowrap">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-4 font-semibold rounded-tl-2xl">Vendor Details</th>
                      <th className="px-6 py-4 font-semibold">Contact Info</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold rounded-tr-2xl">Ratings</th>
                      <th className="px-6 py-4 font-semibold text-center">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading vendors...
                          </div>
                        </td>
                      </tr>
                    ) : currentData.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                            <Store size={48} className="mb-4 opacity-20" />
                            <p className="text-base font-medium text-gray-900 dark:text-white">No vendors found</p>
                            <p className="text-sm mt-1">Try adjusting your search or filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      currentData.map((v) => (
                        <tr key={v.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group cursor-pointer">
                          
                          {/* NAME */}
                          <td
                            className="px-6 py-4"
                            onClick={() => openVendorDetails(v)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold group-hover:scale-110 transition-transform">
                                {(v.name || "V")[0].toUpperCase()}
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                  {v.name || "Unknown"}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 hover:underline">
                                  View Details
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* CONTACT */}
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <p className="font-medium text-gray-700 dark:text-gray-300">
                                {v.email || "No email"}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {v.phone || "No phone"}
                              </p>
                            </div>
                          </td>

                          {/* STATUS */}
                          <td className="px-6 py-4">
                            {getStatusBadge(v.status || "PENDING")}
                          </td>

                          {/* RATINGS */}
                          <td
                            className="px-6 py-4"
                            onClick={() => openVendorRatings(v)}
                          >
                            <div className="flex items-center gap-2 group/rating hover:bg-white dark:hover:bg-[#1f2937] px-3 py-1.5 rounded-full border border-transparent hover:border-gray-200 dark:hover:border-gray-700 hover:shadow-sm w-fit transition-all">
                              <Star size={16} className={v.averageRating ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-gray-600"} />
                              <span className="font-bold text-gray-800 dark:text-gray-200">
                                {v.averageRating ? Number(v.averageRating).toFixed(1) : "0.0"}
                              </span>
                            </div>
                          </td>
                         <td className="px-6 py-4 text-center">
  {/* Pending */}
  {v.status === "PENDING" && (
    <div className="flex justify-center gap-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          approveVendor(v.id);
        }}
        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
      >
        Approve
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          rejectVendor(v.id);
        }}
        className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold"
      >
        Reject
      </button>
    </div>
  )}

  {/* Approved */}
  {v.status === "APPROVED" && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        blockVendor(v.id);
      }}
      className="px-3 py-1 bg-gray-700 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold"
    >
      Block
    </button>
  )}

  {/* Rejected */}
  {v.status === "REJECTED" && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        approveVendor(v.id);
      }}
      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
    >
      Approve
    </button>
  )}

  {/* Blocked */}
  {v.status === "BLOCKED" && (
    <button
      onClick={(e) => {
        e.stopPropagation();
        approveVendor(v.id);
      }}
      className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold"
    >
      Unblock
    </button>
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
)}    
            {/* MODALS */}
            {showVendorModal && selectedVendor && modalType && (
              <div
                className="fixed inset-0 bg-gray-900/40 dark:bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4"
                onClick={() => setShowVendorModal(false)}
              >
                <div
                  className="bg-white dark:bg-[#111827] rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Decorative Banner */}
                  <div className={`h-24 relative ${modalType === "DETAIL" ? "bg-gradient-to-r from-emerald-500 to-emerald-700" : "bg-gradient-to-r from-amber-400 to-amber-600"}`}>
                    <button
                      onClick={() => setShowVendorModal(false)}
                      className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                  <div className="px-6 pb-6 relative">
                    <div className="w-20 h-20 rounded-2xl bg-white dark:bg-[#111827] p-1.5 absolute -top-10 shadow-sm border border-gray-100 dark:border-gray-800">
                      <div className={`w-full h-full rounded-xl flex items-center justify-center text-3xl font-bold ${modalType === "DETAIL" ? "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" : "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"}`}>
                        {modalType === "DETAIL" ? (selectedVendor.name || "V")[0].toUpperCase() : <Star className="fill-current" size={32} />}
                      </div>
                    </div>
                    <div className="pt-12 mb-6">
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {modalType === "DETAIL" ? (selectedVendor.name || "Vendor Details") : `${selectedVendor.name}'s Ratings`}
                      </h2>
                      <div className="flex items-center gap-2 mt-1">
                        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                          {modalType === "DETAIL" ? "Business Profile" : "Customer Feedback"}
                        </p>
                        {modalType === "DETAIL" && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-700"></span>
                            <p className="text-xs text-gray-400 dark:text-gray-500">ID: {selectedVendor.id}</p>
                          </>
                        )}
                      </div>
                    </div>

                    {/* DETAIL CONTENT */}
                    {modalType === "DETAIL" && (
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
                          <div className="grid grid-cols-2 gap-y-4 text-sm">
                            <div>
                              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Email Address</p>
                              <p className="font-medium text-gray-900 dark:text-white truncate" title={selectedVendor.email}>{selectedVendor.email || "N/A"}</p>
                            </div>
                            <div>
                              <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Phone Number</p>
                              <p className="font-medium text-gray-900 dark:text-white">{selectedVendor.phone || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl p-4 border border-gray-100 dark:border-gray-800/50">
                          <span className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</span>
                          {getStatusBadge(selectedVendor.status || "PENDING")}
                        </div>
                      </div>
                    )}

                    {/* RATINGS CONTENT */}
                    {modalType === "RATINGS" && (
                      <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-gray-200 dark:scrollbar-thumb-gray-700">
                        {selectedVendorRatings.length === 0 ? (
                          <div className="text-center py-8">
                            <p className="text-gray-500 dark:text-gray-400 font-medium">No ratings available yet.</p>
                          </div>
                        ) : (
                          selectedVendorRatings.map((r: any) => (
                            <div key={r.id} className="bg-gray-50 dark:bg-gray-800/30 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50">
                              <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={14} className={i < Math.round(r.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-gray-600"} />
                                  ))}
                                </div>
                                <span className="text-xs font-bold text-gray-400 dark:text-gray-500">{r.customerName}</span>
                              </div>
                              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">"{r.review}"</p>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={() => setShowVendorModal(false)}
                        className={`px-6 py-2.5 rounded-xl text-white font-bold transition-all shadow-sm hover:shadow-md ${modalType === "DETAIL" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-amber-500 hover:bg-amber-600"}`}
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