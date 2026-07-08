"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Headphones,
  Menu,
  X,
  User,
  LogOut,
  ChevronDown,
} from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [userRole, setUserRole] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    const syncLogin = () => {
      const vendor = localStorage.getItem("vendor");
      const user = localStorage.getItem("user");

      if (vendor) {
        const vendorData = JSON.parse(vendor);
        setUserData(vendorData);
        setUserRole("Vendor");
        setIsLoggedIn(true);
      } else if (user) {
        const userInfo = JSON.parse(user);
        setUserData(userInfo);
        setUserRole("Customer");
        setIsLoggedIn(true);
      } else {
        setUserData(null);
        setUserRole("");
        setIsLoggedIn(false);
      }
    };

    handleScroll();
    syncLogin();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("storage", syncLogin);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", syncLogin);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("vendor");
    localStorage.removeItem("vendorId");

    setUserData(null);
    setIsLoggedIn(false);
    setProfileOpen(false);
    setMenuOpen(false);

    router.push("/");
  };

  const goTo = (path: string) => {
    setMenuOpen(false);
    setProfileOpen(false);
    router.push(path);
  };

  const userName = userData?.fullName || userData?.name || "User";
  const firstLetter = userName.charAt(0).toUpperCase();

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-emerald-100"
          : "bg-white/70 backdrop-blur-md border-b border-white/50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <button
          onClick={() => goTo("/")}
          className="group flex items-center gap-2 text-left"
        >
          <span className="h-9 w-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-200 group-hover:-translate-y-0.5 transition">
            S
          </span>

          <span className="text-xl font-bold tracking-tight">
            <span className="text-gray-900">Sqft</span>
            <span className="text-emerald-600">Services</span>
          </span>
        </button>

        {/* Desktop */}
        <nav className="hidden md:flex gap-3 text-sm items-center">
          <button
            onClick={() => goTo("/support")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600"
          >
            <Headphones size={16} />
            Support
          </button>

          {!isLoggedIn ? (
            <button
              onClick={() => goTo("/signin")}
              className="rounded-xl px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-gray-600"
            >
              Sign In
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
               className="flex items-center gap-2 h-10 px-2.5 border border-emerald-300 rounded-full bg-white hover:border-emerald-500 hover:shadow-md transition-all duration-200"
                >
                <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-semibold text-sm">
  {firstLetter}
</div>

               <div className="text-left leading-tight">
  <p className="font-medium text-sm text-gray-900">
    {userName}
  </p>
</div>

                <ChevronDown
                  size={14}
                  className={`text-gray-500 transition ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-1">
                  <button
  onClick={() => {
    if (userRole === "Vendor") {
      goTo("/vendor/profile");
    } else {
      goTo("/customer/profile");
    }
  }}
                    className="w-full flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-gray-50"
                  >
                    <User size={22} />
                    <span className="text-lg">Profile</span>
                  </button>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-6 py-3 text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={22} />
                    <span className="text-lg">Logout</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Mobile Menu */}
        <button
          className="md:hidden h-10 w-10 rounded-xl bg-white border border-emerald-100 text-gray-700 flex items-center justify-center shadow-sm"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 shadow-lg px-4 py-4">
          <div className="flex flex-col gap-2">
            <button
              onClick={() => goTo("/")}
              className="text-left px-4 py-3 rounded-xl hover:bg-emerald-50"
            >
              Home
            </button>

            <button
              onClick={() => goTo("/support")}
              className="text-left px-4 py-3 rounded-xl hover:bg-emerald-50"
            >
              Support
            </button>

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => goTo("/signin")}
                  className="text-left px-4 py-3 rounded-xl hover:bg-emerald-50"
                >
                  Sign In
                </button>

                <button
                  onClick={() => goTo("/signup")}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-semibold"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <>
             <div className="absolute right-0 mt-2 w-40 rounded-xl bg-white shadow-lg border border-gray-100 overflow-hidden">
  <button className="flex items-center w-full h-9 px-3 text-[13px] hover:bg-gray-50">
    <User size={15} className="mr-2" />
    Profile
  </button>

  <button className="flex items-center w-full h-9 px-3 text-[13px] text-red-600 hover:bg-red-50">
    <LogOut size={15} className="mr-2" />
    Logout
  </button>
</div>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}