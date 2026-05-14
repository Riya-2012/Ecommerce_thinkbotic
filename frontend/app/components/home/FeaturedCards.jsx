"use client";

import Image from "next/image";
import { FaArrowRight } from "react-icons/fa";

const collections = [
  {
    title: "Smart Gadgets",
    image: "/product-1.jpg",
  },
  {
    title: "Audio Essentials",
    image: "/product-2.jpg",
  },
  {
    title: "Fitness & Wearables",
    image: "/product-1.jpg",
  },
];

export default function CollectionsSection() {
  return (
    <div className="px-10 py-14 bg-white">

      <div className="max-w-[1400px] mx-auto">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div>
         <div className="flex items-center gap-2 mb-1">
      <span className="w-2 h-2 bg-primary-red rounded-full"></span>
      <p className="text-xs font-medium text-primary-red uppercase tracking-wider">
        Explore
      </p>
    </div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0f172a]">
              Shop by Collections
            </h2>
          </div>

          <div className="flex justify-center items-center gap-1 text-primary-blue hover:underline cursor-pointer">
                    <button className="text-md font-bold text-primary-blue hover:underline">
                    View All 
                      </button>
                      <FaArrowRight />
                  </div>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {collections.map((item, i) => (
            <div
              key={i}
              className="relative h-[220px] rounded-3xl overflow-hidden group cursor-pointer"
            >

        
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover group-hover:scale-110 transition duration-500"
              />

              
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition"></div>

            
              <div className="absolute bottom-5 left-5 text-white">
                <h3 className="text-lg font-semibold">
                  {item.title}
                </h3>
                <p className="text-sm  opacity-80">Shop Now →</p>
              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  );
}