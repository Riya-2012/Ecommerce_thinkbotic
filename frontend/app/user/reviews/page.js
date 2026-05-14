"use client";

import Image from "next/image";
import { useState } from "react";

import {
  FaStar,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const reviews = [
  {
    id: 1,
    image: "/product-1.jpg",
    title: "Smart Watch Elite",
    category: "Electronics",
    rating: 5,
    review:
      "Amazing quality and battery backup. Totally worth the price.",
    date: "12 May 2026",
  },
  {
    id: 2,
    image: "/product-2.jpg",
    title: "Wireless Headphones",
    category: "Audio",
    rating: 4,
    review:
      "Sound quality is really good and delivery was fast.",
    date: "18 May 2026",
  },
];
// const [edit,setEdit]=useState(" ");
export default function Page() {
const handleEdit =()=>{

}
  return (
    <div className="space-y-8">

      {/*  HEADER */}
      {/* <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 sm:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a]">
          My Reviews
        </h1>

        <p className="text-gray-500 mt-2">
          Reviews you've shared for purchased products.
        </p>

      </div> */}

      {/*  REVIEW LIST */}
      <div className="flex flex-col gap-6 mt-6">

        {reviews.map((item) => (

          <div
            key={item.id}
            className="bg-white border border-gray-200  shadow-sm overflow-hidden hover:shadow-md transition-all duration-300"
          >

            <div className="p-5 sm:p-6 flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">

              {/*  LEFT SIDE */}
              <div className="flex flex-col sm:flex-row gap-5 flex-1">

                {/* PRODUCT IMAGE */}
                <div className="w-full sm:w-[100px] h-[100px] overflow-hidden border border-gray-100 bg-gray-50 shrink-0">

                  <Image
                    src={item.image}
                    width={300}
                    height={300}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />

                </div>

                {/* INFO */}
                <div className="flex-1">

                  {/* CATEGORY */}
                  <p className="text-xs text-primary-blue font-medium">
                    {item.category}
                  </p>

                  {/* TITLE */}
                  <h2 className="text-xl font-bold text-[#0f172a] ">
                    {item.title}
                  </h2>
                  
                  {/* DATE */}
                  <p className="text-sm text-gray-500 ">
                    Reviewed on {item.date}
                  </p>

                  {/* STARS */}
                  <div className="flex items-center gap-1 text-yellow-400 mt-1">

                    {[...Array(item.rating)].map((_, i) => (
                      <FaStar key={i} />
                    ))}

                  </div>

                  {/* REVIEW */}
                  <div className="mt-2 bg-gray-50 border border-gray-100 rounded-xl p-2">
                    <p className="text-gray-600 leading-relaxed">
                      {item.review}
                    </p>
                  </div>


                </div>

              </div>

              {/*  ACTION BUTTONS */}
              <div className="flex flex-row lg:flex-col gap-3">

                {/* EDIT */}
                <button className="flex items-center justify-center gap-2 px-2 py-2 rounded-xl bg-primary-blue/10 text-primary-blue font-semibold hover:bg-primary-blue hover:text-white transition" >
                <FaEdit /> Edit 
                </button>

                {/* DELETE */}
                <button className="flex items-center justify-center gap-2 px-2 py-2 rounded-xl bg-red-50 text-red-500 font-semibold hover:bg-red-500 hover:text-white transition">
                  <FaTrash />
                  Delete
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}