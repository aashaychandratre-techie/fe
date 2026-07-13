"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  IndianRupee,
  CalendarDays,
  X,
  Star,
  LogOut,
  LifeBuoy,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function VendorSidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const menus = [
    { name: "Dashboard", path: "/vendor/dashboard", icon: <LayoutDashboard size={19} /> },
    { name: "Requests", path: "/vendor/requests", icon: <ClipboardList size={19} /> },
    { name: "Active Services", path: "/vendor/active", icon: <Wrench size={19} /> },
    { name: "Earnings", path: "/vendor/earnings", icon: <IndianRupee size={19} /> },
    { name: "Schedule", path: "/vendor/schedule", icon: <CalendarDays size={19} /> },
    { name: "Ratings", path: "/vendor/ratings", icon: <Star size={19} /> },
  ];

  const logout = () => {
    localStorage.removeItem("vendorId");
    localStorage.removeItem("vendor");
    localStorage.removeItem("vendorEmail");
    localStorage.removeItem("vendorName");
    router.push("/signin");
  };

  return (
    <>
      {open && <div className="fixed inset-0 bg-slate-950/40 z-40 lg:hidden" onClick={() => setOpen(false)} />}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-[280px] bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl border-r border-emerald-100 dark:border-emerald-900/30 transform transition-transform duration-300 flex flex-col ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-5">
          <button onClick={() => router.push("/")} className="flex items-center gap-3 text-left">
            <span className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-100">S</span>
            <span>
              <span className="block text-xl font-bold text-gray-900 dark:text-white">
                Sqft<span className="text-emerald-500">Services</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500">Vendor Panel</span>
            </span>
          </button>

          <button className="lg:hidden h-9 w-9 rounded-xl hover:bg-emerald-50 dark:bg-emerald-900/20 text-gray-500 dark:text-gray-400 dark:text-gray-500 flex items-center justify-center" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </div>

        <div 
          className="flex-1 overflow-y-auto flex flex-col justify-between"
          style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
        >
          {/* Hide scrollbar for webkit browsers */}
          <style dangerouslySetInnerHTML={{__html: `
            .flex-1.overflow-y-auto::-webkit-scrollbar {
              display: none;
            }
          `}} />
          <nav className="px-4 py-5 space-y-2">
            {menus.map((menu) => {
              const active = pathname === menu.path;
              return (
                <Link
                  key={menu.path}
                  href={menu.path}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium ${
                    active
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100"
                      : "text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:bg-emerald-900/20 hover:text-emerald-700 dark:text-emerald-400"
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
              <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-600/20">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white dark:bg-[#111827] opacity-10 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-emerald-300 opacity-20 rounded-full blur-lg pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <LifeBuoy size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white">Need Help?</h3>
                </div>
                
                <p className="relative z-10 text-xs leading-relaxed mb-5 text-emerald-50 font-medium">
                  24/7 priority support for vendors, payments, and account issues.
                </p>
                
                <button onClick={() => router.push("/support")} className="relative z-10 w-full text-sm py-2.5 rounded-xl font-bold transition-all duration-200 shadow-sm bg-white dark:bg-[#111827] text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:bg-emerald-900/20 hover:shadow-md">
                  Contact Support
                </button>
              </div>
            </div>

            <div className="px-4 pb-5">
              <button onClick={logout} className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 hover:bg-red-50 dark:bg-red-900/20 font-medium">
                <LogOut size={19} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}