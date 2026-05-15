"use client";

import { useAuth } from "@/app/context/AuthContext";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const {user, logout}=useAuth();

  return (
    <div className="w-full lg:w-[300px]">

      {/* SIDEBAR */}
      <div className="  sticky top-0">

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
                  
                  ${
                    isActive
                      ? "bg-gradient-blue-red text-white shadow-md"
                      : "text-gray-600 hover:bg-primary-blue/10 hover:text-primary-blue"
                  }
                `}
              >

                <span
                  className={`text-lg ${
                    isActive
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
      onClick={logout }
    
      className="   mt-6 flex items-center justify-center gap-3 px-4 py-3 rounded-2xl bg-gradient-blue-red text-white font-semibold hover:bg-red-50 transition">

          <FaSignOutAlt />

          Logout

        </button>

        </div>


        {/* LOGOUT */}
    

      </div>
    </div>
  );
}