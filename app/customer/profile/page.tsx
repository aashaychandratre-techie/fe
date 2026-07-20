"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  Camera,
  Mail,
  Phone,
  MapPin,
  Edit3,
  Save,
  UserRound,
  X,
  VenusAndMars,
  Trash2,
  ChevronDown,
  Image as ImageIcon,
  CheckCircle2
} from "lucide-react";
import { useRouter } from "next/navigation";
import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerNavbar from "@/components/CustomerNavbar";
import { useDarkMode } from "@/hooks/useDarkMode";

export default function CustomerProfilePage() {
  const router = useRouter();

  const toTitleCase = (value: string) => {
  return value
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};
  const [mounted, setMounted] = useState(false);
  const [darkMode, setDarkMode] = useDarkMode();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [showGenderDropdown, setShowGenderDropdown] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState("");
  const [profile, setProfile] = useState({
    id: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    address: "",
    gender: "",
    profileImage: ""
  });

  const [temp, setTemp] = useState(profile);

  const getImageUrl = (img?: string) => {
    if (!img) return "";
    if (img.startsWith("http")) return img;
    return `http://localhost:8080${img}`;
  };

  useEffect(() => {
    setMounted(true);
    const loadUser = async () => {
      try {
        const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
        if (savedUser?.id) {
          const res = await axios.get(`http://localhost:8080/api/auth/user/${savedUser.id}`);
          const user = res.data;
          setProfile(user);
          setTemp(user);
          setProfileImage(getImageUrl(user.profileImage));
          localStorage.setItem("user", JSON.stringify(user));
          window.dispatchEvent(new Event("storage"));
        }
      } catch (err) {
        console.log(err);
      }
    };
    loadUser();
  }, []);

  if (!mounted) return null;

  const selectImage = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setProfileImage(URL.createObjectURL(file));
    }
    setShowPhotoMenu(false);
  };

  const deleteImage = async () => {
    try {
      const res = await axios.delete(`http://localhost:8080/api/auth/delete-profile/${profile.id}`);
      setProfile(res.data);
      setTemp(res.data);
      setProfileImage("");
      localStorage.setItem("user", JSON.stringify(res.data));
      window.dispatchEvent(new Event("storage"));
      setShowPhotoMenu(false);
      alert("Profile Photo Deleted");
    } catch (err) {
      console.log(err);
    }
  };

  const saveProfile = async () => {
    try {
      const updateData = { ...temp, profileImage: null };
      let res = await axios.put(`http://localhost:8080/api/auth/update/${profile.id}`, updateData);
      let user = res.data;

      if (selectedFile) {
        const form = new FormData();
        form.append("file", selectedFile);
        const upload = await axios.post(`http://localhost:8080/api/auth/upload-profile/${profile.id}`, form, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        user = upload.data;
      }

      setProfile(user);
      setTemp(user);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("storage"));
      setProfileImage(getImageUrl(user.profileImage));
      setSelectedFile(null);
      setIsEditing(false);
      alert("Profile Updated Successfully");
    } catch (err) {
      console.log(err);
      alert("Update Failed");
    }
  };

  const userName = profile?.fullName || "Customer";
  const firstLetter = userName.charAt(0).toUpperCase();

  const profileFields = [
    { icon: UserRound, label: "Full Name", field: "fullName", type: "text" },
    { icon: Mail, label: "Email Address", field: "email", type: "text" },
    { icon: Phone, label: "Mobile Number", field: "mobileNumber", type: "text" },
    { icon: VenusAndMars, label: "Gender", field: "gender", type: "dropdown", options: ["Male", "Female", "Other"] },
    { icon: MapPin, label: "Complete Address", field: "address", type: "text" },
  ];

  return (
    <div className={`h-screen flex font-sans overflow-hidden ${darkMode ? "bg-[#0B1121] text-white" : "bg-[#F8F9FA] text-gray-900"}`}>
      <CustomerSidebar darkMode={darkMode} open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-h-0 min-w-0 relative">
        <div className="md:hidden shrink-0">
          <CustomerNavbar darkMode={darkMode} setDarkMode={setDarkMode} setSidebarOpen={setSidebarOpen} userName={userName} firstLetter={firstLetter} />
        </div>

        {/* Changed paddings here to fit content in a single screen */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col justify-start xl:justify-center">
          <div className="max-w-5xl w-full mx-auto space-y-4 md:space-y-5">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
                <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Manage your personal information</p>
              </div>
              
              <div className="flex shrink-0">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-medium shadow-sm w-full sm:w-auto text-sm"
                  >
                    <Edit3 size={16} /> Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => {
                        setTemp(profile);
                        setSelectedFile(null);
                        setProfileImage(getImageUrl(profile.profileImage));
                        setIsEditing(false);
                      }}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium ${darkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 shadow-sm'}`}
                    >
                      <X size={16} /> Cancel
                    </button>
                    <button
                      onClick={saveProfile}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-medium shadow-sm shadow-emerald-600/20"
                    >
                      <Save size={16} /> Save
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 items-start">
              
              {/* Profile Photo Card */}
              <div className={`lg:col-span-4 rounded-3xl p-6 flex flex-col items-center text-center shadow-[0_2px_20px_rgb(0,0,0,0.03)] border ${darkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className="relative inline-block mb-4">
                  <div className="w-36 h-36 rounded-full p-1 border-2 border-emerald-100 bg-white">
                    {profileImage ? (
                      <img src={profileImage} className="w-full h-full rounded-full object-cover" alt="Profile" />
                    ) : (
                      <div className="w-full h-full rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-5xl font-bold">
                        {firstLetter}
                      </div>
                    )}
                  </div>
                  <button
  onClick={() => setShowPhotoMenu(!showPhotoMenu)}
  className="absolute bottom-1 right-2 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 focus:outline-none active:scale-100"
>
  <Camera size={18} className="text-emerald-600" />
</button>
                  <button
                    onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                    className="absolute bottom-1 right-2 bg-white p-2.5 rounded-full shadow-lg border border-gray-100 hover:bg-gray-50"
                  >
                    <Camera size={18} className="text-emerald-600" />
                  </button>

                  {showPhotoMenu && (
                    <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-2 shadow-xl rounded-2xl p-2 w-37 z-20 border ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-100 text-gray-800'}`}>
                      <label className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <Camera size={16} className="text-gray-500" />
                        <span className="text-sm font-medium">Camera</span>
                        <input type="file" accept="image/*" capture="user" className="hidden" onChange={selectImage} />
                      </label>
                      <label className={`flex items-center gap-3 p-2 rounded-xl cursor-pointer ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                        <ImageIcon size={16} className="text-gray-500" />
                        <span className="text-sm font-medium">Gallery</span>
                        <input type="file" accept="image/*" className="hidden" onChange={selectImage} />
                      </label>
                      {profileImage && (
                        <button onClick={deleteImage} className={`w-full flex items-center gap-3 p-2 rounded-xl ${darkMode ? 'hover:bg-red-900/30 text-red-400' : 'hover:bg-red-50 text-red-600'}`}>
                          <Trash2 size={16} />
                          <span className="text-sm font-medium">Remove</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
                
                <h2 className="text-xl font-bold mb-1">{profile.fullName || "Customer"}</h2>
                <p className={`text-[13px] mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{profile.email}</p>
                
                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-[13px] font-medium">
                  <CheckCircle2 size={14} /> Verified Account
                </div>
              </div>

              {/* Personal Details Card */}
              <div className={`lg:col-span-8 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.03)] border overflow-hidden ${darkMode ? 'bg-[#111827] border-gray-800' : 'bg-white border-gray-100'}`}>
                <div className={`px-5 py-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-50'}`}>
                  <h3 className="text-[16px] font-bold">Personal Information</h3>
                </div>
                
                <div className="flex flex-col">
                  {profileFields.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.field} className={`px-5 py-3 flex flex-col md:flex-row md:items-center gap-2 md:gap-4 ${darkMode ? 'border-gray-800' : 'border-gray-50'} ${index !== profileFields.length - 1 ? 'border-b' : ''}`}>
                        <div className="flex items-center gap-3 md:w-1/3 shrink-0">
                          <div className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-emerald-500' : 'bg-emerald-50 text-emerald-600'}`}>
                            <Icon size={16} />
                          </div>
                          <span className={`text-[14px] font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{item.label}</span>
                        </div>
                        
                        <div className="flex-1 w-full relative">
                          {!isEditing ? (
                            <p className={`text-[14px] font-medium ${!(temp as any)[item.field] ? 'text-gray-400 italic' : (darkMode ? 'text-gray-200' : 'text-gray-800')}`}>
                              {(temp as any)[item.field] || `No ${item.label.toLowerCase()} added`}
                            </p>
                          ) : item.type === "dropdown" ? (
                            <div className="relative w-full">
                              <div 
                                onClick={() => setShowGenderDropdown(!showGenderDropdown)}
                                className={`w-full flex justify-between items-center px-3 py-2 rounded-lg border cursor-pointer ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 hover:border-emerald-300'}`}
                              >
                                <span className={`text-[14px] ${!(temp as any)[item.field] && 'text-gray-400'}`}>{(temp as any)[item.field] || "Select"}</span>
                                <ChevronDown size={16} className={`${showGenderDropdown ? 'text-emerald-500' : 'text-gray-400'}`} />
                              </div>
                              {showGenderDropdown && (
                                <>
                                  <div className="fixed inset-0 z-10" onClick={() => setShowGenderDropdown(false)}></div>
                                  <div className={`absolute top-full left-0 right-0 mt-1 border rounded-lg overflow-hidden z-20 shadow-xl ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}>
                                    {item.options?.map((option: string) => (
                                      <div
                                        key={option}
                                        onClick={() => { setTemp({ ...temp, [item.field]: option }); setShowGenderDropdown(false); }}
                                        className={`px-3 py-2.5 text-[14px] cursor-pointer ${temp.gender === option ? 'text-emerald-600 bg-emerald-50 font-medium' : (darkMode ? 'text-gray-200 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-50')}`}
                                      >
                                        {option}
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ) : (
                            <input
                              type="text"
                              value={(temp as any)[item.field] || ""}
                                    onChange={(e) =>
  setTemp({
    ...temp,
    [item.field]:
      item.field === "email"
        ? e.target.value.toLowerCase()
        : toTitleCase(e.target.value),
  })
}
                              className={`w-full px-3 py-2 rounded-lg border text-[14px] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:outline-none ${darkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}