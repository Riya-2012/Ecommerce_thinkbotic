"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import api, {
  BASE_URL,
} from "@/app/lib/axios";

import Link from "next/link";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Banner() {

const [banners,setBanners]=useState([]);

useEffect(()=>{
  const fetchBanner= async ()=>{
    try{
const res= await api.get("/api/admin/banner");
console.log("banners",res.data.data);
setBanners(res.data.data || [])
    }
    catch(error){
console.log(error);
    }
  }

  fetchBanner()

},[])

const mainBanner =
  banners.filter(
    (item) =>
      item.type === "main"
  );

const sideBanners =
  banners.filter(
    (item) =>
      item.type === "side"
  );

  console.log("banners title",mainBanner?.title);
  return (
    <div className="w-full bg-[#f8fafc] py-8 px-4 lg:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* LEFT BIG BANNER */}
  {/* LEFT BIG BANNER */}

<div className="lg:col-span-2">

  <Swiper
    modules={[
      Autoplay,
      Pagination,
    ]}
    autoplay={{
      delay: 2000,
      disableOnInteraction: false,
    }}
    pagination={{
      clickable: true,
    }}
    loop={true}
    className="rounded-3xl overflow-hidden"
  >

    {mainBanner.map(
      (mainBanner) => (

        <SwiperSlide
          key={mainBanner._id}
        >

          <div className="min-h-[420px] bg-white rounded-3xl flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-10 py-6 relative overflow-hidden shadow-sm">

            {/* TEXT */}

            <div className="max-w-lg text-center md:text-left z-10">

              <p className="text-sm text-primary-red font-medium mb-2">

                {
                  mainBanner?.priceText
                }

              </p>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight">

                {mainBanner?.title}

                <br />

                <span className="text-primary-blue">

                  {
                    mainBanner?.subtitle
                  }

                </span>

              </h1>

              <p className="text-gray-500 mt-4 text-sm">

                {
                  mainBanner?.description
                }

              </p>

              <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">

                <Link
                  href={
                    mainBanner?.buttonLink ||

                    "/products"
                  }
                >

                  <button className="bg-gradient-blue-red text-white px-6 py-3 rounded-full font-medium shadow-md hover:scale-105 transition duration-300">

                    {
                      mainBanner?.buttonText ||

                      "Shop Now"
                    }

                  </button>

                </Link>

              </div>

            </div>

            {/* IMAGE */}

            <div className="relative w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] mt-6 md:mt-0 z-10">

              {mainBanner?.img && (

                <Image
                  src={`${BASE_URL}/uploads/${mainBanner.img}`}
                  alt="banner"
                  fill
                  priority
                  unoptimized
                  className="object-contain"
                />

              )}

            </div>

            {/* GLOW */}

            <div className="absolute right-[-80px] bottom-[-80px] w-[300px] h-[300px] bg-primary-blue/10 rounded-full blur-3xl"></div>

          </div>

        </SwiperSlide>

      )
    )}

  </Swiper>

</div>

        {/* RIGHT SIDE */}
     <div className="min-h-[420px] md:min-h-[300px] flex flex-col md:flex-row lg:flex-col gap-6">

  {sideBanners
    .slice(0, 2)
    .map((banner) => (

      <div
        key={banner._id}
        className="relative flex-1 rounded-3xl overflow-hidden"
      >

        {banner.img && (

          <Image
            src={`${BASE_URL}/uploads/${banner.img}`}
            alt={banner.title}
            fill
            unoptimized
            className="object-cover"
          />

        )}

        <div className="absolute inset-0 bg-black/40"></div>

        <div className="absolute bottom-6 left-6 text-white">

          <p className="text-xs opacity-80">

            {banner.subtitle}

          </p>

          <h2 className="text-lg sm:text-xl font-semibold">

            {banner.title}

          </h2>

          <p className="text-sm mt-1">

            {banner.priceText}

          </p>

          <Link
            href={
              banner.buttonLink ||
              "/products"
            }
          >

            <button className="mt-3 bg-white text-primary-blue px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-blue hover:text-white transition">

              {banner.buttonText ||
                "Shop Now"}

            </button>

          </Link>

        </div>

      </div>

    ))}

</div>
      </div>
    </div>
  );
}