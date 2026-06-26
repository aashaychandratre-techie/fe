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
Image as ImageIcon
} from "lucide-react";

import {useRouter} from "next/navigation";


export default function CustomerProfilePage(){

const router=useRouter();


const [mounted,setMounted]=useState(false);
const [isEditing,setIsEditing]=useState(false);
const [showPhotoMenu,setShowPhotoMenu]=useState(false);

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
return(

<div className="min-h-screen bg-[#F5FBF7]">

<div className="max-w-6xl mx-auto p-5 lg:p-8">


<div className="flex items-center gap-3 mb-6">


<button
onClick={()=>router.back()}
className="w-11 h-11 bg-white rounded-xl shadow flex items-center justify-center"
>

<ArrowLeft
size={20}
className="text-emerald-600"
/>

</button>



<div>

<h1 className="text-3xl font-bold text-gray-800">
My Profile
</h1>


<p className="text-sm text-gray-500">
Manage your personal information
</p>


</div>


</div>





<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">





<div className="bg-white rounded-3xl border shadow-sm p-6">


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

capture="environment"

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




<div className="bg-gray-50 p-3 rounded-xl flex gap-2">


<VenusAndMars

size={18}

className="text-emerald-600"

/>


{
profile.gender || "Select Gender"
}


</div>



</div>



</div>


</div>





<div className="lg:col-span-2 bg-white rounded-3xl border shadow-sm p-6">


<div className="flex justify-between items-center mb-6">


<h2 className="text-xl font-bold text-gray-800">
Personal Information
</h2>




{
!isEditing ?


<button

onClick={()=>setIsEditing(true)}

className="flex gap-2 items-center bg-emerald-600 text-white px-5 py-2.5 rounded-xl"

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
<div className="grid md:grid-cols-2 gap-4">



<div>

<label className="text-sm text-gray-500">
Full Name
</label>


<input

disabled={!isEditing}

value={temp.fullName}

onChange={
e=>setTemp({
...temp,
fullName:e.target.value
})
}

className="mt-2 w-full p-3 rounded-xl border outline-none"

/>

</div>





<div>

<label className="text-sm text-gray-500">
Email
</label>



<div className="mt-2 flex items-center gap-2 border rounded-xl p-3">


<Mail
size={18}
className="text-emerald-600"
/>



<input

disabled

value={temp.email}

className="w-full outline-none"

/>


</div>


</div>







<div>

<label className="text-sm text-gray-500">
Mobile Number
</label>



<div className="mt-2 flex items-center gap-2 border rounded-xl p-3">


<Phone
size={18}
className="text-emerald-600"
/>



<input

disabled={!isEditing}

value={temp.mobileNumber}

onChange={
e=>setTemp({
...temp,
mobileNumber:e.target.value
})
}

className="w-full outline-none"

/>


</div>


</div>








<div>

<label className="text-sm text-gray-500">
Gender
</label>



<select

disabled={!isEditing}

value={temp.gender || ""}

onChange={
e=>setTemp({
...temp,
gender:e.target.value
})
}

className="mt-2 w-full p-3 rounded-xl border outline-none"

>


<option value="">
Select Gender
</option>


<option value="Male">
Male
</option>


<option value="Female">
Female
</option>


<option value="Other">
Other
</option>


</select>


</div>







<div className="md:col-span-2">


<label className="text-sm text-gray-500">
Address
</label>




<div className="mt-2 flex items-center gap-2 border rounded-xl p-3">


<MapPin

size={18}

className="text-emerald-600"

/>




<input

disabled={!isEditing}

value={temp.address}

onChange={
e=>setTemp({
...temp,
address:e.target.value
})
}

className="w-full outline-none"

/>



</div>



</div>



</div>




</div>



</div>



</div>



</div>



);

}