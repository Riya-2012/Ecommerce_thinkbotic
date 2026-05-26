"use client";

import { useAuth } from "@/app/context/AuthContext";
import api, { BASE_URL } from "@/app/lib/axios";

import Image from "next/image";
import Link from "next/link";

import { useEffect, useState } from "react";

export default function Page() {

  const { user } =
    useAuth();

  const [orders,
    setOrders] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

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

          console.log(
            "Orders:",
            data
          );

          if (
            Array.isArray(data)
          ) {

            setOrders(data);

          } else {

            setOrders([]);
          }

        } catch (err) {

          console.log(err);

          setOrders([]);

        } finally {

          setLoading(false);
        }
      };

    if (user) {

      fetchOrders();
    }

  }, [user]);

  if (loading) {

    return (

      <div className="p-10 text-center text-lg font-semibold">

        Loading...

      </div>
    );
  }

  return (

    <div className="flex flex-col gap-6 mt-6">

      {orders.length > 0 ? (

        orders.map((order, index) => {

          const item =
            order?.items?.[0];

          return (

            <div
              key={index}
              className="bg-white border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300"
            >

              {/* TOP */}

              <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50">

                {/* ORDER ID */}

                <div>

                  <p className="text-xs text-gray-500 font-medium">

                    Transaction ID

                  </p>

                  <h3 className="font-bold text-[#0f172a] mt-1">

                    {order?._id}

                  </h3>

                </div>

                {/* STATUS */}

                <div className="flex items-center gap-3 flex-wrap">

                  <span className="px-4 py-1.5 rounded-full bg-green-100 text-green-600 text-xs font-bold">

                    {
                      order?.payment?.status ||
                      "PAID"
                    }

                  </span>

                  <span className="px-4 py-1.5 rounded-full bg-primary-blue/10 text-primary-blue text-xs font-bold">

                    {
                      order?.status ||
                      "Processing"
                    }

                  </span>

                </div>

              </div>

              {/* BODY */}

              <div className="p-5 sm:p-6 flex flex-col xl:flex-row gap-6 xl:items-center xl:justify-between">

                {/* LEFT */}

                <div className="flex flex-col sm:flex-row gap-5">

                  {/* IMAGE */}

                  <div className="w-full sm:w-[140px] h-[100px] rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">

                    <Image
                      unoptimized
                      src={

item?.img

? `${BASE_URL}/${item.img}`

: item?.productId?.img

? `${BASE_URL}/${item.productId.img}`

: "/no-image.png"
                      }

                      width={100}

                      height={100}

                      alt={

item?.title ||

item?.productId?.name ||

"Product"
                      }

                      className="w-full h-full object-cover"
                    />

                  </div>

                  {/* PRODUCT INFO */}

                  <div>

                    {/* CATEGORY */}

                    <p className="text-sm text-primary-blue font-medium">

                      {

item?.category ||

item?.productId?.category ||

"N/A"
                      }

                    </p>

                    {/* TITLE */}

                    <h2 className="text-xl font-bold text-[#0f172a] mt-1">

                      {

item?.title ||

item?.productId?.name ||

"Product"
                      }

                    </h2>

                    {/* META */}

                    <div className="flex flex-wrap gap-x-8 gap-y-4 mt-5">

                      {/* QTY */}

                      <div>

                        <p className="text-xs text-gray-500">

                          Quantity

                        </p>

                        <h4 className="font-semibold mt-1">

                          {
                            item?.quantity
                          }

                        </h4>

                      </div>

                      {/* PRICE */}

                      <div>

                        <p className="text-xs text-gray-500">

                          Amount Paid

                        </p>

                        <h4 className="font-bold mt-1 text-primary-red">

                          ₹
                          {
                            item?.price
                          }

                        </h4>

                      </div>

                      {/* DATE */}

                      <div>

                        <p className="text-xs text-gray-500">

                          Transaction Date

                        </p>

                        <h4 className="font-semibold mt-1">

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

                {/* RIGHT */}

                <div className="flex flex-col sm:flex-row gap-3">

                  {/* DETAILS */}

                  <Link
                    href={`/user/payment/${order?._id}`}
                  >

                    <button className="px-5 py-2 rounded-xl bg-gradient-blue-red text-white font-semibold shadow-sm hover:shadow-md transition">

                      View Details

                    </button>

                  </Link>

                </div>

              </div>

            </div>
          );
        })

      ) : (

        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">

          <h2 className="text-2xl font-bold text-[#0f172a]">

            No Orders Found

          </h2>

          <p className="text-gray-500 mt-2">

            Start shopping to see your orders here.

          </p>

          <Link href="/products">

            <button className="mt-6 px-6 py-3 bg-gradient-blue-red text-white rounded-xl font-semibold">

              Continue Shopping

            </button>

          </Link>

        </div>
      )}

    </div>
  );
}