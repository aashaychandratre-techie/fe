"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";

type Service = {
  id: number;
  vendorId?: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
};

export default function ActivePage() {
  const [open, setOpen] = useState(false);

  const [activeTab, setActiveTab] =
    useState<"available" | "my">("available");

  const [availableServices, setAvailableServices] = useState<Service[]>([]);
  const [myServices, setMyServices] = useState<Service[]>([]);

  const fetchServices = async () => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) return;

      const res = await axios.get("http://localhost:8080/api/services");
      const allServices = res.data;

      const available = allServices.filter(
        (s: Service) => !s.vendorId || s.vendorId !== vendorId
      );

      const mine = allServices.filter(
        (s: Service) => s.vendorId === vendorId
      );

      setAvailableServices(available);
      setMyServices(mine);
    } catch (err) {
      console.log("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSelectService = async (service: Service) => {
    try {
      const vendorId = localStorage.getItem("vendorId");
      if (!vendorId) return alert("Vendor not logged in");

      await axios.post(
        "http://localhost:8080/api/services/assign",
        null,
        {
          params: {
            serviceId: service.id,
            vendorId,
          },
        }
      );

      alert("Service selected successfully 💚");
      fetchServices();
      setActiveTab("my");
    } catch (err) {
      console.log(err);
      alert("Service assign failed");
    }
  };

  const handleCancelService = async (service: Service) => {
    try {
      await axios.put(
        `http://localhost:8080/api/services/${service.id}`,
        {
          ...service,
          vendorId: null,
        }
      );

      alert("Service removed");
      fetchServices();
      setActiveTab("available");
    } catch (err) {
      console.log(err);
      alert("Cancel failed");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50/50 dark:bg-[#0B1120] font-sans overflow-hidden">
      {/* SIDEBAR */}
      <VendorSidebar open={open} setOpen={setOpen} />

      {/* MAIN */}
      <div className="flex-1 flex flex-col relative min-h-0 min-w-0 overflow-hidden">
        {/* Background blobs for premium feel */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-300/10 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

        {/* NAVBAR */}
        <div className="md:hidden">
        <VendorNavbar setOpen={setOpen} />
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto relative z-10">
          <div className="max-w-7xl mx-auto p-4 md:p-8 lg:p-10 space-y-8">
            {/* HEADER */}
            <div>
              <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
                Services Management
              </h1>
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400/60">
                Choose and manage your active service offerings.
              </p>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-2 bg-white/60 dark:bg-[#111827]/60 p-1.5 rounded-full backdrop-blur-md border border-gray-200 dark:border-gray-700/60 shadow-sm w-full sm:w-max overflow-x-auto">
              {["available", "my"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
                    activeTab === tab
                      ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 hover:text-gray-900 dark:text-white"
                  }`}
                >
                  {tab === "available" ? "Available Services" : "My Services"}
                </button>
              ))}
            </div>

            {/* AVAILABLE */}
            {activeTab === "available" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {availableServices.length === 0 ? (
                  <div className="col-span-full text-center py-16 bg-white/50 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed">
                    <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium text-lg">No services available right now.</p>
                  </div>
                ) : (
                  availableServices.map((service) => (
                    <div
                      key={service.id}
                      className="bg-white dark:bg-[#111827] rounded-3xl border border-gray-100 dark:border-gray-800 p-5 shadow-sm hover:shadow-md hover:border-emerald-100 dark:border-emerald-900/30 transition-all duration-300 flex flex-col group"
                    >
                      {service.imageUrl ? (
                        <div className="w-full h-40 rounded-2xl overflow-hidden mb-5">
                          <img
                            src={`http://localhost:8080${service.imageUrl}`}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            alt={service.name}
                          />
                        </div>
                      ) : (
                        <div className="w-full h-40 bg-gray-50 dark:bg-[#1f2937] rounded-2xl mb-5 flex items-center justify-center text-gray-300">
                          <span className="text-4xl">🛠</span>
                        </div>
                      )}

                      <h2 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                        {service.name}
                      </h2>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 flex-1 line-clamp-2">
                        {service.description}
                      </p>

                      <div className="mt-5 pt-5 border-t border-gray-50 flex flex-wrap items-center justify-between gap-3">
                        <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                          ₹{service.price}
                        </span>
                        <button
                          onClick={() => handleSelectService(service)}
                          className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500 hover:text-white font-bold py-2.5 px-5 rounded-2xl text-sm transition-all shadow-sm hover:shadow-md"
                        >
                          Select Service
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* MY SERVICES */}
            {activeTab === "my" && (
              <div className="bg-white dark:bg-[#111827] rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left whitespace-nowrap">
                    <thead className="bg-gray-50/80 dark:bg-gray-800/50 text-gray-500 dark:text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold text-xs border-b border-gray-100 dark:border-gray-800">
                      <tr>
                        <th className="px-6 py-4">Image</th>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Description</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                      {myServices.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-gray-500 dark:text-gray-400 dark:text-gray-500 font-medium">
                            You haven't selected any services yet.
                          </td>
                        </tr>
                      ) : (
                        myServices.map((service) => (
                          <tr key={service.id} className="hover:bg-emerald-50/30 transition-colors">
                            <td className="px-6 py-4">
                              {service.imageUrl ? (
                                <img
                                  src={`http://localhost:8080${service.imageUrl}`}
                                  alt={service.name}
                                  className="w-14 h-14 rounded-2xl object-cover shadow-sm border border-gray-100 dark:border-gray-800"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-[#1f2937] flex items-center justify-center text-gray-400 dark:text-gray-500 border border-gray-100 dark:border-gray-800">
                                  —
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                              {service.name}
                            </td>
                            <td className="px-6 py-4 font-medium text-gray-500 dark:text-gray-400 dark:text-gray-500 max-w-sm line-clamp-2">
                              {service.description}
                            </td>
                            <td className="px-6 py-4 font-extrabold text-emerald-600 dark:text-emerald-400 text-lg">
                              ₹{service.price}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleCancelService(service)}
                                className="bg-red-50 dark:bg-red-900/20 hover:bg-red-100 text-red-600 dark:text-red-400 font-bold px-5 py-2.5 rounded-2xl text-sm transition-all"
                              >
                                Cancel
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}