"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";

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

      const endpoint = isCustomer
        ? "http://localhost:8080/api/auth/signup"
        : "http://localhost:8080/auth/vendor/register";

      const payload = isCustomer
        ? { fullName, email, password, mobileNumber, address }
        : { name: fullName, email, password, phone: mobileNumber, address };

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

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 bg-cover bg-center relative"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      <Navbar />
      {/* LIGHT OVERLAY (same as signin) */}
      <div className="absolute inset-0 bg-white/25" />

      {/* WHITE CARD (same style as signin) */}
      <div className="relative z-10 w-full max-w-md bg-white border border-gray-200 rounded-2xl p-6 shadow-2xl">

        {/* TITLE */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">
            Sign Up
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Create your account
          </p>
        </div>

        {/* ROLE */}
        <div className="flex gap-3 mb-5">

          <button
            type="button"
            onClick={() => setSelectedRole("customer")}
            className={`flex-1 py-2 rounded-xl border transition
            ${
              selectedRole === "customer"
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-gray-100 text-black"
            }`}
          >
            Customer
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("provider")}
            className={`flex-1 py-2 rounded-xl border transition
            ${
              selectedRole === "provider"
                ? "bg-emerald-500 text-white border-emerald-500"
                : "bg-gray-100 text-black"
            }`}
          >
            Provider
          </button>

        </div>

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-4">

          <input
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-black placeholder-gray-500 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-black placeholder-gray-500 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            placeholder="Mobile Number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-black placeholder-gray-500 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-black placeholder-gray-500 border border-gray-200 outline-none focus:ring-2 focus:ring-emerald-500"
          />

          <textarea
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-black placeholder-gray-500 border border-gray-200 outline-none resize-none focus:ring-2 focus:ring-emerald-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-xl text-white font-semibold transition"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>

        </form>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?{" "}
          <span
            onClick={() => router.push("/signin")}
            className="text-emerald-600 cursor-pointer font-medium"
          >
            Sign In
          </span>
        </p>

      </div>
    </div>
  );
}