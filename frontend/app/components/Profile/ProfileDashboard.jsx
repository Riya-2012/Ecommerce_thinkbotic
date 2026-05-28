"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import {
  FaBoxOpen,
  FaUser,
  FaMapMarkerAlt,
  FaHeart,
  FaShoppingCart,
  FaCreditCard,
  FaSignOutAlt,
  FaCog,
  FaBars,
  FaTimes,
} from "react-icons/fa";

const links = [
  // {
  //   name: "Dashboard",
  //   href: "/user",
  //   icon: <FaUser />,
  // },
  {
    name: "My Orders",
    href: "/user/orders",
    icon: <FaBoxOpen />,
  },
  {
    name: "Profile Settings",
    href: "/user/setting",
    icon: <FaCog />,
  },
  {
    name: "Manage Address",
    href: "/user/manageAddress",
    icon: <FaMapMarkerAlt />,
  },
  {
    name: "Payments",
    href: "/user/payment",
    icon: <FaCreditCard />,
  },
  {
    name: "Wishlist",
    href: "/whishlist",
    icon: <FaHeart />,
  },
  {
    name: "Cart",
    href: "/cart",
    icon: <FaShoppingCart />,
  },
  {
    name: "Reviews and Rating",
    href: "/user/reviews",
    icon: <FaShoppingCart />,
  },
];

export default function ProfileDashboard() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);


  return (


    <>

      <button

        onClick={() =>
          setSidebarOpen(true)
        }

        className="lg:hidden fixed bottom-6 right-6 z-50 bg-gradient-blue-red text-white p-4 rounded-full shadow-xl"
      >
        <FaBars size={22} />

      </button>

      {
        sidebarOpen && (

          <div

            onClick={() =>
              setSidebarOpen(false)
            }

            className="fixed inset-0 bg-black/40 z-40 lg:hidden" />
        )
      }

      <div

  className={`

fixed lg:sticky

lg:self-start

top-0 left-0

z-50 lg:z-10

h-screen lg:h-fit

overflow-y-auto

w-[280px] lg:w-[260px]

bg-[#f8fafc]

transition-transform duration-300

${
sidebarOpen

? "translate-x-0"

: "-translate-x-full lg:translate-x-0"
}
`}
      >



        {/* SIDEBAR */}
        <div className="  sticky top-0">
          <div className="flex justify-end lg:hidden p-4">

            <button

              onClick={() =>
                setSidebarOpen(false)
              }

              className="text-2xl font-bold"
            >
              <FaTimes />

            </button>

          </div>
          {/* USER CARD */}
          <Link href="/user/setting">
            <div className="bg-white  shadow-sm border border-gray-100 p-5">

              <div className="flex items-center gap-4">

                {/* PROFILE IMAGE */}
                <div className="w-14 h-14 rounded-full bg-gradient-blue-red p-[2px] shrink-0">

                  <div className="w-full h-full rounded-full bg-gradient-blue-red flex items-center justify-center">

                    <span className="text-xl font-bold text-white">
                      {user?.username?.charAt(0).toUpperCase()}
                    </span>

                  </div>

                </div>


                <div className="text-left">

                  <p className="text-sm text-gray-500 font-medium">
                    Hello,
                  </p>

                  <h2 className="text-lg font-bold text-[#0f172a] leading-tight">
                    {user?.username}
                  </h2>

                </div>

              </div>

            </div>
          </Link>


          <div className="mt-6 p-4 bg-white shadow-sm flex flex-col gap-2">

            {links.map((link, index) => {

              const isActive = pathname === link.href;

              return (
                <Link
                  key={index}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 group
                  
                  ${isActive
                      ? "bg-gradient-blue-red text-white shadow-md"
                      : "text-gray-600 hover:bg-primary-blue/10 hover:text-primary-blue"
                    }
                `}
                >

                  <span
                    className={`text-lg ${isActive
                      ? "text-white"
                      : "text-primary-blue"
                      }`}
                  >
                    {link.icon}
                  </span>

                  <span>
                    {link.name}
                  </span>

                </Link>
              );
            })}

            <button
              onClick={logout}

              className="   mt-6 flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-gradient-blue-red text-white font-semibold hover:bg-red-50 transition">

              <FaSignOutAlt />

              Logout

            </button>

          </div>


          {/* LOGOUT */}


        </div>

      </div>
    </>
  );
}