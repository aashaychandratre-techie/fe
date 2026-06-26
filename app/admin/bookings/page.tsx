"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import AdminNavbar from "@/components/AdminNavbar";
import AdminSidebar from "@/components/AdminSidebar";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);

  const [selectedVendor, setSelectedVendor] = useState<{ [key: number]: string }>({});

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10;

  useEffect(() => {
    fetchBookings();
    fetchVendors();
  }, []);

  const fetchBookings = async () => {
    const res = await axios.get("http://localhost:8080/api/admin/bookings");
    setBookings(res.data);
  };

  const fetchVendors = async () => {
    const res = await axios.get("http://localhost:8080/auth/vendor/all");
    setVendors(res.data);
  };

  const assignVendor = async (bookingId: number) => {
    const vendorId = selectedVendor[bookingId];

    if (!vendorId) {
      alert("Select vendor first");
      return;
    }

    await axios.put(
      `http://localhost:8080/api/admin/assign-vendor/${bookingId}/${vendorId}`
    );

    fetchBookings();
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-emerald-100 text-emerald-700";
      case "REJECTED":
        return "bg-red-100 text-red-600";
      case "ASSIGNED":
        return "bg-amber-100 text-amber-700";
      case "PENDING":
        return "bg-gray-100 text-gray-600";
      default:
        return "bg-blue-100 text-blue-700";
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
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">

      {/* SIDEBAR (fixed) */}
      <div className="fixed top-0 left-0 h-full w-64 z-50">
        <AdminSidebar />
      </div>

      {/* MAIN AREA (shifted right so it won't go behind sidebar) */}
      <div className="ml-64 flex flex-col min-h-screen">

        {/* NAVBAR */}
        <AdminNavbar />

        {/* CONTENT */}
        <div className="p-4 sm:p-6">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

            <h1 className="text-2xl font-bold text-emerald-600">
              Manage Bookings
            </h1>

            <select
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:ring-2 focus:ring-emerald-400"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">All</option>
              <option value="PENDING">Pending</option>
              <option value="ACCEPTED">Accepted</option>
              <option value="REJECTED">Rejected</option>
              <option value="ASSIGNED">Assigned</option>
            </select>

          </div>

          {/* TABLE */}
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">

            <table className="min-w-[900px] w-full text-sm">

              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="p-3 border">Booking</th>
                  <th className="p-3 border">Service</th>
                  <th className="p-3 border">Customer</th>
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">Address</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Vendor</th>
                </tr>
              </thead>

              <tbody>
                {currentBookings.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-6 text-center text-gray-500">
                      No bookings found
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-gray-50 transition">

                      <td className="p-3 border text-center">#{b.id}</td>
                      <td className="p-3 border text-center">{b.serviceId}</td>
                      <td className="p-3 border text-center">{b.customerId}</td>
                      <td className="p-3 border text-center">₹{b.amount}</td>
                      <td className="p-3 border text-center">{b.address}</td>

                      <td className="p-3 border text-center">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(b.status)}`}>
                          {b.status}
                        </span>
                      </td>

                      <td className="p-3 border text-center">

                        {b.status === "PENDING" ? (
                          <div className="flex flex-col sm:flex-row gap-2 justify-center">

                            <select
                              className="border border-gray-200 px-2 py-1 rounded text-xs"
                              value={selectedVendor[b.id] || ""}
                              onChange={(e) =>
                                setSelectedVendor({
                                  ...selectedVendor,
                                  [b.id]: e.target.value,
                                })
                              }
                            >
                              <option value="">Select</option>
                              {vendors.map((v) => (
                                <option key={v.id} value={v.id}>
                                  {v.name}
                                </option>
                              ))}
                            </select>

                            <button
                              onClick={() => assignVendor(b.id)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded text-xs"
                            >
                              Assign
                            </button>

                          </div>
                        ) : b.vendorId ? (
                          <span className="text-emerald-600 text-xs font-semibold">
                            #{b.vendorId}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            Not Assigned
                          </span>
                        )}

                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>

          {/* PAGINATION */}
          <div className="flex justify-center gap-2 mt-4">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-3 py-1">
              Page {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}