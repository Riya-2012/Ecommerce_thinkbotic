"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import api from "@/app/lib/axios";

import toast from "react-hot-toast";

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaPhone,
} from "react-icons/fa";

import {
  IoMail,
} from "react-icons/io5";

export default function FooterPage() {

  const [footer,
  setFooter] =
    useState(null);

  // FETCH

  const fetchFooter =
    async () => {

      try {

        const res =
          await api.get(
            "/api/admin/landingpage/footer"
          );

        setFooter(
          res.data.data
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchFooter();

  }, []);

  // DELETE

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete footer?"
        );

      if (!confirmDelete)
        return;

      try {

        await api.delete(

          `/api/admin/landingpage/footer/${id}`

        );

        toast.success(
          "Footer deleted"
        );

        setFooter(null);

      } catch (error) {

        toast.error(
          "Delete failed"
        );

      }
    };

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <h1 className="text-3xl font-bold text-[#0f172a]">

            Footer Management

          </h1>

          <p className="text-gray-500 mt-2">

            Manage footer details dynamically

          </p>

        </div>

        {!footer && (

          <Link
            href="/admin/footer/add"
          >

            <button className="bg-gradient-blue-red text-white px-6 py-3 rounded-xl flex items-center gap-3 font-semibold">

              <FaPlus />

              Add Footer

            </button>

          </Link>

        )}

      </div>

      {/* FOOTER CARD */}

      {footer ? (

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">

          {/* TOP */}

          <div className="flex items-start justify-between gap-6 flex-wrap">

            <div>

              <h2 className="text-2xl font-bold text-[#0f172a]">

                Company Footer

              </h2>

              <p className="text-gray-500 mt-3 max-w-2xl leading-7">

                {
                  footer.companyDescription
                }

              </p>

            </div>

            {/* ACTIONS */}

            <div className="flex items-center gap-3">

              <Link
                href={`/admin/footer/edit/${footer._id}`}
              >
                <button className="bg-primary-blue text-white px-5 py-3 rounded-xl flex items-center gap-2 font-medium">
                  <FaEdit />
                  Edit
                </button>

              </Link>

              <button
                onClick={() =>
                  handleDelete(
                    footer._id
                  )
                }
                className="bg-red-100 text-red-600 px-5 py-3 rounded-xl flex items-center gap-2 font-medium"
              >

                <FaTrash />

                Delete

              </button>

            </div>

          </div>

          {/* CONTACT */}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">

            <div className="bg-[#f8fafc] rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <FaPhone className="text-primary-blue text-xl" />

                <div>

                  <p className="text-sm text-gray-500">
                    Phone
                  </p>

                  <h3 className="font-semibold text-[#0f172a]">

                    {footer.phone}

                  </h3>

                </div>

              </div>

            </div>

            <div className="bg-[#f8fafc] rounded-2xl p-5">

              <div className="flex items-center gap-3">

                <IoMail className="text-primary-blue text-xl" />

                <div>

                  <p className="text-sm text-gray-500">

                    Email

                  </p>

                  <h3 className="font-semibold text-[#0f172a]">

                    {footer.email}

                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* ADDRESS */}

          <div className="bg-[#f8fafc] rounded-2xl p-5 mt-6">

            <p className="text-sm text-gray-500 mb-2">

              Address

            </p>

            <h3 className="font-medium text-[#0f172a] leading-7">

              {footer.address}

            </h3>

          </div>

          {/* QUICK LINKS */}

          <div className="mt-10">

            <h3 className="text-xl font-bold text-[#0f172a] mb-5">

              Quick Links

            </h3>

            <div className="flex flex-wrap gap-3">

              {footer.quickLinks?.map(
                (item, i) => (

                  <div
                    key={i}
                    className="bg-primary-blue/10 text-primary-blue px-4 py-2 rounded-full text-sm font-medium"
                  >

                    {item.label}

                  </div>

                )
              )}

            </div>

          </div>

          {/* SOCIALS */}

          <div className="mt-10">

            <h3 className="text-xl font-bold text-[#0f172a] mb-5">

              Social Links

            </h3>

            <div className="flex flex-wrap gap-3">

              {footer.socials?.map(
                (item, i) => (

                  <div
                    key={i}
                    className="bg-red-100 text-primary-red px-4 py-2 rounded-full text-sm font-medium"
                  >
                    {item.platform}
                  </div>

                )
              )}

            </div>

          </div>

        </div>

      ) : (

        <div className="bg-white rounded-3xl border border-dashed border-gray-300 p-20 text-center">

          <h2 className="text-2xl font-bold text-[#0f172a]">

            No Footer Found

          </h2>

          <p className="text-gray-500 mt-3">

            Create footer content for website

          </p>

        </div>

      )}

    </div>
  );
}