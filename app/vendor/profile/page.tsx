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
  if (img.startsWith("/uploads/")) return `http://localhost:8080${img}`;
  return `http://localhost:8080/uploads/profile/${img}`;
};

  const fetchVendor = async (id: string) => {
    const res = await axios.get(
      `http://localhost:8080/auth/vendor/${id}`
    );

    const v = res.data;

    // Update local storage so navbar can sync immediately
    localStorage.setItem("vendor", JSON.stringify(v));
    window.dispatchEvent(new Event("storage"));

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

    // Show temporary preview
    setImage(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        `http://localhost:8080/auth/vendor/upload-image/${vendorId}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" }
        }
      );
      
      // Update with the actual saved image URL from backend response
      if (res.data && res.data.profileImage) {
        setImage(getImageUrl(res.data.profileImage));
        
        // Update local storage so navbar syncs
        const currentVendorStr = localStorage.getItem("vendor");
        if (currentVendorStr) {
           const currentVendor = JSON.parse(currentVendorStr);
           currentVendor.profileImage = res.data.profileImage;
           localStorage.setItem("vendor", JSON.stringify(currentVendor));
           window.dispatchEvent(new Event("storage"));
        }
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Failed to upload image. Please check backend connection.");
    }
  };

  return (
    <div className={`h-screen flex font-sans overflow-hidden bg-slate-50/50 dark:bg-[#0B1120]`}>
      <VendorSidebar open={open} setOpen={setOpen} />

      <div className="flex-1 flex flex-col min-h-0 min-w-0 relative overflow-hidden">
        {/* Premium Blur Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

       <div className="md:hidden">
               <VendorNavbar setOpen={setOpen} />
               </div>

        <main className="flex-1 overflow-y-auto p-5 lg:p-8 relative z-10">
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* HEADER */}
            <div className="mb-8">
              <h1 className="text-3xl font-extrabold text-emerald-900 dark:text-emerald-400 tracking-tight">
                Vendor Profile
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Manage your professional identity on ServiceSphere
              </p>
            </div>

            {/* CARD */}
            <div className="bg-white/80 dark:bg-[#111827]/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-emerald-50 dark:border-gray-800 p-6 md:p-10 relative overflow-hidden">
              {/* Subtle top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>

              {/* TOP PROFILE SECTION */}
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-10">
                
                {/* AVATAR UPLOADER */}
                <div className="relative group shrink-0">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-4xl font-black shadow-inner border-4 border-white dark:border-[#111827] overflow-hidden transition-transform duration-300 group-hover:scale-105">
                    {image ? (
                      <img
                        src={image}
                        className="w-full h-full object-cover"
                        alt="Profile"
                      />
                    ) : (
                      name?.charAt(0) || "V"
                    )}
                  </div>

                  <button
                    onClick={() => fileRef.current?.click()}
                    className="absolute bottom-2 right-2 bg-emerald-600 text-white p-2.5 rounded-full shadow-lg border-2 border-white dark:border-[#111827] hover:bg-emerald-700 transition-colors z-10"
                    title="Upload new photo"
                  >
                    <Camera size={16} />
                  </button>

                  <input
                    ref={fileRef}
                    type="file"
                    hidden
                    onChange={handleImage}
                    accept="image/*"
                  />
                </div>

                {/* NAME & STATUS */}
                <div className="flex-1 text-center md:text-left mt-2 w-full">
                  {editing ? (
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your Full Name"
                      className="w-full text-2xl font-bold bg-gray-50/50 dark:bg-gray-800/50 border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200 focus:border-emerald-500 px-3 py-2 text-gray-900 dark:text-white transition-colors"
                      style={{ outline: 'none', boxShadow: 'none' }}
                    />
                  ) : (
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                      {name || "Set your name"}
                    </h2>
                  )}

                  <div className="inline-flex items-center gap-2 mt-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-1.5 rounded-full text-sm font-bold border border-emerald-100 dark:border-emerald-800/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Verified Vendor
                  </div>
                </div>
              </div>

              {/* INFO GRID */}
              <div className="grid md:grid-cols-2 gap-5">
                <Editable icon={<Mail size={20} />} label="Email Address" value={email} setValue={setEmail} editing={editing} />
                <Editable icon={<Phone size={20} />} label="Phone Number" value={phone} setValue={setPhone} editing={editing} />
                <Editable icon={<MapPin size={20} />} label="Service Area / Address" value={location} setValue={setLocation} editing={editing} />
                <Editable icon={<Briefcase size={20} />} label="Available Time / Experience" value={experience} setValue={setExperience} editing={editing} />
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-4 mt-10 pt-6 border-t border-gray-100 dark:border-gray-800">
                {editing ? (
                  <>
                    <button
                      onClick={() => setEditing(false)}
                      className="px-6 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="px-8 py-2.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                    >
                      Save Profile
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setEditing(true)}
                    className="px-8 py-2.5 rounded-xl bg-gray-900 dark:bg-emerald-600 text-white font-bold hover:bg-gray-800 dark:hover:bg-emerald-700 shadow-lg transition-all active:scale-95"
                  >
                    Edit Profile
                  </button>
                )}
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

/* SMALL COMPONENTS */
function Editable({ icon, label, value, setValue, editing }: any) {
  return (
    <div className={`p-5 rounded-2xl border flex items-start gap-4 transition-all duration-300 ${
      editing 
        ? "bg-white dark:bg-[#111827] border-emerald-200 dark:border-emerald-500/30 shadow-[0_0_15px_rgb(16,185,129,0.1)] ring-1 ring-emerald-100 dark:ring-emerald-900/30" 
        : "bg-gray-50/70 dark:bg-gray-800/40 border-gray-100 dark:border-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800"
    }`}>
      <div className="text-emerald-500 shrink-0 mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        {editing ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={`Enter ${label.toLowerCase()}`}
            className="w-full bg-transparent border-t-0 border-l-0 border-r-0 border-b-2 border-gray-200 dark:border-gray-700 focus:border-emerald-500 text-gray-900 dark:text-white font-medium pb-1 px-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
        ) : (
          <p className="text-gray-900 dark:text-white font-medium truncate">{value || "Not set"}</p>
        )}
      </div>
    </div>
  );
}