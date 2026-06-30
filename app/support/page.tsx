"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import { ChevronDown } from "lucide-react";

type FAQ = {
  q: string;
  a: string;
  category: "General" | "Booking" | "Payments";
};

export default function ContactPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<"All" | "General" | "Booking" | "Payments">("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const faqs: FAQ[] = [
    {
      q: "How does ServiceSphere work?",
      a: "You can browse services and book instantly. The provider will reach your location at the scheduled time.",
      category: "General",
    },
    {
      q: "How can I book a service?",
      a: "Choose a service, select provider, and confirm booking.",
      category: "Booking",
    },
    {
      q: "Can I cancel a booking?",
      a: "Yes, from your dashboard before service starts.",
      category: "Booking",
    },
    {
      q: "How do payments work?",
      a: "Payments are released after service completion.",
      category: "Payments",
    },
  ];

  const filteredFaqs = useMemo(() => {
    return faqs.filter((f) => {
      const matchSearch =
        f.q.toLowerCase().includes(search.toLowerCase()) ||
        f.a.toLowerCase().includes(search.toLowerCase());

      const matchCategory =
        activeCategory === "All" || f.category === activeCategory;

      return matchSearch && matchCategory;
    });
  }, [search, activeCategory]);

  const categories = ["All", "General", "Booking", "Payments"] as const;

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-[#0B1120] text-gray-900 dark:text-gray-100 font-sans relative overflow-x-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-300/10 dark:bg-emerald-900/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* HEADER */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
            Help <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-emerald-500 dark:from-emerald-400 dark:to-emerald-300">Center</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">
            Search for answers or browse our FAQs to get the help you need.
          </p>

          {/* SEARCH */}
          <div className="mt-10 relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-emerald-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search your question..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-3xl bg-white dark:bg-[#111827] border border-gray-200 dark:border-gray-800 shadow-sm focus:shadow-md
              focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 dark:focus:ring-emerald-400/20 dark:focus:border-emerald-400 transition-all font-medium text-gray-900 dark:text-white"
            />
          </div>

          {/* TABS */}
          <div className="mt-8 flex justify-start sm:justify-center">
            {/* MOBILE DROPDOWN */}
            <div className="sm:hidden w-full relative z-20">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between bg-white/80 dark:bg-[#111827]/80 backdrop-blur-md border border-gray-200 dark:border-gray-700/60 text-gray-800 dark:text-gray-200 font-bold py-3.5 px-5 rounded-2xl shadow-sm transition-all duration-300"
              >
                <span className="truncate">{activeCategory}</span>
                <ChevronDown className={`text-emerald-500 shrink-0 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} size={20} />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-[#111827]/95 backdrop-blur-xl border border-gray-200 dark:border-gray-700/60 rounded-2xl shadow-xl overflow-hidden transform origin-top transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="py-2">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setActiveCategory(cat);
                          setIsDropdownOpen(false);
                        }}
                        className={`
                          w-full flex items-center gap-2 text-left px-5 py-3 text-sm font-bold transition-all duration-200 border-l-4
                          ${activeCategory === cat 
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" 
                            : "border-transparent text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"}
                        `}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* DESKTOP PILL TABS */}
            <div className="hidden sm:flex flex-wrap items-center justify-center gap-2 bg-white/60 dark:bg-[#111827]/60 p-1.5 rounded-full backdrop-blur-md border border-gray-200 dark:border-gray-700/60 shadow-sm">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shrink-0 whitespace-nowrap ${
                    activeCategory === cat
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:text-gray-900 dark:hover:text-white"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="max-w-3xl mx-auto mt-16 space-y-4 min-h-[500px]">
          {filteredFaqs.map((item, index) => (
            <div
              key={index}
              className={`bg-white dark:bg-[#111827] border border-gray-100 dark:border-gray-800 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden ${
                openIndex === index ? "ring-1 ring-emerald-500/20 dark:ring-emerald-400/20" : ""
              }`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 sm:px-8 sm:py-6 flex justify-between items-center group text-left"
              >
                <span className={`font-bold text-lg transition-colors ${openIndex === index ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400"}`}>
                  {item.q}
                </span>
                
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shrink-0 ${openIndex === index ? "bg-emerald-500 text-white rotate-180" : "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40"}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </div>
              </button>

              <div 
                className={`transition-all duration-300 ease-in-out ${
                  openIndex === index ? "max-h-40 opacity-100 pb-6 sm:pb-8" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 sm:px-8 text-gray-600 dark:text-gray-400 font-medium leading-relaxed">
                  {item.a}
                </div>
              </div>
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center py-16 bg-white dark:bg-[#111827] border border-dashed border-gray-300 dark:border-gray-700 rounded-3xl">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">No results found</h3>
              <p className="text-gray-500 dark:text-gray-400 mt-2">We couldn't find any FAQs matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}