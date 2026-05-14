"use client";

import Image from "next/image";
import Link from "next/link";

import {
  FaBoxOpen,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaSearch,
} from "react-icons/fa";

const orders = [
  {
    id: "#ORD10245",
    image: "/product-1.jpg",
    title: "Smart Watch Elite",
    category: "Electronics",
    price: 2999,
    qty: 1,
    status: "Delivered",
    payment: "Paid",
    date: "12 May 2026",
  },
  {
    id: "#ORD10246",
    image: "/product-2.jpg",
    title: "Wireless Headphones",
    category: "Audio",
    price: 1999,
    qty: 2,
    status: "Shipped",
    payment: "Paid",
    date: "15 May 2026",
  },
  {
    id: "#ORD10247",
    image: "/product-3.jpg",
    title: "Running Shoes",
    category: "Fashion",
    price: 2499,
    qty: 1,
    status: "Processing",
    payment: "COD",
    date: "18 May 2026",
  },
];

export default function Page() {

  return (
    <div className="space-y-8">

      <div className="flex flex-col gap-6 mt-6">

        {orders.map((order, index) => (

          <div
            key={index}
            className=" shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
          >
            <div className="p-2 flex flex-col xl:flex-row gap-6 xl:items-center xl:justify-between">


              <div className="flex flex-col sm:flex-row gap-5">

                <div className="w-full sm:w-[130px] h-[120px]  overflow-hidden border border-gray-100 bg-gray-50 shrink-0">

                  <Image
                    src={order.image}
                    width={100}
                    height={100}
                    alt={order.title}
                    className="w-full h-full object-cover"
                  />

                </div>

                <div>

                  <p className="text-sm text-primary-blue font-medium">

              {order.category}
                  </p>

                  <h2 className="text-l font-semibold text-[#0f172a]">
                    {order.title}
                  </h2>

                  <div className="flex flex-wrap gap-5 mt-2">

                    <div>
                      <p className="text-xs text-gray-500">
                        Quantity 
                      </p>

                      <h4 className="font-semibold mt-1 text-sm">
                        {order.qty}
                      </h4>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Price 
                      </p>

                      <h4 className="font-semibold text-sm mt-1 text-primary-red">
                        ₹{order.price}
                      </h4>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Delivered On
                      </p>

                      <h4 className="font-semibold mt-1 text-sm">
                        {order.date}
                      </h4>
                    </div>

                  </div>

                </div>

              </div>

              <div className="flex flex-col items-start  sm:items-end justify-between gap-4 h-full">

                {/* STATUS */}
                <span
                  className={`px-4 py-1.5 rounded-full text-xs font-bold
    
                    ${order.status === "Delivered"
                      ? "bg-green-100 text-green-600"
                      : order.status === "Shipped"
                        ? "bg-primary-blue/10 text-primary-blue"
                        : "bg-orange-100 text-orange-500"
                    }
    `}
                >
                  {order.status}
                </span>

                {/* BUTTON */}
                <Link href={`/user/orders/${order.id}`}>

                  <button className="px-5 py-2.5 rounded-xl bg-gradient-blue-red text-white font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">

                    View Details

                  </button>

                </Link>

              </div>
            </div>

          </div>

        ))}

      </div>

    </div>
  );
}