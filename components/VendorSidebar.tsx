"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  Wrench,
  IndianRupee,
  CalendarDays,
  X,
  Star,
} from "lucide-react";

interface SidebarProps {
  open: boolean;
  setOpen: (value: boolean) => void;
}

export default function Sidebar({ open, setOpen }: SidebarProps) {
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      path: "/vendor/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Requests",
      path: "/vendor/requests",
      icon: <ClipboardList size={18} />,
    },
    {
      name: "Active Services",
      path: "/vendor/active",
      icon: <Wrench size={18} />,
    },
    {
      name: "Earnings",
      path: "/vendor/earnings",
      icon: <IndianRupee size={18} />,
    },
    {
      name: "Schedule",
      path: "/vendor/schedule",
      icon: <CalendarDays size={18} />,
    },
    {
      name: "Ratings",
      path: "/vendor/ratings",
      icon: <Star size={18} />,
    },
  ];

  return (
    <>
      {/* MOBILE OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed lg:static top-0 left-0 z-50
          h-screen w-60 bg-white border-r border-gray-100
          transform transition-transform duration-300
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >

        {/* HEADER / BRAND */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">

          <div>
            <h1 className="text-lg font-bold tracking-tight">
              <span className="text-gray-900">Service</span>
              <span className="text-emerald-600">Sphere</span>
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Vendor Dashboard
            </p>
          </div>

          <button
            className="lg:hidden text-gray-500 hover:text-gray-700"
            onClick={() => setOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* MENU */}
        <nav className="p-3 flex flex-col gap-1.5">

          {menus.map((menu) => {
            const active = pathname === menu.path;

            return (
              <Link
                key={menu.path}
                href={menu.path}
                className={`
                  flex items-center gap-3 px-3 py-2.5 rounded-xl
                  transition-all duration-200 text-sm

                  ${
                    active
                      ? "bg-emerald-50 text-emerald-700 font-semibold border border-emerald-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-emerald-600"
                  }
                `}
              >
                <span className={active ? "text-emerald-600" : "text-gray-400"}>
                  {menu.icon}
                </span>

                {menu.name}
              </Link>
            );
          })}
        </nav>
      </div>
    </>
  );
}