type BookingCardProps = {
  title: string;
  subtitle?: string;
  status?: string;
  amount?: string | number;
};

export default function BookingCard({ title, subtitle, status, amount }: BookingCardProps) {
  return (
    <div className="soft-card hover-lift rounded-3xl p-5 flex items-start justify-between gap-4">
      <div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        {amount !== undefined && <p className="text-sm font-semibold text-emerald-600 mt-3">?{amount}</p>}
      </div>
      {status && <span className="rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">{status}</span>}
    </div>
  );
}