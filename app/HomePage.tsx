"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const services = [
    { title: "Plumbing", desc: "Leak fixing & pipe repairs", icon: "🚰", img: "/plumbing.jpg" },
    { title: "Electrical Work", desc: "Wiring, repairs & fittings", icon: "💡", img: "/electric.jpg" },
    { title: "Car Wash", desc: "Doorstep car cleaning service", icon: "🚗", img: "/carwash.jpg" },
    { title: "Appliance Repair", desc: "AC, fridge & washing machine repair", icon: "🛠️", img: "/repair.jpg" },
    { title: "Painting", desc: "Home & wall painting services", icon: "🎨", img: "/painting1.jpg" },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827]">

      <Navbar />

      {/* HERO */}
      <section className="relative pt-28 pb-16 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-white" />

        <div className="relative max-w-6xl mx-auto px-6 text-center">

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight max-w-2xl mx-auto">
            Book Trusted Services <br />
            <span className="text-emerald-600">Anytime, Anywhere</span>
          </h1>

          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            Verified professionals for plumbing, electrical work, repairs, painting and more — all in one platform.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">

            <button
              onClick={() => router.push("/signup")}
              className="px-7 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold transition"
            >
              Become User
            </button>

            <button
              onClick={() => router.push("/signup")}
              className="px-7 py-3 rounded-xl border border-emerald-200 text-emerald-600 hover:bg-emerald-50 transition"
            >
              Become Provider
            </button>

          </div>

        </div>
      </section>

      {/* SERVICES (FIXED CENTER ALIGNMENT) */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-3xl font-bold text-center mb-10">
            Popular Services
          </h2>

          {/* 🔥 FIXED GRID */}
          <div className="flex flex-wrap justify-center gap-6">

            {services.map((service, i) => (
              <div
                key={i}
                onClick={() =>
                  router.push(
                    `/services/${service.title.toLowerCase().replace(/\s+/g, "-")}`
                  )
                }
                className="relative h-52 w-full sm:w-[47%] md:w-[30%] rounded-2xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition"
              >

                <img
                  src={service.img}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition"
                />

                <div className="absolute inset-0 bg-black/40" />

                <div className="relative h-full flex flex-col justify-end p-5 text-white">

                  <div className="text-2xl">{service.icon}</div>

                  <h3 className="text-lg font-semibold">
                    {service.title}
                  </h3>

                  <p className="text-sm text-gray-200">
                    {service.desc}
                  </p>

                </div>
              </div>
            ))}

          </div>

        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-16 bg-white">

        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-3xl font-bold mb-10">
            Why Choose Us
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

            <div className="p-6 rounded-2xl border hover:shadow-md transition">
              <div className="text-3xl">🔒</div>
              <h3 className="mt-3 font-semibold text-emerald-600">
                Trusted & Verified
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                All professionals are background verified.
              </p>
            </div>

            <div className="p-6 rounded-2xl border hover:shadow-md transition">
              <div className="text-3xl">⚡</div>
              <h3 className="mt-3 font-semibold text-emerald-600">
                Fast Service
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                Instant booking & quick doorstep service.
              </p>
            </div>

            <div className="p-6 rounded-2xl border hover:shadow-md transition">
              <div className="text-3xl">💰</div>
              <h3 className="mt-3 font-semibold text-emerald-600">
                Affordable Pricing
              </h3>
              <p className="text-gray-600 mt-2 text-sm">
                No hidden charges, transparent pricing.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* STATS */}
      <section className="py-16">

        <div className="max-w-6xl mx-auto px-6 text-center mb-10">
          <h2 className="text-3xl font-bold">
            Built on Trust & Performance
          </h2>
        </div>

        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">

          <div className="p-6 rounded-2xl bg-white border shadow-sm">
            <h3 className="text-3xl font-bold text-emerald-500">10K+</h3>
            <p className="text-gray-600">Happy Customers</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border shadow-sm">
            <h3 className="text-3xl font-bold text-yellow-500">4.8/5</h3>
            <p className="text-gray-600">Average Rating</p>
          </div>

          <div className="p-6 rounded-2xl bg-white border shadow-sm">
            <h3 className="text-3xl font-bold text-purple-500">15K+</h3>
            <p className="text-gray-600">Services Completed</p>
          </div>

        </div>

      </section>

      <Footer />

    </div>
  );
}