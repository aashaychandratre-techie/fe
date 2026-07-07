"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Filter, AlertCircle, CheckCircle, XCircle, LayoutList, ShieldAlert, Check, X } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";
import { createPortal } from "react-dom";

export default function AdminComplaintsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const ITEMS_PER_PAGE = 5;
  const [currentPage, setCurrentPage] = useState(1);
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [complaintToResolve, setComplaintToResolve] = useState<any>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [statusTab, setStatusTab] = useState("OPEN");
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8080/complaints");
      setComplaints(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async () => {
  try {
    await axios.put(
      `http://localhost:8080/complaints/resolve/${complaintToResolve.id}`,
      {
        resolutionNote,
      }
    );

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === complaintToResolve.id
          ? {
              ...c,
              status: "RESOLVED",
              resolutionNote,
            }
          : c
      )
    );

    setShowResolveModal(false);
    setComplaintToResolve(null);
    setResolutionNote("");
  } catch (error) {
    console.error(error);
    alert("Failed to resolve complaint");
  }
};

  const rejectComplaint = async (id: number) => {
    try {
      await axios.put(`http://localhost:8080/complaints/reject/${id}`);
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "REJECTED" } : c
        )
      );
    } catch (error) {
      console.error(error);
      alert("Failed to reject complaint");
    }
  };

  const filtered = useMemo(() => {
  return complaints
    .filter((c) =>
      statusTab === "OPEN"
        ? c.status === "PENDING"
        : c.status === "RESOLVED"
    )
    .filter((c) =>
      typeFilter === "ALL" ? true : c.type === typeFilter
    )
    .filter((c) => {
      const s = search.toLowerCase();
      return (
        c.subject?.toLowerCase().includes(s) ||
        c.message?.toLowerCase().includes(s)
      );
    });
}, [complaints, search, typeFilter, statusTab]);

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;
  const rejected = complaints.filter((c) => c.status === "REJECTED").length;
  const open = total - resolved - rejected;
  const [selectedComplaint, setSelectedComplaint] = useState<any>(null);
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedComplaints = filtered.slice(
  (currentPage - 1) * ITEMS_PER_PAGE,
  currentPage * ITEMS_PER_PAGE
);

