import { useEffect, useState } from "react";

export function useDarkMode() {
  const [darkMode, setDarkModeState] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [portal, setPortal] = useState("customer");

  useEffect(() => {
    setMounted(true);
    const path = window.location.pathname;
    let currentPortal = "customer";
    if (path.startsWith("/vendor")) currentPortal = "vendor";
    if (path.startsWith("/admin")) currentPortal = "admin";
    
    setPortal(currentPortal);
    
    const stored = localStorage.getItem(`${currentPortal}-theme`);
    if (stored === "dark") {
      setDarkModeState(true);
      document.documentElement.classList.add("dark");
    } else {
      setDarkModeState(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const setDarkMode = (isDark: boolean) => {
    setDarkModeState(isDark);
    localStorage.setItem(`${portal}-theme`, isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return [mounted ? darkMode : false, setDarkMode] as const;
}
