"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import api, {
  BASE_URL,
} from "@/app/lib/axios";
import "swiper/css/effect-creative";

import Link from "next/link";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";
import "swiper/css/autoplay";
import {
  Autoplay,
  Pagination,
  EffectCreative,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function Banner() {

  const [banners, setBanners] = useState([]);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const res = await api.get(`/api/admin/banner`);
        console.log("banners", res.data.data);
        setBanners(res.data.data || [])
      }
      catch (error) {
        console.log(error);
      }
    }

    fetchBanner()

  }, [])

  const mainBanner =
    banners.filter(
      (item) =>
        item.type === "main"
    );

  const sideBanner1 =
    banners.filter(
      (item) =>
        item.type === "side1"
    );
  const sideBanner2 =
    banners.filter(
      (item) =>
        item.type === "side2"
    );
  console.log("banners title", mainBanner?.title);
  return (
    <div className="w-full bg-[#f8fafc] py-8 px-4 lg:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* LEFT BIG BANNER */}
        {/* LEFT BIG BANNER */}

        <div className="lg:col-span-2">

<Swiper
key={mainBanner.length}
  modules={[
    Autoplay,
    Pagination,
  ]}

  autoplay={{

    delay: 4000,

    disableOnInteraction: false,

    pauseOnMouseEnter: false,
  }}

  observer={true}

  observeParents={true}

  watchSlidesProgress={true}

  pagination={{
    clickable: true,
  }}

  speed={1200}

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
        <div className="min-h-[420px] md:min-h-[300px] flex flex-col md:flex-row lg:flex-col gap-6 overflow-hidden ">
          <Swiper
          key={`side2-${sideBanner2.length}`}
            modules={[
              Autoplay,
              Pagination,
              EffectCreative,
            ]}

            effect="creative"

          creativeEffect={{
  prev: {
    shadow: true,
    translate: ["100%", 0, 0],
  },

  next: {
    shadow: true,
    translate: ["-100%", 0, 0],
  },
}}

            autoplay={{
              delay: 4000,
              disableOnInteraction: false,

            }}
            pagination={{ clickable: true }}
            loop={true}
            className="rounded-3xl overflow-hidden w-full"
          >
            {sideBanner2

              .map((banner, index) => (
                <SwiperSlide
                  key={banner._id}
                  className="h-full"
                >
                  <div

                    //  className="side-banner-left relative flex-1 rounded-3xl min-h-[200px] overflow-hidden group cursor-pointer"
                    className={`relative flex-1 rounded-3xl min-h-[200px] overflow-hidden group cursor-pointer `}
                  >

                    {banner.img && (

                      <Image
                        src={`${BASE_URL}/uploads/${banner.img}`}
                        alt={banner.title}
                        fill
                        unoptimized
                        className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
                      />

                    )}

                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="absolute bottom-6 left-6 text-white">

                      <p className="text-xs opacity-80">

                        {banner.subtitle}

                      </p>
                      <h2 className="text-lg sm:text-xl font-semibold animate__animated animate__zoomIn animate__delay-1s">

                        {banner.title}

                      </h2>


                      <p className="text-sm mt-1 animate__animated animate__fadeInUp animate__delay-1s">

                        {banner.priceText}

                      </p>

                      <Link
                        href={
                          banner.buttonLink ||
                          "/products"
                        }
                      >

                        <button className="mt-3 bg-white text-primary-blue px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-blue hover:text-white hover:scale-105 transition-all duration-300 shadow-lg animate__animated animate__fadeInUp animate__delay-2s">

                          {banner.buttonText ||
                            "Shop Now"}

                        </button>

                      </Link>

                    </div>

                  </div>
                </SwiperSlide>
              ))}
          </Swiper>

          <Swiper
       key={`side1-${sideBanner1.length}`}
            modules={[
              Autoplay,
              Pagination,
              EffectCreative,
            ]}

            effect="creative"

           creativeEffect={{
  prev: {
    shadow: true,
    translate: ["-100%", 0, 0],
  },

  next: {
    shadow: true,
    translate: ["100%", 0, 0],
  },
}}
            autoplay={{
              delay: 4000,
              disableOnInteraction: false,
            }}

            pagination={{
              clickable: true,
            }}

            loop={true}

            className="rounded-3xl overflow-hidden w-full"
          >

            {sideBanner1

              .map((banner, index) => (
                <SwiperSlide
                  key={banner._id}
                  className="h-full"
                >
                  <div

                    //  className="side-banner-right relative flex-1 min-h-[200px] rounded-3xl overflow-hidden group cursor-pointer"
                    className={`relative flex-1 min-h-[200px] rounded-3xl overflow-hidden group cursor-pointer `}
                  >
                    {banner.img && (
                      <Image
                        src={`${BASE_URL}/uploads/${banner.img}`}
                        alt={banner.title}
                        fill
                        unoptimized
                        className="object-cover transition-all duration-700 group-hover:scale-105 group-hover:-rotate-2"
                      />

                    )}
                    <div className="absolute inset-0 bg-black/40"></div>

                    <div className="absolute bottom-6 left-6 text-white z-10">

                      <p className="text-xs opacity-80 animate__animated animate__fadeInUp">

                        {banner.subtitle}

                      </p>

                      <h2 className="text-lg sm:text-xl font-semibold animate__animated animate__zoomIn animate__delay-1s">

                        {banner.title}

                      </h2>

                      <p className="text-sm mt-1 animate__animated animate__fadeInUp animate__delay-1s">

                        {banner.priceText}

                      </p>
                      <Link
                        href={
                          banner.buttonLink ||
                          "/products"
                        }
                      >
                        <button className="mt-3 bg-white text-primary-blue px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-blue hover:text-white hover:scale-105 transition-all duration-300 shadow-lg animate__animated animate__fadeInUp animate__delay-2s">

                          {banner.buttonText || "Shop Now"}

                        </button>

                      </Link>

                    </div>

                  </div>
                </SwiperSlide>
              ))}

          </Swiper>
        </div>
      </div>
    </div>
  );
}