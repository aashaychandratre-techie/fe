export default function Footer() {
  return (
    <footer className="bg-black text-white">

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* BRAND */}
        <div>
          <h2 className="text-2xl font-bold text-blue-500">
            ServiceSphere
          </h2>
          <p className="text-gray-400 mt-3">
            Trusted platform for home services, repairs and cleaning.
          </p>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-gray-400">Email: support@servicesphere.com</p>
          <p className="text-gray-400">Phone: +91 9876543210</p>
          <p className="text-gray-400">Aurangabad, India</p>
        </div>

        {/* INFO */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Info</h3>
          <p className="text-gray-400">Privacy Policy</p>
          <p className="text-gray-400">Terms & Conditions</p>
        </div>

      </div>

      <div className="border-t border-gray-800 text-center py-4 text-gray-500 text-sm">
        © 2026 ServiceSphere. All rights reserved.
      </div>

    </footer>
  );
}