"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Navbar from "@/components/Navbar";
import { LockKeyhole, Mail, UserRound, Wrench } from "lucide-react";

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
        const res = await axios.post("http://localhost:8080/api/auth/signin", { email, password });
        localStorage.setItem("user", JSON.stringify(res.data));
        router.push("/customer/dashboard");
      } else {
        const res = await axios.post("http://localhost:8080/auth/vendor/login", { email, password });

        if (res.data === "Login Successful") {
          const vendorRes = await axios.get(`http://localhost:8080/auth/vendor/email/${email}`);
          localStorage.setItem("vendorId", vendorRes.data.id);
          localStorage.setItem("vendor", JSON.stringify(vendorRes.data));
          localStorage.setItem("vendorName", vendorRes.data.name || vendorRes.data.email || "Vendor");
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
    <div className="min-h-screen relative flex items-center justify-center px-4 py-24 bg-cover bg-center" style={{ backgroundImage: "url('/background.png')" }}>
      <Navbar />
      <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />

      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-6 sm:p-7">
        <div className="text-center mb-6">
          <div className="mx-auto h-12 w-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100 mb-4">
            <LockKeyhole size={22} />
          </div>
          <h1 className="text-3xl font-bold text-black">Sign In</h1>
          <p className="text-gray-600 text-sm mt-1">Welcome back to ServiceSphere</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-5">
          {[
            ["customer", UserRound, "Customer"],
            ["provider", Wrench, "Provider"],
          ].map(([role, Icon, label]: any) => (
            <button
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

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Email</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
              <Mail size={18} className="text-emerald-600" />
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none text-sm" />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
              <LockKeyhole size={18} className="text-emerald-600" />
              <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none text-sm" />
            </div>
          </label>

          <button onClick={handleLogin} disabled={loading} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 rounded-2xl shadow-lg shadow-emerald-100 disabled:opacity-60">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don&apos;t have an account? <button onClick={() => router.push("/signup")} className="text-emerald-600 font-semibold">Sign Up</button>
        </p>
      </div>
    </div>
  );
}