"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";

export default function SignInPage() {
  const router = useRouter();

  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!selectedRole) return alert("Select role");
    if (!email || !password) return alert("Enter email & password");

    try {
      setLoading(true);

      if (selectedRole === "customer") {
        const res = await axios.post("http://localhost:8080/api/auth/signin", {
          email,
          password,
        });

        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/customer/dashboard");
      } else {
        const res = await axios.post("http://localhost:8080/auth/vendor/login", {
          email,
          password,
        });

        if (res.data === "Login Successful") {
          const vendorRes = await axios.get(
            `http://localhost:8080/auth/vendor/email/${email}`
          );

          localStorage.setItem("vendorId", vendorRes.data.id);
          localStorage.setItem("vendor", JSON.stringify(vendorRes.data));

          router.push("/vendor/dashboard");
        } else {
          alert(res.data);
        }
      }
    } catch (err: any) {
      alert(err?.response?.data || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center px-4 bg-cover bg-center"
      style={{
        backgroundImage: "url('/background.png')",
      }}
    >
      <Navbar />
      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-white/25" />

      {/* CARD (WHITE) */}
      <div className="relative z-10 w-full max-w-md bg-white backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-2xl">

        {/* TITLE */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-black">
            Sign In
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Welcome back to ServiceSphere
          </p>
        </div>

        {/* ROLE */}
        <div className="flex gap-3 mb-5">

          <button
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

        {/* INPUTS */}
        <div className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-black placeholder-gray-500 border border-gray-200 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-gray-50 text-black placeholder-gray-500 border border-gray-200 outline-none"
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-xl transition"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </div>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-600 mt-5">
          Don&apos;t have an account?{" "}
          <span
            onClick={() => router.push("/signup")}
            className="text-emerald-600 cursor-pointer font-medium"
          >
            Sign Up
          </span>
        </p>

      </div>
    </div>
  );
}