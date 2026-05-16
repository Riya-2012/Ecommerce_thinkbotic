"use client";

import { useState } from "react";

import api from "@/app/lib/axios";

import { useRouter }
from "next/navigation";

import toast from "react-hot-toast";

import Image from "next/image";

import {
  FaImage,
  FaSave,
} from "react-icons/fa";

const AdminAddLogo = () => {

  const [label, setLabel] =
    useState("LOGO");

  const [path, setPath] =
    useState("/");

  const [logo, setLogo] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const router = useRouter();

  // IMAGE CHANGE

  const handleLogoChange = (
    e
  ) => {

    const file =
      e.target.files[0];

    if (file) {

      setLogo(file);

      setPreview(
        URL.createObjectURL(
          file
        )
      );
    }
  };

  // SUBMIT

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    if (!logo) {

      toast.error(
        "Logo image is required"
      );

      return;
    }

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "label",
        label
      );

      formData.append(
        "path",
        path
      );

      formData.append(
        "img",
        logo
      );

      await api.post(

        `api/admin/navbar/logo`,

        formData,

        {
          headers: {

            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      toast.success(
        "Logo added successfully"
      );

      setLabel("LOGO");

      setPath("/");

      setLogo(null);

      router.push(
        "/admin/logo"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Something went wrong"
      );

    } finally {

      setLoading(false);
    }
  };

  return (

    <div className="max-w-3xl mx-auto">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-[#0f172a]">

          Add Website Logo

        </h1>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden"
      >

        {/* TOP */}

        {/* <div className="bg-gradient-blue-red px-8 py-10 text-white">

          <h2 className="text-2xl font-bold">

            Logo Settings

          </h2>

          <p className="text-white/80 mt-2">

            Configure navbar logo

          </p>

        </div> */}

        {/* BODY */}

        <div className="p-8 space-y-7">

          {/* LABEL */}

          <div>

            <label className="text-sm font-semibold text-gray-700">

              Label

            </label>

            <input
              type="text"
              value={label}
              disabled
              className="w-full mt-3 border border-gray-200 rounded-2xl px-5 py-4 bg-gray-100 outline-none"
            />

          </div>

          {/* PATH */}

          <div>

            <label className="text-sm font-semibold text-gray-700">

              Redirect Path

            </label>

            <input
              type="text"
              value={path}
              onChange={(e) =>
                setPath(
                  e.target.value
                )
              }
              placeholder="/"
              className="w-full mt-3 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition"
            />

          </div>

          {/* IMAGE */}

          <div>

            <label className="text-sm font-semibold text-gray-700">

              Logo Image

            </label>

            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 p-8 text-center">

              {preview ? (

                <div className="relative w-full h-[220px] rounded-2xl overflow-hidden">

                  <Image
                    src={preview}
                    alt="Logo Preview"
                    fill
                    unoptimized
                    className="object-contain"
                  />

                </div>

              ) : (

                <div>

                  <FaImage className="mx-auto text-5xl text-gray-400 mb-5" />

                  <p className="text-gray-500">

                    Upload website logo

                  </p>

                </div>

              )}

              <input
                type="file"
                accept="image/*"
                onChange={
                  handleLogoChange
                }
                className="mt-6"
                required
              />

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="border-t border-gray-100 p-6 flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-blue-red text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >

            <FaSave />

            {loading
              ? "Saving..."
              : "Save Logo"}

          </button>

        </div>

      </form>

    </div>
  );
};

export default AdminAddLogo;