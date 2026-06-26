"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAdminLogin = () => {

    // Dummy Admin Credentials
    if (
      email === "admin@servicesphere.com" &&
      password === "admin123"
    ) {

      router.push("/admin/dashboard");

    }

    else {

      alert("Invalid Admin Credentials");

    }

  };

  return (

    <div
      className="min-h-screen bg-cover bg-center flex justify-center items-center relative"
      style={{
        backgroundImage: "url('/background-img.png')",
      }}
    >

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-xl bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-10 shadow-2xl">

        {/* Heading */}
        <div className="text-center mb-10">

          <h1 className="text-5xl font-bold text-white">

            Admin Login

          </h1>

          <p className="text-gray-300 mt-3 text-lg">

            Secure access to ServiceSphere Admin Panel

          </p>

        </div>

        {/* Form */}
        <div className="space-y-6">

          {/* Email */}
          <input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-white/20 border border-white/10 text-white placeholder-gray-300 p-4 rounded-2xl outline-none focus:border-blue-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full bg-white/20 border border-white/10 text-white placeholder-gray-300 p-4 rounded-2xl outline-none focus:border-blue-500"
          />

          {/* Button */}
          <button
            onClick={handleAdminLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 transition p-4 rounded-2xl text-white text-lg font-semibold shadow-lg"
          >

            Login as Admin

          </button>

        </div>

      </div>

    </div>

  );

}