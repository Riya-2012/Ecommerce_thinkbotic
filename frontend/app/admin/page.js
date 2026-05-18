"use client";

import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
} from "react-icons/fa";

import {
  MdInventory,
} from "react-icons/md";

import api, { BASE_URL } from "../lib/axios";

import {
  useEffect,
  useState,
} from "react";

import {
  useAuth,
} from "../context/AuthContext";

export default function AdminDashboard() {

  const { user } =
    useAuth();

  // STATES

  const [
    inquiryCount,
    setInquiryCount,
  ] = useState(0);

  const [
    recentOrderCount,
    setRecentOrderCount,
  ] = useState(0);

  const [
    totalSale,
    setTotalSale,
  ] = useState(0);

  const [
    usersCount,
    setUsersCount,
  ] = useState(0);

  const [
    outOfStockCount,
    setOutOfStockCount,
  ] = useState(0);

  const [
    fewLeftCount,
    setFewLeftCount,
  ] = useState(0);

  const [
    cartNotificationCount,
    setCartNotificationCount,
  ] = useState(0);

  const [
    bulkOrderCount,
    setBulkOrderCount,
  ] = useState(0);

  const [
    customizationCount,
    setCustomizationCount,
  ] = useState(0);

  const [
    recentOrder,
    setRecentOrder,
  ] = useState([]);

  const [lowStockProduct,setLowStockProduct]=useState([]);
  const [
    products,
    setProducts,
  ] = useState([]);

  const [users, setUsers] = useState([]);

  // FETCH ALL DATA

  useEffect(() => {

    // INQUIRIES

    api
      .get(`api/admin/inquiry`)
      .then((res) => {

        const inquiries =
          Array.isArray(
            res.data
          )
            ? res.data
            : [];

        setBulkOrderCount(

          inquiries.filter(
            (i) =>
              i.isBulkOrder
          ).length
        );

        setCustomizationCount(

          inquiries.filter(
            (i) =>
              i.isCustomization
          ).length
        );
      })
      .catch(() => {

        setBulkOrderCount(0);

        setCustomizationCount(0);

      });

    // TOTAL INQUIRIES

    api
      .get(
        `api/admin/inquiry/count`
      )
      .then((res) =>

        setInquiryCount(
          res.data.count || 0
        )

      )
      .catch(() =>

        setInquiryCount(0)

      );

    // RECENT ORDERS

    api
      .get(
        `api/admin/orders/recent-count`
      )
      .then((res) => {

        setRecentOrderCount(
          res.data.count || 0
        );

        setRecentOrder(
          res.data.orders || []
        );

      })
      .catch(() => {

        setRecentOrderCount(0);

        setRecentOrder([]);

      });

    // TOTAL SALE

    api
      .get(
        `api/admin/orders/total-sale`
      )
      .then((res) =>

        setTotalSale(
          res.data.totalSale || 0
        )

      )
      .catch(() =>

        setTotalSale(0)

      );

    // USERS

    api
      .get(`api/admin/users`)
      .then((res) =>{

        const usersData =
      Array.isArray(
        res.data
      )
        ? res.data
        : [];

    setUsers(usersData);

    setUsersCount(
      usersData.length
    );
      }

       

      )
      .catch(() =>

        setUsersCount(0)

      );

    // PRODUCTS

    api
      .get(
        `api/admin/productpage`
      )
      .then((res) => {

        const products =
          Array.isArray(
            res.data
          )

            ? res.data

            : res.data.data || [];

        setProducts(products);
 setLowStockProduct( 
  products.filter(

            (p) =>

           

              p.stock <= 5

          )
 )
        setOutOfStockCount(

          products.filter(

            (p) =>

              p.stockStatus ===
              "out-of-stock" ||

              p.stock === 0

          ).length
        );

        
        setFewLeftCount(

          products.filter(

            (p) =>

              p.stockStatus ===
              "few-left" ||

              (typeof p.stock ===
                "number" &&

                p.stock < 5 &&

                p.stock > 0)

          ).length
        );
      })
      .catch(() => {

        setOutOfStockCount(0);

        setFewLeftCount(0);

      });

    // CART ALERTS

    api
      .get(
        `api/admin/cart-notifications`
      )
      .then((res) => {

        const count =
          Array.isArray(
            res.data
          )

            ? res.data.filter(

              (cart) =>

                cart.items.some(

                  (item) =>

                    new Date(
                      item.addedAt
                    )

                    <=

                    new Date(

                      Date.now() -

                      3 *
                      24 *
                      60 *
                      60 *
                      1000
                    )
                )
            ).length

            : 0;

        setCartNotificationCount(
          count
        );
      })
      .catch(() =>

        setCartNotificationCount(0)

      );

  }, [user]);

  // SUMMARY CARDS
console.log("low stock",lowStockProduct)
  const summaryCards = [

    {
      title: "Total Users",
      value: usersCount,
      icon: <FaUsers />,
      bg:
        "bg-blue-100 text-blue-600",
    },

    {
      title: "Total Sales",
      value: `₹${totalSale}`,
      icon: <FaBoxOpen />,
      bg:
        "bg-green-100 text-green-600",
    },

    {
      title: "Recent Orders",
      value: recentOrderCount,
      icon:
        <FaShoppingCart />,
      bg:
        "bg-yellow-100 text-yellow-700",
    },

  ];

  return (

    <div className="space-y-8">

      {/* HEADER */}

      <div>

        <h1 className="text-3xl font-bold text-[#0f172a]">

          Dashboard Overview

        </h1>

        <p className="text-gray-500 mt-2">



        </p>

      </div>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">

        {summaryCards.map(
          (card, i) => (

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
          )
        )}

      </div>

      {/* MIDDLE */}

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

          </div>

          <div className="p-6">

            <div className="space-y-4 w-full">

              {recentOrder.length === 0 ? (

                <div className="text-center text-gray-400">

                  No recent orders

                </div>

              ) : (

                recentOrder
                  .slice(0, 5)
                  .map((order) => (

                    <div
                      key={order._id}
                      className="flex items-center justify-between bg-gray-50 rounded-2xl p-4"
                    >

                      <div>

                        <h3 className="font-semibold text-[#0f172a]">

                          #
                          {order._id.slice(
                            -6
                          )}

                        </h3>

                        <p className="text-sm text-gray-500 mt-1">

                          {new Date(
                            order.createdAt
                          ).toLocaleDateString()}

                        </p>

                      </div>

                      <div className="text-right">

                        <h3 className="font-bold text-primary-blue">

                          ₹
                          {order.payment
                            ?.amount || 0}

                        </h3>

                        <p className="text-xs text-green-600 mt-1">

                          {order.payment
                            ?.status}

                        </p>

                      </div>

                    </div>
                  ))
              )}

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

  <div className="space-y-4">

    {lowStockProduct.length === 0 ? (

      <div className="text-center text-gray-400 py-10">

        No low stock products

      </div>

    ) : (

      lowStockProduct.map((low) => (

        <div
          key={low._id}
          className="flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition rounded-2xl p-4"
        >

          {/* LEFT */}

          <div className="flex items-center gap-4">

            {/* IMAGE */}

            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-white border border-gray-100">

              <img
                src={`${BASE_URL}/${low.img}`}
                alt={low.name}
                className="w-full h-full object-cover"
              />

            </div>

            {/* INFO */}

            <div>

              <h3 className="font-semibold text-[#0f172a]">

                {low.name}

              </h3>

              <p className="text-sm text-gray-500 mt-1">

                {low.category}

              </p>

            </div>

          </div>

          {/* RIGHT */}

          <div>

            {low.stock === 0 ? (

              <div className="bg-red-100 text-red-600 px-4 py-2 rounded-full text-xs font-semibold">

                Out of Stock

              </div>

            ) : (

              <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-xs font-semibold">

                {low.stock}
                {" "}
                Left

              </div>

            )}

          </div>

        </div>

      ))

    )}

  </div>

</div>
        </div>

      </div>

      {/* BOTTOM */}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* USERS */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-xl font-bold text-[#0f172a]">

              Users Overview

            </h2>

          </div>

          <div className="p-0">

         <div className="divide-y divide-gray-100">

  {users.length === 0 ? (

    <div className="p-10 text-center text-gray-400">

      No users found

    </div>

  ) : (

    users
      .slice(-5)
      .reverse()
      .map((user) => (

        <div
          key={user._id}
          className="px-6 py-5 flex items-center justify-between hover:bg-gray-50 transition"
        >

          {/* LEFT */}

          <div className="flex items-center gap-4">

            {/* AVATAR */}

            <div className="w-8 h-8 rounded-2xl bg-gradient-blue-red text-white flex items-center justify-center font-bold text-lg">

              {user.username
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

            {/* INFO */}

            <div>

              <h3 className="font-semibold text-[#0f172a]">

                {user.username}

              </h3>

              <p className="text-sm text-gray-500 mt-1">

                {user.email}

              </p>

            </div>

          </div>

          {/* RIGHT */}

          {/* <div className="text-right">

            <p className="text-sm text-gray-500">

              Joined

            </p>

            <p className="text-sm font-medium text-[#0f172a] mt-1">

              {new Date(
                user.createdAt
              ).toLocaleDateString()}

            </p>

          </div> */}

        </div>

      ))

  )}

</div>

          </div>

        </div>

        {/* INQUIRIES */}

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

          <div className="px-6 py-5 border-b border-gray-100">

            <h2 className="text-xl font-bold text-[#0f172a]">

              Inquiry Analytics

            </h2>

          </div>

          <div className="p-6">

            <div className="grid grid-cols-2 gap-4 w-full">

              <div className="bg-blue-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">

                  Total Inquiries

                </p>

                <h3 className="text-3xl font-bold text-blue-600 mt-2">

                  {inquiryCount}

                </h3>

              </div>

              <div className="bg-red-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">

                  Bulk Orders

                </p>

                <h3 className="text-3xl font-bold text-red-600 mt-2">

                  {bulkOrderCount}

                </h3>

              </div>

              <div className="bg-yellow-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">

                  Customization

                </p>

                <h3 className="text-3xl font-bold text-yellow-700 mt-2">

                  {customizationCount}

                </h3>

              </div>

              <div className="bg-green-50 rounded-2xl p-5">

                <p className="text-sm text-gray-500">

                  Cart Alerts

                </p>

                <h3 className="text-3xl font-bold text-green-600 mt-2">

                  {cartNotificationCount}

                </h3>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>

  );
}