"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock, IndianRupee, Plus } from "lucide-react";

import API from "@/services/api";
import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerNavbar from "@/components/CustomerNavbar";

export default function CustomerDashboard() {
  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [bookings, setBookings] = useState<any[]>([]);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [completedBookingId, setCompletedBookingId] = useState<string | null>(null);

  const hasActiveJobsRef = useRef(false);
  const notifiedBookingsRef = useRef<Set<string>>(new Set());

  const [user,setUser] = useState<any>({});

useEffect(()=>{
  const storedUser = localStorage.getItem("user");

  if(storedUser){
    setUser(JSON.parse(storedUser));
  }
},[]);

  const userName = user.fullName || "Customer";
  const firstLetter = userName.charAt(0).toUpperCase();

  const fetchBookings = async () => {
 if(!user?.id){
    console.log("User ID missing");
    return;
  }
    try {
      const res = await API.get(`/bookings/customer/${user.id}`);
      const data = res.data;

      setBookings(data);

      hasActiveJobsRef.current = data.some(
        (b: any) => b.status !== "COMPLETED" && b.status !== "REJECTED"
      );

      const unrated = data.find(
        (b: any) => b.status === "COMPLETED" && b.rated === false
      );

      if (unrated && !notifiedBookingsRef.current.has(unrated.id)) {
        notifiedBookingsRef.current.add(unrated.id);
        setCompletedBookingId(unrated.id);
        setShowRatingPopup(true);

        setTimeout(() => setShowRatingPopup(false), 5000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user?.id) fetchBookings();
  }, [user?.id]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (hasActiveJobsRef.current) fetchBookings();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const totalBookings = bookings.length;

  const completedBookings = bookings.filter(
    (b) => b.status === "COMPLETED"
  ).length;

  const pendingBookings = bookings.filter(
    (b) => b.status !== "COMPLETED" && b.status !== "REJECTED"
  ).length;

  const totalPayments = bookings.reduce(
    (sum, b) => sum + (b.amount || 0),
    0
  );

  return (
    <div
      className={`h-screen flex overflow-hidden ${
        darkMode ? "bg-[#071A12] text-white" : "bg-[#F3FBF6] text-gray-900"
      }`}
    >
      <CustomerSidebar
        darkMode={darkMode}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col min-h-0 min-w-0 relative">

        <CustomerNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          firstLetter={firstLetter}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10 space-y-8 relative z-10">

          {/* HEADER */}
          <div className="flex justify-end mb-4">
            {/* BUTTON WITH ENHANCED HOVER & SHADOW */}
            <button
              onClick={() => router.push("/customer/services")}
              className="
                group
                flex items-center gap-2
                bg-emerald-600
                hover:bg-emerald-500
                text-white
                px-6 py-3
                rounded-full
                shadow-[0_4px_14px_0_rgba(16,185,129,0.39)]
                hover:shadow-[0_6px_20px_rgba(16,185,129,0.23)]
                transition-all duration-300
                font-medium
              "
            >
           <Plus className="w-5 h-5 transition-all duration-300" />
              New Booking
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="relative p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {totalBookings}
                  </h2>
                </div>
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                  <CalendarDays className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="relative p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Completed</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {completedBookings}
                  </h2>
                </div>
                <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="relative p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Pending</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {pendingBookings}
                  </h2>
                </div>
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                  <Clock className="w-6 h-6" />
                </div>
              </div>
            </div>

            <div className="relative p-6 rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">Total Spent</p>
                  <h2 className="text-3xl font-bold text-emerald-600">
                    ₹{totalPayments}
                  </h2>
                </div>
                <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                  <IndianRupee className="w-6 h-6" />
                </div>
              </div>
            </div>

          </div>

          {/* RECENT BOOKINGS */}
          <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Recent Activity
              </h2>
              <button 
                onClick={() => router.push("/customer/bookings")} 
                className="text-sm font-medium text-emerald-600 hover:text-emerald-700 transition"
              >
                View all
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <CalendarDays className="w-10 h-10 text-emerald-200" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">No bookings yet</h3>
                <p className="text-gray-500 mt-1 max-w-sm">When you book a service, it will show up here.</p>
              </div>
            ) : (
              <div className="space-y-4">
               {bookings.slice(0, 4).map((b: any) => (
                  <div
                    key={b.id}
                    className="
                      p-5
                      rounded-2xl
                      bg-gray-50/50
                      border border-gray-100
                      hover:shadow-md
                      hover:-translate-y-1
                      hover:bg-white
                      transition-all duration-300
                      flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      group
                    "
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-lg group-hover:scale-110 transition-transform">
                        {b.serviceName ? b.serviceName.charAt(0).toUpperCase() : "S"}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-gray-900">
                          {b.serviceName || "Service"}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                          <span className="flex items-center gap-1">
                            <CalendarDays className="w-4 h-4" />
                            {b.bookingDate || "N/A"}
                          </span>
                          <span>•</span>
                          <span>{b.providerName || "Pending Assign"}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                      <p className="font-bold text-emerald-600 text-lg">
                        ₹{b.amount || 0}
                      </p>
                      <span
                        className={`
                          text-xs
                          px-3
                          py-1
                          rounded-full
                          font-bold tracking-wide uppercase
                          ${
                            b.status === "COMPLETED"
                              ? "bg-green-100 text-green-700"
                              : b.status === "PENDING"
                              ? "bg-yellow-100 text-yellow-700"
                              : b.status === "ASSIGNED"
                              ? "bg-blue-100 text-blue-700"
                              : b.status === "REJECTED"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }
                        `}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* RATING POPUP */}
      {showRatingPopup && completedBookingId && (
        <div className="fixed bottom-6 right-6 z-50">

          <div className="bg-white rounded-2xl shadow-xl p-5 w-[calc(100vw-3rem)] sm:w-[320px]">

            <h3 className="font-semibold text-emerald-700">
              Rate your service
            </h3>

            <p className="text-sm text-gray-500 mb-3">
              Booking completed successfully
            </p>

            <button
              onClick={() =>
                router.push(
                  `/customer/ratings?bookingId=${completedBookingId}`
                )
              }
              className="
                w-full
                bg-emerald-600
                hover:bg-emerald-400
                text-white
                py-2
                rounded-xl
                transition
              "
            >
              Give Rating
            </button>

          </div>

        </div>
      )}

    </div>
  );
}