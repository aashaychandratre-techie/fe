"use client";

import { Bell, Moon, Sun, Menu } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  setSidebarOpen: (value: boolean) => void;
  userName: string;
  firstLetter: string;
};

import { useState, useEffect } from "react";

export default function CustomerNavbar({ darkMode, setDarkMode, setSidebarOpen, userName, firstLetter }: Props) {
  const router = useRouter();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  useEffect(() => {
    const syncImage = () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (user.profileImage) {
        if (user.profileImage.startsWith("http")) {
          setProfileImage(user.profileImage);
        } else {
          setProfileImage(`http://localhost:8080${user.profileImage.startsWith('/') ? '' : '/'}${user.profileImage}`);
        }
      } else {
        setProfileImage(null);
      }
    };
    
    syncImage();
    window.addEventListener("storage", syncImage);
    return () => window.removeEventListener("storage", syncImage);
  }, []);

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
            <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-colors overflow-hidden ${darkMode ? "bg-slate-700 text-emerald-400 group-hover:bg-slate-600" : "bg-emerald-50 text-emerald-700 group-hover:bg-emerald-100"}`}>
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                firstLetter
              )}
            </div>
            <div className="hidden md:block text-left min-w-0">
              <p className={`text-sm font-semibold truncate max-w-32 leading-tight ${darkMode ? "text-white" : "text-gray-800"}`}>{userName}</p>
              <p className={`text-[11px] font-medium truncate mt-0.5 ${darkMode ? "text-emerald-400" : "text-emerald-600/80"}`}>Customer</p>
            </div>
        
          </button>
        </div>
      </div>
    </header>
  );
}