"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Menu, Search, Bell, Sun, Moon, ChevronDown, User, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

type AdminNavbarProps = {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
};

export default function AdminNavbar({ setSidebarOpen = () => {} }: AdminNavbarProps) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

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
    // Add any admin logout logic here
    router.push("/admin-login");
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b backdrop-blur-xl transition-all shadow-sm bg-white/70 dark:bg-[#0B1120]/80 border-emerald-50 dark:border-gray-800">
      <div className="flex items-center justify-between px-3 sm:px-5 md:px-8 py-2.5 sm:py-3.5 gap-2 sm:gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all bg-emerald-50/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100/50"
            aria-label="Open admin menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-bold truncate tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500">
              Hi, Admin!
            </h1>
            <p className="hidden sm:block text-xs font-medium truncate mt-0.5 text-emerald-700 dark:text-emerald-400/60">
              System is running smoothly.
            </p>
          </div>
        </div>

        <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
          <div className="flex items-center gap-2 bg-white/50 dark:bg-[#111827]/50 border border-emerald-100/50 dark:border-gray-800 px-4 py-2.5 rounded-full w-full focus-within:ring-2 focus-within:ring-emerald-500/20 focus-within:border-emerald-400 transition-all shadow-sm">
            <Search size={18} className="text-gray-400 dark:text-gray-500" />
            <input placeholder="Search platform activity..." className="bg-transparent outline-none text-sm w-full font-medium text-gray-800 dark:text-gray-200" />
          </div>
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
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-gray-900" />
            </button>

            {notificationOpen &&
              typeof window !== "undefined" &&
              createPortal(
                <div className="fixed right-4 top-16 w-[calc(100vw-2rem)] max-w-80 bg-white dark:bg-[#111827] border border-emerald-100 dark:border-emerald-900/30 rounded-2xl shadow-xl z-[9999] overflow-hidden">
                  <div className="p-3 border-b border-emerald-100 dark:border-emerald-900/30 font-semibold text-emerald-600 dark:text-emerald-400">System Alerts</div>
                  <div className="text-sm divide-y divide-slate-100 dark:divide-gray-800 text-gray-700 dark:text-gray-300">
                    <div className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer">New vendor registration</div>
                    <div className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer">High server load detected</div>
                    <div className="p-3 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 cursor-pointer">5 pending complaints</div>
                  </div>
                </div>,
                document.body
              )}
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-800 mx-1 sm:mx-2 hidden sm:block"></div>

          <div ref={profileRef} className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="shrink-0 flex items-center gap-3 rounded-full sm:pl-1.5 sm:pr-4 sm:py-1.5 border transition-all duration-300 group bg-transparent sm:bg-white dark:bg-transparent sm:dark:bg-[#111827] border-transparent sm:border-emerald-50 sm:dark:border-gray-800 sm:shadow-sm hover:shadow hover:border-emerald-100 dark:border-emerald-900/30"
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40">
                A
              </div>
              <div className="hidden md:block text-left min-w-0">
                <p className="text-sm font-semibold truncate max-w-32 leading-tight text-gray-800 dark:text-gray-100">Administrator</p>
                <p className="text-[11px] font-medium truncate mt-0.5 text-emerald-600 dark:text-emerald-400/80">Super Admin</p>
              </div>
              <ChevronDown size={14} className="hidden sm:block ml-1 transition-transform group-hover:translate-y-0.5 text-gray-400 dark:text-gray-500" />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#111827] border border-emerald-100 dark:border-emerald-900/30 rounded-2xl shadow-xl p-2 z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 p-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium"
                >
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