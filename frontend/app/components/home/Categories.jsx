"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import Link from "next/link";
import "swiper/css";
import "swiper/css/navigation";
import api, { BASE_URL } from "@/app/lib/axios";



export default function CategoryProducts() {
const [allProducts,setAllProducts]=useState([]);
// const [category,setCategory]=useState();
// const groupedProducts = allProducts.reduce(

//   (acc, product) => {

//     const category = product.category;

//     if (!acc[category]) {

//       acc[category] = [];
//     }

//     acc[category].push(product);

//     return acc;

//   },

//   {}

// );
  const fetchProducts = async () => {
    
    try{
      const res= await api.get("api/comman/categories")
      console.log(res.data.data || []);

   setAllProducts(res.data.data || []);
  




    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
console.log("all products",allProducts);
  useEffect(() => {
    fetchProducts();
  }, []);


const [active, setActive] =
useState("");

  return (
    <div className="w-full py-12 px-4 lg:px-10 bg-white">

      <div className="max-w-[1400px] mx-auto">

      
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

          <h2 className="text-2xl font-bold text-[#0f172a]">
            Shop by Categories
          </h2>

          {/* TABS */}
          {/* <div className="flex gap-6 mt-4 md:mt-0">
            {Object.keys(groupedProducts).map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={` relative text-sm font-medium pb-1 transition ${
                  active === cat
                    ? "text-primary-blue b "
                    : "text-gray-500 hover:text-primary-red"
                }`}
              >
                {cat}
                  {active === cat && (
    <span className="absolute left-0 bottom-0 w-full h-[2px]  bg-gradient-blue-red rounded-full"></span>
  )}
              </button>
            ))}
          </div> */}
        </div>

  <Swiper
  modules={[Navigation]}
  navigation
  spaceBetween={20}
  grabCursor={true}
  breakpoints={{
        320: { slidesPerView: 3 },
    640: { slidesPerView: 2 },
    768: { slidesPerView: 3 },
    1024: { slidesPerView: 6 }, 
  }}
>
  {allProducts.map((item, i) => (
    <SwiperSlide key={i} className="mb-4 h-auto">
      <Link href={`/products?category=${item.category}`} className="block h-full">
        <div className="bg-[#f8fafc] shadow-sm rounded-2xl p-3 sm:p-4 hover:shadow-md transition group cursor-pointer h-full flex flex-col justify-between text-center items-center">
          <div className="relative w-full h-[80px] sm:h-[100px] md:h-[120px] mb-3 shrink-0">
            <Image
              unoptimized
              src={`${BASE_URL}/${item.img}`}
              alt={item.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain group-hover:scale-110 transition"
            />
          </div>
          <h3 className="font-semibold text-xs sm:text-sm text-[#0f172a] line-clamp-2 w-full">
            {item.category}
          </h3>
        </div>
      </Link>
    </SwiperSlide>
  ))}
</Swiper>
      </div>
    </div>
  );
}