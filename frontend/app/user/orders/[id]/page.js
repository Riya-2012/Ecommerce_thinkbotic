"use client";

import { useAuth } from "@/app/context/AuthContext";
import api, { BASE_URL } from "@/app/lib/axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import {useParams} from "next/navigation";
export default function Page() {
const params =
useParams();

const orderId =
params.id;

  const { user } =
    useAuth();

  const [order,
    setOrder] =
    useState(null);

  const [loading,
    setLoading] =
    useState(true);

useEffect(() => {

  const fetchOrder =
    async () => {

      try {

        const res =
          await api.get(

`/api/user/order/${orderId}`
          );

        setOrder(
          res.data
        );
console.log("oders data",order)
      } catch (err) {

        console.log(err);

      } finally {

        setLoading(false);
      }
    };

  if (
user &&
orderId
  ) {

    fetchOrder();
  }

}, [

  user,

  orderId,
]);

  const item =
    order?.items?.[0];
console.log("oders data",order)
  if (loading) {

    return (

      <div className="p-10 text-center text-lg font-semibold">

        Loading...

      </div>
    );
  }

  if (!order || !item) {

    return (

      <div className="p-10 text-center text-lg font-semibold">

        No Order Found

      </div>
    );
  }

  return (

    <div className="space-y-6">

      {/* GRID */}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}

        <div className="xl:col-span-2">

          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">

            {/* HEADER */}

            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">

              <div>

                <h1 className="text-lg font-bold text-[#0f172a]">

                  Order Details

                </h1>

                <p className="text-sm text-gray-500 mt-1">

                  Order ID :
                  {" "}
                  {order?._id}

                </p>

              </div>

              <span className="px-4 py-2 rounded-full bg-green-100 text-green-600 text-xs font-bold">

                {
                  order?.payment?.status ||
                  "PAID"
                }

              </span>

            </div>

            {/* PRODUCT */}

            <div className="p-6 sm:p-8">

              <div className="flex flex-col lg:flex-row gap-6">

                {/* IMAGE */}

                <div className="w-full lg:w-[120px] h-[120px] rounded-sm overflow-hidden border border-gray-100 bg-gray-50 shrink-0">

                  <Image
                  unoptimized

                    src={

item?.img

? `${BASE_URL}/${item.img}`

: item?.productId?.img

? `${BASE_URL}/${item.productId.img}`

: "/no-image.png"
                    }

                    width={120}

                    height={120}

                    alt={

item?.title ||

item?.productId?.name ||

"Product"
                    }

                    className="w-full h-full object-cover"
                  />

                </div>

                {/* DETAILS */}

                <div className="flex-1">

                  <p className="text-primary-blue font-medium text-sm">

                    {

item?.category ||

item?.productId?.category ||

"N/A"
                    }

                  </p>

                  <h2 className="text-xl font-bold text-[#0f172a] mt-1">

                    {

item?.title ||

item?.productId?.name ||

"Product"
                    }

                  </h2>

                  <h3 className="text-2xl font-bold text-primary-red mt-2">

                    ₹
                    {item?.price}

                  </h3>

                  {/* INFO */}

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-5">

                    <div>

                      <p className="text-xs text-gray-500">

                        Quantity

                      </p>

                      <h4 className="font-semibold text-sm mt-1">

                        {item?.quantity}

                      </h4>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">

                        Color

                      </p>

                      <h4 className="font-semibold text-sm mt-1">

                        {
                          item?.imageColor ||
                          "N/A"
                        }

                      </h4>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">

                        Payment

                      </p>

                      <h4 className="font-semibold text-sm mt-1">

                        {
                          order?.payment?.status ||
                          "PAID"
                        }

                      </h4>

                    </div>

                    <div>

                      <p className="text-xs text-gray-500">

                        Ordered On

                      </p>

                      <h4 className="font-semibold text-sm mt-1">

                        {

new Date(
order?.createdAt
).toLocaleDateString()
                        }

                      </h4>

                    </div>

                  </div>

                </div>

              </div>

              {/* REVIEW */}

              <div className="mt-8 border-t border-gray-200 pt-8">

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
            {

new Date(
order?.createdAt
).toLocaleDateString()
                        }

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

                <div className="my-6">

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
                  <FaStar className="hover:text-yellow-400 transition" />

                </div>

                {/* REVIEW BOX */}

                <textarea

                  rows={4}

                  placeholder="Write your review here..."

                  className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 outline-none resize-none transition focus:border-primary-blue focus:ring-4 focus:ring-primary-blue/10 focus:bg-white"
                />

                <div className="mt-6 flex justify-end">

                  <button className="px-6 py-2 bg-gradient-blue-red text-white rounded-xl font-semibold shadow-sm hover:shadow-md transition">

                    Submit Review

                  </button>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="space-y-4">

          {/* ADDRESS */}

          <div className="bg-white border border-gray-100 shadow-sm p-6">

            <h2 className="text-lg font-bold text-primary-blue ">

              Shipping Address

            </h2>

            <div className="space-y-2">

              <h3 className="font-semibold text-lg text-[#0f172a]">

                {
                  order?.shippingAddress?.fullName
                }

              </h3>

              <p className="text-gray-600">

             Phone Number :   {
                  order?.shippingAddress?.mobile
                }

              </p>

              <p className="text-gray-600 leading-relaxed">

                {
                  order?.shippingAddress?.address
                },

                {" "}

                {
                  order?.shippingAddress?.city
                },

                {" "}

                {
                  order?.shippingAddress?.state
                }

              </p>

            </div>

          </div>

             <div className="bg-white border border-gray-100 shadow-sm p-6">

            <h2 className="text-lg font-bold text-primary-blue">

              Billing Address

            </h2>

            <div className="space-y-2">

              <h3 className="font-semibold text-lg text-[#0f172a]">

                {
                  order?.billingAddress?.fullName
                }

              </h3>

              <p className="text-gray-600">

           Phone number :     {
                  order?.billingAddress?.mobile
                }

              </p>

              <p className="text-gray-600 leading-relaxed">

                {
                  order?.billingAddress?.address
                },

                {" "}

                {
                  order?.billingAddress?.city
                },

                {" "}

                {
                  order?.billingAddress?.state
                }

              </p>

            </div>

          </div>

          {/* SUMMARY */}

          <div className="bg-white border border-gray-100 shadow-sm p-6">

            <h2 className="text-xl font-bold text-primary-red mb-6">

              Order Summary

            </h2>

            <div className="space-y-5">

              {/* <div className="flex justify-between text-gray-600">

                <span>Subtotal</span>

                <span>

                  ₹
                  {
                    order?.orderSummary?.total
                  }

                </span>

              </div> */}

              {/* <div className="flex justify-between text-gray-600">

                <span>Shipping</span>

                <span>

                  ₹
                  {
                    order?.orderSummary?.shipping
                  }

                </span>

              </div> */}

              {/* <div className="flex justify-between text-green-600">

                <span>Discount</span>

                <span>

                  - ₹
                  {
                    order?.pricingDetails?.discount
                  }

                </span>

              </div> */}

              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">

                <span className="text-xl font-semibold text-[#0f172a]">

                  Total

                </span>

                <span className="text-xl font-semibold text-primary-red">

                  ₹
                  {
                    order?.orderSummary?.total
                  }

                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}