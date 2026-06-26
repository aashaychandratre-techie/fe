"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";
import { log } from "console";

export default function RequestsPage() {
  const [open, setOpen] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("ASSIGNED");

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

  const acceptRequest = async (id: number) => {
    try {
      await axios.put(`http://localhost:8080/vendor/accept/${id}`);
      fetchRequests();
    } catch (err) {
      console.log(err);
    }
  };

  const rejectRequest = async (id: number) => {
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
        return "bg-emerald-100 text-emerald-700";
      case "COMPLETED":
        return "bg-blue-100 text-blue-700";
      case "REJECTED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredRequests = requests.filter(
    (req) => req.status === activeTab
  );

  return (
    <div className="flex h-screen bg-[#F9FAFB] text-[14px]">

      {/* SIDEBAR */}
      <VendorSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR */}
        <VendorNavbar setOpen={setOpen} />

        {/* CONTENT */}
        <div className="p-6 overflow-y-auto">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Service <span className="text-emerald-500">Requests</span>
            </h1>
            <p className="text-gray-500">
              Manage incoming service bookings
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-6 flex-wrap">

            {["ASSIGNED", "ACCEPTED", "COMPLETED"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm rounded-xl font-medium transition ${
                  activeTab === tab
                    ? "bg-emerald-500 text-white shadow"
                    : "bg-white text-gray-600 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}

          </div>

          {/* GRID */}
          {/* CONTENT */}
{activeTab === "COMPLETED" ? (
  <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr className="text-left text-sm text-gray-600">
          <th className="px-5 py-3">Service</th>
          <th className="px-5 py-3">Customer</th>
          <th className="px-5 py-3">Mobile</th>
          <th className="px-5 py-3">Address</th>
          <th className="px-5 py-3">Amount</th>
          <th className="px-5 py-3">Status</th>
        </tr>
      </thead>

      <tbody>
        {filteredRequests.length === 0 ? (
          <tr>
            <td
              colSpan={6}
              className="text-center py-10 text-gray-500"
            >
              No completed requests
            </td>
          </tr>
        ) : (
          filteredRequests.map((req: any) => (
            <tr
              key={req.id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="px-5 py-4 font-medium">
                {req.serviceName}
              </td>

              <td className="px-5 py-4">
                {req.customerName}
              </td>

              <td className="px-5 py-4">
                {req.mobileNumber}
              </td>

              <td className="px-5 py-4 text-gray-500">
                {req.address}
              </td>

              <td className="px-5 py-4 font-semibold text-emerald-600">
                ₹{req.amount}
              </td>

              <td className="px-5 py-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    req.status
                  )}`}
                >
                  {req.status}
                </span>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
) : (
  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
    {filteredRequests.length === 0 ? (
      <div className="col-span-full text-center text-gray-500 py-10">
        No requests found
      </div>
    ) : (
      filteredRequests.map((req: any) => (
        <div
          key={req.id}
          className="bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition"
        >
          {/* SERVICE */}
          <h2 className="text-lg font-semibold text-gray-900">
            🛠 {req.serviceName}
          </h2>

          {/* CUSTOMER */}
          <div className="mt-3 space-y-1 text-sm text-gray-600">
            <p>
              <span className="font-medium">Customer:</span>{" "}
              {req.customerName}
            </p>

            <p>
              <span className="font-medium">Mobile:</span>{" "}
              {req.mobileNumber}
            </p>

            <p className="text-xs text-gray-400">
              {req.address}
            </p>
          </div>

          <p className="text-emerald-600 font-bold mt-3">
            ₹{req.amount}
          </p>

          <span
            className={`inline-block mt-3 px-2 py-1 text-xs rounded-full ${getStatusColor(
              req.status
            )}`}
          >
            {req.status}
          </span>

          {req.status === "ASSIGNED" && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => acceptRequest(req.id)}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg text-sm"
              >
                Accept
              </button>

              <button
                onClick={() => rejectRequest(req.id)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm"
              >
                Reject
              </button>
            </div>
          )}
        </div>
      ))
    )}
  </div>
)}

        </div>
      </div>
    </div>
  );
}