"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

type ServiceType = {
  title: string;
  image: string;
  description: string;
  includes: string[];
};

export default function ServicePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const services: Record<string, ServiceType> = {
    plumbing: {
      title: "Plumbing",
      image: "/plumbing.jpg",
      description:
        "Professional plumbing services for homes and offices. Fast leak repair, pipe fitting and maintenance.",
      includes: ["Leak Repair", "Pipe Installation", "Bathroom Fittings", "Water Tank Cleaning"],
    },

    "electrical-work": {
      title: "Electrical Work",
      image: "/electric.jpg",
      description:
        "Certified electricians for wiring, repair and installations with safety assurance.",
      includes: ["House Wiring", "Switch Repair", "Fan Installation", "MCB Replacement"],
    },

    "car-wash": {
      title: "Car Wash",
      image: "/carwash.jpg",
      description:
        "Doorstep car cleaning and detailing service with professional equipment.",
      includes: ["Exterior Wash", "Interior Cleaning", "Tyre Polish", "Dashboard Cleaning"],
    },

    painting: {
      title: "Painting",
      image: "/painting1.jpg",
      description:
        "Premium interior and exterior painting services with smooth finishing.",
      includes: ["Interior Painting", "Exterior Painting", "Wall Texture", "Waterproof Coating"],
    },

    "appliance-repair": {
      title: "Appliance Repair",
      image: "/repair.jpg",
      description:
        "Expert repair for AC, fridge, washing machine and all home appliances.",
      includes: ["AC Repair", "Fridge Repair", "Washing Machine Repair", "Microwave Repair"],
    },
  };

  const service = services[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-gray-500">
        Service Not Found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F9FAFB] to-white text-[#111827]">

      <Navbar />

      {/* HERO */}
      <section className="pt-28 pb-16">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

          {/* LEFT */}
          <div>
            <span className="inline-block px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700">
              Verified Service
            </span>

            <h1 className="text-3xl md:text-4xl font-bold mt-2">
              {service.title}
            </h1>

            <p className="text-gray-600 mt-5 leading-relaxed">
              {service.description}
            </p>

            <div className="flex gap-4 mt-7">
              <button
                onClick={() => router.push("/signin")}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg transition"
              >
                Book Now
              </button>
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="relative">
            <div className="absolute -inset-2 bg-emerald-200 blur-3xl opacity-30 rounded-3xl"></div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200">
              <img
                src={service.image}
                className="w-full h-[340px] object-cover"
              />
            </div>
          </div>

        </div>
      </section>

      {/* INCLUDED */}
      <section className="py-14">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-2xl font-semibold text-center mb-10">
            What’s Included
          </h2>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">

            {service.includes.map((item, i) => (
              <div
                key={i}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition"
              >
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-4">
                  ✓
                </div>

                <p className="text-sm font-medium text-gray-800">
                  {item}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* WHY SECTION */}
      <section className="py-16 bg-white border-t">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-2xl font-semibold text-center mb-10">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-4 gap-6">

            {[
              ["Verified Experts", "Background checked professionals"],
              ["Transparent Pricing", "No hidden charges"],
              ["Fast Service", "Quick doorstep response"],
              ["Guaranteed Work", "Quality assured service"],
            ].map(([title, desc], i) => (
              <div
                key={i}
                className="p-6 rounded-2xl border border-gray-100 hover:border-emerald-200 hover:shadow-md transition"
              >
                <h3 className="font-semibold text-emerald-600">
                  {title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  {desc}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

    </div>
  );
}