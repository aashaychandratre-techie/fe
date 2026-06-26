"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";

import {
  Menu,
  Bell,
  ChevronDown,
  User,
  LogOut,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "next-themes";

interface NavbarProps {
  setOpen: (value: boolean) => void;
}

export default function VendorNavbar({ setOpen }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  // ✅ FIX: direct localStorage se initial set (SSR safe)
  const [vendorInitial, setVendorInitial] = useState(() => {
    if (typeof window === "undefined") return "V";
    const name = localStorage.getItem("vendorName");
    return name?.trim()?.charAt(0).toUpperCase() || "V";
  });

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // click outside close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotificationOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // sync if localStorage changes
  useEffect(() => {
    const getInitial = () => {
      const name = localStorage.getItem("vendorName");
      setVendorInitial(name?.trim()?.charAt(0).toUpperCase() || "V");
    };

    window.addEventListener("storage", getInitial);
    return () => window.removeEventListener("storage", getInitial);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vendorEmail");
    localStorage.removeItem("vendorName");
    router.push("/signin");
  };

  return (
    <div className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 relative">

      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden text-gray-600"
          onClick={() => setOpen(true)}
        >
          <Menu />
        </button>

        <p className="text-sm text-gray-500">
          Manage your services
        </p>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3 md:gap-4">

        {/* THEME */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* NOTIFICATIONS */}
        <div ref={notifRef} className="relative">

          <button
            onClick={() => setNotificationOpen(!notificationOpen)}
            className="w-10 h-10 flex items-center justify-center bg-gray-50 hover:bg-gray-100 rounded-xl border border-gray-100 relative"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full"></span>
          </button>

          {notificationOpen &&
            typeof window !== "undefined" &&
            createPortal(
              <div className="fixed right-4 top-16 w-80 bg-white border border-gray-100 rounded-2xl shadow-lg z-[9999]">

                <div className="p-3 border-b font-semibold text-emerald-600">
                  Notifications
                </div>

                <div className="text-sm">
                  <div className="p-3 hover:bg-emerald-50 cursor-pointer">
                    New Booking Received
                  </div>

                  <div className="p-3 hover:bg-emerald-50 cursor-pointer">
                    Payment Successful
                  </div>

                  <div className="p-3 hover:bg-emerald-50 cursor-pointer">
                    Service Completed
                  </div>
                </div>

              </div>,
              document.body
            )}
        </div>

        {/* PROFILE */}
        <div ref={profileRef} className="relative">

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-100 px-3 py-2 rounded-xl"
          >

            {/* ✅ Vendor Initial */}
            <div className="w-9 h-9 bg-emerald-600 text-white rounded-full flex items-center justify-center font-semibold">
              {vendorInitial}
            </div>

            <ChevronDown size={16} className="text-gray-600" />

          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg p-2 z-50">

              <button
                onClick={() => {
                  setProfileOpen(false);
                  router.push("/vendor/profile");
                }}
                className="w-full flex gap-3 p-3 rounded-xl hover:bg-emerald-50 text-gray-700"
              >
                <User size={18} /> Profile
              </button>

              <button
                onClick={handleLogout}
                className="w-full flex gap-3 p-3 rounded-xl text-red-600 hover:bg-red-50"
              >
                <LogOut size={18} /> Logout
              </button>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}