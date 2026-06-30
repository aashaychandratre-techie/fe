"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, CreditCard, ReceiptText, ShieldCheck, WalletCards, type LucideIcon } from "lucide-react";

export default function CustomerPaymentsPage() {
  const router = useRouter();

  return (
    <main className="page-shell p-4 sm:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-700 mb-5">
          <ArrowLeft size={16} /> Back
        </button>

        <section className="soft-card rounded-3xl p-5 sm:p-7 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
            <div>
              <p className="text-sm font-semibold text-emerald-600">Customer payments</p>
              <h1 className="text-3xl font-bold text-slate-900 mt-1">Payments and Receipts</h1>
              <p className="text-slate-500 mt-2 max-w-2xl">
                Keep payment information organized for completed bookings. Your booking history remains the source for payment amounts.
              </p>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-100">
              <WalletCards size={26} />
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {(
            [
              [CreditCard, "Secure Payments", "Payment records are connected with your service bookings."],
              [ReceiptText, "Receipts", "Use bookings to review service amount, date, and status."],
              [ShieldCheck, "Protected", "Support can help with failed or disputed payments."],
            ] as [LucideIcon, string, string][]
          ).map(([Icon, title, desc]) => (
            <div key={title} className="soft-card hover-lift rounded-3xl p-5">
              <div className="h-11 w-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                <Icon size={21} />
              </div>
              <h2 className="font-semibold text-slate-900">{title}</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}