"use client";

import {
  LayoutDashboard,
  Briefcase,
  CalendarDays,
  Star,
  Bell,
  User,
  Settings,
  LogOut,
  X,
  LifeBuoy,
} from "lucide-react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

type Props = {
  darkMode: boolean;
  open: boolean;
  setOpen: (val: boolean) => void;
};

export default function CustomerSidebar({
  darkMode,
  open,
  setOpen,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();

  const menus = [
    {
      name: "Dashboard",
      path: "/customer/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: "Services",
      path: "/customer/services",
      icon: <Briefcase size={20} />,
    },
    {
      name: "Bookings",
      path: "/customer/bookings",
      icon: <CalendarDays size={20} />,
    },
   
    {
      name: "Complaints",
      path: "/customer/complaints",
      icon: <Bell size={20} />,
    },
    {
      name: "Profile",
      path: "/customer/profile",
      icon: <User size={20} />,
    },
   
  ];

  return (
    <>
      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-50
          w-[280px]
          h-screen
          flex flex-col
          border-r
          transition-transform duration-300

          ${
            open
              ? "translate-x-0"
              : "-translate-x-full md:translate-x-0"
          }

          ${
            darkMode
              ? "bg-[#0F172A] border-slate-800"
              : "bg-white border-gray-200"
          }
        `}
      >
        {/* HEADER */}

        <div className="px-6 pt-5 pb-4 border-b border-gray-200/20">

          <div className="flex items-center justify-between">

            <div>
              <h1
                className={`text-2xl font-bold ${
                  darkMode
                    ? "text-white"
                    : "text-gray-900"
                }`}
              >
                Service
                <span className="text-emerald-500">
                  Sphere
                </span>
              </h1>

              <p
                className={`text-xs mt-1 ${
                  darkMode
                    ? "text-slate-400"
                    : "text-gray-500"
                }`}
              >
                Customer Panel
              </p>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="md:hidden"
            >
              <X size={18} />
            </button>

          </div>

        </div>

        {/* MENU */}

        <div className="flex-1 px-4 py-5 space-y-2">

          {menus.map((menu) => {
            const active =
              pathname === menu.path;

            return (
              <Link
                key={menu.path}
                href={menu.path}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  rounded-2xl
                  transition-all duration-300

                  ${
                    active
                      ? "bg-emerald-500 text-white shadow-lg"
                      : darkMode
                      ? "text-slate-300 hover:bg-slate-800"
                      : "text-gray-700 hover:bg-emerald-50"
                  }
                `}
              >
                {menu.icon}

                <span className="font-medium">
                  {menu.name}
                </span>
              </Link>
            );
          })}
         
        </div>

        {/* HELP CARD */}

        <div className="px-4 mb-4">

          <div
            className={`
              rounded-3xl
              p-4
              ${
                darkMode
                  ? "bg-slate-800"
                  : "bg-emerald-50"
              }
            `}
          >

            <div className="flex items-center gap-2 mb-3">
              <LifeBuoy
                size={18}
                className="text-emerald-500"
              />

              <h3 className="font-semibold">
                Need Help?
              </h3>
            </div>

            <p
              className={`text-xs mb-4 ${
                darkMode
                  ? "text-slate-400"
                  : "text-gray-500"
              }`}
            >
              Our support team is available
              24/7 to assist you.
            </p>

            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm py-2.5 rounded-xl transition">
              Contact Support
            </button>

          </div>

        </div>

        {/* LOGOUT */}

        <div className="px-4 pb-5">

          <button
            onClick={() => router.push("/")}
            className="
              flex items-center gap-3
              w-full
              px-4 py-3
              rounded-2xl
              text-red-500
              hover:bg-red-50
              transition-all
            "
          >
            <LogOut size={20} />

            <span className="font-medium">
              Logout
            </span>
          </button>

        </div>

      </aside>
    </>
  );
}


