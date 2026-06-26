"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  CalendarDays,
  MapPin,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import API from "@/services/api";

type Booking = {
  id: number;
  serviceName: string;
  bookingDate: string;
  address: string;
  amount: number;
  otp: string | null;
  status: string;
};

export default function CustomerBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      const res = await API.get(
        `/bookings/customer/${user.id}`
      );

      setBookings(res.data);
      console.log("user bookings data", res.data)
      // setCurrentPage(1);
    } catch (err) {
      console.log(err);
      setError("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(
    bookings.length / itemsPerPage
  );

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const currentBookings = bookings.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#F5FBF7] p-5 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="w-11 h-11 bg-white rounded-xl shadow flex items-center justify-center hover:bg-emerald-50"
          >
            <ArrowLeft
              size={20}
              className="text-emerald-600"
            />
          </button>

          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              My Bookings
            </h1>

            <p className="text-sm text-gray-500">
              Manage your service requests
            </p>
          </div>
        </div>

        <button
          onClick={fetchBookings}
          className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-500"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
        {loading && (
          <div className="p-10 text-center text-gray-500">
            Loading bookings...
          </div>
        )}

        {error && (
          <div className="p-6 text-center text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-emerald-50">
                <tr className="text-left text-sm text-gray-700">
                  <th className="p-4">Service</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">OTP</th>
                </tr>
              </thead>

              <tbody>
                {currentBookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="p-10 text-center text-gray-400"
                    >
                      No Bookings Found
                    </td>
                  </tr>
                ) : (
                  currentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-t hover:bg-emerald-50/40"
                    >
                      <td className="p-4 font-semibold text-gray-800">
                        {booking.serviceName || "Service"}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <CalendarDays
                            size={17}
                            className="text-emerald-600"
                          />

                          {new Date(
                            booking.bookingDate
                          ).toLocaleDateString()}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2 max-w-xs">
                          <MapPin
                            size={17}
                            className="text-red-500"
                          />

                          <span className="truncate">
                            {booking.address}
                          </span>
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1 font-bold text-emerald-600">
                          <IndianRupee size={16} />
                          {booking.amount}
                        </div>
                      </td>

                      <td className="p-4">
                        <span
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
                            booking.status === "COMPLETED"
                              ? "bg-emerald-100 text-emerald-700"
                              : booking.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>

                      <td className="p-4">
                        {booking.otp ? (
                          <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-xl w-fit font-bold">
                            <ShieldCheck size={17} />
                            {booking.otp}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-sm">
                            Waiting...
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {!loading &&
          !error &&
          bookings.length > itemsPerPage && (
            <div className="flex justify-center items-center gap-4 p-4 border-t">
              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.max(1, p - 1)
                  )
                }
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50"
              >
                Previous
              </button>

              <span className="font-medium text-gray-700">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() =>
                  setCurrentPage((p) =>
                    Math.min(totalPages, p + 1)
                  )
                }
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg bg-emerald-600 text-white disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
      </div>
    </div>
  );
}