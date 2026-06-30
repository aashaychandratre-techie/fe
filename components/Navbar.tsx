"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Headphones, Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    const syncLogin = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("user") || localStorage.getItem("vendor")));
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

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("vendor");
    localStorage.removeItem("vendorId");
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
  };

  const goTo = (path: string) => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled || menuOpen
          ? "bg-white/90 backdrop-blur-xl shadow-sm border-b border-emerald-100"
          : "bg-white/70 backdrop-blur-md border-b border-white/50"
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
        <button
          onClick={() => goTo("/")}
          className="group flex items-center gap-2 text-left"
        >
          <span className="h-9 w-9 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-lg shadow-emerald-200 group-hover:-translate-y-0.5 transition">
            S
          </span>
          <span className="text-xl font-bold tracking-tight">
            <span className="text-gray-900">Service</span>
            <span className="text-emerald-600">Sphere</span>
          </span>
        </button>

        <nav className="hidden md:flex gap-3 text-sm items-center text-gray-600">
          <button
            onClick={() => goTo("/support")}
            className="inline-flex items-center gap-2 rounded-xl px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Headphones size={16} />
            Support
          </button>

          {!isLoggedIn ? (
            <>
              <button
                onClick={() => goTo("/signin")}
                className="rounded-xl px-3 py-2 hover:bg-emerald-50 hover:text-emerald-700"
              >
                Sign In
              </button>

              <button
                onClick={() => goTo("/signup")}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-100"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold shadow-lg shadow-red-100"
            >
              Logout
            </button>
          )}
        </nav>

        <button
          className="md:hidden h-10 w-10 rounded-xl bg-white border border-emerald-100 text-gray-700 flex items-center justify-center shadow-sm"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-t border-emerald-100 px-4 py-4 shadow-xl">
          <div className="flex flex-col gap-2 text-gray-700">
            <button onClick={() => goTo("/")} className="text-left rounded-xl px-4 py-3 hover:bg-emerald-50">
              Home
            </button>
            <button onClick={() => goTo("/support")} className="text-left rounded-xl px-4 py-3 hover:bg-emerald-50">
              Support
            </button>

            {!isLoggedIn ? (
              <>
                <button onClick={() => goTo("/signin")} className="text-left rounded-xl px-4 py-3 hover:bg-emerald-50">
                  Sign In
                </button>
                <button onClick={() => goTo("/signup")} className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-3 font-semibold">
                  Sign Up
                </button>
              </>
            ) : (
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white rounded-xl py-3 font-semibold">
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}