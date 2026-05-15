"use client";

import { useEffect, useState } from "react";

import Image from "next/image";

import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";

import toast from "react-hot-toast";

import api, {
  BASE_URL,
} from "@/app/lib/axios";

import {
  FaSave,
  FaImage,
  FaArrowLeft,
} from "react-icons/fa";

export default function CategoryForm({

  initialData = {},

  mode = "add",

}) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [preview, setPreview] =
    useState("");

  const {

    register,

    handleSubmit,

    reset,

    watch,

    formState: { errors },

  } = useForm({

    defaultValues: {

      category: "",

      img: "",

    },

  });

  // PREFILL EDIT DATA

  useEffect(() => {

    if (

      initialData &&

      Object.keys(initialData)
        .length > 0

    ) {

      reset({

        category:
          initialData.category,

      });

      setPreview(
        `${BASE_URL}/${initialData.img}`
      );
    }

  }, [initialData, reset]);

  // IMAGE PREVIEW

  const imageFile =
    watch("img");

  useEffect(() => {

    if (
      imageFile &&
      imageFile[0]
    ) {

      const objectUrl =
        URL.createObjectURL(
          imageFile[0]
        );

      setPreview(objectUrl);

      return () =>
        URL.revokeObjectURL(
          objectUrl
        );
    }

  }, [imageFile]);

  // SUBMIT

  const onSubmit = async (
    data
  ) => {

    try {

      setLoading(true);

      const formData =
        new FormData();

      formData.append(
        "category",

        data.category
      );

      if (
        data.img &&
        data.img[0]
      ) {

        formData.append(
          "img",

          data.img[0]
        );
      }

      // ADD CATEGORY

      if (mode === "add") {
await api.post(
  "/api/admin/landingpage/categories",
  formData,
  {
    headers: {
      "Content-Type":
        "multipart/form-data",
    },
  }
);
        toast.success(
          "Category added"
        );
      }

      // EDIT CATEGORY

      else {

        await api.put(

          `/api/admin/landingpage/category/${initialData._id}`,

          formData

        );

        toast.success(
          "Category updated"
        );
      }

      router.push(
        "/admin/category"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Something went wrong"
      );

    } finally {

      setLoading(false);

    }
  };
const [categories,
setCategories] =
useState([]);
useEffect(() => {

  const fetchCategories =
    async () => {

      try {

        const response =
          await api.get(
            "/api/comman/products"
          );

        const products =
          response.data.data || [];

        // UNIQUE CATEGORY LIST

        const uniqueCategories =
          [...new Set(

            products.map(
              (item) =>
                item.category
            )

          )];

        setCategories(
          uniqueCategories
        );

      } catch (error) {

        console.log(error);

      }
    };

  fetchCategories();

}, []);
  return (

    <div className="max-w-4xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center gap-4 mb-8">

        <button
          onClick={() =>
            router.push(
              "/admin/category"
            )
          }
          className="w-11 h-11 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center hover:bg-gray-50 transition"
        >

          <FaArrowLeft />

        </button>

        <div>

          <h1 className="text-3xl font-bold text-[#0f172a]">

            {mode === "edit"

              ? "Edit Category"

              : "Add Category"}

          </h1>

          <p className="text-gray-500 mt-1">

            Manage ecommerce categories

          </p>

        </div>

      </div>

      {/* FORM */}

      <form
        onSubmit={handleSubmit(
          onSubmit
        )}
        className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
      >

        {/* TOP */}

        {/* <div className="bg-gradient-blue-red px-8 py-10 text-white">

          <h2 className="text-3xl font-bold">

            {mode === "edit"

              ? "Update Category"

              : "Create Category"}

          </h2>

          <p className="text-white/80 mt-2">

            Upload category image and details

          </p>

        </div> */}

        {/* BODY */}

        <div className="p-8 space-y-8">

          {/* CATEGORY */}

          <div>

            <label className="text-sm font-semibold text-gray-700">

              Category Name *

            </label>

        <select

  {...register(
    "category",
    {
      required:
        "Category is required",
    }
  )}

  className="w-full mt-3 border border-gray-200 rounded-2xl px-5 py-4 outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition"

>

  <option value="">
    Select Category
  </option>

  {categories.map((item) => (

    <option
      key={item}
      value={item}
    >

      {item}

    </option>

  ))}

</select>
            {errors.category && (

              <p className="text-red-500 text-sm mt-2">

                {
                  errors.category
                    .message
                }

              </p>

            )}

          </div>

          {/* IMAGE */}

          <div>

            <label className="text-sm font-semibold text-gray-700">

              Category Image *

            </label>

            <div className="mt-4 border-2 border-dashed border-gray-300 rounded-3xl bg-gray-50 p-8 text-center">

              {preview ? (

                <div className="relative w-full h-[300px] rounded-3xl overflow-hidden">

                  <Image
                    unoptimized
                    src={preview}
                    alt="preview"
                    fill
                    className="object-cover"
                  />

                </div>

              ) : (

                <div>

                  <FaImage className="mx-auto text-5xl text-gray-400 mb-5" />

                  <p className="text-gray-500 mb-4">

                    Upload category image
                    
                    </p>
                  
                </div>

              )}
<input
  type="file"
  {...register("img", {
    required:
      mode === "add"
  })}
/>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="sticky bottom-0 bg-white border-t border-gray-100 p-6 flex justify-end">

          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-blue-red text-white font-semibold shadow-lg hover:opacity-90 transition disabled:opacity-50"
          >

            <FaSave />

            {loading

              ? "Saving..."

              : mode === "edit"

              ? "Update Category"

              : "Save Category"}

          </button>

        </div>

      </form>

    </div>
  );
}