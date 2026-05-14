"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const categories = [
  {
    title: "Sound & Audio",
    items: ["Smart Speaker", "Home Theatre", "Party Speakers", "Televisions"],
  },
  {
    title: "Digital Camera",
    items: ["Backup camera", "Smart Cameras", "IP camera", "Movie camera"],
  },
  {
    title: "Smart Watch",
    items: ["Digital Watches", "Basic Watches", "Feature watches", "Apple Watches"],
  },
];

export default function StickyCategoryNav() {
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={`w-full z-50 transition-all duration-500 ${
        show
          ? "fixed top-0 opacity-100 translate-y-0"
          : "fixed -top-20 opacity-0"
      }`}
    >
      <div className="bg-white/90 backdrop-blur-md  shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-3 flex items-center justify-between">

          {/* CATEGORY BUTTON */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 text-sm font-medium text-primary-blue"
            >
              Shop by Categories
              <FaChevronDown
                size={12}
                className={`transition ${open ? "rotate-180" : ""}`}
              />
            </button>

            {/* MEGA MENU */}
            <div
              className={`absolute left-0 md:left-0 mt-4 transition-all duration-300 z-50 ${
                open
                  ? "opacity-100 visible translate-y-0"
                  : "opacity-0 invisible translate-y-2"
              }`}
            >
              <div
                className="
                bg-white shadow-2xl rounded-2xl border
                w-[95vw] md:w-[600px] lg:w-[800px]
                p-4 md:p-6
              "
              >

              
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {categories.map((section, i) => (
                    <div key={i}>
                      <h3 className="font-semibold text-primary-blue mb-3">
                        {section.title}
                      </h3>

                      <ul className="space-y-2">
                        {section.items.map((item, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-500 hover:text-primary-blue cursor-pointer"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}

                </div>
              </div>
            </div>
          </div>

          {/* CENTER LINKS */}
          <div className="hidden md:flex gap-6 text-sm">
            <Link className="hover:text-primary-blue cursor-pointer text-primary-red font-semibold" href="/">Home</Link>
            <Link className="hover:text-primary-blue cursor-pointer text-primary-red  font-semibold" href="/products">Shop</Link>
            <p className="hover:text-primary-blue cursor-pointer text-primary-red  font-semibold">Collections</p>
            <p className="hover:text-primary-blue cursor-pointer text-primary-red  font-semibold">Deals</p>
          </div>

          {/* RIGHT BUTTON */}
          <div>
            <button className="bg-gradient-blue-red text-white px-4 py-2 rounded-full text-sm">
              Today’s Deal
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}