type ServiceCardProps = {
  name: string;
  description?: string;
  price?: string | number;
  imageUrl?: string;
};

export default function ServiceCard({ name, description, price, imageUrl }: ServiceCardProps) {
  return (
    <div className="soft-card hover-lift rounded-3xl p-4 overflow-hidden">
      {imageUrl && <img src={imageUrl} alt={name} className="h-36 w-full object-cover rounded-2xl mb-4" />}
      <h3 className="font-semibold text-slate-900">{name}</h3>
      {description && <p className="text-sm text-slate-500 mt-2 line-clamp-2">{description}</p>}
      {price !== undefined && <p className="text-lg font-bold text-emerald-600 mt-4">?{price}</p>}
    </div>
  );
}