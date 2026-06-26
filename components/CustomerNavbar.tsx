"use client";

import {
  Bell,
  Moon,
  Sun,
  Menu,
  Search,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setSidebarOpen: (value: boolean) => void;
  userName: string;
  firstLetter: string;
};

export default function CustomerNavbar({
  darkMode,
  setDarkMode,
  setSidebarOpen,
  userName,
  firstLetter,
}: Props) {
  const router = useRouter();

  return (
    <header
      className={`sticky top-0 z-30 w-full border-b backdrop-blur-xl transition-all
      ${
        darkMode
          ? "bg-[#0F172A]/95 border-slate-700"
          : "bg-white/95 border-gray-200 shadow-sm"
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-6 py-2">

        {/* LEFT */}
        <div className="flex items-center gap-3">

          <button
            onClick={() => setSidebarOpen(true)}
            className={`md:hidden p-2 rounded-lg transition
            ${
              darkMode
                ? "hover:bg-slate-700"
                : "hover:bg-gray-100"
            }`}
          >
            <Menu size={20} />
          </button>

          <div>
            <h1
              className={`text-xl font-semibold
              ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Welcome Back 👋
            </h1>

            <p
              className={`text-xs
              ${
                darkMode
                  ? "text-slate-400"
                  : "text-gray-500"
              }`}
            >
              Manage your bookings easily
            </p>
          </div>

        </div>

        {/* SEARCH */}
        <div className="hidden lg:flex flex-1 max-w-lg mx-6">

          <div
            className={`flex items-center w-full rounded-xl px-3 h-9 border
            ${
              darkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-gray-50 border-gray-200"
            }`}
          >

            <Search
              size={16}
              className={
                darkMode
                  ? "text-slate-400"
                  : "text-gray-400"
              }
            />

            <input
              type="text"
              placeholder="Search services..."
              className={`flex-1 ml-2 bg-transparent outline-none text-sm
              ${
                darkMode
                  ? "text-white placeholder:text-slate-400"
                  : "text-gray-800 placeholder:text-gray-400"
              }`}
            />

          </div>

        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-2">

          {/* Dark Mode */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`h-9 w-9 rounded-lg flex items-center justify-center transition
            ${
              darkMode
                ? "bg-slate-800 hover:bg-emerald-600 text-white"
                : "bg-gray-100 hover:bg-emerald-500 hover:text-white text-gray-700"
            }`}
          >
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              className={`h-9 w-9 rounded-lg flex items-center justify-center transition
              ${
                darkMode
                  ? "bg-slate-800 hover:bg-emerald-600 text-white"
                  : "bg-gray-100 hover:bg-emerald-500 hover:text-white text-gray-700"
              }`}
            >
              <Bell size={16} />
            </button>

            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500"></span>
          </div>

          {/* Profile */}
          <button
            onClick={() => router.push("/customer/profile")}
            className={`flex items-center gap-2 rounded-xl px-3 py-1.5 border transition shadow-sm hover:shadow-md
            ${
              darkMode
                ? "bg-slate-800 border-slate-700"
                : "bg-white border-gray-200"
            }`}
          >

            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
              {firstLetter}
            </div>

            <div className="hidden md:block text-left">
              <p
                className={`text-sm font-semibold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {userName}
              </p>

              <p
                className={`text-[11px] ${
                  darkMode
                    ? "text-slate-400"
                    : "text-gray-500"
                }`}
              >
                Customer
              </p>
            </div>

            <ChevronDown
              size={14}
              className={
                darkMode ? "text-slate-400" : "text-gray-500"
              }
            />

          </button>

        </div>
      </div>
    </header>
  );
}