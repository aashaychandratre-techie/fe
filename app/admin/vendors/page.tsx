"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

import API from "@/services/api";
import AdminSidebar from "@/components/AdminSidebar";
import AdminNavbar from "@/components/AdminNavbar";

export default function AdminVendorsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 7;

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

  return (
    <div className="flex h-screen bg-[#F9FAFB] overflow-hidden">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col lg:ml-64 overflow-hidden">
        <AdminNavbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <main className="flex-1 overflow-auto p-6">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-5">
            <h1 className="text-2xl font-bold text-emerald-600">
              Vendors
            </h1>

            <div className="flex gap-2">
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search vendor..."
                className="px-3 py-2 border rounded-lg text-sm"
              />

              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-3 py-2 border rounded-lg text-sm"
              >
                <option value="ALL">All</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="BLOCKED">Blocked</option>
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-2xl shadow border overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-emerald-50 text-emerald-700">
                <tr>
                  <th className="p-3 border">Name</th>
                  <th className="p-3 border">Email</th>
                  <th className="p-3 border">Phone</th>
                  <th className="p-3 border">Status</th>
                  <th className="p-3 border">Ratings</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-5 text-center">
                      Loading...
                    </td>
                  </tr>
                ) : currentData.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-5 text-center">
                      No vendors found
                    </td>
                  </tr>
                ) : (
                  currentData.map((v) => (
                    <tr key={v.id} className="hover:bg-emerald-50">

                      {/* NAME */}
                      <td
                        className="p-3 border font-medium text-emerald-600 cursor-pointer"
                        onDoubleClick={() => openVendorDetails(v)}
                      >
                        {v.name}
                      </td>

                      <td className="p-3 border">{v.email}</td>
                      <td className="p-3 border">{v.phone}</td>

                      <td className="p-3 border">
                        {v.status || "PENDING"}
                      </td>

                      {/* RATING (ONLY RATINGS MODAL) */}
                      <td
                        className="p-3 border cursor-pointer"
                        onClick={() => openVendorRatings(v)}
                      >
                        {v.averageRating !== null &&
                        v.averageRating !== undefined ? (
                          <div className="flex items-center gap-1 font-semibold text-emerald-600">
                            ⭐ {Number(v.averageRating).toFixed(1)}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">
                            0.0
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
          <div className="flex justify-center gap-2 mt-5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Prev
            </button>

            <span className="px-4 py-2">
              {currentPage} / {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>

          {/* MODAL */}
          {showVendorModal && selectedVendor && modalType && (
            <div
              className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
              onClick={() => setShowVendorModal(false)}
            >
              <div
                className="bg-white w-[600px] max-h-[650px] rounded-2xl p-6"
                onClick={(e) => e.stopPropagation()}
              >

                {/* DETAIL MODAL */}
                {modalType === "DETAIL" && (
                  <>
                    <h2 className="text-xl font-bold text-emerald-600 mb-4">
                      Vendor Details
                    </h2>

                    <div className="space-y-4">
                      <div className="flex justify-between border-b pb-2">
                        <span>Vendor ID</span>
                        <span>{selectedVendor.id}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span>Name</span>
                        <span>{selectedVendor.name}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span>Email</span>
                        <span>{selectedVendor.email}</span>
                      </div>

                      <div className="flex justify-between border-b pb-2">
                        <span>Phone</span>
                        <span>{selectedVendor.phone}</span>
                      </div>
                    </div>
                  </>
                )}

                {/* RATINGS MODAL */}
                {modalType === "RATINGS" && (
                  <>
                    <h2 className="text-xl font-bold text-emerald-600 mb-4">
                      Vendor Ratings
                    </h2>

                    <div className="max-h-[400px] overflow-y-auto space-y-2">
                      {selectedVendorRatings.length === 0 ? (
                        <p className="text-gray-400 text-center">
                          No ratings
                        </p>
                      ) : (
                        selectedVendorRatings.map((r: any) => (
                          <div key={r.id} className="border p-3 rounded">
                            ⭐ {r.rating}/5
                            <p className="text-sm">{r.review}</p>
                            <p className="text-xs text-gray-400">
                              {r.customerName}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )}

                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() => setShowVendorModal(false)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
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