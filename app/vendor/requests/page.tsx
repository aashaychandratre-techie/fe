"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";
import { ChevronDown } from "lucide-react";

export default function RequestsPage() {
  const [open, setOpen] = useState(false);
  type AdditionalService = {
  id: string;
  name: string;
  price: number;
};

type BookingRequest = {
  id: string;
  serviceName: string;
  customerName: string;
  mobileNumber: string;
  bookingDate: string;
  bookingTime: string;
  address: string;
  amount: number;
  status: string;
  additionalServices: AdditionalService[];
};

const [requests, setRequests] = useState<BookingRequest[]>([]);
  const [activeTab, setActiveTab] = useState("ASSIGNED");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const vendorId =
    typeof window !== "undefined"
      ? localStorage.getItem("vendorId")
      : null;

  useEffect(() => {
    if (vendorId) fetchRequests();
  }, [vendorId]);

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8080/auth/vendor/requests/${vendorId}`
      );
      setRequests(res.data);
      console.log(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const acceptRequest = async (id: string) => {
  try {
    await axios.put(`http://localhost:8080/vendor/accept/${id}`);

    // Active tab open ho jayega
    setActiveTab("ACCEPTED");

    // Fresh data fetch hoga
    fetchRequests();

  } catch (err) {
    console.log(err);
  }
};

  const rejectRequest = async (id: string) => {
    try {
      await axios.put(`http://localhost:8080/vendor/reject/${id}`);
      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ASSIGNED":
        return "bg-yellow-100 text-yellow-700";
      case "ACCEPTED":
        return "bg-emerald-100 text-emerald-700 dark:text-emerald-400";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600 dark:text-gray-300";
    }
  };

  const filteredRequests = requests.filter(
    (req) => req.status === activeTab
  );

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <VendorSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col relative min-h-0 min-w-0 overflow-hidden">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        {/* NAVBAR */}
        <div className="md:hidden">
                <VendorNavbar setOpen={setOpen} />
                </div>
        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            {/* HEADER */}
            <div>
              <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
                Service Requests
              </h1>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                Manage your incoming bookings and schedule.
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
                  <span className="truncate">
                    {activeTab === "ASSIGNED" ? "New Requests" : activeTab === "ACCEPTED" ? "Active" : "Completed"}
                  </span>
                  <ChevronDown className={`text-emerald-500 shrink-0 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-xl overflow-hidden transform origin-top transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-2">
                      {["ASSIGNED", "ACCEPTED", "COMPLETED"].map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            setActiveTab(tab);
                            setIsDropdownOpen(false);
                          }}
                          className={`
                            w-full text-left px-5 py-3 text-sm font-bold transition-all duration-200 border-l-4
                            ${activeTab === tab 
                              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" 
                              : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
                          `}
                        >
                          {tab === "ASSIGNED" ? "New Requests" : tab === "ACCEPTED" ? "Active" : "Completed"}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DESKTOP PILL TABS */}
              <div className="hidden md:flex items-center gap-2 bg-white/60 dark:bg-[#111827]/60 p-1.5 rounded-full backdrop-blur-md border border-gray-200 dark:border-gray-700/60 shadow-sm">
                {["ASSIGNED", "ACCEPTED", "COMPLETED"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shrink-0 whitespace-nowrap ${
                      activeTab === tab
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                        : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 hover:text-gray-900 dark:text-white"
                    }`}
                  >
                    {tab === "ASSIGNED" ? "New Requests" : tab === "ACCEPTED" ? "Active" : "Completed"}
                  </button>
                ))}
              </div>
            </div>

            {/* CONTENT */}
            {activeTab === "COMPLETED" ? (
              <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold text-xs border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Mobile</th>
                        <th className="px-6 py-4">Address</th>
                        <th className="px-6 py-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {filteredRequests.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-12 text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">
                            No completed requests found.
                          </td>
                        </tr>
                      ) : (
                        filteredRequests.map((req: any) => (
                          <tr key={req.id} className="hover:bg-emerald-50/30 transition-colors">
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                              {req.serviceName}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-300">
                              {req.customerName}
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 dark:text-gray-500">
                              {req.mobileNumber}
                            </td>
                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400 dark:text-gray-500">
                              <span className="truncate block max-w-xs">{req.address}</span>
                            </td>
                            <td className="px-6 py-4 font-extrabold text-emerald-600 dark:text-emerald-400">
                              ₹{req.amount}
                            </td>
                        
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRequests.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed">
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium text-lg">No {activeTab.toLowerCase()} requests right now.</p>
                  </div>
                ) : (
                  filteredRequests.map((req: any) => (
                   <div
  key={req.id}
  className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 p-5"
>
  {/* Top Row */}
  <div className="flex items-center justify-between">

    <div>
      <h2 className="text-xl font-bold text-gray-900">
        {req.serviceName}
      </h2>

     <p className="text-xs text-gray-500 mt-1 break-all">
  Booking ID : {req.id}
</p>
    </div>

    <div className="flex items-center gap-4">

      <p className="text-2xl font-bold text-emerald-600">
        ₹{req.amount}
      </p>

      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(
          req.status
        )}`}
      >
        {req.status}
      </span>

    </div>
  </div>

  <div className="border-t my-4"></div>

  {/* Customer Details */}

  <div className="flex flex-wrap items-center gap-6 text-sm">

    <span>
      <span className="text-gray-500">Customer :</span>{" "}
      <span className="font-semibold">{req.customerName}</span>
    </span>

    <span>
      <span className="text-gray-500">Mobile :</span>{" "}
      <span className="font-semibold">{req.mobileNumber}</span>
    </span>

    <span>
      <span className="text-gray-500">Date :</span>{" "}
      <span className="font-semibold">{req.bookingDate}</span>
    </span>

    <span>
      <span className="text-gray-500">Time :</span>{" "}
      <span className="font-semibold">{req.bookingTime}</span>
    </span>

  </div>

  {/* Address */}

  <div className="mt-4 flex items-start gap-2 text-sm">
    <span className="text-gray-500 font-medium">Address :</span>

    <span className="text-gray-700">
      {req.address}
    </span>
  </div>

  {/* Additional Services */}

  {req.additionalServices?.length > 0 && (

    <div className="mt-4">

      <p className="text-sm font-semibold mb-2">
        Additional Services
      </p>

      <div className="flex flex-wrap gap-2">

        {req.additionalServices.map((item: AdditionalService) => (

          <div
            key={item.id}
            className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium"
          >
            {item.name} • ₹{item.price}
          </div>

        ))}

      </div>

    </div>

  )}

  {/* Buttons */}

  <div className="flex justify-end gap-3 mt-5">

    <button
      onClick={() => rejectRequest(req.id)}
      className="px-4 py-1.5 rounded-lg border border-red-300 text-red-600 hover:bg-red-50 text-sm font-medium transition"
    >
      Decline
    </button>

    <button
      onClick={() => acceptRequest(req.id)}
      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
    >
      Accept Booking
    </button>

  </div>
</div>
                  ))
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}