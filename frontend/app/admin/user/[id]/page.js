"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import api from "@/app/lib/axios";

import toast from "react-hot-toast";

import {

  FaUserShield,
  FaArrowLeft,
  FaUserEdit,

} from "react-icons/fa";

export default function Page() {

  const { id } = useParams();

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [updating, setUpdating] =
    useState(false);

  const [formData, setFormData] =
    useState({

      username: "",

      email: "",

      phone: "",

      firstname: "",

      lastname: "",

      gender: "",

      isAdmin: false,

    });

  // FETCH USER

  const fetchUser = async () => {

    try {

      const response =
        await api.get(
          `/api/admin/users/${id}`
        );

      setFormData(response.data.msg);
      console.log("user update", response.data);

    } catch (error) {

      console.log(error);

      toast.error(
        "Failed to fetch user"
      );

    } finally {

      setLoading(false);

    }
  };

  // HANDLE INPUT

  const handleChange = (e) => {

    const {
      name,
      value,
      type,
      checked
    } = e.target;

    setFormData((prev) => ({

      ...prev,

      [name]:
        type === "checkbox"
          ? checked
          : value,

    }));
  };

  // UPDATE USER

  const handleSubmit = async (
    e
  ) => {

    e.preventDefault();

    try {

      setUpdating(true);

      await api.put(

        `/api/admin/users/update/${id}`,

        formData

      );

      toast.success(
        "User updated successfully"
      );

      router.push(
        "/admin/user"
      );

    } catch (error) {

      console.log(error);

      toast.error(
        "Update failed"
      );

    } finally {

      setUpdating(false);

    }
  };

  useEffect(() => {

    fetchUser();

  }, []);

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center">

        <div className="text-lg font-semibold text-gray-600">

          Loading user...

        </div>

      </div>

    );
  }

  return (

    <div className="max-w-5xl mx-auto">

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                router.push(
                  "/admin/user"
                )
              }
              className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition"
            >

              <FaArrowLeft />

            </button>

            <div>

              <h1 className="text-3xl font-bold text-[#0f172a]">

                Edit User

              </h1>

              <p className="text-gray-500 mt-1">

                Update user details and permissions

              </p>

            </div>

          </div>

        </div>

      </div>

      {/* CARD */}

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">

        {/* TOP PROFILE */}

        {/* <div className="bg-gradient-blue-red px-8 py-10 text-white">

          <div className="flex flex-col md:flex-row md:items-center gap-6">



            <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-4xl font-bold border-4 border-white/30 shadow-lg">

              {formData?.username
                ?.charAt(0)
                ?.toUpperCase()}

            </div>

        

            <div>

              <h2 className="text-3xl font-bold">

                {formData.username}

              </h2>

              <p className="text-white/80 mt-1">

                {formData.email}

              </p>

              <div className="mt-4 flex items-center gap-3">

                {formData.isAdmin ? (

                  <span className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-primary-red text-sm font-semibold">

                    <FaUserShield />

                    Administrator

                  </span>

                ) : (

                  <span className="px-4 py-2 rounded-full bg-white/20 text-sm font-medium">

                    Customer Account

                  </span>

                )}

              </div>

            </div>

          </div>

        </div> */}

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="p-8"
        >

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* USERNAME */}

            <div>

              <label className="text-sm font-semibold text-gray-700">

                Username

              </label>

              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition"
              />

            </div>

            {/* EMAIL */}

            <div>

              <label className="text-sm font-semibold text-gray-700">

                Email Address

              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition"
              />

            </div>

            {/* PHONE */}

            <div>

              <label className="text-sm font-semibold text-gray-700">

                Phone Number

              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition"
              />

            </div>

            {/* FIRST NAME */}

            <div>

              <label className="text-sm font-semibold text-gray-700">

                First Name

              </label>

              <input
                type="text"
                name="firstname"
                value={formData.firstname}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition"
              />

            </div>

            {/* LAST NAME */}

            <div>

              <label className="text-sm font-semibold text-gray-700">

                Last Name

              </label>

              <input
                type="text"
                name="lastname"
                value={formData.lastname}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition"
              />

            </div>

            {/* GENDER */}

            <div>

              <label className="text-sm font-semibold text-gray-700">

                Gender

              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-200 rounded-2xl px-4 py-3 outline-none focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 transition"
              >

                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>

              </select>

            </div>

          </div>

          {/* ADMIN ACCESS */}

          {/* <div className="mt-8 bg-gray-50 border border-gray-200 rounded-2xl p-5">

            <div className="flex items-center justify-between gap-4">

              <div>

                <h3 className="font-bold text-[#0f172a] text-lg">

                  Admin Access

                </h3>

                <p className="text-sm text-gray-500 mt-1">

                  Grant this user full administrative permissions.

                </p>

              </div>

              <label className="relative inline-flex items-center cursor-pointer">

                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleChange}
                  className="sr-only peer"
                />

                <div className="w-14 h-7 bg-gray-300 rounded-full peer peer-checked:bg-primary-blue transition-all"></div>

                <div className="absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-all peer-checked:translate-x-7"></div>

              </label>

            </div>

          </div> */}

          {/* BUTTONS */}

          <div className="flex flex-col sm:flex-row gap-4 mt-10">

            <button
              type="submit"
              disabled={updating}
              className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-blue-red text-white font-semibold shadow-md hover:opacity-90 transition disabled:opacity-50"
            >

              <FaUserEdit />

              {updating
                ? "Updating..."
                : "Save Changes"}

            </button>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/users"
                )
              }
              className="px-8 py-4 rounded-2xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
            >

              Cancel

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}