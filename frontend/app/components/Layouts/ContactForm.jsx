"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { LuMessageCircleMore } from "react-icons/lu";
function ContactModal() {
  const [open, setOpen] = useState(false);

useEffect(() => {

  const hasSeenModal =
    localStorage.getItem(
      "contactModalShown"
    );

  if (!hasSeenModal) {

    const timer = setTimeout(() => {

      setOpen(true);

      localStorage.setItem(
        "contactModalShown",
        "true"
      );

    }, 5000);

    return () => clearTimeout(timer);
  }

}, []);

  return (
    <>
     
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-gradient-blue-red text-white p-3 rounded-full"
      >
        <LuMessageCircleMore  size={25}/>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">

          <div
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          ></div>

        
          <div className="relative bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-2xl z-50 animate-fadeIn">

           
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4  bg-gradient-blue-red text-white p-2 rounded-full"
            >
              <FaTimes />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-center text-primary-blue ">
              Contact Us
            </h2>

            <form className="space-y-3">

              <div>
                <label className="text-sm">Name</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-primary-blue"
                  placeholder="Enter your name" 
                />
              </div>

              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-primary-blue"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="text-sm">Phone</label>
                <input
                  type="text"
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2  focus:ring-primary-blue"
                  placeholder="Enter phone number"  
                />
              </div>
             <div>
  <label className="text-sm">Description</label>
  <textarea
    rows={4}
    placeholder="Enter description"
    className="w-full mt-1 px-3 py-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-blue"
  ></textarea>
</div>
              <button className="w-full mt-2 bg-gradient-blue-red text-white py-2 rounded-lg">
                Submit
              </button>

            </form>

          </div>
        </div>
      )}
    </>
  );
}

export default ContactModal;