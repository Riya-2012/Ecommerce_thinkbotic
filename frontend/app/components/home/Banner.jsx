"use client";

import Image from "next/image";

export default function Banner() {
  return (
    <div className="w-full bg-[#f8fafc] py-8 px-4 lg:px-10">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

        {/* LEFT BIG BANNER */}
        <div className="lg:col-span-2 min-h-[420px] bg-white rounded-3xl flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-10 py-6 relative overflow-hidden shadow-sm">

          {/* TEXT */}
          <div className="max-w-lg text-center md:text-left">
            <p className="text-sm text-primary-red font-medium mb-2">
              Up to 50% discount
            </p>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#0f172a] leading-tight">
              Smart Watch <br />
              <span className="text-primary-blue">
                Next Generation
              </span>
            </h1>

            <p className="text-gray-500 mt-4 text-sm">
              Track fitness, calls, and style — all in one powerful device.
            </p>

            <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">

              <button className="bg-gradient-blue-red text-white px-6 py-3 rounded-full font-medium shadow-md hover:scale-105 transition duration-300">
                Shop Now
              </button>

              <button className="border border-primary-red text-primary-red px-6 py-3 rounded-full text-sm hover:bg-primary-red hover:text-white transition">
                Explore
              </button>

            </div>
          </div>

          {/* IMAGE */}
          <div className="relative w-[200px] h-[200px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] mt-6 md:mt-0">
            <Image
              src="/ban1.webp"
              alt="product"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-contain"
            />
          </div>

          {/* BACKGROUND GLOW */}
          <div className="absolute right-[-80px] bottom-[-80px] w-[300px] h-[300px] bg-primary-blue/10 rounded-full blur-3xl"></div>
        </div>

        {/* RIGHT SIDE */}
        <div className="min-h-[420px] md:min-h-[300px]  flex flex-col md:flex-row lg:flex-col gap-6">

          {/* TOP CARD */}
          <div className="relative flex-1 rounded-3xl overflow-hidden">
            <Image
              src="/product-2.jpg"
              alt="headphone"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs opacity-80">Weekend Deal</p>

              <h2 className="text-lg sm:text-xl font-semibold">
                Premium Headphones
              </h2>

              <p className="text-sm mt-1">Starting ₹999</p>

              <button className="mt-3 bg-white text-primary-blue px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-blue hover:text-white transition">
                Shop Now
              </button>
            </div>
          </div>

          {/* BOTTOM CARD */}
          {/* <div className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer">

            <div className="absolute inset-0 bg-gradient-to-r from-primary-blue/10 to-primary-red/10"></div>

            <div className="absolute inset-0 bg-primary-blue/10 opacity-0 group-hover:opacity-100 transition"></div>

            <div className="relative z-10 p-4 sm:p-6 flex items-center justify-between h-full">

              <div>
                <p className="text-xs text-primary-blue font-medium">
                  Hot Deal
                </p>

                <h3 className="text-base sm:text-lg font-semibold text-[#0f172a] mt-1">
                  VR Headset
                </h3>

                <p className="text-primary-blue font-bold mt-2 text-base sm:text-lg">
                  ₹1499
                </p>

                <button className="mt-3 text-xs sm:text-sm text-white bg-gradient-blue-red px-4 py-2 rounded-full hover:opacity-90 transition">
                  Shop Now
                </button>
              </div>

              <div className="relative w-[90px] h-[90px] sm:w-[110px] sm:h-[110px] group-hover:scale-110 transition duration-500">
                <Image
                  src="/product-1.jpg"
                  alt="vr"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-contain drop-shadow-lg"
                />
              </div>

            </div>
          </div> */}
          <div className="relative flex-1 rounded-3xl overflow-hidden">
            <Image
              src="/product-1.jpg"
              alt="headphone"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />

            <div className="absolute inset-0 bg-black/40"></div>

            <div className="absolute bottom-6 left-6 text-white">
              <p className="text-xs opacity-80"> Hot Deal</p>

              <h2 className="text-lg sm:text-xl font-semibold">
             VR Headset
              </h2>

              <p className="text-sm mt-1">Starting ₹999</p>

              <button className="mt-3 bg-white text-primary-blue px-4 py-2 rounded-full text-sm font-medium hover:bg-primary-blue hover:text-white transition">
                Shop Now
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}