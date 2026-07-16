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
      <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl overflow-hidden">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-2 hover:bg-white/20 transition"
        >
          <X className="h-5 w-5 text-white" />
        </button>

        {/* Header */}
        <div className="bg-emerald-600 text-white p-6 text-center">
          <h2 className="text-2xl font-bold">
            Payment QR
          </h2>

          <p className="text-sm mt-1 text-emerald-100">
            Ask customer to scan this QR
          </p>
        </div>

        <div className="p-6">

          {/* Booking Details */}
          <div className="space-y-3 border rounded-2xl p-4">

            <div className="flex justify-between">
              <span className="text-gray-500">
                Booking ID
              </span>

              <span className="font-semibold">
                {booking.id}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-500">
                Service
              </span>

              <span className="font-semibold">
                {booking.service?.name ||
                  booking.serviceName ||
                  "Service"}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                Amount
              </span>

              <span className="flex items-center gap-1 text-emerald-600 font-bold text-xl">
                <IndianRupee size={18} />
                {booking.amount}
              </span>
            </div>

          </div>

          {/* Timer */}
          <div className="text-center mt-6">

            <p className="text-red-600 font-semibold">
              QR Expires In
            </p>

            <h2 className="text-4xl font-bold mt-2">
              {String(minutes).padStart(2, "0")}:
              {String(seconds).padStart(2, "0")}
            </h2>

          </div>
          {/* QR */}
<div className="flex justify-center mt-6">
  {timeLeft > 0 ? (
    <img
      src={qrImageUrl}
      alt="Payment QR"
      className="w-64 h-64 rounded-2xl border shadow"
    />
  ) : (
    <div className="w-64 h-64 rounded-2xl border-2 border-red-300 bg-red-50 flex flex-col items-center justify-center p-4">

      <h2 className="text-red-600 font-bold text-xl">
        QR Expired
      </h2>

      <p className="text-gray-500 text-sm mt-2 text-center">
        Your payment QR has expired.
      </p>

      <button
        onClick={() => {
          setQrVersion((prev) => prev + 1);
          setTimeLeft(120);
        }}
        className="mt-5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-semibold transition"
      >
        Generate New QR
      </button>

    </div>
  )}
</div>

          {/* Payment Status */}
          <div className="mt-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-4 text-center">

            <p className="font-semibold text-yellow-700">
              {timeLeft > 0
                ? "Payment Pending"
                : "QR Expired"}
            </p>

            <p className="text-sm text-gray-600 mt-2">
              Customer can pay using
              <br />
              <span className="font-semibold">
                PhonePe / Google Pay / Paytm / BHIM / Any UPI App
              </span>
            </p>

          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="w-full mt-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl py-3 font-semibold flex items-center justify-center gap-2 transition"
          >
            <CheckCircle2 size={18} />
            Close
          </button>

        </div>
      </div>
    </div>
  );
}