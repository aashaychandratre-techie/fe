"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import API from "@/services/api";
import {
  User,
  MapPin,
  CalendarDays,
  Clock,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";
import { log } from "console";

export default function BookingPage() {

  const router = useRouter();
  const searchParams = useSearchParams();

  const serviceId = searchParams.get("serviceId");
  const amount = searchParams.get("amount");

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    address: "",
    date: "",
    time: "",
  });


  const handleConfirm = async () => {

    if (
      !form.name ||
      !form.address ||
      !form.date ||
      !form.time
    ) {
      alert("Please fill all fields");
      return;
    }


    try {

      setLoading(true);

      const user = JSON.parse(
        localStorage.getItem("user") || "{}"
      );


     const payload = {
  customerId: String(user.id),
  serviceId: String(serviceId),
  vendorId: null,
  bookingDate: form.date,
  bookingTime: form.time,
  address: form.address,
  amount: amount ? parseFloat(amount) : 0,
  status: "PENDING",
  user: user
};


      const response = await API.post(
        "/bookings",
        payload
      );

      console.log("payload" ,payload);

      console.log(response.data);

      alert("Booking Completed Successfully");

      router.push("/customer/bookings");


    } catch(error:any){

      console.log(error);

      alert(
        error?.response?.data?.message ||
        "Booking Failed"
      );


    } finally {

      setLoading(false);

    }

  };



  return (

    <div className="min-h-screen bg-[#F5FBF7] flex items-center justify-center p-5">


      <div className="
        w-full
        max-w-lg
        bg-white
        rounded-3xl
        shadow-lg
        border
        p-7
      ">


        {/* HEADER */}

        <div className="flex items-center gap-3 mb-6">


          <button
            onClick={()=>router.back()}
            className="
              w-10 h-10
              rounded-xl
              bg-emerald-50
              flex
              items-center
              justify-center
              hover:bg-emerald-100
            "
          >

            <ArrowLeft
              size={20}
              className="text-emerald-600"
            />

          </button>



          <div>

            <h1 className="
              text-2xl
              font-bold
              text-gray-800
            ">
              Complete Booking
            </h1>


            <p className="
              text-sm
              text-gray-500
            ">
              Fill details to confirm your service
            </p>


          </div>


        </div>




        {/* NAME */}

        <div className="mb-4">

          <label className="text-sm text-gray-600">
            Your Name
          </label>


          <div className="
            mt-2
            flex
            items-center
            gap-3
            border
            rounded-xl
            p-3
          ">


            <User
              size={18}
              className="text-emerald-600"
            />


            <input

              type="text"
              placeholder="Enter your name"

              value={form.name}

              onChange={(e)=>
                setForm({
                  ...form,
                  name:e.target.value
                })
              }

              className="
                w-full
                outline-none
              "

            />


          </div>


        </div>





        {/* ADDRESS */}

        <div className="mb-4">

          <label className="text-sm text-gray-600">
            Address
          </label>


          <div className="
            mt-2
            flex
            items-center
            gap-3
            border
            rounded-xl
            p-3
          ">


            <MapPin
              size={18}
              className="text-emerald-600"
            />


            <input

              type="text"
              placeholder="Enter service address"

              value={form.address}

              onChange={(e)=>
                setForm({
                  ...form,
                  address:e.target.value
                })
              }

              className="
                w-full
                outline-none
              "

            />


          </div>


        </div>





        <div className="grid grid-cols-2 gap-4">


          {/* DATE */}

          <div>

            <label className="text-sm text-gray-600">
              Date
            </label>


            <div className="
              mt-2
              flex
              items-center
              gap-2
              border
              rounded-xl
              p-3
            ">


              <CalendarDays
                size={17}
                className="text-emerald-600"
              />


              <input

                type="date"

                value={form.date}

                onChange={(e)=>
                  setForm({
                    ...form,
                    date:e.target.value
                  })
                }

                className="
                  w-full
                  outline-none
                  text-sm
                "

              />


            </div>


          </div>





          {/* TIME */}

          <div>


            <label className="text-sm text-gray-600">
              Time
            </label>


            <div className="
              mt-2
              flex
              items-center
              gap-2
              border
              rounded-xl
              p-3
            ">


              <Clock
                size={17}
                className="text-emerald-600"
              />


              <input

                type="time"

                value={form.time}

                onChange={(e)=>
                  setForm({
                    ...form,
                    time:e.target.value
                  })
                }

                className="
                  w-full
                  outline-none
                  text-sm
                "

              />


            </div>


          </div>


        </div>





        {/* BUTTONS */}

        <div className="flex gap-3 mt-7">


          <button

            onClick={()=>router.back()}

            className="
              w-1/2
              py-3
              rounded-xl
              bg-gray-100
              hover:bg-gray-200
              text-gray-700
              font-semibold
            "

          >

            Cancel

          </button>





          <button

            onClick={handleConfirm}

            disabled={loading}

            className="
              w-1/2
              py-3
              rounded-xl
              bg-emerald-600
              hover:bg-emerald-500
              text-white
              font-semibold
              flex
              items-center
              justify-center
              gap-2
              transition
            "

          >

            <CheckCircle size={18}/>

            {loading ? "Booking..." : "Confirm"}

          </button>


        </div>


      </div>


    </div>

  );

}