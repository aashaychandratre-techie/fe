"use client";

import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Bell,
  User,
  LogOut,
  X,
  LifeBuoy,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import ComplaintModal from "./ComplaintModal";

type Props = {
  darkMode: boolean;
  open: boolean;
  setOpen: (val: boolean) => void;
};

export default function CustomerSidebar({ darkMode, open, setOpen }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setShowComplaintModal(false);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const menus = [
    { name: "Dashboard", path: "/customer/dashboard", icon: <LayoutDashboard size={19} /> },
    { name: "Services", path: "/customer/services", icon: <Briefcase size={19} /> },
    { name: "Bookings", path: "/customer/bookings", icon: <CalendarDays size={19} /> },
    { name: "Complaints", path: "/customer/complaints", icon: <Bell size={19} /> },
    { name: "Profile", path: "/customer/profile", icon: <User size={19} /> },
  ];

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <>
      {open && <div onClick={() => setOpen(false)} className="fixed inset-0 bg-slate-950/40 z-40 md:hidden" />}

      <aside
        className={`fixed md:static top-0 left-0 z-50 w-[280px] h-screen flex flex-col border-r transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${darkMode ? "bg-[#0F172A] border-slate-800" : "bg-white/95 backdrop-blur-xl border-emerald-100"}`}
      >
        <div className="px-5 pt-5 pb-4 border-b border-emerald-100/70">
          <div className="flex items-center justify-between">
            <button onClick={() => router.push("/customer/dashboard")} className="flex items-center gap-3 text-left">
              <span className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-100">
                S
              </span>
              <span>
                <span className={`block text-xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                  Service<span className="text-emerald-500">Sphere</span>
                </span>
                <span className={`text-xs ${darkMode ? "text-slate-400" : "text-gray-500"}`}>Customer Panel</span>
              </span>
            </button>

            <button onClick={() => setOpen(false)} className="md:hidden h-9 w-9 rounded-xl hover:bg-emerald-50 flex items-center justify-center">
              <X size={18} />
            </button>
          </div>
        </div>

        <div 
          className="flex-1 flex flex-col justify-between overflow-hidden"
        >
          <nav className="px-4 py-5 space-y-2">
          {menus.map((menu) => {
            const active = pathname === menu.path || (menu.name === "Complaints" && showComplaintModal);
            
            if (menu.name === "Complaints") {
              return (
                <button
                  key={menu.path}
                  onClick={(e) => {
                    e.preventDefault();
                    setOpen(false);
                    setShowComplaintModal(true);
                    window.history.pushState(null, "", "/customer/complaints");
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                    active
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                      : darkMode
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                  }`}
                >
                  {menu.icon}
                  <span>{menu.name}</span>
                </button>
              );
            }

            return (
              <Link
                key={menu.path}
                href={menu.path}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                    : darkMode
                    ? "text-slate-300 hover:bg-slate-800"
                    : "text-gray-700 hover:bg-emerald-50 hover:text-emerald-700"
                }`}
              >
                {menu.icon}
                <span>{menu.name}</span>
              </Link>
            );
          })}
          </nav>

          <div>
            <div className="px-5 mb-5 mt-4">
              <div className={`relative overflow-hidden rounded-3xl p-5 ${darkMode ? "bg-slate-800" : "bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-600/20"}`}>
                {/* Abstract background rings for premium feel */}
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-emerald-300 opacity-20 rounded-full blur-lg pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <LifeBuoy size={20} className={darkMode ? "text-emerald-400" : "text-white"} />
                  </div>
                  <h3 className={`font-bold ${darkMode ? "text-white" : "text-white"}`}>Need Help?</h3>
                </div>
                
                <p className={`relative z-10 text-xs leading-relaxed mb-5 ${darkMode ? "text-slate-400" : "text-emerald-50 font-medium"}`}>
                  24/7 priority support for bookings, payments, and active service issues.
                </p>
                
                <button onClick={() => router.push("/support")} className={`relative z-10 w-full text-sm py-2.5 rounded-xl font-bold transition-all duration-200 shadow-sm ${darkMode ? "bg-emerald-500 hover:bg-emerald-600 text-white" : "bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-md"}`}>
                  Contact Support
                </button>
              </div>
            </div>

            <div className="px-4 pb-5">
              <button onClick={logout} className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 font-medium">
                <LogOut size={19} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      <ComplaintModal 
        isOpen={showComplaintModal} 
        onClose={() => {
          setShowComplaintModal(false);
          window.history.pushState(null, "", pathname);
        }} 
      />
    </>
  );
}