"use client";

import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ArrowLeft, BadgeCheck, Check, Clock, ShieldCheck, Sparkles, Wallet } from "lucide-react";

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
      description: "Professional plumbing services for homes and offices. Fast leak repair, pipe fitting and maintenance.",
      includes: ["Leak Repair", "Pipe Installation", "Bathroom Fittings", "Water Tank Cleaning"],
    },
    "electrical-work": {
      title: "Electrical Work",
      image: "/electric.jpg",
      description: "Certified electricians for wiring, repair and installations with safety assurance.",
      includes: ["House Wiring", "Switch Repair", "Fan Installation", "MCB Replacement"],
    },
    "car-wash": {
      title: "Car Wash",
      image: "/carwash.jpg",
      description: "Doorstep car cleaning and detailing service with professional equipment.",
      includes: ["Exterior Wash", "Interior Cleaning", "Tyre Polish", "Dashboard Cleaning"],
    },
    painting: {
      title: "Painting",
      image: "/painting1.jpg",
      description: "Premium interior and exterior painting services with smooth finishing.",
      includes: ["Interior Painting", "Exterior Painting", "Wall Texture", "Waterproof Coating"],
    },
    "appliance-repair": {
      title: "Appliance Repair",
      image: "/repair.jpg",
      description: "Expert repair for AC, fridge, washing machine and all home appliances.",
      includes: ["AC Repair", "Fridge Repair", "Washing Machine Repair", "Microwave Repair"],
    },
  };

  const service = services[slug];

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] text-gray-500">
        Service not found
      </div>
    );
  }

  return (
    <div className="min-h-screen page-shell text-[#111827]">
      <Navbar />

      <section className="pt-28 pb-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-emerald-700 mb-6">
              <ArrowLeft size={16} /> Back
            </button>

            <span className="inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-full bg-emerald-100 text-emerald-700 font-medium">
              <BadgeCheck size={14} /> Verified Service
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mt-4 tracking-tight">{service.title}</h1>
            <p className="text-gray-600 mt-5 leading-relaxed max-w-xl">{service.description}</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-7 max-w-xl">
              {[
                [ShieldCheck, "Verified"],
                [Clock, "Quick slots"],
                [Wallet, "Clear price"],
              ].map(([Icon, label]: any) => (
                <div key={label} className="soft-card rounded-2xl p-3 flex items-center gap-2 text-sm text-slate-700">
                  <Icon size={17} className="text-emerald-600" /> {label}
                </div>
              ))}
            </div>

            <button onClick={() => router.push("/signin")} className="mt-8 px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-100">
              Book Now
            </button>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 bg-emerald-100 rounded-[2rem] rotate-2" />
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border border-white bg-white">
              <img src={service.image} alt={service.title} className="w-full h-[300px] sm:h-[420px] object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 text-sm mb-3">
              <Sparkles size={15} /> Included
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">What is included</h2>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {service.includes.map((item) => (
              <div key={item} className="soft-card hover-lift rounded-3xl p-5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-4">
                  <Check size={18} />
                </div>
                <p className="text-sm font-semibold text-gray-800">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}