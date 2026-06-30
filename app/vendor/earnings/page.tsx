"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle2, IndianRupee, Briefcase, Activity, ChevronDown } from "lucide-react";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";

export default function VendorDeskPage() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [activeWorks, setActiveWorks] = useState<any[]>([]);
  const [completedWorks, setCompletedWorks] = useState<any[]>([]);
  const [earnings, setEarnings] = useState<any[]>([]);
  const [otpValues, setOtpValues] = useState<any>({});

  useEffect(() => {
    fetchVendorWorks();
  }, []);

  const fetchVendorWorks = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) return;

      const res = await axios.get(
        `http://localhost:8080/auth/vendor/requests/${vendorId}`
      );

      const allWorks = res.data;

      setActiveWorks(allWorks.filter((i: any) => i.status === "ACCEPTED"));
      setCompletedWorks(allWorks.filter((i: any) => i.status === "COMPLETED"));
      setEarnings(allWorks.filter((i: any) => i.status === "COMPLETED"));
    } catch (err) {
      console.log(err);
    }
  };

  const verifyOtp = async (bookingId: number) => {
    const otp = otpValues[bookingId];

    if (!otp) return alert("Enter OTP");

    try {
      await axios.put(
        `http://localhost:8080/auth/vendor/complete/${bookingId}?otp=${otp}`
      );

      alert("Work Completed!");
      fetchVendorWorks();

      setOtpValues((p: any) => ({ ...p, [bookingId]: "" }));
    } catch (err: any) {
      alert(err?.response?.data || "Invalid OTP");
    }
  };

  const totalEarnings = earnings.reduce(
    (sum: number, item: any) => sum + (item.amount || 0),
    0
  );

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] text-[14px] font-sans">
      {/* SIDEBAR */}
      <VendorSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden relative min-h-0 min-w-0">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <VendorNavbar setOpen={setOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative z-10">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* HEADER */}
            <div>
              <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Vendor Workspace
              </h1>
              <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1.5">
                Manage your active jobs and track your earnings effortlessly.
              </p>
            </div>

            {/* TABS */}
            <div className="flex justify-start md:justify-center">
              {/* MOBILE DROPDOWN */}
              <div className="md:hidden w-full relative z-20">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700/60 text-gray-800 dark:text-gray-200 font-bold py-3.5 px-5 rounded-2xl shadow-sm transition-all duration-300"
                >
                  <span className="truncate flex items-center gap-2">
                    {activeTab === "active" ? <><Activity size={16}/> Active Jobs</> : activeTab === "completed" ? <><CheckCircle2 size={16}/> Completed</> : <><IndianRupee size={16}/> Earnings</>}
                  </span>
                  <ChevronDown className={`text-emerald-500 shrink-0 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-xl overflow-hidden transform origin-top transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      {[
                        { id: "active", label: "Active Jobs", icon: <Activity size={16} /> },
                        { id: "completed", label: "Completed", icon: <CheckCircle2 size={16} /> },
                        { id: "earnings", label: "Earnings", icon: <IndianRupee size={16} /> }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`
                            w-full flex items-center gap-2 text-left px-5 py-3 text-sm font-bold transition-all duration-200 border-l-4
                            ${activeTab === tab.id 
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" 
                              : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
                          `}
                        >
                          {tab.icon}
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DESKTOP PILL TABS */}
              <div className="hidden md:flex items-center gap-2 bg-white/60 dark:bg-[#111827]/60 p-1.5 rounded-full backdrop-blur-md border border-gray-200 dark:border-gray-700/60 shadow-sm">
                {[
                  { id: "active", label: "Active Jobs", icon: <Activity size={16} /> },
                  { id: "completed", label: "Completed", icon: <CheckCircle2 size={16} /> },
                  { id: "earnings", label: "Earnings", icon: <IndianRupee size={16} /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shrink-0 whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 hover:text-gray-900 dark:text-white"
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTIVE JOBS */}
            {activeTab === "active" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeWorks.length === 0 ? (
                  <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white/50 backdrop-blur-xl rounded-3xl border border-gray-100 dark:border-gray-800 border-dashed text-center">
                    <div className="w-16 h-16 bg-gray-50 dark:bg-[#1f2937] rounded-full flex items-center justify-center mb-4">
                      <Briefcase size={28} className="text-gray-400 dark:text-gray-500" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">No active jobs</h3>
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">You don't have any ongoing services at the moment.</p>
                  </div>
                ) : (
                  activeWorks.map((work) => (
                    <div
                      key={work.id}
                      className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                          <span className="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            In Progress
                          </span>
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full">
                            ₹{work.amount}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 group-hover:text-emerald-600 dark:text-emerald-400 transition-colors">
                          {work.service?.name || work.serviceName || "Service"}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mb-6">
                          Scheduled: {work.bookingDate || "N/A"}
                        </p>
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-gray-50">
                        <input
                          type="text"
                          value={otpValues[work.id] || ""}
                          onChange={(e) =>
                            setOtpValues({
                              ...otpValues,
                              [work.id]: e.target.value,
                            })
                          }
                          placeholder="Enter OTP"
                          className="flex-1 bg-gray-50/80 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 px-4 py-2.5 rounded-2xl text-sm font-semibold text-center focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 outline-none transition-all"
                        />
                        <button
                          onClick={() => verifyOtp(work.id)}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all"
                        >
                          Verify
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* COMPLETED JOBS */}
            {activeTab === "completed" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedWorks.length === 0 ? (
                   <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 col-span-full">No completed work yet.</p>
                ) : (
                  completedWorks.map((w) => (
                    <div
                      key={w.id}
                      className="bg-white dark:bg-[#111827] p-5 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex items-center justify-between"
                    >
                      <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                          {w.service?.name || w.serviceName || "Service"}
                        </h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">
                          {w.bookingDate || "N/A"}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-3 py-1 rounded-full text-xs font-extrabold flex items-center gap-1.5 border border-emerald-100 dark:border-emerald-900/30">
                          <CheckCircle2 size={12} />
                          DONE
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* EARNINGS */}
            {activeTab === "earnings" && (
              <div className="space-y-8">
                {/* STATS */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-3xl shadow-xl shadow-emerald-500/20 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-[#111827] opacity-10 rounded-full blur-2xl -mt-10 -mr-10"></div>
                    <p className="text-emerald-50 text-sm font-semibold tracking-wide uppercase mb-1">Total Earnings</p>
                    <h2 className="text-5xl font-extrabold flex items-center gap-1">
                      <span className="text-emerald-200">₹</span>{totalEarnings}
                    </h2>
                  </div>

                  <div className="bg-white dark:bg-[#111827] p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 flex flex-col justify-center">
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm font-semibold tracking-wide uppercase mb-1">Completed Jobs</p>
                    <h2 className="text-5xl font-extrabold text-gray-900 dark:text-white">
                      {completedWorks.length}
                    </h2>
                  </div>
                </div>

                {/* LIST */}
                <div className="bg-white dark:bg-[#111827] p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center justify-between mb-6 gap-2 flex-wrap">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">
                      Recent Earnings
                    </h3>
                    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl">
                      <IndianRupee size={20} />
                    </div>
                  </div>

                  <div className="space-y-3">
                    {earnings.length === 0 ? (
                       <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 text-sm font-medium text-center py-6 bg-gray-50 dark:bg-[#1f2937] rounded-2xl">No earnings yet.</p>
                    ) : (
                      earnings.map((e) => (
                        <div
                          key={e.id}
                          className="flex justify-between items-center p-4 rounded-2xl hover:bg-gray-50 dark:bg-[#1f2937] transition-colors border border-transparent hover:border-gray-100 dark:border-gray-800"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <CheckCircle2 size={20} />
                            </div>
                            <div>
                              <p className="text-gray-900 dark:text-white font-bold text-base">
                                {e.service?.name || e.serviceName || "Service"}
                              </p>
                              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-0.5">
                                {e.bookingDate || "N/A"}
                              </p>
                            </div>
                          </div>
                          <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-lg bg-emerald-50/50 px-3 py-1 rounded-xl">
                            +₹{e.amount}
                          </span>
                        </div>
                      ))
                    )}
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