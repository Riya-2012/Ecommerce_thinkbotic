"use client";

import React,
{
  useEffect,
  useState,
} from "react";

import {
  useAuth
} from "@/app/context/AuthContext";

import api ,{BASE_URL} from "@/app/lib/axios";

import Image from "next/image";

import Link from "next/link";

export default function Page() {

  const { user } =
    useAuth();

  const [orders,
    setOrders] =
    useState([]);



  useEffect(() => {

    const fetchOrders =
      async () => {

        try {

          const res =
            await api.get(
              "/api/user/orders"
            );

          const data =
            res.data;
console.log("orders data",res.data);
          if (
            Array.isArray(data)
          ) {

            setOrders(data);

          } else {

            setOrders([]);
          }

        } catch (err) {

          setOrders([]);

          console.log(err);
        }
      };

    if (user) {

      fetchOrders();
    }

  }, [user]);
  

  return (

    <div className="space-y-8">

      <div className="flex flex-col gap-6 mt-6">

        {orders.length > 0 ? (

          orders.map((order) =>

            order.items.map(
              (item, index) => (

                <div

                  key={index}

                  className="shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition"
                >

                  <div className="p-2 flex flex-col xl:flex-row gap-6 xl:items-center xl:justify-between">

                    {/* LEFT */}

                    <div className="flex flex-col sm:flex-row gap-5">

                      {/* IMAGE */}

                      <div className="w-full sm:w-[140px] h-[120px] overflow-hidden border border-gray-100 bg-gray-50 shrink-0">

                        <Image
unoptimized
                          src={

                            item.img

                              ? `${BASE_URL}/${item.img}`

                              : item.productId?.img

                                ? `${BASE_URL}/${item.productId.img}`

                                : "/no-image.png"
                          }

                          width={130}

                          height={120}

                          alt={

                            item.title ||

                            item.productId?.name ||

                            "Product"
                          }

                          className="w-full h-full object-fit"
                        />

                      </div>

                      {/* DETAILS */}

                      <div>

                        <p className="text-sm text-primary-blue font-medium">

                          {

                            item.category ||

                            item.productId?.category ||

                            "N/A"
                          }

                        </p>

                        <h2 className="text-lg font-semibold text-[#0f172a]">

                          {

                            item.title ||

                            item.productId?.name ||

                            "Product"
                          }

                        </h2>

                        <div className="flex flex-wrap gap-5 mt-2">

                          {/* QUANTITY */}

                          <div>

                            <p className="text-xs text-gray-500">

                              Quantity

                            </p>

                            <h4 className="font-semibold mt-1 text-sm">

                              {

                                item.quantity || 1
                              }

                            </h4>

                          </div>

                          {/* PRICE */}

                          <div>

                            <p className="text-xs text-gray-500">

                              Price

                            </p>

                            <h4 className="font-semibold text-sm mt-1 text-primary-red">

                              ₹
                              {

                                item.price
                              }

                            </h4>

                          </div>

                          {/* DATE */}

                          <div>

                            <p className="text-xs text-gray-500">

                              Ordered On

                            </p>

                            <h4 className="font-semibold mt-1 text-sm">

                              {

                                new Date(
                                  order.createdAt
                                ).toLocaleDateString()
                              }

                            </h4>

                          </div>

                        </div>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="flex flex-col items-start sm:items-end justify-between gap-4 h-full">

                      {/* STATUS */}

                      <span

                        className={`px-4 py-1.5 rounded-full text-xs font-bold

${order.payment?.status ===
                            "PAID"

                            ? "bg-green-100 text-green-600"

                            : "bg-orange-100 text-orange-500"
                          }
`}
                      >

                        {

                          order.payment?.status ||

                          "Processing"
                        }

                      </span>

                      {/* BUTTON */}

                      <Link

                        href={`/user/orders/${order._id}`}
                      >

                        <button className="px-5 py-2.5 rounded-xl bg-gradient-blue-red text-white font-semibold shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300">

                          View Details

                        </button>

                      </Link>

                    </div>

                  </div>

                </div>
              )
            )
          )

        ) : (

          <div className="flex flex-col items-center justify-center py-20">

            <h2 className="text-2xl font-bold text-gray-700">

              No Orders Found

            </h2>

            <p className="text-gray-500 mt-2">

              Your orders will appear here.
            </p>

          </div>
        )}

      </div>

    </div>
  );
}