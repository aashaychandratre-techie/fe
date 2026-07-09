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
  Search,
} from "lucide-react";
import API from "@/services/api";
import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerNavbar from "@/components/CustomerNavbar";
type Booking = {
  id: number;
  serviceName: string;
  bookingDate: string;
  address: string;
  amount: number;
  otp: string | null;
  status: string;

  bookingTime?: string;
  customerName?: string;
  phoneNumber?: string;
  vendorName?: string;
  paymentMethod?: string;
};

export default function CustomerBookingsPage() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({});

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [showAddressModal, setShowAddressModal] = useState(false); 
 

const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
const [showDetailsModal, setShowDetailsModal] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
    fetchBookings();
  }, []);

  const userName = user.fullName || "Customer";
  const firstLetter = userName.charAt(0).toUpperCase();

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


const filteredBookings = bookings.filter((booking) => {
  const search = searchTerm.toLowerCase().trim();

  const bookingDate = new Date(booking.bookingDate)
    .toLocaleDateString("en-GB") // dd/mm/yyyy
    .toLowerCase();

  return (
    booking.serviceName?.toLowerCase().includes(search) ||
    booking.status?.toLowerCase().includes(search) ||
    booking.address?.toLowerCase().includes(search) ||
    bookingDate.includes(search)
  );
});
  
const totalPages = Math.ceil(
  filteredBookings.length / itemsPerPage
);

const startIndex =
  (currentPage - 1) * itemsPerPage;

const currentBookings = filteredBookings.slice(
  startIndex,
  startIndex + itemsPerPage
);

  return (
    <div
      className={`h-screen flex font-sans overflow-hidden ${
        darkMode ? "bg-[#071A12] text-white" : "bg-[#F3FBF6] text-gray-900"
      }`}
    >
      <CustomerSidebar
        darkMode={darkMode}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-0 min-w-0 relative">
        {/* Premium Blur Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <CustomerNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          firstLetter={firstLetter}
        />

        <main className="flex-1 overflow-y-auto p-5 lg:p-8 relative z-10">
         <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">

  <div>
   <h1
  className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${
    darkMode
      ? "bg-gradient-to-r from-white to-emerald-300 bg-clip-text text-transparent"
      : "text-emerald-900"
  }`}
>
  My Bookings
</h1>

<p
  className={`text-sm mt-1 ${
    darkMode ? "text-gray-400" : "text-gray-500"
  }`}
>
  Manage your service requests
</p>
  </div>

  <div className="flex-1 flex justify-center">
    <div className="relative w-full max-w-md">
      <Search
        size={18}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
      />

      <input
        type="text"
        placeholder="Search service, status, date, place..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 py-3 focus:outline-none"
      />
    </div>
  </div>

  <button
    onClick={fetchBookings}
    className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-500 shadow-sm"
  >
    <RefreshCw size={16} />
    Refresh
  </button>


      </div>

      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 overflow-hidden">
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
            <table className="w-full whitespace-nowrap">
              <thead className="bg-emerald-50">
                <tr className="text-left text-sm text-gray-700">
                  <th className="p-4">Service</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Address</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">OTP</th>
                  <th className="p-4 text-center">Details</th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.length === 0? (
                  <tr>
                    <td
                      colSpan={7}
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

                     <td
  className={`p-4 ${
    darkMode ? "text-white" : "text-gray-700"
  }`}
>
  <div className="flex items-center gap-2">
    <CalendarDays
      size={17}
      className="text-emerald-600"
    />

    <span>
      {new Date(
        booking.bookingDate
      ).toLocaleDateString()}
    </span>
    
  </div>
</td><td className="p-4 max-w-xs">
  <div className="flex items-center gap-2">
    <MapPin
      size={17}
      className="text-red-500 flex-shrink-0"
    />

    <span
      className="block max-w-[180px] truncate text-gray-700"
      title={booking.address}
    >
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
                      <td className="p-4 text-center">
  <button
    onClick={() => {
      setSelectedBooking(booking);
      setShowDetailsModal(true);
    }}
    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
  >
    Show Details
  </button>
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
          filteredBookings.length > itemsPerPage && (
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
      </div>{showDetailsModal && selectedBooking && (
 <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden">

   {/* Header */}
<div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white px-8 py-6 flex justify-between items-center">
  <div>
    <h2 className="text-2xl font-bold">
      Booking Details
    </h2>

    <p className="text-emerald-100 text-sm mt-1">
      Complete booking information
    </p>
  </div>

  <div className="bg-white/20 px-4 py-2 rounded-full font-semibold">
    Booking ID: {selectedBooking.id}
  </div>
</div>
    <div className="p-8">

      <div className="grid md:grid-cols-2 gap-5">

        {/* Service */}
        <div className="bg-gray-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-500 text-sm">
            Service
          </p>

          <p className="text-lg font-bold text-gray-800 mt-1">
            {selectedBooking.serviceName}
          </p>
        </div>

        {/* Status */}
        <div className="bg-gray-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-500 text-sm">
            Status
          </p>

          <span
            className={`inline-flex mt-2 px-4 py-2 rounded-full text-sm font-semibold
            ${
              selectedBooking.status === "COMPLETED"
                ? "bg-green-100 text-green-700"
                : selectedBooking.status === "PENDING"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-blue-100 text-blue-700"
            }`}
          >
            {selectedBooking.status}
          </span>
        </div>

        {/* Booking Date */}
        <div className="bg-gray-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-500 text-sm">
            Booking Date
          </p>

          <p className="font-semibold mt-1">
            {new Date(
              selectedBooking.bookingDate
            ).toLocaleDateString()}
          </p>
        </div>

        {/* Amount */}
        <div className="bg-gray-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-500 text-sm">
            Amount
          </p>

          <p className="text-2xl font-bold text-emerald-600 mt-1">
            ₹ {selectedBooking.amount}
          </p>
        </div>

        {/* OTP */}
        <div className="bg-gray-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-500 text-sm">
            Verification OTP
          </p>

          <p className="text-xl font-bold tracking-widest text-blue-600 mt-1">
            {selectedBooking.otp || "Waiting..."}
          </p>
        </div>

        {/* Address */}
        <div className="bg-gray-50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300">
          <p className="text-gray-500 text-sm">
            Service Address
          </p>

          <p className="font-medium text-gray-800 mt-2 break-words">
            {selectedBooking.address}
          </p>
        </div>

      </div>

      <div className="flex justify-end mt-8">

        <button
          onClick={() => setShowDetailsModal(false)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200"
        >
          Close
        </button>

      </div>

    </div>

  </div>
</div>
)}
        </main>
      </div>
    </div>
  );
} 