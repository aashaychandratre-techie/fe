"use client";

import { Menu, Search, Bell } from "lucide-react";

export default function AdminNavbar({ setSidebarOpen }: any) {
  return (
    <header className="sticky top-0 z-40 bg-white border-b px-6 py-3 flex items-center justify-between">

      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">

        {/* MOBILE MENU */}
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden text-slate-700"
        >
          <Menu />
        </button>

        {/* TITLE */}
        <div>
          <h1 className="text-lg font-semibold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-xs text-slate-400 hidden md:block">
            Manage your platform efficiently
          </p>
        </div>

      </div>

      {/* CENTER SEARCH */}
      <div className="hidden md:flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-lg w-80">
        <Search size={16} className="text-slate-500" />
        <input
          placeholder="Search anything..."
          className="bg-transparent outline-none text-sm w-full"
        />
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        {/* NOTIFICATION */}
        <button className="relative">
          <Bell className="text-slate-600" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* PROFILE */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold">
            A
          </div>

          {/* ONLY "ADMIN" TEXT */}
          <span className="text-sm font-medium text-slate-700">
            Admin
          </span>
        </div>

      </div>

    </header>
  );
}