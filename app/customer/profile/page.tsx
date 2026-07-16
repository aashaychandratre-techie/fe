"use client";

import {useState,useEffect} from "react";
import axios from "axios";

import {
Camera,
Mail,
Phone,
MapPin,
Edit3,
Save,
ArrowLeft,
UserRound,
X,
VenusAndMars,
Trash2,
ChevronDown,
Image as ImageIcon
} from "lucide-react";

import {useRouter} from "next/navigation";
import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerNavbar from "@/components/CustomerNavbar";


export default function CustomerProfilePage(){

const router=useRouter();
const [mounted,setMounted]=useState(false);
const [darkMode, setDarkMode] = useState(false);
const [sidebarOpen, setSidebarOpen] = useState(false);
const [isEditing,setIsEditing]=useState(false);
const [showPhotoMenu,setShowPhotoMenu]=useState(false);
const [showGenderDropdown, setShowGenderDropdown] = useState(false);
const [selectedFile,setSelectedFile]=useState<File|null>(null);
const [profileImage,setProfileImage]=useState("");
const [profile,setProfile]=useState({

id:"",
fullName:"",
email:"",
mobileNumber:"",
address:"",
gender:"",
profileImage:""

});

const [temp,setTemp]=useState(profile);
const getImageUrl=(img?:string)=>{

if(!img)
return "";

if(img.startsWith("http"))
return img;

return `http://localhost:8080${img}`;

};

useEffect(()=>{
setMounted(true);
const loadUser=async()=>{
try{
const savedUser=
JSON.parse(
localStorage.getItem("user")||"{}"
);

if(savedUser?.id){
const res=
await axios.get(
`http://localhost:8080/api/auth/user/${savedUser.id}`
);

const user=res.data;
setProfile(user);
setTemp(user);
setProfileImage(
getImageUrl(user.profileImage)
);

localStorage.setItem(
"user",
JSON.stringify(user)
);
}
}
catch(err){
console.log(err);
}
};
loadUser();
},[]);
if(!mounted)
return null;
const selectImage=(e:any)=>{
const file=e.target.files?.[0];
if(file){
setSelectedFile(file);
setProfileImage(
URL.createObjectURL(file)
);
}
};

const deleteImage=async()=>{
try{
const res=
await axios.delete(
`http://localhost:8080/api/auth/delete-profile/${profile.id}`
);

setProfile(res.data);
setTemp(res.data);
setProfileImage("");

localStorage.setItem(
"user",
JSON.stringify(res.data)
);

alert(
"Profile Photo Deleted"
);
}
catch(err){

console.log(err);
}

};

const saveProfile=async()=>{
try{
const updateData={

...temp,
profileImage:null
};

let res=
await axios.put(
`http://localhost:8080/api/auth/update/${profile.id}`,
updateData
);

let user=res.data;
if(selectedFile){
const form=new FormData();
form.append(
"file",
selectedFile
);
const upload=
await axios.post(
`http://localhost:8080/api/auth/upload-profile/${profile.id}`,
form,

{
headers:{
"Content-Type":"multipart/form-data"
}
}

);

user=upload.data;
}
setProfile(user);
setTemp(user);
localStorage.setItem(
"user",
JSON.stringify(user)
);

setProfileImage(
getImageUrl(user.profileImage)
);
setSelectedFile(null);
setIsEditing(false);

alert(
"Profile Updated Successfully"
);
}
catch(err){
console.log(err);

alert(
"Update Failed"
);
}

};
  const userName = profile?.fullName || "Customer";
  const firstLetter = userName.charAt(0).toUpperCase();
  return (
    <div
      className={`h-screen flex font-sans overflow-hidden ${
        darkMode ? "bg-[#071A12] text-white" : "bg-[#F3FBF6] text-gray-900"
      }`}
    >
      <CustomerSidebar
        darkMode={darkMode}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <div className="flex-1 flex flex-col min-h-0 min-w-0 relative">

         <div className="md:hidden">
          <CustomerNavbar
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setSidebarOpen={setSidebarOpen}
            userName={userName}
            firstLetter={firstLetter}
          />
        </div>
        {/* Premium Blur Blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl pointer-events-none -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-400/5 rounded-full blur-3xl pointer-events-none translate-y-1/3 -translate-x-1/4"></div>

       

        <main className="flex-1 overflow-y-auto p-5 lg:p-8 relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
                  My Profile
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  Manage your personal information
                </p>
              </div>
            </div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
<div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 p-6">
<div className="text-center">
<div className="relative inline-block">
{
profileImage ?
<img
src={profileImage}
className="w-28 h-28 rounded-full object-cover shadow"
/>
:
<div
className="w-28 h-28 rounded-full bg-emerald-600 flex items-center justify-center text-white text-5xl font-bold"
>

{
profile.fullName?.charAt(0).toUpperCase()
}

</div>
}
<button
onClick={()=>setShowPhotoMenu(!showPhotoMenu)}
className="absolute bottom-1 right-1 bg-white p-2 rounded-full shadow border"
>

<Camera
size={16}
className="text-emerald-600"
/>

</button>

{
showPhotoMenu &&
<div className="absolute right-0 mt-2 bg-white shadow-xl rounded-xl p-2 w-44 z-20">
<label
className="flex gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
>
<Camera size={16}/>

Camera
<input
type="file"
accept="image/*"
capture="user"
className="hidden"
onChange={selectImage}
/>
</label>
<label
className="flex gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer"
>
<ImageIcon size={16}/>
Gallery
<input
type="file"
accept="image/*"
className="hidden"
onChange={selectImage}
/>
</label>
<button
onClick={deleteImage}
className="flex gap-2 p-2 text-red-600 hover:bg-red-50 rounded"
>
<Trash2 size={16}/>
Delete
</button>
</div>
}
</div>
<h2 className="mt-4 text-xl font-bold text-gray-800">
{
profile.fullName || "Customer"
}
</h2>
<p className="text-sm text-gray-500">
Customer Account
</p>
<div className="mt-5 space-y-3">
<div className="bg-emerald-50 p-3 rounded-xl flex gap-2 text-emerald-700">
<UserRound size={18}/>
Verified Customer
</div>

</div>
</div>
</div>
<div className="lg:col-span-2 bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border-0 p-6">
<div className="flex flex-wrap justify-between items-center gap-4 mb-6">
<h2 className="text-xl font-bold text-gray-800">
Personal Information
</h2>
{
!isEditing ?
<button
onClick={()=>setIsEditing(true)}
className="flex gap-2 items-center bg-emerald-600 text-white px-5 py-2.5 rounded-xl cursor-pointer"
>
<Edit3 size={16}/>
Edit
</button>
:
<div className="flex gap-2">
<button
onClick={saveProfile}
className="flex gap-2 items-center bg-emerald-600 text-white px-5 py-2.5 rounded-xl"
>
<Save size={16}/>
Save
</button>
<button
onClick={()=>{
setTemp(profile);
setSelectedFile(null);
setProfileImage(
getImageUrl(profile.profileImage)
);
setIsEditing(false);
}}
className="flex gap-2 items-center bg-gray-200 px-5 py-2.5 rounded-xl"
>
<X size={16}/>
Cancel
</button>
</div>
}
</div>
<div className="grid md:grid-cols-2 gap-5">
<div>
<label htmlFor="fullName" className="text-sm font-medium text-gray-600 block mb-2 cursor-pointer">
Full Name
</label>
<label htmlFor="fullName" className={`flex items-center gap-3 border rounded-2xl px-4 py-3 transition-all duration-200 ${isEditing ? 'bg-white border-gray-200 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-300 cursor-text' : 'bg-gray-50/70 border-gray-100 opacity-80 cursor-default'}`}>
<UserRound size={18} className="text-emerald-500 shrink-0" />
<input
id="fullName"
disabled={!isEditing}
value={temp.fullName || ""}
onChange={e=>setTemp({...temp, fullName:e.target.value})}
style={{boxShadow: 'none', border: 'none', outline: 'none'}}
className="w-full border-0 focus:ring-0 focus:outline-none p-0 bg-transparent text-sm text-gray-800 disabled:text-gray-500"
/>
</label>
</div>
<div>
<label htmlFor="email" className="text-sm font-medium text-gray-600 block mb-2 cursor-pointer">
Email
</label>
<label htmlFor="email" className={`flex items-center gap-3 border rounded-2xl px-4 py-3 transition-all duration-200 ${isEditing ? 'bg-white border-gray-200 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-300 cursor-text' : 'bg-gray-50/70 border-gray-100 opacity-80 cursor-default'}`}>
<Mail size={18} className="text-emerald-500 shrink-0" />
<input
id="email"
disabled={!isEditing}
value={temp.email || ""}
onChange={e=>setTemp({...temp, email:e.target.value})}
style={{boxShadow: 'none', border: 'none', outline: 'none'}}
className="w-full border-0 focus:ring-0 focus:outline-none p-0 bg-transparent text-sm text-gray-800 disabled:text-gray-500"
/>
</label>
</div>

<div>
<label htmlFor="mobileNumber" className="text-sm font-medium text-gray-600 block mb-2 cursor-pointer">
Mobile Number
</label>
<label htmlFor="mobileNumber" className={`flex items-center gap-3 border rounded-2xl px-4 py-3 transition-all duration-200 ${isEditing ? 'bg-white border-gray-200 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-300 cursor-text' : 'bg-gray-50/70 border-gray-100 opacity-80 cursor-default'}`}>
<Phone size={18} className="text-emerald-500 shrink-0" />
<input
id="mobileNumber"
disabled={!isEditing}
value={temp.mobileNumber || ""}
onChange={e=>setTemp({...temp, mobileNumber:e.target.value})}
style={{boxShadow: 'none', border: 'none', outline: 'none'}}
className="w-full border-0 focus:ring-0 focus:outline-none p-0 bg-transparent text-sm text-gray-800 disabled:text-gray-500"
/>
</label>
</div>

<div>
<label htmlFor="gender" className="text-sm font-medium text-gray-600 block mb-2 cursor-pointer">
Gender
</label>
<div className="relative">
<div 
  onClick={() => isEditing && setShowGenderDropdown(!showGenderDropdown)}
  className={`flex items-center gap-3 border rounded-2xl px-4 py-3 transition-all duration-200 ${isEditing ? 'bg-white border-gray-200 hover:border-emerald-300 cursor-pointer' : 'bg-gray-50/70 border-gray-100 opacity-80 cursor-default'}`}
>
  <VenusAndMars size={18} className="text-emerald-500 shrink-0" />
  <span className={`flex-1 text-sm ${temp.gender ? 'text-gray-800' : 'text-gray-500'}`}>
    {temp.gender || "Select Gender"}
  </span>
  <ChevronDown size={18} className={`shrink-0 pointer-events-none transition-transform duration-200 ${showGenderDropdown ? 'rotate-180 text-emerald-500' : isEditing ? 'text-gray-400' : 'text-gray-300 opacity-60'}`} />
</div>

{showGenderDropdown && isEditing && (
  <>
    <div className="fixed inset-0 z-10" onClick={() => setShowGenderDropdown(false)}></div>
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl shadow-emerald-900/5 rounded-2xl overflow-hidden z-20 animate-in fade-in slide-in-from-top-2 duration-200">
      {["Male", "Female", "Other"].map((option) => (
        <div
          key={option}
          onClick={() => {
            setTemp({...temp, gender: option});
            setShowGenderDropdown(false);
          }}
          className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-emerald-50 ${temp.gender === option ? 'text-emerald-700 bg-emerald-50/50 font-medium' : 'text-gray-700'}`}
        >
          {option}
        </div>
      ))}
    </div>
  </>
)}
</div>
</div>

<div className="md:col-span-2">
<label htmlFor="address" className="text-sm font-medium text-gray-600 block mb-2 cursor-pointer">
Address
</label>
<label htmlFor="address" className={`flex items-center gap-3 border rounded-2xl px-4 py-3 transition-all duration-200 ${isEditing ? 'bg-white border-gray-200 focus-within:ring-2 focus-within:ring-emerald-100 focus-within:border-emerald-300 cursor-text' : 'bg-gray-50/70 border-gray-100 opacity-80 cursor-default'}`}>
<MapPin size={18} className="text-emerald-500 shrink-0" />
<input
id="address"
disabled={!isEditing}
value={temp.address || ""}
onChange={e=>setTemp({...temp, address:e.target.value})}
style={{boxShadow: 'none', border: 'none', outline: 'none'}}
className="w-full border-0 focus:ring-0 focus:outline-none p-0 bg-transparent text-sm text-gray-800 disabled:text-gray-500"
/>
</label>
</div>

</div>
</div>
</div>
          </div>
        </main>
      </div>
    </div>
  );
}