useEffect(() => {
  setCurrentPage(1);
}, [search, typeFilter]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Resolved</span>;
      case "REJECTED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">Rejected</span>;
      case "PENDING":
    return (
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">
      Pending
    </span>
  );

  default:
  return (
    <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
      Unknown
    </span>
  );
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
                  Complaints Overview
                </h1>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                  Manage user feedback and dispute resolutions
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <input
                    type="text"
                    placeholder="Search complaints..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-gray-900 dark:text-white transition-all shadow-sm w-full sm:w-64"
                  />
                </div>

                <div className="relative">
                  <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 z-10 pointer-events-none" size={16} />
                  
                  {/* Custom Dropdown Trigger */}
                  <button
                   onClick={() => setFilterOpen(!filterOpen)}
                    className="flex items-center justify-between w-[180px] pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-gray-700 dark:text-gray-200 transition-all shadow-sm cursor-pointer"
                  >
                    <span className="font-medium text-left truncate">
                      {typeFilter === "ALL" && "All Types"}
                      {typeFilter === "SERVICE_COMPLAINT" && "Service Complaint"}
                      {typeFilter === "REVIEW_REPORT" && "Review Report"}
                    </span>
                    <svg className="w-4 h-4 ml-2 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </button>

                  {/* Custom Dropdown Menu */}
                 {filterOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-1">
                      {[
                        { val: "ALL", label: "All Types" },
                        { val: "SERVICE_COMPLAINT", label: "Service Complaint" },
                        { val: "REVIEW_REPORT", label: "Review Report" }
                      ].map(opt => (
                        <div
                          key={opt.val}
                          onClick={() => {
                          setTypeFilter(opt.val);
                          setCurrentPage(1);
                          setFilterOpen(false);
                        }}
                          className={`px-3 py-2 text-sm rounded-xl cursor-pointer transition-colors ${
                            typeFilter === opt.val 
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

            {/* KPI STATS */}
            <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6">

            {/* Total */}
            <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-3xl p-2 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group min-w-0">
            <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 dark:bg-gray-800 rounded-full blur-2xl"></div>
            <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 relative z-10">
            <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
            <LayoutList className="w-4 h-4 sm:w-6 sm:h-6" />
            </div>

            <div className="text-center sm:text-left">
            <p className="text-[9px] sm:text-sm font-bold text-gray-500 uppercase">
             TOTAL
            </p>
            <h3 className="text-base sm:text-3xl font-black text-gray-900 dark:text-white">
          {total}
        </h3>
      </div>
    </div>
  </div>

  {/* Open */}
  <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-3xl p-2 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group min-w-0">
    <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 bg-amber-100/40 rounded-full blur-2xl"></div>
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 relative z-10">
      <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600">
        <AlertCircle className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
        <div className="text-center sm:text-left">
        <p className="text-[9px] sm:text-sm font-bold text-amber-600 uppercase">
          OPEN
        </p>
        <h3 className="text-base sm:text-3xl font-black text-gray-900 dark:text-white">
          {open}
        </h3>
      </div>
    </div>
  </div>

  {/* Resolved */}
  <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-3xl p-2 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group min-w-0">
    <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 bg-emerald-100/40 rounded-full blur-2xl"></div>
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 relative z-10">
      <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
        <CheckCircle className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
        <div className="text-center sm:text-left">
        <p className="text-[8px] sm:text-sm font-bold text-emerald-600 uppercase">
          RESOLVED
        </p>
        <h3 className="text-base sm:text-3xl font-black text-gray-900 dark:text-white">
          {resolved}
        </h3>
      </div>
    </div>
  </div>

  {/* Rejected */}
  <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-xl sm:rounded-3xl p-2 sm:p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group min-w-0">
    <div className="absolute -right-6 -top-6 w-20 h-20 sm:w-24 sm:h-24 bg-red-100/40 rounded-full blur-2xl"></div>
    <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-4 relative z-10">
      <div className="w-7 h-7 sm:w-12 sm:h-12 rounded-lg sm:rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600">
        <XCircle className="w-4 h-4 sm:w-6 sm:h-6" />
      </div>
        <div className="text-center sm:text-left">
        <p className="text-[8px] sm:text-sm font-bold text-red-600 uppercase">
          REJECTED
        </p>
        <h3 className="text-base sm:text-3xl font-black text-gray-900 dark:text-white">
          {rejected}
        </h3>
      </div>
    </div>
  </div>
</div>
<div className="flex justify-center my-6">
  <div className="flex bg-white dark:bg-[#111827] rounded-full p-2 shadow-lg border border-gray-200 dark:border-gray-700">
    <button
      onClick={() => setStatusTab("OPEN")}
      className={`px-6 py-2 text-sm rounded-full font-semibold transition ${
        statusTab === "OPEN"
          ? "bg-emerald-500 text-white shadow-lg"
          : "text-gray-600 dark:text-gray-300"
      }`}
    >
      Open Complaints
    </button>

    <button
      onClick={() => setStatusTab("RESOLVED")}
      className={`px-6 py-2 text-sm rounded-full font-semibold transition ${
        statusTab === "RESOLVED"
          ? "bg-emerald-500 text-white shadow-lg"
          : "text-gray-600 dark:text-gray-300"
      }`}
    >
      Resolved Complaints
    </button>
   </div>
</div>

    {/* TABLE */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto p-1">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-4 font-semibold rounded-tl-2xl">Report Details</th>
                      <th className="px-6 py-4 font-semibold">Message</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {loading ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                          <div className="flex justify-center items-center gap-2">
                            <div className="w-5 h-5 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                            Loading complaints...
                          </div>
                        </td>
                      </tr>
                    ) : filtered.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                            <ShieldAlert size={48} className="mb-4 opacity-20" />
                            <p className="text-base font-medium text-gray-900 dark:text-white">No complaints found</p>
                            <p className="text-sm mt-1">Try adjusting your filters</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      paginatedComplaints.map((c) => ( 
                       <tr
                      key={c.id}
                      onClick={() => setSelectedComplaint(c)}
                      className="cursor-pointer hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                          
                          <td className="px-6 py-4">
                            <div className="flex flex-col items-start gap-2">
                              <span className={`px-2 py-1 text-[10px] uppercase font-black rounded-lg ${
                                c.type === "REVIEW_REPORT"
                                  ? "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                              }`}>
                                {c.type === "REVIEW_REPORT" ? "Review Report" : "Service Complaint"}
                              </span>
                              <p className="font-bold text-gray-900 dark:text-white">{c.subject || "No Subject"}</p>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-600 dark:text-gray-400 max-w-sm">
                              {c.message}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {getStatusBadge(c.status)}
                          </td>

                          <td className="px-6 py-4">
                           {c.status === "PENDING" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => {
                                  e.stopPropagation();
                                  setComplaintToResolve(c);
                                  setShowResolveModal(true);
                                  }}
                                  className="flex items-center gap-1.5 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md border border-emerald-200 dark:border-emerald-800/30"
                                >
                                  <Check size={14} strokeWidth={3} /> Resolve
                                </button>

                                <button
                                  onClick={() => rejectComplaint(c.id)}
                                  className="flex items-center gap-1.5 bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm hover:shadow-md border border-red-200 dark:border-red-800/30"
                                >
                                  <X size={14} strokeWidth={3} /> Reject
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-gray-400 italic">No Action Needed</span>
                            )}
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
         {selectedComplaint &&
         typeof window !== "undefined" &&
         createPortal(
    <div className="fixed inset-0 z-[99999] flex items-start justify-center bg-black/40 backdrop-blur-md px-4 pt-12 pb-8 overflow-y-auto"
    
    >
      {/* Overlay */}

      <div

        className="absolute inset-0"
        onClick={() => setSelectedComplaint(null)}
      />
      {/* Popup */}
      <div

        onClick={(e) => e.stopPropagation()}
        className="relative z-[100000] w-full max-w-2xl my-8 rounded-3xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-700 shadow-2xl"
      >
        {/* Close */}

        <button

          onClick={() => setSelectedComplaint(null)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center transition"
        >
          <X size={20} className="text-gray-500" />

        </button>

        <div className="p-6">
         <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center text-xl font-bold text-emerald-700">
              {selectedComplaint?.complainant?.name?.charAt(0) || "?"}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Complaint Details
              </h2>
              <p className="text-sm text-gray-500">
                Complaint #{selectedComplaint.id}
              </p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">

            {/* Complaint By */}

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2937] p-4">
              <h3 className="text-base font-bold text-emerald-600 mb-3">
                Complaint By
              </h3>
              <div className="flex items-center gap-3">
               <div className="w-11 h-11 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
               {selectedComplaint?.complainant?.profileImage ? (
               <img
                src={`http://localhost:8080${selectedComplaint.complainant.profileImage}`}
                alt="Complainant"
                className="w-full h-full object-cover"
              />
              ) : (
              <span className="text-lg font-bold text-emerald-700">
              {selectedComplaint?.complainant?.name?.charAt(0) || "?"}
              </span>
              )}
              </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {selectedComplaint?.complainant?.name || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedComplaint?.complainant?.role || ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                 <div className="flex items-center gap-2 text-sm">
                 <span className="font-medium text-gray-500">Id:</span>
                 <span className="text-gray-900 dark:text-gray-100">
                 {selectedComplaint?.complainant?.id || ""}
               </span>
               </div>
                <div className="flex items-center gap-2 text-sm">
                <span className="font-medium text-gray-500">Email:</span>
                <span className="text-gray-900 dark:text-gray-100">
              {selectedComplaint?.complainant?.email || ""}
               </span>
              </div>
                <div className="flex items-center gap-2 text-sm">
               <span className="font-medium text-gray-500">Phone:</span>
               <span className="text-gray-900 dark:text-gray-100">
               {selectedComplaint?.complainant?.phone || ""}
              </span>
              </div>
              </div>
            </div>
            {/* Complaint Against */}

            <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2937] p-4">
              <h3 className="text-base font-bold text-red-600 mb-3">
                Complaint Against
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full overflow-hidden bg-red-100 flex items-center justify-center">
             {selectedComplaint?.against?.profileImage ? (
              <img
              src={`http://localhost:8080${selectedComplaint.against.profileImage}`}
             alt="Against"
             className="w-full h-full object-cover"
             />
             ) : (
            <span className="text-lg font-bold text-red-700">
            {selectedComplaint?.against?.name?.charAt(0) || "?"}
            </span>
             )}
            </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">
                    {selectedComplaint?.against?.name || ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {selectedComplaint?.against?.role || ""}
                  </p>
                </div>
              </div>
              <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center gap-2 text-sm">
                   <span className="font-medium text-gray-500">Id:</span>
                   <span className="text-gray-900 dark:text-gray-100">
                        {selectedComplaint?.against?.id || ""}
                   </span>
              </div>
                <div className="flex items-center gap-2 text-sm">
                   <span className="font-medium text-gray-500">Email:</span>
                   <span className="text-gray-900 dark:text-gray-100">
                        {selectedComplaint?.against?.email || ""}
                   </span>
              </div>
               <div className="flex items-center gap-2 text-sm">
                   <span className="font-medium text-gray-500">Phone:</span>
                   <span className="text-gray-900 dark:text-gray-100">
                        {selectedComplaint?.against?.phone || ""}
                   </span>
              </div>
              </div>
            </div>
          </div>

          {/* Complaint Information */}

          <div className="mt-5 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#1F2937] p-4">
            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">
              Complaint Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Type
                </p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedComplaint.type}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Subject
                </p>
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {selectedComplaint.subject}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase text-gray-500">
                  Status
                </p>
                <div className="mt-2">
                  {getStatusBadge(selectedComplaint.status)}
                </div>
              </div>
            </div>

            {/* Message */}

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
                Message
              </p>
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#111827] p-4 min-h-[90px] text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                {selectedComplaint.message}
              </div>
            </div>
            {selectedComplaint.status === "RESOLVED" &&
             selectedComplaint.resolutionNote && (
            <div className="mt-5">
            <p className="text-xs font-semibold uppercase text-gray-500 mb-2">
            Resolution Note
            </p>
            <div className="rounded-xl border border-emerald-200 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 p-4 text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
            {selectedComplaint.resolutionNote}
            </div>
            </div>
            )}
          </div>

          {/* Footer */}

          <div className="flex justify-end gap-3 mt-5">
            <button
              onClick={() => setSelectedComplaint(null)}
              className="px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
              Close
            </button>
            {selectedComplaint.status === "PENDING" && (
              <>
               <button
               onClick={() => {
               setComplaintToResolve(selectedComplaint);
               setShowResolveModal(true);
                }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white transition"
              >
              Resolve
              </button>
                <button
                  onClick={() => {
                    rejectComplaint(selectedComplaint.id);
                    setSelectedComplaint(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
{showResolveModal &&
  typeof window !== "undefined" &&
  createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => setShowResolveModal(false)}
      />
      <div className="relative z-[100000] w-full max-w-md rounded-2xl bg-white dark:bg-[#111827] p-6 shadow-2xl">
        <h2 className="text-xl font-bold mb-4">
          Resolve Complaint
        </h2>
        <textarea
          rows={5}
          value={resolutionNote}
          onChange={(e) => setResolutionNote(e.target.value)}
          placeholder="Enter resolution note..."
          className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-[#1F2937] p-3 outline-none"
        />
        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={() => {
              setShowResolveModal(false);
              setResolutionNote("");
            }}
            className="px-4 py-2 rounded-xl border"
          >
            Cancel
          </button>

          <button
          onClick={() => {
          if (!resolutionNote.trim()) {
          alert("Please enter a resolution note.");
          return;
            } 
          resolveComplaint();
          }}
         className="px-4 py-2 rounded-xl bg-emerald-600 text-white"
        >
        Save
       </button>
        </div>
      </div>
    </div>,
    document.body
)}

          </div>
        </main>
      </div>
    </div>
  );
}