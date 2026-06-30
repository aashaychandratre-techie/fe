"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LockKeyhole, Mail, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {
    if (email === "admin@servicesphere.com" && password === "admin123") {
      router.push("/admin/dashboard");
    } else {
      alert("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex justify-center items-center relative px-4 py-10" style={{ backgroundImage: "url('/background-img.png')" }}>
      <div className="absolute inset-0 bg-slate-950/70" />

      <div className="relative z-10 w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 text-slate-900">
        <div className="text-center mb-8">
          <div className="mx-auto h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-900/20 mb-4">
            <ShieldCheck size={26} />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold">Admin Login</h1>
          <p className="text-gray-600 mt-2 text-sm">Secure access to the ServiceSphere admin panel</p>
        </div>

        <div className="space-y-4">
          <label className="block">
            <span className="text-sm font-medium text-gray-700">Admin Email</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
              <Mail size={18} className="text-emerald-600" />
              <input type="email" placeholder="admin@servicesphere.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent outline-none text-sm" required />
            </div>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-gray-700">Password</span>
            <div className="mt-2 flex items-center gap-3 rounded-2xl bg-white border border-gray-200 px-4 py-3 focus-within:ring-2 focus-within:ring-emerald-100">
              <LockKeyhole size={18} className="text-emerald-600" />
              <input type="password" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent outline-none text-sm" required />
            </div>
          </label>

          <button onClick={handleAdminLogin} className="w-full bg-emerald-500 hover:bg-emerald-600 py-3 rounded-2xl text-white font-semibold shadow-lg shadow-emerald-900/20">
            Login as Admin
          </button>
        </div>
      </div>
    </div>
  );
}