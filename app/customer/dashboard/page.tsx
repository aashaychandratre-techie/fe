"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

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
      className={`min-h-screen flex ${
        darkMode ? "bg-[#071A12] text-white" : "bg-[#F3FBF6] text-gray-900"
      }`}
    >
      <CustomerSidebar
        darkMode={darkMode}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col">

        <CustomerNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          firstLetter={firstLetter}
        />

        <main className="p-6 lg:p-10 space-y-8">

          {/* HEADER (Hello removed as requested) */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">


            {/* BUTTON WITH LIGHT GREEN HOVER */}
            <button
              onClick={() => router.push("/customer/services")}
              className="
                bg-emerald-600
                hover:bg-emerald-400
                text-white
                px-5 py-2
                rounded-xl
                shadow-md
                transition
              "
            >
              + New Booking
            </button>

          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">

            <div className="p-4 rounded-2xl bg-white border shadow-sm">
              <p className="text-sm text-gray-500">Total</p>
              <h2 className="text-2xl font-bold text-emerald-700">
                {totalBookings}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-white border shadow-sm">
              <p className="text-sm text-gray-500">Completed</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {completedBookings}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-white border shadow-sm">
              <p className="text-sm text-gray-500">Pending</p>
              <h2 className="text-2xl font-bold text-gray-900">
                {pendingBookings}
              </h2>
            </div>

            <div className="p-4 rounded-2xl bg-white border shadow-sm">
              <p className="text-sm text-gray-500">Payments</p>
              <h2 className="text-2xl font-bold text-gray-900">
                ₹{totalPayments}
              </h2>
            </div>

          </div>

          {/* RECENT BOOKINGS */}
<div className="bg-white border rounded-2xl p-5 shadow-sm">

  <h2 className="font-semibold text-emerald-700 mb-4">
    Recent Bookings
  </h2>

  {bookings.length === 0 ? (
    <p className="text-center text-gray-500 py-6">
      No bookings found
    </p>
  ) : (
    <div className="space-y-3">

      {bookings.slice(0, 5).map((b: any) => (
        <div
          key={b.id}
          className="
            p-4
            rounded-xl
            border
            hover:bg-green-50
            transition
            flex
            justify-between
            items-center
          "
        >

          <div className="space-y-1">

            <p className="font-semibold text-gray-900">
              {b.serviceName || "Service"}
            </p>

            <p className="text-xs text-gray-400">
              Booking ID: {b.id}
            </p>

            <p className="text-sm text-gray-600">
              Provider: {b.providerName || "Not Assigned"}
            </p>

            <p className="text-sm text-gray-500">
              Date: {b.bookingDate || "N/A"}
            </p>

            <p className="text-sm font-medium text-emerald-600">
              Amount: ₹{b.amount || 0}
            </p>

          </div>

          <span
            className={`
              text-xs
              px-3
              py-1
              rounded-full
              font-medium
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
      ))}

    </div>
  )}

</div>
        </main>
      </div>

      {/* RATING POPUP */}
      {showRatingPopup && completedBookingId && (
        <div className="fixed bottom-6 right-6 z-50">

          <div className="bg-white border rounded-2xl shadow-xl p-5 w-[320px]">

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