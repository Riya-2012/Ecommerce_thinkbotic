"use client"
import { useAuth } from "@/app/context/AuthContext";
import api, { BASE_URL } from "@/app/lib/axios";
import { useRouter } from "next/navigation";

import React, { useEffect, useState } from "react";


const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
const {user}= useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get(`api/user/orders`);
        const data = await res.json();
        console.log("recentOrders",data)
        if (Array.isArray(data)) {
          setOrders(data);

        } else {
          setOrders([]);
        }
      } catch (err) {
        setOrders([]);
      }
    };
    fetchOrders();
  }, [user]);

  // const handleRowClick = (orderId, productId) => {
  //   router.push(`/admin/orderdetails/${orderId}/${productId}`);
  // };

 return (

<div className="space-y-8">

  {/* HEADER */}

  <div className="flex items-center justify-between">

    <div>

      <h1 className="text-3xl font-bold text-[#0f172a]">

        Orders Management

      </h1>

      <p className="text-gray-500 mt-1">

        Track and manage customer orders

      </p>

    </div>

    <div className="bg-primary-blue/10 text-primary-blue px-5 py-3 rounded-2xl font-semibold">

      {orders.length}
      {" "}
      Total Orders

    </div>

  </div>

  {/* EMPTY */}

  {orders.length === 0 ? (

    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-20 text-center">

      <h2 className="text-2xl font-bold text-[#0f172a]">

        No Orders Found

      </h2>

      <p className="text-gray-500 mt-2">

        Orders will appear here

      </p>

    </div>

  ) : (

    <div className="space-y-5">

      {orders.map((order) => (

        <div
          key={order._id}
          className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
        >

          {/* ORDER HEADER */}

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 bg-gray-50">

            <div>

              <h2 className="text-lg font-bold text-[#0f172a]">

                Order ID:
                {" "}
                <span className="text-primary-blue">

                  #{order._id.slice(-6)}

                </span>

              </h2>

              <p className="text-sm text-gray-500 mt-1">

                User:
                {" "}
                {order.userId}

              </p>

            </div>

            {/* STATUS */}

            <div
              className={`px-4 py-2 rounded-full text-xs font-semibold ${
                order.payment?.status ===
                "success"

                  ? "bg-green-100 text-green-600"

                  : "bg-red-100 text-red-600"
              }`}
            >

              {order.payment?.status ===
              "success"

                ? "Paid"

                : "Payment Failed"}

            </div>

          </div>

          {/* PRODUCTS */}

          <div className="divide-y divide-gray-100">

            {order.items.map(
              (item, idx) => (

                <div
                  key={
                    item.productId
                      ?._id ||
                    item.productId ||
                    idx
                  }
                  onClick={() =>
                    handleRowClick(

                      order._id,

                      item.productId
                        ?._id ||
                        item.productId
                    )
                  }
                  className="flex flex-col lg:flex-row lg:items-center gap-5 p-6 hover:bg-gray-50 transition cursor-pointer"
                >

                  {/* IMAGE */}

                  <div className="relative w-24 h-24 rounded-2xl overflow-hidden bg-gray-100 shrink-0">

                    <img
                      src={
                        item.img

                          ? `${apiUrl}/${item.img}`

                          : "/no-image.png"
                      }
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                  </div>

                  {/* DETAILS */}

                  <div className="flex-1">

                    <h3 className="text-lg font-bold text-[#0f172a]">

                      {item.name || "N/A"}

                    </h3>

                    <div className="flex items-center gap-3 mt-3">

                      <p className="text-xl font-bold text-primary-blue">

                        ₹{item.price}

                      </p>

                      <p className="text-gray-400 line-through">

                        ₹{item.oldPrice || "N/A"}

                      </p>

                    </div>

                    <div className="flex items-center gap-3 mt-4">

                      <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">

                        Qty:
                        {" "}
                        {item.quantity || 1}

                      </span>

                    </div>

                  </div>

                  {/* RIGHT SIDE */}

                  <div className="flex flex-col items-start lg:items-end gap-3">

                    {/* DATE */}

                    <div>

                      <p className="text-xs text-gray-500">

                        Order Date

                      </p>

                      <p className="text-sm font-medium text-[#0f172a]">

                        {order.deliveredAt

                          ? new Date(
                              order.deliveredAt
                            ).toLocaleDateString()

                          : new Date(
                              order.createdAt
                            ).toLocaleDateString()}
                      </p>

                    </div>

                    {/* VIEW */}

                    <button className="px-5 py-2 rounded-xl bg-gradient-blue-red text-white text-sm font-semibold hover:opacity-90 transition">

                      View Details

                    </button>

                  </div>

                </div>

              )
            )}

          </div>

        </div>

      ))}

    </div>

  )}

</div>

)
};

export default AdminOrders;