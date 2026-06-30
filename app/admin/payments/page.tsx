"use client";

import { useState } from "react";
import {
  Search,
  X,
  CreditCard,
  CheckCircle2,
  XCircle,
  IndianRupee,
  User,
  Briefcase,
  Pencil,
  Save,
  Wallet,
  ArrowRight
} from "lucide-react";

import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

type Payment = {
  id: string;
  customer: string;
  vendor: string;
  service: string;
  amount: string;
  status: string;
};

export default function AdminPaymentsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [editMode, setEditMode] = useState(false);

  const payments: Payment[] = [
    {
      id: "TXN001",
      customer: "Vaishnavi Jadhav",
      vendor: "Rahul Sharma",
      service: "Premium Car Wash",
      amount: "₹1,200",
      status: "Pending",
    },
    {
      id: "TXN002",
      customer: "Aman Verma",
      vendor: "Amit Joshi",
      service: "Electrician",
      amount: "₹2,500",
      status: "Paid",
    },
    {
      id: "TXN003",
      customer: "Sneha Patil",
      vendor: "Rohan Kale",
      service: "Home Cleaning",
      amount: "₹1,800",
      status: "Failed",
    },
    {
      id: "TXN004",
      customer: "Rahul Sharma",
      vendor: "Deepak Kumar",
      service: "Plumbing",
      amount: "₹3,200",
      status: "Pending",
    },
  ];

  const filteredPayments = payments.filter((item) =>
    item.customer.toLowerCase().includes(search.toLowerCase()) || 
    item.id.toLowerCase().includes(search.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/30">Paid</span>;
      case "Failed":
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/30">Failed</span>;
      case "Pending":
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
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <AdminNavbar setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            
            {/* HEADER */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 mb-1.5">
                  Payment Management
                </h1>
                <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                  Manage vendor payouts and customer transactions
                </p>
              </div>

              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                <input
                  type="text"
                  placeholder="Search by ID or Customer..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2.5 text-sm rounded-full border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-400 text-gray-900 dark:text-white transition-all shadow-sm w-full sm:w-72"
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="overflow-x-auto p-1">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-500 dark:text-gray-400 border-b border-gray-100 dark:border-gray-800">
                      <th className="px-6 py-4 font-semibold rounded-tl-2xl">Transaction</th>
                      <th className="px-6 py-4 font-semibold">Service</th>
                      <th className="px-6 py-4 font-semibold">Amount</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold text-center rounded-tr-2xl">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <div className="flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                            <Wallet size={48} className="mb-4 opacity-20" />
                            <p className="text-base font-medium text-gray-900 dark:text-white">No transactions found</p>
                            <p className="text-sm mt-1">Try a different search term</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((item, idx) => (
                        <tr 
                          key={item.id} 
                          onClick={() => {
                            setSelectedPayment(item);
                            setEditMode(false);
                          }}
                          className="hover:bg-emerald-50/30 dark:hover:bg-emerald-900/10 transition-colors cursor-pointer group"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                <Wallet size={18} />
                              </div>
                              <div>
                                <p className="font-bold text-gray-900 dark:text-white">{item.customer}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">ID: {item.id}</p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">{item.service}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                              <span>Vendor: </span>
                              <span className="font-medium text-gray-700 dark:text-gray-400">{item.vendor}</span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1.5 rounded-lg inline-block border border-emerald-100 dark:border-emerald-800/30">
                              {item.amount}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            {getStatusBadge(item.status)}
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                              <button
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-900/40 dark:hover:text-emerald-400 transition-all"
                                title="View Details"
                              >
                                <ArrowRight size={16} />
                              </button>
                            </div>
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

      {/* MODAL */}
      {selectedPayment && (
        <div className="fixed inset-0 bg-gray-900/60 dark:bg-[#0B1120]/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#111827] w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-100 dark:border-gray-800 relative">
            
            {/* Modal Header with Gradient */}
            <div className="shrink-0 bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
              
              <button
                onClick={() => {
                  setSelectedPayment(null);
                  setEditMode(false);
                }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors z-10"
              >
                <X size={16} />
              </button>

              <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div>
                  <h3 className="text-2xl font-black mb-1">Transaction Details</h3>
                  <p className="text-blue-100 text-sm font-medium">
                    ID: {selectedPayment.id}
                  </p>
                </div>
                
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 border border-white/20 shadow-sm"
                >
                  {editMode ? <Save size={14} /> : <Pencil size={14} />}
                  {editMode ? "Save" : "Edit"}
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-8 space-y-5 overflow-y-auto">
              
              {/* DETAILS GRID */}
              <div className="grid grid-cols-2 gap-4">
                {/* CUSTOMER */}
                <div className="col-span-2 sm:col-span-1 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                    <User size={16} className="text-blue-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Customer</span>
                  </div>
                  {editMode ? (
                    <input
                      defaultValue={selectedPayment.customer}
                      className="w-full bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  ) : (
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedPayment.customer}</p>
                  )}
                </div>

                {/* VENDOR */}
                <div className="col-span-2 sm:col-span-1 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                    <User size={16} className="text-purple-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Vendor</span>
                  </div>
                  {editMode ? (
                    <input
                      defaultValue={selectedPayment.vendor}
                      className="w-full bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-bold focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  ) : (
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedPayment.vendor}</p>
                  )}
                </div>

                {/* SERVICE */}
                <div className="col-span-2 sm:col-span-1 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-2 mb-2 text-gray-500 dark:text-gray-400">
                    <Briefcase size={16} className="text-indigo-500" />
                    <span className="text-xs font-bold uppercase tracking-wider">Service</span>
                  </div>
                  {editMode ? (
                    <input
                      defaultValue={selectedPayment.service}
                      className="w-full bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                    />
                  ) : (
                    <p className="font-bold text-gray-900 dark:text-white text-lg">{selectedPayment.service}</p>
                  )}
                </div>

                {/* AMOUNT */}
                <div className="col-span-2 sm:col-span-1 bg-emerald-50 dark:bg-emerald-900/10 p-4 rounded-2xl border border-emerald-100 dark:border-emerald-800/30">
                  <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-500">
                    <IndianRupee size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Amount</span>
                  </div>
                  {editMode ? (
                    <input
                      defaultValue={selectedPayment.amount}
                      className="w-full bg-white dark:bg-gray-700 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-600 text-sm font-bold text-emerald-600 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  ) : (
                    <p className="font-black text-emerald-600 dark:text-emerald-400 text-2xl">{selectedPayment.amount}</p>
                  )}
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                <button className="flex-1 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
                  <CreditCard size={18} />
                  Release
                </button>
                <button className="flex-1 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all">
                  <CheckCircle2 size={18} />
                  Mark Paid
                </button>
                <button className="flex-1 py-3.5 rounded-xl bg-red-100 hover:bg-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 text-red-600 dark:text-red-400 font-bold flex items-center justify-center gap-2 transition-all border border-red-200 dark:border-red-800/30">
                  <XCircle size={18} />
                  Failed
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}