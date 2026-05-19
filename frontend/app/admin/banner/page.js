"use client";

import {
  useEffect,
  useState,
} from "react";

import api,
{
  BASE_URL
}
from "@/app/lib/axios";

import Link from "next/link";

import toast from "react-hot-toast";

import {
  FaEdit,
  FaTrash,
  FaPlus,
} from "react-icons/fa";

export default function BannerPage() {

  const [banners,
  setBanners] =
    useState([]);

  // FETCH

  const fetchBanners =
    async () => {

      try {

        const res =
          await api.get(
            "/api/admin/banner"
          );

        setBanners(
          res.data.data || []
        );

      } catch (error) {

        console.log(error);

      }
    };

  useEffect(() => {

    fetchBanners();

  }, []);

  // DELETE

  const handleDelete =
    async (id) => {

      const confirmDelete =
        window.confirm(
          "Delete banner?"
        );

      if (!confirmDelete)
        return;

      try {

        await api.delete(
          `/api/admin/banner/${id}`
        );

        toast.success(
          "Banner deleted"
        );

        fetchBanners();

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

            Banner Management

          </h1>

          <p className="text-gray-500 mt-2">

            Manage homepage banners

          </p>

        </div>

        <Link
          href="/admin/banner/add"
        >

          <button className="bg-gradient-blue-red text-white px-6 py-3 rounded-xl flex items-center gap-3 font-semibold">

            <FaPlus />

            Add Banner

          </button>

        </Link>

      </div>

      {/* GRID */}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {banners.map(
          (banner) => (

            <div
              key={banner._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
            >

              {/* IMAGE */}

              <div className="relative h-[220px]">

                <img
                  src={`${BASE_URL}/uploads/${banner.img}`}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />

              </div>

              {/* CONTENT */}

              <div className="p-5">

                <div className="flex items-center justify-between">

                  <h2 className="text-xl font-bold text-[#0f172a]">

                    {banner.title}

                  </h2>

                  <span className="bg-primary-blue/10 text-primary-blue text-xs font-semibold px-3 py-1 rounded-full">

                    {banner.type}

                  </span>

                </div>

                <p className="text-gray-500 text-sm mt-3 line-clamp-2">

                  {banner.description}

                </p>

                {/* BUTTONS */}

                <div className="flex items-center gap-3 mt-6">

                  <Link
                    href={`/admin/banner/edit/${banner._id}`}
                    className="flex-1"
                  >

                    <button className="w-full bg-primary-blue text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2">

                      <FaEdit />

                      Edit

                    </button>

                  </Link>

                  <button
                    onClick={() =>
                      handleDelete(
                        banner._id
                      )
                    }
                    className="w-14 h-14 rounded-xl bg-red-100 text-red-600 flex items-center justify-center"
                  >

                    <FaTrash />

                  </button>

                </div>

              </div>

            </div>

          )
        )}

      </div>

    </div>
  );
}
