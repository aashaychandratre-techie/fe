"use client";

import { useEffect, useMemo, useState } from "react";
import axios from "axios";

export default function AdminComplaintsPage() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const res = await axios.get("http://localhost:8080/complaints");
      setComplaints(res.data);
    } finally {
      setLoading(false);
    }
  };

  const resolveComplaint = async (id: number) => {
    await axios.put(`http://localhost:8080/complaints/resolve/${id}`);

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "RESOLVED" } : c
      )
    );
  };

  const rejectComplaint = async (id: number) => {
    await axios.put(`http://localhost:8080/complaints/reject/${id}`);

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "REJECTED" } : c
      )
    );
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

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] p-4 sm:p-6">

      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-emerald-600">
          Complaint Management
        </h1>
        <p className="text-gray-500">
          Manage service complaints and reports
        </p>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">

        <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm">
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-xl font-bold">{total}</p>
        </div>

        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <p className="text-amber-600 text-sm">Open</p>
          <p className="text-xl font-bold text-amber-600">{open}</p>
        </div>

        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <p className="text-emerald-600 text-sm">Resolved</p>
          <p className="text-xl font-bold text-emerald-600">{resolved}</p>
        </div>

        <div className="bg-white border p-4 rounded-xl shadow-sm">
          <p className="text-red-600 text-sm">Rejected</p>
          <p className="text-xl font-bold text-red-600">{rejected}</p>
        </div>

      </div>

      {/* FILTER */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">

        <input
          placeholder="Search complaints..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-400 w-full sm:w-1/3"
        />

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-emerald-400"
        >
          <option value="ALL">All Types</option>
          <option value="SERVICE_COMPLAINT">Service Complaint</option>
          <option value="REVIEW_REPORT">Review Report</option>
        </select>

      </div>

      {/* LOADING */}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : filtered.length === 0 ? (
        <p className="text-center text-gray-500">No complaints found</p>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-x-auto">

          <table className="min-w-[900px] w-full text-sm">

            <thead className="bg-emerald-50 text-emerald-700">
              <tr>
                <th className="p-3 border">Type</th>
                <th className="p-3 border">Subject</th>
                <th className="p-3 border">Message</th>
                <th className="p-3 border">Status</th>
                <th className="p-3 border">Action</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-emerald-50 transition">

                  {/* TYPE */}
                  <td className="p-3 border text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      c.type === "REVIEW_REPORT"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-blue-100 text-blue-700"
                    }`}>
                      {c.type}
                    </span>
                  </td>

                  {/* SUBJECT */}
                  <td className="p-3 border text-center font-medium">
                    {c.subject}
                  </td>

                  {/* MESSAGE */}
                  <td className="p-3 border text-center text-gray-600">
                    <div className="max-w-[250px] truncate mx-auto">
                      {c.message}
                    </div>
                  </td>

                  {/* STATUS */}
                  <td className="p-3 border text-center">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      c.status === "RESOLVED"
                        ? "bg-emerald-100 text-emerald-700"
                        : c.status === "REJECTED"
                        ? "bg-red-100 text-red-600"
                        : "bg-amber-100 text-amber-700"
                    }`}>
                      {c.status}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="p-3 border text-center">
                    {c.status === "OPEN" ? (
                      <div className="flex justify-center gap-2">

                        <button
                          onClick={() => resolveComplaint(c.id)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 text-xs rounded-lg"
                        >
                          Resolve
                        </button>

                        <button
                          onClick={() => rejectComplaint(c.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 text-xs rounded-lg"
                        >
                          Reject
                        </button>

                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">
                        No Action
                      </span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}

    </div>
  );
}