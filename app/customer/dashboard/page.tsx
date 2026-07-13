"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, CheckCircle2, Clock, IndianRupee, Plus } from "lucide-react";
import {
  Search,
  Star,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

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

  const upcomingBooking = bookings.find(
  (booking) =>
    booking.status !== "COMPLETED" &&
    booking.status !== "REJECTED"
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-100 text-yellow-700";

    case "ASSIGNED":
      return "bg-blue-100 text-blue-700";

    case "IN_PROGRESS":
      return "bg-purple-100 text-purple-700";

    default:
      return "bg-green-100 text-green-700";
  }
};

  type Service = {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

const [services, setServices] = useState<Service[]>([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState("");
const [activeCategory, setActiveCategory] = useState("All");
const [isDropdownOpen, setIsDropdownOpen] = useState(false);

const fetchServices = async () => {
  try {
    const response = await API.get("/services");
    setServices(response.data);
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const storedUser = localStorage.getItem("user");

  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }

  fetchServices();
}, []);

const bookService = (id: number, price: number) => {
  router.push(`/customer/booking?serviceId=${id}&amount=${price}`);
};

const filteredServices = services.filter((service) => {
  const matchesSearch = service.name
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesCategory =
    activeCategory === "All" ||
    service.name.toLowerCase().includes(activeCategory.toLowerCase()) ||
    service.description
      .toLowerCase()
      .includes(activeCategory.toLowerCase());

  return matchesSearch && matchesCategory;
});

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

          

          {/* STATS */}
         <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">

            <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex justify-between items-start">
                <div>
                 <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">Total Bookings</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {totalBookings}
                  </h2>
                </div>
                <div className="p-2 lg:p-3 bg-emerald-100 rounded-xl lg:rounded-2xl text-emerald-600">
                  <CalendarDays className="w-4 h-4 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>

            <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex justify-between items-start">
                <div>
                <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">Completed</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {completedBookings}
                  </h2>
                </div>
                <div className="p-3 bg-green-100 rounded-2xl text-green-600">
                  <CheckCircle2 className="w-4 h-4 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>

            <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex justify-between items-start">
                <div>
                 <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">Pending</p>
                  <h2 className="text-3xl font-bold text-gray-900">
                    {pendingBookings}
                  </h2>
                </div>
                <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                  <Clock className="w-4 h-4 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>

            <div className="relative p-3 sm:p-4 lg:p-6 rounded-2xl lg:rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              <div className="flex justify-between items-start">
                <div>
                 <p className="text-xs lg:text-sm font-medium text-gray-500 mb-1">Total Spent</p>
                  <h2 className="text-3xl font-bold text-emerald-600">
                    ₹{totalPayments}
                  </h2>
                </div>
                <div className="p-2 lg:p-3 bg-emerald-100 rounded-xl lg:rounded-2xl text-emerald-600">
                  <IndianRupee className="w-4 h-4 lg:w-6 lg:h-6" />
                </div>
              </div>
            </div>

          </div>
     {/* Upcoming Booking */}

<div className="max-w-5xl mx-auto mb-10">

  <div className="flex items-center justify-between mb-5">
    <h2 className="text-2xl font-semibold text-emerald-900">
      Upcoming Booking
    </h2>

    {upcomingBooking && (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
          upcomingBooking.status
        )}`}
      >
        {upcomingBooking.status}
      </span>
    )}
  </div>

  {upcomingBooking ? (
    <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300">

      {/* Background Glow */}
      <div className="absolute -top-16 -right-16 w-60 h-60 bg-emerald-100 rounded-full blur-3xl opacity-60"></div>
      <div className="absolute -bottom-20 -left-16 w-60 h-60 bg-green-50 rounded-full blur-3xl opacity-60"></div>

      <div className="relative z-10 p-6 lg:p-7">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

          {/* Left */}

          <div className="flex items-center gap-5">

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <CalendarDays className="w-7 h-7 text-white" />
            </div>

            <div>

              <p className="text-sm text-gray-500">
                Service
              </p>

              <h3 className="text-1xl lg:text-2xl font-semibold text-gray-900 mt-1">
                {upcomingBooking.serviceName}
              </h3>

            </div>

          </div>

        {/* Right */}

<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

  <div className="bg-gray-50 rounded-2xl p-4 min-w-[150px]">
    <p className="text-xs uppercase text-gray-400 tracking-wide">
      Booking Date
    </p>

    <p className="text-base font-semibold text-gray-900 mt-1">
      {upcomingBooking.bookingDate ?? "Not Available"}
    </p>
  </div>

  <div className="bg-gray-50 rounded-2xl p-4 min-w-[150px]">
    <p className="text-xs uppercase text-gray-400 tracking-wide">
      Booking Time
    </p>

    <p className="text-sm font-semibold text-gray-900 mt-1">
      {upcomingBooking.bookingTime ?? "Not Available"}
    </p>
  </div>

  <div className="bg-gray-50 rounded-2xl p-4 min-w-[150px]">
    <p className="text-xs uppercase text-gray-400 tracking-wide">
      Amount
    </p>

    <p className="text-base font-semibold text-emerald-600 mt-1">
      ₹{upcomingBooking.amount}
    </p>
  </div>

</div>
</div>
        {/* Progress */}

        <div className="mt-8">

          <div className="flex justify-between text-sm text-gray-500 mb-2">

            <span>Booking Progress</span>

            <span>{upcomingBooking.status}</span>

          </div>

          <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">

            <div
              className={`h-full rounded-full transition-all duration-500
              ${
                upcomingBooking.status === "PENDING"
                  ? "w-1/4 bg-yellow-500"
                  : upcomingBooking.status === "ASSIGNED"
                  ? "w-2/4 bg-blue-500"
                  : upcomingBooking.status === "ACCEPTED"
                  ? "w-3/4 bg-emerald-500"
                  : "w-full bg-green-600"
              }`}
            />

          </div>

        </div>

      </div>

    </div>
  ) : (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 text-center">

      <CalendarDays className="w-12 h-12 mx-auto text-emerald-500 mb-4" />

      <h3 className="text-xl font-semibold text-gray-800">
        No Upcoming Booking
      </h3>

      <p className="text-gray-500 mt-2">
        Book a service to see your upcoming bookings here.
      </p>

      <button
        onClick={() => router.push("/customer/services")}
        className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-medium transition cursor-pointer"
      >
        Book a Service
      </button>

    </div>
  )}

</div>
         <div className="max-w-7xl mx-auto space-y-4">
            
            {/* HEADER */}
           <div className="py-4 border border-emerald-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-0 opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between w-full gap-4">
  <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
    Explore Services
  </h1>
</div>    
            </div>

    
            

            {/* SERVICES GRID */}
            <div className="pb-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-5 shadow-sm h-[380px] animate-pulse border border-gray-100">
                      <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4"></div>
                      <div className="w-3/4 h-6 bg-gray-100 rounded-full mb-3"></div>
                      <div className="w-full h-4 bg-gray-100 rounded-full mb-2"></div>
                      <div className="w-5/6 h-4 bg-gray-100 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-emerald-50 flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No services found</h3>
                  <p className="text-gray-500 mt-2 max-w-sm">We couldn't find any services matching "{search}". Try another search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {filteredServices.slice(0, 3).map((service) => (
                    <div
                      key={service.id}
                      className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/10 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                    >
                      {service.imageUrl ? (
                        <div className="relative h-52 rounded-2xl overflow-hidden shadow-sm mb-5">
                          <img
                            src={`http://localhost:8080${service.imageUrl}`}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <Star size={14} className="fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-bold text-gray-900">4.8</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-52 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mb-5 overflow-hidden">
                          <span className="text-7xl text-emerald-200 font-extrabold transform group-hover:scale-110 transition-transform duration-700">{service.name.charAt(0)}</span>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <Star size={14} className="fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-bold text-gray-900">4.8</span>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {service.name}
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm leading-relaxed line-clamp-2 flex-1">
                          {service.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-gray-100">
                          <div>
                            <p className="text-xs font-medium text-gray-400 mb-0.5">Starting from</p>
                            <p className="text-2xl font-extrabold text-emerald-600">
                              ₹{service.price}
                            </p>
                          </div>
                          <button
                            onClick={() => bookService(service.id, service.price)}
                            className="bg-gray-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 active:scale-95 cursor-pointer"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
           <button
  onClick={() => router.push("/customer/services")}
  className="group mx-auto mt-8 flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-green-500 px-7 py-3 text-white font-semibold shadow-lg hover:shadow-emerald-300/60 hover:scale-105 transition-all duration-300 cursor-pointer"
>
  Explore More

  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5 group-hover:translate-x-1 transition-transform"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M9 5l7 7-7 7"
    />
  </svg>
</button>
            {/* HORIZONTAL PROMISE BANNER */}
            <div className="bg-emerald-900 rounded-3xl p-8 md:p-10 shadow-xl border border-emerald-800 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 mt-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -z-0 opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 lg:w-1/3">
                <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-700/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <ShieldCheck size={14} /> The SqftServices Way
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-3">
                  Our Promise To You
                </h2>
                <p className="text-emerald-100/80 leading-relaxed text-sm">
                  We don't just connect you with professionals, we guarantee a premium experience from booking to completion.
                </p>
              </div>

              <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="bg-emerald-800/40 backdrop-blur border border-emerald-700/50 rounded-2xl p-5 hover:bg-emerald-800/60 transition-colors">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-bold text-white mb-1">Verified Pros</h3>
                  <p className="text-xs text-emerald-100/70">Every professional is rigorously background checked.</p>
                </div>
                <div className="bg-emerald-800/40 backdrop-blur border border-emerald-700/50 rounded-2xl p-5 hover:bg-emerald-800/60 transition-colors">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-bold text-white mb-1">Quick Booking</h3>
                  <p className="text-xs text-emerald-100/70">Book top-rated services in less than 60 seconds.</p>
                </div>
                <div className="bg-emerald-800/40 backdrop-blur border border-emerald-700/50 rounded-2xl p-5 hover:bg-emerald-800/60 transition-colors">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                    <Star size={20} />
                  </div>
                  <h3 className="font-bold text-white mb-1">Quality Service</h3>
                  <p className="text-xs text-emerald-100/70">100% satisfaction guaranteed on every single job.</p>
                </div>
              </div>
            </div>

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