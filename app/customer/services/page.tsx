"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, ShieldCheck, Clock, Filter, ChevronDown } from "lucide-react";
import API from "@/services/api";
import CustomerSidebar from "@/components/CustomerSidebar";
import CustomerNavbar from "@/components/CustomerNavbar";



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
  const [activeCategory, setActiveCategory] = useState("All");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>({});

  useEffect(()=>{
    const storedUser = localStorage.getItem("user");
    if(storedUser){
      setUser(JSON.parse(storedUser));
    }
    fetchServices();
  },[]);

  const userName = user.fullName || "Customer";
  const firstLetter = userName.charAt(0).toUpperCase();

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


  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = 
      activeCategory === "All" || 
      service.name.toLowerCase().includes(activeCategory.toLowerCase()) || 
      service.description.toLowerCase().includes(activeCategory.toLowerCase());
    return matchesSearch && matchesCategory;
  });


return(
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
        
       

        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 relative">
          <div className="max-w-7xl mx-auto space-y-8">
            
            {/* HEADER */}
            <div className="bg-white rounded-3xl shadow-sm px-6 py-5 md:px-8 md:py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border border-emerald-50 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-0 opacity-60 pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
              <div className="relative z-10">
                <h1 className="text-2xl font-bold text-emerald-900 tracking-tight">
                  Explore Services
                </h1>
                <p className="text-gray-500 mt-1 text-sm md:text-base">
                  Find trusted professionals near you for any task.
                </p>
              </div>

              <div className="relative w-full md:w-96 z-10">
                <Search 
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search for a service..."
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                  className="
                    w-full pl-11 pr-4 py-3 bg-gray-50 border-2 border-transparent
                    focus:border-emerald-200 focus:bg-white focus:ring-4 focus:ring-emerald-50
                    rounded-2xl outline-none transition-all duration-300 text-gray-700 font-medium
                  "
                />
              </div>
            </div>

            {/* CATEGORIES */}
            <div className="flex justify-start md:justify-center">
              {/* MOBILE DROPDOWN */}
              <div className="md:hidden w-full relative z-20">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full flex items-center justify-between bg-white border border-emerald-100 text-gray-800 font-bold py-3.5 px-5 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.04)] hover:shadow-md transition-all duration-300"
                >
                  <span className="truncate">{activeCategory === "All" ? "All Categories" : activeCategory}</span>
                  <ChevronDown className={`text-emerald-500 shrink-0 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} size={20} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-xl border border-emerald-100/50 rounded-2xl shadow-xl shadow-emerald-900/5 overflow-hidden transform origin-top transition-all animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="max-h-64 overflow-y-auto scrollbar-hide py-2">
                      {[
                        "All",
                        "Electrician",
                        "Plumber",
                        "AC Repair",
                        "Cleaning",
                        "Painting",
                        "Carpenter"
                      ].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            setIsDropdownOpen(false);
                          }}
                          className={`
                            w-full text-left px-5 py-3 text-sm font-bold transition-all duration-200 border-l-4
                            ${activeCategory === cat 
                              ? "border-emerald-500 bg-emerald-50 text-emerald-700" 
                              : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
                          `}
                        >
                          {cat === "All" ? "All Categories" : cat}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* DESKTOP PILL TABS */}
              <div className="hidden md:inline-flex items-center bg-white rounded-full p-1.5 shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-50/50 ">
                {[
                  "All",
                  "Electrician",
                  "Plumber",
                  "AC Repair",
                  "Cleaning",
                  "Painting",
                  "Carpenter"
                ].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`
                      relative px-6 py-2.5 rounded-full text-base font-bold whitespace-nowrap transition-all duration-300 cursor-pointer
                      ${activeCategory === cat 
                        ? "bg-[#00C37B] text-white shadow-md shadow-[#00C37B]/20" 
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50/50"}
                    `}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* SERVICES GRID */}
            <div className="pb-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="bg-white rounded-3xl p-5 shadow-sm h-[380px] animate-pulse border border-gray-100">
                      <div className="w-full h-48 bg-gray-100 rounded-2xl mb-4"></div>
                      <div className="w-3/4 h-6 bg-gray-100 rounded-full mb-3"></div>
                      <div className="w-full h-4 bg-gray-100 rounded-full mb-2"></div>
                      <div className="w-5/6 h-4 bg-gray-100 rounded-full"></div>
                    </div>
                  ))}
                </div>
              ) : filteredServices.length === 0 ? (
                <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-emerald-50 flex flex-col items-center">
                  <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                    <Search className="w-10 h-10 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">No services found</h3>
                  <p className="text-gray-500 mt-2 max-w-sm">We couldn't find any services matching "{search}". Try another search term.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className="group bg-white rounded-3xl p-5 shadow-sm hover:shadow-2xl hover:shadow-emerald-600/10 border border-gray-100 hover:border-emerald-200 hover:-translate-y-1.5 transition-all duration-300 flex flex-col"
                    >
                      {service.imageUrl ? (
                        <div className="relative h-52 rounded-2xl overflow-hidden shadow-sm mb-5">
                          <img
                            src={`http://localhost:8080${service.imageUrl}`}
                            alt={service.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <Star size={14} className="fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-bold text-gray-900">4.8</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative h-52 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-2xl flex items-center justify-center mb-5 overflow-hidden">
                          <span className="text-7xl text-emerald-200 font-extrabold transform group-hover:scale-110 transition-transform duration-700">{service.name.charAt(0)}</span>
                          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                            <Star size={14} className="fill-yellow-500 text-yellow-500" />
                            <span className="text-xs font-bold text-gray-900">4.8</span>
                          </div>
                        </div>
                      )}

                      <div className="flex-1 flex flex-col">
                        <h2 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                          {service.name}
                        </h2>
                        <p className="text-gray-500 mt-2 text-sm leading-relaxed line-clamp-2 flex-1">
                          {service.description}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-5 border-t border-gray-100">
                          <div>
                            <p className="text-xs font-medium text-gray-400 mb-0.5">Starting from</p>
                            <p className="text-2xl font-extrabold text-emerald-600">
                              ₹{service.price}
                            </p>
                          </div>
                          <button
                            onClick={() => bookService(service.id, service.price)}
                            className="bg-gray-900 hover:bg-emerald-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-md hover:shadow-lg hover:shadow-emerald-600/30 transition-all duration-300 active:scale-95 cursor-pointer"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* HORIZONTAL PROMISE BANNER */}
            <div className="bg-emerald-900 rounded-3xl p-8 md:p-10 shadow-xl border border-emerald-800 relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-10 mt-8">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500 rounded-full blur-3xl -z-0 opacity-20 pointer-events-none translate-x-1/2 -translate-y-1/2"></div>
              
              <div className="relative z-10 lg:w-1/3">
                <div className="inline-flex items-center gap-2 bg-emerald-800/50 border border-emerald-700/50 text-emerald-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                  <ShieldCheck size={14} /> The ServiceSphere Way
                </div>
                <h2 className="text-3xl font-extrabold text-white mb-3">
                  Our Promise To You
                </h2>
                <p className="text-emerald-100/80 leading-relaxed text-sm">
                  We don't just connect you with professionals, we guarantee a premium experience from booking to completion.
                </p>
              </div>

              <div className="relative z-10 flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                <div className="bg-emerald-800/40 backdrop-blur border border-emerald-700/50 rounded-2xl p-5 hover:bg-emerald-800/60 transition-colors">
                  <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                    <ShieldCheck size={20} />
                  </div>
                  <h3 className="font-bold text-white mb-1">Verified Pros</h3>
                  <p className="text-xs text-emerald-100/70">Every professional is rigorously background checked.</p>
                </div>
                <div className="bg-emerald-800/40 backdrop-blur border border-emerald-700/50 rounded-2xl p-5 hover:bg-emerald-800/60 transition-colors">
                  <div className="w-10 h-10 bg-blue-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/30">
                    <Clock size={20} />
                  </div>
                  <h3 className="font-bold text-white mb-1">Quick Booking</h3>
                  <p className="text-xs text-emerald-100/70">Book top-rated services in less than 60 seconds.</p>
                </div>
                <div className="bg-emerald-800/40 backdrop-blur border border-emerald-700/50 rounded-2xl p-5 hover:bg-emerald-800/60 transition-colors">
                  <div className="w-10 h-10 bg-yellow-500 text-white rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-yellow-500/30">
                    <Star size={20} />
                  </div>
                  <h3 className="font-bold text-white mb-1">Quality Service</h3>
                  <p className="text-xs text-emerald-100/70">100% satisfaction guaranteed on every single job.</p>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}