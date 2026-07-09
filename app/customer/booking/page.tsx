"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import API from "@/services/api";

import {
  User,
  MapPin,
  CalendarDays,
  Clock,
  CheckCircle,
  LocateFixed,
} from "lucide-react";

import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerNavbar from "@/components/CustomerNavbar";

function BookingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("serviceId");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    date: "",
    timeSlot: "",
  });

  const timeSlots = [
    "09:00 AM - 11:00 AM",
    "11:00 AM - 01:00 PM",
    "01:00 PM - 03:00 PM",
    "03:00 PM - 05:00 PM",
    "05:00 PM - 07:00 PM",
  ];

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );

          const data = await response.json();

          setForm((prev) => ({
            ...prev,
            address: data.display_name,
          }));
        } catch {
          alert("Unable to fetch current location.");
        }
      },
      () => {
        alert("Location permission denied.");
      }
    );
  };

  const handleConfirm = async () => {
    if (
      !form.name ||
      !form.address ||
      !form.date ||
      !form.timeSlot
    ) {
      alert("Please fill all fields.");
      return;
    }
    

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const payload = {
        customerId: String(user.id),
        serviceId: String(serviceId),
        vendorId: null,
        bookingDate: form.date,
        bookingTime: form.timeSlot,
        address: form.address,
        amount: amount ? parseFloat(amount) : 0,
        status: "PENDING",
        user: user,
      };

      await API.post("/bookings", payload);

      alert("Booking Completed Successfully");

      router.push("/customer/bookings");
    } catch (error: any) {
      alert(
        error?.response?.data?.message || "Booking Failed"
      );
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 py-12">
  <div className="w-full max-w-xl bg-white shadow-md border border-emerald-50 rounded-3xl p-6 sm:p-7 relative overflow-hidden">

    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl opacity-60"></div>

    <div className="relative z-10">

      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-emerald-900">
          Complete Booking
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Fill the details below to confirm your booking.
        </p>
      </div>

      <div className="space-y-5">

        {/* Name */}

        <label className="block">
          <span className="text-sm font-medium text-gray-600">
            Customer Name
          </span>

          <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
            <User size={18} className="text-emerald-600" />

            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full outline-none bg-transparent"
            />
          </div>
        </label>

        {/* Address */}

        <label className="block">
          <span className="text-sm font-medium text-gray-600">
            Service Address
          </span>

          <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
            <MapPin size={18} className="text-emerald-600" />

            <input
              type="text"
              placeholder="Enter address"
              value={form.address}
              onChange={(e) =>
                setForm({
                  ...form,
                  address: e.target.value,
                })
              }
              className="w-full outline-none bg-transparent"
            />
          </div>

          <button
            type="button"
            onClick={getCurrentLocation}
            className="mt-3 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl transition"
          >
            <LocateFixed size={16} />
            Use Current Location
          </button>
        </label>

        {/* Date & Time Slot */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <label>
            <span className="text-sm font-medium text-gray-600">
              Booking Date
            </span>

            <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
              <CalendarDays
                size={18}
                className="text-emerald-600"
              />

              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    date: e.target.value,
                  })
                }
                className="w-full outline-none bg-transparent"
              />
            </div>
          </label>

          <label>
            <span className="text-sm font-medium text-gray-600">
              Time Slot
            </span>

            <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3">
              <Clock
                size={18}
                className="text-emerald-600"
              />

              <select
                value={form.timeSlot}
                onChange={(e) =>
                  setForm({
                    ...form,
                    timeSlot: e.target.value,
                  })
                }
                className="w-full outline-none bg-transparent"
              >
                <option value="">
                  Select Time Slot
                </option>

                {timeSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </label>

        </div>

      </div>
              <div className="flex flex-col sm:flex-row gap-3 mt-8">

          <button
            onClick={() => router.back()}
            className="sm:w-1/2 py-3 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold transition"
          >
            Cancel
          </button>

          <button
            onClick={handleConfirm}
            disabled={loading}
            className="sm:w-1/2 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center justify-center gap-2 transition disabled:opacity-60"
          >
            <CheckCircle size={18} />

            {loading ? "Booking..." : "Confirm Booking"}
          </button>

        </div>

      </div>
    </div>
  </div>
);
}export default function BookingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const userName = user.fullName || "Customer";
  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <div
      className={`min-h-screen flex font-sans ${
        darkMode
          ? "bg-[#071A12] text-white"
          : "bg-[#F3FBF6] text-gray-900"
      }`}
    >
      <CustomerSidebar
        darkMode={darkMode}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <CustomerNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          firstLetter={firstLetter}
        />

        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full text-gray-500">
                Loading Booking Form...
              </div>
            }
          >
            <BookingContent />
          </Suspense>
        </main>
      </div>
    </div>
  );
}