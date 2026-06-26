"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`fixed top-0 w-full z-50 transition-all duration-300
      ${
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-md border-b border-emerald-100"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* LOGO */}
        <h1
          onClick={() => router.push("/")}
          className="text-emerald-600 font-bold text-xl cursor-pointer"
        >

              <span className="text-gray-900">Service</span>
              <span className="text-emerald-600">Sphere</span>
            
        </h1>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex gap-6 text-sm items-center text-gray-600">

          <button
            onClick={() => router.push("/support")}
            className="hover:text-emerald-600 transition"
          >
            Support
          </button>

          {!isLoggedIn ? (
            <>
              <button
                onClick={() => router.push("/signin")}
                className="hover:text-emerald-600 transition"
              >
                Sign In
              </button>

              <button
                onClick={() => router.push("/signup")}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white transition"
              >
                Sign Up
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsLoggedIn(false)}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white"
            >
              Logout
            </button>
          )}

        </div>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-gray-700"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-emerald-100 px-6 py-4">

          <div className="flex flex-col gap-4 text-gray-700">

            <button
              onClick={() => {
                router.push("/");
                setMenuOpen(false);
              }}
              className="text-left hover:text-emerald-600"
            >
              Home
            </button>

            <button
              onClick={() => {
                router.push("/contact");
                setMenuOpen(false);
              }}
              className="text-left hover:text-emerald-600"
            >
              Support
            </button>

            {!isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    router.push("/signin");
                    setMenuOpen(false);
                  }}
                  className="text-left hover:text-emerald-600"
                >
                  Sign In
                </button>

                <button
                  onClick={() => {
                    router.push("/signup");
                    setMenuOpen(false);
                  }}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl py-2"
                >
                  Sign Up
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsLoggedIn(false);
                  setMenuOpen(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl py-2"
              >
                Logout
              </button>
            )}

          </div>

        </div>
      )}
    </div>
  );
}