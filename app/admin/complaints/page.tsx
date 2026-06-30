"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Search, Filter, AlertCircle, CheckCircle, XCircle, LayoutList, ShieldAlert, Check, X } from "lucide-react";
import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminComplaintsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

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

  const resolveComplaint = async (id: number) => {
    try {
      await axios.put(`http://localhost:8080/complaints/resolve/${id}`);
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, status: "RESOLVED" } : c
        )
      );
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
        typeFilter === "ALL" ? true : c.type === typeFilter
      )
      .filter((c) => {
        const s = search.toLowerCase();
        return (
          c.subject?.toLowerCase().includes(s) ||
          c.message?.toLowerCase().includes(s)
        );
      });
  }, [complaints, search, typeFilter]);

  const total = complaints.length;
  const resolved = complaints.filter((c) => c.status === "RESOLVED").length;
  const rejected = complaints.filter((c) => c.status === "REJECTED").length;
  const open = total - resolved - rejected;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Resolved</span>;
      case "REJECTED":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">Rejected</span>;
      case "OPEN":
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/30">Open</span>;
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
                    onClick={() => {
                      const el = document.getElementById("complaint-filter-dropdown-menu");
                      if (el) el.classList.toggle("hidden");
                    }}
                    onBlur={(e) => {
                      setTimeout(() => {
                        const el = document.getElementById("complaint-filter-dropdown-menu");
                        if (el) el.classList.add("hidden");
                      }, 150);
                    }}
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
                  <div id="complaint-filter-dropdown-menu" className="hidden absolute right-0 mt-2 w-48 bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
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
                            const el = document.getElementById("complaint-filter-dropdown-menu");
                            if (el) el.classList.add("hidden");
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
                </div>
              </div>
            </div>

            {/* KPI STATS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full blur-2xl group-hover:bg-gray-200 dark:group-hover:bg-gray-700 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
                    <LayoutList size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{total}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-100/50 dark:bg-amber-900/20 rounded-full blur-2xl group-hover:bg-amber-200/50 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <AlertCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider">Open</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{open}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-100/50 dark:bg-emerald-900/20 rounded-full blur-2xl group-hover:bg-emerald-200/50 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider">Resolved</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{resolved}</h3>
                  </div>
                </div>
              </div>

              <div className="bg-white/70 dark:bg-[#111827]/70 backdrop-blur-xl border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-red-100/50 dark:bg-red-900/20 rounded-full blur-2xl group-hover:bg-red-200/50 transition-colors"></div>
                <div className="flex items-center gap-4 relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                    <XCircle size={24} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-red-600 dark:text-red-500 uppercase tracking-wider">Rejected</p>
                    <h3 className="text-3xl font-black text-gray-900 dark:text-white mt-1">{rejected}</h3>
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
                      filtered.map((c) => (
                        <tr key={c.id} className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors group">
                          
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
                            {c.status === "OPEN" ? (
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => resolveComplaint(c.id)}
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

          </div>
        </main>
      </div>
    </div>
  );
}