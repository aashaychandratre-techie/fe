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
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) return alert("Select role");

    try {
      setLoading(true);
      const isCustomer = selectedRole === "customer";
      const endpoint = isCustomer ? "http://localhost:8080/api/auth/signup" : "http://localhost:8080/auth/vendor/register";
      const payload = isCustomer ? { fullName, email, password, mobileNumber, address } : { name: fullName, email, password, phone: mobileNumber, address };
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
          <p className="text-gray-600 text-sm mt-1">Join ServiceSphere in a few details</p>
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

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Address</span>
            <div className="mt-2 flex items-start gap-3 rounded-2xl bg-white border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
              <MapPin size={18} className="text-emerald-600 mt-0.5" />
              <textarea placeholder="Service address" value={address} onChange={(e) => setAddress(e.target.value)} rows={3} className="w-full bg-transparent outline-none resize-none text-sm" />
            </div>
          </label>

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