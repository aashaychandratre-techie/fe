"use client";

import {
  LayoutDashboard,
  Users,
  UserCheck,
  CalendarCheck,
  Flag,
  CreditCard,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

import { useRouter, usePathname } from "next/navigation";

export default function AdminSidebar({ sidebarOpen, setSidebarOpen }: any) {
  const router = useRouter();
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Customers", icon: Users, path: "/admin/customers" },
    { name: "Vendors", icon: UserCheck, path: "/admin/vendors" },
    { name: "Bookings", icon: CalendarCheck, path: "/admin/bookings" },
    { name: "Complaints", icon: Flag, path: "/admin/complaints" },
    { name: "Payments", icon: CreditCard, path: "/admin/payments" },
    { name: "Analytics", icon: BarChart3, path: "/admin/analytics" },
    { name: "Settings", icon: Settings, path: "/admin/settings" },
  ];

  return (
    <>
      {/* overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 lg:hidden"
        />
      )}

      <aside
        className={`
        fixed top-0 left-0 z-50 h-full w-64
        bg-white border-r
        flex flex-col justify-between
        transition-transform duration-300
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0
      `}
      >
        {/* TOP */}
        <div className="p-5">

          <h1 className="text-xl font-bold">
            <span className="text-slate-900">Service</span>
            <span className="text-emerald-500">Sphere</span>
          </h1>

          <div className="mt-8 space-y-2">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.path;

              return (
                <button
                  key={item.path}
                  onClick={() => router.push(item.path)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-xl
                    transition
                    ${
                      active
                        ? "bg-emerald-500 text-white"
                        : "text-slate-600 hover:bg-slate-100"
                    }
                  `}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM */}
        <div className="p-5 border-t">
          <button className="flex items-center gap-3 text-red-500">
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}