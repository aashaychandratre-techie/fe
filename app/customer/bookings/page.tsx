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
  X,
  Briefcase,
  Activity
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
  const itemsPerPage = 5;

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

        <div className="md:hidden">
          <CustomerNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setSidebarOpen={setSidebarOpen}
            userName={userName}
            firstLetter={firstLetter}
          />
        </div>
        {/* Premium Blur Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        <main className="flex-1 overflow-y-auto p-5 lg:p-8 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-emerald-900"}`}>
                My Bookings
              </h1>
              <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                Manage your service requests
              </p>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="relative w-full max-w-md">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search service, status, date, place..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 py-3 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              onClick={fetchBookings}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-xl hover:bg-emerald-500 shadow-sm cursor-pointer"
            >
              <RefreshCw size={16} />
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
                      <th className="p-4">Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">OTP</th>
                      <th className="p-4 text-center">Details</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-gray-400">
                          No Bookings Found
                        </td>
                      </tr>
                    ) : (
                      currentBookings.map((booking) => (
                        <tr key={booking.id} className="border-t hover:bg-emerald-50/40">
                          <td className="p-4 font-semibold text-gray-800">
                            {booking.serviceName || "Service"}
                          </td>
                          <td className={`p-4 ${darkMode ? "text-white" : "text-gray-700"}`}>
                            <div className="flex items-center gap-2">
                              <CalendarDays size={17} className="text-emerald-600" />
                              <span>{new Date(booking.bookingDate).toLocaleDateString()}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-1 font-bold text-emerald-600">
                              <IndianRupee size={16} />
                              {booking.amount}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${
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
                              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-2">
                                <ShieldCheck size={16} className="text-emerald-600" />
                                <span className="font-bold text-emerald-700 tracking-[0.2em]">
                                  {booking.otp}
                                </span>
                              </div>
                            ) : (
                              <span className="text-gray-400 text-sm">Waiting...</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowDetailsModal(true);
                              }}
                              className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shadow-sm text-sm font-semibold transition-all duration-200 cursor-pointer"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          {!loading && !error && filteredBookings.length > itemsPerPage && (
            <div className="flex items-center justify-between px-6 py-5 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Showing <span className="font-semibold">{currentPage}</span> of{" "}
                <span className="font-semibold">{totalPages || 1}</span> pages
              </p>

              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition cursor-pointer ${
                    currentPage === 1
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                >
                  ←
                </button>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className={`w-10 h-10 rounded-full border flex items-center justify-center transition cursor-pointer ${
                    currentPage === totalPages
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-emerald-50 hover:border-emerald-300"
                  }`}
                >
                  →
                </button>
              </div>
            </div>
          )}

          {/* ===== HIGHLY UNIFORM, SMOOTH & WIDE POP-UP ===== */}
          {showDetailsModal && selectedBooking && (
            <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-all duration-300 ease-in-out animate-in fade-in">
              <div className="bg-white rounded-3xl shadow-2xl w-full max-w-[600px] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-300 ease-out">
                
                {/* Modal Header */}
                <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center bg-white">
                  <h2 className="text-lg font-bold text-gray-900">Booking Details</h2>
                  <button 
                    onClick={() => setShowDetailsModal(false)} 
                    className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-400 hover:text-gray-800 cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal Body - 2 Column Grid, Uniform Fonts, Normal Price */}
                <div className="px-6 py-6 bg-white">
                    <div className="grid grid-cols-2 gap-y-6 gap-x-8">
                      
                      {/* ID */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-[14px] font-medium mb-1">Booking ID</span>
                        <span className="font-semibold text-gray-900 text-[14px]">{selectedBooking.id}</span>
                      </div>

                      {/* Service */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-[14px] font-medium mb-1">Service Name</span>
                        <span className="font-semibold text-gray-900 text-[14px]">{selectedBooking.serviceName}</span>
                      </div>

                      {/* Status */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-[14px] font-medium mb-1">Status</span>
                        <span className="font-semibold text-gray-900 text-[14px] capitalize">{selectedBooking.status.toLowerCase()}</span>
                      </div>

                      {/* Date */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-[14px] font-medium mb-1">Service Date</span>
                        <span className="font-semibold text-gray-900 text-[14px]">
                          {new Date(selectedBooking.bookingDate).toLocaleDateString("en-GB", { 
                            day: 'numeric', month: 'short', year: 'numeric' 
                          })}
                        </span>
                      </div>

                      {/* OTP */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-[14px] font-medium mb-1">OTP</span>
                        <span className="font-semibold text-gray-900 text-[14px]">
                          {selectedBooking.otp || "Pending"}
                        </span>
                      </div>

                      {/* Amount (Normal, Uniform) */}
                      <div className="flex flex-col">
                        <span className="text-gray-500 text-[14px] font-medium mb-1">Total Amount</span>
                        <span className="font-semibold text-gray-900 text-[14px]">₹{selectedBooking.amount}</span>
                      </div>

                      {/* Address (Full Width) */}
                      <div className="col-span-2 flex flex-col">
                        <span className="text-gray-500 text-[14px] font-medium mb-1">Service Address</span>
                        <span className="font-semibold text-gray-900 text-[14px] leading-relaxed">
                          {selectedBooking.address}
                        </span>
                      </div>
                    </div>
                </div>

                {/* Modal Footer */}
                <div className="px-6 py-4 flex justify-end gap-3 bg-white border-t border-gray-100">
                  <button
                    onClick={() => router.push(`/customer/complaints?bookingId=${selectedBooking.id}`)}
                    className="px-5 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Raise Complaint
                  </button>

                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="px-6 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-colors cursor-pointer"
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