"use client";

import { useEffect, useState } from "react";
import { X, IndianRupee, CheckCircle2 } from "lucide-react";

interface Props {
  open: boolean;
  booking: any;
  onClose: () => void;
}

export default function PaymentQrModal({
  open,
  booking,
  onClose,
}: Props) {
  const [timeLeft, setTimeLeft] = useState(120);
  const [qrVersion, setQrVersion] = useState(1);

  useEffect(() => {
    if (!open) return;

    setTimeLeft(120);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [open, qrVersion]);

  if (!open || !booking) return null;

  // Demo UPI URL
  const upiPaymentUrl = `upi://pay?pa=merchant@upi&pn=ServiceSphere&am=${booking.amount}&cu=INR&tn=Booking-${booking.id}-QR${qrVersion}`;

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(
    upiPaymentUrl
  )}`;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Close Button (Absolute) */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 rounded-full p-1.5 bg-black/10 hover:bg-black/20 text-white transition z-10 backdrop-blur-md"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 text-white pt-5 pb-4 px-5 text-center shrink-0">
          <h2 className="text-lg font-bold tracking-tight">
            Accept Payment
          </h2>
          <p className="text-xs font-medium text-emerald-100 mt-0.5">
            Ask the customer to scan this code
          </p>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto custom-scrollbar flex-1">
          
          {/* Booking Summary */}
          <div className="bg-gray-50/80 border border-gray-100 rounded-2xl p-3 mb-5 space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Booking ID</span>
              <span className="font-bold text-gray-800">{booking.id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-medium">Service</span>
              <span className="font-bold text-gray-800 truncate max-w-[150px] text-right">
                {booking.service?.name || booking.serviceName || "Service"}
              </span>
            </div>
            <div className="pt-2 mt-1 border-t border-gray-200/60 flex justify-between items-center">
              <span className="text-gray-600 font-bold">Total Amount</span>
              <span className="flex items-center text-emerald-600 font-extrabold text-lg">
                <IndianRupee size={16} strokeWidth={3} className="mr-0.5" />
                {booking.amount}
              </span>
            </div>
          </div>

          {/* QR Code Container */}
          <div className="flex flex-col items-center justify-center">
            {timeLeft > 0 ? (
              <div className="relative p-2 bg-white rounded-3xl border-2 border-emerald-100 shadow-sm ring-4 ring-emerald-50/50">
                <img
                  src={qrImageUrl}
                  alt="Payment QR"
                  className="w-44 h-44 rounded-xl"
                />
              </div>
            ) : (
              <div className="w-48 h-48 rounded-3xl border-2 border-red-200 bg-red-50/50 flex flex-col items-center justify-center p-4">
                <h2 className="text-red-600 font-bold">QR Expired</h2>
                <p className="text-gray-500 text-xs mt-1 text-center font-medium">
                  Please generate a new code.
                </p>
                <button
                  onClick={() => {
                    setQrVersion((prev) => prev + 1);
                    setTimeLeft(120);
                  }}
                  className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 text-sm rounded-xl font-bold transition shadow-sm hover:shadow"
                >
                  Regenerate
                </button>
              </div>
            )}

            {/* Timer */}
            {timeLeft > 0 && (
              <div className="mt-4 bg-red-50/80 text-red-600 px-4 py-1.5 rounded-full text-xs font-bold border border-red-100 flex items-center gap-1.5 shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Expires in {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
              </div>
            )}
          </div>

          {/* Supported Apps */}
          <div className="mt-5 text-center bg-emerald-50/50 border border-emerald-100 rounded-2xl p-3">
            <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5">
              Supported Apps
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              PhonePe • GPay • Paytm • BHIM
            </p>
          </div>

          {/* Actions */}
          <button
            onClick={onClose}
            className="w-full mt-4 bg-gray-900 hover:bg-black text-white rounded-2xl py-3 text-sm font-bold flex items-center justify-center gap-2 transition shadow-md shadow-gray-900/20"
          >
            <CheckCircle2 size={18} />
            Done
          </button>
        </div>

      </div>
    </div>
  );
}