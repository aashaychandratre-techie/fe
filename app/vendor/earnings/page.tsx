"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";

export default function VendorDeskPage() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");

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
    <div className="flex h-screen bg-gray-50 dark:bg-[#0b1220] text-[14px]">

      {/* SIDEBAR */}
      <VendorSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col overflow-hidden">

        <VendorNavbar setOpen={setOpen} />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Vendor Desk
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Manage your work & earnings
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-2 mb-6 flex-wrap">

            {["active", "completed", "earnings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition
                ${
                  activeTab === tab
                    ? "bg-emerald-500 text-white"
                    : "bg-white dark:bg-[#1e293b] dark:text-white"
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* ACTIVE */}
          {activeTab === "active" && (
            <div className="space-y-4">

              {activeWorks.length === 0 ? (
                <p className="text-gray-500">No active work</p>
              ) : (
                activeWorks.map((work) => (
                  <div
                    key={work.id}
                    className="bg-white dark:bg-[#1e293b] p-5 rounded-2xl shadow flex justify-between items-center"
                  >

                    {/* LEFT */}
                    <div>
                      {/* SERVICE NAME */}
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {work.service?.name || work.serviceName || "Service"}
                      </p>

                      {/* DATE */}
                      <p className="text-sm text-gray-500 mt-1">
                        {work.bookingDate || "N/A"}
                      </p>

                      {/* AMOUNT */}
                      <p className="text-sm text-green-600 font-semibold mt-1">
                        ₹{work.amount}
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="flex gap-2">
                      <input
                        value={otpValues[work.id] || ""}
                        onChange={(e) =>
                          setOtpValues({
                            ...otpValues,
                            [work.id]: e.target.value,
                          })
                        }
                        placeholder="OTP"
                        className="px-3 py-2 rounded-lg border dark:bg-[#0b1220] dark:border-gray-700"
                      />

                      <button
                        onClick={() => verifyOtp(work.id)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg"
                      >
                        Verify
                      </button>
                    </div>

                  </div>
                ))
              )}

            </div>
          )}

          {/* COMPLETED */}
          {activeTab === "completed" && (
            <div className="space-y-3">

              {completedWorks.map((w) => (
                <div
                  key={w.id}
                  className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow flex justify-between"
                >

                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {w.service?.name || w.serviceName || "Service"}
                    </p>

                    <p className="text-sm text-gray-500">
                      {w.bookingDate || "N/A"}
                    </p>
                  </div>

                  <span className="text-green-600 bg-green-100 px-3 py-1 rounded-lg text-sm">
                    Done
                  </span>

                </div>
              ))}

            </div>
          )}

          {/* EARNINGS */}
          {activeTab === "earnings" && (
            <div className="space-y-5">

              {/* STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow">
                  <p className="text-gray-500 text-sm">Total Earnings</p>
                  <h2 className="text-2xl font-bold text-emerald-500">
                    ₹{totalEarnings}
                  </h2>
                </div>

                <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow">
                  <p className="text-gray-500 text-sm">Completed Jobs</p>
                  <h2 className="text-2xl font-bold text-indigo-500">
                    {completedWorks.length}
                  </h2>
                </div>

              </div>

              {/* LIST */}
              <div className="bg-white dark:bg-[#1e293b] p-4 rounded-2xl shadow">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">
                  Recent Earnings
                </h3>

                <div className="space-y-2">

                  {earnings.map((e) => (
                    <div
                      key={e.id}
                      className="flex justify-between border-b pb-2 dark:border-gray-700"
                    >

                      <div>
                        <p className="text-gray-700 dark:text-white font-medium">
                          {e.service?.name || e.serviceName || "Service"}
                        </p>

                        <p className="text-xs text-gray-500">
                          {e.bookingDate || "N/A"}
                        </p>
                      </div>

                      <span className="text-emerald-500 font-semibold">
                        ₹{e.amount}
                      </span>

                    </div>
                  ))}

                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}