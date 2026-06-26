"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  // Popup State
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        "http://localhost:8080/api/admin/customers"
      );

      const data = Array.isArray(res.data)
        ? res.data
        : res.data?.data || res.data?.customers || [];

      setCustomers(data);
    } catch (err) {
      console.log(err);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = useMemo(() => {
    let data = [...customers];

    if (search.trim() !== "") {
      data = data.filter(
        (c) =>
          (c.name || c.fullName || c.customerName || "")
            .toLowerCase()
            .includes(search.toLowerCase()) ||
          (c.email || "").toLowerCase().includes(search.toLowerCase())
      );
    }

    if (filter === "ACTIVE") {
      data = data.filter((c) => (c.bookingCount || 0) >= 3);
    } else if (filter === "NEW") {
      data = data.filter((c) => {
        if (!c.createdAt) return false;

        const diff =
          (new Date().getTime() - new Date(c.createdAt).getTime()) /
          (1000 * 60 * 60 * 24);

        return diff <= 7;
      });
    } else if (filter === "INACTIVE") {
      data = data.filter((c) => (c.bookingCount || 0) === 0);
    }

    return data;
  }, [customers, search, filter]);

  return (
  <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
    
 <AdminSidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
 />

    <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
      <AdminNavbar />

     <main className="flex-1 overflow-auto bg-[#F9FAFB] p-6">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">

        <h1 className="text-2xl font-bold text-emerald-600">
          Customers
        </h1>

        <div className="flex flex-col sm:flex-row gap-2">

          <input
            type="text"
            placeholder="Search customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="NEW">New</option>
            <option value="INACTIVE">Inactive</option>
            <option value="NORMAL">Normal</option>
          </select>

        </div>
      </div>

      {/* TABLE */}
      <div className="w-full bg-white rounded-2xl shadow-md border border-gray-100 overflow-x-auto">

        <table className="w-full text-sm">

          <thead className="bg-emerald-50 text-emerald-700">
            <tr>
              <th className="p-3 border">Name</th>
              <th className="p-3 border">Email</th>
              <th className="p-3 border">Phone</th>
              <th className="p-3 border">Activity</th>
            </tr>
          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-5 text-center text-gray-500"
                >
                  Loading...
                </td>
              </tr>
            ) : filteredCustomers.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="p-5 text-center text-gray-500"
                >
                  No customers found
                </td>
              </tr>
            ) : (
              filteredCustomers.map((c: any, i: number) => (
                <tr
                  key={c.id || i}
                  className="hover:bg-emerald-50 transition"
                >
                  <td
                    className="p-3 border font-medium text-emerald-600 cursor-pointer hover:underline"
                    onDoubleClick={() => setSelectedCustomer(c)}
                  >
                    {c.name ||
                      c.fullName ||
                      c.customerName ||
                      "N/A"}
                  </td>

                  <td className="p-3 border">
                    {c.email || "N/A"}
                  </td>

                  <td className="p-3 border">
                    {c.mobileNumber ||
                      c.phone ||
                      "N/A"}
                  </td>

                  <td className="p-3 border">

                    {(c.bookingCount || 0) >= 3 ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                        Active
                      </span>
                    ) : (c.bookingCount || 0) === 0 ? (
                      <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-600">
                        Inactive
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs bg-amber-100 text-amber-700">
                        Normal
                      </span>
                    )}

                  </td>
                </tr>
              ))
            )}

          </tbody>
        </table>
      </div>
     {/* CUSTOMER DETAILS POPUP */}
      {selectedCustomer && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setSelectedCustomer(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-[95%] max-w-md p-6 relative animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedCustomer(null)}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-red-500 transition"
            >
              ×
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-emerald-600">
                Customer Details
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Customer information
              </p>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-2">
  <span className="font-medium text-gray-500">Customer ID</span>
  <span className="font-semibold">
    {selectedCustomer.id ?? "-"}
  </span>
</div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-500">Name</span>
                <span className="font-semibold text-right">
                  {selectedCustomer.name ||
                    selectedCustomer.fullName ||
                    selectedCustomer.customerName ||
                    "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-500">Email</span>
                <span className="text-right break-all">
                  {selectedCustomer.email || "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-500">Phone</span>
                <span>
                  {selectedCustomer.mobileNumber ||
                    selectedCustomer.phone ||
                    "N/A"}
                </span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-500">
                  Total Bookings
                </span>
                <span>{selectedCustomer.bookingCount || 0}</span>
              </div>

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium text-gray-500">
                  Joined On
                </span>
                <span>
                  {selectedCustomer.createdAt
                    ? new Date(
                        selectedCustomer.createdAt
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-500">
                  Status
                </span>

                {(selectedCustomer.bookingCount || 0) >= 3 ? (
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-medium">
                    Active
                  </span>
                ) : (selectedCustomer.bookingCount || 0) === 0 ? (
                  <span className="px-3 py-1 rounded-full bg-red-100 text-red-600 text-sm font-medium">
                    Inactive
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-medium">
                    Normal
                  </span>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-5 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
          </main>
    </div>
  </div>
);
}