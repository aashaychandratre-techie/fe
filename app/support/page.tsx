"use client";

import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";

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
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">
      <Navbar />

      <div className="pt-28 px-4 sm:px-6">

        {/* HEADER */}
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold">
            Help <span className="text-emerald-500">Center</span>
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Search answers or browse categories
          </p>

          {/* SEARCH */}
          <input
            type="text"
            placeholder="Search your question..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-6 w-full px-4 py-3 rounded-xl bg-white border border-gray-300
            focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
          />

          {/* CATEGORY BUTTONS */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm transition border ${
                  activeCategory === cat
                    ? "bg-emerald-500 text-white border-emerald-500"
                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ LIST */}
        <div className="max-w-2xl mx-auto mt-10 space-y-3">

          {filteredFaqs.map((item, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
            >
              <button
                onClick={() =>
                  setOpenIndex(openIndex === index ? null : index)
                }
                className="w-full px-5 py-4 flex justify-between items-center"
              >
                <span className="font-medium text-left text-gray-900">
                  {item.q}
                </span>

                <span className="text-emerald-500 text-lg">
                  {openIndex === index ? "−" : "+"}
                </span>
              </button>

              {openIndex === index && (
                <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          ))}

          {filteredFaqs.length === 0 && (
            <div className="text-center text-gray-500 mt-10 text-sm">
              No results found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}