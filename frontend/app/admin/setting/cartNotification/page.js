"use client"
import api from '@/app/lib/axios';
import React, { useEffect, useState } from 'react'

function page() {

    const [notifications,setNotifications]=useState([]);
useEffect(() => {
    const fetchNotifications = async () => {
      try {
    
        const res = await api.get(`api/admin/cart-notifications`);
        setNotifications(res.data);
        console.log("notification",res.data)
      } catch (err) {
        console.error('Error fetching notifications:', err);
      }
    };
    
    fetchNotifications();
  }, []);
  

return (

<div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">

  {/* HEADER */}

  <div className="grid grid-cols-3 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-100 text-sm font-semibold text-gray-600">

    {/* <div>User</div> */}

    <div>Email</div>

    <div>Phone</div>

    <div>Pending Products</div>

  </div>

  {/* BODY */}

  {notifications
    .map((cart) => {

      const oldItems =
        cart.items.filter(

          (item) =>

            new Date(item.addedAt)

            <=

            new Date(

              Date.now() -

                3 *
                  24 *
                  60 *
                  60 *
                  1000
            )
        );

      if (
        oldItems.length === 0
      )
        return null;

      const email =
        cart.userId?.email ||
        "N/A";

      const phone =
        cart.userId?.phone ||
        "N/A";

      const username =
        cart.userId
          ?.username ||
        "User";

      return (

        <div
          key={cart._id}
          className="grid grid-cols-3 gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition items-start"
        >

          {/* USER */}
{/* 
          <div className="flex items-center gap-3">

            <div className="w-11 h-11 rounded-xl bg-gradient-blue-red text-white flex items-center justify-center font-bold">

               {username
               ?.charAt(0)
                ?.toUpperCase()}

             </div>

            <div>

              <h3 className="font-semibold text-[#0f172a]">

                {username}

              </h3>

              <p className="text-xs text-gray-500">

                {oldItems.length}
                {" "}
                pending items

              </p>

            </div>

          </div> */}

          {/* EMAIL */}

          <div className="text-sm text-[#0f172a] break-all">

            {email}

          </div>

          {/* PHONE */}

          <div className="text-sm text-[#0f172a]">

            {phone}

          </div>

          {/* PRODUCTS */}

          <div className="flex flex-wrap gap-2">

            {oldItems.map(
              (item) => (

                <div
                  key={item._id}
                  className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-md text-xs font-medium"
                >

                  {item.name}

                </div>

              )
            )}

          </div>

        </div>

      );
    })
    .filter(Boolean)}

</div>

)
}

export default page
