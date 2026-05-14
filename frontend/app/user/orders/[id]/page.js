"use client";

import Image from "next/image";
import { FaStar } from "react-icons/fa";

export default function Page() {

  const order = {
    id: "#ORD10245",
    orderedOn: "12 May 2026",
    deliveredOn: "16 May 2026",

    product: {
      image: "/product-1.jpg",
      title: "Smart Watch Elite",
      category: "Electronics",
      qty: 1,
      color: "Black",
      size: "One Size",
      price: 2999,
    },

    shipping: {
      name: "Riya Sharma",
      mobile: "+91 9999999999",
      address:
        "Sector 45, Gurgaon, Haryana - 122001",
    },

    summary: {
      subtotal: 2999,
      shipping: 0,
      discount: 300,
      total: 2699,
      payment: "Paid via UPI",
    },
  };

  return (
    <div className="space-y-6">

      {/* GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/*  LEFT SIDE */}
        <div className="xl:col-span-2">

          <div className="bg-white  border border-gray-100 shadow-sm overflow-hidden">

            {/* TITLE */}
            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">

              <div>

                <h1 className="text-l font-bold text-[#0f172a]">
                  Order Details
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                  Order ID : {order.id}
                </p>

              </div>

              <span className="px-4 py-2 rounded-full bg-green-100 text-green-600 text-xs font-bold">
                Delivered
              </span>

            </div>

            {/* PRODUCT */}
            <div className="p-6 sm:p-8">

              <div className="flex flex-col lg:flex-row gap-6">

                {/* IMAGE */}
                <div className="w-full lg:w-[100px] h-[100px] rounded-sm overflow-hidden border border-gray-100 bg-gray-50 shrink-0">

                  <Image
                    src={order.product.image}
                    width={100}
                    height={100}
                    alt={order.product.title}
                    className="w-full h-full object-cover"
                  />

                </div>

                {/* INFO */}
                <div className="flex-1">

                  {/* CATEGORY */}
                  <p className="text-primary-blue font-medium text-sm">
                    {order.product.category}
                  </p>

                  {/* TITLE */}
                  <h2 className="text-xl font-bold text-[#0f172a] ">
                    {order.product.title}
                  </h2>

                  {/* PRICE */}
                  <h3 className="text-2xl font-bold text-primary-red ">
                    ₹{order.product.price}
                  </h3>

                  {/* DETAILS */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-2">

                    <div>

                      <p className="text-xs text-gray-500">
                        Quantity
                      </p>

                      <h4 className="font-semibold text-sm mt-1">
                        {order.product.qty}
                      </h4>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Color
                      </p>

                      <h4 className="font-semibold text-sm mt-1">
                        {order.product.color}
                      </h4>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Size
                      </p>

                      <h4 className="font-semibold text-sm  mt-1">
                        {order.product.size}
                      </h4>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">
                        Payment
                      </p>

                      <h4 className=" text-sm font-semibold mt-1">
                        Paid
                      </h4>

                    </div>

                  </div>

                  {/* ORDER DATES */}
                  {/* <div className="mt-8 flex flex-col sm:flex-row gap-4">

                 
                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-2xl p-4">

                      <p className="text-xs text-gray-500">
                        Ordered On
                      </p>

                      <h4 className="font-bold text-[#0f172a] mt-2">
                        {order.orderedOn}
                      </h4>

                    </div>

                  
                    <div className="flex-1 bg-green-50 border border-green-100 rounded-2xl p-4">

                      <p className="text-xs text-green-600">
                        Delivered On
                      </p>

                      <h4 className="font-bold text-green-700 mt-2">
                        {order.deliveredOn}
                      </h4>

                    </div>

                  </div> */}


                </div>
                

              </div>
    <div className="p-6">

  {/* TITLE */}
  {/* <h2 className="text-xl font-semibold text-[#0f172a] mb-8">
    Order Timeline
  </h2> */}

  {/* TIMELINE */}
  <div className="relative">

    {/* VERTICAL LINE */}
    <div className="absolute left-[8px] top-0 w-[2px] h-full bg-gray-200"></div>

    <div className="space-y-8">

      {/* STEP */}
      <div className="relative flex gap-5">

        {/* ICON */}
        <div className="relative z-10 w-4 h-4 rounded-full bg-gradient-blue-red text-white flex items-center justify-center shrink-0">

          

        </div>

        {/* CONTENT */}
        <div>

          <h3 className="font-bold text-[#0f172a]">
            Order Confirmed
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            11 April 2026
          </p>

        </div>

     

      </div>

      {/* STEP */}
      <div className="relative flex gap-5">

        <div className="relative z-10 w-4 h-4 rounded-full bg-gradient-blue-red text-white flex items-center justify-center shrink-0">

        </div>

        <div>

          <h3 className="font-bold text-[#0f172a]">
            Shipped

          </h3>

          <p className="text-sm text-gray-500 mt-1">
            12 April 2026
          </p>

        </div>

      </div>

      {/* STEP */}
      <div className="relative flex gap-5">

        <div className="relative z-10 w-4 h-4 rounded-full bg-gradient-blue-red text-white flex items-center justify-center shrink-0">
        </div>
        <div>
          <h3 className="font-bold text-[#0f172a]">
            Out For Delivery
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            14 April 2026
          </p>

        </div>

      </div>

      {/* STEP */}
      <div className="relative flex gap-5 ">

        <div className="relative z-10 w-4 h-4 rounded-full bg-gradient-blue-red flex items-center justify-center shrink-0">
        </div>
        <div>
          <h3 className="font-bold text-[#0f172a]">
            Delivered
          </h3>
          {/* <p className="text-sm text-gray-500 mt-1">
            Pending
          </p> */}
        </div>

      </div>


    </div>
    

  </div>
  <div className=" mt-6">

  {/* TITLE */}
  <div className="mb-6">

    <h2 className="text-2xl font-bold text-[#0f172a]">
      Write a Review
    </h2>

    <p className="text-sm text-gray-500 mt-1">
      Share your experience with this product
    </p>

  </div>

  {/* STARS */}
  <div className="flex items-center gap-2 text-3xl text-gray-300 mb-6 cursor-pointer">

    <FaStar className="hover:text-yellow-400 transition" />
    <FaStar className="hover:text-yellow-400 transition" />
    <FaStar className="hover:text-yellow-400 transition" />
    <FaStar className="hover:text-yellow-400 transition" />
    <FaStar className="hover:text-yellow-400 transition"   onClick={()=>( `className="text-yellow-400" `)}  />

  </div>

  {/* REVIEW INPUT */}
  <textarea
    rows={4}
    placeholder="Write your review here..."
    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 outline-none resize-none transition focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 focus:bg-white"
  ></textarea>

  {/* BUTTON */}
  <div className="mt-6 flex justify-end">

    <button className="px-6 py-2 bg-gradient-blue-red text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition">

      Submit Review

    </button>

  </div>

</div>
      

</div>

            </div>

          </div>

        </div>

        {/*  RIGHT SIDE */}
        <div className="space-y-6">
          <div className=" bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary-blue mb-2">
              Delivery Address
            </h2>
            <div className="space-y-1">
              <h3 className="font-semibold text-lg text-[#0f172a]">
                {order.shipping.name}
              </h3> 
              <p className="text-gray-600">
                {order.shipping.mobile}
              </p>
              <p className="text-gray-600 leading-relaxed">
                {order.shipping.address}
              </p>
            </div>
          </div>

        
          <div className="bg-white border border-gray-100 shadow-sm p-6">

            <h2 className="text-xl font-bold text-primary-red mb-6">
              Order Summary
            </h2>

            <div className="space-y-5">
             
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span>
                  ₹{order.summary.subtotal}
                </span>

              </div>

          
              <div className="flex justify-between text-gray-600">

                <span>Shipping</span>

                <span>
                  {order.summary.shipping === 0
                    ? "Free"
                    : `₹${order.summary.shipping}`}
                </span>

              </div>
              <div className="flex justify-between text-green-600">

                <span>Discount</span>

                <span>
                  - ₹{order.summary.discount}
                </span>

              </div>

             
              <div className="flex justify-between text-gray-600">

                <span>Payment</span>

                <span>
                  {order.summary.payment}
                </span>

              </div>

            
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">

                <span className="text-xl font-semibold text-[#0f172a]">
                  Total
                </span>

                <span className="text-xl font-semibold text-primary-red">
                  ₹{order.summary.total}
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}