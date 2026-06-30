"use client";

import { Bell, Moon, Sun, Menu, Search, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setSidebarOpen: (value: boolean) => void;
  userName: string;
  firstLetter: string;
};

export default function CustomerNavbar({ darkMode, setDarkMode, setSidebarOpen, userName, firstLetter }: Props) {
  const router = useRouter();

  return (
    <header
      className={`sticky top-0 z-30 w-full border-b backdrop-blur-xl transition-all shadow-sm ${
        darkMode ? "bg-[#0F172A]/80 border-slate-800/50" : "bg-white/70 border-emerald-50"
      }`}
    >
      <div className="flex items-center justify-between px-3 sm:px-5 md:px-8 py-2.5 sm:py-3.5 gap-2 sm:gap-4">
        <div className="flex items-center gap-4 min-w-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className={`md:hidden shrink-0 h-9 w-9 sm:h-10 sm:w-10 rounded-full flex items-center justify-center transition-all ${darkMode ? "hover:bg-slate-700 text-slate-300" : "bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/50"}`}
            aria-label="Open customer menu"
          >
            <Menu size={20} />
          </button>

          <div className="min-w-0">
            <h1 className={`text-base sm:text-xl font-bold truncate tracking-tight ${darkMode ? "text-white" : "text-gray-800"}`}>
              Hi, <span className="text-emerald-600 font-extrabold">{userName.split(' ')[0]}</span>
            </h1>
            <p className={`hidden sm:block text-xs font-medium truncate mt-0.5 ${darkMode ? "text-slate-400" : "text-gray-400"}`}>Everything looks great today.</p>
          </div>
        </div>

        <div className="hidden lg:flex flex-1 max-w-md mx-6">
          <div className={`flex items-center w-full rounded-full px-5 h-11 border transition-all duration-300 focus-within:ring-4 focus-within:ring-emerald-500/10 focus-within:border-emerald-300 ${darkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-gray-50/50 border-gray-100 hover:border-gray-200 focus-within:bg-white shadow-inner shadow-gray-50/50"}`}>
            <Search size={16} className={`transition-colors ${darkMode ? "text-slate-400" : "text-gray-400"}`} />
            <input type="text" placeholder="Search for anything..." style={{boxShadow: 'none', border: 'none', outline: 'none'}} className={`flex-1 ml-3 bg-transparent border-0 focus:ring-0 outline-none text-sm font-medium ${darkMode ? "text-white placeholder:text-slate-500" : "text-gray-700 placeholder:text-gray-400"}`} />
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`shrink-0 h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center border transition-all duration-300 ${darkMode ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700 text-white" : "bg-white border-emerald-50 shadow-sm hover:shadow hover:border-emerald-100 text-gray-500 hover:text-emerald-600"}`}
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button className={`relative shrink-0 h-9 w-9 sm:h-11 sm:w-11 rounded-full flex items-center justify-center border transition-all duration-300 ${darkMode ? "bg-slate-800/50 border-slate-700/50 hover:bg-slate-700 text-white" : "bg-white border-emerald-50 shadow-sm hover:shadow hover:border-emerald-100 text-gray-500 hover:text-emerald-600"}`} aria-label="Notifications">
            <Bell size={18} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white" />
          </button>

          <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

          <button
            onClick={() => router.push("/customer/profile")}
            className={`shrink-0 flex items-center gap-3 rounded-full sm:pl-1.5 sm:pr-4 sm:py-1.5 border transition-all duration-300 group ${darkMode ? "bg-slate-800/50 sm:border-slate-700/50 hover:bg-slate-700 border-transparent" : "bg-transparent sm:bg-white sm:border-emerald-50 sm:shadow-sm hover:shadow hover:border-emerald-100 border-transparent"}`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${darkMode ? "bg-slate-700 text-emerald-400 group-hover:bg-slate-600" : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"}`}>
              {firstLetter}
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className={`text-sm font-semibold truncate max-w-32 leading-tight ${darkMode ? "text-white" : "text-gray-800"}`}>{userName}</p>
              <p className={`text-[11px] font-medium truncate mt-0.5 ${darkMode ? "text-emerald-400" : "text-emerald-600/80"}`}>Customer</p>
            </div>
            <ChevronDown size={14} className={`hidden sm:block ml-1 transition-transform group-hover:translate-y-0.5 ${darkMode ? "text-slate-400" : "text-gray-400"}`} />
          </button>
        </div>
      </div>
    </header>
  );
}