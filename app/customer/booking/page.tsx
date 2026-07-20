"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDarkMode } from "@/hooks/useDarkMode";
import API from "@/services/api";

import {
  User,
  MapPin,
  Phone,
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
  const additionalServicesParam = searchParams.get("additionalServices");
  

  const [loading, setLoading] = useState(false);
  const [selectedAdditionalServices, setSelectedAdditionalServices] = useState<string[]>([]);
  const [locationLoading, setLocationLoading] = useState(false);

  useEffect(() => {

  if(additionalServicesParam){

    setSelectedAdditionalServices(
      additionalServicesParam.split(",")
    );

  }

},[additionalServicesParam]);

 const [form, setForm] = useState({
  name: "",
  mobileNumber: "",
  houseNo: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  date: "",

  preferredStartTime: "",
  preferredEndTime: "",

  alternateStartTime: "",
  alternateEndTime: "",
});

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setForm((prev) => ({
          ...prev,
          name: user.fullName || "",
          mobileNumber: user.mobileNumber || "",
        }));
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
    }
  }, []);
 
  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();
        const address = data.address;

        setForm((prev) => ({
          ...prev,
          houseNo: address.house_number || "",
          area:
            address.road ||
            address.suburb ||
            address.neighbourhood ||
            "",
          landmark: address.amenity || "",
          city:
            address.city ||
            address.town ||
            address.village ||
            "",
          state: address.state || "",
          pincode: address.postcode || "",
        }));
      } catch {
        alert("Unable to fetch current location.");
      } finally {
        setLocationLoading(false);
      }
    },
    () => {
      setLocationLoading(false);
      alert("Location permission denied.");
    }
  );
};
    
  const handleConfirm = async () => {
  if (
  !form.name ||
  !form.mobileNumber ||
  !form.houseNo ||
  !form.area ||
  !form.city ||
  !form.state ||
  !form.pincode ||
  !form.date ||
  !form.preferredStartTime ||
  !form.preferredEndTime ||
  !form.alternateStartTime ||
  !form.alternateEndTime
) {
      alert("Please fill all fields.");
      return;
    }
    

    try {
      setLoading(true);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      
      if (!user || (!user.id && !user._id)) {
        alert("Please login to book a service");
        router.push("/signin");
        return;
      }
    

      const payload = {
        serviceId: String(serviceId),
        vendorId: null,
        additionalServiceIds: selectedAdditionalServices.join(","),
        bookingDate: form.date,
        timeSlot: `${form.preferredStartTime} - ${form.preferredEndTime}`,
        address: `${form.houseNo},
${form.area},
${form.landmark},
${form.city},
${form.state} - ${form.pincode}`,
        city: form.city,
        amount: amount ? parseFloat(amount) : 0,
        status: "PENDING",
        user: { id: user.id || user._id },
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
        <h1  className="text-2xl font-bold text-emerald-900 tracking-tight">
          Complete Booking
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Fill the details below to confirm your booking.
        </p>
      </div>

      <div className="space-y-5">

        {/* Name */}

       {/* Customer Details */}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

  {/* Customer Name */}

  <label>
    <span className="text-sm font-medium text-gray-600">
      Customer Name
    </span>

    <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition">
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
        className="w-full outline-none bg-transparent text-sm"
      />
    </div>
  </label>

  {/* Mobile Number */}

  <label>
    <span className="text-sm font-medium text-gray-600">
      Mobile Number
    </span>

    <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-emerald-500 transition">
      <Phone size={18} className="text-emerald-600" />

      <input
        type="tel"
        placeholder="    "
        value={form.mobileNumber}
        maxLength={10}
        onChange={(e) =>
          setForm({
            ...form,
            mobileNumber: e.target.value,
          })
        }
        className="w-full outline-none bg-transparent text-sm"
      />
    </div>
  </label>

</div>
        

      {/* Address */}

<div>
  <div className="flex items-center justify-between mb-4">
    <span className="text-sm font-semibold text-gray-700">
      Service Address
    </span>

   <button
  type="button"
  onClick={getCurrentLocation}
  disabled={locationLoading}
  className="flex items-center gap-2 text-xs bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-400 text-white px-3 py-2 rounded-lg transition"
>
  <LocateFixed size={14} />
  {locationLoading ? "Loading..." : "Use Current Location"}
</button>
</div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

    {/* House No */}

    <label>
      <span className="text-sm text-gray-600">
        House / Flat No.
      </span>

      <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-2">
        <MapPin size={18} className="text-emerald-600" />

        <input
          type="text"
          placeholder="House / Flat No."
          value={form.houseNo}
          onChange={(e) =>
            setForm({
              ...form,
              houseNo: e.target.value,
            })
          }
          className="w-full outline-none bg-transparent"
        />
      </div>
    </label>

    {/* Area */}

    <label>
      <span className="text-sm text-gray-600">
        Area / Street
      </span>

      <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-2">
        <MapPin size={18} className="text-emerald-600" />

        <input
          type="text"
          placeholder="Area / Street"
          value={form.area}
          onChange={(e) =>
            setForm({
              ...form,
              area: e.target.value,
            })
          }
          className="w-full outline-none bg-transparent"
        />
      </div>
    </label>

    {/* Landmark */}

    <label>
      <span className="text-sm text-gray-600">
        Landmark
      </span>

      <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-2">
        <MapPin size={18} className="text-emerald-600" />

        <input
          type="text"
          placeholder="Nearby Landmark"
          value={form.landmark}
          onChange={(e) =>
            setForm({
              ...form,
              landmark: e.target.value,
            })
          }
          className="w-full outline-none bg-transparent"
        />
      </div>
    </label>

    {/* City */}

    <label>
      <span className="text-sm text-gray-600">
        City
      </span>

      <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-2">
        <MapPin size={18} className="text-emerald-600" />

        <input
          type="text"
          placeholder="City"
          value={form.city}
          onChange={(e) =>
            setForm({
              ...form,
              city: e.target.value,
            })
          }
          className="w-full outline-none bg-transparent"
        />
      </div>
    </label>

    {/* State */}

    <label>
      <span className="text-sm text-gray-600">
        State
      </span>

      <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-2">
        <MapPin size={18} className="text-emerald-600" />

        <input
          type="text"
          placeholder="State"
          value={form.state}
          onChange={(e) =>
            setForm({
              ...form,
              state: e.target.value,
            })
          }
          className="w-full outline-none bg-transparent"
        />
      </div>
    </label>

    {/* Pincode */}

    <label>
      <span className="text-sm text-gray-600">
        Pincode
      </span>

      <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-2">
        <MapPin size={18} className="text-emerald-600" />

        <input
          type="text"
          placeholder="Pincode"
          value={form.pincode}
          onChange={(e) =>
            setForm({
              ...form,
              pincode: e.target.value,
            })
          }
          className="w-full outline-none bg-transparent"
        />
      </div>
    </label>

  </div>
</div>

      <div className="space-y-5">

  <label>
    <span className="text-sm font-medium text-gray-600">
      Booking Date
    </span>

    <div className="mt-2 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-2">
      <CalendarDays size={18} className="text-emerald-600" />

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

 <div className="mt-6 grid md:grid-cols-2 gap-6">

    <div>
      <span className="text-sm font-medium text-gray-600">
      Preferred Time
      </span>

      <div className="grid grid-cols-2 gap-3">

        <input
  type="time"
  value={form.preferredStartTime}
  onChange={(e) =>
    setForm({
      ...form,
      preferredStartTime: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
/>

<input
  type="time"
  value={form.preferredEndTime}
  onChange={(e) =>
    setForm({
      ...form,
      preferredEndTime: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
/>

      </div>
    </div>

    <div>
      <span className="text-sm font-medium text-gray-600">
      Alternate Time
      </span>

      <div className="grid grid-cols-2 gap-3">

       <input
  type="time"
  value={form.alternateStartTime}
  onChange={(e) =>
    setForm({
      ...form,
      alternateStartTime: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
/>

<input
  type="time"
  value={form.alternateEndTime}
  onChange={(e) =>
    setForm({
      ...form,
      alternateEndTime: e.target.value,
    })
  }
  className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-emerald-500"
/>

      </div>
    </div>

  </div>

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
  const [darkMode, setDarkMode] = useDarkMode();
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
        <div className="md:hidden">
        <CustomerNavbar
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          setSidebarOpen={setSidebarOpen}
          userName={userName}
          firstLetter={firstLetter}
        />
        </div>

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