"use client";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  Flag,
  CreditCard,
  BarChart3,
  Briefcase,
  LogOut,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";

type AdminSidebarProps = {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
};

export default function AdminSidebar({ sidebarOpen = false, setSidebarOpen = () => {} }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
    { name: "Vendors", icon: UserCheck, path: "/admin/vendors" },
    { name: "Services", icon: Briefcase, path: "/admin/services" },
    { name: "Bookings", icon: CalendarCheck, path: "/admin/bookings" },
    { name: "Complaints", icon: Flag, path: "/admin/complaints" },
    { name: "Payments", icon: CreditCard, path: "/admin/payments" },
    { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
  ];

  return (
    <>
      {sidebarOpen && <div className="fixed inset-0 bg-slate-950/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 h-screen w-[280px] bg-white/95 dark:bg-[#0B1120]/95 backdrop-blur-xl border-r border-emerald-100 dark:border-emerald-900/30 transform transition-transform duration-300 flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="flex items-center justify-between p-5 border-b border-emerald-100/70 dark:border-emerald-900/30">
          <button onClick={() => router.push("/")} className="flex items-center gap-3 text-left">
            <span className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20">S</span>
            <span>
              <span className="block text-xl font-bold text-gray-900 dark:text-white">
                Sqft<span className="text-emerald-500">Services</span>
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">Admin Console</span>
            </span>
          </button>

          <button className="lg:hidden h-9 w-9 rounded-xl hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-gray-500 dark:text-gray-400 flex items-center justify-center" onClick={() => setSidebarOpen(false)}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
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
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    setSidebarOpen(false);
                    router.push(item.path);
                  }}
                  className={`flex items-center gap-3 w-full px-4 py-3 rounded-2xl transition-all duration-200 text-sm font-medium ${
                    active
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20"
                      : "text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-gray-800/50 hover:text-emerald-700 dark:hover:text-emerald-400"
                  }`}
                >
                  <Icon size={19} />
                  <span>{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div>
            <div className="px-5 mb-5 mt-4">
              <div className="relative overflow-hidden rounded-3xl p-5 bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-xl shadow-emerald-600/20">
                <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white opacity-10 rounded-full blur-xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-16 h-16 bg-emerald-300 opacity-20 rounded-full blur-lg pointer-events-none"></div>

                <div className="relative z-10 flex items-center gap-3 mb-3">
                  <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                    <LogOut size={20} className="text-white" />
                  </div>
                  <h3 className="font-bold text-white">System Status</h3>
                </div>
                
                <p className="relative z-10 text-xs leading-relaxed mb-5 text-emerald-50 font-medium">
                  All systems are running normally. Monitor activity below.
                </p>
                
                <button onClick={() => router.push("/admin/analytics")} className="relative z-10 w-full text-sm py-2.5 rounded-xl font-bold transition-all duration-200 shadow-sm bg-white text-emerald-700 hover:bg-emerald-50 hover:shadow-md">
                  View Analytics
                </button>
              </div>
            </div>

            <div className="px-4 pb-5 border-t border-emerald-100 dark:border-emerald-900/30 pt-4">
              <button onClick={() => router.push("/admin-login")} className="flex items-center justify-center gap-3 w-full px-4 py-3 rounded-2xl text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium">
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