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
} from "react-icons/fa";


const links = [

  {
    name: "Dashboard",
    href: "/admin",
    icon: <FaUser />,
  },

  {
    name: "User",
    href: "/admin/user",
    icon: <FaUser />,
  },

  {
    name: "Cart",
    href: "/admin/cart",
    icon: <FaShoppingCart />,
  },

  {
    name: "Logo",
    href: "/admin/logo",
    icon: <FaMapMarkerAlt />,
  },

  {
    name: "Products",
    href: "/admin/products",
    icon: <FaCreditCard />,
  },

  {
    name: "Footer",
    href: "/admin/footer",
    icon: <FaMapMarkerAlt />,
  },

  {
    name: "Category",
    href: "/admin/category",
    icon: <FaHeart />,
  },

  {
    name: "Banner",
    href: "/admin/banner",
    icon: <FaShoppingCart />,
  },

  {
    name: "Stock",
    href: "/admin/stock",
    icon: <FaShoppingCart />,
  },

  // SETTINGS DROPDOWN

  {
    name: "Settings",

    icon: <FaCog />,

    children: [

      {
        name: "Cart Notification",
        href: "/admin/setting/cartNotification",
      },

      {
        name: "Admin QnA",
        href: "/admin/setting/question",
      },

      {
        name: "Admin Inquiry",
        href: "/admin/setting/enquiry",
      },

      {
        name: "Contact Queries",
        href: "/admin/setting/queries",
      },

      {
        name: "Recent Orders",
        href: "/admin/setting/recentOrders",
      },
    ],
  },
];


export default function AdminSidebar({ closeSidebar }) {
  const pathname = usePathname();
  const {user, logout}=useAuth();
  const [openSetting,
setOpenSetting] =
useState(false);


  return (
    <div className="w-full h-full min-h-screen bg-white lg:bg-transparent border-r border-gray-100 lg:border-none">

      {/* SIDEBAR */}
      <div className="sticky top-0">

        {/* USER CARD */}
        
  <Link href="/user/setting" onClick={() => { if(closeSidebar) closeSidebar(); }}>
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

    // SETTINGS DROPDOWN

    if (link.children) {

      return (

        <div key={index}>

          {/* PARENT BUTTON */}

          <button

            onClick={() =>
              setOpenSetting(!openSetting)
            }

            className="w-full flex items-center justify-between px-4 py-2 rounded-xl font-medium text-gray-600 hover:bg-primary-blue/10 hover:text-primary-blue transition-all duration-300"
          >

            <div className="flex items-center gap-3">

              <span className="text-lg text-primary-blue">

                {link.icon}

              </span>

              <span>

                {link.name}

              </span>

            </div>

            <span className="text-sm font-bold">

              {openSetting ? "-" : "+"}

            </span>

          </button>

          {/* CHILDREN */}

          {openSetting && (

            <div className="ml-6 mt-2 flex flex-col gap-2">

              {link.children.map((child, childIndex) => {

                const isChildActive =
                  pathname === child.href;

                return (

                  <Link

                    key={childIndex}

                    href={child.href}

                    onClick={() => {
                      if (closeSidebar)
                        closeSidebar();
                    }}

                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300

                    ${
                      isChildActive

                        ? "bg-gradient-blue-red text-white shadow-sm"

                        : "text-gray-600 hover:bg-primary-blue/10 hover:text-primary-blue"
                    }
                    `}
                  >

                    {child.name}

                  </Link>
                );
              })}

            </div>
          )}

        </div>
      );
    }

    // NORMAL LINKS

    const isActive =
      pathname === link.href;

    return (

      <Link

        key={index}

        href={link.href}

        onClick={() => {
          if (closeSidebar)
            closeSidebar();
        }}

        className={`flex items-center gap-3 px-4 py-2 rounded-xl font-medium transition-all duration-300 group

        ${
          isActive

            ? "bg-gradient-blue-red text-white shadow-md"

            : "text-gray-600 hover:bg-primary-blue/10 hover:text-primary-blue"
        }
        `}
      >

        <span

          className={`text-lg

          ${
            isActive

              ? "text-white"

              : "text-primary-blue"
          }
          `}
        >

          {link.icon}

        </span>

        <span>

          {link.name}

        </span>

      </Link>
    );
  })}

  {/* LOGOUT */}

  <button

    onClick={() => {

      logout();

      if (closeSidebar)
        closeSidebar();
    }}

    className="mt-6 flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-gradient-blue-red text-white font-semibold transition"
  >

    <FaSignOutAlt />

    Logout

  </button>

</div>




        {/* LOGOUT */}
    

      </div>
    </div>
  );
}