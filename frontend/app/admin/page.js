"use client";

import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaRupeeSign,
} from "react-icons/fa";

import {
  MdInventory,
} from "react-icons/md";
import api from "../lib/axios";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function AdminDashboard() {

const {user}=useAuth()
 const [inquiryCount, setInquiryCount] = useState(0);
  const [recentOrderCount, setRecentOrderCount] = useState(0);
  const [totalSale, setTotalSale] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  const [fewLeftCount, setFewLeftCount] = useState(0);
  const [cartNotificationCount, setCartNotificationCount] = useState(0);
  const [bulkOrderCount, setBulkOrderCount] = useState(0);
  const [customizationCount, setCustomizationCount] = useState(0);

  const [lowStockProducts,setLowStockProducts]=useState(0);

  useEffect(() => {
    // Fetch all inquiries
    api
      .get(`api/admin/inquiry`)
      .then((res) => {
        const inquiries = Array.isArray(res.data) ? res.data : [];
        setBulkOrderCount(inquiries.filter((i) => i.isBulkOrder).length);
        setCustomizationCount(inquiries.filter((i) => i.isCustomization).length);
      })
      .catch(() => {
        setBulkOrderCount(0);
        setCustomizationCount(0);
      });

    // Fetch inquiry count
    api
      .get(`api/admin/inquiry/count`)
      .then((res) => setInquiryCount(res.data.count || 0))
      .catch(() => setInquiryCount(0));

    // Fetch recent confirmed orders count (last 7 days)
    api
      .get(`api/admin/orders/recent-count`)
      .then((res) => setRecentOrderCount(res.data.count || 0))
      .catch(() => setRecentOrderCount(0));

    // Fetch total sale
    api
      .get(`api/admin/orders/total-sale`)
      .then((res) => setTotalSale(res.data.totalSale || 0))
      .catch(() => setTotalSale(0));

    // Fetch users count
    api
      .get(`api/admin/users`)
      .then((res) => setUsersCount(Array.isArray(res.data) ? res.data.length : 0))
      .catch(() => setUsersCount(0));

    // Fetch stock data for badges
    api
      .get(`api/admin/productpage`)
      .then((res) => {
        const products = Array.isArray(res.data) ? res.data : res.data.data || [];
        setOutOfStockCount(
          products.filter(
            (p) => p.stockStatus === "out-of-stock" || p.stock === 0
          ).length
        );

        setFewLeftCount(
          products.filter(
            (p) =>
              (p.stockStatus === "few-left" || (typeof p.stock === "number" && p.stock < 5 && p.stock > 0))
          ).length
        );
     
      })
      .catch(() => {
        setOutOfStockCount(0);
        setFewLeftCount(0);
      });

    // Fetch cart notification count
    api
      .get(`api/admin/cart-notifications`)
      .then((res) => {
        // Only count carts with at least one item older than 3 days
        const count = Array.isArray(res.data)
          ? res.data.filter(cart =>
              cart.items.some(item => new Date(item.addedAt) <= new Date(Date.now() -3 * 24 * 60 * 60 * 1000))
            ).length
          : 0;
        setCartNotificationCount(count);
      })
      .catch(() => setCartNotificationCount(0));
  }, [user]);







       const summaryCards = [

    {
      title: "Total Users",
      value: usersCount,
      icon: <FaUsers />,
      bg: "bg-blue-100 text-blue-600",
    },

    {
      title: "Total Sales",
      value: `₹${totalSale}` ,
      icon: <FaBoxOpen />,
      bg: "bg-green-100 text-green-600",
    },

    {
      title: "Recent Orders",
      value: recentOrderCount,
      icon: <FaShoppingCart />,
      bg: "bg-yellow-100 text-yellow-700",
    },

    // {
    //   title: "Cart Notification",
    //   value: "₹0",
    //   icon: <FaRupeeSign />,
    //   bg: "bg-red-100 text-red-600",
    // },

  ];
  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-[#0f172a]">

          Dashboard overview

        </h1>
{/* 
        <p className="text-gray-500 mt-1">

   

        </p> */}

      </div>

      {/* SUMMARY CARDS */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {summaryCards.map((card, i) => (

          <div
            key={i}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition"
          >

            <div className="flex items-center justify-between">

              <div>

                <p className="text-sm text-gray-500">

                  {card.title}

                </p>

                <h2 className="text-3xl font-bold text-[#0f172a] mt-3">

                 {card.value}

                </h2>

              </div>

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${card.bg}`}
              >

                {card.icon}

              </div>

            </div>

          </div>

        ))}

      </div>

      {/* MIDDLE SECTION */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* RECENT ORDERS */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

            <div>

              <h2 className="text-xl font-bold text-[#0f172a]">

                Recent Orders

              </h2>

              <p className="text-sm text-gray-500 mt-1">

                Latest customer purchases

              </p>

            </div>

            <button className="text-primary-blue font-semibold text-sm">

              View All

            </button>

          </div>

          <div className="p-6">

            <div className="flex items-center justify-center h-[250px] text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">

              Orders will appear here
              <div>
                orders
              </div>

            </div>

          </div>

        </div>

        {/* LOW STOCK */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

            <div>

              <h2 className="text-xl font-bold text-[#0f172a]">

                Low Stock Products

              </h2>

              <p className="text-sm text-gray-500 mt-1">

                Products running out of stock

              </p>

            </div>

            <div className="w-11 h-11 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center text-xl">

              <MdInventory />

            </div>

          </div>

          <div className="p-6">

            <div className="flex items-center justify-center h-[250px] text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">

              Low stock products will appear here

            </div>

          </div>

        </div>

      </div>

      {/* BOTTOM SECTION */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* RECENT USERS */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

            <div>

              <h2 className="text-xl font-bold text-[#0f172a]">

                Recent Users

              </h2>

              <p className="text-sm text-gray-500 mt-1">

                Newly registered users

              </p>

            </div>

            <button className="text-primary-blue font-semibold text-sm">

              View All

            </button>

          </div>

          <div className="p-6">

            <div className="flex items-center justify-center h-[220px] text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">

              Recent users will appear here

            </div>

          </div>

        </div>

        {/* INQUIRIES */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">

            <div>

              <h2 className="text-xl font-bold text-[#0f172a]">

                Pending Inquiries

              </h2>

              <p className="text-sm text-gray-500 mt-1">

                Customer requests and enquiries

              </p>

            </div>

            <button className="text-primary-blue font-semibold text-sm">

              View All

            </button>

          </div>

          <div className="p-6">

            <div className="flex items-center justify-center h-[220px] text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">

              Inquiries will appear here

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}