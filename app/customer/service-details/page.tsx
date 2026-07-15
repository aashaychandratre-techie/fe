"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import API from "@/services/api";
import {
  Star,
  ShieldCheck,
  Clock3,
  ChevronRight,
  BadgeCheck,
} from "lucide-react";

type AdditionalService = {
  id: string;
  name: string;
  price: number;
};

type Service = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  additionalServices: AdditionalService[];
};

export default function ServiceDetailsPage() {
  const router = useRouter();
  const params = useSearchParams();

  const id = params.get("id");

  const [service, setService] = useState<Service | null>(null);

  const [loading, setLoading] = useState(true);

  const [selectedAdditionalServices, setSelectedAdditionalServices] =
    useState<string[]>([]);

  useEffect(() => {
    if (id) {
      fetchService();
    }
  }, [id]);

  const fetchService = async () => {
    try {
      const res = await API.get("/services");

      const selected = res.data.find(
        (item: Service) => item.id === id
      );

      setService(selected);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">

          <div className="w-14 h-14 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin mx-auto"></div>

          <p className="mt-5 text-gray-500 text-lg">
            Loading service...
          </p>

        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">

        <div className="bg-white p-10 rounded-3xl shadow-md text-center">

          <h2 className="text-3xl font-bold text-gray-900">
            Service Not Found
          </h2>

          <p className="mt-3 text-gray-500">
            The requested service doesn't exist.
          </p>

          <button
            onClick={() => router.back()}
            className="mt-8 bg-emerald-500 hover:bg-emerald-600 text-white px-7 py-3 rounded-xl font-semibold"
          >
            Go Back
          </button>

        </div>

      </div>
    );
  }

  const totalAmount =
    service.price +
    service.additionalServices
      .filter((item) =>
        selectedAdditionalServices.includes(item.id)
      )
      .reduce((sum, item) => sum + item.price, 0);

      const reviews = [
  {
    id: 1,
    customerName: "Rahul Sharma",
    rating: 5,
    review:
      "Excellent service. The technician arrived on time and completed the work professionally.",
    date: "2 days ago",
  },
  {
    id: 2,
    customerName: "Sneha Patil",
    rating: 5,
    review:
      "Very polite and knowledgeable. Highly recommended.",
    date: "5 days ago",
  },
  {
    id: 3,
    customerName: "Amit Verma",
    rating: 4,
    review:
      "Good quality work and affordable pricing.",
    date: "1 week ago",
  },
];
        return (
    <div className="min-h-screen bg-[#F9FAFB] py-8">

      <div className="max-w-6xl mx-auto px-6">

        {/* Breadcrumb */}

        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">

          <button
            onClick={() => router.back()}
            className="hover:text-emerald-600 font-medium"
          >
            Services
          </button>

          <ChevronRight size={16} />

          <span className="text-gray-900 font-semibold">
            {service.name}
          </span>

        </div>

        {/* Main Card */}

       <div className="bg-white rounded-3xl overflow-hidden">

         <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8">

            {/* LEFT SIDE */}

<div>

  {/* IMAGE */}

  <div className="relative h-[230px] lg:h-[300px] rounded-2xl overflow-hidden">

    {service.imageUrl ? (
      <img
  src={`http://localhost:8080${service.imageUrl}`}
  alt={service.name}
  className="w-full h-full object-cover"
/>
    ) : (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 to-emerald-100">
        <span className="text-[170px] font-black text-emerald-200">
          {service.name.charAt(0)}
        </span>
      </div>
    )}

  </div>

  {/* REVIEWS */}

  <div className="mt-6 bg-white rounded-3xl p-6">

    <div className="flex items-center justify-between mb-5">

      <h2 className="text-xl font-semibold text-gray-900">
        Customer Reviews
      </h2>

      <span className="text-sm text-gray-500">
        {reviews.length} Reviews
      </span>

    </div>

    <div className="space-y-5">

      {reviews.map((review) => (

        <div
          key={review.id}
          className="py-4 last:pb-0"
        >

          <div className="flex items-center justify-between">

            <div>

              <h3 className="text-base font-semibold text-gray-900">
                {review.customerName}
              </h3>

              <p className="text-xs text-gray-400">
                {review.date}
              </p>

            </div>

            <div className="flex items-center gap-1">

              {Array.from({ length: review.rating }).map((_, i) => (

                <Star
                  key={i}
                  size={14}
                  className="fill-yellow-400 text-yellow-400"
                />

              ))}

            </div>

          </div>

          <p className="text-sm text-gray-600 leading-6">
            {review.review}
          </p>

        </div>

      ))}

    </div>

  </div>

</div>

            {/* RIGHT DETAILS */}

            <div className="p-6 flex flex-col">

              <div className="flex items-center justify-between">

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {service.name}
                </h1>

                <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full">

                  <Star
                    size={16}
                    className="fill-yellow-400 text-yellow-400"
                  />

                  <span className="font-semibold text-sm">
                    4.8
                  </span>

                </div>

              </div>

              <p className="text-gray-600 mt-5 text-sm leading-6">
                {service.description}
              </p>

        
              {/* Base Price */}

              <div className="mt-10 rounded-2xl p-4 bg-[#F9FAFB]">

                <p className="text-sm text-gray-500">
                  Starting Price
                </p>

                <h2 className="text-2xl font-bold text-emerald-600 mt-2">
                  ₹{service.price}
                </h2>

              </div>
                            {/* Additional Services */}

              <div className="mt-10">

                <h2 className="text-lg font-bold text-gray-900 mb-2">
                  Additional Services
                </h2>

                <p className="text-gray-500 mb-6">
                  Select the services you want to add to your booking.
                </p>

                {service.additionalServices.length > 0 ? (

                  <div className="space-y-4">

                    {service.additionalServices.map((item) => {

                      const checked = selectedAdditionalServices.includes(item.id);

                      return (

                        <label
                          key={item.id}
                          className={`flex items-center justify-between rounded-2xl border p-3 cursor-pointer transition-all duration-300 ${
                            checked
                              ? "border-emerald-500 bg-emerald-50"
                              : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50"
                          }`}
                        >

                          <div className="flex items-center gap-4">

                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={(e) => {

                                if (e.target.checked) {

                                  setSelectedAdditionalServices([
                                    ...selectedAdditionalServices,
                                    item.id,
                                  ]);

                                } else {

                                  setSelectedAdditionalServices(
                                    selectedAdditionalServices.filter(
                                      (x) => x !== item.id
                                    )
                                  );

                                }

                              }}
                              className="w-5 h-5 accent-emerald-500"
                            />

                            <div>

                              <h3 className="font-semibold text-gray-900">
                                {item.name}
                              </h3>

                              <p className="text-sm text-gray-500">
                                Professional add-on service
                              </p>

                            </div>

                          </div>

                          <div className="text-right">

                            <p className="text-base font-bold text-emerald-600">
                              + ₹{item.price}
                            </p>

                          </div>

                        </label>

                      );

                    })}

                  </div>

                ) : (

                  <div className="border border-dashed rounded-2xl p-8 text-center text-gray-500">

                    No additional services available.

                  </div>

                )}

              </div>
                            {/* Price Summary */}

              <div className="mt-10 rounded-3xl border border-emerald-100 bg-[#F9FAFB] p-5">

                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Booking Summary
                </h2>

                {/* Base Price */}

                <div className="flex items-center justify-between py-3 border-b">

                  <span className="text-gray-600">
                    Base Service
                  </span>

                  <span className="font-semibold text-gray-900">
                    ₹{service.price}
                  </span>

                </div>

                {/* Selected Additional Services */}

                {service.additionalServices
                  .filter((item) =>
                    selectedAdditionalServices.includes(item.id)
                  )
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between py-3 border-b"
                    >
                      <span className="text-gray-600">
                        {item.name}
                      </span>

                      <span className="font-semibold text-gray-900">
                        ₹{item.price}
                      </span>
                    </div>
                  ))}

                {/* Total */}

                <div className="flex items-center justify-between pt-6">

                  <div>

                    <p className="text-gray-500 text-sm">
                      Total Amount
                    </p>

                    <h2 className="text-2xl font-bold text-emerald-600">
                      ₹{totalAmount}
                    </h2>

                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/customer/booking?serviceId=${service.id}&amount=${totalAmount}&additionalServices=${selectedAdditionalServices.join(",")}`
                      )
                    }
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl font-bold text-base shadow-lg hover:shadow-xl transition"
                  >
                    Continue Booking
                  </button>

                </div>

              </div>
                          </div>
          </div>
        </div>
      </div>
    </div>

  );
}