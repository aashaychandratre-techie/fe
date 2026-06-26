"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";

import VendorSidebar from "@/components/VendorSidebar";
import VendorNavbar from "@/components/VendorNavbar";

import { Mail, Phone, MapPin, Briefcase, Camera } from "lucide-react";

export default function ProfilePage() {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  const [vendorId, setVendorId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);

  const getImageUrl = (img?: string) => {
    if (!img) return null;
    if (img.startsWith("http")) return img;
    return `http://localhost:8080/uploads/${img}`;
  };

  const fetchVendor = async (id: string) => {
    const res = await axios.get(
      `http://localhost:8080/auth/vendor/${id}`
    );

    const v = res.data;

    setName(v.name || "");
    setEmail(v.email || "");
    setPhone(v.phone || "");
    setLocation(v.address || "");
    setExperience(v.availableTime || "");
    setImage(getImageUrl(v.profileImage));
  };

  useEffect(() => {
    const id = localStorage.getItem("vendorId");
    if (!id) return;

    setVendorId(id);
    fetchVendor(id);
  }, []);

  const handleSave = async () => {
    if (!vendorId) return;

    await axios.put(
      `http://localhost:8080/auth/vendor/update/${vendorId}`,
      {
        name,
        email,
        phone,
        address: location,
        availableTime: experience,
      }
    );

    setEditing(false);
    fetchVendor(vendorId);
  };

  const handleImage = async (e: any) => {
    const file = e.target.files?.[0];
    if (!file || !vendorId) return;

    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    await axios.post(
      `http://localhost:8080/auth/vendor/upload-image/${vendorId}`,
      formData
    );

    fetchVendor(vendorId);
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#0b1220]">

      <VendorSidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col">

        <VendorNavbar setOpen={setOpen} />

        <main className="p-6 overflow-y-auto">

          {/* HEADER */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Profile
            </h1>
            <p className="text-gray-500 text-sm">
              Manage your ServiceSphere vendor profile
            </p>
          </div>

          {/* CARD */}
          <div className="bg-white dark:bg-[#1e293b] rounded-2xl shadow p-6">

            {/* TOP */}
            <div className="flex items-center gap-6">

              {/* AVATAR */}
              <div className="relative w-24 h-24">

                <div className="w-24 h-24 rounded-full bg-emerald-500 flex items-center justify-center text-white text-2xl overflow-hidden">
                  {image ? (
                    <img
                      src={image}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    name?.charAt(0) || "V"
                  )}
                </div>

                <button
                  onClick={() => fileRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow"
                >
                  <Camera size={14} />
                </button>

                <input
                  ref={fileRef}
                  type="file"
                  hidden
                  onChange={handleImage}
                />
              </div>

              {/* NAME */}
              <div className="flex-1">
                {editing ? (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2 border rounded-lg dark:bg-[#0b1220] dark:text-white"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {name}
                  </h2>
                )}

                <p className="text-emerald-500 text-sm font-medium">
                  ServiceSphere Vendor
                </p>
              </div>

            </div>

            {/* INFO */}
            <div className="grid md:grid-cols-2 gap-4 mt-6">

              <Info icon={<Mail />} value={email} />
              <Editable icon={<Phone />} value={phone} setValue={setPhone} editing={editing} />
              <Editable icon={<MapPin />} value={location} setValue={setLocation} editing={editing} />
              <Editable icon={<Briefcase />} value={experience} setValue={setExperience} editing={editing} />

            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-6">

              <button
                onClick={() => setEditing(!editing)}
                className="px-4 py-2 rounded-lg bg-emerald-500 text-white"
              >
                {editing ? "Cancel" : "Edit"}
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white"
              >
                Save
              </button>

            </div>

          </div>

        </main>

      </div>
    </div>
  );
}

/* SMALL COMPONENTS */
function Info({ icon, value }: any) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-[#0b1220] rounded-xl flex items-center gap-3">
      {icon}
      <p className="text-gray-700 dark:text-white text-sm">{value}</p>
    </div>
  );
}

function Editable({ icon, value, setValue, editing }: any) {
  return (
    <div className="p-4 bg-gray-50 dark:bg-[#0b1220] rounded-xl flex items-center gap-3">
      {icon}

      {editing ? (
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="w-full bg-transparent outline-none text-sm text-white"
        />
      ) : (
        <p className="text-gray-700 dark:text-white text-sm">{value}</p>
      )}
    </div>
  );
}