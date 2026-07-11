"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { BadgeCheck, Brush, Car, Droplets, Plug, ShieldCheck, Sparkles, Star, Wrench, Zap, type LucideIcon } from "lucide-react";

const services = [
  { title: "Plumbing", desc: "Leak fixing and pipe repairs", icon: Droplets, img: "/plumbing.jpg" },
  { title: "Electrical Work", desc: "Wiring, repairs and fittings", icon: Plug, img: "/electric.jpg" },
  { title: "Car Wash", desc: "Doorstep car cleaning service", icon: Car, img: "/carwash.jpg" },
  { title: "Appliance Repair", desc: "AC, fridge and washing machine repair", icon: Wrench, img: "/repair.jpg" },
  { title: "Painting", desc: "Home and wall painting services", icon: Brush, img: "/painting1.jpg" },
];

export default function HomePage() {
  const router = useRouter();

  const handleBookService = () => {
  const user = localStorage.getItem("user");
  const vendor = localStorage.getItem("vendor");

  if (user) {
    router.push("/customer/dashboard");
  } else {
    router.push("/signup");
  }
};

const handleBecomeProvider = () => {
  const vendor = localStorage.getItem("vendor");

  if (vendor) {
    router.push("/vendor/dashboard");
  } else {
    router.push("/signup");
  }
};

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] overflow-x-hidden">
      <Navbar />

      <section className="relative pt-28 sm:pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-white" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.08fr_0.92fr] gap-10 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-white border border-emerald-100 px-4 py-2 text-sm text-emerald-700 shadow-sm mb-6">
              <Sparkles size={16} />
              Trusted doorstep services
            </div>

       <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight tracking-tight max-w-3xl mx-auto lg:mx-0">
  Book reliable home services without the <br />
  back-and-forth.
</h1>

            <p className="mt-6 text-gray-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Verified professionals for plumbing, electrical work, repairs, painting and more, all organized in one simple platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <button onClick={handleBookService} className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-lg shadow-emerald-100 cursor-pointer">
                Book a Service
              </button>
              <button onClick={handleBecomeProvider} className="px-6 py-3 rounded-2xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 font-semibold bg-white cursor-pointer">
                Become Provider
              </button>
            </div>

           <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto lg:mx-0">
              {[
                ["10K+", "Customers"],
                ["4.8/5", "Rating"],
                ["15K+", "Jobs done"],
              ].map(([value, label]) => (
                <div key={label} className="soft-card rounded-2xl p-4 text-center">
                  <p className="text-xl font-bold text-emerald-600">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[360px]">
            <div className="absolute inset-0 rounded-[2rem] bg-emerald-100 rotate-2" />
            <div className="relative rounded-[2rem] overflow-hidden border border-white shadow-2xl bg-white h-[360px] sm:h-[430px]">
              <img
  src="/team-service.png"
  alt="Verified Service Providers"
  className="h-full w-full object-cover"
/>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-950/10 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 glass-panel rounded-2xl p-4">
                <div className="flex items-center gap-3 text-left">
                  <div className="h-11 w-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <BadgeCheck size={22} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 truncate">Verified providers</p>
                    <p className="text-sm text-slate-500 leading-snug">Fast booking, clear pricing, quality support.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Popular Services</h2>
              <p className="text-gray-500 mt-2">Quick access to the services customers book most.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <button
                  key={service.title}
                  onClick={() => router.push(`/services/${service.title.toLowerCase().replace(/\s+/g, "-")}`)}
                  className="relative h-56 rounded-3xl overflow-hidden text-left group shadow-md hover:shadow-xl transition hover-lift"
                >
                  <img src={service.img} alt={service.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/25 to-transparent" />
                  <div className="relative h-full flex flex-col justify-end p-5 text-white">
                    <div className="w-11 h-11 rounded-2xl bg-white/15 backdrop-blur flex items-center justify-center mb-3">
                      <Icon size={22} />
                    </div>
                    <h3 className="text-lg font-semibold">{service.title}</h3>
                    <p className="text-sm text-gray-200">{service.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 bg-white border-y border-emerald-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(
              [
                [ShieldCheck, "Trusted and Verified", "Professionals are checked before they serve customers."],
                [Zap, "Fast Service", "Book quickly and keep track of your request in one place."],
                [Star, "Quality First", "Ratings and support help keep every service accountable."],
              ] as [LucideIcon, string, string][]
            ).map(([Icon, title, desc]) => (
              <div key={title} className="soft-card hover-lift rounded-3xl p-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                  <Icon size={22} />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}