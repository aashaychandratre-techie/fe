"use client";

import { useState } from "react";

import {
  ArrowLeft,
  Search,
  Moon,
  Sun,
  Bell,
  X,
  CreditCard,
  CheckCircle2,
  XCircle,
  IndianRupee,
  User,
  Briefcase,
  Pencil,
  Save,
} from "lucide-react";

import { useRouter } from "next/navigation";

type Payment = {
  id: string;
  customer: string;
  vendor: string;
  service: string;
  amount: string;
  status: string;
};

export default function AdminPaymentsPage() {

  const router = useRouter();

  const [darkMode, setDarkMode] = useState(true);

  const [search, setSearch] = useState("");

  const [selectedPayment, setSelectedPayment] =
    useState<Payment | null>(null);

  const [editMode, setEditMode] = useState(false);

  const payments: Payment[] = [
    {
      id: "TXN001",
      customer: "Vaishnavi Jadhav",
      vendor: "Rahul Sharma",
      service: "Premium Car Wash",
      amount: "₹1,200",
      status: "Pending",
    },

    {
      id: "TXN002",
      customer: "Aman Verma",
      vendor: "Amit Joshi",
      service: "Electrician",
      amount: "₹2,500",
      status: "Paid",
    },

    {
      id: "TXN003",
      customer: "Sneha Patil",
      vendor: "Rohan Kale",
      service: "Home Cleaning",
      amount: "₹1,800",
      status: "Failed",
    },

    {
      id: "TXN004",
      customer: "Rahul Sharma",
      vendor: "Deepak Kumar",
      service: "Plumbing",
      amount: "₹3,200",
      status: "Pending",
    },
  ];

  const filteredPayments = payments.filter((item) =>
    item.customer.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode
          ? "bg-[#0f172a] text-white"
          : "bg-[#f4f7fb] text-black"
      }`}
    >

      {/* TOPBAR */}
      <div
        className={`sticky top-0 z-40 border-b px-6 py-4 ${
          darkMode
            ? "bg-[#111827] border-white/10"
            : "bg-white border-gray-200"
        }`}
      >

        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-4">

            {/* BACK */}
            <button
              onClick={() => router.back()}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                darkMode
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <ArrowLeft size={20} />
            </button>

            {/* TITLE */}
            <div>

              <h1 className="text-[28px] font-bold">
                Payment Management
              </h1>

              <p
                className={`text-sm mt-1 ${
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }`}
              >
                Manage vendor payments and transactions
              </p>

            </div>

          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* SEARCH */}
            <div
              className={`flex items-center px-4 h-[48px] w-[320px] rounded-xl ${
                darkMode
                  ? "bg-[#1e293b]"
                  : "bg-gray-100"
              }`}
            >

              <Search
                size={18}
                className={
                  darkMode
                    ? "text-gray-400"
                    : "text-gray-500"
                }
              />

              <input
                type="text"
                placeholder="Search payments..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className={`bg-transparent outline-none ml-3 w-full text-sm ${
                  darkMode
                    ? "placeholder-gray-400"
                    : "placeholder-gray-500"
                }`}
              />

            </div>

            {/* THEME */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition ${
                darkMode
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >

              {darkMode ? <Sun size={18} /> : <Moon size={18} />}

            </button>

            {/* NOTIFICATION */}
            <button
              className={`w-11 h-11 rounded-xl flex items-center justify-center relative ${
                darkMode
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >

              <Bell size={18} />

              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500"></div>

            </button>

          </div>

        </div>

      </div>

      {/* LIST */}
      <div className="px-6 py-6 space-y-4">

        {filteredPayments.map((item, index) => (

          <div
            key={index}
            onClick={() => {
              setSelectedPayment(item);
              setEditMode(false);
            }}
            className={`w-full rounded-2xl px-6 py-5 cursor-pointer border transition-all duration-300 ${
              darkMode
                ? "bg-[#111827] border-white/10 hover:bg-[#1e293b]"
                : "bg-white border-gray-200 hover:bg-gray-50"
            }`}
          >

            <div className="flex items-center justify-between">

              {/* LEFT */}
              <div>

                <h2 className="text-[18px] font-semibold">
                  {item.customer}
                </h2>

                <p
                  className={`text-sm mt-1 ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Transaction ID : {item.id}
                </p>

              </div>

              {/* STATUS */}
              <div
                className={`px-4 py-2 rounded-xl text-sm font-semibold ${
                  item.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : item.status === "Paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </div>

            </div>

          </div>

        ))}

      </div>

      {/* MODAL */}
      {selectedPayment && (

        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">

          <div
            className={`w-full max-w-2xl rounded-3xl p-7 relative border ${
              darkMode
                ? "bg-[#111827] border-white/10"
                : "bg-white border-gray-200"
            }`}
          >

            {/* CLOSE */}
            <button
              onClick={() => {
                setSelectedPayment(null);
                setEditMode(false);
              }}
              className={`absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center ${
                darkMode
                  ? "bg-white/10 hover:bg-white/20"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              <X size={18} />
            </button>

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">

              <div>

                <h2 className="text-3xl font-bold">
                  Payment Details
                </h2>

                <p
                  className={`mt-2 ${
                    darkMode
                      ? "text-gray-400"
                      : "text-gray-500"
                  }`}
                >
                  Transaction ID : {selectedPayment.id}
                </p>

              </div>

              {/* EDIT BUTTON */}
              <button
                onClick={() => setEditMode(!editMode)}
                className="h-[46px] px-5 rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-medium flex items-center gap-2"
              >

                {editMode ? <Save size={18} /> : <Pencil size={18} />}

                {editMode ? "Save" : "Edit"}

              </button>

            </div>

            {/* DETAILS */}
            <div className="space-y-4">

              {/* CUSTOMER */}
              <div
                className={`rounded-2xl p-5 ${
                  darkMode
                    ? "bg-[#1e293b]"
                    : "bg-gray-100"
                }`}
              >

                <div className="flex items-center gap-3 mb-2">

                  <User className="text-blue-500" />

                  <span className="font-medium">
                    Customer Name
                  </span>

                </div>

                {editMode ? (

                  <input
                    defaultValue={selectedPayment.customer}
                    className="w-full bg-transparent outline-none text-lg font-semibold"
                  />

                ) : (

                  <h2 className="text-lg font-semibold">
                    {selectedPayment.customer}
                  </h2>

                )}

              </div>

              {/* VENDOR */}
              <div
                className={`rounded-2xl p-5 ${
                  darkMode
                    ? "bg-[#1e293b]"
                    : "bg-gray-100"
                }`}
              >

                <div className="flex items-center gap-3 mb-2">

                  <User className="text-green-500" />

                  <span className="font-medium">
                    Vendor Name
                  </span>

                </div>

                {editMode ? (

                  <input
                    defaultValue={selectedPayment.vendor}
                    className="w-full bg-transparent outline-none text-lg font-semibold"
                  />

                ) : (

                  <h2 className="text-lg font-semibold">
                    {selectedPayment.vendor}
                  </h2>

                )}

              </div>

              {/* SERVICE */}
              <div
                className={`rounded-2xl p-5 ${
                  darkMode
                    ? "bg-[#1e293b]"
                    : "bg-gray-100"
                }`}
              >

                <div className="flex items-center gap-3 mb-2">

                  <Briefcase className="text-purple-500" />

                  <span className="font-medium">
                    Service
                  </span>

                </div>

                {editMode ? (

                  <input
                    defaultValue={selectedPayment.service}
                    className="w-full bg-transparent outline-none text-lg font-semibold"
                  />

                ) : (

                  <h2 className="text-lg font-semibold">
                    {selectedPayment.service}
                  </h2>

                )}

              </div>

              {/* AMOUNT */}
              <div
                className={`rounded-2xl p-5 ${
                  darkMode
                    ? "bg-[#1e293b]"
                    : "bg-gray-100"
                }`}
              >

                <div className="flex items-center gap-3 mb-2">

                  <IndianRupee className="text-green-500" />

                  <span className="font-medium">
                    Amount
                  </span>

                </div>

                {editMode ? (

                  <input
                    defaultValue={selectedPayment.amount}
                    className="w-full bg-transparent outline-none text-lg font-semibold"
                  />

                ) : (

                  <h2 className="text-2xl font-bold text-green-500">
                    {selectedPayment.amount}
                  </h2>

                )}

              </div>

            </div>

            {/* ACTION BUTTONS */}
            <div className="flex gap-3 mt-8">

              <button className="flex-1 h-[52px] rounded-2xl bg-blue-600 hover:bg-blue-700 transition text-white font-semibold flex items-center justify-center gap-2">

                <CreditCard size={18} />

                Release Payment

              </button>

              <button className="flex-1 h-[52px] rounded-2xl bg-green-600 hover:bg-green-700 transition text-white font-semibold flex items-center justify-center gap-2">

                <CheckCircle2 size={18} />

                Mark Paid

              </button>

              <button className="flex-1 h-[52px] rounded-2xl bg-red-600 hover:bg-red-700 transition text-white font-semibold flex items-center justify-center gap-2">

                <XCircle size={18} />

                Failed

              </button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}