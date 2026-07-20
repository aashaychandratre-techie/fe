"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { Home, LockKeyhole, Mail, MapPin, Phone, UserRound, Wrench } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<"customer" | "provider" | "">("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");

  const [street, setStreet] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      try {
        const { latitude, longitude } = position.coords;

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );

        const data = await response.json();


        if (data.address) {
          setStreet(data.address.road || data.address.pedestrian || data.address.suburb || "");
          setLandmark(data.address.neighbourhood || data.address.suburb || data.address.village || "");
          setCity(data.address.city || data.address.town || data.address.county || "");
          setState(data.address.state || "");
          setCountry(data.address.country || "");
        }
      } catch (error) {
        alert("Unable to fetch address.");
      } finally {
        setLocationLoading(false);
      }
    },
    (error) => {
      setLocationLoading(false);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          alert("Location permission denied.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Location unavailable.");
          break;
        case error.TIMEOUT:
          alert("Location request timed out.");
          break;
        default:
          alert("Unable to fetch location.");
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
};

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return alert("Select role");

    try {
      setLoading(true);
      const isCustomer = selectedRole === "customer";
      const endpoint = isCustomer ? "http://localhost:8080/api/auth/signup" : "http://localhost:8080/auth/vendor/register";
      const fullAddress = [street, landmark, city, state, country].filter(Boolean).join(", ");
      const payload = isCustomer 
        ? { fullName, email, password, mobileNumber, address: fullAddress, street, landmark, city, state, country } 
        : { name: fullName, email, password, phone: mobileNumber, address: fullAddress, street, landmark, city, state, country };
      const res = await axios.post(endpoint, payload);

      if (isCustomer) {
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/customer/dashboard");
      } else {
        router.push("/signin");
      }
    } catch (err: any) {
      alert(err?.response?.data || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    ["Full Name", fullName, setFullName, UserRound, "text"],
    ["Email", email, setEmail, Mail, "email"],
    ["Mobile Number", mobileNumber, setMobileNumber, Phone, "tel"],
    ["Password", password, setPassword, LockKeyhole, "password"],
  ] as const;

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24 bg-cover bg-center relative" style={{ backgroundImage: "url('/background.png')" }}>
      <Navbar />
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-6 sm:p-7">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100 mb-4">
            <Home size={22} />
          </div>
          <h1 className="text-3xl font-bold text-black">Create Account</h1>
          <p className="text-gray-600 text-sm mt-1">Join SqftServices in a few details</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            ["customer", UserRound, "Customer"],
            ["provider", Wrench, "Provider"],
          ].map(([role, Icon, label]: any) => (
            <button
              type="button"
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`flex items-center justify-center gap-2 py-3 rounded-2xl border font-medium ${
                selectedRole === role ? "bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-100" : "bg-white text-gray-700 border-gray-200 hover:bg-emerald-50"
              }`}
            >
              <Icon size={17} /> {label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSignup} className="space-y-4">
          {fields.map(([placeholder, value, setter, Icon, type]) => (
            <label key={placeholder} className="block">
              <span className="text-sm font-medium text-gray-700">{placeholder}</span>
              <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
                <Icon size={18} className="text-emerald-600" />
                <input type={type} placeholder={placeholder} value={value} onChange={(e) => setter(e.target.value)} className="w-full bg-transparent outline-none text-sm" />
              </div>
            </label>
          ))}

          <div className="mt-2">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-gray-800">Location Details</span>
              <button
                type="button"
                onClick={getCurrentLocation}
                disabled={locationLoading}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <MapPin size={14} />
                {locationLoading ? "Locating..." : "Auto-fill"}
              </button>
            </div>

            <div className="space-y-3 bg-white/40 p-4 rounded-2xl border border-gray-100 shadow-inner">
              <input type="text" placeholder="Street Address / Building" value={street} onChange={(e) => setStreet(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all" />
              <input type="text" placeholder="Landmark / Area" value={landmark} onChange={(e) => setLandmark(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all" />
              
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all" />
                <input type="text" placeholder="State" value={state} onChange={(e) => setState(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all" />
              </div>
              
              <input type="text" placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:border-emerald-300 focus:ring-2 focus:ring-emerald-100 outline-none transition-all" />
            </div>
          </div>

          <button type="submit" disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-2xl text-white font-semibold shadow-lg shadow-emerald-100 disabled:opacity-60">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account? <button onClick={() => router.push("/signin")} className="text-emerald-600 font-semibold">Sign In</button>
        </p>
      </div>
    </div>
  );
}