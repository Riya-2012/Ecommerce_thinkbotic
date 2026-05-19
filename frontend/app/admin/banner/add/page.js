"use client";

import { useState } from "react";

import api from "@/app/lib/axios";

import toast from "react-hot-toast";

import {
  FaImage,
} from "react-icons/fa";

import {
  useRouter,
} from "next/navigation";

export default function AdminBannerPage() {

  const router =
    useRouter();

  const [loading,
  setLoading] =
    useState(false);

  const [preview,
  setPreview] =
    useState("");

  const [formData,
  setFormData] =
    useState({

      type: "main",

      title: "",

      subtitle: "",

      description: "",

      buttonText:
        "Shop Now",

      buttonLink:
        "/products",

      priceText: "",

      img: null,

    });

  // HANDLE INPUT

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setFormData({

        ...formData,

        [name]: value,

      });
    };

  // HANDLE IMAGE

  const handleImage =
    (e) => {

      const file =
        e.target.files[0];

      if (!file) return;

      setFormData({

        ...formData,

        img: file,

      });

      setPreview(
        URL.createObjectURL(
          file
        )
      );
    };

  // SUBMIT

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const data =
          new FormData();

        Object.keys(
          formData
        ).forEach((key) => {

          data.append(
            key,
            formData[key]
          );
        });

        const res =
          await api.post(

            "/api/admin/banner",

            data,

            {
              headers: {

                "Content-Type":
                  "multipart/form-data",
              },
            }
          );

        toast.success(
          "Banner added successfully"
        );

        router.push(
          "/admin/banner"
        );

      } catch (error) {

        console.log(error);

        toast.error(
          "Failed to add banner"
        );

      } finally {

        setLoading(false);

      }
    };

  return (

    <div className="p-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-[#0f172a]">

          Add Banner

        </h1>

        <p className="text-gray-500 mt-2">

          Create homepage banners dynamically

        </p>

      </div>

      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
        className="bg-white border border-gray-100 rounded-3xl shadow-sm p-8"
      >

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT */}

          <div className="space-y-6">

            {/* TYPE */}

            <div>

              <label className="text-sm font-medium text-gray-700">

                Banner Type

              </label>

              <select
                name="type"
                value={
                  formData.type
                }
                onChange={
                  handleChange
                }
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-blue"
              >

                <option value="main">

                  Main Banner

                </option>

                <option value="side">

                  Side Banner

                </option>
                  <option value="trbanner">

                  trbanner

                </option>

              </select>

            </div>

            {/* TITLE */}

            <div>

              <label className="text-sm font-medium text-gray-700">

                Title

              </label>

              <input
                type="text"
                name="title"
                value={
                  formData.title
                }
                onChange={
                  handleChange
                }
                placeholder="Enter banner title"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-blue"
              />

            </div>

            {/* SUBTITLE */}

            <div>

              <label className="text-sm font-medium text-gray-700">

                Subtitle

              </label>

              <input
                type="text"
                name="subtitle"
                value={
                  formData.subtitle
                }
                onChange={
                  handleChange
                }
                placeholder="Enter subtitle"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-blue"
              />

            </div>

            {/* DESCRIPTION */}

            <div>

              <label className="text-sm font-medium text-gray-700">

                Description

              </label>

              <textarea
                rows={5}
                name="description"
                value={
                  formData.description
                }
                onChange={
                  handleChange
                }
                placeholder="Enter description"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-primary-blue"
              />

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-6">

            {/* BUTTON TEXT */}

            <div>

              <label className="text-sm font-medium text-gray-700">

                Button Text

              </label>

              <input
                type="text"
                name="buttonText"
                value={
                  formData.buttonText
                }
                onChange={
                  handleChange
                }
                placeholder="Shop Now"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-blue"
              />

            </div>

            {/* BUTTON LINK */}

            <div>

              <label className="text-sm font-medium text-gray-700">

                Button Link

              </label>

              <input
                type="text"
                name="buttonLink"
                value={
                  formData.buttonLink
                }
                onChange={
                  handleChange
                }
                placeholder="/products"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-blue"
              />

            </div>

            {/* PRICE */}

            <div>

              <label className="text-sm font-medium text-gray-700">

                Price Text

              </label>

              <input
                type="text"
                name="priceText"
                value={
                  formData.priceText
                }
                onChange={
                  handleChange
                }
                placeholder="Starting ₹999"
                className="w-full mt-2 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary-blue"
              />

            </div>

            {/* IMAGE */}

            <div>

              <label className="text-sm font-medium text-gray-700">

                Banner Image

              </label>

              <label className="mt-2 border-2 border-dashed border-gray-300 rounded-2xl h-[240px] flex flex-col items-center justify-center cursor-pointer hover:border-primary-blue transition overflow-hidden">

                {preview ? (

                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />

                ) : (

                  <div className="flex flex-col items-center">

                    <FaImage
                      size={40}
                      className="text-gray-400"
                    />

                    <p className="text-gray-500 mt-3">

                      Upload Banner Image

                    </p>

                  </div>

                )}

                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={
                    handleImage
                  }
                />

              </label>

            </div>

          </div>

        </div>

        {/* SUBMIT */}

        <div className="mt-10 flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="bg-gradient-blue-red text-white px-8 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >

            {loading

              ? "Adding..."

              : "Add Banner"}

          </button>

        </div>

      </form>

    </div>
  );
}