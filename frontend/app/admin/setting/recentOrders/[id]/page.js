"use client";

import { useAuth } from "@/app/context/AuthContext";
import api, { BASE_URL } from "@/app/lib/axios";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const steps = [
  { key: "PENDING", label: "Order Confirmed" },
  { key: "SHIPPED", label: "Shipped" },
  { key: "OUT_FOR_DELIVERY", label: "Out For Delivery" },
  { key: "DELIVERED", label: "Delivered" },
];

export default function Page() {
  const params = useParams();
  const orderId = params.id;
  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/user/order/${orderId}`);
        setOrder(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && orderId) fetchOrder();
  }, [user, orderId]);

  // ✅ Handle dropdown status change
  const handleStatusChange = async (newStatus) => {
    if (newStatus === order?.status) return;
    setUpdating(true);
    try {
      const res = await api.put(`/api/admin/order/${orderId}/status`, {
        status: newStatus,
      });
      setOrder(res.data.data); // update local state with new order
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  const item = order?.items?.[0];
  const currentStep = steps.findIndex((s) => s.key === order?.status);

  if (loading) return <div className="p-10 text-center text-lg font-semibold">Loading...</div>;
  if (!order || !item) return <div className="p-10 text-center text-lg font-semibold">No Order Found</div>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="xl:col-span-2">
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">

            {/* HEADER */}
            <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-lg font-bold text-[#0f172a]">Order Details</h1>
                <p className="text-sm text-gray-500 mt-1">Order ID : {order?._id}</p>
              </div>
              <span className="px-4 py-2 rounded-full bg-green-100 text-green-600 text-xs font-bold">
                {order?.payment?.status || "PAID"}
              </span>
            </div>

            {/* PRODUCT */}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col lg:flex-row gap-6">
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
                    alt={item?.title || item?.productId?.name || "Product"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-primary-blue font-medium text-sm">
                    {item?.category || item?.productId?.category || "N/A"}
                  </p>
                  <h2 className="text-xl font-bold text-[#0f172a] mt-1">
                    {item?.title || item?.productId?.name || "Product"}
                  </h2>
                  <h3 className="text-2xl font-bold text-primary-red mt-2">₹{item?.price}</h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mt-5">
                    <div>
                      <p className="text-xs text-gray-500">Quantity</p>
                      <h4 className="font-semibold text-sm mt-1">{item?.quantity}</h4>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Color</p>
                      <h4 className="font-semibold text-sm mt-1">{item?.imageColor || "N/A"}</h4>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Payment</p>
                      <h4 className="font-semibold text-sm mt-1">{order?.payment?.status || "PAID"}</h4>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Ordered On</p>
                      <h4 className="font-semibold text-sm mt-1">
                        {new Date(order?.createdAt).toLocaleDateString()}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>

              {/* ✅ STATUS DROPDOWN */}
              <div className="mt-6 flex items-center gap-4">
                <label className="text-sm font-semibold text-gray-600">Update Status:</label>
                <select
                  value={order?.status || "PENDING"}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={updating}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm font-medium text-[#0f172a] focus:outline-none focus:ring-2 focus:ring-primary-blue disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {steps.map((s) => (
                    <option key={s.key} value={s.key}>
                      {s.label}
                    </option>
                  ))}
                </select>
                {updating && <span className="text-xs text-gray-400">Updating...</span>}
              </div>

              {/* ✅ DYNAMIC TIMELINE */}
              {/* ✅ DYNAMIC TIMELINE WITH DATES */}
              <div className="mt-8 border-t border-gray-200 pt-8">
                <div className="relative">
                  {/* VERTICAL LINE */}
                  <div className="absolute left-[8px] top-0 w-[2px] h-full bg-gray-200" />

                  <div className="space-y-8">
                    {steps.map((step, index) => {
                      const isCompleted = index <= currentStep;
                      const isActive = index === currentStep;

                      // ✅ Find the date for this step from statusHistory
                      const historyEntry = order?.statusHistory?.find(
                        (h) => h.status === step.key
                      );

                      // For PENDING use createdAt, others use statusHistory date
                      const stepDate =
                        step.key === "PENDING"
                          ? new Date(order?.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric", month: "short", year: "numeric",
                          })
                          : historyEntry
                            ? new Date(historyEntry.updatedAt).toLocaleDateString("en-IN", {
                              day: "numeric", month: "short", year: "numeric",
                            })
                            : null;

                      return (
                        <div key={step.key} className="relative flex gap-5">
                          {/* DOT */}
                          <div
                            className={`relative z-10 w-4 h-4 rounded-full flex items-center justify-center shrink-0 border-2 transition-all duration-300
                ${isCompleted
                                ? "bg-gradient-blue-red border-transparent"   
                                : "bg-white border-gray-300"                 
                              }`}
                          />

                          <div>
                            <h3
                              className={`font-bold ${isCompleted ? "text-[#0f172a]" : "text-gray-400"
                                }`}
                            >
                              {step.label}
                              {/* ✅ "In Progress" badge for current active step */}
                              {/* {isActive && (
                  <span className="ml-2 text-xs font-semibold text-white bg-primary-blue px-2 py-0.5 rounded-full">
                    In Progress
                  </span>
                )} */}
                            </h3>

                            {/* ✅ Show date if available, else show "Pending" */}
                            <p className={`text-sm mt-1 ${stepDate ? "text-gray-500" : "text-gray-300"}`}>
                              {stepDate ?? "Pending"}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* RIGHT — addresses & summary (unchanged) */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary-blue">Shipping Address</h2>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-[#0f172a]">{order?.shippingAddress?.fullName}</h3>
              <p className="text-gray-600">Phone Number : {order?.shippingAddress?.mobile}</p>
              <p className="text-gray-600 leading-relaxed">
                {order?.shippingAddress?.address}, {order?.shippingAddress?.city}, {order?.shippingAddress?.state}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-bold text-primary-blue">Billing Address</h2>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg text-[#0f172a]">{order?.billingAddress?.fullName}</h3>
              <p className="text-gray-600">Phone number : {order?.billingAddress?.mobile}</p>
              <p className="text-gray-600 leading-relaxed">
                {order?.billingAddress?.address}, {order?.billingAddress?.city}, {order?.billingAddress?.state}
              </p>
            </div>
          </div>

          <div className="bg-white border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-bold text-primary-red mb-6">Order Summary</h2>
            <div className="space-y-5">
              <div className="pt-2 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xl font-semibold text-[#0f172a]">Total</span>
                <span className="text-xl font-semibold text-primary-red">₹{order?.orderSummary?.total}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}