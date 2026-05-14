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
  <div className="flex flex-col gap-6 mt-6">

  {orders.map((order, index) => (

    <div
      key={index}
      className="bg-white border border-gray-200  overflow-hidden hover:shadow-md transition-all duration-300"
    >

      {/*  TOP */}
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50">

        {/* ORDER ID */}
        <div>

          <p className="text-xs text-gray-500 font-medium">
            Transaction ID
          </p>

          <h3 className="font-bold text-[#0f172a] mt-1">
            {order.id}
          </h3>

        </div>

        {/* STATUS */}
        <div className="flex items-center gap-3 flex-wrap">

          <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-600 text-xs font-bold">
            {order.payment}
          </span>

          <span className="px-4 py-1.5 rounded-full bg-primary-blue/10 text-primary-blue text-xs font-bold">
            {order.status}
          </span>

        </div>

      </div>

      {/*  BODY */}
      <div className="p-5 sm:p-6 flex flex-col xl:flex-row gap-6 xl:items-center xl:justify-between">

        {/* LEFT */}
        <div className="flex flex-col sm:flex-row gap-5">

          {/* IMAGE */}
          <div className="w-full sm:w-[140px] h-[140px] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">

            <Image
              src={order.image}
              width={200}
              height={200}
              alt={order.title}
              className="w-full h-full object-cover"
            />

          </div>

          {/* PRODUCT INFO */}
          <div>

            {/* CATEGORY */}
            <p className="text-sm text-primary-blue font-medium">
              {order.category}
            </p>

            {/* TITLE */}
            <h2 className="text-xl font-bold text-[#0f172a] mt-1">
              {order.title}
            </h2>

            {/* META */}
            <div className="flex flex-wrap gap-x-8 gap-y-4 mt-5">

              {/* QTY */}
              <div>

                <p className="text-xs text-gray-500">
                  Quantity
                </p>

                <h4 className="font-semibold mt-1">
                  {order.qty}
                </h4>

              </div>

              {/* PRICE */}
              <div>

                <p className="text-xs text-gray-500">
                  Amount Paid
                </p>

                <h4 className="font-bold mt-1 text-primary-red">
                  ₹{order.price}
                </h4>

              </div>

              {/* DATE */}
              <div>
                <p className="text-xs text-gray-500">
                  Transaction Date
                </p>

                <h4 className="font-semibold mt-1">
                  {order.date}
                </h4>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="flex flex-col sm:flex-row gap-3">

          {/* INVOICE */}
          {/* <button className="px-5 py-3 rounded-2xl border border-gray-200 font-semibold text-gray-700 hover:bg-gray-50 transition">

            Download Invoice

          </button> */}

          {/* DETAILS */}
      <Link href="/user/orders/1">
          <button className="px-5 py-2 rounded-xl bg-gradient-blue-red text-white font-semibold shadow-sm hover:shadow-md transition">
            View Details
          </button>
      </Link>

        </div>

      </div>

    </div>

  ))}

</div>
  );
}