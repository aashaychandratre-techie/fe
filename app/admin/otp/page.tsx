"use client";

import { useState } from "react";

import {
  ArrowLeft,
  Search,
  Bell,
  Sun,
  Moon,
  User,
  MapPin,
  Star,
} from "lucide-react";

import { useRouter } from "next/navigation";

export default function VendorListPage() {

  const router = useRouter();

  const [darkMode, setDarkMode] = useState(false);

  const vendors = [
    {
      id: 1,
      name: "Rahul Sharma",
      service: "Car Wash",
      location: "Aurangabad",
      rating: "4.8",
      status: "Available",
    },

    {
      id: 2,
      name: "Aman Verma",
      service: "Interior Cleaning",
      location: "Pune",
      rating: "4.6",
      status: "Busy",
    },

    {
      id: 3,
      name: "Sneha Patil",
      service: "Premium Wash",
      location: "Mumbai",
      rating: "4.9",
      status: "Available",
    },

    {
      id: 4,
      name: "Amit Joshi",
      service: "Bike Wash",
      location: "Nagpur",
      rating: "4.7",
      status: "Available",
    },

    {
      id: 5,
      name: "Rohan Kale",
      service: "Foam Wash",
      location: "Nashik",
      rating: "4.5",
      status: "Busy",
    },
  ];

  return (

    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-[#0f172a] text-white"
          : "bg-[#f4f7fb] text-[#0f172a]"
      }`}
    >

      {/* TOPBAR */}
      <div
        className={`flex items-center justify-between px-7 py-4 border-b ${
          darkMode
            ? "bg-[#111827] border-white/10"
            : "bg-white border-gray-200"
        }`}
      >

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* BACK */}
          <button
            onClick={() => router.back()}
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode
                ? "bg-white/10"
                : "bg-gray-100"
            }`}
          >
            <ArrowLeft size={18} />
          </button>

          <div>

            <h1 className="text-[20px] font-bold">
              Vendor List
            </h1>

            <p
              className={`text-[12px] mt-1 ${
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }`}
            >
              Available vendors for service booking
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">

          {/* SEARCH */}
          <div
            className={`flex items-center px-4 h-[42px] rounded-xl ${
              darkMode
                ? "bg-[#1e293b]"
                : "bg-gray-100"
            }`}
          >

            <Search
              size={16}
              className={
                darkMode
                  ? "text-gray-400"
                  : "text-gray-500"
              }
            />

            <input
              type="text"
              placeholder="Search vendor..."
              className={`bg-transparent outline-none ml-2 text-[13px] ${
                darkMode
                  ? "placeholder-gray-400"
                  : "placeholder-gray-500"
              }`}
            />

          </div>

          {/* NOTIFICATION */}
          <button
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode
                ? "bg-white/10"
                : "bg-gray-100"
            }`}
          >
            <Bell size={17} />
          </button>

          {/* THEME */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              darkMode
                ? "bg-white/10"
                : "bg-gray-100"
            }`}
          >

            {darkMode ? <Sun size={17} /> : <Moon size={17} />}

          </button>

        </div>

      </div>

      {/* VENDOR LIST */}
      <div className="p-6">

        <div className="space-y-4">

          {vendors.map((vendor) => (

            <div
              key={vendor.id}
              className={`rounded-2xl border px-5 py-4 flex items-center justify-between transition hover:shadow-md ${
                darkMode
                  ? "bg-[#111827] border-white/10"
                  : "bg-white border-gray-200"
              }`}
            >

              {/* LEFT */}
              <div className="flex items-center gap-4">

                {/* AVATAR */}
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>

                {/* INFO */}
                <div>

                  <h2 className="text-[15px] font-semibold">
                    {vendor.name}
                  </h2>

                  <div className="flex items-center gap-4 mt-1">

                    <p
                      className={`text-[12px] ${
                        darkMode
                          ? "text-gray-400"
                          : "text-gray-500"
                      }`}
                    >
                      {vendor.service}
                    </p>

                    <div className="flex items-center gap-1 text-[12px] text-gray-500">

                      <MapPin size={12} />
                      {vendor.location}

                    </div>

                    <div className="flex items-center gap-1 text-[12px] text-yellow-500">

                      <Star size={12} fill="currentColor" />
                      {vendor.rating}

                    </div>

                  </div>

                </div>

              </div>

              {/* RIGHT */}
              <div className="flex items-center gap-3">

                {/* STATUS */}
                <div
                  className={`px-3 py-1 rounded-lg text-[11px] font-medium ${
                    vendor.status === "Available"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {vendor.status}
                </div>

                {/* BUTTON */}
                <button
                  className={`h-[38px] px-5 rounded-xl text-[13px] font-medium transition ${
                    vendor.status === "Available"
                      ? "bg-blue-600 hover:bg-blue-700 text-white"
                      : "bg-gray-300 text-gray-600 cursor-not-allowed"
                  }`}
                  disabled={vendor.status !== "Available"}
                >

                  {vendor.status === "Available"
                    ? "Assign"
                    : "Unavailable"}

                </button>

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  );

}