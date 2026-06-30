export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white">
      <div className="max-w-6xl mx-auto px-6 md:px-10 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            <span className="text-white">Service</span>
            <span className="text-emerald-400">Sphere</span>
          </h2>
          <p className="text-slate-400 mt-3 max-w-sm leading-relaxed">
            Trusted professionals for home services, repairs, cleaning, and everyday support.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300 mb-3">Contact</h3>
          <div className="space-y-2 text-slate-400">
            <p>Email: support@servicesphere.com</p>
            <p>Phone: +91 9876543210</p>
            <p>Aurangabad, India</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-emerald-300 mb-3">Info</h3>
          <div className="space-y-2 text-slate-400">
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 text-center py-4 text-slate-500 text-sm">
        (c) 2026 ServiceSphere. All rights reserved.
      </div>
    </footer>
  );
}