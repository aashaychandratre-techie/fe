type DashboardCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  accent?: string;
};

export default function DashboardCard({ title, value, subtitle, accent = "text-emerald-600" }: DashboardCardProps) {
  return (
    <div className="soft-card hover-lift rounded-3xl p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <h2 className={`text-3xl font-bold mt-2 ${accent}`}>{value}</h2>
      {subtitle && <p className="text-xs text-slate-400 mt-2">{subtitle}</p>}
    </div>
  );
}