"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, ShieldCheck, Clock } from "lucide-react";
import API from "@/services/api";

type Service = {
  id:number;
  name:string;
  description:string;
  price:number;
  imageUrl?:string;
};

export default function ServicesPage(){

  const router = useRouter();

  const [services,setServices] = useState<Service[]>([]);
  const [loading,setLoading] = useState(true);
  const [search,setSearch] = useState("");


  useEffect(()=>{
    fetchServices();
  },[]);


  const fetchServices = async()=>{

    try{
      const response = await API.get("/services");
      setServices(response.data);

    }catch(error){
      console.log(error);

    }finally{
      setLoading(false);
    }

  };


  const bookService=(id:number,price:number)=>{

    router.push(
      `/customer/booking?serviceId=${id}&amount=${price}`
    );

  };


  const filteredServices = services.filter((service)=>
    service.name
    .toLowerCase()
    .includes(search.toLowerCase())
  );


return(

<div className="min-h-screen bg-[#f5f7fb] p-6">


{/* HEADER */}

<div className="bg-white rounded-2xl shadow-sm p-6 mb-6">

<div className="flex justify-between items-center">

<div>

<h1 className="text-3xl font-bold text-gray-800">
Explore Services
</h1>

<p className="text-gray-500 mt-1">
Find trusted professionals near you
</p>

</div>


<div className="relative">

<Search 
size={20}
className="absolute left-3 top-3 text-gray-400"
/>

<input
type="text"
placeholder="Search services..."
value={search}
onChange={(e)=>setSearch(e.target.value)}
className="
pl-10
pr-4
py-3
w-80
border
rounded-xl
outline-none
"
/>

</div>


</div>

</div>



{/* MAIN GRID */}

<div className="grid grid-cols-12 gap-6">


{/* LEFT SIDE */}

<div className="col-span-12 md:col-span-3">


<div className="
bg-white
rounded-2xl
p-5
shadow-sm
">


<h2 className="font-bold text-lg mb-4">
Categories
</h2>


<div className="space-y-3">


{[
"⚡ Electrician",
"🔧 Plumber",
"❄️ AC Repair",
"🧹 Cleaning",
"🎨 Painting",
"🪚 Carpenter"
].map((item)=>(

<button
key={item}
className="
w-full
text-left
p-3
rounded-xl
hover:bg-emerald-50
"
>

{item}

</button>

))}


</div>


</div>


</div>





{/* SERVICES */}



<div className="col-span-12 md:col-span-6 overflow-hidden">


<div
  className="
  space-y-5
  max-h-[650px]
  overflow-y-auto
  pr-0
  scrollbar-custom
  "
>


{loading ? (

<div className="bg-white p-8 rounded-xl text-center">
Loading...
</div>


) : filteredServices.length===0 ? (

<div className="bg-white p-8 rounded-xl text-center">
No services found
</div>


) : (


filteredServices.map((service)=>(
<div

key={service.id}
className="
bg-white
rounded-2xl
p-4
shadow-sm
hover:shadow-lg
transition

"
>

<div className="flex justify-between gap-4">


<div className="flex-1">

<h2 className="text-xl font-bold">
{service.name}
</h2>


<p className="text-gray-500 mt-2 text-sm">
{service.description}
</p>


<div className="flex gap-2 items-center mt-4">

<Star
size={18}
className="text-yellow-500"
/>

<span className="text-sm">
4.8 Rating
</span>

</div>


<p className="text-2xl font-bold text-emerald-600 mt-4">
₹{service.price}
</p>


</div>
{/* IMAGE */}

{service.imageUrl && (
  <img
    src={`http://localhost:8080${service.imageUrl}`}
    alt={service.name}
    className="
      w-36
      h-36
      rounded-2xl
      object-cover
    "
  />
)}

</div>


{/* BOOK BUTTON */}

<button
  onClick={() =>
    bookService(
      service.id,
      service.price
    )
  }
  className="
    mt-5
    w-full
    bg-emerald-600
    text-white
    py-3
    rounded-xl
    font-semibold
    hover:bg-emerald-500
    transition
  "
>
  Book Service
</button>


</div>

))

)}


</div>

</div>



{/* RIGHT PANEL */}

<div className="col-span-12 md:col-span-3">

  <div className="
    bg-white
    rounded-2xl
    p-5
    shadow-sm
  ">

    <h2 className="text-lg font-bold mb-5">
      ServiceSphere Promise
    </h2>


    <div className="space-y-4">


      <div className="
        flex
        items-center
        gap-3
        bg-gray-50
        p-3
        rounded-xl
      ">
        <ShieldCheck 
          size={22}
          className="text-emerald-600"
        />

        <span className="text-sm">
          Verified Professionals
        </span>

      </div>



      <div className="
        flex
        items-center
        gap-3
        bg-gray-50
        p-3
        rounded-xl
      ">

        <Clock
          size={22}
          className="text-emerald-600"
        />

        <span className="text-sm">
          Quick Booking
        </span>

      </div>



      <div className="
        flex
        items-center
        gap-3
        bg-gray-50
        p-3
        rounded-xl
      ">

        <Star
          size={22}
          className="text-emerald-600"
        />

        <span className="text-sm">
          Quality Service
        </span>

      </div>


    </div>



    <div className="
      mt-6
      bg-emerald-50
      rounded-xl
      p-4
      text-center
    ">

      <h3 className="font-bold">
        Need Help?
      </h3>

      <p className="text-sm text-gray-500 mt-1">
        Contact support anytime
      </p>

    </div>


  </div>

</div>


</div>

</div>


);
}