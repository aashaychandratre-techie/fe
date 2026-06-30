"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { Menu, Bell, ChevronDown, User, LogOut, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "next-themes";

interface NavbarProps {
  setOpen: (value: boolean) => void;
}

export default function VendorNavbar({ setOpen }: NavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [vendorInitial, setVendorInitial] = useState("V");
  const [vendorName, setVendorName] = useState("Vendor");

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const syncInitial = () => {
      const vendor = JSON.parse(localStorage.getItem("vendor") || "{}");
      const name = localStorage.getItem("vendorName") || vendor.name || vendor.fullName || vendor.email || "Vendor";
      setVendorName(name.split(' ')[0]);
      setVendorInitial(name.trim().charAt(0).toUpperCase() || "V");
    };

    syncInitial();
    window.addEventListener("storage", syncInitial);
    return () => window.removeEventListener("storage", syncInitial);
  }, []);

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

  const handleLogout = () => {
    localStorage.removeItem("vendorEmail");
    localStorage.removeItem("vendorName");
    localStorage.removeItem("vendorId");
    localStorage.removeItem("vendor");
    router.push("/signin");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-xl transition-all shadow-sm bg-white/70 dark:bg-[#0B1120]/80 border-emerald-50 dark:border-gray-800">
      <div className="flex items-center justify-between px-3 sm:px-5 md:px-8 py-2.5 sm:py-3.5 gap-2 sm:gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all bg-emerald-50/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50"
            aria-label="Open vendor menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold truncate tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500">
              Hi, {vendorName}!
            </h1>
            <p className="hidden sm:block text-xs font-medium truncate mt-0.5 text-emerald-700 dark:text-emerald-400/60">Everything looks great today.</p>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          {/* Search bar removed as requested */}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="shrink-0 h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center border transition-all duration-300 bg-white dark:bg-[#111827] border-emerald-50 dark:border-gray-800 shadow-sm hover:shadow hover:border-emerald-100 dark:border-emerald-900/30 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:text-emerald-400"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative shrink-0 h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center border transition-all duration-300 bg-white dark:bg-[#111827] border-emerald-50 dark:border-gray-800 shadow-sm hover:shadow hover:border-emerald-100 dark:border-emerald-900/30 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-emerald-600 dark:text-emerald-400"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>

            {notificationOpen &&
              typeof window !== "undefined" &&
              createPortal(
                <div className="fixed right-4 top-16 w-[calc(100vw-2rem)] max-w-80 bg-white dark:bg-[#111827] border border-emerald-100 dark:border-emerald-900/30 rounded-2xl shadow-xl z-[9999] overflow-hidden">
                  <div className="p-3 border-b border-emerald-100 dark:border-emerald-900/30 font-semibold text-emerald-600 dark:text-emerald-400">Notifications</div>
                  <div className="text-sm divide-y divide-slate-100">
                    <div className="p-3 hover:bg-emerald-50 dark:bg-emerald-900/20 cursor-pointer">New booking received</div>
                    <div className="p-3 hover:bg-emerald-50 dark:bg-emerald-900/20 cursor-pointer">Payment successful</div>
                    <div className="p-3 hover:bg-emerald-50 dark:bg-emerald-900/20 cursor-pointer">Service completed</div>
                  </div>
                </div>,
                document.body
              )}
          </div>

          <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="shrink-0 flex items-center gap-3 rounded-full sm:pl-1.5 sm:pr-4 sm:py-1.5 border transition-all duration-300 group bg-transparent sm:bg-white dark:bg-transparent sm:dark:bg-[#111827] border-transparent sm:border-emerald-50 sm:dark:border-gray-800 sm:shadow-sm hover:shadow hover:border-emerald-100 dark:border-emerald-900/30"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-100">
                {vendorInitial}
              </div>
              <div className="hidden md:block text-left min-w-0">
                <p className="text-sm font-semibold truncate max-w-32 leading-tight text-gray-800 dark:text-gray-100">{vendorName}</p>
                <p className="text-[11px] font-medium truncate mt-0.5 text-emerald-600 dark:text-emerald-400/80">Vendor</p>
              </div>
              <ChevronDown size={14} className="hidden sm:block ml-1 transition-transform group-hover:translate-y-0.5 text-gray-400 dark:text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#111827] border border-emerald-100 dark:border-emerald-900/30 rounded-2xl shadow-xl p-2 z-50">
                <button
                  onClick={() => {
                    setProfileOpen(false);
                    router.push("/vendor/profile");
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-50 dark:bg-emerald-900/20 text-gray-700 dark:text-gray-200 text-sm font-medium"
                >
                  <User size={18} /> Profile
                </button>

                <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:bg-red-900/20 text-sm font-medium mt-1">
                  <LogOut size={18} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}