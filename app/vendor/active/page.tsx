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
    <div className="flex h-screen bg-gray-50 overflow-hidden">

      <VendorSidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">

        <VendorNavbar setOpen={setOpen} />

        <div className="p-6 overflow-y-auto max-w-7xl mx-auto w-full">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">
              Services Management
            </h1>
            <p className="text-sm text-gray-500">
              Choose and manage your services
            </p>
          </div>

          {/* TABS */}
          <div className="flex gap-3 mb-8">

            <button
              onClick={() => setActiveTab("available")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition border ${
                activeTab === "available"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
              }`}
            >
              Available Services
            </button>

            <button
              onClick={() => setActiveTab("my")}
              className={`px-5 py-2 rounded-full text-sm font-medium transition border ${
                activeTab === "my"
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300"
              }`}
            >
              My Services
            </button>

          </div>

          {/* AVAILABLE */}
          {activeTab === "available" && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {availableServices.length === 0 ? (
                <p className="text-gray-500">
                  No services available
                </p>
              ) : (
                availableServices.map((service) => (
                  <div
                    key={service.id}
                    className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-md transition"
                  >

                    {service.imageUrl && (
                      <img
                        src={`http://localhost:8080${service.imageUrl}`}
                        className="w-full h-36 object-cover rounded-xl mb-4"
                      />
                    )}

                    <h2 className="text-lg font-semibold text-gray-900">
                      {service.name}
                    </h2>

                    <p className="text-sm text-gray-500 mt-2">
                      {service.description}
                    </p>

                    <p className="text-emerald-600 font-semibold mt-3">
                      ₹{service.price}
                    </p>

                    <button
                      onClick={() => handleSelectService(service)}
                      className="mt-4 w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm"
                    >
                      Select Service
                    </button>

                  </div>
                ))
              )}

            </div>
          )}

          {/* MY SERVICES */}
{activeTab === "my" && (
  <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">

    <table className="w-full">
      <thead className="bg-gray-50 border-b">
        <tr className="text-left text-sm font-semibold text-gray-600">
          <th className="px-6 py-4">Image</th>
          <th className="px-6 py-4">Service</th>
          <th className="px-6 py-4">Description</th>
          <th className="px-6 py-4">Price</th>
          <th className="px-6 py-4 text-center">Action</th>
        </tr>
      </thead>

      <tbody>
        {myServices.length === 0 ? (
          <tr>
            <td
              colSpan={5}
              className="text-center py-10 text-gray-500"
            >
              No selected services
            </td>
          </tr>
        ) : (
          myServices.map((service) => (
            <tr
              key={service.id}
              className="border-b last:border-b-0 hover:bg-gray-50 transition"
            >
              <td className="px-6 py-4">
                {service.imageUrl ? (
                  <img
                    src={`http://localhost:8080${service.imageUrl}`}
                    alt={service.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    —
                  </div>
                )}
              </td>

              <td className="px-6 py-4 font-semibold text-gray-800">
                {service.name}
              </td>

              <td className="px-6 py-4 text-gray-500 max-w-sm">
                {service.description}
              </td>

              <td className="px-6 py-4 font-semibold text-emerald-600">
                ₹{service.price}
              </td>

              <td className="px-6 py-4 text-center">
                <button
                  onClick={() => handleCancelService(service)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Cancel Service
                </button>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>

  </div>
)}

        </div>
      </div>
    </div>
  );
}