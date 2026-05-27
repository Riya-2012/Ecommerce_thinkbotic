"use client";

import React,
{
  useEffect,
  useState
}
from "react";

import api
from "@/app/lib/axios";

import {

  FaEnvelope,

  FaPhoneAlt,

  FaUser,

  FaCheckCircle,

  FaClock,

}
from "react-icons/fa";

export default function AdminQueriesPage() {

  const [queries,
    setQueries] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  // FETCH QUERIES

  const fetchQueries =
    async () => {

      try {

        const res =
          await api.get(
            "api/user/contact"
          );
console.log(" contact queries",res.data);
        console.log(
          "queries",
          res.data
        );

        setQueries(
          res.data.data || []
        );

      } catch (error) {

        console.log(error);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchQueries();

  }, []);

  // UPDATE STATUS

  const handleStatusChange =
    async (id, status) => {

      try {

        await api.put(

`/api/user//contact/status/${id}`,

          { status }
        );

        // UPDATE UI

        setQueries(

          queries.map(
            (item) =>

              item._id === id

                ? {

                    ...item,

                    status,
                  }

                : item
          )
        );

      } catch (error) {

        console.log(error);
      }
    };

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center text-xl font-bold">

        Loading Queries...

      </div>
    );
  }

  return (

    <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 lg:p-8">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl sm:text-4xl font-bold text-[#0f172a]">

          Customer Queries

        </h1>

        <p className="text-gray-500 mt-2">

          Manage customer support requests

        </p>

      </div>

      {/* EMPTY */}

      {queries.length === 0 ? (

        <div className="bg-white rounded-md shadow-sm border border-gray-100 p-10 text-center">

          <h2 className="text-2xl font-bold text-gray-700">

            No Queries Found

          </h2>

        </div>

      ) : (

        <div className="grid gap-6">

          {queries.map(
            (item) => (

              <div

                key={item._id}

                className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
              >

                {/* TOP */}

                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                  {/* LEFT */}

                  <div className="flex-1">

                    {/* USER */}

                    <div className="flex items-center gap-3 mb-4">

                      <div className="w-12 h-12 rounded-full bg-gradient-blue-red text-white flex items-center justify-center">

                        <FaUser />

                      </div>

                      <div>

                        <h2 className="text-xl font-bold text-[#0f172a]">

                          {item.name}

                        </h2>

                        <p className="text-sm text-gray-500">

                          {

new Date(
item.createdAt
).toLocaleDateString()
                          }

                        </p>

                      </div>

                    </div>

                    {/* EMAIL */}

                    <div className="flex items-center gap-3 text-gray-600 mb-3">

                      <FaEnvelope className="text-primary-blue" />

                      <span>

                        {item.email}

                      </span>

                    </div>

                    {/* PHONE */}

                    <div className="flex items-center gap-3 text-gray-600 mb-5">

                      <FaPhoneAlt className="text-primary-red" />

                      <span>

                        {item.phone}

                      </span>

                    </div>

                    {/* DESCRIPTION */}

                    <div className="bg-[#f8fafc] rounded-2xl p-5 border border-gray-100">

                      <h3 className="font-semibold text-[#0f172a] mb-2">

                        Query Description

                      </h3>

                      <p className="text-gray-600 leading-relaxed">

                        {item.description}

                      </p>

                    </div>

                  </div>

                  {/* RIGHT */}

                  <div className="w-full lg:w-[240px] flex flex-col gap-4">

                    {/* STATUS */}

                    <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-4">

                      <h3 className="text-sm font-semibold text-gray-500 mb-3">

                        Query Status

                      </h3>

                      {/* BADGE */}

                      <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4 ${
                          item.status ===
                          "RESOLVED"

                            ? "bg-green-100 text-green-600"

                            : "bg-red-100 text-primary-red"
                        }`}
                      >

                        {

item.status ===
"RESOLVED"

? <FaCheckCircle />

: <FaClock />
                        }

                        {item.status}

                      </div>

                      {/* DROPDOWN */}

                      <select

                        value={item.status}

                        onChange={(e) =>
handleStatusChange(

item._id,

e.target.value
                        )
}

                        className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white outline-none focus:ring-2 focus:ring-blue-500"
                      >

                        <option value="PENDING">

                          Pending

                        </option>

                        <option value="RESOLVED">

                          Resolved

                        </option>

                      </select>

                    </div>

                    {/* QUERY ID */}

                    {/* <div className="bg-[#f8fafc] border border-gray-100 rounded-2xl p-4">

                      <p className="text-xs text-gray-500 font-semibold mb-2">

                        QUERY ID

                      </p>

                      <p className="text-sm font-medium break-all text-[#0f172a]">

                        {item._id}

                      </p>

                    </div> */}

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
  );
}